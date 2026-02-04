import type { Express, Request, Response, NextFunction } from "express";
import { MemStorage } from "./storage";
import { requireAdminAuth } from "./auth";
import { z } from "zod";

const storage = new MemStorage();

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

  // Clients
  app.get("/api/clients", async (req, res) => {
    try {
      const clients = await storage.getAllClients();
      res.json(clients);
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
