import { eq, and, desc, gte, lte, count, sql } from "drizzle-orm";
import { db } from "../db";
import {
  users, organizations, roles, agents, agentTasks, businesses, leads,
  onlinePresenceChecks, contacts, calls, callTranscripts, callOutcomes,
  webFormSubmissions, meetings, activityLogs, auditLogs, externalContacts,
  externalConversations, events, callerAgentStates, clients, clientAssets,
  clientNotes, nurturingSequences, nurturingSteps, leadNurturingEnrollments,
  scheduledMessages, messageEngagements, leadNurturingTags, sampleSites,
  approvalQueue, approvalEditRequests, agentConfigs, agentDefinitions,
  globalSettings,
  User, InsertUser, Organization, InsertOrganization, Role, InsertRole,
  Agent, InsertAgent, AgentTask, InsertAgentTask, Business, InsertBusiness,
  Lead, InsertLead, OnlinePresenceCheck, InsertOnlinePresenceCheck,
  Contact, InsertContact, Call, InsertCall, CallTranscript, InsertCallTranscript,
  CallOutcome, InsertCallOutcome, WebFormSubmission, InsertWebFormSubmission,
  Meeting, InsertMeeting, ActivityLog, InsertActivityLog, AuditLog, InsertAuditLog,
  ExternalContact, InsertExternalContact, ExternalConversation, InsertExternalConversation,
  Event, InsertEvent, CallerAgentState, InsertCallerAgentState,
  Client, InsertClient, ClientAsset, InsertClientAsset, ClientNote, InsertClientNote,
  NurturingSequence, InsertNurturingSequence, NurturingStep, InsertNurturingStep,
  LeadNurturingEnrollment, InsertLeadNurturingEnrollment,
  ScheduledMessage, InsertScheduledMessage, MessageEngagement, InsertMessageEngagement,
  LeadNurturingTag, InsertLeadNurturingTag, SampleSite, InsertSampleSite,
  ApprovalQueue, InsertApprovalQueue, ApprovalEditRequest, InsertApprovalEditRequest,
  AgentConfig, InsertAgentConfig, GlobalSetting,
} from "@shared/schema";
import type { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  private initialized = false;

  async ensureInitialized(): Promise<void> {
    if (this.initialized) return;

    const existingAgents = await db.select().from(agents);
    if (existingAgents.length === 0) {
      for (const def of agentDefinitions) {
        await db.insert(agents).values({
          id: def.id,
          type: def.type,
          name: def.name,
          status: "paused",
          version: "1.0.0",
        }).onConflictDoNothing();
      }
    }

    const existingRoles = await db.select().from(roles);
    if (existingRoles.length === 0) {
      await db.insert(roles).values([
        { id: "role-admin", name: "admin", permissions: { all: true } },
        { id: "role-sales", name: "sales", permissions: { leads: true, calls: true } },
        { id: "role-viewer", name: "viewer", permissions: { read: true } },
      ]).onConflictDoNothing();
    }

    const existingOrgs = await db.select().from(organizations);
    if (existingOrgs.length === 0) {
      await db.insert(organizations).values({
        id: "org-default",
        name: "My Organization",
        timezone: "Pacific/Honolulu",
      }).onConflictDoNothing();
    }

    this.initialized = true;
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    await this.ensureInitialized();
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    await this.ensureInitialized();
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    await this.ensureInitialized();
    const [created] = await db.insert(users).values(user).returning();
    return created;
  }

  // Organizations
  async getOrganization(id: string): Promise<Organization | undefined> {
    await this.ensureInitialized();
    const [org] = await db.select().from(organizations).where(eq(organizations.id, id));
    return org;
  }

  async createOrganization(org: InsertOrganization): Promise<Organization> {
    await this.ensureInitialized();
    const [created] = await db.insert(organizations).values(org).returning();
    return created;
  }

  // Roles
  async getRole(id: string): Promise<Role | undefined> {
    await this.ensureInitialized();
    const [role] = await db.select().from(roles).where(eq(roles.id, id));
    return role;
  }

  async getAllRoles(): Promise<Role[]> {
    await this.ensureInitialized();
    return db.select().from(roles);
  }

  // Agents
  async getAllAgents(): Promise<Agent[]> {
    await this.ensureInitialized();
    return db.select().from(agents);
  }

  async getAgent(id: string): Promise<Agent | undefined> {
    await this.ensureInitialized();
    const [agent] = await db.select().from(agents).where(eq(agents.id, id));
    return agent;
  }

  async getAgentByType(type: string): Promise<Agent | undefined> {
    await this.ensureInitialized();
    const [agent] = await db.select().from(agents).where(eq(agents.type, type));
    return agent;
  }

  async createAgent(agent: InsertAgent): Promise<Agent> {
    await this.ensureInitialized();
    const [created] = await db.insert(agents).values(agent).returning();
    return created;
  }

  async updateAgent(id: string, data: Partial<InsertAgent>): Promise<Agent | undefined> {
    await this.ensureInitialized();
    const [updated] = await db.update(agents).set(data).where(eq(agents.id, id)).returning();
    return updated;
  }

  async deleteAgent(id: string): Promise<boolean> {
    await this.ensureInitialized();
    await db.delete(agents).where(eq(agents.id, id));
    return true;
  }

  // Agent Tasks
  async getAllAgentTasks(): Promise<AgentTask[]> {
    await this.ensureInitialized();
    return db.select().from(agentTasks).orderBy(desc(agentTasks.startedAt));
  }

  async getAgentTask(id: string): Promise<AgentTask | undefined> {
    await this.ensureInitialized();
    const [task] = await db.select().from(agentTasks).where(eq(agentTasks.id, id));
    return task;
  }

  async getAgentTasksByAgent(agentId: string): Promise<AgentTask[]> {
    await this.ensureInitialized();
    return db.select().from(agentTasks).where(eq(agentTasks.agentId, agentId));
  }

  async getRunningTaskByAgent(agentId: string): Promise<AgentTask | undefined> {
    await this.ensureInitialized();
    const [task] = await db.select().from(agentTasks).where(
      and(eq(agentTasks.agentId, agentId), eq(agentTasks.status, "running"))
    );
    return task;
  }

  async createAgentTask(task: InsertAgentTask): Promise<AgentTask> {
    await this.ensureInitialized();
    const [created] = await db.insert(agentTasks).values(task).returning();
    return created;
  }

  async updateAgentTask(id: string, data: Partial<InsertAgentTask>): Promise<AgentTask | undefined> {
    await this.ensureInitialized();
    const [updated] = await db.update(agentTasks).set(data).where(eq(agentTasks.id, id)).returning();
    return updated;
  }

  // Businesses
  async getAllBusinesses(): Promise<Business[]> {
    await this.ensureInitialized();
    return db.select().from(businesses).orderBy(desc(businesses.createdAt));
  }

  async getBusiness(id: string): Promise<Business | undefined> {
    await this.ensureInitialized();
    const [business] = await db.select().from(businesses).where(eq(businesses.id, id));
    return business;
  }

  async getBusinessByWebsite(website: string): Promise<Business | undefined> {
    await this.ensureInitialized();
    const [business] = await db.select().from(businesses).where(eq(businesses.website, website));
    return business;
  }

  async createBusiness(business: InsertBusiness): Promise<Business> {
    await this.ensureInitialized();
    const [created] = await db.insert(businesses).values(business).returning();
    return created;
  }

  async updateBusiness(id: string, data: Partial<InsertBusiness>): Promise<Business | undefined> {
    await this.ensureInitialized();
    const [updated] = await db.update(businesses).set(data).where(eq(businesses.id, id)).returning();
    return updated;
  }

  async deleteBusiness(id: string): Promise<boolean> {
    await this.ensureInitialized();
    await db.delete(businesses).where(eq(businesses.id, id));
    return true;
  }

  // Leads
  async getAllLeads(): Promise<Lead[]> {
    await this.ensureInitialized();
    return db.select().from(leads).orderBy(desc(leads.createdAt));
  }

  async getLead(id: string): Promise<Lead | undefined> {
    await this.ensureInitialized();
    const [lead] = await db.select().from(leads).where(eq(leads.id, id));
    return lead;
  }

  async getLeadsByBusiness(businessId: string): Promise<Lead[]> {
    await this.ensureInitialized();
    return db.select().from(leads).where(eq(leads.businessId, businessId));
  }

  async getLeadsByStatus(status: string): Promise<Lead[]> {
    await this.ensureInitialized();
    return db.select().from(leads).where(eq(leads.status, status));
  }

  async createLead(lead: InsertLead): Promise<Lead> {
    await this.ensureInitialized();
    const [created] = await db.insert(leads).values(lead).returning();
    return created;
  }

  async updateLead(id: string, data: Partial<InsertLead>): Promise<Lead | undefined> {
    await this.ensureInitialized();
    const [updated] = await db.update(leads).set({ ...data, updatedAt: new Date() }).where(eq(leads.id, id)).returning();
    return updated;
  }

  async deleteLead(id: string): Promise<boolean> {
    await this.ensureInitialized();
    await db.delete(leads).where(eq(leads.id, id));
    return true;
  }

  // Online Presence Checks
  async getOnlinePresenceCheck(businessId: string): Promise<OnlinePresenceCheck | undefined> {
    await this.ensureInitialized();
    const [check] = await db.select().from(onlinePresenceChecks).where(eq(onlinePresenceChecks.businessId, businessId));
    return check;
  }

  async getOnlinePresenceByBusiness(businessId: string): Promise<OnlinePresenceCheck | undefined> {
    return this.getOnlinePresenceCheck(businessId);
  }

  async createOnlinePresenceCheck(check: InsertOnlinePresenceCheck): Promise<OnlinePresenceCheck> {
    await this.ensureInitialized();
    const [created] = await db.insert(onlinePresenceChecks).values(check).returning();
    return created;
  }

  async updateOnlinePresenceCheck(id: string, data: Partial<InsertOnlinePresenceCheck>): Promise<OnlinePresenceCheck | undefined> {
    await this.ensureInitialized();
    const [updated] = await db.update(onlinePresenceChecks).set(data).where(eq(onlinePresenceChecks.id, id)).returning();
    return updated;
  }

  // Contacts
  async getAllContacts(): Promise<Contact[]> {
    await this.ensureInitialized();
    return db.select().from(contacts).orderBy(desc(contacts.createdAt));
  }

  async getContact(id: string): Promise<Contact | undefined> {
    await this.ensureInitialized();
    const [contact] = await db.select().from(contacts).where(eq(contacts.id, id));
    return contact;
  }

  async getContactsByBusiness(businessId: string): Promise<Contact[]> {
    await this.ensureInitialized();
    return db.select().from(contacts).where(eq(contacts.businessId, businessId));
  }

  async createContact(contact: InsertContact): Promise<Contact> {
    await this.ensureInitialized();
    const [created] = await db.insert(contacts).values(contact).returning();
    return created;
  }

  async updateContact(id: string, data: Partial<InsertContact>): Promise<Contact | undefined> {
    await this.ensureInitialized();
    const [updated] = await db.update(contacts).set(data).where(eq(contacts.id, id)).returning();
    return updated;
  }

  async deleteContact(id: string): Promise<boolean> {
    await this.ensureInitialized();
    await db.delete(contacts).where(eq(contacts.id, id));
    return true;
  }

  // Calls
  async getAllCalls(): Promise<Call[]> {
    await this.ensureInitialized();
    return db.select().from(calls).orderBy(desc(calls.callStart));
  }

  async getCall(id: string): Promise<Call | undefined> {
    await this.ensureInitialized();
    const [call] = await db.select().from(calls).where(eq(calls.id, id));
    return call;
  }

  async getCallsByLead(leadId: string): Promise<Call[]> {
    await this.ensureInitialized();
    return db.select().from(calls).where(eq(calls.leadId, leadId));
  }

  async createCall(call: InsertCall): Promise<Call> {
    await this.ensureInitialized();
    const [created] = await db.insert(calls).values(call).returning();
    return created;
  }

  async updateCall(id: string, data: Partial<InsertCall>): Promise<Call | undefined> {
    await this.ensureInitialized();
    const [updated] = await db.update(calls).set(data).where(eq(calls.id, id)).returning();
    return updated;
  }

  // Call Transcripts
  async getCallTranscript(callId: string): Promise<CallTranscript | undefined> {
    await this.ensureInitialized();
    const [transcript] = await db.select().from(callTranscripts).where(eq(callTranscripts.callId, callId));
    return transcript;
  }

  async getTranscriptByCall(callId: string): Promise<CallTranscript | undefined> {
    return this.getCallTranscript(callId);
  }

  async createCallTranscript(transcript: InsertCallTranscript): Promise<CallTranscript> {
    await this.ensureInitialized();
    const [created] = await db.insert(callTranscripts).values(transcript).returning();
    return created;
  }

  // Call Outcomes
  async getCallOutcome(callId: string): Promise<CallOutcome | undefined> {
    await this.ensureInitialized();
    const [outcome] = await db.select().from(callOutcomes).where(eq(callOutcomes.callId, callId));
    return outcome;
  }

  async getOutcomeByCall(callId: string): Promise<CallOutcome | undefined> {
    return this.getCallOutcome(callId);
  }

  async createCallOutcome(outcome: InsertCallOutcome): Promise<CallOutcome> {
    await this.ensureInitialized();
    const [created] = await db.insert(callOutcomes).values(outcome).returning();
    return created;
  }

  // Web Form Submissions
  async getAllWebFormSubmissions(): Promise<WebFormSubmission[]> {
    await this.ensureInitialized();
    return db.select().from(webFormSubmissions).orderBy(desc(webFormSubmissions.submittedAt));
  }

  async getWebFormSubmission(id: string): Promise<WebFormSubmission | undefined> {
    await this.ensureInitialized();
    const [submission] = await db.select().from(webFormSubmissions).where(eq(webFormSubmissions.id, id));
    return submission;
  }

  async getWebFormSubmissionsByLead(leadId: string): Promise<WebFormSubmission[]> {
    await this.ensureInitialized();
    return db.select().from(webFormSubmissions).where(eq(webFormSubmissions.leadId, leadId));
  }

  async createWebFormSubmission(submission: InsertWebFormSubmission): Promise<WebFormSubmission> {
    await this.ensureInitialized();
    const [created] = await db.insert(webFormSubmissions).values(submission).returning();
    return created;
  }

  async updateWebFormSubmission(id: string, data: Partial<InsertWebFormSubmission>): Promise<WebFormSubmission | undefined> {
    await this.ensureInitialized();
    const [updated] = await db.update(webFormSubmissions).set(data).where(eq(webFormSubmissions.id, id)).returning();
    return updated;
  }

  // Meetings
  async getAllMeetings(): Promise<Meeting[]> {
    await this.ensureInitialized();
    return db.select().from(meetings).orderBy(desc(meetings.scheduledAt));
  }

  async getMeeting(id: string): Promise<Meeting | undefined> {
    await this.ensureInitialized();
    const [meeting] = await db.select().from(meetings).where(eq(meetings.id, id));
    return meeting;
  }

  async getMeetingsByLead(leadId: string): Promise<Meeting[]> {
    await this.ensureInitialized();
    return db.select().from(meetings).where(eq(meetings.leadId, leadId));
  }

  async createMeeting(meeting: InsertMeeting): Promise<Meeting> {
    await this.ensureInitialized();
    const [created] = await db.insert(meetings).values(meeting).returning();
    return created;
  }

  async updateMeeting(id: string, data: Partial<InsertMeeting>): Promise<Meeting | undefined> {
    await this.ensureInitialized();
    const [updated] = await db.update(meetings).set(data).where(eq(meetings.id, id)).returning();
    return updated;
  }

  async deleteMeeting(id: string): Promise<boolean> {
    await this.ensureInitialized();
    await db.delete(meetings).where(eq(meetings.id, id));
    return true;
  }

  // Activity Logs
  async getAllActivityLogs(): Promise<ActivityLog[]> {
    await this.ensureInitialized();
    return db.select().from(activityLogs).orderBy(desc(activityLogs.createdAt));
  }

  async getActivityLogsByEntity(actorType: string, actorId: string): Promise<ActivityLog[]> {
    await this.ensureInitialized();
    return db.select().from(activityLogs).where(
      and(eq(activityLogs.actorType, actorType), eq(activityLogs.actorId, actorId))
    );
  }

  async getActivityLogsByLead(leadId: string): Promise<ActivityLog[]> {
    await this.ensureInitialized();
    return db.select().from(activityLogs).where(eq(activityLogs.leadId, leadId)).orderBy(desc(activityLogs.createdAt));
  }

  async createActivityLog(log: InsertActivityLog): Promise<ActivityLog> {
    await this.ensureInitialized();
    const [created] = await db.insert(activityLogs).values(log).returning();
    return created;
  }

  async deleteActivityLog(id: string): Promise<boolean> {
    await this.ensureInitialized();
    await db.delete(activityLogs).where(eq(activityLogs.id, id));
    return true;
  }

  // Audit Logs
  async getAllAuditLogs(): Promise<AuditLog[]> {
    await this.ensureInitialized();
    return db.select().from(auditLogs).orderBy(desc(auditLogs.performedAt));
  }

  async createAuditLog(log: InsertAuditLog): Promise<AuditLog> {
    await this.ensureInitialized();
    const [created] = await db.insert(auditLogs).values(log).returning();
    return created;
  }

  // External Contacts
  async getAllExternalContacts(): Promise<ExternalContact[]> {
    await this.ensureInitialized();
    return db.select().from(externalContacts).orderBy(desc(externalContacts.syncedAt));
  }

  async getExternalContact(id: string): Promise<ExternalContact | undefined> {
    await this.ensureInitialized();
    const [contact] = await db.select().from(externalContacts).where(eq(externalContacts.id, id));
    return contact;
  }

  async createExternalContact(contact: InsertExternalContact): Promise<ExternalContact> {
    await this.ensureInitialized();
    const [created] = await db.insert(externalContacts).values(contact).returning();
    return created;
  }

  async updateExternalContact(id: string, data: Partial<InsertExternalContact>): Promise<ExternalContact | undefined> {
    await this.ensureInitialized();
    const [updated] = await db.update(externalContacts).set(data).where(eq(externalContacts.id, id)).returning();
    return updated;
  }

  async upsertExternalContact(contact: InsertExternalContact): Promise<ExternalContact> {
    await this.ensureInitialized();
    const existing = await db.select().from(externalContacts).where(eq(externalContacts.externalId, contact.externalId));
    if (existing.length > 0) {
      const [updated] = await db.update(externalContacts)
        .set({ ...contact, syncedAt: new Date() })
        .where(eq(externalContacts.externalId, contact.externalId))
        .returning();
      return updated;
    }
    const [created] = await db.insert(externalContacts).values(contact).returning();
    return created;
  }

  async deleteExternalContact(id: string): Promise<boolean> {
    await this.ensureInitialized();
    await db.delete(externalContacts).where(eq(externalContacts.id, id));
    return true;
  }

  // External Conversations
  async getAllExternalConversations(): Promise<ExternalConversation[]> {
    await this.ensureInitialized();
    return db.select().from(externalConversations).orderBy(desc(externalConversations.syncedAt));
  }

  async getExternalConversation(id: string): Promise<ExternalConversation | undefined> {
    await this.ensureInitialized();
    const [convo] = await db.select().from(externalConversations).where(eq(externalConversations.id, id));
    return convo;
  }

  async createExternalConversation(convo: InsertExternalConversation): Promise<ExternalConversation> {
    await this.ensureInitialized();
    const [created] = await db.insert(externalConversations).values(convo).returning();
    return created;
  }

  async updateExternalConversation(id: string, data: Partial<InsertExternalConversation>): Promise<ExternalConversation | undefined> {
    await this.ensureInitialized();
    const [updated] = await db.update(externalConversations).set(data).where(eq(externalConversations.id, id)).returning();
    return updated;
  }

  async upsertExternalConversation(convo: InsertExternalConversation): Promise<ExternalConversation> {
    await this.ensureInitialized();
    const existing = await db.select().from(externalConversations).where(eq(externalConversations.externalId, convo.externalId));
    if (existing.length > 0) {
      const [updated] = await db.update(externalConversations)
        .set({ ...convo, syncedAt: new Date() })
        .where(eq(externalConversations.externalId, convo.externalId))
        .returning();
      return updated;
    }
    const [created] = await db.insert(externalConversations).values(convo).returning();
    return created;
  }

  async deleteExternalConversation(id: string): Promise<boolean> {
    await this.ensureInitialized();
    await db.delete(externalConversations).where(eq(externalConversations.id, id));
    return true;
  }

  // Events
  async getAllEvents(): Promise<Event[]> {
    await this.ensureInitialized();
    return db.select().from(events).orderBy(desc(events.timestamp));
  }

  async getEventsByType(eventType: string): Promise<Event[]> {
    await this.ensureInitialized();
    return db.select().from(events).where(eq(events.eventType, eventType)).orderBy(desc(events.timestamp));
  }

  async getEventsByCorrelation(correlationId: string): Promise<Event[]> {
    await this.ensureInitialized();
    return db.select().from(events).where(eq(events.correlationId, correlationId)).orderBy(desc(events.timestamp));
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    await this.ensureInitialized();
    const [created] = await db.insert(events).values(event).returning();
    return created;
  }

  async markEventProcessed(id: string): Promise<Event | undefined> {
    await this.ensureInitialized();
    const [updated] = await db.update(events).set({ processed: true }).where(eq(events.id, id)).returning();
    return updated;
  }

  // Analytics — SQL-level aggregation (no more loading all rows into JS)
  async getAnalyticsSummary(): Promise<{
    totalLeads: number;
    newLeadsToday: number;
    qualifiedLeads: number;
    closedLeads: number;
    conversionRate: number;
    callsMade: number;
  }> {
    await this.ensureInitialized();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [{ value: totalLeads }] = await db.select({ value: count() }).from(leads);
    const [{ value: newLeadsToday }] = await db.select({ value: count() }).from(leads).where(gte(leads.createdAt, today));
    const [{ value: qualifiedLeads }] = await db.select({ value: count() }).from(leads).where(eq(leads.status, "qualified"));
    const [{ value: closedLeads }] = await db.select({ value: count() }).from(leads).where(eq(leads.status, "closed"));
    const [{ value: callsMade }] = await db.select({ value: count() }).from(calls);

    const conversionRate = totalLeads > 0 ? Math.round((closedLeads / totalLeads) * 100) : 0;
    return { totalLeads, newLeadsToday, qualifiedLeads, closedLeads, conversionRate, callsMade };
  }

  async getWeeklyAnalytics(): Promise<{ day: string; leads: number; calls: number; conversions: number }[]> {
    await this.ensureInitialized();
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Fetch only this week's data (small set) then group in JS
    const weekLeads = await db.select().from(leads).where(gte(leads.createdAt, weekAgo));
    const weekCalls = await db.select().from(calls).where(gte(calls.callStart, weekAgo));

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const result: { day: string; leads: number; calls: number; conversions: number }[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dayLeads = weekLeads.filter(l => {
        const d = l.createdAt ? new Date(l.createdAt) : null;
        return d && d >= date && d < nextDate;
      }).length;

      const dayCalls = weekCalls.filter(c => {
        const d = c.callStart ? new Date(c.callStart) : null;
        return d && d >= date && d < nextDate;
      }).length;

      const dayConversions = weekLeads.filter(l => {
        const d = l.createdAt ? new Date(l.createdAt) : null;
        return d && d >= date && d < nextDate && l.status === "closed";
      }).length;

      result.push({ day: days[date.getDay()], leads: dayLeads, calls: dayCalls, conversions: dayConversions });
    }

    return result;
  }

  // Caller Agent States
  async getCallerAgentState(callId: string): Promise<CallerAgentState | undefined> {
    await this.ensureInitialized();
    const [state] = await db.select().from(callerAgentStates).where(eq(callerAgentStates.callId, callId));
    return state;
  }

  async getCallerAgentStateByVapiCallId(vapiCallId: string): Promise<CallerAgentState | undefined> {
    await this.ensureInitialized();
    const [state] = await db.select().from(callerAgentStates).where(eq(callerAgentStates.vapiCallId, vapiCallId));
    return state;
  }

  async createCallerAgentState(state: InsertCallerAgentState): Promise<CallerAgentState> {
    await this.ensureInitialized();
    const [created] = await db.insert(callerAgentStates).values(state).returning();
    return created;
  }

  async updateCallerAgentState(id: string, data: Partial<InsertCallerAgentState>): Promise<CallerAgentState | undefined> {
    await this.ensureInitialized();
    const [updated] = await db.update(callerAgentStates).set({ ...data, updatedAt: new Date() }).where(eq(callerAgentStates.id, id)).returning();
    return updated;
  }

  // Clients
  async getAllClients(): Promise<Client[]> {
    await this.ensureInitialized();
    return db.select().from(clients).orderBy(desc(clients.createdAt));
  }

  async getClient(id: string): Promise<Client | undefined> {
    await this.ensureInitialized();
    const [client] = await db.select().from(clients).where(eq(clients.id, id));
    return client;
  }

  async getClientByBusiness(businessId: string): Promise<Client | undefined> {
    await this.ensureInitialized();
    const [client] = await db.select().from(clients).where(eq(clients.businessId, businessId));
    return client;
  }

  async getClientByLead(leadId: string): Promise<Client | undefined> {
    await this.ensureInitialized();
    const [client] = await db.select().from(clients).where(eq(clients.leadId, leadId));
    return client;
  }

  // Enriched clients query — replaces N+1 Promise.all loop
  async getClientsEnriched(): Promise<Array<Client & { business: Business | null; assetCount: number; totalAssetCost: number }>> {
    await this.ensureInitialized();
    const rows = await db.select({
      client: clients,
      business: businesses,
    }).from(clients)
      .leftJoin(businesses, eq(clients.businessId, businesses.id))
      .orderBy(desc(clients.createdAt));

    const assetStats = await db.select({
      clientId: clientAssets.clientId,
      assetCount: count(),
      totalCost: sql<number>`coalesce(sum(${clientAssets.cost}), 0)`,
    }).from(clientAssets).groupBy(clientAssets.clientId);

    const assetMap = new Map(assetStats.map(a => [a.clientId, a]));

    return rows.map(r => ({
      ...r.client,
      business: r.business,
      assetCount: assetMap.get(r.client.id)?.assetCount ?? 0,
      totalAssetCost: Number(assetMap.get(r.client.id)?.totalCost ?? 0),
    }));
  }

  async createClient(client: InsertClient): Promise<Client> {
    await this.ensureInitialized();
    const [created] = await db.insert(clients).values(client).returning();
    return created;
  }

  async updateClient(id: string, data: Partial<InsertClient>): Promise<Client | undefined> {
    await this.ensureInitialized();
    const [updated] = await db.update(clients).set({ ...data, updatedAt: new Date() }).where(eq(clients.id, id)).returning();
    return updated;
  }

  async deleteClient(id: string): Promise<boolean> {
    await this.ensureInitialized();
    await db.delete(clients).where(eq(clients.id, id));
    return true;
  }

  // Client Assets
  async getAllClientAssets(): Promise<ClientAsset[]> {
    await this.ensureInitialized();
    return db.select().from(clientAssets).orderBy(desc(clientAssets.createdAt));
  }

  async getAssetsByClient(clientId: string): Promise<ClientAsset[]> {
    await this.ensureInitialized();
    return db.select().from(clientAssets).where(eq(clientAssets.clientId, clientId));
  }

  async getClientAsset(id: string): Promise<ClientAsset | undefined> {
    await this.ensureInitialized();
    const [asset] = await db.select().from(clientAssets).where(eq(clientAssets.id, id));
    return asset;
  }

  // SQL-level expiry filtering (no more loading all assets into JS)
  async getExpiringAssets(daysAhead: number): Promise<ClientAsset[]> {
    await this.ensureInitialized();
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);

    return db.select().from(clientAssets).where(
      and(
        gte(clientAssets.expiryDate, now),
        lte(clientAssets.expiryDate, futureDate),
      )
    );
  }

  async createClientAsset(asset: InsertClientAsset): Promise<ClientAsset> {
    await this.ensureInitialized();
    const [created] = await db.insert(clientAssets).values(asset).returning();
    return created;
  }

  async updateClientAsset(id: string, data: Partial<InsertClientAsset>): Promise<ClientAsset | undefined> {
    await this.ensureInitialized();
    const [updated] = await db.update(clientAssets).set({ ...data, updatedAt: new Date() }).where(eq(clientAssets.id, id)).returning();
    return updated;
  }

  async deleteClientAsset(id: string): Promise<boolean> {
    await this.ensureInitialized();
    await db.delete(clientAssets).where(eq(clientAssets.id, id));
    return true;
  }

  // Client Notes
  async getNotesByClient(clientId: string): Promise<ClientNote[]> {
    await this.ensureInitialized();
    return db.select().from(clientNotes).where(eq(clientNotes.clientId, clientId)).orderBy(desc(clientNotes.createdAt));
  }

  async createClientNote(note: InsertClientNote): Promise<ClientNote> {
    await this.ensureInitialized();
    const [created] = await db.insert(clientNotes).values(note).returning();
    return created;
  }

  async deleteClientNote(id: string): Promise<boolean> {
    await this.ensureInitialized();
    await db.delete(clientNotes).where(eq(clientNotes.id, id));
    return true;
  }

  // Nurturing Sequences
  async getAllNurturingSequences(): Promise<NurturingSequence[]> {
    await this.ensureInitialized();
    return db.select().from(nurturingSequences).orderBy(desc(nurturingSequences.createdAt));
  }

  async getNurturingSequence(id: string): Promise<NurturingSequence | undefined> {
    await this.ensureInitialized();
    const [sequence] = await db.select().from(nurturingSequences).where(eq(nurturingSequences.id, id));
    return sequence;
  }

  async getActiveNurturingSequences(): Promise<NurturingSequence[]> {
    await this.ensureInitialized();
    return db.select().from(nurturingSequences).where(eq(nurturingSequences.status, "active"));
  }

  async getNurturingSequenceByTrigger(triggerEvent: string): Promise<NurturingSequence[]> {
    await this.ensureInitialized();
    return db.select().from(nurturingSequences).where(
      and(eq(nurturingSequences.triggerEvent, triggerEvent), eq(nurturingSequences.status, "active"))
    );
  }

  async createNurturingSequence(sequence: InsertNurturingSequence): Promise<NurturingSequence> {
    await this.ensureInitialized();
    const [created] = await db.insert(nurturingSequences).values(sequence).returning();
    return created;
  }

  async updateNurturingSequence(id: string, data: Partial<InsertNurturingSequence>): Promise<NurturingSequence | undefined> {
    await this.ensureInitialized();
    const [updated] = await db.update(nurturingSequences).set({ ...data, updatedAt: new Date() }).where(eq(nurturingSequences.id, id)).returning();
    return updated;
  }

  async deleteNurturingSequence(id: string): Promise<boolean> {
    await this.ensureInitialized();
    await db.delete(nurturingSequences).where(eq(nurturingSequences.id, id));
    return true;
  }

  // Nurturing Steps
  async getStepsBySequence(sequenceId: string): Promise<NurturingStep[]> {
    await this.ensureInitialized();
    return db.select().from(nurturingSteps).where(eq(nurturingSteps.sequenceId, sequenceId)).orderBy(nurturingSteps.stepOrder);
  }

  async getNurturingStep(id: string): Promise<NurturingStep | undefined> {
    await this.ensureInitialized();
    const [step] = await db.select().from(nurturingSteps).where(eq(nurturingSteps.id, id));
    return step;
  }

  async createNurturingStep(step: InsertNurturingStep): Promise<NurturingStep> {
    await this.ensureInitialized();
    const [created] = await db.insert(nurturingSteps).values(step).returning();
    return created;
  }

  async updateNurturingStep(id: string, data: Partial<InsertNurturingStep>): Promise<NurturingStep | undefined> {
    await this.ensureInitialized();
    const [updated] = await db.update(nurturingSteps).set(data).where(eq(nurturingSteps.id, id)).returning();
    return updated;
  }

  async deleteNurturingStep(id: string): Promise<boolean> {
    await this.ensureInitialized();
    await db.delete(nurturingSteps).where(eq(nurturingSteps.id, id));
    return true;
  }

  // Lead Nurturing Enrollments
  async getEnrollmentsByLead(leadId: string): Promise<LeadNurturingEnrollment[]> {
    await this.ensureInitialized();
    return db.select().from(leadNurturingEnrollments).where(eq(leadNurturingEnrollments.leadId, leadId));
  }

  async getEnrollmentsBySequence(sequenceId: string): Promise<LeadNurturingEnrollment[]> {
    await this.ensureInitialized();
    return db.select().from(leadNurturingEnrollments).where(eq(leadNurturingEnrollments.sequenceId, sequenceId));
  }

  async getActiveEnrollments(): Promise<LeadNurturingEnrollment[]> {
    await this.ensureInitialized();
    return db.select().from(leadNurturingEnrollments).where(eq(leadNurturingEnrollments.status, "active"));
  }

  async getEnrollment(id: string): Promise<LeadNurturingEnrollment | undefined> {
    await this.ensureInitialized();
    const [enrollment] = await db.select().from(leadNurturingEnrollments).where(eq(leadNurturingEnrollments.id, id));
    return enrollment;
  }

  async createEnrollment(enrollment: InsertLeadNurturingEnrollment): Promise<LeadNurturingEnrollment> {
    await this.ensureInitialized();
    const [created] = await db.insert(leadNurturingEnrollments).values(enrollment).returning();
    return created;
  }

  async updateEnrollment(id: string, data: Partial<InsertLeadNurturingEnrollment>): Promise<LeadNurturingEnrollment | undefined> {
    await this.ensureInitialized();
    const [updated] = await db.update(leadNurturingEnrollments).set(data).where(eq(leadNurturingEnrollments.id, id)).returning();
    return updated;
  }

  // Scheduled Messages
  async getPendingScheduledMessages(): Promise<ScheduledMessage[]> {
    await this.ensureInitialized();
    return db.select().from(scheduledMessages)
      .where(and(eq(scheduledMessages.status, "pending"), sql`${scheduledMessages.scheduledFor} <= NOW()`))
      .orderBy(scheduledMessages.scheduledFor);
  }

  async getScheduledMessagesByLead(leadId: string): Promise<ScheduledMessage[]> {
    await this.ensureInitialized();
    return db.select().from(scheduledMessages).where(eq(scheduledMessages.leadId, leadId));
  }

  async getScheduledMessage(id: string): Promise<ScheduledMessage | undefined> {
    await this.ensureInitialized();
    const [message] = await db.select().from(scheduledMessages).where(eq(scheduledMessages.id, id));
    return message;
  }

  async createScheduledMessage(message: InsertScheduledMessage): Promise<ScheduledMessage> {
    await this.ensureInitialized();
    const [created] = await db.insert(scheduledMessages).values(message).returning();
    return created;
  }

  async updateScheduledMessage(id: string, data: Partial<InsertScheduledMessage>): Promise<ScheduledMessage | undefined> {
    await this.ensureInitialized();
    const [updated] = await db.update(scheduledMessages).set(data).where(eq(scheduledMessages.id, id)).returning();
    return updated;
  }

  // Message Engagements
  async getEngagementsByMessage(messageId: string): Promise<MessageEngagement[]> {
    await this.ensureInitialized();
    return db.select().from(messageEngagements).where(eq(messageEngagements.messageId, messageId));
  }

  async getEngagementsByLead(leadId: string): Promise<MessageEngagement[]> {
    await this.ensureInitialized();
    return db.select().from(messageEngagements).where(eq(messageEngagements.leadId, leadId));
  }

  async createMessageEngagement(engagement: InsertMessageEngagement): Promise<MessageEngagement> {
    await this.ensureInitialized();
    const [created] = await db.insert(messageEngagements).values(engagement).returning();
    return created;
  }

  // Lead Nurturing Tags
  async getTagsByLead(leadId: string): Promise<LeadNurturingTag[]> {
    await this.ensureInitialized();
    return db.select().from(leadNurturingTags).where(eq(leadNurturingTags.leadId, leadId));
  }

  async createLeadNurturingTag(tag: InsertLeadNurturingTag): Promise<LeadNurturingTag> {
    await this.ensureInitialized();
    const [created] = await db.insert(leadNurturingTags).values(tag).returning();
    return created;
  }

  async deleteLeadNurturingTag(id: string): Promise<boolean> {
    await this.ensureInitialized();
    await db.delete(leadNurturingTags).where(eq(leadNurturingTags.id, id));
    return true;
  }

  // Sample Sites
  async getSampleSite(id: string): Promise<SampleSite | undefined> {
    await this.ensureInitialized();
    const [site] = await db.select().from(sampleSites).where(eq(sampleSites.id, id));
    return site;
  }

  async getSampleSiteBySlug(slug: string): Promise<SampleSite | undefined> {
    await this.ensureInitialized();
    const [site] = await db.select().from(sampleSites).where(eq(sampleSites.slug, slug));
    return site;
  }

  async getSampleSitesByLead(leadId: string): Promise<SampleSite[]> {
    await this.ensureInitialized();
    return db.select().from(sampleSites).where(eq(sampleSites.leadId, leadId));
  }

  async getSampleSitesPendingApproval(): Promise<SampleSite[]> {
    await this.ensureInitialized();
    return db.select().from(sampleSites).where(eq(sampleSites.approvalStatus, "pending"));
  }

  async createSampleSite(site: InsertSampleSite): Promise<SampleSite> {
    await this.ensureInitialized();
    const [created] = await db.insert(sampleSites).values(site).returning();
    return created;
  }

  async updateSampleSite(id: string, data: Partial<InsertSampleSite>): Promise<SampleSite | undefined> {
    await this.ensureInitialized();
    const [updated] = await db.update(sampleSites).set({ ...data, updatedAt: new Date() }).where(eq(sampleSites.id, id)).returning();
    return updated;
  }

  async deleteSampleSite(id: string): Promise<boolean> {
    await this.ensureInitialized();
    await db.delete(sampleSites).where(eq(sampleSites.id, id));
    return true;
  }

  // Approval Queue
  async getApprovalQueue(): Promise<ApprovalQueue[]> {
    await this.ensureInitialized();
    return db.select().from(approvalQueue).orderBy(desc(approvalQueue.createdAt));
  }

  async getApprovalQueueItem(id: string): Promise<ApprovalQueue | undefined> {
    await this.ensureInitialized();
    const [item] = await db.select().from(approvalQueue).where(eq(approvalQueue.id, id));
    return item;
  }

  async createApprovalQueueItem(item: InsertApprovalQueue): Promise<ApprovalQueue> {
    await this.ensureInitialized();
    const [created] = await db.insert(approvalQueue).values(item).returning();
    return created;
  }

  async updateApprovalQueueItem(id: string, data: Partial<InsertApprovalQueue>): Promise<ApprovalQueue | undefined> {
    await this.ensureInitialized();
    const [updated] = await db.update(approvalQueue).set(data).where(eq(approvalQueue.id, id)).returning();
    return updated;
  }

  async deleteApprovalQueueItem(id: string): Promise<boolean> {
    await this.ensureInitialized();
    await db.delete(approvalQueue).where(eq(approvalQueue.id, id));
    return true;
  }

  // Approval Edit Requests
  async getEditRequestsByItem(itemType: string, itemId: string): Promise<ApprovalEditRequest[]> {
    await this.ensureInitialized();
    return db.select().from(approvalEditRequests).where(
      and(eq(approvalEditRequests.itemType, itemType), eq(approvalEditRequests.itemId, itemId))
    ).orderBy(approvalEditRequests.createdAt);
  }

  async createEditRequest(request: InsertApprovalEditRequest): Promise<ApprovalEditRequest> {
    await this.ensureInitialized();
    const [created] = await db.insert(approvalEditRequests).values(request).returning();
    return created;
  }

  // Messages pending approval
  async getScheduledMessagesPendingApproval(): Promise<ScheduledMessage[]> {
    await this.ensureInitialized();
    return db.select().from(scheduledMessages).where(eq(scheduledMessages.status, "pending_approval"));
  }

  // Agent Configs
  async getAgentConfig(agentId: string): Promise<AgentConfig | undefined> {
    await this.ensureInitialized();
    const [config] = await db.select().from(agentConfigs).where(eq(agentConfigs.agentId, agentId));
    return config;
  }

  async getAllAgentConfigs(): Promise<AgentConfig[]> {
    await this.ensureInitialized();
    return db.select().from(agentConfigs);
  }

  async upsertAgentConfig(config: InsertAgentConfig): Promise<AgentConfig> {
    await this.ensureInitialized();
    const existing = await db.select().from(agentConfigs).where(eq(agentConfigs.agentId, config.agentId));
    if (existing.length > 0) {
      const [updated] = await db.update(agentConfigs)
        .set({ ...config, updatedAt: new Date() })
        .where(eq(agentConfigs.agentId, config.agentId))
        .returning();
      return updated;
    }
    const [created] = await db.insert(agentConfigs).values(config).returning();
    return created;
  }

  // Global Settings
  async getGlobalSettings(): Promise<GlobalSetting[]> {
    await this.ensureInitialized();
    return db.select().from(globalSettings);
  }

  async getGlobalSetting(key: string): Promise<GlobalSetting | undefined> {
    await this.ensureInitialized();
    const [setting] = await db.select().from(globalSettings).where(eq(globalSettings.key, key));
    return setting;
  }

  async upsertGlobalSetting(key: string, value: unknown): Promise<GlobalSetting> {
    await this.ensureInitialized();
    const existing = await this.getGlobalSetting(key);
    if (existing) {
      const [updated] = await db.update(globalSettings)
        .set({ value, updatedAt: new Date() })
        .where(eq(globalSettings.key, key))
        .returning();
      return updated;
    }
    const [created] = await db.insert(globalSettings).values({ key, value }).returning();
    return created;
  }
}

export async function seedDatabase() {
  const storage = new DatabaseStorage();
  await storage.ensureInitialized();
}
