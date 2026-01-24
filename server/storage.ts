import { db } from "./db";
import { eq, desc, and, gt, sql, count } from "drizzle-orm";
import {
  contactSubmissions,
  blogPosts,
  agentIntel,
  agentAvailability,
  pageViews,
  conversations,
  messages,
  type InsertContact,
  type ContactSubmission,
  type InsertBlogPost,
  type BlogPost,
  type InsertAgentIntel,
  type AgentIntel,
  type UpdateAgentAvailability,
  type AgentAvailability,
  type InsertPageView,
  type PageView,
  type Conversation,
  type Message,
} from "@shared/schema";

export interface IStorage {
  createContactSubmission(contact: InsertContact): Promise<ContactSubmission>;
  getAllContactSubmissions(): Promise<ContactSubmission[]>;
  getAllBlogPosts(): Promise<BlogPost[]>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  
  // Agent Communication
  createAgentIntel(intel: InsertAgentIntel): Promise<AgentIntel>;
  getAgentIntel(agentId: string, since?: Date): Promise<AgentIntel[]>;
  markIntelAsRead(id: number): Promise<void>;
  updateAgentAvailability(availability: UpdateAgentAvailability): Promise<AgentAvailability>;
  getAgentAvailability(agentId: string): Promise<AgentAvailability | undefined>;
  getAllAgentAvailability(): Promise<AgentAvailability[]>;
  
  // CRM API
  createPageView(view: InsertPageView): Promise<PageView>;
  getPageViews(since?: Date): Promise<PageView[]>;
  getPageViewStats(): Promise<{ path: string; count: number }[]>;
  getAllConversations(): Promise<Conversation[]>;
  getConversationMessages(conversationId: number): Promise<Message[]>;
}

export class DatabaseStorage implements IStorage {
  async createContactSubmission(contact: InsertContact): Promise<ContactSubmission> {
    const [submission] = await db
      .insert(contactSubmissions)
      .values(contact)
      .returning();
    return submission;
  }

  async getAllBlogPosts(): Promise<BlogPost[]> {
    return await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.published, true))
      .orderBy(desc(blogPosts.createdAt));
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.slug, slug));
    return post;
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [newPost] = await db
      .insert(blogPosts)
      .values(post)
      .returning();
    return newPost;
  }

  // Agent Communication Methods
  async createAgentIntel(intel: InsertAgentIntel): Promise<AgentIntel> {
    const [newIntel] = await db
      .insert(agentIntel)
      .values(intel)
      .returning();
    return newIntel;
  }

  async getAgentIntel(agentId: string, since?: Date): Promise<AgentIntel[]> {
    if (since) {
      return await db
        .select()
        .from(agentIntel)
        .where(and(
          eq(agentIntel.toAgentId, agentId),
          gt(agentIntel.createdAt, since)
        ))
        .orderBy(desc(agentIntel.createdAt));
    }
    return await db
      .select()
      .from(agentIntel)
      .where(eq(agentIntel.toAgentId, agentId))
      .orderBy(desc(agentIntel.createdAt));
  }

  async markIntelAsRead(id: number): Promise<void> {
    await db
      .update(agentIntel)
      .set({ read: true })
      .where(eq(agentIntel.id, id));
  }

  async updateAgentAvailability(availability: UpdateAgentAvailability): Promise<AgentAvailability> {
    const [updated] = await db
      .insert(agentAvailability)
      .values({ ...availability, lastSeen: new Date() })
      .onConflictDoUpdate({
        target: agentAvailability.agentId,
        set: { 
          status: availability.status,
          currentTask: availability.currentTask,
          metadata: availability.metadata,
          lastSeen: new Date()
        }
      })
      .returning();
    return updated;
  }

  async getAgentAvailability(agentId: string): Promise<AgentAvailability | undefined> {
    const [result] = await db
      .select()
      .from(agentAvailability)
      .where(eq(agentAvailability.agentId, agentId));
    return result;
  }

  async getAllAgentAvailability(): Promise<AgentAvailability[]> {
    return await db
      .select()
      .from(agentAvailability)
      .orderBy(desc(agentAvailability.lastSeen));
  }

  // CRM API Methods
  async getAllContactSubmissions(): Promise<ContactSubmission[]> {
    return await db
      .select()
      .from(contactSubmissions)
      .orderBy(desc(contactSubmissions.createdAt));
  }

  async createPageView(view: InsertPageView): Promise<PageView> {
    const [newView] = await db
      .insert(pageViews)
      .values(view)
      .returning();
    return newView;
  }

  async getPageViews(since?: Date): Promise<PageView[]> {
    if (since) {
      return await db
        .select()
        .from(pageViews)
        .where(gt(pageViews.createdAt, since))
        .orderBy(desc(pageViews.createdAt));
    }
    return await db
      .select()
      .from(pageViews)
      .orderBy(desc(pageViews.createdAt));
  }

  async getPageViewStats(): Promise<{ path: string; count: number }[]> {
    const results = await db
      .select({
        path: pageViews.path,
        count: count(),
      })
      .from(pageViews)
      .groupBy(pageViews.path)
      .orderBy(desc(count()));
    return results.map(r => ({ path: r.path, count: Number(r.count) }));
  }

  async getAllConversations(): Promise<Conversation[]> {
    return await db
      .select()
      .from(conversations)
      .orderBy(desc(conversations.createdAt));
  }

  async getConversationMessages(conversationId: number): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(messages.createdAt);
  }
}

export const storage = new DatabaseStorage();
