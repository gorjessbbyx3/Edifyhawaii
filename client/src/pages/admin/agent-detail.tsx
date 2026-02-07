import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Bot,
  Globe,
  Shield,
  UserSearch,
  Phone,
  BarChart3,
  FileText,
  Play,
  ArrowLeft,
  Activity,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building2,
  RefreshCw,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Agent, ActivityLog, Lead, Business } from "@shared/schema";
import { agentDefinitions } from "@shared/schema";

const iconMap: Record<string, React.ElementType> = {
  Globe,
  Shield,
  UserSearch,
  Phone,
  BarChart3,
  FileText,
};

type EnrichedLog = ActivityLog & { lead?: (Lead & { business?: Business | null }) | null };

function formatDate(date: Date | string | null) {
  if (!date) return "N/A";
  const d = new Date(date);
  return d.toLocaleString();
}

function ActionBadge({ action }: { action: string }) {
  const colorMap: Record<string, string> = {
    business_discovered: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    online_presence_checked: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    contact_extracted: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    call_initiated: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    lead_status_changed: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400",
  };

  const label = action.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  
  return (
    <Badge className={`${colorMap[action] || "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"} border-0`}>
      {label}
    </Badge>
  );
}

export default function AgentDetail() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const definition = agentDefinitions.find(d => d.id === id);
  const Icon = definition ? iconMap[definition.icon] || Bot : Bot;

  const { data: agents, isLoading: agentsLoading } = useQuery<Agent[]>({
    queryKey: ["/api/agents"],
  });

  const agentDbId = agents?.find(a => a.type === definition?.type)?.id;

  const { data: logs, isLoading: logsLoading, refetch: refetchLogs } = useQuery<ActivityLog[]>({
    queryKey: ["/api/agents", agentDbId, "logs"],
    queryFn: async () => {
      if (!agentDbId) return [];
      const response = await fetch(`/api/agents/${agentDbId}/logs`);
      if (!response.ok) throw new Error("Failed to fetch logs");
      return response.json();
    },
    enabled: !!agentDbId,
  });

  const { data: allLeads } = useQuery<(Lead & { business: Business | null })[]>({
    queryKey: ["/api/leads"],
  });

  const agent = agents?.find(a => a.type === definition?.type);

  const toggleAgentMutation = useMutation({
    mutationFn: async ({ status }: { status: string }) => {
      if (!agent) throw new Error("Agent not found");
      const response = await apiRequest("PATCH", `/api/agents/${agent.id}`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/agents"] });
      toast({
        title: "Agent status updated",
        description: "The agent status has been changed.",
      });
    },
  });

  const runAgentMutation = useMutation({
    mutationFn: async () => {
      if (!agent) throw new Error("Agent not found");
      const response = await apiRequest("POST", `/api/agents/${agent.id}/run`, {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/agents"] });
      queryClient.invalidateQueries({ queryKey: ["/api/agents", agent?.id, "logs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
      toast({
        title: "Agent task completed",
        description: "The agent has finished processing.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Agent task failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (!definition) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold">Agent not found</h2>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/agents")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Agents
        </Button>
      </div>
    );
  }

  const isActive = agent?.status === "active";
  const statusColors = {
    active: "bg-green-500",
    paused: "bg-gray-400",
    error: "bg-red-500",
  };

  const enrichedLogs: EnrichedLog[] = (logs || []).map(log => {
    const lead = allLeads?.find(l => l.id === log.leadId);
    return { ...log, lead };
  }).sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });

  const businessesDiscovered = enrichedLogs.filter(l => l.action === "business_discovered").length;
  const leadsProcessed = new Set(enrichedLogs.map(l => l.leadId).filter(Boolean)).size;

  return (
    <div className="flex flex-col gap-6 p-6" data-testid="agent-detail-page">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/agents")} data-testid="button-back">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{definition.name}</h1>
          <p className="text-muted-foreground">{definition.description}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span
              className={`h-3 w-3 rounded-full ${statusColors[agent?.status as keyof typeof statusColors] || "bg-gray-400"}`}
            />
            <span className="text-sm font-medium capitalize">{agent?.status || "Paused"}</span>
          </div>
          <Switch
            checked={isActive}
            onCheckedChange={(checked) => toggleAgentMutation.mutate({ status: checked ? "active" : "paused" })}
            data-testid="switch-agent-status"
          />
          <Button
            onClick={() => runAgentMutation.mutate()}
            disabled={!isActive || runAgentMutation.isPending}
            data-testid="button-run-agent"
          >
            {runAgentMutation.isPending ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Play className="mr-2 h-4 w-4" />
            )}
            Run Now
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold capitalize">{definition.type}</p>
                <p className="text-sm text-muted-foreground">Agent Type</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-green-100 dark:bg-green-900/30">
                <Building2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{businessesDiscovered}</p>
                <p className="text-sm text-muted-foreground">Businesses Found</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-100 dark:bg-blue-900/30">
                <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{enrichedLogs.length}</p>
                <p className="text-sm text-muted-foreground">Total Actions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-purple-100 dark:bg-purple-900/30">
                <CheckCircle2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{leadsProcessed}</p>
                <p className="text-sm text-muted-foreground">Leads Processed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="logs" className="flex-1">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="logs" data-testid="tab-logs">Activity Log</TabsTrigger>
            <TabsTrigger value="config" data-testid="tab-config">Configuration</TabsTrigger>
          </TabsList>
          <Button variant="outline" size="sm" onClick={() => refetchLogs()} data-testid="button-refresh-logs">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>

        <TabsContent value="logs" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
              <CardDescription>All actions performed by this agent</CardDescription>
            </CardHeader>
            <CardContent>
              {logsLoading ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : enrichedLogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Activity className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium">No activity yet</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Run this agent to start processing
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Business</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {enrichedLogs.map((log) => (
                      <TableRow key={log.id} data-testid={`log-row-${log.id}`}>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(log.createdAt)}
                        </TableCell>
                        <TableCell>
                          <ActionBadge action={log.action} />
                        </TableCell>
                        <TableCell>
                          {log.lead?.business?.name || (log.metadata as any)?.businessName || "-"}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                          {log.metadata ? JSON.stringify(log.metadata) : "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Agent Configuration</CardTitle>
              <CardDescription>Settings and parameters for this agent</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Version</h4>
                  <p className="text-sm text-muted-foreground">{agent?.version || "1.0.0"}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Type</h4>
                  <p className="text-sm text-muted-foreground capitalize">{definition.type}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Data Sources</h4>
                  <p className="text-sm text-muted-foreground">
                    {definition.type === "crawler" ? "Google Places API, Yelp Fusion API" : "Internal CRM Data"}
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Status</h4>
                  <Badge variant={isActive ? "default" : "secondary"}>
                    {agent?.status || "Paused"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
