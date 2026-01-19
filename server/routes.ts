import type { Express, Request, Response, NextFunction } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { insertAgentIntelSchema, updateAgentAvailabilitySchema } from "@shared/schema";

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

  return httpServer;
}
