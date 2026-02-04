/**
 * SMS Service for Lead Nurturing
 * Supports Twilio integration
 */

interface SMSPayload {
  to: string;
  body: string;
  trackingId?: string;
}

interface SMSResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// Check if SMS service is configured
export function isSMSConfigured(): boolean {
  return !!(
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_PHONE_NUMBER
  );
}

// Format phone number for Twilio (ensure E.164 format)
function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, "");

  // If it's a 10-digit US number, add +1
  if (digits.length === 10) {
    return `+1${digits}`;
  }

  // If it's 11 digits starting with 1, add +
  if (digits.length === 11 && digits.startsWith("1")) {
    return `+${digits}`;
  }

  // If it already has the right length, assume it's correct
  if (digits.length > 10) {
    return `+${digits}`;
  }

  // Return as-is if we can't determine format
  return phone;
}

// Replace template variables in SMS content
export function processSMSTemplate(template: string, variables: Record<string, string>): string {
  let processed = template;
  for (const [key, value] of Object.entries(variables)) {
    processed = processed.replace(new RegExp(`{{${key}}}`, "g"), value);
  }
  return processed;
}

// Send SMS via Twilio
async function sendViaTwilio(payload: SMSPayload): Promise<SMSResult> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    return { success: false, error: "Twilio credentials not configured" };
  }

  const formattedTo = formatPhoneNumber(payload.to);

  try {
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          "Authorization": `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          To: formattedTo,
          From: fromNumber,
          Body: payload.body,
        }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      return { success: true, messageId: data.sid };
    } else {
      return { success: false, error: `Twilio error: ${data.message || data.code}` };
    }
  } catch (error) {
    return { success: false, error: `Twilio request failed: ${error}` };
  }
}

// Main SMS sending function
export async function sendSMS(payload: SMSPayload): Promise<SMSResult> {
  if (!isSMSConfigured()) {
    console.log("[SMSService] SMS not configured, simulating send:", payload.to, payload.body.substring(0, 50));
    return { success: true, messageId: `sim-sms-${Date.now()}` };
  }

  return sendViaTwilio(payload);
}

// SMS templates for nurturing (shorter messages for SMS)
export const smsTemplates = {
  welcome: `Aloha from Edify Limited! We noticed {{businessName}} could use a stronger online presence. Want a free website consultation? Reply YES or visit {{shortLink}}`,

  followUp24h: `Hi {{contactName}}, following up about {{businessName}}. 85% of customers search online before visiting. Ready to discuss your website? Reply or call {{phoneNumber}}`,

  followUp48h: `Last chance for a FREE website audit for {{businessName}}! No strings attached. Reply YES or "STOP" to opt out. - Edify Limited`,

  reEngagement: `Hi {{contactName}}, it's been a while! Still interested in growing {{businessName}} online? Reply YES and let's chat. - Edify Limited`,

  confirmation: `Thanks for your interest! We'll call you at {{scheduledTime}} to discuss {{businessName}}'s website. Questions? Reply here. - Edify`,
};
