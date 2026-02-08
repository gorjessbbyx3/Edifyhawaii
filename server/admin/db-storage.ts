import { eq, and, desc, gte, lt } from "drizzle-orm";
import { db } from "../db";
import {
  users, organizations, roles, agents, agentTasks, businesses, leads,
  onlinePresenceChecks, contacts, calls, callTranscripts, callOutcomes,
  webFormSubmissions, meetings, activityLogs, auditLogs, externalContacts,
  externalConversations, events, callerAgentStates, clients, clientAssets,
  clientNotes, nurturingSequences, nurturingSteps, leadNurturingEnrollments,
  scheduledMessages, messageEngagements, leadNurturingTags, sampleSites,
  approvalQueue, approvalEditRequests, agentConfigs, agentDefinitions,
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
  AgentConfig, InsertAgentConfig,
} from "@shared/schema";
import { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [created] = await db.insert(users).values(user).returning();
    return created;
  }

  async getOrganization(id: string): Promise<Organization | undefined> {
    const [org] = await db.select().from(organizations).where(eq(organizations.id, id));
    return org;
  }

  async createOrganization(org: InsertOrganization): Promise<Organization> {
    const [created] = await db.insert(organizations).values(org).returning();
    return created;
  }

  async getRole(id: string): Promise<Role | undefined> {
    const [role] = await db.select().from(roles).where(eq(roles.id, id));
    return role;
  }

  async getAllRoles(): Promise<Role[]> {
    return db.select().from(roles);
  }

  async getAllAgents(): Promise<Agent[]> {
    return db.select().from(agents);
  }

  async getAgent(id: string): Promise<Agent | undefined> {
    const [agent] = await db.select().from(agents).where(eq(agents.id, id));
    return agent;
  }

  async getAgentByType(type: string): Promise<Agent | undefined> {
    const [agent] = await db.select().from(agents).where(eq(agents.type, type));
    return agent;
  }

  async createAgent(agent: InsertAgent): Promise<Agent> {
    const [created] = await db.insert(agents).values(agent).returning();
    return created;
  }

  async updateAgent(id: string, data: Partial<InsertAgent>): Promise<Agent | undefined> {
    const [updated] = await db.update(agents).set(data).where(eq(agents.id, id)).returning();
    return updated;
  }

  async deleteAgent(id: string): Promise<boolean> {
    const result = await db.delete(agents).where(eq(agents.id, id));
    return true;
  }

  async getAllAgentTasks(): Promise<AgentTask[]> {
    return db.select().from(agentTasks).orderBy(desc(agentTasks.startedAt));
  }

  async getAgentTasksByAgent(agentId: string): Promise<AgentTask[]> {
    return db.select().from(agentTasks).where(eq(agentTasks.agentId, agentId));
  }

  async createAgentTask(task: InsertAgentTask): Promise<AgentTask> {
    const [created] = await db.insert(agentTasks).values(task).returning();
    return created;
  }

  async updateAgentTask(id: string, data: Partial<InsertAgentTask>): Promise<AgentTask | undefined> {
    const [updated] = await db.update(agentTasks).set(data).where(eq(agentTasks.id, id)).returning();
    return updated;
  }

  async getAllBusinesses(): Promise<Business[]> {
    return db.select().from(businesses);
  }

  async getBusiness(id: string): Promise<Business | undefined> {
    const [business] = await db.select().from(businesses).where(eq(businesses.id, id));
    return business;
  }

  async createBusiness(business: InsertBusiness): Promise<Business> {
    const [created] = await db.insert(businesses).values(business).returning();
    return created;
  }

  async updateBusiness(id: string, data: Partial<InsertBusiness>): Promise<Business | undefined> {
    const [updated] = await db.update(businesses).set(data).where(eq(businesses.id, id)).returning();
    return updated;
  }

  async deleteBusiness(id: string): Promise<boolean> {
    await db.delete(businesses).where(eq(businesses.id, id));
    return true;
  }

  async getAllLeads(): Promise<Lead[]> {
    return db.select().from(leads).orderBy(desc(leads.createdAt));
  }

  async getLead(id: string): Promise<Lead | undefined> {
    const [lead] = await db.select().from(leads).where(eq(leads.id, id));
    return lead;
  }

  async getLeadsByBusiness(businessId: string): Promise<Lead[]> {
    return db.select().from(leads).where(eq(leads.businessId, businessId));
  }

  async createLead(lead: InsertLead): Promise<Lead> {
    const [created] = await db.insert(leads).values(lead).returning();
    return created;
  }

  async updateLead(id: string, data: Partial<InsertLead>): Promise<Lead | undefined> {
    const [updated] = await db.update(leads).set({ ...data, updatedAt: new Date() }).where(eq(leads.id, id)).returning();
    return updated;
  }

  async deleteLead(id: string): Promise<boolean> {
    await db.delete(leads).where(eq(leads.id, id));
    return true;
  }

  async getOnlinePresenceCheck(businessId: string): Promise<OnlinePresenceCheck | undefined> {
    const [check] = await db.select().from(onlinePresenceChecks).where(eq(onlinePresenceChecks.businessId, businessId));
    return check;
  }

  async getOnlinePresenceByBusiness(businessId: string): Promise<OnlinePresenceCheck | undefined> {
    return this.getOnlinePresenceCheck(businessId);
  }

  async createOnlinePresenceCheck(check: InsertOnlinePresenceCheck): Promise<OnlinePresenceCheck> {
    const [created] = await db.insert(onlinePresenceChecks).values(check).returning();
    return created;
  }

  async updateOnlinePresenceCheck(id: string, data: Partial<InsertOnlinePresenceCheck>): Promise<OnlinePresenceCheck | undefined> {
    const [updated] = await db.update(onlinePresenceChecks).set(data).where(eq(onlinePresenceChecks.id, id)).returning();
    return updated;
  }

  async getAllContacts(): Promise<Contact[]> {
    return db.select().from(contacts);
  }

  async getContact(id: string): Promise<Contact | undefined> {
    const [contact] = await db.select().from(contacts).where(eq(contacts.id, id));
    return contact;
  }

  async getContactsByBusiness(businessId: string): Promise<Contact[]> {
    return db.select().from(contacts).where(eq(contacts.businessId, businessId));
  }

  async createContact(contact: InsertContact): Promise<Contact> {
    const [created] = await db.insert(contacts).values(contact).returning();
    return created;
  }

  async updateContact(id: string, data: Partial<InsertContact>): Promise<Contact | undefined> {
    const [updated] = await db.update(contacts).set(data).where(eq(contacts.id, id)).returning();
    return updated;
  }

  async deleteContact(id: string): Promise<boolean> {
    await db.delete(contacts).where(eq(contacts.id, id));
    return true;
  }

  async getAllCalls(): Promise<Call[]> {
    return db.select().from(calls).orderBy(desc(calls.callStart));
  }

  async getCall(id: string): Promise<Call | undefined> {
    const [call] = await db.select().from(calls).where(eq(calls.id, id));
    return call;
  }

  async getCallsByLead(leadId: string): Promise<Call[]> {
    return db.select().from(calls).where(eq(calls.leadId, leadId));
  }

  async createCall(call: InsertCall): Promise<Call> {
    const [created] = await db.insert(calls).values(call).returning();
    return created;
  }

  async updateCall(id: string, data: Partial<InsertCall>): Promise<Call | undefined> {
    const [updated] = await db.update(calls).set(data).where(eq(calls.id, id)).returning();
    return updated;
  }

  async getCallTranscript(callId: string): Promise<CallTranscript | undefined> {
    const [transcript] = await db.select().from(callTranscripts).where(eq(callTranscripts.callId, callId));
    return transcript;
  }

  async getTranscriptByCall(callId: string): Promise<CallTranscript | undefined> {
    return this.getCallTranscript(callId);
  }

  async createCallTranscript(transcript: InsertCallTranscript): Promise<CallTranscript> {
    const [created] = await db.insert(callTranscripts).values(transcript).returning();
    return created;
  }

  async getCallOutcome(callId: string): Promise<CallOutcome | undefined> {
    const [outcome] = await db.select().from(callOutcomes).where(eq(callOutcomes.callId, callId));
    return outcome;
  }

  async getOutcomeByCall(callId: string): Promise<CallOutcome | undefined> {
    return this.getCallOutcome(callId);
  }

  async createCallOutcome(outcome: InsertCallOutcome): Promise<CallOutcome> {
    const [created] = await db.insert(callOutcomes).values(outcome).returning();
    return created;
  }

  async getAllWebFormSubmissions(): Promise<WebFormSubmission[]> {
    return db.select().from(webFormSubmissions).orderBy(desc(webFormSubmissions.submittedAt));
  }

  async getWebFormSubmission(id: string): Promise<WebFormSubmission | undefined> {
    const [submission] = await db.select().from(webFormSubmissions).where(eq(webFormSubmissions.id, id));
    return submission;
  }

  async getWebFormSubmissionsByLead(leadId: string): Promise<WebFormSubmission[]> {
    return db.select().from(webFormSubmissions).where(eq(webFormSubmissions.leadId, leadId));
  }

  async createWebFormSubmission(submission: InsertWebFormSubmission): Promise<WebFormSubmission> {
    const [created] = await db.insert(webFormSubmissions).values(submission).returning();
    return created;
  }

  async updateWebFormSubmission(id: string, data: Partial<InsertWebFormSubmission>): Promise<WebFormSubmission | undefined> {
    const [updated] = await db.update(webFormSubmissions).set(data).where(eq(webFormSubmissions.id, id)).returning();
    return updated;
  }

  async getAllMeetings(): Promise<Meeting[]> {
    return db.select().from(meetings).orderBy(desc(meetings.scheduledAt));
  }

  async getMeeting(id: string): Promise<Meeting | undefined> {
    const [meeting] = await db.select().from(meetings).where(eq(meetings.id, id));
    return meeting;
  }

  async getMeetingsByLead(leadId: string): Promise<Meeting[]> {
    return db.select().from(meetings).where(eq(meetings.leadId, leadId));
  }

  async createMeeting(meeting: InsertMeeting): Promise<Meeting> {
    const [created] = await db.insert(meetings).values(meeting).returning();
    return created;
  }

  async updateMeeting(id: string, data: Partial<InsertMeeting>): Promise<Meeting | undefined> {
    const [updated] = await db.update(meetings).set(data).where(eq(meetings.id, id)).returning();
    return updated;
  }

  async deleteMeeting(id: string): Promise<boolean> {
    await db.delete(meetings).where(eq(meetings.id, id));
    return true;
  }

  async getAllActivityLogs(): Promise<ActivityLog[]> {
    return db.select().from(activityLogs).orderBy(desc(activityLogs.createdAt));
  }

  async getActivityLogsByEntity(actorType: string, actorId: string): Promise<ActivityLog[]> {
    return db.select().from(activityLogs).where(
      and(eq(activityLogs.actorType, actorType), eq(activityLogs.actorId, actorId))
    );
  }

  async getActivityLogsByLead(leadId: string): Promise<ActivityLog[]> {
    return db.select().from(activityLogs).where(
      and(eq(activityLogs.actorType, "lead"), eq(activityLogs.actorId, leadId))
    );
  }

  async deleteActivityLog(id: string): Promise<boolean> {
    await db.delete(activityLogs).where(eq(activityLogs.id, id));
    return true;
  }

  async createActivityLog(log: InsertActivityLog): Promise<ActivityLog> {
    const [created] = await db.insert(activityLogs).values(log).returning();
    return created;
  }

  async getAllAuditLogs(): Promise<AuditLog[]> {
    return db.select().from(auditLogs).orderBy(desc(auditLogs.performedAt));
  }

  async createAuditLog(log: InsertAuditLog): Promise<AuditLog> {
    const [created] = await db.insert(auditLogs).values(log).returning();
    return created;
  }

  async getAllExternalContacts(): Promise<ExternalContact[]> {
    return db.select().from(externalContacts);
  }

  async getExternalContact(id: string): Promise<ExternalContact | undefined> {
    const [contact] = await db.select().from(externalContacts).where(eq(externalContacts.id, id));
    return contact;
  }

  async createExternalContact(contact: InsertExternalContact): Promise<ExternalContact> {
    const [created] = await db.insert(externalContacts).values(contact).returning();
    return created;
  }

  async updateExternalContact(id: string, data: Partial<InsertExternalContact>): Promise<ExternalContact | undefined> {
    const [updated] = await db.update(externalContacts).set(data).where(eq(externalContacts.id, id)).returning();
    return updated;
  }

  async upsertExternalContact(contact: InsertExternalContact): Promise<ExternalContact> {
    const existing = await db.select().from(externalContacts).where(eq(externalContacts.externalId, contact.externalId));
    if (existing.length > 0) {
      const [updated] = await db.update(externalContacts).set(contact).where(eq(externalContacts.externalId, contact.externalId)).returning();
      return updated;
    }
    const [created] = await db.insert(externalContacts).values(contact).returning();
    return created;
  }

  async deleteExternalContact(id: string): Promise<boolean> {
    await db.delete(externalContacts).where(eq(externalContacts.id, id));
    return true;
  }

  async getAllExternalConversations(): Promise<ExternalConversation[]> {
    return db.select().from(externalConversations).orderBy(desc(externalConversations.syncedAt));
  }

  async getExternalConversation(id: string): Promise<ExternalConversation | undefined> {
    const [convo] = await db.select().from(externalConversations).where(eq(externalConversations.id, id));
    return convo;
  }

  async createExternalConversation(convo: InsertExternalConversation): Promise<ExternalConversation> {
    const [created] = await db.insert(externalConversations).values(convo).returning();
    return created;
  }

  async updateExternalConversation(id: string, data: Partial<InsertExternalConversation>): Promise<ExternalConversation | undefined> {
    const [updated] = await db.update(externalConversations).set(data).where(eq(externalConversations.id, id)).returning();
    return updated;
  }

  async upsertExternalConversation(convo: InsertExternalConversation): Promise<ExternalConversation> {
    const existing = await db.select().from(externalConversations).where(eq(externalConversations.externalId, convo.externalId));
    if (existing.length > 0) {
      const [updated] = await db.update(externalConversations).set(convo).where(eq(externalConversations.externalId, convo.externalId)).returning();
      return updated;
    }
    const [created] = await db.insert(externalConversations).values(convo).returning();
    return created;
  }

  async deleteExternalConversation(id: string): Promise<boolean> {
    await db.delete(externalConversations).where(eq(externalConversations.id, id));
    return true;
  }

  async getAllEvents(): Promise<Event[]> {
    return db.select().from(events).orderBy(desc(events.timestamp));
  }

  async getEventsByType(eventType: string): Promise<Event[]> {
    return db.select().from(events).where(eq(events.eventType, eventType));
  }

  async getEventsByCorrelation(correlationId: string): Promise<Event[]> {
    return db.select().from(events).where(eq(events.correlationId, correlationId));
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const [created] = await db.insert(events).values(event).returning();
    return created;
  }

  async markEventProcessed(id: string): Promise<Event | undefined> {
    const [updated] = await db.update(events).set({ processed: true }).where(eq(events.id, id)).returning();
    return updated;
  }

  async getAnalyticsSummary(): Promise<{
    totalLeads: number;
    newLeadsToday: number;
    qualifiedLeads: number;
    closedLeads: number;
    conversionRate: number;
    callsMade: number;
  }> {
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

  async getCallerAgentState(callId: string): Promise<CallerAgentState | undefined> {
    const [state] = await db.select().from(callerAgentStates).where(eq(callerAgentStates.callId, callId));
    return state;
  }

  async createCallerAgentState(state: InsertCallerAgentState): Promise<CallerAgentState> {
    const [created] = await db.insert(callerAgentStates).values(state).returning();
    return created;
  }

  async updateCallerAgentState(id: string, data: Partial<InsertCallerAgentState>): Promise<CallerAgentState | undefined> {
    const [updated] = await db.update(callerAgentStates).set({ ...data, updatedAt: new Date() }).where(eq(callerAgentStates.id, id)).returning();
    return updated;
  }

  async getAllClients(): Promise<Client[]> {
    return db.select().from(clients).orderBy(desc(clients.createdAt));
  }

  async getClient(id: string): Promise<Client | undefined> {
    const [client] = await db.select().from(clients).where(eq(clients.id, id));
    return client;
  }

  async getClientByBusiness(businessId: string): Promise<Client | undefined> {
    const [client] = await db.select().from(clients).where(eq(clients.businessId, businessId));
    return client;
  }

  async getClientByLead(leadId: string): Promise<Client | undefined> {
    const [client] = await db.select().from(clients).where(eq(clients.leadId, leadId));
    return client;
  }

  async createClient(client: InsertClient): Promise<Client> {
    const [created] = await db.insert(clients).values(client).returning();
    return created;
  }

  async updateClient(id: string, data: Partial<InsertClient>): Promise<Client | undefined> {
    const [updated] = await db.update(clients).set({ ...data, updatedAt: new Date() }).where(eq(clients.id, id)).returning();
    return updated;
  }

  async deleteClient(id: string): Promise<boolean> {
    await db.delete(clients).where(eq(clients.id, id));
    return true;
  }

  async getAllClientAssets(): Promise<ClientAsset[]> {
    return db.select().from(clientAssets);
  }

  async getAssetsByClient(clientId: string): Promise<ClientAsset[]> {
    return db.select().from(clientAssets).where(eq(clientAssets.clientId, clientId));
  }

  async getClientAsset(id: string): Promise<ClientAsset | undefined> {
    const [asset] = await db.select().from(clientAssets).where(eq(clientAssets.id, id));
    return asset;
  }

  async getExpiringAssets(daysAhead: number): Promise<ClientAsset[]> {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);
    const allAssets = await db.select().from(clientAssets);
    return allAssets.filter(asset => 
      asset.expiryDate && new Date(asset.expiryDate) <= futureDate && asset.status !== "expired"
    );
  }

  async createClientAsset(asset: InsertClientAsset): Promise<ClientAsset> {
    const [created] = await db.insert(clientAssets).values(asset).returning();
    return created;
  }

  async updateClientAsset(id: string, data: Partial<InsertClientAsset>): Promise<ClientAsset | undefined> {
    const [updated] = await db.update(clientAssets).set({ ...data, updatedAt: new Date() }).where(eq(clientAssets.id, id)).returning();
    return updated;
  }

  async deleteClientAsset(id: string): Promise<boolean> {
    await db.delete(clientAssets).where(eq(clientAssets.id, id));
    return true;
  }

  async getNotesByClient(clientId: string): Promise<ClientNote[]> {
    return db.select().from(clientNotes).where(eq(clientNotes.clientId, clientId)).orderBy(desc(clientNotes.createdAt));
  }

  async createClientNote(note: InsertClientNote): Promise<ClientNote> {
    const [created] = await db.insert(clientNotes).values(note).returning();
    return created;
  }

  async deleteClientNote(id: string): Promise<boolean> {
    await db.delete(clientNotes).where(eq(clientNotes.id, id));
    return true;
  }

  async getAllNurturingSequences(): Promise<NurturingSequence[]> {
    return db.select().from(nurturingSequences);
  }

  async getNurturingSequence(id: string): Promise<NurturingSequence | undefined> {
    const [sequence] = await db.select().from(nurturingSequences).where(eq(nurturingSequences.id, id));
    return sequence;
  }

  async getActiveNurturingSequences(): Promise<NurturingSequence[]> {
    return db.select().from(nurturingSequences).where(eq(nurturingSequences.status, "active"));
  }

  async getNurturingSequenceByTrigger(triggerEvent: string): Promise<NurturingSequence[]> {
    return db.select().from(nurturingSequences).where(eq(nurturingSequences.triggerEvent, triggerEvent));
  }

  async createNurturingSequence(sequence: InsertNurturingSequence): Promise<NurturingSequence> {
    const [created] = await db.insert(nurturingSequences).values(sequence).returning();
    return created;
  }

  async updateNurturingSequence(id: string, data: Partial<InsertNurturingSequence>): Promise<NurturingSequence | undefined> {
    const [updated] = await db.update(nurturingSequences).set({ ...data, updatedAt: new Date() }).where(eq(nurturingSequences.id, id)).returning();
    return updated;
  }

  async deleteNurturingSequence(id: string): Promise<boolean> {
    await db.delete(nurturingSequences).where(eq(nurturingSequences.id, id));
    return true;
  }

  async getStepsBySequence(sequenceId: string): Promise<NurturingStep[]> {
    return db.select().from(nurturingSteps).where(eq(nurturingSteps.sequenceId, sequenceId));
  }

  async getNurturingStep(id: string): Promise<NurturingStep | undefined> {
    const [step] = await db.select().from(nurturingSteps).where(eq(nurturingSteps.id, id));
    return step;
  }

  async createNurturingStep(step: InsertNurturingStep): Promise<NurturingStep> {
    const [created] = await db.insert(nurturingSteps).values(step).returning();
    return created;
  }

  async updateNurturingStep(id: string, data: Partial<InsertNurturingStep>): Promise<NurturingStep | undefined> {
    const [updated] = await db.update(nurturingSteps).set(data).where(eq(nurturingSteps.id, id)).returning();
    return updated;
  }

  async deleteNurturingStep(id: string): Promise<boolean> {
    await db.delete(nurturingSteps).where(eq(nurturingSteps.id, id));
    return true;
  }

  async getEnrollmentsByLead(leadId: string): Promise<LeadNurturingEnrollment[]> {
    return db.select().from(leadNurturingEnrollments).where(eq(leadNurturingEnrollments.leadId, leadId));
  }

  async getEnrollmentsBySequence(sequenceId: string): Promise<LeadNurturingEnrollment[]> {
    return db.select().from(leadNurturingEnrollments).where(eq(leadNurturingEnrollments.sequenceId, sequenceId));
  }

  async getActiveEnrollments(): Promise<LeadNurturingEnrollment[]> {
    return db.select().from(leadNurturingEnrollments).where(eq(leadNurturingEnrollments.status, "active"));
  }

  async getEnrollment(id: string): Promise<LeadNurturingEnrollment | undefined> {
    const [enrollment] = await db.select().from(leadNurturingEnrollments).where(eq(leadNurturingEnrollments.id, id));
    return enrollment;
  }

  async createEnrollment(enrollment: InsertLeadNurturingEnrollment): Promise<LeadNurturingEnrollment> {
    const [created] = await db.insert(leadNurturingEnrollments).values(enrollment).returning();
    return created;
  }

  async updateEnrollment(id: string, data: Partial<InsertLeadNurturingEnrollment>): Promise<LeadNurturingEnrollment | undefined> {
    const [updated] = await db.update(leadNurturingEnrollments).set(data).where(eq(leadNurturingEnrollments.id, id)).returning();
    return updated;
  }

  async getPendingScheduledMessages(): Promise<ScheduledMessage[]> {
    return db.select().from(scheduledMessages).where(eq(scheduledMessages.status, "pending"));
  }

  async getScheduledMessagesByLead(leadId: string): Promise<ScheduledMessage[]> {
    return db.select().from(scheduledMessages).where(eq(scheduledMessages.leadId, leadId));
  }

  async getScheduledMessage(id: string): Promise<ScheduledMessage | undefined> {
    const [message] = await db.select().from(scheduledMessages).where(eq(scheduledMessages.id, id));
    return message;
  }

  async createScheduledMessage(message: InsertScheduledMessage): Promise<ScheduledMessage> {
    const [created] = await db.insert(scheduledMessages).values(message).returning();
    return created;
  }

  async updateScheduledMessage(id: string, data: Partial<InsertScheduledMessage>): Promise<ScheduledMessage | undefined> {
    const [updated] = await db.update(scheduledMessages).set(data).where(eq(scheduledMessages.id, id)).returning();
    return updated;
  }

  async getEngagementsByMessage(messageId: string): Promise<MessageEngagement[]> {
    return db.select().from(messageEngagements).where(eq(messageEngagements.messageId, messageId));
  }

  async getEngagementsByLead(leadId: string): Promise<MessageEngagement[]> {
    return db.select().from(messageEngagements).where(eq(messageEngagements.leadId, leadId));
  }

  async createMessageEngagement(engagement: InsertMessageEngagement): Promise<MessageEngagement> {
    const [created] = await db.insert(messageEngagements).values(engagement).returning();
    return created;
  }

  async getTagsByLead(leadId: string): Promise<LeadNurturingTag[]> {
    return db.select().from(leadNurturingTags).where(eq(leadNurturingTags.leadId, leadId));
  }

  async createLeadNurturingTag(tag: InsertLeadNurturingTag): Promise<LeadNurturingTag> {
    const [created] = await db.insert(leadNurturingTags).values(tag).returning();
    return created;
  }

  async deleteLeadNurturingTag(id: string): Promise<boolean> {
    await db.delete(leadNurturingTags).where(eq(leadNurturingTags.id, id));
    return true;
  }

  async getSampleSite(id: string): Promise<SampleSite | undefined> {
    const [site] = await db.select().from(sampleSites).where(eq(sampleSites.id, id));
    return site;
  }

  async getSampleSiteBySlug(slug: string): Promise<SampleSite | undefined> {
    const [site] = await db.select().from(sampleSites).where(eq(sampleSites.slug, slug));
    return site;
  }

  async getSampleSitesByLead(leadId: string): Promise<SampleSite[]> {
    return db.select().from(sampleSites).where(eq(sampleSites.leadId, leadId));
  }

  async getSampleSitesPendingApproval(): Promise<SampleSite[]> {
    return db.select().from(sampleSites).where(eq(sampleSites.approvalStatus, "pending"));
  }

  async createSampleSite(site: InsertSampleSite): Promise<SampleSite> {
    const [created] = await db.insert(sampleSites).values(site).returning();
    return created;
  }

  async updateSampleSite(id: string, data: Partial<InsertSampleSite>): Promise<SampleSite | undefined> {
    const [updated] = await db.update(sampleSites).set(data).where(eq(sampleSites.id, id)).returning();
    return updated;
  }

  async deleteSampleSite(id: string): Promise<boolean> {
    await db.delete(sampleSites).where(eq(sampleSites.id, id));
    return true;
  }

  async getApprovalQueue(): Promise<ApprovalQueue[]> {
    return db.select().from(approvalQueue).orderBy(desc(approvalQueue.createdAt));
  }

  async getApprovalQueueItem(id: string): Promise<ApprovalQueue | undefined> {
    const [item] = await db.select().from(approvalQueue).where(eq(approvalQueue.id, id));
    return item;
  }

  async createApprovalQueueItem(item: InsertApprovalQueue): Promise<ApprovalQueue> {
    const [created] = await db.insert(approvalQueue).values(item).returning();
    return created;
  }

  async updateApprovalQueueItem(id: string, data: Partial<InsertApprovalQueue>): Promise<ApprovalQueue | undefined> {
    const [updated] = await db.update(approvalQueue).set(data).where(eq(approvalQueue.id, id)).returning();
    return updated;
  }

  async deleteApprovalQueueItem(id: string): Promise<boolean> {
    await db.delete(approvalQueue).where(eq(approvalQueue.id, id));
    return true;
  }

  async getEditRequestsByItem(itemType: string, itemId: string): Promise<ApprovalEditRequest[]> {
    return db.select().from(approvalEditRequests).where(
      and(eq(approvalEditRequests.itemType, itemType), eq(approvalEditRequests.itemId, itemId))
    );
  }

  async createEditRequest(request: InsertApprovalEditRequest): Promise<ApprovalEditRequest> {
    const [created] = await db.insert(approvalEditRequests).values(request).returning();
    return created;
  }

  async getScheduledMessagesPendingApproval(): Promise<ScheduledMessage[]> {
    return db.select().from(scheduledMessages).where(eq(scheduledMessages.approvalStatus, "pending"));
  }

  // Agent Configs
  async getAgentConfig(agentId: string): Promise<AgentConfig | undefined> {
    const [config] = await db.select().from(agentConfigs).where(eq(agentConfigs.agentId, agentId));
    return config;
  }

  async getAllAgentConfigs(): Promise<AgentConfig[]> {
    return db.select().from(agentConfigs);
  }

  async upsertAgentConfig(config: InsertAgentConfig): Promise<AgentConfig> {
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

  async getWeeklyAnalytics(): Promise<{ day: string; leads: number; calls: number; conversions: number }[]> {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const allLeads = await db.select().from(leads).where(gte(leads.createdAt, weekAgo));
    const allCalls = await db.select().from(calls).where(gte(calls.callStart, weekAgo));
    
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const result: { day: string; leads: number; calls: number; conversions: number }[] = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      
      const dayLeads = allLeads.filter((l) => {
        const createdAt = l.createdAt ? new Date(l.createdAt) : null;
        return createdAt && createdAt >= date && createdAt < nextDate;
      }).length;
      
      const dayCalls = allCalls.filter((c) => {
        const callStart = c.callStart ? new Date(c.callStart) : null;
        return callStart && callStart >= date && callStart < nextDate;
      }).length;
      
      const dayConversions = allLeads.filter((l) => {
        const createdAt = l.createdAt ? new Date(l.createdAt) : null;
        return createdAt && createdAt >= date && createdAt < nextDate && l.status === "closed";
      }).length;
      
      result.push({
        day: days[date.getDay()],
        leads: dayLeads,
        calls: dayCalls,
        conversions: dayConversions,
      });
    }
    
    return result;
  }
}

export async function seedDatabase() {
  const existingAgents = await db.select().from(agents);
  if (existingAgents.length === 0) {
    console.log("Seeding agents...");
    for (const def of agentDefinitions) {
      await db.insert(agents).values({
        type: def.type,
        name: def.name,
        status: "paused",
        version: "1.0.0",
      });
    }
    console.log("Agents seeded successfully");
  }
  
  const existingRoles = await db.select().from(roles);
  if (existingRoles.length === 0) {
    console.log("Seeding roles...");
    await db.insert(roles).values([
      { id: "role-admin", name: "admin", permissions: { all: true } },
      { id: "role-sales", name: "sales", permissions: { leads: true, calls: true } },
      { id: "role-viewer", name: "viewer", permissions: { read: true } },
    ]);
    console.log("Roles seeded successfully");
  }
}
