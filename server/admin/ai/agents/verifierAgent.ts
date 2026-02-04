import { chatCompletionJSON, isAIConfigured } from "../client";
import { storage } from "../../storage";
import { eventBus } from "../../eventBus";

interface VerificationResult {
  // Website
  hasWebsite: boolean;
  websiteActive: boolean;
  websiteUrl: string | null;
  websiteQuality: "none" | "basic" | "professional";
  // Google Business
  hasGoogleBusiness: boolean;
  googleBusinessUrl: string | null;
  googleRating: number | null;
  googleReviewCount: number | null;
  // Yelp
  hasYelp: boolean;
  yelpUrl: string | null;
  yelpRating: number | null;
  yelpReviewCount: number | null;
  // Social Media
  hasSocialMedia: boolean;
  facebookUrl: string | null;
  instagramUrl: string | null;
  twitterUrl: string | null;
  linkedinUrl: string | null;
  tiktokUrl: string | null;
  // Overall
  onlinePresenceStrength: "none" | "weak" | "moderate" | "strong";
  confidenceScore: number;
  reasoning: string;
  recommendation: "prospect" | "archive";
}

const VERIFIER_SYSTEM_PROMPT = `You are an online presence verification agent for a web services company targeting Hawaii businesses.
Your job is to thoroughly research and document a business's online presence, including finding all their social media accounts and review profiles.

For each business, you must:

1. **Website Analysis:**
   - Check if they have a website
   - If found, provide the full URL
   - Assess quality: "none", "basic" (simple/outdated), or "professional"

2. **Google Business Profile:**
   - Search for their Google Business listing
   - If found, provide the Google Maps URL (format: https://www.google.com/maps/place/...)
   - Note their star rating (1.0-5.0) and review count if visible

3. **Yelp Profile:**
   - Search for their Yelp business page
   - If found, provide the full Yelp URL (format: https://www.yelp.com/biz/...)
   - Note their star rating (1.0-5.0) and review count

4. **Social Media Accounts:**
   - Facebook page URL (https://www.facebook.com/...)
   - Instagram profile URL (https://www.instagram.com/...)
   - Twitter/X URL (https://twitter.com/... or https://x.com/...)
   - LinkedIn company page URL
   - TikTok URL if they have one

Based on findings, determine online presence strength:
- "none": No website, minimal or no social media, no Google/Yelp
- "weak": Only has Yelp/Facebook page OR basic/outdated website
- "moderate": Has website + some active social profiles + reviews
- "strong": Professional website, active social media, good reviews

IMPORTANT - Recommendation Logic:
- "none" or "weak" → recommendation: "prospect" (they NEED a website!)
- "moderate" or "strong" → recommendation: "archive" (already established)

For Hawaii businesses, consider:
- Many use Facebook as their only web presence (WEAK - they need a real site)
- Local businesses often rely only on Yelp (WEAK - they need their own site)
- Businesses with just a phone number are EXCELLENT prospects

Return valid JSON with ALL these fields (use null for URLs not found):
{
  "hasWebsite": boolean,
  "websiteActive": boolean,
  "websiteUrl": "url or null",
  "websiteQuality": "none" | "basic" | "professional",
  "hasGoogleBusiness": boolean,
  "googleBusinessUrl": "url or null",
  "googleRating": number or null,
  "googleReviewCount": number or null,
  "hasYelp": boolean,
  "yelpUrl": "url or null",
  "yelpRating": number or null,
  "yelpReviewCount": number or null,
  "hasSocialMedia": boolean,
  "facebookUrl": "url or null",
  "instagramUrl": "url or null",
  "twitterUrl": "url or null",
  "linkedinUrl": "url or null",
  "tiktokUrl": "url or null",
  "onlinePresenceStrength": "none" | "weak" | "moderate" | "strong",
  "confidenceScore": 0-100,
  "reasoning": "detailed explanation of findings",
  "recommendation": "prospect" | "archive"
}`;

export async function runVerifierAgent(
  agentId: string,
  payload: { businessId: string }
): Promise<VerificationResult | null> {
  if (!isAIConfigured()) {
    throw new Error("AI integration not configured. Please ensure Replit AI Integrations is set up.");
  }

  const business = await storage.getBusiness(payload.businessId);
  if (!business) return null;

  const websiteInfo = business.website
    ? `Website on file: ${business.website}`
    : "No website on file";

  const phoneInfo = business.phone
    ? `Phone: ${business.phone}`
    : "No phone on file";

  const addressInfo = business.address
    ? `Address: ${business.address}, ${business.city || ""}, ${business.state || "HI"}`
    : `Location: ${business.city || "Hawaii"}, ${business.state || "HI"}`;

  const result = await chatCompletionJSON<VerificationResult>(
    VERIFIER_SYSTEM_PROMPT,
    `Research and document the complete online presence for this Hawaii business:

Business Name: "${business.name}"
Industry: ${business.industry || "Unknown"}
${addressInfo}
${websiteInfo}
${phoneInfo}

Please search for and document:
1. Their website (if any) and its quality
2. Google Business profile with rating and reviews
3. Yelp page with rating and reviews
4. All social media accounts (Facebook, Instagram, Twitter, LinkedIn, TikTok)

Provide complete URLs for everything you find. Determine if this business needs our web services help.`
  );

  // Save comprehensive online presence data
  await storage.createOnlinePresenceCheck({
    businessId: business.id,
    // Website
    websiteFound: result.hasWebsite ?? false,
    websiteUrl: result.websiteUrl || null,
    websiteActive: result.websiteActive ?? false,
    websiteQuality: result.websiteQuality || "none",
    domainChecked: business.website ?? null,
    // Google Business
    googleBusinessFound: result.hasGoogleBusiness ?? false,
    googleBusinessUrl: result.googleBusinessUrl || null,
    googleRating: result.googleRating || null,
    googleReviewCount: result.googleReviewCount || null,
    // Yelp
    yelpFound: result.hasYelp ?? false,
    yelpUrl: result.yelpUrl || null,
    yelpRating: result.yelpRating || null,
    yelpReviewCount: result.yelpReviewCount || null,
    // Social Media
    socialPresence: result.hasSocialMedia ?? false,
    facebookUrl: result.facebookUrl || null,
    instagramUrl: result.instagramUrl || null,
    twitterUrl: result.twitterUrl || null,
    linkedinUrl: result.linkedinUrl || null,
    tiktokUrl: result.tiktokUrl || null,
    // Overall
    onlinePresenceStrength: result.onlinePresenceStrength || "none",
    confidenceScore: result.confidenceScore ?? 0,
    reasoning: result.reasoning || null,
    recommendation: result.recommendation || "prospect",
  });

  const leads = await storage.getLeadsByBusiness(business.id);
  for (const lead of leads) {
    if (lead.status === "new") {
      const newStatus = result.recommendation === "archive" ? "archived" : "verified";

      const scoreBoost = result.recommendation === "prospect"
        ? (result.onlinePresenceStrength === "none" ? 30 : 15)
        : -20;

      await storage.updateLead(lead.id, {
        status: newStatus,
        score: Math.max(0, Math.min(100, (lead.score || 0) + scoreBoost))
      });

      if (newStatus === "verified") {
        await eventBus.publish("ONLINE_PRESENCE_VERIFIED", {
          business_id: business.id,
          lead_id: lead.id,
          confidence_score: result.confidenceScore,
          presence_strength: result.onlinePresenceStrength,
          yelp_url: result.yelpUrl,
          google_url: result.googleBusinessUrl,
          has_social_media: result.hasSocialMedia,
        }, { sourceAgent: agentId });
      }

      // Build detailed metadata with all found links
      const socialLinks: Record<string, string> = {};
      if (result.facebookUrl) socialLinks.facebook = result.facebookUrl;
      if (result.instagramUrl) socialLinks.instagram = result.instagramUrl;
      if (result.twitterUrl) socialLinks.twitter = result.twitterUrl;
      if (result.linkedinUrl) socialLinks.linkedin = result.linkedinUrl;
      if (result.tiktokUrl) socialLinks.tiktok = result.tiktokUrl;

      await storage.createActivityLog({
        actorType: "agent",
        actorId: agentId,
        leadId: lead.id,
        action: newStatus === "archived" ? "lead_archived" : "online_presence_verified",
        metadata: {
          businessName: business.name,
          onlinePresenceStrength: result.onlinePresenceStrength,
          recommendation: result.recommendation,
          reasoning: result.reasoning,
          confidenceScore: result.confidenceScore,
          websiteUrl: result.websiteUrl,
          websiteQuality: result.websiteQuality,
          googleBusinessUrl: result.googleBusinessUrl,
          googleRating: result.googleRating,
          googleReviewCount: result.googleReviewCount,
          yelpUrl: result.yelpUrl,
          yelpRating: result.yelpRating,
          yelpReviewCount: result.yelpReviewCount,
          socialMedia: socialLinks,
        },
      });
    }
  }

  return result;
}
