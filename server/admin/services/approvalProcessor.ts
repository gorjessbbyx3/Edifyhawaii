/**
 * Approval Processor Service
 * Handles AI-powered editing of sample sites and scheduled messages
 * based on user chat requests in the approval queue
 */

import { storage } from "../storage";
import { chatCompletionJSON } from "../ai/client";
import type { ApprovalQueue, SampleSite, ScheduledMessage } from "@shared/schema";

interface EditResult {
  success: boolean;
  response: string;
  appliedChanges: Record<string, unknown> | null;
  updatedItem: SampleSite | ScheduledMessage | null;
}

/**
 * Process an edit request from the user and apply AI-suggested changes
 */
export async function processEditRequest(
  queueItem: ApprovalQueue,
  userMessage: string
): Promise<EditResult> {
  try {
    if (queueItem.itemType === "sample_site") {
      return await processSampleSiteEdit(queueItem, userMessage);
    } else if (queueItem.itemType === "scheduled_message") {
      return await processScheduledMessageEdit(queueItem, userMessage);
    }

    return {
      success: false,
      response: "Unknown item type",
      appliedChanges: null,
      updatedItem: null,
    };
  } catch (error) {
    console.error("Error processing edit request:", error);
    return {
      success: false,
      response: `Error processing your request: ${error instanceof Error ? error.message : "Unknown error"}`,
      appliedChanges: null,
      updatedItem: null,
    };
  }
}

/**
 * Process edit request for a sample site
 */
async function processSampleSiteEdit(
  queueItem: ApprovalQueue,
  userMessage: string
): Promise<EditResult> {
  const sampleSite = await storage.getSampleSite(queueItem.itemId);
  if (!sampleSite) {
    return {
      success: false,
      response: "Sample site not found",
      appliedChanges: null,
      updatedItem: null,
    };
  }

  // Get the business info for context
  const lead = await storage.getLead(queueItem.leadId);
  const business = lead ? await storage.getBusiness(lead.businessId) : null;

  // Get previous edit requests for context
  const previousEdits = await storage.getEditRequestsByItem("sample_site", queueItem.itemId);
  const chatHistory = previousEdits.map((edit) => ({
    role: edit.role as "user" | "assistant",
    content: edit.message,
  }));

  // Build prompt for AI
  const systemPrompt = `You are an AI assistant helping to edit a sample website preview for a business.
The website is for: ${business?.name || "Unknown Business"} in the ${business?.industry || "general"} industry.

Current sample site content:
- Tagline: ${sampleSite.tagline || "None set"}
- About Text: ${sampleSite.aboutText || "None set"}
- Services: ${JSON.stringify(sampleSite.servicesJson || [])}
- Testimonials: ${JSON.stringify(sampleSite.testimonials || [])}
- Contact Info: ${JSON.stringify(sampleSite.contactInfo || {})}
- Color Scheme: ${JSON.stringify(sampleSite.colorScheme || {})}
- Features: Online Booking: ${sampleSite.hasOnlineBooking}, Contact Form: ${sampleSite.hasContactForm}, Google Map: ${sampleSite.hasGoogleMap}, Social Links: ${sampleSite.hasSocialLinks}

The user wants to make edits to this sample site. Analyze their request and provide specific updates.

IMPORTANT: Respond with a JSON object containing:
{
  "response": "Your friendly response explaining what you changed",
  "changes": {
    // Only include fields that need to be updated
    "tagline": "new tagline if changed",
    "aboutText": "new about text if changed",
    "servicesJson": [...] // array of services if changed,
    "testimonials": [...] // array of testimonials if changed,
    "colorScheme": {...} // color scheme object if changed,
    "hasOnlineBooking": true/false // if changed,
    "hasContactForm": true/false // if changed,
    "hasGoogleMap": true/false // if changed,
    "hasSocialLinks": true/false // if changed
  }
}

If the request cannot be fulfilled or is unclear, set changes to null and explain in the response.`;

  const messages = [
    ...chatHistory.slice(-10), // Last 10 messages for context
    { role: "user" as const, content: userMessage },
  ];

  const result = await chatCompletionJSON<{
    response: string;
    changes: Partial<{
      tagline: string;
      aboutText: string;
      servicesJson: unknown[];
      testimonials: unknown[];
      colorScheme: Record<string, string>;
      hasOnlineBooking: boolean;
      hasContactForm: boolean;
      hasGoogleMap: boolean;
      hasSocialLinks: boolean;
    }> | null;
  }>(systemPrompt, messages);

  if (!result || !result.changes) {
    return {
      success: false,
      response: result?.response || "I couldn't understand the request. Please try rephrasing.",
      appliedChanges: null,
      updatedItem: sampleSite,
    };
  }

  // Apply the changes
  const updatedSite = await storage.updateSampleSite(queueItem.itemId, result.changes as any);

  return {
    success: true,
    response: result.response,
    appliedChanges: result.changes,
    updatedItem: updatedSite || sampleSite,
  };
}

/**
 * Process edit request for a scheduled message
 */
async function processScheduledMessageEdit(
  queueItem: ApprovalQueue,
  userMessage: string
): Promise<EditResult> {
  const message = await storage.getScheduledMessage(queueItem.itemId);
  if (!message) {
    return {
      success: false,
      response: "Scheduled message not found",
      appliedChanges: null,
      updatedItem: null,
    };
  }

  // Get the business and contact info for context
  const lead = await storage.getLead(queueItem.leadId);
  const business = lead ? await storage.getBusiness(lead.businessId) : null;
  const contact = message.contactId ? await storage.getContact(message.contactId) : null;

  // Get previous edit requests for context
  const previousEdits = await storage.getEditRequestsByItem("scheduled_message", queueItem.itemId);
  const chatHistory = previousEdits.map((edit) => ({
    role: edit.role as "user" | "assistant",
    content: edit.message,
  }));

  // Build prompt for AI
  const systemPrompt = `You are an AI assistant helping to edit a ${message.channel} message for a lead nurturing campaign.

Target Business: ${business?.name || "Unknown"} (${business?.industry || "general"} industry)
Target Contact: ${contact?.fullName || "Unknown"} (${contact?.email || "No email"})
Message Channel: ${message.channel}

Current message content:
${message.channel === "email" ? `Subject: ${message.subject || "No subject"}` : ""}
Body: ${message.body || "No body"}

Original content (before any edits):
${message.channel === "email" ? `Subject: ${(message as any).originalSubject || message.subject || "No subject"}` : ""}
Body: ${(message as any).originalBody || message.body || "No body"}

The user wants to make edits to this message. Analyze their request and provide specific updates.

IMPORTANT: Respond with a JSON object containing:
{
  "response": "Your friendly response explaining what you changed",
  "changes": {
    // Only include fields that need to be updated
    ${message.channel === "email" ? '"subject": "new subject if changed",' : ""}
    "body": "new body if changed"
  }
}

Guidelines:
- Keep the message professional but personalized
- Maintain appropriate length for the channel (emails can be longer, SMS should be concise)
- Preserve any placeholders like {{name}} or {{business_name}} if present
- Don't remove important calls to action unless specifically asked
- Keep the tone appropriate for business communication

If the request cannot be fulfilled or is unclear, set changes to null and explain in the response.`;

  const messages = [
    ...chatHistory.slice(-10), // Last 10 messages for context
    { role: "user" as const, content: userMessage },
  ];

  const result = await chatCompletionJSON<{
    response: string;
    changes: Partial<{
      subject: string;
      body: string;
    }> | null;
  }>(systemPrompt, messages);

  if (!result || !result.changes) {
    return {
      success: false,
      response: result?.response || "I couldn't understand the request. Please try rephrasing.",
      appliedChanges: null,
      updatedItem: message,
    };
  }

  // Apply the changes
  const updatedMessage = await storage.updateScheduledMessage(queueItem.itemId, result.changes as any);

  return {
    success: true,
    response: result.response,
    appliedChanges: result.changes,
    updatedItem: updatedMessage || message,
  };
}

/**
 * Regenerate content for an item using AI
 */
export async function regenerateContent(
  queueItem: ApprovalQueue,
  instructions?: string
): Promise<EditResult> {
  if (queueItem.itemType === "sample_site") {
    // For sample sites, regenerate the entire content
    const sampleSite = await storage.getSampleSite(queueItem.itemId);
    if (!sampleSite) {
      return {
        success: false,
        response: "Sample site not found",
        appliedChanges: null,
        updatedItem: null,
      };
    }

    const lead = await storage.getLead(queueItem.leadId);
    const business = lead ? await storage.getBusiness(lead.businessId) : null;

    const prompt = `Regenerate the content for a sample website for ${business?.name || "a business"} in the ${business?.industry || "general"} industry.
${instructions ? `Additional instructions: ${instructions}` : ""}

Create fresh, compelling content that will impress the potential client.`;

    return processEditRequest(queueItem, prompt);
  } else if (queueItem.itemType === "scheduled_message") {
    const message = await storage.getScheduledMessage(queueItem.itemId);
    if (!message) {
      return {
        success: false,
        response: "Scheduled message not found",
        appliedChanges: null,
        updatedItem: null,
      };
    }

    const prompt = `Please rewrite this ${message.channel} message completely while keeping the same intent and purpose.
${instructions ? `Additional instructions: ${instructions}` : ""}`;

    return processEditRequest(queueItem, prompt);
  }

  return {
    success: false,
    response: "Unknown item type",
    appliedChanges: null,
    updatedItem: null,
  };
}
