/**
 * Sample Site Generator Service
 *
 * Generates personalized mock websites for leads based on:
 * - Business info from the crawler
 * - Online presence data from the verifier agent
 * - AI-generated content tailored to their industry
 *
 * These sample sites are used in nurturing emails to show leads
 * what their website could look like, with a QR code for easy mobile viewing.
 */

import { storage } from "../storage";
import { chatCompletionJSON, isAIConfigured } from "../ai/client";
import QRCode from "qrcode";

// Industry-specific color schemes
const INDUSTRY_COLORS: Record<string, { primary: string; secondary: string; accent: string }> = {
  restaurant: { primary: "#D32F2F", secondary: "#FFA000", accent: "#4CAF50" },
  salon: { primary: "#E91E63", secondary: "#9C27B0", accent: "#FFD700" },
  spa: { primary: "#00BCD4", secondary: "#4DB6AC", accent: "#B2DFDB" },
  automotive: { primary: "#1565C0", secondary: "#424242", accent: "#FF5722" },
  contractor: { primary: "#FF6F00", secondary: "#37474F", accent: "#FFC107" },
  plumber: { primary: "#0277BD", secondary: "#01579B", accent: "#4FC3F7" },
  electrician: { primary: "#FFC107", secondary: "#212121", accent: "#FF9800" },
  landscaping: { primary: "#2E7D32", secondary: "#8D6E63", accent: "#81C784" },
  retail: { primary: "#7B1FA2", secondary: "#303F9F", accent: "#FF4081" },
  fitness: { primary: "#FF5722", secondary: "#212121", accent: "#76FF03" },
  healthcare: { primary: "#00897B", secondary: "#1565C0", accent: "#80DEEA" },
  default: { primary: "#1976D2", secondary: "#455A64", accent: "#FF7043" },
};

// Industry-specific hero images (using Unsplash)
const INDUSTRY_IMAGES: Record<string, string> = {
  restaurant: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200",
  salon: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200",
  spa: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200",
  automotive: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1200",
  contractor: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200",
  plumber: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=1200",
  electrician: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200",
  landscaping: "https://images.unsplash.com/photo-1558904541-efa843a96f01?w=1200",
  retail: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200",
  fitness: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200",
  healthcare: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200",
  default: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200",
};

interface SampleSiteData {
  businessName: string;
  industry: string;
  city: string;
  tagline: string;
  aboutText: string;
  services: Array<{ name: string; description: string; price?: string }>;
  testimonials: Array<{ name: string; text: string; rating: number }>;
  colorScheme: { primary: string; secondary: string; accent: string };
  heroImageUrl: string;
  contactInfo: {
    phone?: string;
    email?: string;
    address?: string;
    hours?: string;
  };
}

/**
 * Generate a URL-friendly slug from a business name
 */
function generateSlug(businessName: string, city?: string): string {
  const base = businessName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "")
    .substring(0, 20);

  const cityPart = city
    ? city.toLowerCase().replace(/[^a-z0-9]/g, "").substring(0, 10)
    : "";

  const random = Math.random().toString(36).substring(2, 6);

  return `${base}${cityPart}${random}`;
}

/**
 * Get color scheme based on industry
 */
function getColorScheme(industry?: string): { primary: string; secondary: string; accent: string } {
  if (!industry) return INDUSTRY_COLORS.default;

  const normalizedIndustry = industry.toLowerCase();

  for (const [key, colors] of Object.entries(INDUSTRY_COLORS)) {
    if (normalizedIndustry.includes(key)) {
      return colors;
    }
  }

  return INDUSTRY_COLORS.default;
}

/**
 * Get hero image based on industry
 */
function getHeroImage(industry?: string): string {
  if (!industry) return INDUSTRY_IMAGES.default;

  const normalizedIndustry = industry.toLowerCase();

  for (const [key, imageUrl] of Object.entries(INDUSTRY_IMAGES)) {
    if (normalizedIndustry.includes(key)) {
      return imageUrl;
    }
  }

  return INDUSTRY_IMAGES.default;
}

/**
 * Use AI to generate sample site content based on business data
 */
async function generateSiteContent(
  businessName: string,
  industry: string,
  city: string,
  onlinePresence: {
    yelpRating?: number;
    yelpReviewCount?: number;
    googleRating?: number;
    googleReviewCount?: number;
    socialPlatforms?: string[];
  }
): Promise<{
  tagline: string;
  aboutText: string;
  services: Array<{ name: string; description: string; price?: string }>;
  testimonials: Array<{ name: string; text: string; rating: number }>;
}> {
  const prompt = `Generate website content for a ${industry} business called "${businessName}" located in ${city}, Hawaii.

Business Context:
- Yelp Rating: ${onlinePresence.yelpRating || "N/A"} (${onlinePresence.yelpReviewCount || 0} reviews)
- Google Rating: ${onlinePresence.googleRating || "N/A"} (${onlinePresence.googleReviewCount || 0} reviews)
- Social Media: ${onlinePresence.socialPlatforms?.join(", ") || "None found"}

Generate the following in JSON format:
{
  "tagline": "A compelling 5-10 word tagline for the business",
  "aboutText": "A warm, professional 2-3 sentence about section highlighting what makes this business special in Hawaii",
  "services": [
    { "name": "Service 1", "description": "Brief description", "price": "$XX" },
    { "name": "Service 2", "description": "Brief description", "price": "$XX" },
    { "name": "Service 3", "description": "Brief description", "price": "$XX" }
  ],
  "testimonials": [
    { "name": "First Name L.", "text": "Realistic positive review", "rating": 5 },
    { "name": "First Name L.", "text": "Realistic positive review", "rating": 5 }
  ]
}

Make the content feel authentic to Hawaii (use "mahalo", reference local culture where appropriate).
Services should be realistic for the ${industry} industry with typical Hawaii pricing.
Testimonials should feel genuine and mention specific positive experiences.

Return ONLY the JSON, no other text.`;

  if (!isAIConfigured()) {
    console.log("[SampleSiteGenerator] AI not configured, using fallback content");
    return getFallbackContent(businessName, industry, city);
  }

  try {
    const result = await chatCompletionJSON<{
      tagline: string;
      aboutText: string;
      services: Array<{ name: string; description: string; price?: string }>;
      testimonials: Array<{ name: string; text: string; rating: number }>;
    }>(
      "You are a website content writer creating sample website content for Hawaii local businesses. Generate compelling, authentic content.",
      prompt
    );
    return result;
  } catch (error) {
    console.error("[SampleSiteGenerator] AI generation failed:", error);
  }

  // Fallback content if AI fails
  return getFallbackContent(businessName, industry, city);
}

function getFallbackContent(businessName: string, industry: string, city: string) {
  return {
    tagline: `Your Trusted ${industry} in ${city}`,
    aboutText: `Welcome to ${businessName}! We're proud to serve the ${city} community with exceptional ${industry.toLowerCase()} services. Our team is dedicated to providing the aloha spirit in everything we do. Mahalo for considering us!`,
    services: [
      { name: "Premium Service", description: "Our most popular offering", price: "Call for pricing" },
      { name: "Standard Service", description: "Great value for quality work", price: "Call for pricing" },
      { name: "Consultation", description: "Free estimate and consultation", price: "Free" },
    ],
    testimonials: [
      { name: "Sarah K.", text: `Amazing experience at ${businessName}! The team was professional and friendly. Highly recommend!`, rating: 5 },
      { name: "Mike T.", text: "Best service on the island. They really know what they're doing. Mahalo!", rating: 5 },
    ],
  };
}

/**
 * Generate a QR code data URL for a sample site
 */
async function generateQRCode(url: string): Promise<string> {
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(url, {
      width: 200,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    });
    return qrCodeDataUrl;
  } catch (error) {
    console.error("[SampleSiteGenerator] QR code generation failed:", error);
    return "";
  }
}

/**
 * Generate a complete sample site for a lead
 */
export async function generateSampleSite(
  leadId: string,
  businessId: string,
  baseUrl: string = "https://edifylimited.tech"
): Promise<{
  sampleSiteId: string;
  slug: string;
  url: string;
  qrCodeDataUrl: string;
} | null> {
  try {
    // Get business data
    const business = await storage.getBusiness(businessId);
    if (!business) {
      console.error("[SampleSiteGenerator] Business not found:", businessId);
      return null;
    }

    // Get online presence data from verifier agent
    const onlinePresence = await storage.getOnlinePresenceByBusiness(businessId);

    // Get contact info
    const contacts = await storage.getContactsByBusiness(businessId);
    const primaryContact = contacts[0];

    // Determine industry (from business or presence check)
    const industry = business.industry || onlinePresence?.recommendation?.split(" ")[0] || "Business";
    const city = business.city || "Hawaii";

    // Generate URL slug
    const slug = generateSlug(business.name, city);
    const siteUrl = `${baseUrl}/sample/${slug}`;

    // Get color scheme and hero image based on industry
    const colorScheme = getColorScheme(industry);
    const heroImageUrl = getHeroImage(industry);

    // Build social platforms list
    const socialPlatforms: string[] = [];
    if (onlinePresence?.facebookUrl) socialPlatforms.push("Facebook");
    if (onlinePresence?.instagramUrl) socialPlatforms.push("Instagram");
    if (onlinePresence?.twitterUrl) socialPlatforms.push("Twitter");

    // Generate AI content
    const content = await generateSiteContent(business.name, industry, city, {
      yelpRating: onlinePresence?.yelpRating ?? undefined,
      yelpReviewCount: onlinePresence?.yelpReviewCount ?? undefined,
      googleRating: onlinePresence?.googleRating ?? undefined,
      googleReviewCount: undefined, // Not stored in current schema
      socialPlatforms,
    });

    // Generate QR code
    const qrCodeDataUrl = await generateQRCode(siteUrl);

    // Build contact info
    const contactInfo = {
      phone: primaryContact?.phone || business.phone || undefined,
      email: primaryContact?.email || undefined,
      address: business.address || undefined,
      hours: "Mon-Fri: 9am-6pm, Sat: 10am-4pm",
    };

    // Set expiration (30 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // Create sample site record (pending approval - won't be included in emails until approved)
    const sampleSite = await storage.createSampleSite({
      leadId,
      businessId,
      slug,
      businessName: business.name,
      tagline: content.tagline,
      industry,
      heroImageUrl,
      colorScheme,
      aboutText: content.aboutText,
      servicesJson: content.services,
      contactInfo,
      testimonials: content.testimonials,
      galleryImages: [],
      hasOnlineBooking: true,
      hasContactForm: true,
      hasGoogleMap: true,
      hasSocialLinks: socialPlatforms.length > 0,
      qrCodeDataUrl,
      status: "pending_approval",
      approvalStatus: "pending",
      expiresAt,
    });

    // Add to approval queue for human review
    await storage.createApprovalQueueItem({
      itemType: "sample_site",
      itemId: sampleSite.id,
      leadId,
      businessName: business.name,
      previewTitle: `Sample Website: ${business.name}`,
      previewContent: content.tagline || `${industry} website preview`,
      status: "pending",
      priority: 1, // Sample sites are high priority
    });

    console.log(`[SampleSiteGenerator] Created sample site for ${business.name} (pending approval): ${siteUrl}`);

    return {
      sampleSiteId: sampleSite.id,
      slug,
      url: siteUrl,
      qrCodeDataUrl,
      status: "pending_approval", // Let caller know it needs approval
    };
  } catch (error) {
    console.error("[SampleSiteGenerator] Failed to generate sample site:", error);
    return null;
  }
}

/**
 * Get sample site by slug
 */
export async function getSampleSiteBySlug(slug: string) {
  return storage.getSampleSiteBySlug(slug);
}

/**
 * Record a view of a sample site
 */
export async function recordSampleSiteView(slug: string) {
  const site = await storage.getSampleSiteBySlug(slug);
  if (site) {
    await storage.updateSampleSite(site.id, {
      viewCount: (site.viewCount || 0) + 1,
      lastViewedAt: new Date(),
    });

    // Create activity log for the view
    await storage.createActivityLog({
      actorType: "system",
      actorId: "sample-site-viewer",
      leadId: site.leadId,
      action: "sample_site_viewed",
      metadata: {
        sampleSiteId: site.id,
        slug,
        viewCount: (site.viewCount || 0) + 1,
      },
    });

    return true;
  }
  return false;
}

/**
 * Generate HTML template for sample site
 */
export function generateSampleSiteHTML(site: {
  businessName: string;
  tagline?: string | null;
  industry?: string | null;
  heroImageUrl?: string | null;
  colorScheme?: { primary: string; secondary: string; accent: string } | null;
  aboutText?: string | null;
  servicesJson?: Array<{ name: string; description: string; price?: string }> | null;
  contactInfo?: { phone?: string; email?: string; address?: string; hours?: string } | null;
  testimonials?: Array<{ name: string; text: string; rating: number }> | null;
  hasOnlineBooking?: boolean | null;
  hasContactForm?: boolean | null;
}): string {
  const colors = site.colorScheme || INDUSTRY_COLORS.default;
  const services = site.servicesJson || [];
  const testimonials = site.testimonials || [];
  const contact = site.contactInfo || {};

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${site.businessName} - Sample Website</title>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Poppins', sans-serif; color: #333; line-height: 1.6; }

    /* Color Variables */
    :root {
      --primary: ${colors.primary};
      --secondary: ${colors.secondary};
      --accent: ${colors.accent};
    }

    /* Header & Hero */
    .hero {
      background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
      color: white;
      padding: 20px;
      text-align: center;
    }
    .hero h1 { font-size: 2.5rem; margin-bottom: 10px; }
    .hero p { font-size: 1.2rem; opacity: 0.9; }
    .hero-image {
      width: 100%;
      height: 300px;
      object-fit: cover;
    }

    /* Navigation */
    .nav {
      background: white;
      padding: 15px 20px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .nav-brand { font-weight: 700; color: var(--primary); font-size: 1.3rem; }

    /* Sections */
    .section { padding: 60px 20px; max-width: 1200px; margin: 0 auto; }
    .section-title {
      font-size: 2rem;
      color: var(--primary);
      text-align: center;
      margin-bottom: 40px;
    }

    /* About */
    .about-text { text-align: center; font-size: 1.1rem; max-width: 800px; margin: 0 auto; }

    /* Services */
    .services-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 30px;
    }
    .service-card {
      background: white;
      border-radius: 15px;
      padding: 30px;
      box-shadow: 0 5px 20px rgba(0,0,0,0.1);
      transition: transform 0.3s;
    }
    .service-card:hover { transform: translateY(-5px); }
    .service-card h3 { color: var(--primary); margin-bottom: 10px; }
    .service-card .price { color: var(--accent); font-weight: 600; margin-top: 15px; }

    /* Testimonials */
    .testimonials { background: #f8f9fa; }
    .testimonial-card {
      background: white;
      border-radius: 15px;
      padding: 30px;
      margin-bottom: 20px;
      box-shadow: 0 3px 15px rgba(0,0,0,0.08);
    }
    .testimonial-card .stars { color: #FFD700; margin-bottom: 10px; }
    .testimonial-card .name { font-weight: 600; color: var(--secondary); margin-top: 15px; }

    /* CTA */
    .cta {
      background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
      color: white;
      text-align: center;
      padding: 60px 20px;
    }
    .cta h2 { font-size: 2rem; margin-bottom: 20px; }
    .cta-button {
      display: inline-block;
      background: var(--accent);
      color: white;
      padding: 15px 40px;
      border-radius: 30px;
      text-decoration: none;
      font-weight: 600;
      font-size: 1.1rem;
      transition: transform 0.3s;
    }
    .cta-button:hover { transform: scale(1.05); }

    /* Contact */
    .contact-info { text-align: center; }
    .contact-item { margin: 15px 0; font-size: 1.1rem; }
    .contact-item strong { color: var(--primary); }

    /* Footer */
    .footer {
      background: var(--secondary);
      color: white;
      text-align: center;
      padding: 30px;
    }

    /* Banner */
    .demo-banner {
      background: var(--accent);
      color: white;
      text-align: center;
      padding: 15px;
      font-weight: 500;
    }
    .demo-banner a { color: white; text-decoration: underline; }

    @media (max-width: 768px) {
      .hero h1 { font-size: 1.8rem; }
      .section-title { font-size: 1.5rem; }
    }
  </style>
</head>
<body>
  <div class="demo-banner">
    This is a sample website preview. <a href="https://edifylimited.tech">Contact Edify Limited</a> to get your own professional website!
  </div>

  <nav class="nav">
    <span class="nav-brand">${site.businessName}</span>
  </nav>

  <header class="hero">
    <h1>${site.businessName}</h1>
    <p>${site.tagline || `Quality ${site.industry || 'services'} in Hawaii`}</p>
  </header>

  ${site.heroImageUrl ? `<img src="${site.heroImageUrl}" alt="${site.businessName}" class="hero-image">` : ''}

  <section class="section">
    <h2 class="section-title">About Us</h2>
    <p class="about-text">${site.aboutText || `Welcome to ${site.businessName}! We're dedicated to providing exceptional service to our community.`}</p>
  </section>

  <section class="section" style="background: #f8f9fa;">
    <h2 class="section-title">Our Services</h2>
    <div class="services-grid">
      ${services.map(service => `
        <div class="service-card">
          <h3>${service.name}</h3>
          <p>${service.description}</p>
          ${service.price ? `<p class="price">${service.price}</p>` : ''}
        </div>
      `).join('')}
    </div>
  </section>

  <section class="section testimonials">
    <h2 class="section-title">What Our Customers Say</h2>
    ${testimonials.map(t => `
      <div class="testimonial-card">
        <div class="stars">${'★'.repeat(t.rating)}${'☆'.repeat(5 - t.rating)}</div>
        <p>"${t.text}"</p>
        <p class="name">- ${t.name}</p>
      </div>
    `).join('')}
  </section>

  <section class="cta">
    <h2>Ready to Experience the Best?</h2>
    <p style="margin-bottom: 30px; opacity: 0.9;">Book your appointment today!</p>
    ${site.hasOnlineBooking ? '<a href="#" class="cta-button">Book Now</a>' : ''}
  </section>

  <section class="section">
    <h2 class="section-title">Contact Us</h2>
    <div class="contact-info">
      ${contact.phone ? `<p class="contact-item"><strong>Phone:</strong> ${contact.phone}</p>` : ''}
      ${contact.email ? `<p class="contact-item"><strong>Email:</strong> ${contact.email}</p>` : ''}
      ${contact.address ? `<p class="contact-item"><strong>Address:</strong> ${contact.address}</p>` : ''}
      ${contact.hours ? `<p class="contact-item"><strong>Hours:</strong> ${contact.hours}</p>` : ''}
    </div>
  </section>

  <footer class="footer">
    <p>&copy; ${new Date().getFullYear()} ${site.businessName}. Sample website by <a href="https://edifylimited.tech" style="color: var(--accent);">Edify Limited</a></p>
  </footer>
</body>
</html>`;
}
