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
    title: "Hawaii Web Design & IT Services | Edify Limited",
    description: "Professional web design for Hawaii businesses. We build conversion-focused websites that turn visitors into customers. Free strategy audit available."
  },
  services: {
    title: "Small Business Web Design & IT Services | Edify Limited",
    description: "Full-service technology partner for Hawaii businesses. Custom web development, managed IT, and digital marketing solutions that drive growth."
  },
  portfolio: {
    title: "Our Work - Web Design Portfolio | Edify Limited",
    description: "See real results from Hawaii businesses we've helped grow. Custom websites, dashboards, and digital solutions with proven ROI."
  },
  contact: {
    title: "Free Strategy Audit - Contact Us | Edify Limited",
    description: "Schedule your free strategy audit. We'll identify growth opportunities and technical issues holding your Hawaii business back. No obligation."
  }
};

export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
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
}

export function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
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
