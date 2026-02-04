import { chatCompletionJSON, isAIConfigured } from "../client";
import { storage } from "../../storage";
import { eventBus } from "../../eventBus";

interface ExtractedContact {
  fullName: string;
  role: string;
  phone?: string;
  email?: string;
}

interface ContactExtractionResult {
  contacts: ExtractedContact[];
  source: string;
  reasoning: string;
}

const CONTACT_SYSTEM_PROMPT = `You are a contact intelligence extraction agent.
Your task is to generate realistic contact information for a business based on its profile.

For a given business, generate likely contacts:
- fullName: Full name of the contact
- role: Their role (owner, manager, sales, etc.)
- phone: Phone number in format 808-XXX-XXXX for Hawaii
- email: Email address (firstname@businessdomain.com format)

Generate 1-3 contacts per business. Focus on decision makers.

Return your response as JSON:
{
  "contacts": [...],
  "source": "extracted from business profile",
  "reasoning": "why these contacts are likely"
}`;

export async function runContactAgent(
  agentId: string,
  payload: { businessId: string }
): Promise<ContactExtractionResult | null> {
  if (!isAIConfigured()) {
    throw new Error("AI integration not configured. Please ensure Replit AI Integrations is set up.");
  }

  const business = await storage.getBusiness(payload.businessId);
  if (!business) return null;

  const result = await chatCompletionJSON<ContactExtractionResult>(
    CONTACT_SYSTEM_PROMPT,
    `Extract contacts for: "${business.name}" - Industry: ${business.industry || "Unknown"}, Location: ${business.city || "Hawaii"}`
  );

  const contacts = result.contacts ?? [];
  for (const contactData of contacts) {
    const contact = await storage.createContact({
      businessId: business.id,
      fullName: contactData.fullName || "Unknown Contact",
      role: contactData.role || null,
      phone: contactData.phone || null,
      email: contactData.email || null,
      source: "ai_extraction",
      verified: false,
      isDnc: false,
    });

    await eventBus.publish("CONTACT_ENRICHED", {
      business_id: business.id,
      contact_id: contact.id,
      contact_name: contact.fullName,
    }, { sourceAgent: agentId });

    await storage.createActivityLog({
      actorType: "agent",
      actorId: agentId,
      action: "contact_extracted",
      metadata: { 
        businessName: business.name, 
        contactName: contact.fullName,
        role: contact.role,
      },
    });
  }

  return result;
}
