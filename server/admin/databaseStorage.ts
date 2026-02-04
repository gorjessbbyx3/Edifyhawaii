import { eq, desc, and, gte, sql } from "drizzle-orm";
import { db } from "./db";
import {
  User, InsertUser, users,
  Organization, InsertOrganization, organizations,
  Role, InsertRole, roles,
  Agent, InsertAgent, agents,
  AgentTask, InsertAgentTask, agentTasks,
  Business, InsertBusiness, businesses,
  Lead, InsertLead, leads,
  OnlinePresenceCheck, InsertOnlinePresenceCheck, onlinePresenceChecks,
  Contact, InsertContact, contacts,
  Call, InsertCall, calls,
  CallTranscript, InsertCallTranscript, callTranscripts,
  CallOutcome, InsertCallOutcome, callOutcomes,
  WebFormSubmission, InsertWebFormSubmission, webFormSubmissions,
  Meeting, InsertMeeting, meetings,
  ActivityLog, InsertActivityLog, activityLogs,
  AuditLog, InsertAuditLog, auditLogs,
  ExternalContact, InsertExternalContact, externalContacts,
  ExternalConversation, InsertExternalConversation, externalConversations,
  Event, InsertEvent, events,
  CallerAgentState, InsertCallerAgentState, callerAgentStates,
  Client, InsertClient, clients,
  ClientAsset, InsertClientAsset, clientAssets,
  ClientNote, InsertClientNote, clientNotes,
  NurturingSequence, InsertNurturingSequence, nurturingSequences,
  NurturingStep, InsertNurturingStep, nurturingSteps,
  LeadNurturingEnrollment, InsertLeadNurturingEnrollment, leadNurturingEnrollments,
  ScheduledMessage, InsertScheduledMessage, scheduledMessages,
  MessageEngagement, InsertMessageEngagement, messageEngagements,
  LeadNurturingTag, InsertLeadNurturingTag, leadNurturingTags,
  SampleSite, InsertSampleSite, sampleSites,
  ApprovalEditRequest, InsertApprovalEditRequest, approvalEditRequests,
  ApprovalQueue, InsertApprovalQueue, approvalQueue,
  agentDefinitions,
} from "@shared/schema";
import { IStorage } from "./storage";

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

  async getUser(id: string): Promise<User | undefined> {
    await this.ensureInitialized();
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    await this.ensureInitialized();
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    await this.ensureInitialized();
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getOrganization(id: string): Promise<Organization | undefined> {
    await this.ensureInitialized();
    const [org] = await db.select().from(organizations).where(eq(organizations.id, id));
    return org || undefined;
  }

  async createOrganization(insertOrg: InsertOrganization): Promise<Organization> {
    await this.ensureInitialized();
    const [org] = await db.insert(organizations).values(insertOrg).returning();
    return org;
  }

  async getRole(id: string): Promise<Role | undefined> {
    await this.ensureInitialized();
    const [role] = await db.select().from(roles).where(eq(roles.id, id));
    return role || undefined;
  }

  async getAllRoles(): Promise<Role[]> {
    await this.ensureInitialized();
    return db.select().from(roles);
  }

  async getAllAgents(): Promise<Agent[]> {
    await this.ensureInitialized();
    return db.select().from(agents);
  }

  async getAgent(id: string): Promise<Agent | undefined> {
    await this.ensureInitialized();
    const [agent] = await db.select().from(agents).where(eq(agents.id, id));
    return agent || undefined;
  }

  async getAgentByType(type: string): Promise<Agent | undefined> {
    await this.ensureInitialized();
    const [agent] = await db.select().from(agents).where(eq(agents.type, type));
    return agent || undefined;
  }

  async createAgent(insertAgent: InsertAgent): Promise<Agent> {
    await this.ensureInitialized();
    const [agent] = await db.insert(agents).values(insertAgent).returning();
    return agent;
  }

  async updateAgent(id: string, data: Partial<InsertAgent>): Promise<Agent | undefined> {
    await this.ensureInitialized();
    const [agent] = await db.update(agents).set(data).where(eq(agents.id, id)).returning();
    return agent || undefined;
  }

  async deleteAgent(id: string): Promise<boolean> {
    await this.ensureInitialized();
    const result = await db.delete(agents).where(eq(agents.id, id));
    return true;
  }

  async getAllAgentTasks(): Promise<AgentTask[]> {
    await this.ensureInitialized();
    return db.select().from(agentTasks);
  }

  async getAgentTasksByAgent(agentId: string): Promise<AgentTask[]> {
    await this.ensureInitialized();
    return db.select().from(agentTasks).where(eq(agentTasks.agentId, agentId));
  }

  async createAgentTask(insertTask: InsertAgentTask): Promise<AgentTask> {
    await this.ensureInitialized();
    const [task] = await db.insert(agentTasks).values(insertTask).returning();
    return task;
  }

  async updateAgentTask(id: string, data: Partial<InsertAgentTask>): Promise<AgentTask | undefined> {
    await this.ensureInitialized();
    const [task] = await db.update(agentTasks).set(data).where(eq(agentTasks.id, id)).returning();
    return task || undefined;
  }

  async getAllBusinesses(): Promise<Business[]> {
    await this.ensureInitialized();
    return db.select().from(businesses).orderBy(desc(businesses.createdAt));
  }

  async getBusiness(id: string): Promise<Business | undefined> {
    await this.ensureInitialized();
    const [business] = await db.select().from(businesses).where(eq(businesses.id, id));
    return business || undefined;
  }

  async createBusiness(insertBusiness: InsertBusiness): Promise<Business> {
    await this.ensureInitialized();
    const [business] = await db.insert(businesses).values(insertBusiness).returning();
    return business;
  }

  async updateBusiness(id: string, data: Partial<InsertBusiness>): Promise<Business | undefined> {
    await this.ensureInitialized();
    const [business] = await db.update(businesses).set(data).where(eq(businesses.id, id)).returning();
    return business || undefined;
  }

  async deleteBusiness(id: string): Promise<boolean> {
    await this.ensureInitialized();
    await db.delete(businesses).where(eq(businesses.id, id));
    return true;
  }

  async getAllLeads(): Promise<Lead[]> {
    await this.ensureInitialized();
    return db.select().from(leads).orderBy(desc(leads.createdAt));
  }

  async getLead(id: string): Promise<Lead | undefined> {
    await this.ensureInitialized();
    const [lead] = await db.select().from(leads).where(eq(leads.id, id));
    return lead || undefined;
  }

  async getLeadsByBusiness(businessId: string): Promise<Lead[]> {
    await this.ensureInitialized();
    return db.select().from(leads).where(eq(leads.businessId, businessId));
  }

  async createLead(insertLead: InsertLead): Promise<Lead> {
    await this.ensureInitialized();
    const [lead] = await db.insert(leads).values(insertLead).returning();
    return lead;
  }

  async updateLead(id: string, data: Partial<InsertLead>): Promise<Lead | undefined> {
    await this.ensureInitialized();
    const [lead] = await db.update(leads).set({ ...data, updatedAt: new Date() }).where(eq(leads.id, id)).returning();
    return lead || undefined;
  }

  async deleteLead(id: string): Promise<boolean> {
    await this.ensureInitialized();
    await db.delete(leads).where(eq(leads.id, id));
    return true;
  }

  async getOnlinePresenceByBusiness(businessId: string): Promise<OnlinePresenceCheck | undefined> {
    await this.ensureInitialized();
    const [check] = await db.select().from(onlinePresenceChecks).where(eq(onlinePresenceChecks.businessId, businessId));
    return check || undefined;
  }

  async createOnlinePresenceCheck(insertCheck: InsertOnlinePresenceCheck): Promise<OnlinePresenceCheck> {
    await this.ensureInitialized();
    const [check] = await db.insert(onlinePresenceChecks).values(insertCheck).returning();
    return check;
  }

  async getAllContacts(): Promise<Contact[]> {
    await this.ensureInitialized();
    return db.select().from(contacts).orderBy(desc(contacts.createdAt));
  }

  async getContactsByBusiness(businessId: string): Promise<Contact[]> {
    await this.ensureInitialized();
    return db.select().from(contacts).where(eq(contacts.businessId, businessId));
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    await this.ensureInitialized();
    const [contact] = await db.insert(contacts).values(insertContact).returning();
    return contact;
  }

  async updateContact(id: string, data: Partial<InsertContact>): Promise<Contact | undefined> {
    await this.ensureInitialized();
    const [contact] = await db.update(contacts).set(data).where(eq(contacts.id, id)).returning();
    return contact || undefined;
  }

  async deleteContact(id: string): Promise<boolean> {
    await this.ensureInitialized();
    await db.delete(contacts).where(eq(contacts.id, id));
    return true;
  }

  async getAllCalls(): Promise<Call[]> {
    await this.ensureInitialized();
    return db.select().from(calls);
  }

  async getCallsByLead(leadId: string): Promise<Call[]> {
    await this.ensureInitialized();
    return db.select().from(calls).where(eq(calls.leadId, leadId));
  }

  async createCall(insertCall: InsertCall): Promise<Call> {
    await this.ensureInitialized();
    const [call] = await db.insert(calls).values(insertCall).returning();
    return call;
  }

  async getTranscriptByCall(callId: string): Promise<CallTranscript | undefined> {
    await this.ensureInitialized();
    const [transcript] = await db.select().from(callTranscripts).where(eq(callTranscripts.callId, callId));
    return transcript || undefined;
  }

  async createCallTranscript(insertTranscript: InsertCallTranscript): Promise<CallTranscript> {
    await this.ensureInitialized();
    const [transcript] = await db.insert(callTranscripts).values(insertTranscript).returning();
    return transcript;
  }

  async getOutcomeByCall(callId: string): Promise<CallOutcome | undefined> {
    await this.ensureInitialized();
    const [outcome] = await db.select().from(callOutcomes).where(eq(callOutcomes.callId, callId));
    return outcome || undefined;
  }

  async createCallOutcome(insertOutcome: InsertCallOutcome): Promise<CallOutcome> {
    await this.ensureInitialized();
    const [outcome] = await db.insert(callOutcomes).values(insertOutcome).returning();
    return outcome;
  }

  async getAllWebFormSubmissions(): Promise<WebFormSubmission[]> {
    await this.ensureInitialized();
    return db.select().from(webFormSubmissions);
  }

  async getWebFormSubmissionsByLead(leadId: string): Promise<WebFormSubmission[]> {
    await this.ensureInitialized();
    return db.select().from(webFormSubmissions).where(eq(webFormSubmissions.leadId, leadId));
  }

  async createWebFormSubmission(insertSubmission: InsertWebFormSubmission): Promise<WebFormSubmission> {
    await this.ensureInitialized();
    const [submission] = await db.insert(webFormSubmissions).values(insertSubmission).returning();
    return submission;
  }

  async getAllMeetings(): Promise<Meeting[]> {
    await this.ensureInitialized();
    return db.select().from(meetings);
  }

  async getMeetingsByLead(leadId: string): Promise<Meeting[]> {
    await this.ensureInitialized();
    return db.select().from(meetings).where(eq(meetings.leadId, leadId));
  }

  async createMeeting(insertMeeting: InsertMeeting): Promise<Meeting> {
    await this.ensureInitialized();
    const [meeting] = await db.insert(meetings).values(insertMeeting).returning();
    return meeting;
  }

  async updateMeeting(id: string, data: Partial<InsertMeeting>): Promise<Meeting | undefined> {
    await this.ensureInitialized();
    const [meeting] = await db.update(meetings).set(data).where(eq(meetings.id, id)).returning();
    return meeting || undefined;
  }

  async getAllActivityLogs(): Promise<ActivityLog[]> {
    await this.ensureInitialized();
    return db.select().from(activityLogs).orderBy(desc(activityLogs.createdAt));
  }

  async getActivityLogsByLead(leadId: string): Promise<ActivityLog[]> {
    await this.ensureInitialized();
    return db.select().from(activityLogs).where(eq(activityLogs.leadId, leadId)).orderBy(desc(activityLogs.createdAt));
  }

  async createActivityLog(insertLog: InsertActivityLog): Promise<ActivityLog> {
    await this.ensureInitialized();
    const [log] = await db.insert(activityLogs).values(insertLog).returning();
    return log;
  }

  async deleteActivityLog(id: string): Promise<boolean> {
    await this.ensureInitialized();
    await db.delete(activityLogs).where(eq(activityLogs.id, id));
    return true;
  }

  async getAllAuditLogs(): Promise<AuditLog[]> {
    await this.ensureInitialized();
    return db.select().from(auditLogs).orderBy(desc(auditLogs.performedAt));
  }

  async createAuditLog(insertLog: InsertAuditLog): Promise<AuditLog> {
    await this.ensureInitialized();
    const [log] = await db.insert(auditLogs).values(insertLog).returning();
    return log;
  }

  async getAllExternalContacts(): Promise<ExternalContact[]> {
    await this.ensureInitialized();
    return db.select().from(externalContacts).orderBy(desc(externalContacts.syncedAt));
  }

  async getExternalContact(id: string): Promise<ExternalContact | undefined> {
    await this.ensureInitialized();
    const [contact] = await db.select().from(externalContacts).where(eq(externalContacts.id, id));
    return contact || undefined;
  }

  async upsertExternalContact(insertContact: InsertExternalContact): Promise<ExternalContact> {
    await this.ensureInitialized();
    const existing = await db.select().from(externalContacts).where(eq(externalContacts.externalId, insertContact.externalId));
    if (existing.length > 0) {
      const [updated] = await db.update(externalContacts)
        .set({ ...insertContact, syncedAt: new Date() })
        .where(eq(externalContacts.externalId, insertContact.externalId))
        .returning();
      return updated;
    }
    const [contact] = await db.insert(externalContacts).values(insertContact).returning();
    return contact;
  }

  async deleteExternalContact(id: string): Promise<boolean> {
    await this.ensureInitialized();
    await db.delete(externalContacts).where(eq(externalContacts.id, id));
    return true;
  }

  async getAllExternalConversations(): Promise<ExternalConversation[]> {
    await this.ensureInitialized();
    return db.select().from(externalConversations).orderBy(desc(externalConversations.syncedAt));
  }

  async getExternalConversation(id: string): Promise<ExternalConversation | undefined> {
    await this.ensureInitialized();
    const [conv] = await db.select().from(externalConversations).where(eq(externalConversations.id, id));
    return conv || undefined;
  }

  async upsertExternalConversation(insertConv: InsertExternalConversation): Promise<ExternalConversation> {
    await this.ensureInitialized();
    const existing = await db.select().from(externalConversations).where(eq(externalConversations.externalId, insertConv.externalId));
    if (existing.length > 0) {
      const [updated] = await db.update(externalConversations)
        .set({ ...insertConv, syncedAt: new Date() })
        .where(eq(externalConversations.externalId, insertConv.externalId))
        .returning();
      return updated;
    }
    const [conv] = await db.insert(externalConversations).values(insertConv).returning();
    return conv;
  }

  async deleteExternalConversation(id: string): Promise<boolean> {
    await this.ensureInitialized();
    await db.delete(externalConversations).where(eq(externalConversations.id, id));
    return true;
  }

  async getAnalyticsSummary(): Promise<{
    totalLeads: number;
    newLeadsToday: number;
    qualifiedLeads: number;
    closedLeads: number;
    conversionRate: number;
    callsMade: number;
  }> {
    await this.ensureInitialized();
    const allLeads = await db.select().from(leads);
    const allCalls = await db.select().from(calls);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const totalLeads = allLeads.length;
    const newLeadsToday = allLeads.filter(l => l.createdAt && new Date(l.createdAt) >= today).length;
    const qualifiedLeads = allLeads.filter(l => l.status === "qualified").length;
    const closedLeads = allLeads.filter(l => l.status === "closed").length;
    const conversionRate = totalLeads > 0 ? Math.round((closedLeads / totalLeads) * 100) : 0;
    const callsMade = allCalls.length;

    return { totalLeads, newLeadsToday, qualifiedLeads, closedLeads, conversionRate, callsMade };
  }

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

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    await this.ensureInitialized();
    const [event] = await db.insert(events).values(insertEvent).returning();
    return event;
  }

  async markEventProcessed(id: string): Promise<Event | undefined> {
    await this.ensureInitialized();
    const [event] = await db.update(events).set({ processed: true }).where(eq(events.id, id)).returning();
    return event || undefined;
  }

  async getContact(id: string): Promise<Contact | undefined> {
    await this.ensureInitialized();
    const [contact] = await db.select().from(contacts).where(eq(contacts.id, id));
    return contact || undefined;
  }

  async getCall(id: string): Promise<Call | undefined> {
    await this.ensureInitialized();
    const [call] = await db.select().from(calls).where(eq(calls.id, id));
    return call || undefined;
  }

  async updateCall(id: string, data: Partial<InsertCall>): Promise<Call | undefined> {
    await this.ensureInitialized();
    const [call] = await db.update(calls).set(data).where(eq(calls.id, id)).returning();
    return call || undefined;
  }

  async getCallerAgentState(callId: string): Promise<CallerAgentState | undefined> {
    await this.ensureInitialized();
    const [state] = await db.select().from(callerAgentStates).where(eq(callerAgentStates.callId, callId));
    return state || undefined;
  }

  async getCallerAgentStateByVapiCallId(vapiCallId: string): Promise<CallerAgentState | undefined> {
    await this.ensureInitialized();
    const [state] = await db.select().from(callerAgentStates).where(eq(callerAgentStates.vapiCallId, vapiCallId));
    return state || undefined;
  }

  async createCallerAgentState(insertState: InsertCallerAgentState): Promise<CallerAgentState> {
    await this.ensureInitialized();
    const [state] = await db.insert(callerAgentStates).values(insertState).returning();
    return state;
  }

  async updateCallerAgentState(callId: string, data: Partial<InsertCallerAgentState>): Promise<CallerAgentState | undefined> {
    await this.ensureInitialized();
    const [state] = await db.update(callerAgentStates)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(callerAgentStates.callId, callId))
      .returning();
    return state || undefined;
  }

  async getAllClients(): Promise<Client[]> {
    await this.ensureInitialized();
    return db.select().from(clients).orderBy(desc(clients.createdAt));
  }

  async getClient(id: string): Promise<Client | undefined> {
    await this.ensureInitialized();
    const [client] = await db.select().from(clients).where(eq(clients.id, id));
    return client || undefined;
  }

  async getClientByBusiness(businessId: string): Promise<Client | undefined> {
    await this.ensureInitialized();
    const [client] = await db.select().from(clients).where(eq(clients.businessId, businessId));
    return client || undefined;
  }

  async getClientByLead(leadId: string): Promise<Client | undefined> {
    await this.ensureInitialized();
    const [client] = await db.select().from(clients).where(eq(clients.leadId, leadId));
    return client || undefined;
  }

  async createClient(insertClient: InsertClient): Promise<Client> {
    await this.ensureInitialized();
    const [client] = await db.insert(clients).values(insertClient).returning();
    return client;
  }

  async updateClient(id: string, data: Partial<InsertClient>): Promise<Client | undefined> {
    await this.ensureInitialized();
    const [client] = await db.update(clients).set({ ...data, updatedAt: new Date() }).where(eq(clients.id, id)).returning();
    return client || undefined;
  }

  async deleteClient(id: string): Promise<boolean> {
    await this.ensureInitialized();
    await db.delete(clients).where(eq(clients.id, id));
    return true;
  }

  async getAllClientAssets(): Promise<ClientAsset[]> {
    await this.ensureInitialized();
    return db.select().from(clientAssets).orderBy(desc(clientAssets.createdAt));
  }

  async getClientAsset(id: string): Promise<ClientAsset | undefined> {
    await this.ensureInitialized();
    const [asset] = await db.select().from(clientAssets).where(eq(clientAssets.id, id));
    return asset || undefined;
  }

  async getAssetsByClient(clientId: string): Promise<ClientAsset[]> {
    await this.ensureInitialized();
    return db.select().from(clientAssets).where(eq(clientAssets.clientId, clientId));
  }

  async getExpiringAssets(daysAhead: number): Promise<ClientAsset[]> {
    await this.ensureInitialized();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);
    
    const allAssets = await db.select().from(clientAssets);
    return allAssets.filter(asset => {
      if (!asset.expiryDate) return false;
      const expiry = new Date(asset.expiryDate);
      return expiry <= futureDate && expiry >= new Date();
    });
  }

  async createClientAsset(insertAsset: InsertClientAsset): Promise<ClientAsset> {
    await this.ensureInitialized();
    const [asset] = await db.insert(clientAssets).values(insertAsset).returning();
    return asset;
  }

  async updateClientAsset(id: string, data: Partial<InsertClientAsset>): Promise<ClientAsset | undefined> {
    await this.ensureInitialized();
    const [asset] = await db.update(clientAssets).set({ ...data, updatedAt: new Date() }).where(eq(clientAssets.id, id)).returning();
    return asset || undefined;
  }

  async deleteClientAsset(id: string): Promise<boolean> {
    await this.ensureInitialized();
    await db.delete(clientAssets).where(eq(clientAssets.id, id));
    return true;
  }

  async getNotesByClient(clientId: string): Promise<ClientNote[]> {
    await this.ensureInitialized();
    return db.select().from(clientNotes).where(eq(clientNotes.clientId, clientId)).orderBy(desc(clientNotes.createdAt));
  }

  async createClientNote(insertNote: InsertClientNote): Promise<ClientNote> {
    await this.ensureInitialized();
    const [note] = await db.insert(clientNotes).values(insertNote).returning();
    return note;
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
    return sequence || undefined;
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

  async createNurturingSequence(insertSequence: InsertNurturingSequence): Promise<NurturingSequence> {
    await this.ensureInitialized();
    const [sequence] = await db.insert(nurturingSequences).values(insertSequence).returning();
    return sequence;
  }

  async updateNurturingSequence(id: string, data: Partial<InsertNurturingSequence>): Promise<NurturingSequence | undefined> {
    await this.ensureInitialized();
    const [sequence] = await db.update(nurturingSequences)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(nurturingSequences.id, id))
      .returning();
    return sequence || undefined;
  }

  async deleteNurturingSequence(id: string): Promise<boolean> {
    await this.ensureInitialized();
    await db.delete(nurturingSequences).where(eq(nurturingSequences.id, id));
    return true;
  }

  // Nurturing Steps
  async getStepsBySequence(sequenceId: string): Promise<NurturingStep[]> {
    await this.ensureInitialized();
    return db.select().from(nurturingSteps)
      .where(eq(nurturingSteps.sequenceId, sequenceId))
      .orderBy(nurturingSteps.stepOrder);
  }

  async getNurturingStep(id: string): Promise<NurturingStep | undefined> {
    await this.ensureInitialized();
    const [step] = await db.select().from(nurturingSteps).where(eq(nurturingSteps.id, id));
    return step || undefined;
  }

  async createNurturingStep(insertStep: InsertNurturingStep): Promise<NurturingStep> {
    await this.ensureInitialized();
    const [step] = await db.insert(nurturingSteps).values(insertStep).returning();
    return step;
  }

  async updateNurturingStep(id: string, data: Partial<InsertNurturingStep>): Promise<NurturingStep | undefined> {
    await this.ensureInitialized();
    const [step] = await db.update(nurturingSteps).set(data).where(eq(nurturingSteps.id, id)).returning();
    return step || undefined;
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
    return enrollment || undefined;
  }

  async createEnrollment(insertEnrollment: InsertLeadNurturingEnrollment): Promise<LeadNurturingEnrollment> {
    await this.ensureInitialized();
    const [enrollment] = await db.insert(leadNurturingEnrollments).values(insertEnrollment).returning();
    return enrollment;
  }

  async updateEnrollment(id: string, data: Partial<InsertLeadNurturingEnrollment>): Promise<LeadNurturingEnrollment | undefined> {
    await this.ensureInitialized();
    const [enrollment] = await db.update(leadNurturingEnrollments).set(data).where(eq(leadNurturingEnrollments.id, id)).returning();
    return enrollment || undefined;
  }

  // Scheduled Messages
  async getPendingScheduledMessages(): Promise<ScheduledMessage[]> {
    await this.ensureInitialized();
    return db.select().from(scheduledMessages)
      .where(and(
        eq(scheduledMessages.status, "pending"),
        sql`${scheduledMessages.scheduledFor} <= NOW()`
      ))
      .orderBy(scheduledMessages.scheduledFor);
  }

  async getScheduledMessagesByLead(leadId: string): Promise<ScheduledMessage[]> {
    await this.ensureInitialized();
    return db.select().from(scheduledMessages).where(eq(scheduledMessages.leadId, leadId));
  }

  async getScheduledMessage(id: string): Promise<ScheduledMessage | undefined> {
    await this.ensureInitialized();
    const [message] = await db.select().from(scheduledMessages).where(eq(scheduledMessages.id, id));
    return message || undefined;
  }

  async createScheduledMessage(insertMessage: InsertScheduledMessage): Promise<ScheduledMessage> {
    await this.ensureInitialized();
    const [message] = await db.insert(scheduledMessages).values(insertMessage).returning();
    return message;
  }

  async updateScheduledMessage(id: string, data: Partial<InsertScheduledMessage>): Promise<ScheduledMessage | undefined> {
    await this.ensureInitialized();
    const [message] = await db.update(scheduledMessages).set(data).where(eq(scheduledMessages.id, id)).returning();
    return message || undefined;
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

  async createMessageEngagement(insertEngagement: InsertMessageEngagement): Promise<MessageEngagement> {
    await this.ensureInitialized();
    const [engagement] = await db.insert(messageEngagements).values(insertEngagement).returning();
    return engagement;
  }

  // Lead Nurturing Tags
  async getTagsByLead(leadId: string): Promise<LeadNurturingTag[]> {
    await this.ensureInitialized();
    return db.select().from(leadNurturingTags).where(eq(leadNurturingTags.leadId, leadId));
  }

  async createLeadNurturingTag(insertTag: InsertLeadNurturingTag): Promise<LeadNurturingTag> {
    await this.ensureInitialized();
    const [tag] = await db.insert(leadNurturingTags).values(insertTag).returning();
    return tag;
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
    return site || undefined;
  }

  async getSampleSiteBySlug(slug: string): Promise<SampleSite | undefined> {
    await this.ensureInitialized();
    const [site] = await db.select().from(sampleSites).where(eq(sampleSites.slug, slug));
    return site || undefined;
  }

  async getSampleSitesByLead(leadId: string): Promise<SampleSite[]> {
    await this.ensureInitialized();
    return db.select().from(sampleSites).where(eq(sampleSites.leadId, leadId));
  }

  async createSampleSite(insertSite: InsertSampleSite): Promise<SampleSite> {
    await this.ensureInitialized();
    const [site] = await db.insert(sampleSites).values(insertSite).returning();
    return site;
  }

  async updateSampleSite(id: string, data: Partial<InsertSampleSite>): Promise<SampleSite | undefined> {
    await this.ensureInitialized();
    const [site] = await db.update(sampleSites).set({ ...data, updatedAt: new Date() }).where(eq(sampleSites.id, id)).returning();
    return site || undefined;
  }

  async deleteSampleSite(id: string): Promise<boolean> {
    await this.ensureInitialized();
    await db.delete(sampleSites).where(eq(sampleSites.id, id));
    return true;
  }

  async getSampleSitesPendingApproval(): Promise<SampleSite[]> {
    await this.ensureInitialized();
    return db.select().from(sampleSites).where(eq(sampleSites.approvalStatus, "pending"));
  }

  // Approval Queue
  async getApprovalQueue(): Promise<ApprovalQueue[]> {
    await this.ensureInitialized();
    return db.select().from(approvalQueue).orderBy(desc(approvalQueue.createdAt));
  }

  async getApprovalQueueItem(id: string): Promise<ApprovalQueue | undefined> {
    await this.ensureInitialized();
    const [item] = await db.select().from(approvalQueue).where(eq(approvalQueue.id, id));
    return item || undefined;
  }

  async createApprovalQueueItem(item: InsertApprovalQueue): Promise<ApprovalQueue> {
    await this.ensureInitialized();
    const [queueItem] = await db.insert(approvalQueue).values(item).returning();
    return queueItem;
  }

  async updateApprovalQueueItem(id: string, data: Partial<InsertApprovalQueue>): Promise<ApprovalQueue | undefined> {
    await this.ensureInitialized();
    const [item] = await db.update(approvalQueue).set(data).where(eq(approvalQueue.id, id)).returning();
    return item || undefined;
  }

  async deleteApprovalQueueItem(id: string): Promise<boolean> {
    await this.ensureInitialized();
    await db.delete(approvalQueue).where(eq(approvalQueue.id, id));
    return true;
  }

  // Approval Edit Requests
  async getEditRequestsByItem(itemType: string, itemId: string): Promise<ApprovalEditRequest[]> {
    await this.ensureInitialized();
    return db.select().from(approvalEditRequests)
      .where(and(eq(approvalEditRequests.itemType, itemType), eq(approvalEditRequests.itemId, itemId)))
      .orderBy(approvalEditRequests.createdAt);
  }

  async createEditRequest(request: InsertApprovalEditRequest): Promise<ApprovalEditRequest> {
    await this.ensureInitialized();
    const [editRequest] = await db.insert(approvalEditRequests).values(request).returning();
    return editRequest;
  }

  // Messages pending approval
  async getScheduledMessagesPendingApproval(): Promise<ScheduledMessage[]> {
    await this.ensureInitialized();
    return db.select().from(scheduledMessages).where(eq(scheduledMessages.status, "pending_approval"));
  }
}
