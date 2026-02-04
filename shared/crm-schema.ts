import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, jsonb, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ============================================================
// ORGANIZATION
// ============================================================
export const organizations = pgTable("organizations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  industry: text("industry"),
  timezone: text("timezone").default("Pacific/Honolulu"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertOrganizationSchema = createInsertSchema(organizations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertOrganization = z.infer<typeof insertOrganizationSchema>;
export type Organization = typeof organizations.$inferSelect;

// ============================================================
// ROLE
// ============================================================
export const roleNameEnum = ["admin", "sales", "viewer"] as const;
export type RoleName = typeof roleNameEnum[number];

export const roles = pgTable("roles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  permissions: jsonb("permissions"),
});

export const insertRoleSchema = createInsertSchema(roles).omit({
  id: true,
});

export type InsertRole = z.infer<typeof insertRoleSchema>;
export type Role = typeof roles.$inferSelect;

// ============================================================
// USER
// ============================================================
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  organizationId: varchar("organization_id"),
  email: text("email").notNull().unique(),
  hashedPassword: text("hashed_password").notNull(),
  fullName: text("full_name").notNull(),
  roleId: varchar("role_id"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// ============================================================
// AI AGENTS
// ============================================================
export const agentTypeEnum = ["crawler", "verifier", "contact", "caller", "reporter", "form_agent", "nurturer"] as const;
export type AgentType = typeof agentTypeEnum[number];

export const agentStatusEnum = ["active", "paused", "error"] as const;
export type AgentStatus = typeof agentStatusEnum[number];

export const agents = pgTable("agents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(),
  name: text("name").notNull(),
  status: text("status").notNull().default("paused"),
  version: text("version").default("1.0.0"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAgentSchema = createInsertSchema(agents).omit({
  id: true,
  createdAt: true,
});

export type InsertAgent = z.infer<typeof insertAgentSchema>;
export type Agent = typeof agents.$inferSelect;

// ============================================================
// AGENT TASK
// ============================================================
export const taskStatusEnum = ["pending", "running", "completed", "failed"] as const;
export type TaskStatus = typeof taskStatusEnum[number];

export const agentTasks = pgTable("agent_tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  agentId: varchar("agent_id").notNull(),
  taskType: text("task_type").notNull(),
  payload: jsonb("payload"),
  status: text("status").notNull().default("pending"),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
});

export const insertAgentTaskSchema = createInsertSchema(agentTasks).omit({
  id: true,
});

export type InsertAgentTask = z.infer<typeof insertAgentTaskSchema>;
export type AgentTask = typeof agentTasks.$inferSelect;

// ============================================================
// BUSINESS
// ============================================================
export const businessSourceEnum = ["google_maps", "yelp", "registry", "directory", "web_form", "api", "manual"] as const;
export type BusinessSource = typeof businessSourceEnum[number];

export const businesses = pgTable("businesses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  industry: text("industry"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  zip: text("zip"),
  country: text("country").default("USA"),
  phone: text("phone"),
  website: text("website"),
  source: text("source").notNull().default("manual"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertBusinessSchema = createInsertSchema(businesses).omit({
  id: true,
  createdAt: true,
});

export type InsertBusiness = z.infer<typeof insertBusinessSchema>;
export type Business = typeof businesses.$inferSelect;

// ============================================================
// LEAD
// ============================================================
export const leadStatusEnum = ["new", "verified", "contacted", "qualified", "closed", "archived"] as const;
export type LeadStatus = typeof leadStatusEnum[number];

export const pipelineStages = [
  { id: "new", label: "Discovered", color: "blue", description: "Newly discovered leads" },
  { id: "verified", label: "Needs Help", color: "cyan", description: "Weak online presence - good prospect" },
  { id: "contacted", label: "Contacted", color: "yellow", description: "Initial contact made" },
  { id: "qualified", label: "Qualified", color: "green", description: "Qualified as opportunity" },
  { id: "closed", label: "Closed", color: "purple", description: "Deal closed" },
  { id: "archived", label: "Archived", color: "gray", description: "Has strong online presence - not a prospect" },
] as const;

export const leads = pgTable("leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  businessId: varchar("business_id").notNull(),
  organizationId: varchar("organization_id"),
  status: text("status").notNull().default("new"),
  score: integer("score").default(0),
  assignedTo: varchar("assigned_to"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;

// ============================================================
// ONLINE PRESENCE CHECK
// ============================================================
export const onlinePresenceStrengthEnum = ["none", "weak", "moderate", "strong"] as const;
export type OnlinePresenceStrength = typeof onlinePresenceStrengthEnum[number];

export const onlinePresenceChecks = pgTable("online_presence_checks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  businessId: varchar("business_id").notNull(),
  // Website info
  websiteFound: boolean("website_found").default(false),
  websiteUrl: text("website_url"),
  websiteActive: boolean("website_active").default(false),
  websiteQuality: text("website_quality"), // "none", "basic", "professional"
  domainChecked: text("domain_checked"),
  // Google Business
  googleBusinessFound: boolean("google_business_found").default(false),
  googleBusinessUrl: text("google_business_url"),
  googleRating: real("google_rating"), // 1.0 - 5.0
  googleReviewCount: integer("google_review_count"),
  // Yelp
  yelpFound: boolean("yelp_found").default(false),
  yelpUrl: text("yelp_url"),
  yelpRating: real("yelp_rating"), // 1.0 - 5.0
  yelpReviewCount: integer("yelp_review_count"),
  // Social Media
  socialPresence: boolean("social_presence").default(false),
  facebookUrl: text("facebook_url"),
  instagramUrl: text("instagram_url"),
  twitterUrl: text("twitter_url"),
  linkedinUrl: text("linkedin_url"),
  tiktokUrl: text("tiktok_url"),
  // Overall assessment
  onlinePresenceStrength: text("online_presence_strength").default("none"), // none, weak, moderate, strong
  confidenceScore: integer("confidence_score").default(0),
  reasoning: text("reasoning"),
  recommendation: text("recommendation"), // prospect, archive
  checkedAt: timestamp("checked_at").defaultNow(),
});

export const insertOnlinePresenceCheckSchema = createInsertSchema(onlinePresenceChecks).omit({
  id: true,
  checkedAt: true,
});

export type InsertOnlinePresenceCheck = z.infer<typeof insertOnlinePresenceCheckSchema>;
export type OnlinePresenceCheck = typeof onlinePresenceChecks.$inferSelect;

// ============================================================
// CONTACT
// ============================================================
export const contacts = pgTable("contacts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  businessId: varchar("business_id").notNull(),
  fullName: text("full_name").notNull(),
  role: text("role"),
  phone: text("phone"),
  email: text("email"),
  source: text("source"),
  isDnc: boolean("is_dnc").default(false),
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true,
});

export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;

// ============================================================
// CALL
// ============================================================
export const callStatusEnum = ["completed", "failed", "no_answer"] as const;
export type CallStatus = typeof callStatusEnum[number];

export const calls = pgTable("calls", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  leadId: varchar("lead_id").notNull(),
  contactId: varchar("contact_id"),
  agentId: varchar("agent_id"),
  callStatus: text("call_status").notNull().default("completed"),
  callStart: timestamp("call_start"),
  callEnd: timestamp("call_end"),
  recordingUrl: text("recording_url"),
});

export const insertCallSchema = createInsertSchema(calls).omit({
  id: true,
});

export type InsertCall = z.infer<typeof insertCallSchema>;
export type Call = typeof calls.$inferSelect;

// ============================================================
// CALL TRANSCRIPT
// ============================================================
export const sentimentEnum = ["positive", "neutral", "negative"] as const;
export type Sentiment = typeof sentimentEnum[number];

export const callTranscripts = pgTable("call_transcripts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  callId: varchar("call_id").notNull(),
  transcript: text("transcript"),
  sentiment: text("sentiment"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCallTranscriptSchema = createInsertSchema(callTranscripts).omit({
  id: true,
  createdAt: true,
});

export type InsertCallTranscript = z.infer<typeof insertCallTranscriptSchema>;
export type CallTranscript = typeof callTranscripts.$inferSelect;

// ============================================================
// CALL OUTCOME
// ============================================================
export const callOutcomeEnum = ["interested", "not_interested", "callback"] as const;
export type CallOutcomeType = typeof callOutcomeEnum[number];

export const callOutcomes = pgTable("call_outcomes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  callId: varchar("call_id").notNull(),
  outcome: text("outcome").notNull(),
  notes: text("notes"),
  nextAction: text("next_action"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCallOutcomeSchema = createInsertSchema(callOutcomes).omit({
  id: true,
  createdAt: true,
});

export type InsertCallOutcome = z.infer<typeof insertCallOutcomeSchema>;
export type CallOutcome = typeof callOutcomes.$inferSelect;

// ============================================================
// WEB FORM SUBMISSION
// ============================================================
export const webFormSubmissions = pgTable("web_form_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  leadId: varchar("lead_id").notNull(),
  endpoint: text("endpoint").notNull(),
  payload: jsonb("payload"),
  responseStatus: integer("response_status"),
  submittedAt: timestamp("submitted_at").defaultNow(),
});

export const insertWebFormSubmissionSchema = createInsertSchema(webFormSubmissions).omit({
  id: true,
  submittedAt: true,
});

export type InsertWebFormSubmission = z.infer<typeof insertWebFormSubmissionSchema>;
export type WebFormSubmission = typeof webFormSubmissions.$inferSelect;

// ============================================================
// MEETING
// ============================================================
export const meetingStatusEnum = ["scheduled", "completed", "cancelled"] as const;
export type MeetingStatus = typeof meetingStatusEnum[number];

export const meetings = pgTable("meetings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  leadId: varchar("lead_id").notNull(),
  scheduledAt: timestamp("scheduled_at").notNull(),
  meetingLink: text("meeting_link"),
  status: text("status").notNull().default("scheduled"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertMeetingSchema = createInsertSchema(meetings).omit({
  id: true,
  createdAt: true,
});

export type InsertMeeting = z.infer<typeof insertMeetingSchema>;
export type Meeting = typeof meetings.$inferSelect;

// ============================================================
// ACTIVITY LOG
// ============================================================
export const actorTypeEnum = ["agent", "user"] as const;
export type ActorType = typeof actorTypeEnum[number];

export const activityLogs = pgTable("activity_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  leadId: varchar("lead_id"),
  actorType: text("actor_type").notNull(),
  actorId: varchar("actor_id"),
  action: text("action").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertActivityLogSchema = createInsertSchema(activityLogs).omit({
  id: true,
  createdAt: true,
});

export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;
export type ActivityLog = typeof activityLogs.$inferSelect;

// ============================================================
// AUDIT LOG
// ============================================================
export const auditLogs = pgTable("audit_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  entityType: text("entity_type").notNull(),
  entityId: varchar("entity_id").notNull(),
  action: text("action").notNull(),
  before: jsonb("before"),
  after: jsonb("after"),
  performedBy: varchar("performed_by"),
  performedAt: timestamp("performed_at").defaultNow(),
});

export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({
  id: true,
  performedAt: true,
});

export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type AuditLog = typeof auditLogs.$inferSelect;

// ============================================================
// EXTERNAL CRM SYNC (Edify API)
// ============================================================
export const externalContacts = pgTable("external_contacts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  externalId: integer("external_id").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message"),
  syncedAt: timestamp("synced_at").defaultNow(),
  createdAt: timestamp("created_at"),
});

export const insertExternalContactSchema = createInsertSchema(externalContacts).omit({
  id: true,
  syncedAt: true,
});

export type InsertExternalContact = z.infer<typeof insertExternalContactSchema>;
export type ExternalContact = typeof externalContacts.$inferSelect;

export const externalConversations = pgTable("external_conversations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  externalId: integer("external_id").notNull(),
  title: text("title"),
  messages: jsonb("messages"),
  syncedAt: timestamp("synced_at").defaultNow(),
  createdAt: timestamp("created_at"),
});

export const insertExternalConversationSchema = createInsertSchema(externalConversations).omit({
  id: true,
  syncedAt: true,
});

export type InsertExternalConversation = z.infer<typeof insertExternalConversationSchema>;
export type ExternalConversation = typeof externalConversations.$inferSelect;

// ============================================================
// ANALYTICS
// ============================================================
export const analyticsSnapshots = pgTable("analytics_snapshots", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  totalLeads: integer("total_leads").default(0),
  newLeadsToday: integer("new_leads_today").default(0),
  qualifiedLeads: integer("qualified_leads").default(0),
  closedLeads: integer("closed_leads").default(0),
  conversionRate: integer("conversion_rate").default(0),
  callsMade: integer("calls_made").default(0),
  avgCallDuration: integer("avg_call_duration").default(0),
  pageViews: jsonb("page_views"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type AnalyticsSnapshot = typeof analyticsSnapshots.$inferSelect;

// ============================================================
// CALLER AGENT STATE
// ============================================================
export const callerAgentStates = pgTable("caller_agent_states", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  callId: varchar("call_id").notNull(),
  vapiCallId: varchar("vapi_call_id"),
  currentPhase: text("current_phase").default("pending"),
  emotionalTone: text("emotional_tone"),
  engagementLevel: integer("engagement_level").default(0),
  trustLevel: integer("trust_level").default(0),
  resistanceLevel: integer("resistance_level").default(0),
  objectionCount: integer("objection_count").default(0),
  microCommitments: integer("micro_commitments").default(0),
  buyingSignals: jsonb("buying_signals").default([]),
  objectionsRaised: jsonb("objections_raised").default([]),
  detectedObjections: jsonb("detected_objections").default([]),
  psychologyTechniquesUsed: jsonb("psychology_techniques_used").default([]),
  conversationHistory: jsonb("conversation_history").default([]),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertCallerAgentStateSchema = createInsertSchema(callerAgentStates).omit({
  id: true,
  updatedAt: true,
});

export type InsertCallerAgentState = z.infer<typeof insertCallerAgentStateSchema>;
export type CallerAgentState = typeof callerAgentStates.$inferSelect;

// ============================================================
// SALES PSYCHOLOGY FRAMEWORK (KNOWLEDGE)
// ============================================================
export const salesPsychologyPrinciples = [
  { id: "trust_first", title: "Trust First, Sell Never", description: "Goal is credibility, not persuasion." },
  { id: "authority", title: "Status & Authority Signaling", description: "Subtle authority cues, local Hawaii business references." },
  { id: "loss_aversion", title: "Loss Aversion", description: "Frames opportunity cost without fear-mongering." },
  { id: "micro_commitments", title: "Micro-Commitments", description: "Small questions before big asks." },
  { id: "objection_reframing", title: "Objection Reframing", description: "Emotional root mapping to response strategy." },
  { id: "social_proof", title: "Social Proof", description: "Localized references to similar businesses." },
  { id: "decision_fatigue", title: "Decision Fatigue Avoidance", description: "One idea at a time, one next step." },
  { id: "soft_close", title: "Power of a Soft Close", description: "No-pressure conversation proposal." },
] as const;

export const objectionStrategies = [
  { type: "too_busy", root: "time_pressure", strategy: "respect + shorten" },
  { type: "not_interested", root: "lack_of_curiosity", strategy: "curiosity prompt" },
  { type: "already_have_someone", root: "perceived_satisfaction", strategy: "differentiation" },
  { type: "too_expensive", root: "value_gap", strategy: "value reframe" },
  { type: "call_back_later", root: "procrastination", strategy: "soft commitment" },
  { type: "no_need", root: "unawareness", strategy: "gap identification" },
] as const;

// ============================================================
// EVENT SUBSCRIPTIONS
// ============================================================
export const eventSubscriptions = [
  { agentId: "crawler-agent", subscribesTo: [] },
  { agentId: "verifier-agent", subscribesTo: ["BUSINESS_DISCOVERED"] },
  { agentId: "contact-agent", subscribesTo: ["ONLINE_PRESENCE_VERIFIED"] },
  { agentId: "caller-agent", subscribesTo: ["CONTACT_ENRICHED", "CALL_REQUESTED"] },
  { agentId: "reporter-agent", subscribesTo: ["*"] },
  { agentId: "form-agent", subscribesTo: ["ONLINE_PRESENCE_VERIFIED"] },
  { agentId: "nurturer-agent", subscribesTo: ["CONTACT_ENRICHED", "MESSAGE_ENGAGEMENT_RECEIVED"] },
] as const;

// ============================================================
// AGENT DEFINITIONS
// ============================================================
export const agentDefinitions = [
  {
    id: "crawler-agent",
    name: "Crawler Agent",
    type: "crawler" as AgentType,
    description: "Discovers businesses from Google Maps, Yelp, registries. Creates Business and Lead records.",
    icon: "Globe",
  },
  {
    id: "verifier-agent",
    name: "Verification Agent",
    type: "verifier" as AgentType,
    description: "Performs Online Presence Checks and updates Lead status to verified.",
    icon: "Shield",
  },
  {
    id: "contact-agent",
    name: "Contact Agent",
    type: "contact" as AgentType,
    description: "Extracts and creates Contact records for businesses.",
    icon: "UserSearch",
  },
  {
    id: "caller-agent",
    name: "Caller Agent",
    type: "caller" as AgentType,
    description: "Makes AI-powered calls. Creates Call, CallTranscript, and CallOutcome records.",
    icon: "Phone",
  },
  {
    id: "reporter-agent",
    name: "Reporting Agent",
    type: "reporter" as AgentType,
    description: "Generates Activity Logs and updates Lead status based on outcomes.",
    icon: "BarChart3",
  },
  {
    id: "form-agent",
    name: "Web Form Agent",
    type: "form_agent" as AgentType,
    description: "Submits Web Form Submissions to business contact pages.",
    icon: "FileText",
  },
  {
    id: "nurturer-agent",
    name: "Nurturing Agent",
    type: "nurturer" as AgentType,
    description: "Sends automated email/SMS sequences to nurture leads with weak online presence. Tracks engagement and tags leads.",
    icon: "Mail",
  },
] as const;

// ============================================================
// LEGACY COMPATIBILITY TYPES
// ============================================================
export const leadSourceEnum = businessSourceEnum;
export type LeadSource = BusinessSource;

export type Activity = ActivityLog;
export type InsertActivity = InsertActivityLog;
export const insertActivitySchema = insertActivityLogSchema;
export const activities = activityLogs;

export type CallLog = Call;
export type InsertCallLog = InsertCall;
export const insertCallLogSchema = insertCallSchema;
export const callLogs = calls;

// ============================================================
// EVENT SYSTEM
// ============================================================
export const eventTypeEnum = [
  "BUSINESS_DISCOVERED",
  "ONLINE_PRESENCE_VERIFIED",
  "LEAD_CREATED",
  "CONTACT_ENRICHED",
  "CALL_REQUESTED",
  "CALL_STARTED",
  "CALL_COMPLETED",
  "CALL_TRANSCRIPT_READY",
  "CALL_OUTCOME_RECORDED",
  "MEETING_REQUESTED",
  "WEB_FORM_SUBMITTED",
  "LEAD_STATUS_UPDATED",
  "ACTIVITY_LOGGED",
  "AGENT_ERROR",
  // Nurturing events
  "NURTURING_ENROLLED",
  "NURTURING_MESSAGE_SENT",
  "NURTURING_MESSAGE_FAILED",
  "MESSAGE_ENGAGEMENT_RECEIVED",
  "NURTURING_COMPLETED",
  "LEAD_TAGGED",
  // Approval workflow events
  "CONTENT_APPROVED",
  "CONTENT_REJECTED",
] as const;
export type EventType = typeof eventTypeEnum[number];

export const events = pgTable("events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventId: varchar("event_id").notNull(),
  eventType: text("event_type").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  sourceAgent: varchar("source_agent"),
  correlationId: varchar("correlation_id"),
  payload: jsonb("payload"),
  processed: boolean("processed").default(false),
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  timestamp: true,
}).extend({
  eventType: z.enum(eventTypeEnum),
});

export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;

// Event payload schemas for validation
export const businessDiscoveredPayload = z.object({
  business_id: z.string(),
  business_name: z.string(),
  industry: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  source: z.string(),
  raw_metadata: z.record(z.any()).optional(),
});

export const onlinePresenceVerifiedPayload = z.object({
  business_id: z.string(),
  website_found: z.boolean(),
  domain_checked: z.string().optional(),
  google_business_found: z.boolean(),
  social_presence: z.boolean(),
  confidence_score: z.number(),
});

export const leadCreatedPayload = z.object({
  lead_id: z.string(),
  business_id: z.string(),
  organization_id: z.string().optional(),
  initial_score: z.number().optional(),
});

export const contactEnrichedPayload = z.object({
  contact_id: z.string(),
  business_id: z.string(),
  name: z.string(),
  role: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  is_dnc: z.boolean().optional(),
  verification_level: z.string().optional(),
});

export const callRequestedPayload = z.object({
  lead_id: z.string(),
  contact_id: z.string(),
  priority: z.number().optional(),
  call_script_version: z.string().optional(),
  compliance_flags: z.array(z.string()).optional(),
});

export const callStartedPayload = z.object({
  call_id: z.string(),
  lead_id: z.string(),
  contact_id: z.string(),
  agent_id: z.string(),
  start_time: z.string(),
});

export const callCompletedPayload = z.object({
  call_id: z.string(),
  duration: z.number(),
  call_status: z.string(),
  recording_url: z.string().optional(),
});

export const callTranscriptReadyPayload = z.object({
  call_id: z.string(),
  transcript: z.string(),
  sentiment: z.string().optional(),
  objections_detected: z.array(z.string()).optional(),
  buying_signals_detected: z.array(z.string()).optional(),
});

export const callOutcomeRecordedPayload = z.object({
  call_id: z.string(),
  outcome: z.enum(["interested", "not_interested", "callback"]),
  notes: z.string().optional(),
  next_action: z.string().optional(),
});

export const meetingRequestedPayload = z.object({
  lead_id: z.string(),
  preferred_time: z.string().optional(),
  urgency_level: z.string().optional(),
});

export const webFormSubmittedPayload = z.object({
  lead_id: z.string(),
  endpoint: z.string(),
  submission_status: z.string(),
  response_snapshot: z.record(z.any()).optional(),
});

export const leadStatusUpdatedPayload = z.object({
  lead_id: z.string(),
  previous_status: z.string(),
  new_status: z.string(),
  reason: z.string().optional(),
});

export const activityLoggedPayload = z.object({
  lead_id: z.string().optional(),
  actor_type: z.string(),
  actor_id: z.string(),
  action: z.string(),
  metadata: z.record(z.any()).optional(),
});

export const agentErrorPayload = z.object({
  agent_id: z.string(),
  task_id: z.string().optional(),
  error_type: z.string(),
  error_message: z.string(),
  recoverable: z.boolean(),
});

// ============================================================
// CLIENT (converted leads who are paying customers)
// ============================================================
export const clientStatusEnum = ["active", "inactive", "churned", "prospect"] as const;
export type ClientStatus = typeof clientStatusEnum[number];

export const clients = pgTable("clients", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  businessId: varchar("business_id").notNull(),
  leadId: varchar("lead_id"),
  organizationId: varchar("organization_id"),
  status: text("status").notNull().default("active"),
  monthlyRevenue: integer("monthly_revenue").default(0),
  contractStart: timestamp("contract_start"),
  contractEnd: timestamp("contract_end"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertClientSchema = createInsertSchema(clients).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertClient = z.infer<typeof insertClientSchema>;
export type Client = typeof clients.$inferSelect;

// ============================================================
// CLIENT ASSET (domains, hosting, subscriptions, etc.)
// ============================================================
export const assetTypeEnum = ["domain", "hosting", "subscription", "email", "ssl", "other"] as const;
export type AssetType = typeof assetTypeEnum[number];

export const assetStatusEnum = ["active", "expiring_soon", "expired", "cancelled"] as const;
export type AssetStatus = typeof assetStatusEnum[number];

export const clientAssets = pgTable("client_assets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: varchar("client_id").notNull(),
  type: text("type").notNull(),
  name: text("name").notNull(),
  provider: text("provider"),
  status: text("status").notNull().default("active"),
  cost: integer("cost").default(0),
  billingCycle: text("billing_cycle"),
  renewalDate: timestamp("renewal_date"),
  expiryDate: timestamp("expiry_date"),
  loginUrl: text("login_url"),
  username: text("username"),
  notes: text("notes"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertClientAssetSchema = createInsertSchema(clientAssets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertClientAsset = z.infer<typeof insertClientAssetSchema>;
export type ClientAsset = typeof clientAssets.$inferSelect;

// ============================================================
// CLIENT NOTE / ACTIVITY
// ============================================================
export const clientNotes = pgTable("client_notes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: varchar("client_id").notNull(),
  authorId: varchar("author_id"),
  authorType: text("author_type").default("user"),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertClientNoteSchema = createInsertSchema(clientNotes).omit({
  id: true,
  createdAt: true,
});

export type InsertClientNote = z.infer<typeof insertClientNoteSchema>;
export type ClientNote = typeof clientNotes.$inferSelect;

// ============================================================
// NURTURING SEQUENCE (Automated lead nurturing templates)
// ============================================================
export const nurturingSequenceStatusEnum = ["active", "paused", "draft"] as const;
export type NurturingSequenceStatus = typeof nurturingSequenceStatusEnum[number];

export const nurturingSequences = pgTable("nurturing_sequences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status").notNull().default("draft"),
  triggerEvent: text("trigger_event").notNull(), // e.g., "LEAD_CREATED", "ONLINE_PRESENCE_VERIFIED"
  organizationId: varchar("organization_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertNurturingSequenceSchema = createInsertSchema(nurturingSequences).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertNurturingSequence = z.infer<typeof insertNurturingSequenceSchema>;
export type NurturingSequence = typeof nurturingSequences.$inferSelect;

// ============================================================
// NURTURING STEP (Individual steps in a sequence)
// ============================================================
export const nurturingChannelEnum = ["email", "sms", "both"] as const;
export type NurturingChannel = typeof nurturingChannelEnum[number];

export const nurturingSteps = pgTable("nurturing_steps", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sequenceId: varchar("sequence_id").notNull(),
  stepOrder: integer("step_order").notNull().default(1),
  name: text("name").notNull(),
  channel: text("channel").notNull().default("email"), // email, sms, both
  delayMinutes: integer("delay_minutes").notNull().default(0), // delay from previous step or trigger
  emailSubject: text("email_subject"),
  emailBody: text("email_body"),
  smsBody: text("sms_body"),
  isEngagementCheck: boolean("is_engagement_check").default(false), // whether to check engagement before proceeding
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertNurturingStepSchema = createInsertSchema(nurturingSteps).omit({
  id: true,
  createdAt: true,
});

export type InsertNurturingStep = z.infer<typeof insertNurturingStepSchema>;
export type NurturingStep = typeof nurturingSteps.$inferSelect;

// ============================================================
// LEAD NURTURING ENROLLMENT (Tracks leads in sequences)
// ============================================================
export const enrollmentStatusEnum = ["active", "completed", "paused", "unsubscribed"] as const;
export type EnrollmentStatus = typeof enrollmentStatusEnum[number];

export const leadNurturingEnrollments = pgTable("lead_nurturing_enrollments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  leadId: varchar("lead_id").notNull(),
  sequenceId: varchar("sequence_id").notNull(),
  currentStepId: varchar("current_step_id"),
  status: text("status").notNull().default("active"),
  enrolledAt: timestamp("enrolled_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  pausedAt: timestamp("paused_at"),
});

export const insertLeadNurturingEnrollmentSchema = createInsertSchema(leadNurturingEnrollments).omit({
  id: true,
  enrolledAt: true,
});

export type InsertLeadNurturingEnrollment = z.infer<typeof insertLeadNurturingEnrollmentSchema>;
export type LeadNurturingEnrollment = typeof leadNurturingEnrollments.$inferSelect;

// ============================================================
// SCHEDULED MESSAGE (Messages queued to be sent)
// ============================================================
export const scheduledMessageStatusEnum = ["pending_approval", "approved", "pending", "sent", "failed", "cancelled", "rejected"] as const;
export type ScheduledMessageStatus = typeof scheduledMessageStatusEnum[number];

export const scheduledMessages = pgTable("scheduled_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  enrollmentId: varchar("enrollment_id").notNull(),
  stepId: varchar("step_id").notNull(),
  leadId: varchar("lead_id").notNull(),
  contactId: varchar("contact_id"),
  channel: text("channel").notNull(), // email or sms
  scheduledFor: timestamp("scheduled_for").notNull(),
  status: text("status").notNull().default("pending_approval"),
  subject: text("subject"), // for email
  body: text("body").notNull(),
  sentAt: timestamp("sent_at"),
  errorMessage: text("error_message"),
  // Approval workflow fields
  approvalStatus: text("approval_status").default("pending"), // pending, approved, rejected
  approvedBy: varchar("approved_by"),
  approvedAt: timestamp("approved_at"),
  rejectionReason: text("rejection_reason"),
  // Original content before edits (for comparison)
  originalBody: text("original_body"),
  originalSubject: text("original_subject"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertScheduledMessageSchema = createInsertSchema(scheduledMessages).omit({
  id: true,
  createdAt: true,
});

export type InsertScheduledMessage = z.infer<typeof insertScheduledMessageSchema>;
export type ScheduledMessage = typeof scheduledMessages.$inferSelect;

// ============================================================
// MESSAGE ENGAGEMENT (Tracks opens, clicks, replies)
// ============================================================
export const engagementTypeEnum = ["open", "click", "reply", "unsubscribe", "bounce"] as const;
export type EngagementType = typeof engagementTypeEnum[number];

export const messageEngagements = pgTable("message_engagements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  messageId: varchar("message_id").notNull(),
  leadId: varchar("lead_id").notNull(),
  engagementType: text("engagement_type").notNull(),
  metadata: jsonb("metadata"), // e.g., { linkClicked: "..." }
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertMessageEngagementSchema = createInsertSchema(messageEngagements).omit({
  id: true,
  createdAt: true,
});

export type InsertMessageEngagement = z.infer<typeof insertMessageEngagementSchema>;
export type MessageEngagement = typeof messageEngagements.$inferSelect;

// ============================================================
// LEAD NURTURING TAGS (Behavioral tagging based on engagement)
// ============================================================
export const leadNurturingTags = pgTable("lead_nurturing_tags", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  leadId: varchar("lead_id").notNull(),
  tag: text("tag").notNull(), // e.g., "engaged", "cold", "interested", "hot"
  source: text("source"), // what triggered this tag
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertLeadNurturingTagSchema = createInsertSchema(leadNurturingTags).omit({
  id: true,
  createdAt: true,
});

export type InsertLeadNurturingTag = z.infer<typeof insertLeadNurturingTagSchema>;
export type LeadNurturingTag = typeof leadNurturingTags.$inferSelect;

// ============================================================
// SAMPLE SITES (Mock websites generated for leads)
// ============================================================
export const sampleSiteStatusEnum = ["generating", "pending_approval", "approved", "rejected", "active", "expired", "archived"] as const;
export type SampleSiteStatus = typeof sampleSiteStatusEnum[number];

export const sampleSites = pgTable("sample_sites", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  leadId: varchar("lead_id").notNull(),
  businessId: varchar("business_id").notNull(),
  // URL slug (e.g., "hairsalon808" for edifylimited.tech/sample/hairsalon808)
  slug: varchar("slug").notNull().unique(),
  // Generated site content
  businessName: text("business_name").notNull(),
  tagline: text("tagline"),
  industry: text("industry"),
  heroImageUrl: text("hero_image_url"),
  colorScheme: jsonb("color_scheme"), // { primary: "#...", secondary: "#...", accent: "#..." }
  // Content sections
  aboutText: text("about_text"),
  servicesJson: jsonb("services_json"), // Array of { name, description, price? }
  contactInfo: jsonb("contact_info"), // { phone, email, address, hours }
  testimonials: jsonb("testimonials"), // Array of { name, text, rating }
  galleryImages: jsonb("gallery_images"), // Array of image URLs
  // Features shown
  hasOnlineBooking: boolean("has_online_booking").default(true),
  hasContactForm: boolean("has_contact_form").default(true),
  hasGoogleMap: boolean("has_google_map").default(true),
  hasSocialLinks: boolean("has_social_links").default(true),
  // QR Code
  qrCodeDataUrl: text("qr_code_data_url"), // Base64 encoded QR code image
  // Tracking
  viewCount: integer("view_count").default(0),
  lastViewedAt: timestamp("last_viewed_at"),
  // Status and timestamps
  status: text("status").notNull().default("pending_approval"),
  expiresAt: timestamp("expires_at"), // When the sample site link expires
  // Approval workflow
  approvalStatus: text("approval_status").default("pending"), // pending, approved, rejected
  approvedBy: varchar("approved_by"),
  approvedAt: timestamp("approved_at"),
  rejectionReason: text("rejection_reason"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertSampleSiteSchema = createInsertSchema(sampleSites).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertSampleSite = z.infer<typeof insertSampleSiteSchema>;
export type SampleSite = typeof sampleSites.$inferSelect;

// ============================================================
// APPROVAL EDIT REQUESTS (Chat messages for approval workflow)
// ============================================================
export const approvalItemTypeEnum = ["sample_site", "scheduled_message"] as const;
export type ApprovalItemType = typeof approvalItemTypeEnum[number];

export const approvalEditRequests = pgTable("approval_edit_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  // What item is being edited
  itemType: text("item_type").notNull(), // "sample_site" or "scheduled_message"
  itemId: varchar("item_id").notNull(),
  leadId: varchar("lead_id").notNull(),
  // The edit request/chat message
  role: text("role").notNull(), // "user" or "assistant"
  message: text("message").notNull(),
  // If AI made changes, store them here
  appliedChanges: jsonb("applied_changes"), // { field: "tagline", before: "...", after: "..." }
  // Status
  status: text("status").default("pending"), // pending, applied, rejected
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertApprovalEditRequestSchema = createInsertSchema(approvalEditRequests).omit({
  id: true,
  createdAt: true,
});

export type InsertApprovalEditRequest = z.infer<typeof insertApprovalEditRequestSchema>;
export type ApprovalEditRequest = typeof approvalEditRequests.$inferSelect;

// ============================================================
// APPROVAL QUEUE (Unified queue for items awaiting approval)
// ============================================================
export const approvalQueue = pgTable("approval_queue", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  itemType: text("item_type").notNull(), // "sample_site" or "scheduled_message"
  itemId: varchar("item_id").notNull(),
  leadId: varchar("lead_id").notNull(),
  businessName: text("business_name").notNull(),
  // Preview content for quick review
  previewTitle: text("preview_title"),
  previewContent: text("preview_content"),
  // Status
  status: text("status").notNull().default("pending"), // pending, approved, rejected
  priority: integer("priority").default(0), // Higher = more urgent
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
  reviewedBy: varchar("reviewed_by"),
});

export const insertApprovalQueueSchema = createInsertSchema(approvalQueue).omit({
  id: true,
  createdAt: true,
});

export type InsertApprovalQueue = z.infer<typeof insertApprovalQueueSchema>;
export type ApprovalQueue = typeof approvalQueue.$inferSelect;
