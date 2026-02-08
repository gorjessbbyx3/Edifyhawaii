import { randomUUID } from "crypto";
import {
  User, InsertUser,
  Organization, InsertOrganization,
  Role, InsertRole,
  Agent, InsertAgent,
  AgentTask, InsertAgentTask,
  Business, InsertBusiness,
  Lead, InsertLead,
  OnlinePresenceCheck, InsertOnlinePresenceCheck,
  Contact, InsertContact,
  Call, InsertCall,
  CallTranscript, InsertCallTranscript,
  CallOutcome, InsertCallOutcome,
  WebFormSubmission, InsertWebFormSubmission,
  Meeting, InsertMeeting,
  ActivityLog, InsertActivityLog,
  AuditLog, InsertAuditLog,
  ExternalContact, InsertExternalContact,
  ExternalConversation, InsertExternalConversation,
  Event, InsertEvent,
  CallerAgentState, InsertCallerAgentState,
  Client, InsertClient,
  ClientAsset, InsertClientAsset,
  ClientNote, InsertClientNote,
  NurturingSequence, InsertNurturingSequence,
  NurturingStep, InsertNurturingStep,
  LeadNurturingEnrollment, InsertLeadNurturingEnrollment,
  ScheduledMessage, InsertScheduledMessage,
  MessageEngagement, InsertMessageEngagement,
  LeadNurturingTag, InsertLeadNurturingTag,
  SampleSite, InsertSampleSite,
  ApprovalEditRequest, InsertApprovalEditRequest,
  ApprovalQueue, InsertApprovalQueue,
  AgentConfig, InsertAgentConfig,
  agentDefinitions,
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Organizations
  getOrganization(id: string): Promise<Organization | undefined>;
  createOrganization(org: InsertOrganization): Promise<Organization>;

  // Roles
  getRole(id: string): Promise<Role | undefined>;
  getAllRoles(): Promise<Role[]>;

  // Agents
  getAllAgents(): Promise<Agent[]>;
  getAgent(id: string): Promise<Agent | undefined>;
  getAgentByType(type: string): Promise<Agent | undefined>;
  createAgent(agent: InsertAgent): Promise<Agent>;
  updateAgent(id: string, data: Partial<InsertAgent>): Promise<Agent | undefined>;
  deleteAgent(id: string): Promise<boolean>;

  // Agent Tasks
  getAllAgentTasks(): Promise<AgentTask[]>;
  getAgentTasksByAgent(agentId: string): Promise<AgentTask[]>;
  createAgentTask(task: InsertAgentTask): Promise<AgentTask>;
  updateAgentTask(id: string, data: Partial<InsertAgentTask>): Promise<AgentTask | undefined>;

  // Businesses
  getAllBusinesses(): Promise<Business[]>;
  getBusiness(id: string): Promise<Business | undefined>;
  createBusiness(business: InsertBusiness): Promise<Business>;
  updateBusiness(id: string, data: Partial<InsertBusiness>): Promise<Business | undefined>;
  deleteBusiness(id: string): Promise<boolean>;

  // Leads
  getAllLeads(): Promise<Lead[]>;
  getLead(id: string): Promise<Lead | undefined>;
  getLeadsByBusiness(businessId: string): Promise<Lead[]>;
  createLead(lead: InsertLead): Promise<Lead>;
  updateLead(id: string, data: Partial<InsertLead>): Promise<Lead | undefined>;
  deleteLead(id: string): Promise<boolean>;

  // Online Presence Checks
  getOnlinePresenceByBusiness(businessId: string): Promise<OnlinePresenceCheck | undefined>;
  createOnlinePresenceCheck(check: InsertOnlinePresenceCheck): Promise<OnlinePresenceCheck>;

  // Contacts
  getAllContacts(): Promise<Contact[]>;
  getContact(id: string): Promise<Contact | undefined>;
  getContactsByBusiness(businessId: string): Promise<Contact[]>;
  createContact(contact: InsertContact): Promise<Contact>;
  updateContact(id: string, data: Partial<InsertContact>): Promise<Contact | undefined>;
  deleteContact(id: string): Promise<boolean>;

  // Calls
  getAllCalls(): Promise<Call[]>;
  getCallsByLead(leadId: string): Promise<Call[]>;
  createCall(call: InsertCall): Promise<Call>;

  // Call Transcripts
  getTranscriptByCall(callId: string): Promise<CallTranscript | undefined>;
  createCallTranscript(transcript: InsertCallTranscript): Promise<CallTranscript>;

  // Call Outcomes
  getOutcomeByCall(callId: string): Promise<CallOutcome | undefined>;
  createCallOutcome(outcome: InsertCallOutcome): Promise<CallOutcome>;

  // Web Form Submissions
  getAllWebFormSubmissions(): Promise<WebFormSubmission[]>;
  getWebFormSubmissionsByLead(leadId: string): Promise<WebFormSubmission[]>;
  createWebFormSubmission(submission: InsertWebFormSubmission): Promise<WebFormSubmission>;

  // Meetings
  getAllMeetings(): Promise<Meeting[]>;
  getMeetingsByLead(leadId: string): Promise<Meeting[]>;
  createMeeting(meeting: InsertMeeting): Promise<Meeting>;
  updateMeeting(id: string, data: Partial<InsertMeeting>): Promise<Meeting | undefined>;

  // Activity Logs
  getAllActivityLogs(): Promise<ActivityLog[]>;
  getActivityLogsByLead(leadId: string): Promise<ActivityLog[]>;
  createActivityLog(log: InsertActivityLog): Promise<ActivityLog>;
  deleteActivityLog(id: string): Promise<boolean>;

  // Audit Logs
  getAllAuditLogs(): Promise<AuditLog[]>;
  createAuditLog(log: InsertAuditLog): Promise<AuditLog>;

  // External Contacts
  getAllExternalContacts(): Promise<ExternalContact[]>;
  getExternalContact(id: string): Promise<ExternalContact | undefined>;
  upsertExternalContact(contact: InsertExternalContact): Promise<ExternalContact>;
  deleteExternalContact(id: string): Promise<boolean>;

  // External Conversations
  getAllExternalConversations(): Promise<ExternalConversation[]>;
  getExternalConversation(id: string): Promise<ExternalConversation | undefined>;
  upsertExternalConversation(conversation: InsertExternalConversation): Promise<ExternalConversation>;
  deleteExternalConversation(id: string): Promise<boolean>;

  // Analytics
  getAnalyticsSummary(): Promise<{
    totalLeads: number;
    newLeadsToday: number;
    qualifiedLeads: number;
    closedLeads: number;
    conversionRate: number;
    callsMade: number;
  }>;

  getWeeklyAnalytics(): Promise<Array<{
    day: string;
    leads: number;
    calls: number;
    conversions: number;
  }>>;

  // Events
  getAllEvents(): Promise<Event[]>;
  getEventsByType(eventType: string): Promise<Event[]>;
  getEventsByCorrelation(correlationId: string): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;
  markEventProcessed(id: string): Promise<Event | undefined>;

  // Caller Agent States
  getCallerAgentState(callId: string): Promise<CallerAgentState | undefined>;
  createCallerAgentState(state: InsertCallerAgentState): Promise<CallerAgentState>;
  updateCallerAgentState(callId: string, data: Partial<InsertCallerAgentState>): Promise<CallerAgentState | undefined>;

  // Clients
  getAllClients(): Promise<Client[]>;
  getClient(id: string): Promise<Client | undefined>;
  getClientByBusiness(businessId: string): Promise<Client | undefined>;
  getClientByLead(leadId: string): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: string, data: Partial<InsertClient>): Promise<Client | undefined>;
  deleteClient(id: string): Promise<boolean>;

  // Client Assets
  getAllClientAssets(): Promise<ClientAsset[]>;
  getClientAsset(id: string): Promise<ClientAsset | undefined>;
  getAssetsByClient(clientId: string): Promise<ClientAsset[]>;
  getExpiringAssets(daysAhead: number): Promise<ClientAsset[]>;
  createClientAsset(asset: InsertClientAsset): Promise<ClientAsset>;
  updateClientAsset(id: string, data: Partial<InsertClientAsset>): Promise<ClientAsset | undefined>;
  deleteClientAsset(id: string): Promise<boolean>;

  // Client Notes
  getNotesByClient(clientId: string): Promise<ClientNote[]>;
  createClientNote(note: InsertClientNote): Promise<ClientNote>;
  deleteClientNote(id: string): Promise<boolean>;

  // Nurturing Sequences
  getAllNurturingSequences(): Promise<NurturingSequence[]>;
  getNurturingSequence(id: string): Promise<NurturingSequence | undefined>;
  getActiveNurturingSequences(): Promise<NurturingSequence[]>;
  getNurturingSequenceByTrigger(triggerEvent: string): Promise<NurturingSequence[]>;
  createNurturingSequence(sequence: InsertNurturingSequence): Promise<NurturingSequence>;
  updateNurturingSequence(id: string, data: Partial<InsertNurturingSequence>): Promise<NurturingSequence | undefined>;
  deleteNurturingSequence(id: string): Promise<boolean>;

  // Nurturing Steps
  getStepsBySequence(sequenceId: string): Promise<NurturingStep[]>;
  getNurturingStep(id: string): Promise<NurturingStep | undefined>;
  createNurturingStep(step: InsertNurturingStep): Promise<NurturingStep>;
  updateNurturingStep(id: string, data: Partial<InsertNurturingStep>): Promise<NurturingStep | undefined>;
  deleteNurturingStep(id: string): Promise<boolean>;

  // Lead Nurturing Enrollments
  getEnrollmentsByLead(leadId: string): Promise<LeadNurturingEnrollment[]>;
  getEnrollmentsBySequence(sequenceId: string): Promise<LeadNurturingEnrollment[]>;
  getActiveEnrollments(): Promise<LeadNurturingEnrollment[]>;
  getEnrollment(id: string): Promise<LeadNurturingEnrollment | undefined>;
  createEnrollment(enrollment: InsertLeadNurturingEnrollment): Promise<LeadNurturingEnrollment>;
  updateEnrollment(id: string, data: Partial<InsertLeadNurturingEnrollment>): Promise<LeadNurturingEnrollment | undefined>;

  // Scheduled Messages
  getPendingScheduledMessages(): Promise<ScheduledMessage[]>;
  getScheduledMessagesByLead(leadId: string): Promise<ScheduledMessage[]>;
  getScheduledMessage(id: string): Promise<ScheduledMessage | undefined>;
  createScheduledMessage(message: InsertScheduledMessage): Promise<ScheduledMessage>;
  updateScheduledMessage(id: string, data: Partial<InsertScheduledMessage>): Promise<ScheduledMessage | undefined>;

  // Message Engagements
  getEngagementsByMessage(messageId: string): Promise<MessageEngagement[]>;
  getEngagementsByLead(leadId: string): Promise<MessageEngagement[]>;
  createMessageEngagement(engagement: InsertMessageEngagement): Promise<MessageEngagement>;

  // Lead Nurturing Tags
  getTagsByLead(leadId: string): Promise<LeadNurturingTag[]>;
  createLeadNurturingTag(tag: InsertLeadNurturingTag): Promise<LeadNurturingTag>;
  deleteLeadNurturingTag(id: string): Promise<boolean>;

  // Sample Sites
  getSampleSite(id: string): Promise<SampleSite | undefined>;
  getSampleSiteBySlug(slug: string): Promise<SampleSite | undefined>;
  getSampleSitesByLead(leadId: string): Promise<SampleSite[]>;
  getSampleSitesPendingApproval(): Promise<SampleSite[]>;
  createSampleSite(site: InsertSampleSite): Promise<SampleSite>;
  updateSampleSite(id: string, data: Partial<InsertSampleSite>): Promise<SampleSite | undefined>;
  deleteSampleSite(id: string): Promise<boolean>;

  // Approval Queue
  getApprovalQueue(): Promise<ApprovalQueue[]>;
  getApprovalQueueItem(id: string): Promise<ApprovalQueue | undefined>;
  createApprovalQueueItem(item: InsertApprovalQueue): Promise<ApprovalQueue>;
  updateApprovalQueueItem(id: string, data: Partial<InsertApprovalQueue>): Promise<ApprovalQueue | undefined>;
  deleteApprovalQueueItem(id: string): Promise<boolean>;

  // Approval Edit Requests (Chat)
  getEditRequestsByItem(itemType: string, itemId: string): Promise<ApprovalEditRequest[]>;
  createEditRequest(request: InsertApprovalEditRequest): Promise<ApprovalEditRequest>;

  // Messages pending approval
  getScheduledMessagesPendingApproval(): Promise<ScheduledMessage[]>;

  // Agent Configs
  getAgentConfig(agentId: string): Promise<AgentConfig | undefined>;
  getAllAgentConfigs(): Promise<AgentConfig[]>;
  upsertAgentConfig(config: InsertAgentConfig): Promise<AgentConfig>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private organizations: Map<string, Organization> = new Map();
  private roles: Map<string, Role> = new Map();
  private agents: Map<string, Agent> = new Map();
  private agentTasks: Map<string, AgentTask> = new Map();
  private businesses: Map<string, Business> = new Map();
  private leads: Map<string, Lead> = new Map();
  private onlinePresenceChecks: Map<string, OnlinePresenceCheck> = new Map();
  private contacts: Map<string, Contact> = new Map();
  private calls: Map<string, Call> = new Map();
  private callTranscripts: Map<string, CallTranscript> = new Map();
  private callOutcomes: Map<string, CallOutcome> = new Map();
  private webFormSubmissions: Map<string, WebFormSubmission> = new Map();
  private meetings: Map<string, Meeting> = new Map();
  private activityLogs: Map<string, ActivityLog> = new Map();
  private auditLogs: Map<string, AuditLog> = new Map();
  private externalContacts: Map<string, ExternalContact> = new Map();
  private externalConversations: Map<string, ExternalConversation> = new Map();
  private events: Map<string, Event> = new Map();
  private callerAgentStates: Map<string, CallerAgentState> = new Map();
  private clients: Map<string, Client> = new Map();
  private clientAssets: Map<string, ClientAsset> = new Map();
  private clientNotes: Map<string, ClientNote> = new Map();
  private nurturingSequences: Map<string, NurturingSequence> = new Map();
  private nurturingSteps: Map<string, NurturingStep> = new Map();
  private leadNurturingEnrollments: Map<string, LeadNurturingEnrollment> = new Map();
  private scheduledMessages: Map<string, ScheduledMessage> = new Map();
  private messageEngagements: Map<string, MessageEngagement> = new Map();
  private leadNurturingTags: Map<string, LeadNurturingTag> = new Map();
  private sampleSites: Map<string, SampleSite> = new Map();
  private approvalQueue: Map<string, ApprovalQueue> = new Map();
  private approvalEditRequests: Map<string, ApprovalEditRequest> = new Map();
  private agentConfigs: Map<string, AgentConfig> = new Map();

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed default roles (required for system operation)
    const adminRole: Role = { id: "role-admin", name: "admin", permissions: { all: true } };
    const salesRole: Role = { id: "role-sales", name: "sales", permissions: { leads: true, calls: true } };
    const viewerRole: Role = { id: "role-viewer", name: "viewer", permissions: { read: true } };
    this.roles.set(adminRole.id, adminRole);
    this.roles.set(salesRole.id, salesRole);
    this.roles.set(viewerRole.id, viewerRole);

    // Seed default organization (required for system operation)
    const org: Organization = {
      id: "org-default",
      name: "My Organization",
      industry: null,
      timezone: "Pacific/Honolulu",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.organizations.set(org.id, org);

    // Seed agents from definitions - all start as paused until user activates
    for (const def of agentDefinitions) {
      const agent: Agent = {
        id: def.id,
        type: def.type,
        name: def.name,
        status: "paused",
        version: "1.0.0",
        createdAt: new Date(),
      };
      this.agents.set(agent.id, agent);
    }

    // No sample data - system starts clean
    // Real data will be populated by:
    // 1. Crawler Agent discovering businesses
    // 2. External API sync (Edify Limited)
    // 3. Manual user input
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      id,
      organizationId: insertUser.organizationId ?? null,
      email: insertUser.email,
      hashedPassword: insertUser.hashedPassword,
      fullName: insertUser.fullName,
      roleId: insertUser.roleId ?? null,
      isActive: insertUser.isActive ?? true,
      createdAt: new Date(), 
      updatedAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  // Organizations
  async getOrganization(id: string): Promise<Organization | undefined> {
    return this.organizations.get(id);
  }

  async createOrganization(insertOrg: InsertOrganization): Promise<Organization> {
    const id = randomUUID();
    const org: Organization = { 
      id, 
      name: insertOrg.name,
      industry: insertOrg.industry ?? null,
      timezone: insertOrg.timezone ?? "Pacific/Honolulu",
      createdAt: new Date(), 
      updatedAt: new Date() 
    };
    this.organizations.set(id, org);
    return org;
  }

  // Roles
  async getRole(id: string): Promise<Role | undefined> {
    return this.roles.get(id);
  }

  async getAllRoles(): Promise<Role[]> {
    return Array.from(this.roles.values());
  }

  // Agents
  async getAllAgents(): Promise<Agent[]> {
    return Array.from(this.agents.values());
  }

  async getAgent(id: string): Promise<Agent | undefined> {
    return this.agents.get(id);
  }

  async getAgentByType(type: string): Promise<Agent | undefined> {
    return Array.from(this.agents.values()).find(a => a.type === type);
  }

  async createAgent(insertAgent: InsertAgent): Promise<Agent> {
    const id = randomUUID();
    const agent: Agent = { 
      id, 
      type: insertAgent.type,
      name: insertAgent.name,
      status: insertAgent.status ?? "paused",
      version: insertAgent.version ?? null,
      createdAt: new Date() 
    };
    this.agents.set(id, agent);
    return agent;
  }

  async updateAgent(id: string, data: Partial<InsertAgent>): Promise<Agent | undefined> {
    const existing = this.agents.get(id);
    if (!existing) return undefined;
    const updated: Agent = { ...existing, ...data };
    this.agents.set(id, updated);
    return updated;
  }

  async deleteAgent(id: string): Promise<boolean> {
    return this.agents.delete(id);
  }

  // Agent Tasks
  async getAllAgentTasks(): Promise<AgentTask[]> {
    return Array.from(this.agentTasks.values());
  }

  async getAgentTasksByAgent(agentId: string): Promise<AgentTask[]> {
    return Array.from(this.agentTasks.values()).filter((t) => t.agentId === agentId);
  }

  async createAgentTask(insertTask: InsertAgentTask): Promise<AgentTask> {
    const id = randomUUID();
    const task: AgentTask = { 
      id,
      agentId: insertTask.agentId,
      taskType: insertTask.taskType,
      payload: insertTask.payload ?? null,
      status: insertTask.status ?? "pending",
      startedAt: insertTask.startedAt ?? null,
      completedAt: insertTask.completedAt ?? null,
    };
    this.agentTasks.set(id, task);
    return task;
  }

  async updateAgentTask(id: string, data: Partial<InsertAgentTask>): Promise<AgentTask | undefined> {
    const existing = this.agentTasks.get(id);
    if (!existing) return undefined;
    const updated: AgentTask = { ...existing, ...data };
    this.agentTasks.set(id, updated);
    return updated;
  }

  // Businesses
  async getAllBusinesses(): Promise<Business[]> {
    return Array.from(this.businesses.values()).sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }

  async getBusiness(id: string): Promise<Business | undefined> {
    return this.businesses.get(id);
  }

  async createBusiness(insertBusiness: InsertBusiness): Promise<Business> {
    const id = randomUUID();
    const business: Business = { 
      id,
      name: insertBusiness.name,
      industry: insertBusiness.industry ?? null,
      address: insertBusiness.address ?? null,
      city: insertBusiness.city ?? null,
      state: insertBusiness.state ?? null,
      zip: insertBusiness.zip ?? null,
      country: insertBusiness.country ?? null,
      phone: insertBusiness.phone ?? null,
      website: insertBusiness.website ?? null,
      source: insertBusiness.source ?? "manual",
      createdAt: new Date() 
    };
    this.businesses.set(id, business);
    return business;
  }

  async updateBusiness(id: string, data: Partial<InsertBusiness>): Promise<Business | undefined> {
    const existing = this.businesses.get(id);
    if (!existing) return undefined;
    const updated: Business = { 
      ...existing, 
      ...data,
      industry: data.industry !== undefined ? data.industry : existing.industry,
      address: data.address !== undefined ? data.address : existing.address,
      city: data.city !== undefined ? data.city : existing.city,
      state: data.state !== undefined ? data.state : existing.state,
      zip: data.zip !== undefined ? data.zip : existing.zip,
      country: data.country !== undefined ? data.country : existing.country,
    };
    this.businesses.set(id, updated);
    return updated;
  }

  async deleteBusiness(id: string): Promise<boolean> {
    return this.businesses.delete(id);
  }

  // Leads
  async getAllLeads(): Promise<Lead[]> {
    return Array.from(this.leads.values()).sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }

  async getLead(id: string): Promise<Lead | undefined> {
    return this.leads.get(id);
  }

  async getLeadsByBusiness(businessId: string): Promise<Lead[]> {
    return Array.from(this.leads.values()).filter((l) => l.businessId === businessId);
  }

  async createLead(insertLead: InsertLead): Promise<Lead> {
    const id = randomUUID();
    const lead: Lead = { 
      id,
      businessId: insertLead.businessId,
      organizationId: insertLead.organizationId ?? null,
      status: insertLead.status ?? "new",
      score: insertLead.score ?? null,
      assignedTo: insertLead.assignedTo ?? null,
      createdAt: new Date(), 
      updatedAt: new Date() 
    };
    this.leads.set(id, lead);
    return lead;
  }

  async updateLead(id: string, data: Partial<InsertLead>): Promise<Lead | undefined> {
    const existing = this.leads.get(id);
    if (!existing) return undefined;
    const updated: Lead = { ...existing, ...data, updatedAt: new Date() };
    this.leads.set(id, updated);
    return updated;
  }

  async deleteLead(id: string): Promise<boolean> {
    return this.leads.delete(id);
  }

  // Online Presence Checks
  async getOnlinePresenceByBusiness(businessId: string): Promise<OnlinePresenceCheck | undefined> {
    return Array.from(this.onlinePresenceChecks.values()).find((c) => c.businessId === businessId);
  }

  async createOnlinePresenceCheck(insertCheck: InsertOnlinePresenceCheck): Promise<OnlinePresenceCheck> {
    const id = randomUUID();
    const check: OnlinePresenceCheck = { 
      id,
      businessId: insertCheck.businessId,
      websiteFound: insertCheck.websiteFound ?? null,
      domainChecked: insertCheck.domainChecked ?? null,
      googleBusinessFound: insertCheck.googleBusinessFound ?? null,
      socialPresence: insertCheck.socialPresence ?? null,
      confidenceScore: insertCheck.confidenceScore ?? null,
      checkedAt: new Date() 
    };
    this.onlinePresenceChecks.set(id, check);
    return check;
  }

  // Contacts
  async getAllContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values()).sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }

  async getContact(id: string): Promise<Contact | undefined> {
    return this.contacts.get(id);
  }

  async getContactsByBusiness(businessId: string): Promise<Contact[]> {
    return Array.from(this.contacts.values()).filter((c) => c.businessId === businessId);
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = randomUUID();
    const contact: Contact = { 
      id,
      businessId: insertContact.businessId,
      fullName: insertContact.fullName,
      role: insertContact.role ?? null,
      phone: insertContact.phone ?? null,
      email: insertContact.email ?? null,
      source: insertContact.source ?? null,
      isDnc: insertContact.isDnc ?? null,
      verified: insertContact.verified ?? null,
      createdAt: new Date() 
    };
    this.contacts.set(id, contact);
    return contact;
  }

  async updateContact(id: string, data: Partial<InsertContact>): Promise<Contact | undefined> {
    const existing = this.contacts.get(id);
    if (!existing) return undefined;
    const updated: Contact = { ...existing, ...data };
    this.contacts.set(id, updated);
    return updated;
  }

  async deleteContact(id: string): Promise<boolean> {
    return this.contacts.delete(id);
  }

  // Calls
  async getAllCalls(): Promise<Call[]> {
    return Array.from(this.calls.values());
  }

  async getCallsByLead(leadId: string): Promise<Call[]> {
    return Array.from(this.calls.values()).filter((c) => c.leadId === leadId);
  }

  async createCall(insertCall: InsertCall): Promise<Call> {
    const id = randomUUID();
    const call: Call = { 
      id,
      leadId: insertCall.leadId,
      contactId: insertCall.contactId ?? null,
      agentId: insertCall.agentId ?? null,
      callStatus: insertCall.callStatus ?? "completed",
      callStart: insertCall.callStart ?? null,
      callEnd: insertCall.callEnd ?? null,
      recordingUrl: insertCall.recordingUrl ?? null,
    };
    this.calls.set(id, call);
    return call;
  }

  // Call Transcripts
  async getTranscriptByCall(callId: string): Promise<CallTranscript | undefined> {
    return Array.from(this.callTranscripts.values()).find((t) => t.callId === callId);
  }

  async createCallTranscript(insertTranscript: InsertCallTranscript): Promise<CallTranscript> {
    const id = randomUUID();
    const transcript: CallTranscript = { 
      id,
      callId: insertTranscript.callId,
      transcript: insertTranscript.transcript ?? null,
      sentiment: insertTranscript.sentiment ?? null,
      createdAt: new Date() 
    };
    this.callTranscripts.set(id, transcript);
    return transcript;
  }

  // Call Outcomes
  async getOutcomeByCall(callId: string): Promise<CallOutcome | undefined> {
    return Array.from(this.callOutcomes.values()).find((o) => o.callId === callId);
  }

  async createCallOutcome(insertOutcome: InsertCallOutcome): Promise<CallOutcome> {
    const id = randomUUID();
    const outcome: CallOutcome = { 
      id,
      callId: insertOutcome.callId,
      outcome: insertOutcome.outcome,
      notes: insertOutcome.notes ?? null,
      nextAction: insertOutcome.nextAction ?? null,
      createdAt: new Date() 
    };
    this.callOutcomes.set(id, outcome);
    return outcome;
  }

  // Web Form Submissions
  async getAllWebFormSubmissions(): Promise<WebFormSubmission[]> {
    return Array.from(this.webFormSubmissions.values());
  }

  async getWebFormSubmissionsByLead(leadId: string): Promise<WebFormSubmission[]> {
    return Array.from(this.webFormSubmissions.values()).filter((s) => s.leadId === leadId);
  }

  async createWebFormSubmission(insertSubmission: InsertWebFormSubmission): Promise<WebFormSubmission> {
    const id = randomUUID();
    const submission: WebFormSubmission = { 
      id,
      leadId: insertSubmission.leadId,
      endpoint: insertSubmission.endpoint,
      payload: insertSubmission.payload ?? null,
      responseStatus: insertSubmission.responseStatus ?? null,
      submittedAt: new Date() 
    };
    this.webFormSubmissions.set(id, submission);
    return submission;
  }

  // Meetings
  async getAllMeetings(): Promise<Meeting[]> {
    return Array.from(this.meetings.values());
  }

  async getMeetingsByLead(leadId: string): Promise<Meeting[]> {
    return Array.from(this.meetings.values()).filter((m) => m.leadId === leadId);
  }

  async createMeeting(insertMeeting: InsertMeeting): Promise<Meeting> {
    const id = randomUUID();
    const meeting: Meeting = { 
      id,
      leadId: insertMeeting.leadId,
      scheduledAt: insertMeeting.scheduledAt,
      meetingLink: insertMeeting.meetingLink ?? null,
      status: insertMeeting.status ?? "scheduled",
      createdAt: new Date() 
    };
    this.meetings.set(id, meeting);
    return meeting;
  }

  async updateMeeting(id: string, data: Partial<InsertMeeting>): Promise<Meeting | undefined> {
    const existing = this.meetings.get(id);
    if (!existing) return undefined;
    const updated: Meeting = { ...existing, ...data };
    this.meetings.set(id, updated);
    return updated;
  }

  // Activity Logs
  async getAllActivityLogs(): Promise<ActivityLog[]> {
    return Array.from(this.activityLogs.values()).sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }

  async getActivityLogsByLead(leadId: string): Promise<ActivityLog[]> {
    return Array.from(this.activityLogs.values())
      .filter((l) => l.leadId === leadId)
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }

  async createActivityLog(insertLog: InsertActivityLog): Promise<ActivityLog> {
    const id = randomUUID();
    const log: ActivityLog = { 
      ...insertLog, 
      id, 
      leadId: insertLog.leadId ?? null,
      actorId: insertLog.actorId ?? null,
      metadata: insertLog.metadata ?? null,
      createdAt: new Date() 
    };
    this.activityLogs.set(id, log);
    return log;
  }

  async deleteActivityLog(id: string): Promise<boolean> {
    return this.activityLogs.delete(id);
  }

  // Audit Logs
  async getAllAuditLogs(): Promise<AuditLog[]> {
    return Array.from(this.auditLogs.values()).sort(
      (a, b) => new Date(b.performedAt || 0).getTime() - new Date(a.performedAt || 0).getTime()
    );
  }

  async createAuditLog(insertLog: InsertAuditLog): Promise<AuditLog> {
    const id = randomUUID();
    const log: AuditLog = { 
      id,
      entityType: insertLog.entityType,
      entityId: insertLog.entityId,
      action: insertLog.action,
      before: insertLog.before ?? null,
      after: insertLog.after ?? null,
      performedBy: insertLog.performedBy ?? null,
      performedAt: new Date() 
    };
    this.auditLogs.set(id, log);
    return log;
  }

  // External Contacts
  async getAllExternalContacts(): Promise<ExternalContact[]> {
    return Array.from(this.externalContacts.values()).sort(
      (a, b) => new Date(b.syncedAt || 0).getTime() - new Date(a.syncedAt || 0).getTime()
    );
  }

  async getExternalContact(id: string): Promise<ExternalContact | undefined> {
    return this.externalContacts.get(id);
  }

  async upsertExternalContact(contact: InsertExternalContact): Promise<ExternalContact> {
    const existing = Array.from(this.externalContacts.values()).find(
      (c) => c.externalId === contact.externalId
    );
    if (existing) {
      const updated: ExternalContact = { ...existing, ...contact, syncedAt: new Date() };
      this.externalContacts.set(existing.id, updated);
      return updated;
    }
    const id = randomUUID();
    const newContact: ExternalContact = { 
      id,
      externalId: contact.externalId,
      name: contact.name,
      email: contact.email,
      message: contact.message ?? null,
      createdAt: contact.createdAt ?? null,
      syncedAt: new Date() 
    };
    this.externalContacts.set(id, newContact);
    return newContact;
  }

  async deleteExternalContact(id: string): Promise<boolean> {
    return this.externalContacts.delete(id);
  }

  // External Conversations
  async getAllExternalConversations(): Promise<ExternalConversation[]> {
    return Array.from(this.externalConversations.values()).sort(
      (a, b) => new Date(b.syncedAt || 0).getTime() - new Date(a.syncedAt || 0).getTime()
    );
  }

  async getExternalConversation(id: string): Promise<ExternalConversation | undefined> {
    return this.externalConversations.get(id);
  }

  async upsertExternalConversation(conversation: InsertExternalConversation): Promise<ExternalConversation> {
    const existing = Array.from(this.externalConversations.values()).find(
      (c) => c.externalId === conversation.externalId
    );
    if (existing) {
      const updated: ExternalConversation = { ...existing, ...conversation, syncedAt: new Date() };
      this.externalConversations.set(existing.id, updated);
      return updated;
    }
    const id = randomUUID();
    const newConversation: ExternalConversation = { 
      id,
      externalId: conversation.externalId,
      title: conversation.title ?? null,
      messages: conversation.messages ?? null,
      createdAt: conversation.createdAt ?? null,
      syncedAt: new Date() 
    };
    this.externalConversations.set(id, newConversation);
    return newConversation;
  }

  async deleteExternalConversation(id: string): Promise<boolean> {
    return this.externalConversations.delete(id);
  }

  // Analytics
  async getAnalyticsSummary(): Promise<{
    totalLeads: number;
    newLeadsToday: number;
    qualifiedLeads: number;
    closedLeads: number;
    conversionRate: number;
    callsMade: number;
  }> {
    const leads = Array.from(this.leads.values());
    const calls = Array.from(this.calls.values());

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalLeads = leads.length;
    const newLeadsToday = leads.filter((l) => l.createdAt && new Date(l.createdAt) >= today).length;
    const qualifiedLeads = leads.filter((l) => l.status === "qualified").length;
    const closedLeads = leads.filter((l) => l.status === "closed").length;
    const conversionRate = totalLeads > 0 ? Math.round((closedLeads / totalLeads) * 100) : 0;
    const callsMade = calls.length;

    return {
      totalLeads,
      newLeadsToday,
      qualifiedLeads,
      closedLeads,
      conversionRate,
      callsMade,
    };
  }

  async getWeeklyAnalytics(): Promise<Array<{
    day: string;
    leads: number;
    calls: number;
    conversions: number;
  }>> {
    const leads = Array.from(this.leads.values());
    const calls = Array.from(this.calls.values());
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weeklyData: Array<{ day: string; leads: number; calls: number; conversions: number }> = [];

    // Get data for the last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dayLeads = leads.filter((l) => {
        const createdAt = l.createdAt ? new Date(l.createdAt) : null;
        return createdAt && createdAt >= date && createdAt < nextDate;
      }).length;

      const dayCalls = calls.filter((c) => {
        const callStart = c.callStart ? new Date(c.callStart) : null;
        return callStart && callStart >= date && callStart < nextDate;
      }).length;

      const dayConversions = leads.filter((l) => {
        const createdAt = l.createdAt ? new Date(l.createdAt) : null;
        return createdAt && createdAt >= date && createdAt < nextDate && l.status === "closed";
      }).length;

      weeklyData.push({
        day: dayNames[date.getDay()],
        leads: dayLeads,
        calls: dayCalls,
        conversions: dayConversions,
      });
    }

    return weeklyData;
  }

  // Events
  async getAllEvents(): Promise<Event[]> {
    return Array.from(this.events.values()).sort(
      (a, b) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime()
    );
  }

  async getEventsByType(eventType: string): Promise<Event[]> {
    return Array.from(this.events.values())
      .filter((e) => e.eventType === eventType)
      .sort((a, b) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime());
  }

  async getEventsByCorrelation(correlationId: string): Promise<Event[]> {
    return Array.from(this.events.values())
      .filter((e) => e.correlationId === correlationId)
      .sort((a, b) => new Date(a.timestamp || 0).getTime() - new Date(b.timestamp || 0).getTime());
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const id = randomUUID();
    const newEvent: Event = {
      id,
      eventId: event.eventId,
      eventType: event.eventType,
      timestamp: new Date(),
      sourceAgent: event.sourceAgent ?? null,
      correlationId: event.correlationId ?? null,
      payload: event.payload ?? null,
      processed: event.processed ?? false,
    };
    this.events.set(id, newEvent);
    return newEvent;
  }

  async markEventProcessed(id: string): Promise<Event | undefined> {
    const event = this.events.get(id);
    if (!event) return undefined;
    const updated = { ...event, processed: true };
    this.events.set(id, updated);
    return updated;
  }

  // Caller Agent States
  async getCallerAgentState(callId: string): Promise<CallerAgentState | undefined> {
    return Array.from(this.callerAgentStates.values()).find((s) => s.callId === callId);
  }

  async createCallerAgentState(state: InsertCallerAgentState): Promise<CallerAgentState> {
    const id = randomUUID();
    const newState: CallerAgentState = {
      id,
      callId: state.callId,
      emotionalTone: state.emotionalTone ?? null,
      engagementLevel: state.engagementLevel ?? null,
      trustLevel: state.trustLevel ?? null,
      resistanceLevel: state.resistanceLevel ?? null,
      buyingSignals: state.buyingSignals ?? null,
      objectionsRaised: state.objectionsRaised ?? null,
      updatedAt: new Date(),
    };
    this.callerAgentStates.set(id, newState);
    return newState;
  }

  async updateCallerAgentState(callId: string, data: Partial<InsertCallerAgentState>): Promise<CallerAgentState | undefined> {
    const existing = await this.getCallerAgentState(callId);
    if (!existing) return undefined;
    const updated: CallerAgentState = { ...existing, ...data, updatedAt: new Date() };
    this.callerAgentStates.set(existing.id, updated);
    return updated;
  }

  // Clients
  async getAllClients(): Promise<Client[]> {
    return Array.from(this.clients.values());
  }

  async getClient(id: string): Promise<Client | undefined> {
    return this.clients.get(id);
  }

  async getClientByBusiness(businessId: string): Promise<Client | undefined> {
    return Array.from(this.clients.values()).find((c) => c.businessId === businessId);
  }

  async getClientByLead(leadId: string): Promise<Client | undefined> {
    return Array.from(this.clients.values()).find((c) => c.leadId === leadId);
  }

  async createClient(client: InsertClient): Promise<Client> {
    const id = randomUUID();
    const newClient: Client = {
      id,
      businessId: client.businessId,
      leadId: client.leadId ?? null,
      organizationId: client.organizationId ?? null,
      status: client.status ?? "active",
      monthlyRevenue: client.monthlyRevenue ?? 0,
      contractStart: client.contractStart ?? null,
      contractEnd: client.contractEnd ?? null,
      notes: client.notes ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.clients.set(id, newClient);
    return newClient;
  }

  async updateClient(id: string, data: Partial<InsertClient>): Promise<Client | undefined> {
    const existing = this.clients.get(id);
    if (!existing) return undefined;
    const updated: Client = { ...existing, ...data, updatedAt: new Date() };
    this.clients.set(id, updated);
    return updated;
  }

  async deleteClient(id: string): Promise<boolean> {
    return this.clients.delete(id);
  }

  // Client Assets
  async getAllClientAssets(): Promise<ClientAsset[]> {
    return Array.from(this.clientAssets.values());
  }

  async getClientAsset(id: string): Promise<ClientAsset | undefined> {
    return this.clientAssets.get(id);
  }

  async getAssetsByClient(clientId: string): Promise<ClientAsset[]> {
    return Array.from(this.clientAssets.values()).filter((a) => a.clientId === clientId);
  }

  async getExpiringAssets(daysAhead: number): Promise<ClientAsset[]> {
    const now = new Date();
    const futureDate = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);
    return Array.from(this.clientAssets.values()).filter((a) => {
      if (a.expiryDate && a.expiryDate <= futureDate && a.expiryDate >= now) return true;
      if (a.renewalDate && a.renewalDate <= futureDate && a.renewalDate >= now) return true;
      return false;
    });
  }

  async createClientAsset(asset: InsertClientAsset): Promise<ClientAsset> {
    const id = randomUUID();
    const newAsset: ClientAsset = {
      id,
      clientId: asset.clientId,
      type: asset.type,
      name: asset.name,
      provider: asset.provider ?? null,
      status: asset.status ?? "active",
      cost: asset.cost ?? 0,
      billingCycle: asset.billingCycle ?? null,
      renewalDate: asset.renewalDate ?? null,
      expiryDate: asset.expiryDate ?? null,
      loginUrl: asset.loginUrl ?? null,
      username: asset.username ?? null,
      notes: asset.notes ?? null,
      metadata: asset.metadata ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.clientAssets.set(id, newAsset);
    return newAsset;
  }

  async updateClientAsset(id: string, data: Partial<InsertClientAsset>): Promise<ClientAsset | undefined> {
    const existing = this.clientAssets.get(id);
    if (!existing) return undefined;
    const updated: ClientAsset = { ...existing, ...data, updatedAt: new Date() };
    this.clientAssets.set(id, updated);
    return updated;
  }

  async deleteClientAsset(id: string): Promise<boolean> {
    return this.clientAssets.delete(id);
  }

  // Client Notes
  async getNotesByClient(clientId: string): Promise<ClientNote[]> {
    return Array.from(this.clientNotes.values())
      .filter((n) => n.clientId === clientId)
      .sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0));
  }

  async createClientNote(note: InsertClientNote): Promise<ClientNote> {
    const id = randomUUID();
    const newNote: ClientNote = {
      id,
      clientId: note.clientId,
      authorId: note.authorId ?? null,
      authorType: note.authorType ?? "user",
      content: note.content,
      createdAt: new Date(),
    };
    this.clientNotes.set(id, newNote);
    return newNote;
  }

  async deleteClientNote(id: string): Promise<boolean> {
    return this.clientNotes.delete(id);
  }

  // Nurturing Sequences
  async getAllNurturingSequences(): Promise<NurturingSequence[]> {
    return Array.from(this.nurturingSequences.values());
  }

  async getNurturingSequence(id: string): Promise<NurturingSequence | undefined> {
    return this.nurturingSequences.get(id);
  }

  async getActiveNurturingSequences(): Promise<NurturingSequence[]> {
    return Array.from(this.nurturingSequences.values()).filter(s => s.status === "active");
  }

  async getNurturingSequenceByTrigger(triggerEvent: string): Promise<NurturingSequence[]> {
    return Array.from(this.nurturingSequences.values()).filter(s => s.triggerEvent === triggerEvent && s.status === "active");
  }

  async createNurturingSequence(insertSequence: InsertNurturingSequence): Promise<NurturingSequence> {
    const id = randomUUID();
    const sequence: NurturingSequence = {
      id,
      name: insertSequence.name,
      description: insertSequence.description ?? null,
      status: insertSequence.status ?? "draft",
      triggerEvent: insertSequence.triggerEvent,
      organizationId: insertSequence.organizationId ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.nurturingSequences.set(id, sequence);
    return sequence;
  }

  async updateNurturingSequence(id: string, data: Partial<InsertNurturingSequence>): Promise<NurturingSequence | undefined> {
    const existing = this.nurturingSequences.get(id);
    if (!existing) return undefined;
    const updated: NurturingSequence = { ...existing, ...data, updatedAt: new Date() };
    this.nurturingSequences.set(id, updated);
    return updated;
  }

  async deleteNurturingSequence(id: string): Promise<boolean> {
    return this.nurturingSequences.delete(id);
  }

  // Nurturing Steps
  async getStepsBySequence(sequenceId: string): Promise<NurturingStep[]> {
    return Array.from(this.nurturingSteps.values())
      .filter(s => s.sequenceId === sequenceId)
      .sort((a, b) => a.stepOrder - b.stepOrder);
  }

  async getNurturingStep(id: string): Promise<NurturingStep | undefined> {
    return this.nurturingSteps.get(id);
  }

  async createNurturingStep(insertStep: InsertNurturingStep): Promise<NurturingStep> {
    const id = randomUUID();
    const step: NurturingStep = {
      id,
      sequenceId: insertStep.sequenceId,
      stepOrder: insertStep.stepOrder ?? 1,
      name: insertStep.name,
      channel: insertStep.channel ?? "email",
      delayMinutes: insertStep.delayMinutes ?? 0,
      emailSubject: insertStep.emailSubject ?? null,
      emailBody: insertStep.emailBody ?? null,
      smsBody: insertStep.smsBody ?? null,
      isEngagementCheck: insertStep.isEngagementCheck ?? false,
      createdAt: new Date(),
    };
    this.nurturingSteps.set(id, step);
    return step;
  }

  async updateNurturingStep(id: string, data: Partial<InsertNurturingStep>): Promise<NurturingStep | undefined> {
    const existing = this.nurturingSteps.get(id);
    if (!existing) return undefined;
    const updated: NurturingStep = { ...existing, ...data };
    this.nurturingSteps.set(id, updated);
    return updated;
  }

  async deleteNurturingStep(id: string): Promise<boolean> {
    return this.nurturingSteps.delete(id);
  }

  // Lead Nurturing Enrollments
  async getEnrollmentsByLead(leadId: string): Promise<LeadNurturingEnrollment[]> {
    return Array.from(this.leadNurturingEnrollments.values()).filter(e => e.leadId === leadId);
  }

  async getEnrollmentsBySequence(sequenceId: string): Promise<LeadNurturingEnrollment[]> {
    return Array.from(this.leadNurturingEnrollments.values()).filter(e => e.sequenceId === sequenceId);
  }

  async getActiveEnrollments(): Promise<LeadNurturingEnrollment[]> {
    return Array.from(this.leadNurturingEnrollments.values()).filter(e => e.status === "active");
  }

  async getEnrollment(id: string): Promise<LeadNurturingEnrollment | undefined> {
    return this.leadNurturingEnrollments.get(id);
  }

  async createEnrollment(insertEnrollment: InsertLeadNurturingEnrollment): Promise<LeadNurturingEnrollment> {
    const id = randomUUID();
    const enrollment: LeadNurturingEnrollment = {
      id,
      leadId: insertEnrollment.leadId,
      sequenceId: insertEnrollment.sequenceId,
      currentStepId: insertEnrollment.currentStepId ?? null,
      status: insertEnrollment.status ?? "active",
      enrolledAt: new Date(),
      completedAt: insertEnrollment.completedAt ?? null,
      pausedAt: insertEnrollment.pausedAt ?? null,
    };
    this.leadNurturingEnrollments.set(id, enrollment);
    return enrollment;
  }

  async updateEnrollment(id: string, data: Partial<InsertLeadNurturingEnrollment>): Promise<LeadNurturingEnrollment | undefined> {
    const existing = this.leadNurturingEnrollments.get(id);
    if (!existing) return undefined;
    const updated: LeadNurturingEnrollment = { ...existing, ...data };
    this.leadNurturingEnrollments.set(id, updated);
    return updated;
  }

  // Scheduled Messages
  async getPendingScheduledMessages(): Promise<ScheduledMessage[]> {
    const now = new Date();
    return Array.from(this.scheduledMessages.values())
      .filter(m => m.status === "pending" && new Date(m.scheduledFor) <= now)
      .sort((a, b) => new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime());
  }

  async getScheduledMessagesByLead(leadId: string): Promise<ScheduledMessage[]> {
    return Array.from(this.scheduledMessages.values()).filter(m => m.leadId === leadId);
  }

  async getScheduledMessage(id: string): Promise<ScheduledMessage | undefined> {
    return this.scheduledMessages.get(id);
  }

  async createScheduledMessage(insertMessage: InsertScheduledMessage): Promise<ScheduledMessage> {
    const id = randomUUID();
    const message: ScheduledMessage = {
      id,
      enrollmentId: insertMessage.enrollmentId,
      stepId: insertMessage.stepId,
      leadId: insertMessage.leadId,
      contactId: insertMessage.contactId ?? null,
      channel: insertMessage.channel,
      scheduledFor: insertMessage.scheduledFor,
      status: insertMessage.status ?? "pending",
      subject: insertMessage.subject ?? null,
      body: insertMessage.body,
      sentAt: insertMessage.sentAt ?? null,
      errorMessage: insertMessage.errorMessage ?? null,
      createdAt: new Date(),
    };
    this.scheduledMessages.set(id, message);
    return message;
  }

  async updateScheduledMessage(id: string, data: Partial<InsertScheduledMessage>): Promise<ScheduledMessage | undefined> {
    const existing = this.scheduledMessages.get(id);
    if (!existing) return undefined;
    const updated: ScheduledMessage = { ...existing, ...data };
    this.scheduledMessages.set(id, updated);
    return updated;
  }

  // Message Engagements
  async getEngagementsByMessage(messageId: string): Promise<MessageEngagement[]> {
    return Array.from(this.messageEngagements.values()).filter(e => e.messageId === messageId);
  }

  async getEngagementsByLead(leadId: string): Promise<MessageEngagement[]> {
    return Array.from(this.messageEngagements.values()).filter(e => e.leadId === leadId);
  }

  async createMessageEngagement(insertEngagement: InsertMessageEngagement): Promise<MessageEngagement> {
    const id = randomUUID();
    const engagement: MessageEngagement = {
      id,
      messageId: insertEngagement.messageId,
      leadId: insertEngagement.leadId,
      engagementType: insertEngagement.engagementType,
      metadata: insertEngagement.metadata ?? null,
      createdAt: new Date(),
    };
    this.messageEngagements.set(id, engagement);
    return engagement;
  }

  // Lead Nurturing Tags
  async getTagsByLead(leadId: string): Promise<LeadNurturingTag[]> {
    return Array.from(this.leadNurturingTags.values()).filter(t => t.leadId === leadId);
  }

  async createLeadNurturingTag(insertTag: InsertLeadNurturingTag): Promise<LeadNurturingTag> {
    const id = randomUUID();
    const tag: LeadNurturingTag = {
      id,
      leadId: insertTag.leadId,
      tag: insertTag.tag,
      source: insertTag.source ?? null,
      createdAt: new Date(),
    };
    this.leadNurturingTags.set(id, tag);
    return tag;
  }

  async deleteLeadNurturingTag(id: string): Promise<boolean> {
    return this.leadNurturingTags.delete(id);
  }

  // Sample Sites
  async getSampleSite(id: string): Promise<SampleSite | undefined> {
    return this.sampleSites.get(id);
  }

  async getSampleSiteBySlug(slug: string): Promise<SampleSite | undefined> {
    return Array.from(this.sampleSites.values()).find((s) => s.slug === slug);
  }

  async getSampleSitesByLead(leadId: string): Promise<SampleSite[]> {
    return Array.from(this.sampleSites.values()).filter((s) => s.leadId === leadId);
  }

  async createSampleSite(insertSite: InsertSampleSite): Promise<SampleSite> {
    const id = randomUUID();
    const site: SampleSite = {
      id,
      leadId: insertSite.leadId,
      businessId: insertSite.businessId,
      slug: insertSite.slug,
      businessName: insertSite.businessName,
      tagline: insertSite.tagline ?? null,
      industry: insertSite.industry ?? null,
      heroImageUrl: insertSite.heroImageUrl ?? null,
      colorScheme: insertSite.colorScheme ?? null,
      aboutText: insertSite.aboutText ?? null,
      servicesJson: insertSite.servicesJson ?? null,
      contactInfo: insertSite.contactInfo ?? null,
      testimonials: insertSite.testimonials ?? null,
      galleryImages: insertSite.galleryImages ?? null,
      hasOnlineBooking: insertSite.hasOnlineBooking ?? true,
      hasContactForm: insertSite.hasContactForm ?? true,
      hasGoogleMap: insertSite.hasGoogleMap ?? true,
      hasSocialLinks: insertSite.hasSocialLinks ?? true,
      qrCodeDataUrl: insertSite.qrCodeDataUrl ?? null,
      viewCount: 0,
      lastViewedAt: null,
      status: insertSite.status ?? "pending_approval",
      expiresAt: insertSite.expiresAt ?? null,
      approvalStatus: insertSite.approvalStatus ?? "pending",
      approvedBy: insertSite.approvedBy ?? null,
      approvedAt: insertSite.approvedAt ?? null,
      rejectionReason: insertSite.rejectionReason ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.sampleSites.set(id, site);
    return site;
  }

  async updateSampleSite(id: string, data: Partial<InsertSampleSite>): Promise<SampleSite | undefined> {
    const site = this.sampleSites.get(id);
    if (!site) return undefined;
    const updated = { ...site, ...data, updatedAt: new Date() };
    this.sampleSites.set(id, updated);
    return updated;
  }

  async deleteSampleSite(id: string): Promise<boolean> {
    return this.sampleSites.delete(id);
  }

  async getSampleSitesPendingApproval(): Promise<SampleSite[]> {
    return Array.from(this.sampleSites.values()).filter(s => s.approvalStatus === "pending");
  }

  // Approval Queue
  async getApprovalQueue(): Promise<ApprovalQueue[]> {
    return Array.from(this.approvalQueue.values()).sort((a, b) =>
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getApprovalQueueItem(id: string): Promise<ApprovalQueue | undefined> {
    return this.approvalQueue.get(id);
  }

  async createApprovalQueueItem(item: InsertApprovalQueue): Promise<ApprovalQueue> {
    const id = randomUUID();
    const queueItem: ApprovalQueue = {
      id,
      itemType: item.itemType,
      itemId: item.itemId,
      leadId: item.leadId,
      businessName: item.businessName,
      previewTitle: item.previewTitle ?? null,
      previewContent: item.previewContent ?? null,
      status: item.status ?? "pending",
      priority: item.priority ?? 0,
      createdAt: new Date(),
      reviewedAt: null,
      reviewedBy: null,
    };
    this.approvalQueue.set(id, queueItem);
    return queueItem;
  }

  async updateApprovalQueueItem(id: string, data: Partial<InsertApprovalQueue>): Promise<ApprovalQueue | undefined> {
    const item = this.approvalQueue.get(id);
    if (!item) return undefined;
    const updated = { ...item, ...data };
    this.approvalQueue.set(id, updated);
    return updated;
  }

  async deleteApprovalQueueItem(id: string): Promise<boolean> {
    return this.approvalQueue.delete(id);
  }

  // Approval Edit Requests
  async getEditRequestsByItem(itemType: string, itemId: string): Promise<ApprovalEditRequest[]> {
    return Array.from(this.approvalEditRequests.values())
      .filter(r => r.itemType === itemType && r.itemId === itemId)
      .sort((a, b) => new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime());
  }

  async createEditRequest(request: InsertApprovalEditRequest): Promise<ApprovalEditRequest> {
    const id = randomUUID();
    const editRequest: ApprovalEditRequest = {
      id,
      itemType: request.itemType,
      itemId: request.itemId,
      leadId: request.leadId,
      role: request.role,
      message: request.message,
      appliedChanges: request.appliedChanges ?? null,
      status: request.status ?? "pending",
      createdAt: new Date(),
    };
    this.approvalEditRequests.set(id, editRequest);
    return editRequest;
  }

  // Messages pending approval
  async getScheduledMessagesPendingApproval(): Promise<ScheduledMessage[]> {
    return Array.from(this.scheduledMessages.values()).filter(m => m.status === "pending_approval");
  }

  // Agent Configs
  async getAgentConfig(agentId: string): Promise<AgentConfig | undefined> {
    return Array.from(this.agentConfigs.values()).find(c => c.agentId === agentId);
  }

  async getAllAgentConfigs(): Promise<AgentConfig[]> {
    return Array.from(this.agentConfigs.values());
  }

  async upsertAgentConfig(config: InsertAgentConfig): Promise<AgentConfig> {
    const existing = Array.from(this.agentConfigs.values()).find(c => c.agentId === config.agentId);
    if (existing) {
      const updated: AgentConfig = { ...existing, ...config, updatedAt: new Date() };
      this.agentConfigs.set(existing.id, updated);
      return updated;
    }
    const id = randomUUID();
    const newConfig: AgentConfig = {
      id,
      agentId: config.agentId,
      enabled: config.enabled ?? true,
      autoRun: config.autoRun ?? false,
      interval: config.interval ?? 30,
      maxLeadsPerRun: config.maxLeadsPerRun ?? 50,
      targetIndustries: config.targetIndustries ?? [],
      targetLocation: config.targetLocation ?? "Hawaii",
      updatedAt: new Date(),
    };
    this.agentConfigs.set(id, newConfig);
    return newConfig;
  }
}

// Use DatabaseStorage for persistent storage (PostgreSQL)
import { DatabaseStorage } from "./databaseStorage";
export const storage = new DatabaseStorage();
