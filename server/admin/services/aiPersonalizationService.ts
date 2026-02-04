/**
 * AI Personalization Service
 *
 * Generates personalized email/SMS content based on:
 * - Business industry
 * - Online presence gaps identified by verifier
 * - Location (Hawaii focus)
 * - Contact role
 */

import { chatCompletionJSON, isAIConfigured } from "../ai/client";

interface PersonalizationContext {
  businessName: string;
  contactName: string;
  contactRole?: string;
  industry?: string;
  city?: string;
  // Online presence info
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
  // Message type
  messageType: "welcome" | "followUp24h" | "followUp48h" | "reEngagement";
  // Sample site info (for personalized preview)
  sampleSiteUrl?: string;
  sampleSiteQrCodeDataUrl?: string;
}

interface PersonalizedContent {
  emailSubject: string;
  emailBody: string;
  smsBody: string;
}

const PERSONALIZATION_PROMPT = `You are a sales copywriter for Edify Limited, a Hawaii-based web services company.
Your job is to write personalized outreach messages that feel genuine and helpful, not salesy.

Key principles:
- Be warm and use "Aloha" when appropriate for Hawaii businesses
- Focus on THEIR specific pain points based on their online presence gaps
- Reference their industry and what their competitors might be doing
- Keep it conversational and human
- Highlight how a website would help THEIR specific business type
- Never be pushy - offer genuine help
- When a SAMPLE SITE URL is provided, prominently feature it! This is a personalized preview that shows what their website could look like

IMPORTANT: Return valid JSON with exactly these fields:
{
  "emailSubject": "short, personalized subject line",
  "emailBody": "full HTML email body with proper formatting",
  "smsBody": "short SMS under 160 characters"
}`;

/**
 * Generate personalized email/SMS content using AI
 */
export async function generatePersonalizedContent(
  context: PersonalizationContext
): Promise<PersonalizedContent> {
  if (!isAIConfigured()) {
    // Return generic templates if AI not configured
    return getGenericContent(context);
  }

  const presenceGaps = buildPresenceGapsList(context);
  const industryContext = getIndustryContext(context.industry);

  const prompt = buildPersonalizationPrompt(context, presenceGaps, industryContext);

  try {
    const result = await chatCompletionJSON<PersonalizedContent>(
      PERSONALIZATION_PROMPT,
      prompt
    );

    return {
      emailSubject: result.emailSubject || getGenericSubject(context),
      emailBody: result.emailBody || getGenericEmailBody(context),
      smsBody: result.smsBody || getGenericSMSBody(context),
    };
  } catch (error) {
    console.error("[AIPersonalization] Error generating content:", error);
    return getGenericContent(context);
  }
}

/**
 * Build the personalization prompt
 */
function buildPersonalizationPrompt(
  context: PersonalizationContext,
  presenceGaps: string[],
  industryContext: string
): string {
  const messageTypeDescriptions: Record<string, string> = {
    welcome: "Initial outreach - introduce yourself and offer help",
    followUp24h: "24-hour follow-up - check if they saw your first message, add more value",
    followUp48h: "48-hour follow-up - last chance offer, create gentle urgency",
    reEngagement: "Re-engagement after going cold - reconnect warmly",
  };

  const sampleSiteSection = context.sampleSiteUrl ? `

PERSONALIZED SAMPLE WEBSITE:
We've created a personalized website preview just for them!
URL: ${context.sampleSiteUrl}

This is a HUGE selling point - make sure to:
1. In the email, include a prominent button/link to view their sample website
2. Emphasize this is FREE and made specifically for them
3. Mention they can view it on their phone (we have a QR code too)
4. Create excitement about seeing what their online presence COULD look like
` : "";

  return `Write a ${context.messageType} message for:

BUSINESS INFO:
- Name: ${context.businessName}
- Industry: ${context.industry || "Local Business"}
- Location: ${context.city || "Hawaii"}
- Contact: ${context.contactName}${context.contactRole ? ` (${context.contactRole})` : ""}

THEIR ONLINE PRESENCE GAPS:
${presenceGaps.length > 0 ? presenceGaps.map(g => `- ${g}`).join("\n") : "- Very limited online presence"}
${sampleSiteSection}
${industryContext}

MESSAGE TYPE: ${messageTypeDescriptions[context.messageType]}

${context.messageType === "welcome" ? `
For the welcome email:
- Subject should be personal and intriguing (not salesy)
- Open with a warm greeting
- Mention ONE specific thing about their business situation
- Explain how a website could help their specific industry
- Include a soft call-to-action (free consultation)
- Sign off warmly
` : ""}

${context.messageType === "followUp24h" ? `
For the 24-hour follow-up:
- Reference the previous message
- Add a new piece of value (stat, tip, or insight for their industry)
- Ask a question to encourage response
- Keep it shorter than the first email
` : ""}

${context.messageType === "followUp48h" ? `
For the 48-hour follow-up:
- This is likely the last touch
- Offer something free (audit, consultation)
- Make it easy to say no (reduces pressure)
- Keep it brief
` : ""}

${context.messageType === "reEngagement" ? `
For re-engagement:
- Acknowledge time has passed
- Don't be guilt-trippy
- Mention something new or seasonal
- Keep it very light and friendly
` : ""}

The SMS should be under 160 characters and drive them to respond or visit a link.`;
}

/**
 * Build a list of online presence gaps
 */
function buildPresenceGapsList(context: PersonalizationContext): string[] {
  const gaps: string[] = [];

  if (!context.hasWebsite) {
    gaps.push("No website - customers can't find them online");
  } else if (context.websiteQuality === "basic") {
    gaps.push("Basic/outdated website - needs modernization");
  }

  if (!context.hasGoogleBusiness) {
    gaps.push("No Google Business profile - missing from Maps/local search");
  } else if (context.googleRating && context.googleRating < 4.0) {
    gaps.push(`Google rating is ${context.googleRating} - could be improved`);
  }

  if (!context.hasYelp) {
    gaps.push("No Yelp presence - missing reviews platform");
  } else if (context.yelpRating && context.yelpRating < 4.0) {
    gaps.push(`Yelp rating is ${context.yelpRating} - room for improvement`);
  }

  if (!context.hasSocialMedia) {
    gaps.push("No social media - missing engagement opportunities");
  }

  return gaps;
}

/**
 * Get industry-specific context
 */
function getIndustryContext(industry?: string): string {
  if (!industry) return "";

  const industryTips: Record<string, string> = {
    restaurant: `INDUSTRY TIPS FOR RESTAURANTS:
- Menus online are critical for deciding where to eat
- Photos of food drive 2x more traffic
- Online ordering integration is huge post-COVID
- Yelp reviews heavily influence restaurant choices`,

    salon: `INDUSTRY TIPS FOR SALONS/SPAS:
- Before/after photos are essential
- Online booking saves phone time
- Instagram is key for showcasing work
- Reviews build trust for personal services`,

    contractor: `INDUSTRY TIPS FOR CONTRACTORS:
- Portfolio of past work is essential
- Trust badges and licenses should be visible
- Reviews are crucial for home services
- Contact forms beat phone-only`,

    retail: `INDUSTRY TIPS FOR RETAIL:
- Product photos drive purchases
- Store hours and location must be easy to find
- E-commerce integration is expected
- Social media showcases new arrivals`,

    automotive: `INDUSTRY TIPS FOR AUTO SERVICES:
- Service menu with pricing builds trust
- Before/after photos show quality
- Online scheduling is increasingly expected
- Google reviews are heavily checked`,

    healthcare: `INDUSTRY TIPS FOR HEALTHCARE:
- Trust and credentials are paramount
- Patient forms online save time
- HIPAA-compliant contact is important
- Professional photos build trust`,
  };

  const lowerIndustry = industry.toLowerCase();
  for (const [key, tips] of Object.entries(industryTips)) {
    if (lowerIndustry.includes(key)) {
      return tips;
    }
  }

  return `GENERAL LOCAL BUSINESS TIPS:
- 85% of consumers search online before visiting
- Mobile-friendly is essential
- Clear contact info and hours matter
- Reviews heavily influence decisions`;
}

/**
 * Generic content fallback
 */
function getGenericContent(context: PersonalizationContext): PersonalizedContent {
  return {
    emailSubject: getGenericSubject(context),
    emailBody: getGenericEmailBody(context),
    smsBody: getGenericSMSBody(context),
  };
}

function getGenericSubject(context: PersonalizationContext): string {
  const subjects: Record<string, string> = {
    welcome: `Quick question about ${context.businessName}`,
    followUp24h: `Following up - ${context.businessName}`,
    followUp48h: `Last chance: Free website audit for ${context.businessName}`,
    reEngagement: `Checking in - ${context.businessName}`,
  };
  return subjects[context.messageType] || subjects.welcome;
}

function getGenericEmailBody(context: PersonalizationContext): string {
  const sampleSiteSection = context.sampleSiteUrl ? `
          <div style="background: linear-gradient(135deg, #1976D2 0%, #455A64 100%); color: white; padding: 30px; border-radius: 10px; margin: 25px 0; text-align: center;">
            <h2 style="margin: 0 0 15px 0; font-size: 24px;">We Built You a Sample Website!</h2>
            <p style="margin: 0 0 20px 0; font-size: 16px;">See what ${context.businessName} could look like online</p>
            <a href="${context.sampleSiteUrl}" style="display: inline-block; background: #FF7043; color: white; padding: 15px 40px; border-radius: 30px; text-decoration: none; font-weight: bold; font-size: 18px;">View Your Sample Site</a>
            ${context.sampleSiteQrCodeDataUrl ? `
            <p style="margin-top: 20px; font-size: 14px;">Or scan this QR code on your phone:</p>
            <img src="${context.sampleSiteQrCodeDataUrl}" alt="QR Code" style="width: 120px; height: 120px; margin-top: 10px; background: white; padding: 5px; border-radius: 5px;">
            ` : ""}
          </div>
  ` : "";

  return `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <p>Aloha ${context.contactName},</p>
          <p>I noticed ${context.businessName} could benefit from a stronger online presence.
          At Edify Limited, we help Hawaii businesses like yours get found online with
          professional, mobile-friendly websites.</p>
          ${sampleSiteSection}
          <p>Would you be interested in a free 15-minute consultation to discuss how we could help?</p>
          <p>Mahalo,<br>The Edify Team</p>
        </div>
      </body>
    </html>
  `;
}

function getGenericSMSBody(context: PersonalizationContext): string {
  if (context.sampleSiteUrl) {
    return `Aloha! We made a sample website for ${context.businessName}! Check it out: ${context.sampleSiteUrl} - Edify`;
  }
  return `Aloha! Noticed ${context.businessName} could use a website. Want a free consult? Reply YES - Edify Limited`;
}

/**
 * Check if timing is appropriate for Hawaii businesses
 */
export function isAppropriateTime(): boolean {
  // Get current time in Hawaii (HST = UTC-10)
  const now = new Date();
  const hawaiiOffset = -10 * 60; // minutes
  const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
  const hawaiiMinutes = utcMinutes + hawaiiOffset;
  const hawaiiHour = Math.floor(((hawaiiMinutes % 1440) + 1440) % 1440 / 60);

  // Only send between 9 AM and 6 PM Hawaii time
  return hawaiiHour >= 9 && hawaiiHour < 18;
}

/**
 * Get optimal send time in Hawaii
 */
export function getOptimalSendTime(): Date {
  const now = new Date();

  // If current time is appropriate, send now
  if (isAppropriateTime()) {
    return now;
  }

  // Otherwise, schedule for 10 AM Hawaii time tomorrow
  const hawaiiOffset = -10 * 60 * 60 * 1000; // milliseconds
  const nowInHawaii = new Date(now.getTime() + hawaiiOffset);
  const tomorrow = new Date(nowInHawaii);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);

  // Convert back to UTC
  return new Date(tomorrow.getTime() - hawaiiOffset);
}

/**
 * Detect intent from email reply using AI
 */
export async function detectReplyIntent(
  replyText: string,
  originalContext: string
): Promise<{
  intent: "interested" | "not_interested" | "question" | "unsubscribe" | "unknown";
  shouldRespond: boolean;
  suggestedResponse?: string;
  confidence: number;
}> {
  if (!isAIConfigured()) {
    return { intent: "unknown", shouldRespond: false, confidence: 0 };
  }

  const prompt = `Analyze this email reply and determine the sender's intent.

ORIGINAL CONTEXT: ${originalContext}

REPLY: ${replyText}

Determine:
1. Intent: Is the person interested, not interested, asking a question, wanting to unsubscribe, or unclear?
2. Should we auto-respond or escalate to a human?
3. If auto-respond, what should we say?

Return JSON:
{
  "intent": "interested" | "not_interested" | "question" | "unsubscribe" | "unknown",
  "shouldRespond": boolean,
  "suggestedResponse": "response text if shouldRespond is true",
  "confidence": 0-100
}`;

  try {
    const result = await chatCompletionJSON<{
      intent: "interested" | "not_interested" | "question" | "unsubscribe" | "unknown";
      shouldRespond: boolean;
      suggestedResponse?: string;
      confidence: number;
    }>(
      "You are an email intent classifier for a web services company. Analyze replies to determine next steps.",
      prompt
    );

    return result;
  } catch (error) {
    console.error("[AIPersonalization] Error detecting intent:", error);
    return { intent: "unknown", shouldRespond: false, confidence: 0 };
  }
}
