/**
 * Nurturing Agent
 *
 * Automated lead nurturing system that sends email/SMS sequences
 * to leads with weak online presence (identified by verifier agent).
 *
 * Flow:
 * 1. Triggered when contact is enriched (CONTACT_ENRICHED event)
 * 2. Enrolls lead in active nurturing sequence
 * 3. Sends instant welcome message (email + SMS)
 * 4. Schedules 24-hour follow-up
 * 5. Schedules 48-hour engagement check
 * 6. Tags leads based on engagement (engaged, cold, interested)
 * 7. Re-engages cold leads
 */

import { storage } from "../../storage";
import { eventBus } from "../../eventBus";
import { sendEmail, processEmailTemplate, emailTemplates, generateTrackingPixel, wrapLinksForTracking, isEmailConfigured } from "../../services/emailService";
import { sendSMS, processSMSTemplate, smsTemplates, isSMSConfigured } from "../../services/smsService";
import {
  generatePersonalizedContent,
  isAppropriateTime,
  getOptimalSendTime,
  detectReplyIntent,
} from "../../services/aiPersonalizationService";
import { generateSampleSite } from "../../services/sampleSiteGenerator";

interface NurturingContext {
  leadId: string;
  businessId: string;
  contactId?: string;
  businessName: string;
  contactName: string;
  contactEmail?: string;
  contactPhone?: string;
  // Enhanced context for AI personalization
  contactRole?: string;
  industry?: string;
  city?: string;
  // Online presence data from verifier agent
  hasWebsite: boolean;
  websiteQuality?: string;
  hasYelp: boolean;
  yelpRating?: number;
  yelpReviewCount?: number;
  hasGoogleBusiness: boolean;
  googleRating?: number;
  hasSocialMedia: boolean;
  socialPlatforms?: string[];
  onlinePresenceStrength: string;
  // Sample site info
  sampleSiteUrl?: string;
  sampleSiteQrCodeDataUrl?: string;
}

// Default sequence configuration (if no active sequence exists)
const DEFAULT_SEQUENCE_STEPS = [
  { name: "Welcome Message", channel: "both", delayMinutes: 0 },
  { name: "24-Hour Follow-up", channel: "both", delayMinutes: 1440 }, // 24 hours
  { name: "48-Hour Engagement Check", channel: "email", delayMinutes: 2880, isEngagementCheck: true }, // 48 hours
  { name: "Re-engagement (if cold)", channel: "email", delayMinutes: 10080 }, // 7 days
];

/**
 * Enroll a lead in a nurturing sequence
 */
export async function enrollLeadInNurturing(
  agentId: string,
  context: NurturingContext
): Promise<void> {
  const { leadId, businessId, contactId, businessName, contactName, contactEmail, contactPhone } = context;

  // Check if lead is already enrolled in an active sequence
  const existingEnrollments = await storage.getEnrollmentsByLead(leadId);
  const activeEnrollment = existingEnrollments.find(e => e.status === "active");

  if (activeEnrollment) {
    console.log(`[NurturerAgent] Lead ${leadId} already enrolled in sequence ${activeEnrollment.sequenceId}`);
    return;
  }

  // Find active nurturing sequence triggered by CONTACT_ENRICHED
  let sequences = await storage.getNurturingSequenceByTrigger("CONTACT_ENRICHED");

  if (sequences.length === 0) {
    // Create default sequence if none exists
    sequences = [await createDefaultNurturingSequence()];
  }

  const sequence = sequences[0];
  const steps = await storage.getStepsBySequence(sequence.id);

  if (steps.length === 0) {
    console.log(`[NurturerAgent] No steps in sequence ${sequence.id}`);
    return;
  }

  // Create enrollment
  const enrollment = await storage.createEnrollment({
    leadId,
    sequenceId: sequence.id,
    currentStepId: steps[0].id,
    status: "active",
  });

  // Log enrollment
  await storage.createActivityLog({
    actorType: "agent",
    actorId: agentId,
    leadId,
    action: "nurturing_enrolled",
    metadata: {
      sequenceName: sequence.name,
      enrollmentId: enrollment.id,
    },
  });

  // Publish enrollment event
  await eventBus.publish("NURTURING_ENROLLED", {
    lead_id: leadId,
    sequence_id: sequence.id,
    enrollment_id: enrollment.id,
  }, { sourceAgent: agentId });

  // Process all steps and schedule messages
  await scheduleSequenceMessages(agentId, enrollment.id, context, steps);

  // Send first message immediately if delay is 0
  const firstStep = steps[0];
  if (firstStep.delayMinutes === 0) {
    await processScheduledMessages(agentId);
  }
}

/**
 * Schedule all messages for a sequence with AI personalization and smart timing
 */
async function scheduleSequenceMessages(
  agentId: string,
  enrollmentId: string,
  context: NurturingContext,
  steps: Awaited<ReturnType<typeof storage.getStepsBySequence>>
): Promise<void> {
  // Use smart timing - start at optimal time for Hawaii businesses
  const baseTime = getOptimalSendTime();
  let cumulativeDelay = 0;

  for (const step of steps) {
    cumulativeDelay += step.delayMinutes;
    let scheduledFor = new Date(baseTime.getTime() + cumulativeDelay * 60 * 1000);

    // Apply smart timing adjustment - ensure messages land during business hours
    scheduledFor = adjustForBusinessHours(scheduledFor);

    // Determine message type for AI personalization
    const messageType = getMessageType(step.name);

    // Generate AI-personalized content (include sample site for welcome and follow-up messages)
    const includeSampleSite = messageType === "welcome" || messageType === "followUp24h";
    const personalizedContent = await generatePersonalizedContent({
      businessName: context.businessName,
      contactName: context.contactName,
      contactRole: context.contactRole,
      industry: context.industry,
      city: context.city,
      hasWebsite: context.hasWebsite,
      websiteQuality: context.websiteQuality,
      hasYelp: context.hasYelp,
      yelpRating: context.yelpRating,
      yelpReviewCount: context.yelpReviewCount,
      hasGoogleBusiness: context.hasGoogleBusiness,
      googleRating: context.googleRating,
      hasSocialMedia: context.hasSocialMedia,
      socialPlatforms: context.socialPlatforms,
      onlinePresenceStrength: context.onlinePresenceStrength,
      messageType,
      // Include sample site info for welcome and first follow-up
      sampleSiteUrl: includeSampleSite ? context.sampleSiteUrl : undefined,
      sampleSiteQrCodeDataUrl: includeSampleSite ? context.sampleSiteQrCodeDataUrl : undefined,
    });

    // Schedule email if channel includes email (pending approval)
    if ((step.channel === "email" || step.channel === "both") && context.contactEmail) {
      const emailBody = step.emailBody || personalizedContent.emailBody || getDefaultEmailBody(step.name, context);
      const emailSubject = step.emailSubject || personalizedContent.emailSubject || getDefaultEmailSubject(step.name, context);

      const emailMessage = await storage.createScheduledMessage({
        enrollmentId,
        stepId: step.id,
        leadId: context.leadId,
        contactId: context.contactId,
        channel: "email",
        scheduledFor,
        body: emailBody,
        subject: emailSubject,
        status: "pending_approval", // Requires approval before sending
        approvalStatus: "pending",
        originalBody: emailBody, // Store original for comparison after edits
        originalSubject: emailSubject,
      });

      // Add to approval queue
      await storage.createApprovalQueueItem({
        itemType: "scheduled_message",
        itemId: emailMessage.id,
        leadId: context.leadId,
        businessName: context.businessName,
        previewTitle: `Email: ${emailSubject}`,
        previewContent: emailBody.substring(0, 200) + "...",
        status: "pending",
        priority: step.delayMinutes === 0 ? 2 : 0, // Immediate messages are higher priority
      });
    }

    // Schedule SMS if channel includes sms (pending approval)
    if ((step.channel === "sms" || step.channel === "both") && context.contactPhone) {
      const smsBody = step.smsBody || personalizedContent.smsBody || getDefaultSMSBody(step.name, context);

      const smsMessage = await storage.createScheduledMessage({
        enrollmentId,
        stepId: step.id,
        leadId: context.leadId,
        contactId: context.contactId,
        channel: "sms",
        scheduledFor,
        body: smsBody,
        status: "pending_approval", // Requires approval before sending
        approvalStatus: "pending",
        originalBody: smsBody,
      });

      // Add to approval queue
      await storage.createApprovalQueueItem({
        itemType: "scheduled_message",
        itemId: smsMessage.id,
        leadId: context.leadId,
        businessName: context.businessName,
        previewTitle: `SMS to ${context.businessName}`,
        previewContent: smsBody,
        status: "pending",
        priority: step.delayMinutes === 0 ? 2 : 0,
      });
    }
  }
}

/**
 * Determine message type from step name for AI personalization
 */
function getMessageType(stepName: string): "welcome" | "followUp24h" | "followUp48h" | "reEngagement" {
  const name = stepName.toLowerCase();
  if (name.includes("welcome") || name.includes("first")) return "welcome";
  if (name.includes("24") || name.includes("first follow")) return "followUp24h";
  if (name.includes("48") || name.includes("engagement")) return "followUp48h";
  if (name.includes("re-engage") || name.includes("cold") || name.includes("7 day")) return "reEngagement";
  return "welcome";
}

/**
 * Adjust scheduled time to fall within Hawaii business hours (9 AM - 6 PM HST)
 */
function adjustForBusinessHours(scheduledTime: Date): Date {
  const hawaiiOffset = -10 * 60; // HST offset in minutes
  const utcMinutes = scheduledTime.getUTCHours() * 60 + scheduledTime.getUTCMinutes();
  const hawaiiMinutes = ((utcMinutes + hawaiiOffset) % 1440 + 1440) % 1440;
  const hawaiiHour = Math.floor(hawaiiMinutes / 60);

  // If outside business hours, adjust to next available slot
  if (hawaiiHour < 9) {
    // Before 9 AM - push to 9 AM same day
    const adjustment = (9 * 60 - hawaiiMinutes) * 60 * 1000;
    return new Date(scheduledTime.getTime() + adjustment);
  } else if (hawaiiHour >= 18) {
    // After 6 PM - push to 9 AM next day
    const minutesToMidnight = 1440 - hawaiiMinutes;
    const minutesTo9AM = minutesToMidnight + 9 * 60;
    return new Date(scheduledTime.getTime() + minutesTo9AM * 60 * 1000);
  }

  return scheduledTime;
}

/**
 * Get default email body based on step name
 */
function getDefaultEmailBody(stepName: string, context: NurturingContext): string {
  const variables = {
    businessName: context.businessName,
    contactName: context.contactName,
    bookingLink: process.env.BOOKING_LINK || "https://calendly.com/edifylimited",
    senderName: process.env.SENDER_NAME || "The Edify Team",
  };

  if (stepName.toLowerCase().includes("welcome")) {
    return processEmailTemplate(emailTemplates.welcome.body, variables);
  } else if (stepName.toLowerCase().includes("24")) {
    return processEmailTemplate(emailTemplates.followUp24h.body, variables);
  } else if (stepName.toLowerCase().includes("48") || stepName.toLowerCase().includes("engagement")) {
    return processEmailTemplate(emailTemplates.followUp48h.body, variables);
  } else if (stepName.toLowerCase().includes("re-engage") || stepName.toLowerCase().includes("cold")) {
    return processEmailTemplate(emailTemplates.reEngagement.body, variables);
  }
  return processEmailTemplate(emailTemplates.welcome.body, variables);
}

/**
 * Get default email subject based on step name
 */
function getDefaultEmailSubject(stepName: string, context: NurturingContext): string {
  const variables = { businessName: context.businessName };

  if (stepName.toLowerCase().includes("welcome")) {
    return processEmailTemplate(emailTemplates.welcome.subject, variables);
  } else if (stepName.toLowerCase().includes("24")) {
    return processEmailTemplate(emailTemplates.followUp24h.subject, variables);
  } else if (stepName.toLowerCase().includes("48") || stepName.toLowerCase().includes("engagement")) {
    return processEmailTemplate(emailTemplates.followUp48h.subject, variables);
  } else if (stepName.toLowerCase().includes("re-engage") || stepName.toLowerCase().includes("cold")) {
    return processEmailTemplate(emailTemplates.reEngagement.subject, variables);
  }
  return processEmailTemplate(emailTemplates.welcome.subject, variables);
}

/**
 * Get default SMS body based on step name
 */
function getDefaultSMSBody(stepName: string, context: NurturingContext): string {
  const variables = {
    businessName: context.businessName,
    contactName: context.contactName,
    shortLink: process.env.SHORT_LINK || "edify.link/consult",
    phoneNumber: process.env.COMPANY_PHONE || "808-555-0123",
  };

  if (stepName.toLowerCase().includes("welcome")) {
    return processSMSTemplate(smsTemplates.welcome, variables);
  } else if (stepName.toLowerCase().includes("24")) {
    return processSMSTemplate(smsTemplates.followUp24h, variables);
  } else if (stepName.toLowerCase().includes("48") || stepName.toLowerCase().includes("engagement")) {
    return processSMSTemplate(smsTemplates.followUp48h, variables);
  } else if (stepName.toLowerCase().includes("re-engage") || stepName.toLowerCase().includes("cold")) {
    return processSMSTemplate(smsTemplates.reEngagement, variables);
  }
  return processSMSTemplate(smsTemplates.welcome, variables);
}

/**
 * Process and send scheduled messages that are due
 */
export async function processScheduledMessages(agentId: string): Promise<number> {
  const pendingMessages = await storage.getPendingScheduledMessages();
  let sentCount = 0;

  for (const message of pendingMessages) {
    try {
      // Get enrollment and check if still active
      const enrollment = await storage.getEnrollment(message.enrollmentId);
      if (!enrollment || enrollment.status !== "active") {
        await storage.updateScheduledMessage(message.id, { status: "cancelled" });
        continue;
      }

      // Check if this is an engagement check step
      const step = await storage.getNurturingStep(message.stepId);
      if (step?.isEngagementCheck) {
        // Check lead engagement before sending
        const engagements = await storage.getEngagementsByLead(message.leadId);
        const hasEngagement = engagements.length > 0;

        if (hasEngagement) {
          // Lead has engaged - tag as interested and complete sequence
          await storage.createLeadNurturingTag({
            leadId: message.leadId,
            tag: "interested",
            source: "engagement_check",
          });

          await storage.updateEnrollment(enrollment.id, {
            status: "completed",
            completedAt: new Date(),
          });

          await storage.updateScheduledMessage(message.id, { status: "cancelled" });

          // Update lead status to contacted
          await storage.updateLead(message.leadId, { status: "contacted" });

          await eventBus.publish("LEAD_TAGGED", {
            lead_id: message.leadId,
            tag: "interested",
            source: "nurturing_engagement",
          }, { sourceAgent: agentId });

          continue;
        } else {
          // Lead hasn't engaged - tag as cold and continue with re-engagement
          await storage.createLeadNurturingTag({
            leadId: message.leadId,
            tag: "cold",
            source: "engagement_check",
          });

          await eventBus.publish("LEAD_TAGGED", {
            lead_id: message.leadId,
            tag: "cold",
            source: "nurturing_engagement",
          }, { sourceAgent: agentId });
        }
      }

      // Send the message
      const baseUrl = process.env.BASE_URL || "http://localhost:5000";
      let result;

      if (message.channel === "email") {
        // Get contact email
        const lead = await storage.getLead(message.leadId);
        const business = lead ? await storage.getBusiness(lead.businessId) : null;
        const contacts = business ? await storage.getContactsByBusiness(business.id) : [];
        const contact = message.contactId
          ? contacts.find(c => c.id === message.contactId)
          : contacts[0];

        if (!contact?.email) {
          await storage.updateScheduledMessage(message.id, {
            status: "failed",
            errorMessage: "No email address available",
          });
          continue;
        }

        // Add tracking to email
        let emailBody = message.body;
        emailBody += generateTrackingPixel(message.id, baseUrl);
        emailBody = wrapLinksForTracking(emailBody, message.id, baseUrl);

        result = await sendEmail({
          to: contact.email,
          subject: message.subject || "Message from Edify Limited",
          body: emailBody,
          trackingId: message.id,
        });
      } else if (message.channel === "sms") {
        // Get contact phone
        const lead = await storage.getLead(message.leadId);
        const business = lead ? await storage.getBusiness(lead.businessId) : null;
        const contacts = business ? await storage.getContactsByBusiness(business.id) : [];
        const contact = message.contactId
          ? contacts.find(c => c.id === message.contactId)
          : contacts[0];

        if (!contact?.phone) {
          await storage.updateScheduledMessage(message.id, {
            status: "failed",
            errorMessage: "No phone number available",
          });
          continue;
        }

        result = await sendSMS({
          to: contact.phone,
          body: message.body,
          trackingId: message.id,
        });
      }

      if (result?.success) {
        await storage.updateScheduledMessage(message.id, {
          status: "sent",
          sentAt: new Date(),
        });

        await storage.createActivityLog({
          actorType: "agent",
          actorId: agentId,
          leadId: message.leadId,
          action: `nurturing_${message.channel}_sent`,
          metadata: {
            messageId: message.id,
            channel: message.channel,
            stepId: message.stepId,
          },
        });

        await eventBus.publish("NURTURING_MESSAGE_SENT", {
          message_id: message.id,
          lead_id: message.leadId,
          channel: message.channel,
        }, { sourceAgent: agentId });

        sentCount++;
      } else {
        await storage.updateScheduledMessage(message.id, {
          status: "failed",
          errorMessage: result?.error || "Unknown error",
        });

        await eventBus.publish("NURTURING_MESSAGE_FAILED", {
          message_id: message.id,
          lead_id: message.leadId,
          channel: message.channel,
          error: result?.error,
        }, { sourceAgent: agentId });
      }
    } catch (error) {
      console.error(`[NurturerAgent] Error processing message ${message.id}:`, error);
      await storage.updateScheduledMessage(message.id, {
        status: "failed",
        errorMessage: String(error),
      });
    }
  }

  return sentCount;
}

/**
 * Handle message engagement (open, click, reply)
 */
export async function handleMessageEngagement(
  agentId: string,
  messageId: string,
  engagementType: "open" | "click" | "reply" | "unsubscribe"
): Promise<void> {
  const message = await storage.getScheduledMessage(messageId);
  if (!message) return;

  // Record engagement
  await storage.createMessageEngagement({
    messageId,
    leadId: message.leadId,
    engagementType,
    metadata: { timestamp: new Date().toISOString() },
  });

  // Publish event
  await eventBus.publish("MESSAGE_ENGAGEMENT_RECEIVED", {
    message_id: messageId,
    lead_id: message.leadId,
    engagement_type: engagementType,
  }, { sourceAgent: agentId });

  // Handle unsubscribe
  if (engagementType === "unsubscribe") {
    const enrollments = await storage.getEnrollmentsByLead(message.leadId);
    for (const enrollment of enrollments) {
      if (enrollment.status === "active") {
        await storage.updateEnrollment(enrollment.id, { status: "unsubscribed" });
      }
    }

    await storage.createLeadNurturingTag({
      leadId: message.leadId,
      tag: "unsubscribed",
      source: "user_action",
    });
  }

  // Tag as engaged for opens and clicks
  if (engagementType === "open" || engagementType === "click") {
    const existingTags = await storage.getTagsByLead(message.leadId);
    const hasEngagedTag = existingTags.some(t => t.tag === "engaged");

    if (!hasEngagedTag) {
      await storage.createLeadNurturingTag({
        leadId: message.leadId,
        tag: "engaged",
        source: `email_${engagementType}`,
      });
    }
  }
}

/**
 * Create default nurturing sequence
 */
async function createDefaultNurturingSequence() {
  const sequence = await storage.createNurturingSequence({
    name: "Website Services Outreach",
    description: "Automated sequence for leads with weak online presence",
    status: "active",
    triggerEvent: "CONTACT_ENRICHED",
  });

  // Create steps
  for (let i = 0; i < DEFAULT_SEQUENCE_STEPS.length; i++) {
    const stepConfig = DEFAULT_SEQUENCE_STEPS[i];
    await storage.createNurturingStep({
      sequenceId: sequence.id,
      stepOrder: i + 1,
      name: stepConfig.name,
      channel: stepConfig.channel as "email" | "sms" | "both",
      delayMinutes: stepConfig.delayMinutes,
      isEngagementCheck: stepConfig.isEngagementCheck || false,
    });
  }

  console.log(`[NurturerAgent] Created default nurturing sequence: ${sequence.name}`);
  return sequence;
}

/**
 * Main agent runner - triggered by CONTACT_ENRICHED event
 */
export async function runNurturerAgent(
  agentId: string,
  payload: { businessId: string; contactId?: string }
): Promise<{ enrolled: boolean; messagesScheduled: number }> {
  const { businessId, contactId } = payload;

  // Get business and lead info
  const business = await storage.getBusiness(businessId);
  if (!business) {
    console.log(`[NurturerAgent] Business ${businessId} not found`);
    return { enrolled: false, messagesScheduled: 0 };
  }

  const leads = await storage.getLeadsByBusiness(businessId);
  const lead = leads.find(l => l.status === "verified");

  if (!lead) {
    console.log(`[NurturerAgent] No verified lead found for business ${businessId}`);
    return { enrolled: false, messagesScheduled: 0 };
  }

  // Get contact info
  const contacts = await storage.getContactsByBusiness(businessId);
  const contact = contactId
    ? contacts.find(c => c.id === contactId)
    : contacts[0];

  if (!contact) {
    console.log(`[NurturerAgent] No contact found for business ${businessId}`);
    return { enrolled: false, messagesScheduled: 0 };
  }

  // Check if contact is on DNC list
  if (contact.isDnc) {
    console.log(`[NurturerAgent] Contact ${contact.id} is on DNC list, skipping`);
    return { enrolled: false, messagesScheduled: 0 };
  }

  // Fetch online presence data from verifier agent results
  const onlinePresence = await storage.getOnlinePresenceByBusiness(businessId);

  // Build social platforms array from presence data
  const socialPlatforms: string[] = [];
  if (onlinePresence?.facebookUrl) socialPlatforms.push("facebook");
  if (onlinePresence?.instagramUrl) socialPlatforms.push("instagram");
  if (onlinePresence?.twitterUrl) socialPlatforms.push("twitter");
  if (onlinePresence?.linkedinUrl) socialPlatforms.push("linkedin");
  if (onlinePresence?.tiktokUrl) socialPlatforms.push("tiktok");

  // Generate a personalized sample site for this lead (pending approval)
  // Note: Sample site will be added to approval queue. The link will only be
  // included in emails after BOTH the sample site AND the email are approved.
  let sampleSiteId: string | undefined;
  try {
    const baseUrl = process.env.BASE_URL || "https://edifylimited.tech";
    const sampleSiteResult = await generateSampleSite(lead.id, businessId, baseUrl);
    if (sampleSiteResult) {
      sampleSiteId = sampleSiteResult.sampleSiteId;
      console.log(`[NurturerAgent] Generated sample site for ${business.name} (pending approval)`);
    }
  } catch (error) {
    console.error(`[NurturerAgent] Failed to generate sample site for ${business.name}:`, error);
    // Continue without sample site - it's an enhancement, not required
  }

  // Build nurturing context with online presence data for AI personalization
  // Note: Sample site info is NOT included yet - it will be added when both
  // the sample site and email are approved
  const context: NurturingContext = {
    leadId: lead.id,
    businessId: business.id,
    contactId: contact.id,
    businessName: business.name,
    contactName: contact.fullName,
    contactEmail: contact.email || undefined,
    contactPhone: contact.phone || undefined,
    // Enhanced context for AI personalization
    contactRole: contact.role || undefined,
    industry: business.industry || undefined,
    city: business.city || undefined,
    // Online presence data from verifier agent
    hasWebsite: onlinePresence?.websiteFound ?? false,
    websiteQuality: onlinePresence?.websiteQuality || "none",
    hasYelp: onlinePresence?.yelpFound ?? false,
    yelpRating: onlinePresence?.yelpRating ?? undefined,
    yelpReviewCount: onlinePresence?.yelpReviewCount ?? undefined,
    hasGoogleBusiness: onlinePresence?.googleBusinessFound ?? false,
    googleRating: onlinePresence?.googleRating ?? undefined,
    hasSocialMedia: onlinePresence?.socialPresence ?? false,
    socialPlatforms: socialPlatforms.length > 0 ? socialPlatforms : undefined,
    onlinePresenceStrength: onlinePresence?.onlinePresenceStrength || "none",
    // Sample site info - not included until approved
    sampleSiteUrl: undefined,
    sampleSiteQrCodeDataUrl: undefined,
  };

  // Skip if no contact method available
  if (!context.contactEmail && !context.contactPhone) {
    console.log(`[NurturerAgent] No contact method available for ${business.name}`);
    return { enrolled: false, messagesScheduled: 0 };
  }

  // Enroll lead in nurturing
  await enrollLeadInNurturing(agentId, context);

  // Count scheduled messages
  const scheduledMessages = await storage.getScheduledMessagesByLead(lead.id);
  const pendingMessages = scheduledMessages.filter(m => m.status === "pending");

  return { enrolled: true, messagesScheduled: pendingMessages.length };
}

/**
 * Handle email reply with AI intent detection
 */
export async function handleEmailReply(
  agentId: string,
  messageId: string,
  replyText: string
): Promise<{
  intent: string;
  action: string;
  suggestedResponse?: string;
}> {
  const message = await storage.getScheduledMessage(messageId);
  if (!message) {
    return { intent: "unknown", action: "none" };
  }

  // Record the reply engagement
  await handleMessageEngagement(agentId, messageId, "reply");

  // Get context for AI analysis
  const lead = await storage.getLead(message.leadId);
  const business = lead ? await storage.getBusiness(lead.businessId) : null;
  const originalContext = `Outreach to ${business?.name || "business"} about website services. Original subject: ${message.subject}`;

  // Use AI to detect intent
  const intentResult = await detectReplyIntent(replyText, originalContext);

  // Take action based on intent
  switch (intentResult.intent) {
    case "interested":
      // Tag as interested and escalate for human follow-up
      await storage.createLeadNurturingTag({
        leadId: message.leadId,
        tag: "interested",
        source: "email_reply",
      });
      await storage.createLeadNurturingTag({
        leadId: message.leadId,
        tag: "hot_lead",
        source: "ai_detected",
      });

      // Update lead score significantly
      if (lead) {
        await storage.updateLead(lead.id, {
          status: "contacted",
          score: Math.min(100, (lead.score || 0) + 40),
        });
      }

      // Pause nurturing sequence to avoid over-messaging
      const enrollments = await storage.getEnrollmentsByLead(message.leadId);
      for (const enrollment of enrollments) {
        if (enrollment.status === "active") {
          await storage.updateEnrollment(enrollment.id, { status: "paused" });
        }
      }

      await eventBus.publish("LEAD_REPLY_INTERESTED", {
        lead_id: message.leadId,
        message_id: messageId,
        confidence: intentResult.confidence,
        suggested_response: intentResult.suggestedResponse,
      }, { sourceAgent: agentId });

      await storage.createActivityLog({
        actorType: "agent",
        actorId: agentId,
        leadId: message.leadId,
        action: "reply_detected_interested",
        metadata: {
          intent: intentResult.intent,
          confidence: intentResult.confidence,
          replySnippet: replyText.substring(0, 100),
        },
      });

      return {
        intent: "interested",
        action: "escalate_human",
        suggestedResponse: intentResult.suggestedResponse,
      };

    case "not_interested":
      // Tag and respect their wishes
      await storage.createLeadNurturingTag({
        leadId: message.leadId,
        tag: "not_interested",
        source: "email_reply",
      });

      // Complete/stop nurturing sequence
      const notInterestedEnrollments = await storage.getEnrollmentsByLead(message.leadId);
      for (const enrollment of notInterestedEnrollments) {
        if (enrollment.status === "active") {
          await storage.updateEnrollment(enrollment.id, {
            status: "completed",
            completedAt: new Date(),
          });
        }
      }

      if (lead) {
        await storage.updateLead(lead.id, { status: "archived" });
      }

      await storage.createActivityLog({
        actorType: "agent",
        actorId: agentId,
        leadId: message.leadId,
        action: "reply_detected_not_interested",
        metadata: {
          intent: intentResult.intent,
          confidence: intentResult.confidence,
        },
      });

      return { intent: "not_interested", action: "archived" };

    case "question":
      // Tag and auto-respond if AI is confident, else escalate
      await storage.createLeadNurturingTag({
        leadId: message.leadId,
        tag: "has_question",
        source: "email_reply",
      });

      if (lead) {
        await storage.updateLead(lead.id, {
          score: Math.min(100, (lead.score || 0) + 15),
        });
      }

      if (intentResult.shouldRespond && intentResult.suggestedResponse) {
        // AI will handle response
        await storage.createActivityLog({
          actorType: "agent",
          actorId: agentId,
          leadId: message.leadId,
          action: "reply_detected_question_auto_response",
          metadata: {
            intent: intentResult.intent,
            confidence: intentResult.confidence,
            autoResponse: intentResult.suggestedResponse,
          },
        });

        return {
          intent: "question",
          action: "auto_respond",
          suggestedResponse: intentResult.suggestedResponse,
        };
      } else {
        // Escalate to human
        await eventBus.publish("LEAD_QUESTION_RECEIVED", {
          lead_id: message.leadId,
          message_id: messageId,
          question: replyText,
        }, { sourceAgent: agentId });

        return {
          intent: "question",
          action: "escalate_human",
          suggestedResponse: intentResult.suggestedResponse,
        };
      }

    case "unsubscribe":
      // Handle unsubscribe request
      await handleMessageEngagement(agentId, messageId, "unsubscribe");
      return { intent: "unsubscribe", action: "unsubscribed" };

    default:
      // Unknown intent - escalate for human review
      await eventBus.publish("LEAD_REPLY_UNKNOWN", {
        lead_id: message.leadId,
        message_id: messageId,
        reply_text: replyText,
      }, { sourceAgent: agentId });

      return { intent: "unknown", action: "escalate_human" };
  }
}

/**
 * Check if nurturing service is configured
 */
export function isNurturingConfigured(): boolean {
  return isEmailConfigured() || isSMSConfigured();
}
