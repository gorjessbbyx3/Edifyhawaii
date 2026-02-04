import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  TrendingUp,
  Phone,
  Target,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Bot,
  Clock,
  CheckCircle2,
  AlertCircle,
  Zap,
} from "lucide-react";
import { Link } from "wouter";
import type { Lead, Agent, ActivityLog } from "@shared/schema";
import { agentDefinitions, pipelineStages } from "@shared/schema";

function StatCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  description,
}: {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: React.ElementType;
  description?: string;
}) {
  return (
    <Card data-testid={`stat-card-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold">{value}</span>
          {change && (
            <span
              className={`flex items-center text-xs font-medium ${
                changeType === "positive"
                  ? "text-green-600 dark:text-green-400"
                  : changeType === "negative"
                  ? "text-red-600 dark:text-red-400"
                  : "text-muted-foreground"
              }`}
            >
              {changeType === "positive" ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : changeType === "negative" ? (
                <ArrowDownRight className="h-3 w-3" />
              ) : null}
              {change}
            </span>
          )}
        </div>
        {description && (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

function AgentStatusCard({ agent }: { agent: Agent }) {
  const statusColors = {
    active: "bg-green-500",
    paused: "bg-gray-400",
    error: "bg-red-500",
  };

  return (
    <div
      className="flex items-center gap-3 rounded-md border bg-card p-3 hover-elevate"
      data-testid={`agent-status-${agent.id}`}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
        <Bot className="h-5 w-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm truncate">{agent.name}</span>
          <span
            className={`h-2 w-2 rounded-full ${statusColors[agent.status as keyof typeof statusColors] || statusColors.paused}`}
          />
        </div>
        <p className="text-xs text-muted-foreground truncate">
          {agent.status === "active" ? "Running" : "Idle"}
        </p>
      </div>
      <div className="text-right">
        <div className="text-sm font-medium capitalize">{agent.status}</div>
        <div className="text-xs text-muted-foreground">v{agent.version}</div>
      </div>
    </div>
  );
}

function PipelineCard({
  stage,
  count,
  total,
}: {
  stage: typeof pipelineStages[number];
  count: number;
  total: number;
}) {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  const stageColors: Record<string, string> = {
    blue: "bg-blue-500",
    yellow: "bg-yellow-500",
    purple: "bg-purple-500",
    orange: "bg-orange-500",
    pink: "bg-pink-500",
    green: "bg-green-500",
    red: "bg-red-500",
  };

  return (
    <div className="flex flex-col gap-2" data-testid={`pipeline-stage-${stage.id}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{stage.label}</span>
        <Badge variant="secondary" className="text-xs">
          {count}
        </Badge>
      </div>
      <Progress value={percentage} className={`h-2 ${stageColors[stage.color]}`} />
    </div>
  );
}

function RecentActivityItem({ activity }: { activity: ActivityLog }) {
  const typeIcons: Record<string, React.ElementType> = {
    lead_created: Users,
    business_created: Users,
    call_made: Phone,
    lead_status_changed: Activity,
    agent_task_started: Bot,
    agent_task_completed: Bot,
    contact_created: Users,
  };
  const Icon = typeIcons[activity.action] || Activity;

  const getDescription = () => {
    const meta = activity.metadata as Record<string, unknown> | null;
    switch (activity.action) {
      case "business_discovered":
        return `Discovered business: ${meta?.businessName || "Unknown"}`;
      case "business_created":
        return `Business created: ${meta?.businessName || "Unknown"}`;
      case "lead_created":
        return `New lead created`;
      case "lead_status_changed":
        return `Lead status: ${meta?.oldStatus} → ${meta?.newStatus}`;
      case "contact_created":
        return `Contact created: ${meta?.contactName || "Unknown"}`;
      case "agent_task_started":
        return `Agent task started: ${meta?.taskType || "Unknown"}`;
      case "agent_task_completed":
        return `Agent task completed`;
      case "online_presence_checked":
        return `Online presence verified (score: ${meta?.score || 0})`;
      case "contact_extracted":
        return `Contact extracted: ${meta?.contactName || "Unknown"}`;
      default:
        return activity.action.replace(/_/g, " ");
    }
  };

  return (
    <div className="flex items-start gap-3 py-3 border-b last:border-0">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm">{getDescription()}</p>
        <p className="text-xs text-muted-foreground">
          {activity.createdAt
            ? new Date(activity.createdAt).toLocaleString()
            : "Just now"}
        </p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { data: leads, isLoading: leadsLoading } = useQuery<Lead[]>({
    queryKey: ["/api/leads"],
  });

  const { data: agents, isLoading: agentsLoading } = useQuery<Agent[]>({
    queryKey: ["/api/agents"],
  });

  const { data: activities, isLoading: activitiesLoading } = useQuery<ActivityLog[]>({
    queryKey: ["/api/activity-logs"],
  });

  const { data: analytics } = useQuery<{
    totalLeads: number;
    newLeadsToday: number;
    qualifiedLeads: number;
    closedLeads: number;
    conversionRate: number;
    callsMade: number;
  }>({
    queryKey: ["/api/analytics/summary"],
  });

  const pipelineCounts = pipelineStages.map((stage) => ({
    stage,
    count: leads?.filter((l) => l.status === stage.id).length || 0,
  }));

  const totalLeads = leads?.length || 0;

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold" data-testid="text-dashboard-title">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back. Here's an overview of your CRM performance.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {leadsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <StatCard
              title="Total Leads"
              value={analytics?.totalLeads || totalLeads}
              change="+12%"
              changeType="positive"
              icon={Users}
              description="All time leads in system"
            />
            <StatCard
              title="Qualified Leads"
              value={analytics?.qualifiedLeads || leads?.filter((l) => l.status === "qualified").length || 0}
              change="+8%"
              changeType="positive"
              icon={Target}
              description="Ready for outreach"
            />
            <StatCard
              title="Conversion Rate"
              value={`${analytics?.conversionRate || 0}%`}
              change="+2.5%"
              changeType="positive"
              icon={TrendingUp}
              description="Lead to customer"
            />
            <StatCard
              title="Calls Made"
              value={analytics?.callsMade || 0}
              change="+15"
              changeType="positive"
              icon={Phone}
              description="By AI Voice Agent"
            />
          </>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <div>
              <CardTitle>Lead Pipeline</CardTitle>
              <CardDescription>Track leads through your sales funnel</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/leads" data-testid="link-view-all-leads">
                View All
                <ArrowUpRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {leadsLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {pipelineCounts.slice(0, 5).map(({ stage, count }) => (
                  <PipelineCard
                    key={stage.id}
                    stage={stage}
                    count={count}
                    total={totalLeads}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <div>
              <CardTitle>AI Agents</CardTitle>
              <CardDescription>Active automation status</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/agents" data-testid="link-view-all-agents">
                Manage
                <ArrowUpRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {agentsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : agents && agents.length > 0 ? (
              <div className="space-y-3">
                {agents.slice(0, 4).map((agent) => (
                  <AgentStatusCard key={agent.id} agent={agent} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Bot className="h-12 w-12 text-muted-foreground/50 mb-3" />
                <p className="text-sm text-muted-foreground">No agents configured</p>
                <Button variant="outline" size="sm" className="mt-3" asChild>
                  <Link href="/agents">Configure Agents</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            {activitiesLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : activities && activities.length > 0 ? (
              <div className="max-h-[300px] overflow-y-auto">
                {activities.slice(0, 10).map((activity) => (
                  <RecentActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Activity className="h-12 w-12 text-muted-foreground/50 mb-3" />
                <p className="text-sm text-muted-foreground">No recent activity</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              <Button variant="outline" className="justify-start h-auto py-3" asChild>
                <Link href="/leads" data-testid="button-add-lead">
                  <Users className="mr-2 h-4 w-4" />
                  <div className="flex flex-col items-start">
                    <span>Add Lead</span>
                    <span className="text-xs text-muted-foreground font-normal">Create new lead manually</span>
                  </div>
                </Link>
              </Button>
              <Button variant="outline" className="justify-start h-auto py-3" asChild>
                <Link href="/agents" data-testid="button-run-crawler">
                  <Bot className="mr-2 h-4 w-4" />
                  <div className="flex flex-col items-start">
                    <span>Run Crawler</span>
                    <span className="text-xs text-muted-foreground font-normal">Discover new leads</span>
                  </div>
                </Link>
              </Button>
              <Button variant="outline" className="justify-start h-auto py-3" asChild>
                <Link href="/external" data-testid="button-sync-crm">
                  <Zap className="mr-2 h-4 w-4" />
                  <div className="flex flex-col items-start">
                    <span>Sync CRM</span>
                    <span className="text-xs text-muted-foreground font-normal">Import from Edify API</span>
                  </div>
                </Link>
              </Button>
              <Button variant="outline" className="justify-start h-auto py-3" asChild>
                <Link href="/analytics" data-testid="button-view-reports">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  <div className="flex flex-col items-start">
                    <span>View Reports</span>
                    <span className="text-xs text-muted-foreground font-normal">Analytics dashboard</span>
                  </div>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
