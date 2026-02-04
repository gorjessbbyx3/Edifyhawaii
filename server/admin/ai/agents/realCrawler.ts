import { storage } from "../../storage";
import { eventBus } from "../../eventBus";
import { businessSourceEnum } from "@shared/schema";

interface GooglePlace {
  displayName: { text: string };
  formattedAddress?: string;
  location?: { latitude: number; longitude: number };
  types?: string[];
  primaryType?: string;
  nationalPhoneNumber?: string;
  websiteUri?: string;
}

interface YelpBusiness {
  id: string;
  name: string;
  location: {
    address1?: string;
    city?: string;
    state?: string;
    zip_code?: string;
  };
  categories?: { alias: string; title: string }[];
  phone?: string;
  url?: string;
}

interface CrawlerResult {
  businesses: {
    name: string;
    industry: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    zip: string | null;
    source: typeof businessSourceEnum[number];
    phone?: string;
    website?: string;
  }[];
  source: string;
  totalFound: number;
  errors: string[];
}

async function searchGooglePlaces(
  query: string,
  location: { lat: number; lng: number },
  apiKey: string
): Promise<GooglePlace[]> {
  const url = "https://places.googleapis.com/v1/places:searchNearby";
  
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.location,places.types,places.primaryType,places.nationalPhoneNumber,places.websiteUri"
    },
    body: JSON.stringify({
      locationRestriction: {
        circle: {
          center: { latitude: location.lat, longitude: location.lng },
          radius: 10000.0
        }
      },
      includedTypes: getGooglePlaceTypes(query),
      maxResultCount: 20
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Google Places API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.places || [];
}

async function searchYelp(
  term: string,
  location: string,
  apiKey: string
): Promise<YelpBusiness[]> {
  const url = new URL("https://api.yelp.com/v3/businesses/search");
  url.searchParams.set("term", term);
  url.searchParams.set("location", location);
  url.searchParams.set("limit", "20");

  const response = await fetch(url.toString(), {
    headers: {
      "Authorization": `Bearer ${apiKey}`
    }
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Yelp API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.businesses || [];
}

function getGooglePlaceTypes(query: string): string[] {
  const q = query.toLowerCase();
  
  if (q.includes("restaurant") || q.includes("food") || q.includes("dining")) {
    return ["restaurant", "cafe", "bakery"];
  }
  if (q.includes("hotel") || q.includes("accommodation") || q.includes("lodging")) {
    return ["hotel", "lodging", "resort_hotel"];
  }
  if (q.includes("retail") || q.includes("shop") || q.includes("store")) {
    return ["store", "shopping_mall", "clothing_store"];
  }
  if (q.includes("contractor") || q.includes("construction") || q.includes("plumber")) {
    return ["general_contractor", "plumber", "electrician"];
  }
  if (q.includes("salon") || q.includes("spa") || q.includes("beauty")) {
    return ["beauty_salon", "spa", "hair_salon"];
  }
  if (q.includes("auto") || q.includes("car") || q.includes("mechanic")) {
    return ["car_repair", "car_dealer", "car_wash"];
  }
  if (q.includes("health") || q.includes("medical") || q.includes("doctor")) {
    return ["doctor", "dentist", "hospital"];
  }
  if (q.includes("fitness") || q.includes("gym")) {
    return ["gym", "fitness_center"];
  }
  return ["establishment"];
}

function extractIndustry(place: GooglePlace): string | null {
  if (place.primaryType) {
    return place.primaryType.replace(/_/g, " ");
  }
  if (place.types && place.types.length > 0) {
    return place.types[0].replace(/_/g, " ");
  }
  return null;
}

function parseAddress(formattedAddress: string): { address: string | null; city: string | null; state: string | null; zip: string | null } {
  if (!formattedAddress) {
    return { address: null, city: null, state: null, zip: null };
  }
  
  const parts = formattedAddress.split(", ");
  if (parts.length >= 3) {
    const address = parts[0];
    const city = parts[1];
    const stateZip = parts[2].split(" ");
    const state = stateZip[0] || null;
    const zip = stateZip[1] || null;
    return { address, city, state, zip };
  }
  
  return { address: formattedAddress, city: null, state: null, zip: null };
}

const HAWAII_LOCATIONS: Record<string, { lat: number; lng: number }> = {
  "honolulu": { lat: 21.3069, lng: -157.8583 },
  "oahu": { lat: 21.4389, lng: -158.0001 },
  "maui": { lat: 20.7984, lng: -156.3319 },
  "kona": { lat: 19.6400, lng: -155.9969 },
  "hilo": { lat: 19.7297, lng: -155.0900 },
  "kauai": { lat: 22.0964, lng: -159.5261 },
  "big island": { lat: 19.5429, lng: -155.6659 },
  "hawaii": { lat: 21.3069, lng: -157.8583 },
  "default": { lat: 21.3069, lng: -157.8583 }
};

function getLocationCoords(location: string): { lat: number; lng: number } {
  const loc = location.toLowerCase();
  for (const [key, coords] of Object.entries(HAWAII_LOCATIONS)) {
    if (loc.includes(key)) {
      return coords;
    }
  }
  return HAWAII_LOCATIONS.default;
}

export async function runRealCrawlerAgent(
  agentId: string,
  payload: { query?: string; location?: string; industry?: string }
): Promise<CrawlerResult> {
  const googleApiKey = process.env.GOOGLE_PLACES_API_KEY;
  const yelpApiKey = process.env.YELP_API_KEY;

  if (!googleApiKey && !yelpApiKey) {
    throw new Error(
      "No API keys configured. Please provide either GOOGLE_PLACES_API_KEY or YELP_API_KEY to search for real businesses."
    );
  }

  const location = payload.location || "Hawaii";
  const searchTerm = payload.query || payload.industry || "small business";
  const result: CrawlerResult = {
    businesses: [],
    source: "",
    totalFound: 0,
    errors: []
  };

  if (googleApiKey) {
    try {
      const coords = getLocationCoords(location);
      const places = await searchGooglePlaces(searchTerm, coords, googleApiKey);
      
      for (const place of places) {
        const parsed = parseAddress(place.formattedAddress || "");
        result.businesses.push({
          name: place.displayName?.text || "Unknown Business",
          industry: extractIndustry(place),
          address: parsed.address,
          city: parsed.city,
          state: parsed.state || "HI",
          zip: parsed.zip,
          source: "google_maps",
          phone: place.nationalPhoneNumber,
          website: place.websiteUri
        });
      }
      result.source = "google_maps";
      result.totalFound += places.length;
    } catch (error) {
      result.errors.push(`Google Places: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  if (yelpApiKey) {
    try {
      const locationStr = `${location}, HI`;
      const businesses = await searchYelp(searchTerm, locationStr, yelpApiKey);
      
      for (const biz of businesses) {
        const exists = result.businesses.some(
          b => b.name.toLowerCase() === biz.name.toLowerCase()
        );
        if (!exists) {
          result.businesses.push({
            name: biz.name,
            industry: biz.categories?.[0]?.title || null,
            address: biz.location.address1 || null,
            city: biz.location.city || null,
            state: biz.location.state || "HI",
            zip: biz.location.zip_code || null,
            source: "yelp",
            phone: biz.phone,
            website: biz.url
          });
        }
      }
      result.source = result.source ? `${result.source},yelp` : "yelp";
      result.totalFound += businesses.length;
    } catch (error) {
      result.errors.push(`Yelp: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  if (result.businesses.length === 0 && result.errors.length > 0) {
    throw new Error(`Failed to fetch businesses: ${result.errors.join("; ")}`);
  }

  // Get existing businesses to check for duplicates
  const existingBusinesses = await storage.getAllBusinesses();
  const existingNames = new Set(
    existingBusinesses.map(b => `${b.name.toLowerCase().trim()}|${(b.city || '').toLowerCase().trim()}`)
  );

  let newCount = 0;
  let skippedCount = 0;

  for (const bizData of result.businesses) {
    // Check if business already exists by name + city combination
    const key = `${bizData.name.toLowerCase().trim()}|${(bizData.city || '').toLowerCase().trim()}`;
    if (existingNames.has(key)) {
      skippedCount++;
      continue; // Skip duplicate
    }
    
    // Add to set to prevent duplicates within this batch
    existingNames.add(key);

    const business = await storage.createBusiness({
      name: bizData.name,
      industry: bizData.industry,
      address: bizData.address,
      city: bizData.city,
      state: bizData.state,
      zip: bizData.zip,
      source: bizData.source,
      phone: bizData.phone,
      website: bizData.website,
    });

    await eventBus.publish("BUSINESS_DISCOVERED", {
      business_id: business.id,
      business_name: business.name,
      source: business.source,
    }, { sourceAgent: agentId });

    const lead = await storage.createLead({
      businessId: business.id,
      organizationId: "org-default",
      status: "new",
      score: 70,
    });

    await eventBus.publish("LEAD_CREATED", {
      lead_id: lead.id,
      business_id: business.id,
      initial_score: lead.score,
    }, { sourceAgent: agentId });

    await storage.createActivityLog({
      actorType: "agent",
      actorId: agentId,
      leadId: lead.id,
      action: "business_discovered",
      metadata: { 
        businessName: business.name, 
        source: business.source,
        phone: bizData.phone,
        website: bizData.website
      },
    });
    
    newCount++;
  }

  console.log(`Crawler: Found ${result.totalFound} businesses, created ${newCount} new leads, skipped ${skippedCount} duplicates`);

  return {
    ...result,
    totalFound: newCount,
    errors: skippedCount > 0 
      ? [...result.errors, `Skipped ${skippedCount} duplicate businesses already in database`]
      : result.errors
  };
}
