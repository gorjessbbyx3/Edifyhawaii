import type { Express, Request, Response, NextFunction } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { insertAgentIntelSchema, updateAgentAvailabilitySchema, insertPageViewSchema } from "@shared/schema";

// API Key Authentication Middleware for Agent Communication
const AGENT_API_KEY = process.env.AGENT_API_KEY;

function agentApiAuth(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.headers["x-edify-api-key"] as string;
  
  if (!AGENT_API_KEY) {
    return res.status(503).json({ error: "Agent API not configured" });
  }
  
  if (!apiKey || apiKey !== AGENT_API_KEY) {
    return res.status(401).json({ error: "Unauthorized: Invalid API key" });
  }
  
  next();
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post(api.contact.submit.path, async (req, res) => {
    try {
      const input = api.contact.submit.input.parse(req.body);
      const submission = await storage.createContactSubmission(input);
      res.status(201).json(submission);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.blog.list.path, async (req, res) => {
    try {
      const posts = await storage.getAllBlogPosts();
      res.json(posts);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/blog/:slug", async (req, res) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.json(post);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // ============================================
  // AGENT COMMUNICATION API (Protected by API Key)
  // ============================================

  // Send intel from one agent to another
  app.post("/api/agent/intel", agentApiAuth, async (req, res) => {
    try {
      const input = insertAgentIntelSchema.parse(req.body);
      const intel = await storage.createAgentIntel(input);
      res.status(201).json(intel);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ error: err.errors[0].message });
      }
      console.error("Error creating agent intel:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get intel for a specific agent
  app.get("/api/agent/intel", agentApiAuth, async (req, res) => {
    try {
      const agentId = req.query.agentId as string;
      const sinceStr = req.query.since as string;
      
      if (!agentId) {
        return res.status(400).json({ error: "agentId is required" });
      }
      
      const since = sinceStr ? new Date(sinceStr) : undefined;
      const intel = await storage.getAgentIntel(agentId, since);
      res.json(intel);
    } catch (err) {
      console.error("Error getting agent intel:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Mark intel as read
  app.patch("/api/agent/intel/:id/read", agentApiAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid intel ID" });
      }
      await storage.markIntelAsRead(id);
      res.json({ success: true });
    } catch (err) {
      console.error("Error marking intel as read:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Update agent availability status
  app.post("/api/agent/availability", agentApiAuth, async (req, res) => {
    try {
      const input = updateAgentAvailabilitySchema.parse(req.body);
      const availability = await storage.updateAgentAvailability(input);
      res.json(availability);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ error: err.errors[0].message });
      }
      console.error("Error updating agent availability:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get availability for a specific agent
  app.get("/api/agent/availability/:agentId", agentApiAuth, async (req, res) => {
    try {
      const availability = await storage.getAgentAvailability(req.params.agentId);
      if (!availability) {
        return res.status(404).json({ error: "Agent not found" });
      }
      res.json(availability);
    } catch (err) {
      console.error("Error getting agent availability:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get all agents' availability
  app.get("/api/agent/availability", agentApiAuth, async (req, res) => {
    try {
      const availability = await storage.getAllAgentAvailability();
      res.json(availability);
    } catch (err) {
      console.error("Error getting all agent availability:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // ============================================
  // CRM API ENDPOINTS (Protected by API Key)
  // ============================================

  // Get all contact form submissions
  app.get("/api/crm/contacts", agentApiAuth, async (req, res) => {
    try {
      const contacts = await storage.getAllContactSubmissions();
      res.json(contacts);
    } catch (err) {
      console.error("Error getting contacts:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get all AI audit chat conversations
  app.get("/api/crm/conversations", agentApiAuth, async (req, res) => {
    try {
      const convos = await storage.getAllConversations();
      res.json(convos);
    } catch (err) {
      console.error("Error getting conversations:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get messages for a specific conversation
  app.get("/api/crm/conversations/:id/messages", agentApiAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid conversation ID" });
      }
      const msgs = await storage.getConversationMessages(id);
      res.json(msgs);
    } catch (err) {
      console.error("Error getting conversation messages:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Track a page view (public endpoint for analytics tracking)
  app.post("/api/analytics/pageview", async (req, res) => {
    try {
      const input = insertPageViewSchema.parse({
        path: req.body.path,
        referrer: req.body.referrer || req.headers.referer,
        userAgent: req.headers["user-agent"],
        ip: req.headers["x-forwarded-for"]?.toString().split(",")[0] || req.socket.remoteAddress,
        sessionId: req.body.sessionId,
      });
      const view = await storage.createPageView(input);
      res.status(201).json({ success: true, id: view.id });
    } catch (err) {
      console.error("Error tracking page view:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get page view analytics (protected)
  app.get("/api/crm/analytics/pageviews", agentApiAuth, async (req, res) => {
    try {
      const sinceStr = req.query.since as string;
      const since = sinceStr ? new Date(sinceStr) : undefined;
      const views = await storage.getPageViews(since);
      res.json(views);
    } catch (err) {
      console.error("Error getting page views:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get page view stats (aggregated by path)
  app.get("/api/crm/analytics/stats", agentApiAuth, async (req, res) => {
    try {
      const stats = await storage.getPageViewStats();
      res.json(stats);
    } catch (err) {
      console.error("Error getting analytics stats:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  return httpServer;
}
