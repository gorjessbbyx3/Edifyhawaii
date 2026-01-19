import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  type?: "website" | "article";
  structuredData?: object;
}

export function SEO({ 
  title, 
  description, 
  canonical,
  ogImage = "/og-image.png",
  type = "website",
  structuredData
}: SEOProps) {
  useEffect(() => {
    document.title = title;
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", description);
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = description;
      document.head.appendChild(meta);
    }

    const updateOrCreateMeta = (property: string, content: string, isName = false) => {
      const selector = isName ? `meta[name="${property}"]` : `meta[property="${property}"]`;
      let meta = document.querySelector(selector);
      if (meta) {
        meta.setAttribute("content", content);
      } else {
        meta = document.createElement("meta");
        if (isName) {
          meta.setAttribute("name", property);
        } else {
          meta.setAttribute("property", property);
        }
        meta.setAttribute("content", content);
        document.head.appendChild(meta);
      }
    };

    updateOrCreateMeta("og:title", title);
    updateOrCreateMeta("og:description", description);
    updateOrCreateMeta("og:type", type);
    updateOrCreateMeta("og:image", ogImage);
    
    updateOrCreateMeta("twitter:card", "summary_large_image", true);
    updateOrCreateMeta("twitter:title", title, true);
    updateOrCreateMeta("twitter:description", description, true);
    updateOrCreateMeta("twitter:image", ogImage, true);

    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]');
      if (link) {
        link.setAttribute("href", canonical);
      } else {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        link.setAttribute("href", canonical);
        document.head.appendChild(link);
      }
    }

    if (structuredData) {
      const existingScript = document.getElementById("structured-data");
      if (existingScript) {
        existingScript.remove();
      }
      const script = document.createElement("script");
      script.id = "structured-data";
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }

    return () => {
      const script = document.getElementById("structured-data");
      if (script) {
        script.remove();
      }
    };
  }, [title, description, canonical, ogImage, type, structuredData]);

  return null;
}

export const seoConfig = {
  home: {
    title: "Edify, Ltd. | Premium Hawaii Web Design & Digital Growth Foundations",
    description: "Stop paying the 'silent tax' of a website that loses local leads. Partner with Edify to build the digital authority your Hawaii business deserves. Book your free audit today."
  },
  services: {
    title: "Hawaii Small Business Web Design & IT Services | Edify Limited",
    description: "Is your current website costing you Hawaii market share? Edify provides premium web design, managed IT, and digital growth solutions for local businesses."
  },
  portfolio: {
    title: "Hawaii Client Transformations - Web Design Case Studies | Edify",
    description: "Real growth stories from Hawaii businesses. See how Edify helped local companies increase leads, revenue, and digital authority through strategic web design."
  },
  contact: {
    title: "Free Growth Audit for Hawaii Businesses | Edify Limited",
    description: "Discover what's costing your Hawaii business leads and revenue. Book your free digital audit—we'll identify $5k+ in hidden growth opportunities or the session is free."
  }
};

export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>, includeContext = true) {
  const schema = {
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
  return includeContext ? { "@context": "https://schema.org", ...schema } : schema;
}

export function generateLocalBusinessSchema(includeContext = true) {
  const schema = {
    "@type": "ProfessionalService",
    "name": "Edify Limited",
    "description": "Hawaii-based IT services and web development company helping small businesses grow through technology.",
    "url": "https://edifyllc.com",
    "telephone": "+1-808-767-5460",
    "email": "edifyhawaii@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Honolulu",
      "addressRegion": "HI",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 21.3069,
      "longitude": -157.8583
    },
    "areaServed": {
      "@type": "State",
      "name": "Hawaii"
    },
    "priceRange": "$$",
    "openingHours": "Mo-Fr 08:00-17:00",
    "sameAs": [],
    "serviceType": ["Web Design", "IT Services", "Custom Software Development"]
  };
  return includeContext ? { "@context": "https://schema.org", ...schema } : schema;
}

export function generatePortfolioProjectSchema(project: { name: string, description: string, url?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": project.name,
    "description": project.description,
    "creator": {
      "@type": "Organization",
      "name": "Edify Limited"
    },
    ...(project.url && { "url": project.url })
  };
}

export function generateServiceOfferingSchema(includeContext = true) {
  const schema = {
    "@type": "ItemList",
    "name": "Edify Limited Service Offerings",
    "description": "Premium web design and IT services for Hawaii businesses",
    "itemListElement": [
      {
        "@type": "Service",
        "position": 1,
        "name": "Core Website Package",
        "description": "Professional business website with SEO optimization and mobile-responsive design",
        "provider": {
          "@type": "Organization",
          "name": "Edify Limited"
        },
        "areaServed": { "@type": "State", "name": "Hawaii" },
        "offers": {
          "@type": "Offer",
          "price": "3500",
          "priceCurrency": "USD",
          "priceValidUntil": "2026-12-31"
        },
        "serviceOutput": "Conversion-optimized website with local SEO",
        "termsOfService": "Full ownership of website and code"
      },
      {
        "@type": "Service",
        "position": 2,
        "name": "Pro Website Package",
        "description": "Custom design with advanced features, CMS, and ongoing support",
        "provider": {
          "@type": "Organization",
          "name": "Edify Limited"
        },
        "areaServed": { "@type": "State", "name": "Hawaii" },
        "offers": {
          "@type": "Offer",
          "price": "7500",
          "priceCurrency": "USD",
          "priceValidUntil": "2026-12-31"
        },
        "serviceOutput": "Full marketing website with content management",
        "termsOfService": "Full ownership plus 6 months support included"
      },
      {
        "@type": "Service",
        "position": 3,
        "name": "VIP Custom Software",
        "description": "Enterprise-grade custom software development with dedicated support",
        "provider": {
          "@type": "Organization",
          "name": "Edify Limited"
        },
        "areaServed": { "@type": "State", "name": "Hawaii" },
        "offers": {
          "@type": "Offer",
          "price": "15000",
          "priceCurrency": "USD",
          "priceValidUntil": "2026-12-31"
        },
        "serviceOutput": "Custom web application with ongoing maintenance",
        "termsOfService": "Full ownership plus 12 months priority support"
      }
    ]
  };
  return includeContext ? { "@context": "https://schema.org", ...schema } : schema;
}

export function generateCaseStudySchema(caseStudies: Array<{
  name: string;
  client: string;
  result: string;
  metric: string;
  description: string;
}>, includeContext = true) {
  const schema = {
    "@type": "ItemList",
    "name": "Edify Limited Client Success Stories",
    "description": "Real results from Hawaii businesses transformed by Edify",
    "itemListElement": caseStudies.map((study, index) => ({
      "@type": "Article",
      "position": index + 1,
      "headline": `${study.client} - ${study.result} ${study.metric}`,
      "name": study.name,
      "description": study.description,
      "author": {
        "@type": "Organization",
        "name": "Edify Limited"
      },
      "about": {
        "@type": "Thing",
        "name": study.metric,
        "description": `${study.result} improvement achieved for ${study.client}`
      }
    }))
  };
  return includeContext ? { "@context": "https://schema.org", ...schema } : schema;
}

export function generateOrganizationSchema(includeContext = true) {
  const schema = {
    "@type": "Organization",
    "name": "Edify Limited",
    "alternateName": "Edify, Ltd.",
    "url": "https://edifyllc.com",
    "logo": "https://edifyllc.com/logo.png",
    "description": "Hawaii's trusted technology partner providing premium web design, IT services, and custom software development for small businesses seeking digital growth.",
    "foundingLocation": {
      "@type": "Place",
      "name": "Honolulu, Hawaii"
    },
    "areaServed": [
      { "@type": "City", "name": "Honolulu" },
      { "@type": "City", "name": "Maui" },
      { "@type": "City", "name": "Kauai" },
      { "@type": "State", "name": "Hawaii" }
    ],
    "knowsAbout": [
      "Web Design",
      "Web Development",
      "Custom Software Development",
      "IT Services",
      "Local SEO",
      "Small Business Technology",
      "Hawaii Business Solutions"
    ],
    "slogan": "The Digital Foundation for Hawaii's Market Leaders",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-808-767-5460",
      "email": "edifyhawaii@gmail.com",
      "contactType": "sales",
      "areaServed": "Hawaii",
      "availableLanguage": "English"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Edify Services",
      "itemListElement": [
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Web Design" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Custom Software Development" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Managed IT Services" } }
      ]
    }
  };
  return includeContext ? { "@context": "https://schema.org", ...schema } : schema;
}
