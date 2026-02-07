import type { Express, Request, Response, NextFunction } from "express";
import { DatabaseStorage, seedDatabase } from "./db-storage";
import { requireAdminAuth } from "./auth";
import { z } from "zod";
import { runCrawlerAgent } from "./ai/agents/crawlerAgent";
import { runVerifierAgent } from "./ai/agents/verifierAgent";
import { runContactAgent } from "./ai/agents/contactAgent";
import { runCallerAgent } from "./ai/agents/callerAgent";
import { runReporterAgent } from "./ai/agents/reporterAgent";
import { runFormAgent } from "./ai/agents/formAgent";
import { runNurturerAgent } from "./ai/agents/nurturerAgent";

const storage = new DatabaseStorage();

seedDatabase().catch(console.error);

const updateAgentSchema = z.object({
  name: z.string().optional(),
  type: z.string().optional(),
  status: z.enum(["active", "paused", "error"]).optional(),
  version: z.string().optional(),
});

const updateLeadSchema = z.object({
  status: z.enum(["new", "verified", "contacted", "qualified", "closed", "archived"]).optional(),
  score: z.number().min(0).max(100).optional(),
  assignedTo: z.string().optional().nullable(),
});

export function registerAdminRoutes(app: Express): void {
  
  // Leads
  app.get("/api/leads", async (req, res) => {
    try {
      const leads = await storage.getAllLeads();
      res.json(leads);
    } catch (error) {
      console.error("Error fetching leads:", error);
      res.status(500).json({ error: "Failed to fetch leads" });
    }
  });

  app.get("/api/leads/:id", async (req, res) => {
    try {
      const lead = await storage.getLead(req.params.id);
      if (!lead) {
        return res.status(404).json({ error: "Lead not found" });
      }
      res.json(lead);
    } catch (error) {
      console.error("Error fetching lead:", error);
      res.status(500).json({ error: "Failed to fetch lead" });
    }
  });

  app.patch("/api/leads/:id", async (req, res) => {
    try {
      const parsed = updateLeadSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid lead data" });
      }
      const updated = await storage.updateLead(req.params.id, parsed.data);
      if (!updated) {
        return res.status(404).json({ error: "Lead not found" });
      }
      res.json(updated);
    } catch (error) {
      console.error("Error updating lead:", error);
      res.status(500).json({ error: "Failed to update lead" });
    }
  });

  // Agents
  app.get("/api/agents", async (req, res) => {
    try {
      const agents = await storage.getAllAgents();
      res.json(agents);
    } catch (error) {
      console.error("Error fetching agents:", error);
      res.status(500).json({ error: "Failed to fetch agents" });
    }
  });

  app.get("/api/agents/:id", async (req, res) => {
    try {
      const agent = await storage.getAgent(req.params.id);
      if (!agent) {
        return res.status(404).json({ error: "Agent not found" });
      }
      res.json(agent);
    } catch (error) {
      console.error("Error fetching agent:", error);
      res.status(500).json({ error: "Failed to fetch agent" });
    }
  });

  app.patch("/api/agents/:id", async (req, res) => {
    try {
      const parsed = updateAgentSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid agent data" });
      }
      const updated = await storage.updateAgent(req.params.id, parsed.data);
      if (!updated) {
        return res.status(404).json({ error: "Agent not found" });
      }
      res.json(updated);
    } catch (error) {
      console.error("Error updating agent:", error);
      res.status(500).json({ error: "Failed to update agent" });
    }
  });

  // Run agent task
  app.post("/api/agents/:id/run", async (req, res) => {
    try {
      const agent = await storage.getAgent(req.params.id);
      if (!agent) {
        return res.status(404).json({ error: "Agent not found" });
      }
      
      if (agent.status !== "active") {
        return res.status(400).json({ error: "Agent must be active to run" });
      }

      const task = await storage.createAgentTask({
        agentId: agent.id,
        taskType: `${agent.type}_run`,
        status: "running",
        payload: req.body || {},
        startedAt: new Date(),
      });

      await storage.createActivityLog({
        actorType: "agent",
        actorId: agent.id,
        action: "task_started",
        metadata: { taskId: task.id, agentType: agent.type },
      });

      res.json({ 
        success: true, 
        message: `Agent ${agent.name} task started`,
        taskId: task.id 
      });

      (async () => {
        try {
          let result: unknown;
          const payload = req.body || {};

          switch (agent.type) {
            case "crawler":
              result = await runCrawlerAgent(agent.id, {
                query: payload.query || "small businesses",
                location: payload.location || "Hawaii",
                industry: payload.industry,
              });
              break;
            case "verifier": {
              const businesses = await storage.getAllBusinesses();
              if (businesses.length === 0) {
                throw new Error("No businesses to verify. Run the Crawler agent first.");
              }
              const unverified = businesses.find(b => !payload.businessId) ? businesses[0] : undefined;
              result = await runVerifierAgent(agent.id, {
                businessId: payload.businessId || unverified?.id || businesses[0].id,
              });
              break;
            }
            case "contact": {
              const allBusinesses = await storage.getAllBusinesses();
              if (allBusinesses.length === 0) {
                throw new Error("No businesses found. Run the Crawler agent first.");
              }
              result = await runContactAgent(agent.id, {
                businessId: payload.businessId || allBusinesses[0].id,
              });
              break;
            }
            case "caller": {
              const leads = await storage.getAllLeads();
              const contacts = await storage.getAllContacts();
              if (leads.length === 0 || contacts.length === 0) {
                throw new Error("No leads or contacts found. Run Crawler and Contact agents first.");
              }
              const lead = leads[0];
              const contact = contacts[0];
              result = await runCallerAgent(agent.id, {
                leadId: lead.id,
                contactId: contact.id,
              });
              break;
            }
            case "reporter":
              result = await runReporterAgent(agent.id, {});
              break;
            case "form_agent":
              result = await runFormAgent(agent.id, {
                businessId: payload.businessId,
              });
              break;
            case "nurturer": {
              const nurtLeads = await storage.getAllLeads();
              const nurtContacts = await storage.getAllContacts();
              if (nurtLeads.length === 0) {
                throw new Error("No leads found. Run Crawler agent first.");
              }
              const nurtLead = nurtLeads.find(l => l.status === "verified") || nurtLeads[0];
              const nurtBiz = await storage.getBusiness(nurtLead.businessId);
              const nurtContact = nurtContacts.find(c => c.businessId === nurtLead.businessId);
              result = await runNurturerAgent(agent.id, {
                businessId: nurtLead.businessId,
                contactId: nurtContact?.id,
              });
              break;
            }
            default:
              throw new Error(`Unknown agent type: ${agent.type}`);
          }

          await storage.updateAgentTask(task.id, {
            status: "completed",
            payload: result as Record<string, unknown> || { success: true },
            completedAt: new Date(),
          });

          await storage.createActivityLog({
            actorType: "agent",
            actorId: agent.id,
            action: "task_completed",
            metadata: { taskId: task.id, agentType: agent.type },
          });
        } catch (err: any) {
          console.error(`Agent ${agent.type} task failed:`, err.message);
          await storage.updateAgentTask(task.id, {
            status: "failed",
            payload: { error: err.message },
            completedAt: new Date(),
          });
          await storage.createActivityLog({
            actorType: "agent",
            actorId: agent.id,
            action: "task_failed",
            metadata: { taskId: task.id, agentType: agent.type, error: err.message },
          });
        }
      })();
    } catch (error: any) {
      console.error("Error running agent:", error);
      res.status(500).json({ error: error.message || "Failed to start agent task" });
    }
  });

  // Activity Logs
  app.get("/api/activity-logs", async (req, res) => {
    try {
      const logs = await storage.getAllActivityLogs();
      res.json(logs);
    } catch (error) {
      console.error("Error fetching activity logs:", error);
      res.status(500).json({ error: "Failed to fetch activity logs" });
    }
  });

  // Analytics
  app.get("/api/analytics/summary", async (req, res) => {
    try {
      const summary = await storage.getAnalyticsSummary();
      res.json(summary);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  app.get("/api/analytics/weekly", async (req, res) => {
    try {
      const weeklyData = await storage.getWeeklyAnalytics();
      res.json(weeklyData);
    } catch (error) {
      console.error("Error fetching weekly analytics:", error);
      res.status(500).json({ error: "Failed to fetch weekly analytics" });
    }
  });

  // Clients
  app.get("/api/clients", async (req, res) => {
    try {
      const clients = await storage.getAllClients();
      const enrichedClients = await Promise.all(
        clients.map(async (client) => {
          const business = client.businessId ? await storage.getBusiness(client.businessId) : null;
          const assets = await storage.getAssetsByClient(client.id);
          return {
            ...client,
            business,
            assetCount: assets.length,
            totalAssetCost: assets.reduce((sum: number, a: { cost: number | null }) => sum + (a.cost || 0), 0),
          };
        })
      );
      res.json(enrichedClients);
    } catch (error) {
      console.error("Error fetching clients:", error);
      res.status(500).json({ error: "Failed to fetch clients" });
    }
  });

  app.get("/api/clients/:id", async (req, res) => {
    try {
      const client = await storage.getClient(req.params.id);
      if (!client) {
        return res.status(404).json({ error: "Client not found" });
      }
      res.json(client);
    } catch (error) {
      console.error("Error fetching client:", error);
      res.status(500).json({ error: "Failed to fetch client" });
    }
  });

  // Create client
  app.post("/api/clients", async (req, res) => {
    try {
      const { businessName, website, status, monthlyRevenue, notes, assets } = req.body;
      
      // Create or find business first
      const existingBusinesses = await storage.getAllBusinesses();
      let business = existingBusinesses.find(b => b.website === website);
      if (!business) {
        business = await storage.createBusiness({
          name: businessName,
          website,
          phone: req.body.phone || null,
          industry: req.body.industry || null,
          address: req.body.address || null,
        });
      }
      
      // Create client
      const client = await storage.createClient({
        businessId: business.id,
        status: status || "active",
        monthlyRevenue: monthlyRevenue || 0,
        notes,
      });
      
      // Create assets if provided
      if (assets && Array.isArray(assets)) {
        for (const asset of assets) {
          await storage.createClientAsset({
            clientId: client.id,
            type: asset.type,
            name: asset.name,
            provider: asset.provider || null,
            cost: asset.cost || 0,
            status: asset.status || "active",
            expiryDate: asset.expiryDate ? new Date(asset.expiryDate) : null,
          });
        }
      }
      
      res.status(201).json(client);
    } catch (error) {
      console.error("Error creating client:", error);
      res.status(500).json({ error: "Failed to create client" });
    }
  });

  // Convert lead to client
  app.post("/api/leads/:id/convert", async (req, res) => {
    try {
      const lead = await storage.getLead(req.params.id);
      if (!lead) {
        return res.status(404).json({ error: "Lead not found" });
      }
      
      // Get the associated business
      const business = await storage.getBusiness(lead.businessId);
      if (!business) {
        return res.status(404).json({ error: "Business not found" });
      }
      
      // Create client from lead
      const client = await storage.createClient({
        businessId: lead.businessId,
        leadId: lead.id,
        status: "active",
        monthlyRevenue: req.body.monthlyRevenue || 0,
        notes: req.body.notes || `Converted from lead on ${new Date().toLocaleDateString()}`,
      });
      
      // Update lead status to closed
      await storage.updateLead(lead.id, { status: "closed" });
      
      res.status(201).json(client);
    } catch (error) {
      console.error("Error converting lead:", error);
      res.status(500).json({ error: "Failed to convert lead" });
    }
  });

  // Meetings
  app.get("/api/meetings", async (req, res) => {
    try {
      const meetings = await storage.getAllMeetings();
      res.json(meetings);
    } catch (error) {
      console.error("Error fetching meetings:", error);
      res.status(500).json({ error: "Failed to fetch meetings" });
    }
  });

  app.post("/api/meetings", async (req, res) => {
    try {
      const meeting = await storage.createMeeting({
        leadId: req.body.leadId,
        scheduledAt: new Date(req.body.scheduledAt),
        meetingLink: req.body.meetingLink || null,
        status: req.body.status || "scheduled",
      });
      res.status(201).json(meeting);
    } catch (error) {
      console.error("Error creating meeting:", error);
      res.status(500).json({ error: "Failed to create meeting" });
    }
  });

  app.patch("/api/meetings/:id", async (req, res) => {
    try {
      const meeting = await storage.updateMeeting(req.params.id, req.body);
      if (!meeting) {
        return res.status(404).json({ error: "Meeting not found" });
      }
      res.json(meeting);
    } catch (error) {
      console.error("Error updating meeting:", error);
      res.status(500).json({ error: "Failed to update meeting" });
    }
  });

  app.delete("/api/meetings/:id", async (req, res) => {
    try {
      await storage.deleteMeeting(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting meeting:", error);
      res.status(500).json({ error: "Failed to delete meeting" });
    }
  });

  // Businesses
  app.get("/api/businesses", async (req, res) => {
    try {
      const businesses = await storage.getAllBusinesses();
      res.json(businesses);
    } catch (error) {
      console.error("Error fetching businesses:", error);
      res.status(500).json({ error: "Failed to fetch businesses" });
    }
  });

  app.get("/api/businesses/:id", async (req, res) => {
    try {
      const business = await storage.getBusiness(req.params.id);
      if (!business) {
        return res.status(404).json({ error: "Business not found" });
      }
      res.json(business);
    } catch (error) {
      console.error("Error fetching business:", error);
      res.status(500).json({ error: "Failed to fetch business" });
    }
  });

  // Online Presence
  app.get("/api/online-presence/:businessId", async (req, res) => {
    try {
      const presence = await storage.getOnlinePresenceByBusiness(req.params.businessId);
      if (!presence) {
        return res.status(404).json({ error: "Online presence not found" });
      }
      res.json(presence);
    } catch (error) {
      console.error("Error fetching online presence:", error);
      res.status(500).json({ error: "Failed to fetch online presence" });
    }
  });

  // Events
  app.get("/api/events", async (req, res) => {
    try {
      const events = await storage.getAllEvents();
      res.json(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });

  // Contacts
  app.get("/api/contacts", async (req, res) => {
    try {
      const contacts = await storage.getAllContacts();
      res.json(contacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      res.status(500).json({ error: "Failed to fetch contacts" });
    }
  });

  // Calls
  app.get("/api/calls", async (req, res) => {
    try {
      const calls = await storage.getAllCalls();
      res.json(calls);
    } catch (error) {
      console.error("Error fetching calls:", error);
      res.status(500).json({ error: "Failed to fetch calls" });
    }
  });

  // Client Assets
  app.get("/api/client-assets", async (req, res) => {
    try {
      const assets = await storage.getAllClientAssets();
      res.json(assets);
    } catch (error) {
      console.error("Error fetching client assets:", error);
      res.status(500).json({ error: "Failed to fetch client assets" });
    }
  });

  app.get("/api/assets", async (req, res) => {
    try {
      const assets = await storage.getAllClientAssets();
      res.json(assets);
    } catch (error) {
      console.error("Error fetching assets:", error);
      res.status(500).json({ error: "Failed to fetch assets" });
    }
  });

  app.get("/api/assets/expiring", async (req, res) => {
    try {
      const days = parseInt(req.query.days as string) || 30;
      const assets = await storage.getAllClientAssets();
      const now = new Date();
      const expiringAssets = assets.filter((asset: any) => {
        if (!asset.expiryDate) return false;
        const expiryDate = new Date(asset.expiryDate);
        const daysUntil = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return daysUntil > 0 && daysUntil <= days;
      });
      res.json(expiringAssets);
    } catch (error) {
      console.error("Error fetching expiring assets:", error);
      res.status(500).json({ error: "Failed to fetch expiring assets" });
    }
  });

  app.post("/api/assets", async (req, res) => {
    try {
      const asset = await storage.createClientAsset(req.body);
      res.json(asset);
    } catch (error) {
      console.error("Error creating asset:", error);
      res.status(500).json({ error: "Failed to create asset" });
    }
  });

  // Nurturing Sequences
  app.get("/api/nurturing-sequences", async (req, res) => {
    try {
      const sequences = await storage.getAllNurturingSequences();
      res.json(sequences);
    } catch (error) {
      console.error("Error fetching nurturing sequences:", error);
      res.status(500).json({ error: "Failed to fetch nurturing sequences" });
    }
  });

  // Scheduled Messages (for calendar)
  app.get("/api/scheduled-messages", async (req, res) => {
    try {
      const messages = await storage.getPendingScheduledMessages();
      res.json(messages);
    } catch (error) {
      console.error("Error fetching scheduled messages:", error);
      res.status(500).json({ error: "Failed to fetch scheduled messages" });
    }
  });

  // Sample Sites
  app.get("/api/sample-sites", async (req, res) => {
    try {
      res.json([]);
    } catch (error) {
      console.error("Error fetching sample sites:", error);
      res.status(500).json({ error: "Failed to fetch sample sites" });
    }
  });

  // Approval Queue
  app.get("/api/approval-queue", async (req, res) => {
    try {
      res.json([]);
    } catch (error) {
      console.error("Error fetching approval queue:", error);
      res.status(500).json({ error: "Failed to fetch approval queue" });
    }
  });

  // External Contacts
  app.get("/api/external-contacts", async (req, res) => {
    try {
      const contacts = await storage.getAllExternalContacts();
      res.json(contacts);
    } catch (error) {
      console.error("Error fetching external contacts:", error);
      res.status(500).json({ error: "Failed to fetch external contacts" });
    }
  });

  // External Conversations
  app.get("/api/external-conversations", async (req, res) => {
    try {
      const conversations = await storage.getAllExternalConversations();
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching external conversations:", error);
      res.status(500).json({ error: "Failed to fetch external conversations" });
    }
  });
}
