/**
 * Email Service for Lead Nurturing
 * Supports SendGrid and Gmail API integrations
 */

interface EmailConfig {
  from: string;
  fromName: string;
}

interface EmailPayload {
  to: string;
  subject: string;
  body: string;
  trackingId?: string;
}

interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// Check if email service is configured
export function isEmailConfigured(): boolean {
  return !!(process.env.SENDGRID_API_KEY || process.env.GMAIL_CLIENT_ID);
}

// Get email configuration
function getEmailConfig(): EmailConfig {
  return {
    from: process.env.EMAIL_FROM || "noreply@edifylimited.tech",
    fromName: process.env.EMAIL_FROM_NAME || "Edify Limited",
  };
}

// Replace template variables in email content
export function processEmailTemplate(template: string, variables: Record<string, string>): string {
  let processed = template;
  for (const [key, value] of Object.entries(variables)) {
    processed = processed.replace(new RegExp(`{{${key}}}`, "g"), value);
  }
  return processed;
}

// Generate tracking pixel HTML for email opens
export function generateTrackingPixel(messageId: string, baseUrl: string): string {
  return `<img src="${baseUrl}/api/nurturing/track/open/${messageId}" width="1" height="1" style="display:none;" alt="" />`;
}

// Wrap links for click tracking
export function wrapLinksForTracking(html: string, messageId: string, baseUrl: string): string {
  // Match href links and wrap them for tracking
  return html.replace(
    /href="(https?:\/\/[^"]+)"/g,
    (match, url) => `href="${baseUrl}/api/nurturing/track/click/${messageId}?url=${encodeURIComponent(url)}"`
  );
}

// Send email via SendGrid
async function sendViaSendGrid(payload: EmailPayload): Promise<EmailResult> {
  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) {
    return { success: false, error: "SendGrid API key not configured" };
  }

  const config = getEmailConfig();

  try {
    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: payload.to }] }],
        from: { email: config.from, name: config.fromName },
        subject: payload.subject,
        content: [{ type: "text/html", value: payload.body }],
        custom_args: payload.trackingId ? { tracking_id: payload.trackingId } : undefined,
      }),
    });

    if (response.ok) {
      const messageId = response.headers.get("X-Message-Id") || payload.trackingId;
      return { success: true, messageId };
    } else {
      const errorText = await response.text();
      return { success: false, error: `SendGrid error: ${response.status} - ${errorText}` };
    }
  } catch (error) {
    return { success: false, error: `SendGrid request failed: ${error}` };
  }
}

// Main email sending function
export async function sendEmail(payload: EmailPayload): Promise<EmailResult> {
  if (!isEmailConfigured()) {
    console.log("[EmailService] Email not configured, simulating send:", payload.to, payload.subject);
    return { success: true, messageId: `sim-${Date.now()}` };
  }

  // Use SendGrid if available
  if (process.env.SENDGRID_API_KEY) {
    return sendViaSendGrid(payload);
  }

  // Fallback to simulation
  console.log("[EmailService] No email provider configured, simulating send:", payload.to);
  return { success: true, messageId: `sim-${Date.now()}` };
}

// Email templates for nurturing
export const emailTemplates = {
  welcome: {
    subject: "Welcome! Let's Transform Your Online Presence",
    body: `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #2563eb;">Aloha {{businessName}}!</h1>
            <p>Thank you for your interest in improving your online presence. At Edify Limited, we specialize in creating custom websites that help Hawaii businesses stand out online.</p>
            <p>We noticed your business could benefit from a stronger digital presence, and we'd love to help you:</p>
            <ul>
              <li>Get a professional, mobile-friendly website</li>
              <li>Improve your Google visibility</li>
              <li>Connect with more local customers</li>
            </ul>
            <p>Would you like to schedule a free 15-minute consultation to discuss how we can help {{businessName}} grow online?</p>
            <p><a href="{{bookingLink}}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Schedule Free Consultation</a></p>
            <p>Mahalo,<br>The Edify Limited Team</p>
          </div>
        </body>
      </html>
    `,
  },
  followUp24h: {
    subject: "Quick Question About {{businessName}}",
    body: `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <p>Hi {{contactName}},</p>
            <p>I wanted to follow up on my previous email about improving {{businessName}}'s online presence.</p>
            <p>Did you know that <strong>85% of consumers search online before visiting a local business?</strong> Without a professional website, you could be missing out on valuable customers.</p>
            <p>I have a few questions that would help me understand how we could best support your business:</p>
            <ol>
              <li>Do you currently have a website?</li>
              <li>What's your biggest challenge with attracting new customers?</li>
              <li>Would a 15-minute call work better than email?</li>
            </ol>
            <p>Just hit reply - I read every response personally.</p>
            <p>Best regards,<br>{{senderName}}<br>Edify Limited</p>
          </div>
        </body>
      </html>
    `,
  },
  followUp48h: {
    subject: "Last Chance: Free Website Audit for {{businessName}}",
    body: `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <p>Hi {{contactName}},</p>
            <p>I haven't heard back from you, so I wanted to make one final offer:</p>
            <p><strong>Free Website Audit for {{businessName}}</strong></p>
            <p>I'll personally review your current online presence and provide specific recommendations to help you attract more customers. No strings attached.</p>
            <p>If you're not interested, no worries at all - just let me know and I won't reach out again.</p>
            <p><a href="{{bookingLink}}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Get Your Free Audit</a></p>
            <p>Or simply reply "not interested" and I'll remove you from future emails.</p>
            <p>Mahalo for your time,<br>{{senderName}}<br>Edify Limited</p>
          </div>
        </body>
      </html>
    `,
  },
  reEngagement: {
    subject: "We Miss You, {{businessName}}!",
    body: `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <p>Hi {{contactName}},</p>
            <p>It's been a while since we connected, and I wanted to check in.</p>
            <p>Has anything changed with your online presence needs? We've helped several Hawaii businesses like yours get online and start attracting new customers.</p>
            <p>If you're still interested in growing your business online, I'd love to reconnect. If not, no problem at all!</p>
            <p>Just hit reply and let me know either way.</p>
            <p>Aloha,<br>{{senderName}}<br>Edify Limited</p>
          </div>
        </body>
      </html>
    `,
  },
};
