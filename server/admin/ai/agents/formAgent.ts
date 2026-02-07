import { chatCompletionJSON, isAIConfigured } from "../client";
import { storage } from "../../storage";

interface FormSubmissionResult {
  businessName: string;
  formType: string;
  subject: string;
  message: string;
  status: "drafted" | "submitted" | "error";
  reasoning: string;
}

const FORM_AGENT_SYSTEM_PROMPT = `You are a web form submission agent for an IT services company.
Your job is to draft professional outreach messages for business contact forms.

Given a business profile, create an appropriate contact form submission that:
- Is professional and personalized
- Highlights relevant IT services
- Includes a clear value proposition
- Is not pushy or spammy

Return valid JSON:
{
  "businessName": "name of the business",
  "formType": "contact" | "inquiry" | "quote_request",
  "subject": "email subject line",
  "message": "the form message body",
  "status": "drafted",
  "reasoning": "why this approach was chosen"
}`;

export async function runFormAgent(
  agentId: string,
  payload: { businessId?: string }
): Promise<FormSubmissionResult | null> {
  if (!isAIConfigured()) {
    throw new Error("AI integration not configured. Please ensure ANTHROPIC_API_KEY is set.");
  }

  let business;
  if (payload.businessId) {
    business = await storage.getBusiness(payload.businessId);
  } else {
    const businesses = await storage.getAllBusinesses();
    const leads = await storage.getAllLeads();
    const contactedLeadBusinessIds = new Set(
      leads.filter(l => l.status === "verified").map(l => l.businessId)
    );
    business = businesses.find(b => contactedLeadBusinessIds.has(b.id)) || businesses[0];
  }

  if (!business) {
    throw new Error("No businesses found to process. Add businesses first via the Crawler agent.");
  }

  const result = await chatCompletionJSON<FormSubmissionResult>(
    FORM_AGENT_SYSTEM_PROMPT,
    `Draft a contact form message for this business:

Business Name: "${business.name}"
Industry: ${business.industry || "Unknown"}
Location: ${business.city || "Hawaii"}, ${business.state || "HI"}
Website: ${business.website || "No website on file"}

Our services include managed IT support, custom web development, and technology consulting.
Draft a professional outreach message for their contact form.`
  );

  const leads = await storage.getLeadsByBusiness(business.id);
  const leadId = leads[0]?.id || business.id;

  await storage.createWebFormSubmission({
    leadId,
    endpoint: business.website ? `${business.website}/contact` : `https://${business.name.toLowerCase().replace(/\s+/g, '')}.com/contact`,
    payload: {
      subject: result.subject,
      message: result.message,
      formType: result.formType,
    },
  });

  await storage.createActivityLog({
    actorType: "agent",
    actorId: agentId,
    action: "form_drafted",
    metadata: {
      businessName: business.name,
      formType: result.formType,
      status: result.status,
    },
  });

  return result;
}
