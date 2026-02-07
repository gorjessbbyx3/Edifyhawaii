import { chatCompletionJSON, isAIConfigured } from "../client";
import { storage } from "../../storage";

interface ReportResult {
  summary: string;
  totalLeads: number;
  activeLeads: number;
  qualifiedLeads: number;
  closedLeads: number;
  archivedLeads: number;
  recommendations: string[];
  insights: string[];
}

const REPORTER_SYSTEM_PROMPT = `You are a CRM reporting and analytics agent for an IT services company targeting Hawaii businesses.
Given lead pipeline data, generate actionable insights and recommendations.

Return valid JSON:
{
  "summary": "brief overview of pipeline health",
  "totalLeads": number,
  "activeLeads": number,
  "qualifiedLeads": number,
  "closedLeads": number,
  "archivedLeads": number,
  "recommendations": ["actionable recommendation 1", ...],
  "insights": ["data insight 1", ...]
}`;

export async function runReporterAgent(
  agentId: string,
  payload: {}
): Promise<ReportResult> {
  if (!isAIConfigured()) {
    throw new Error("AI integration not configured. Please ensure ANTHROPIC_API_KEY is set.");
  }

  const leads = await storage.getAllLeads();
  const businesses = await storage.getAllBusinesses();

  const statusCounts: Record<string, number> = {};
  for (const lead of leads) {
    statusCounts[lead.status] = (statusCounts[lead.status] || 0) + 1;
  }

  const result = await chatCompletionJSON<ReportResult>(
    REPORTER_SYSTEM_PROMPT,
    `Generate a pipeline report based on this data:

Total Leads: ${leads.length}
Total Businesses: ${businesses.length}
Lead Status Breakdown: ${JSON.stringify(statusCounts)}
Average Lead Score: ${leads.length > 0 ? Math.round(leads.reduce((sum, l) => sum + (l.score || 0), 0) / leads.length) : 0}

Provide actionable recommendations for improving conversion rates and pipeline health.`
  );

  await storage.createActivityLog({
    actorType: "agent",
    actorId: agentId,
    action: "report_generated",
    metadata: {
      totalLeads: result.totalLeads,
      recommendations: result.recommendations?.length || 0,
      insights: result.insights?.length || 0,
    },
  });

  return result;
}
