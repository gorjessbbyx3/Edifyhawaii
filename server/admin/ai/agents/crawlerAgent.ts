import { runRealCrawlerAgent } from "./realCrawler";

interface CrawlerResult {
  businesses: {
    name: string;
    industry: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    zip: string | null;
    source: string;
    phone?: string;
    website?: string;
  }[];
  source: string;
  totalFound: number;
  errors?: string[];
}

export async function runCrawlerAgent(
  agentId: string,
  payload: { query?: string; location?: string; industry?: string }
): Promise<CrawlerResult> {
  const googleApiKey = process.env.GOOGLE_PLACES_API_KEY;
  const yelpApiKey = process.env.YELP_API_KEY;

  if (!googleApiKey && !yelpApiKey) {
    throw new Error(
      "No API keys configured for real business data. Please provide GOOGLE_PLACES_API_KEY (free tier: 5,000 searches/month) or YELP_API_KEY to discover real businesses."
    );
  }

  return runRealCrawlerAgent(agentId, payload);
}
