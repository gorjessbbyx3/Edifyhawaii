import { storage } from "../../storage";
import { eventBus } from "../../eventBus";
import { chatCompletionJSON, isAIConfigured } from "../client";

const VAPI_API_BASE = "https://api.vapi.ai";

interface VapiCallResponse {
  id: string;
  status: string;
  phoneNumberId: string;
  assistantId?: string;
  customer: {
    number: string;
    name?: string;
  };
  createdAt: string;
  startedAt?: string;
  endedAt?: string;
  transcript?: string;
  summary?: string;
  recordingUrl?: string;
  analysis?: {
    successEvaluation?: string;
    summary?: string;
    structuredData?: Record<string, unknown>;
  };
}

interface CallConfig {
  leadId: string;
  contactId: string;
  businessName: string;
  contactName: string;
  phoneNumber: string;
  industry?: string;
}

interface CallOutcomeAnalysis {
  outcome: "interested" | "not_interested" | "callback" | "no_answer" | "voicemail" | "wrong_number";
  sentiment: "positive" | "neutral" | "negative";
  notes: string;
  nextAction: string;
  appointmentRequested: boolean;
  keyObjections: string[];
}

const SALES_ASSISTANT_PROMPT = `You are a friendly, professional sales representative for a web services company.
Your goal is to introduce your company's web design and digital marketing services to small businesses.

Key behaviors:
1. Be warm, conversational, and respectful of their time
2. Ask permission-based questions: "Would you have a moment to chat?"
3. Focus on understanding their current challenges first
4. Mention you noticed they might benefit from a stronger online presence
5. If interested, offer to schedule a brief consultation
6. Handle objections with empathy, not pressure
7. Always respect "no" and offer to leave contact info

Opening line suggestion:
"Hi, this is [Agent Name] from [Company]. I was looking at local [industry] businesses in Hawaii and noticed [Business Name]. Do you have just a quick moment?"

Remember:
- Keep it short (under 2 minutes for cold calls)
- Listen more than you talk
- End calls gracefully regardless of outcome`;

function getVapiApiKey(): string | null {
  return process.env.VAPI_API_KEY || null;
}

function getVapiPhoneNumberId(): string | null {
  return process.env.VAPI_PHONE_NUMBER_ID || null;
}

function getVapiAssistantId(): string | null {
  return process.env.VAPI_ASSISTANT_ID || null;
}

export function isVapiConfigured(): boolean {
  return !!(getVapiApiKey() && getVapiPhoneNumberId());
}

export async function initiateVapiCall(config: CallConfig): Promise<VapiCallResponse> {
  const apiKey = getVapiApiKey();
  const phoneNumberId = getVapiPhoneNumberId();
  const assistantId = getVapiAssistantId();

  if (!apiKey) {
    throw new Error("VAPI_API_KEY not configured");
  }
  if (!phoneNumberId) {
    throw new Error("VAPI_PHONE_NUMBER_ID not configured");
  }

  const payload: Record<string, unknown> = {
    phoneNumberId,
    customer: {
      number: config.phoneNumber,
      name: config.contactName,
    },
    metadata: {
      leadId: config.leadId,
      contactId: config.contactId,
      businessName: config.businessName,
    },
  };

  if (assistantId) {
    payload.assistantId = assistantId;
    payload.assistantOverrides = {
      variableValues: {
        businessName: config.businessName,
        contactName: config.contactName,
        industry: config.industry || "business",
      },
    };
  } else {
    payload.assistant = {
      name: "Sales Assistant",
      firstMessage: `Hi, this is Sarah from Edify Limited. I was looking at local ${config.industry || "business"} services in Hawaii and came across ${config.businessName}. Do you have just a quick moment?`,
      model: {
        provider: "openai",
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: SALES_ASSISTANT_PROMPT.replace("[Business Name]", config.businessName)
              .replace("[industry]", config.industry || "business"),
          },
        ],
      },
      voice: {
        provider: "11labs",
        voiceId: "21m00Tcm4TlvDq8ikWAM",
      },
      endCallMessage: "Thanks for your time today. Have a great day!",
      endCallPhrases: ["goodbye", "bye", "not interested", "take me off your list"],
    };
  }

  const response = await fetch(`${VAPI_API_BASE}/call`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Vapi API error: ${response.status} - ${error}`);
  }

  return await response.json() as VapiCallResponse;
}

export async function getVapiCall(callId: string): Promise<VapiCallResponse> {
  const apiKey = getVapiApiKey();
  if (!apiKey) {
    throw new Error("VAPI_API_KEY not configured");
  }

  const response = await fetch(`${VAPI_API_BASE}/call/${callId}`, {
    headers: {
      "Authorization": `Bearer ${apiKey}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Vapi API error: ${response.status}`);
  }

  return await response.json() as VapiCallResponse;
}

export async function analyzeCallOutcome(transcript: string, summary?: string): Promise<CallOutcomeAnalysis> {
  if (!isAIConfigured()) {
    return {
      outcome: "no_answer",
      sentiment: "neutral",
      notes: "AI analysis not available",
      nextAction: "Manual review required",
      appointmentRequested: false,
      keyObjections: [],
    };
  }

  const result = await chatCompletionJSON<CallOutcomeAnalysis>(
    `You analyze sales call transcripts and determine the outcome.
    
Return JSON with:
- outcome: "interested" | "not_interested" | "callback" | "no_answer" | "voicemail" | "wrong_number"
- sentiment: "positive" | "neutral" | "negative"
- notes: Brief summary of what happened
- nextAction: Recommended next step
- appointmentRequested: boolean - did they agree to a meeting/callback?
- keyObjections: Array of objections raised`,
    `Analyze this call:
${summary ? `Summary: ${summary}\n` : ""}
Transcript:
${transcript}`
  );

  return result;
}

export async function runCallerAgent(
  agentId: string,
  payload: { leadId: string; contactId: string }
): Promise<{ callId: string; status: string } | null> {
  if (!isVapiConfigured()) {
    throw new Error("Vapi not configured. Set VAPI_API_KEY and VAPI_PHONE_NUMBER_ID.");
  }

  const lead = await storage.getLead(payload.leadId);
  if (!lead) {
    throw new Error(`Lead not found: ${payload.leadId}`);
  }

  const contact = await storage.getContact(payload.contactId);
  if (!contact) {
    throw new Error(`Contact not found: ${payload.contactId}`);
  }

  if (!contact.phone) {
    throw new Error(`Contact has no phone number: ${payload.contactId}`);
  }

  if (contact.isDnc) {
    throw new Error(`Contact is on Do Not Call list: ${payload.contactId}`);
  }

  const business = lead.businessId ? await storage.getBusiness(lead.businessId) : null;
  const businessName = business?.name || "your business";

  const vapiCall = await initiateVapiCall({
    leadId: payload.leadId,
    contactId: payload.contactId,
    businessName,
    contactName: contact.fullName || "there",
    phoneNumber: contact.phone,
    industry: business?.industry || undefined,
  });

  const call = await storage.createCall({
    leadId: payload.leadId,
    contactId: payload.contactId,
    agentId,
    callStatus: "in_progress",
    callStart: new Date(),
    recordingUrl: null,
  });

  await storage.createCallerAgentState({
    callId: call.id,
    vapiCallId: vapiCall.id,
    currentPhase: "initiated",
    trustLevel: 0,
    objectionCount: 0,
    microCommitments: 0,
    conversationHistory: [],
    detectedObjections: [],
    psychologyTechniquesUsed: [],
  });

  await eventBus.publish("CALL_STARTED", {
    call_id: call.id,
    lead_id: payload.leadId,
    contact_id: payload.contactId,
    agent_id: agentId,
    vapi_call_id: vapiCall.id,
    start_time: new Date().toISOString(),
  }, { sourceAgent: agentId });

  await storage.createActivityLog({
    actorType: "agent",
    actorId: agentId,
    leadId: payload.leadId,
    action: "call_initiated",
    metadata: {
      callId: call.id,
      vapiCallId: vapiCall.id,
      contactName: contact.fullName,
      phoneNumber: contact.phone,
      businessName,
    },
  });

  return {
    callId: call.id,
    status: "initiated",
  };
}

export async function handleVapiWebhook(event: Record<string, unknown>): Promise<void> {
  const eventType = event.type as string;
  const callData = event.call as VapiCallResponse | undefined;

  if (!callData?.id) {
    console.log("Vapi webhook: no call data");
    return;
  }

  const vapiCallId = callData.id;
  const callerState = await storage.getCallerAgentStateByVapiCallId(vapiCallId);
  
  if (!callerState) {
    console.log(`No caller state found for Vapi call: ${vapiCallId}`);
    return;
  }

  const call = await storage.getCall(callerState.callId);
  if (!call) {
    console.log(`No call found for ID: ${callerState.callId}`);
    return;
  }

  switch (eventType) {
    case "call-started":
      await storage.updateCallerAgentState(callerState.callId, {
        currentPhase: "opening",
      });
      break;

    case "call-ended":
      const endedAt = callData.endedAt ? new Date(callData.endedAt) : new Date();
      let callStatus: "completed" | "failed" | "no_answer" = "completed";
      
      if (callData.status === "no-answer") {
        callStatus = "no_answer";
      } else if (callData.status === "failed") {
        callStatus = "failed";
      }

      await storage.updateCall(call.id, {
        callStatus,
        callEnd: endedAt,
        recordingUrl: callData.recordingUrl || null,
      });

      await storage.updateCallerAgentState(callerState.callId, {
        currentPhase: "completed",
      });

      if (callData.transcript) {
        const analysis = await analyzeCallOutcome(callData.transcript, callData.summary);
        
        await storage.createCallTranscript({
          callId: call.id,
          transcript: callData.transcript,
          sentiment: analysis.sentiment,
        });

        await storage.createCallOutcome({
          callId: call.id,
          outcome: analysis.outcome,
          notes: analysis.notes,
          nextAction: analysis.nextAction,
        });

        if (analysis.outcome === "interested") {
          await storage.updateLead(call.leadId, { status: "qualified" });
        } else if (analysis.outcome === "not_interested") {
          await storage.updateLead(call.leadId, { status: "contacted" });
        }
      }

      await eventBus.publish("CALL_COMPLETED", {
        call_id: call.id,
        lead_id: call.leadId,
        contact_id: call.contactId,
        vapi_call_id: vapiCallId,
        duration: callData.endedAt && callData.startedAt
          ? (new Date(callData.endedAt).getTime() - new Date(callData.startedAt).getTime()) / 1000
          : 0,
        status: callStatus,
      }, { sourceAgent: call.agentId || "caller-agent" });

      await storage.createActivityLog({
        actorType: "agent",
        actorId: call.agentId || "caller-agent",
        leadId: call.leadId,
        action: "call_completed",
        metadata: {
          callId: call.id,
          status: callStatus,
          duration: callData.endedAt && callData.startedAt
            ? Math.round((new Date(callData.endedAt).getTime() - new Date(callData.startedAt).getTime()) / 1000)
            : 0,
        },
      });
      break;

    case "transcript":
      const transcriptData = event.transcript as { text: string } | undefined;
      if (transcriptData?.text) {
        const history = (callerState.conversationHistory as Array<{role: string; text: string; timestamp: string}>) || [];
        history.push({
          role: event.role as string || "unknown",
          text: transcriptData.text,
          timestamp: new Date().toISOString(),
        });
        await storage.updateCallerAgentState(callerState.callId, {
          conversationHistory: history,
        });
      }
      break;
  }
}
