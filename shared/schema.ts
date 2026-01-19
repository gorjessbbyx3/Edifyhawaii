import { pgTable, text, serial, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertContactSchema = createInsertSchema(contactSubmissions).pick({
  name: true,
  email: true,
  message: true,
});

export type InsertContact = z.infer<typeof insertContactSchema>;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  author: text("author").notNull().default("Edify Team"),
  published: boolean("published").notNull().default(true),
  featuredImage: text("featured_image"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;

export * from "./models/chat";

// Agent Communication Tables (persisted to DB)
export const agentIntel = pgTable("agent_intel", {
  id: serial("id").primaryKey(),
  fromAgentId: text("from_agent_id").notNull(),
  toAgentId: text("to_agent_id").notNull(),
  topic: text("topic").notNull(),
  payload: text("payload").notNull(),
  leadId: text("lead_id"),
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAgentIntelSchema = createInsertSchema(agentIntel).omit({
  id: true,
  createdAt: true,
  read: true,
});

export type AgentIntel = typeof agentIntel.$inferSelect;
export type InsertAgentIntel = z.infer<typeof insertAgentIntelSchema>;

export const agentAvailability = pgTable("agent_availability", {
  agentId: text("agent_id").primaryKey(),
  status: text("status").notNull().default("offline"),
  currentTask: text("current_task"),
  metadata: text("metadata"),
  lastSeen: timestamp("last_seen").defaultNow(),
});

export const updateAgentAvailabilitySchema = createInsertSchema(agentAvailability).omit({
  lastSeen: true,
});

export type AgentAvailability = typeof agentAvailability.$inferSelect;
export type UpdateAgentAvailability = z.infer<typeof updateAgentAvailabilitySchema>;
