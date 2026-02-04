import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Bot,
  Globe,
  Shield,
  UserSearch,
  Phone,
  BarChart3,
  FileText,
  Play,
  Pause,
  Settings,
  Activity,
  Clock,
  CheckCircle2,
  AlertCircle,
  Zap,
  RefreshCw,
  Eye,
} from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Agent } from "@shared/schema";
import { agentDefinitions } from "@shared/schema";

const iconMap: Record<string, React.ElementType> = {
  Globe,
  Shield,
  UserSearch,
  Phone,
  BarChart3,
  FileText,
};

function AgentCard({
  agent,
  definition,
  onToggle,
  onRun,
}: {
  agent?: Agent;
  definition: typeof agentDefinitions[number];
  onToggle: (agentId: string, status: string) => void;
  onRun: (agentId: string) => void;
}) {
  const Icon = iconMap[definition.icon] || Bot;
  const isActive = agent?.status === "active";
  const isPaused = agent?.status === "paused";

  const statusColors = {
    active: "bg-green-500",
    paused: "bg-gray-400",
    error: "bg-red-500",
  };

  const statusLabels = {
    active: "Active",
    paused: "Paused",
    error: "Error",
  };

  return (
    <Card className="flex flex-col" data-testid={`agent-card-${definition.id}`}>
      <CardHeader className="flex flex-row items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">{definition.name}</CardTitle>
            <div className="flex items-center gap-1.5">
              <span
                className={`h-2 w-2 rounded-full ${statusColors[agent?.status as keyof typeof statusColors] || "bg-gray-400"}`}
              />
              <span className="text-xs text-muted-foreground">
                {statusLabels[agent?.status as keyof typeof statusLabels] || "Offline"}
              </span>
            </div>
          </div>
          <CardDescription className="mt-1 line-clamp-2">
            {definition.description}
          </CardDescription>
        </div>
        <Switch
          checked={isActive}
          onCheckedChange={(checked) =>
            onToggle(definition.id, checked ? "active" : "paused")
          }
          disabled={false}
          data-testid={`switch-agent-${definition.id}`}
        />
      </CardHeader>
      <CardContent className="flex-1">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Type</span>
            <span className="text-sm font-medium capitalize">{agent?.type || definition.type}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Version</span>
            <span className="text-sm font-medium">{agent?.version || "1.0.0"}</span>
          </div>
        </div>
        {isActive && (
          <div className="mt-4 rounded-md bg-muted p-3">
            <div className="flex items-center gap-2 text-sm">
              <Activity className="h-4 w-4 animate-pulse text-primary" />
              <span className="text-muted-foreground">Running tasks...</span>
            </div>
          </div>
        )}
        {isPaused && (
          <div className="mt-4 rounded-md bg-muted/50 p-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Paused - ready to activate</span>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onRun(definition.id)}
          disabled={!isActive}
          data-testid={`button-run-${definition.id}`}
        >
          <Play className="mr-2 h-4 w-4" />
          Run Task
        </Button>
        <Link href={`/agents/${definition.id}`}>
          <Button variant="ghost" size="icon" data-testid={`button-view-${definition.id}`}>
            <Eye className="h-4 w-4" />
          </Button>
        </Link>
        <Button variant="ghost" size="icon" data-testid={`button-settings-${definition.id}`}>
          <Settings className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}

function AgentStats({ agents }: { agents: Agent[] }) {
  const activeCount = agents.filter((a) => a.status === "active").length;
  const pausedCount = agents.filter((a) => a.status === "paused").length;
  const errorCount = agents.filter((a) => a.status === "error").length;
  const totalAgents = agents.length;

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-green-100 dark:bg-green-900/30">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{activeCount}</p>
              <p className="text-sm text-muted-foreground">Active Agents</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-100 dark:bg-gray-900/30">
              <Pause className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pausedCount}</p>
              <p className="text-sm text-muted-foreground">Paused</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-red-100 dark:bg-red-900/30">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{errorCount}</p>
              <p className="text-sm text-muted-foreground">Errors</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-100 dark:bg-blue-900/30">
              <Bot className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalAgents}</p>
              <p className="text-sm text-muted-foreground">Total Agents</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Agents() {
  const { toast } = useToast();

  const { data: agents, isLoading } = useQuery<Agent[]>({
    queryKey: ["/api/agents"],
  });

  const toggleAgentMutation = useMutation({
    mutationFn: async ({ agentId, status }: { agentId: string; status: string }) => {
      const response = await apiRequest("PATCH", `/api/agents/${agentId}`, { status });
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
    mutationFn: async (agentId: string) => {
      const response = await apiRequest("POST", `/api/agents/${agentId}/run`, {});
      return response.json();
    },
    onSuccess: (_, agentId) => {
      queryClient.invalidateQueries({ queryKey: ["/api/agents"] });
      toast({
        title: "Agent started",
        description: `The agent is now processing leads.`,
      });
    },
    onError: () => {
      toast({
        title: "Failed to start agent",
        description: "Please try again or check the agent configuration.",
        variant: "destructive",
      });
    },
  });

  const handleToggle = (agentId: string, status: string) => {
    toggleAgentMutation.mutate({ agentId, status });
  };

  const handleRun = (agentId: string) => {
    runAgentMutation.mutate(agentId);
  };

  const agentMap = new Map(agents?.map((a) => [a.id, a]) || []);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold" data-testid="text-agents-title">AI Agents</h1>
        <p className="text-muted-foreground">
          Manage your autonomous AI agents for lead discovery, verification, and outreach
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <AgentStats agents={agents || []} />
      )}

      <div>
        <h2 className="text-lg font-semibold mb-4">Agent Fleet</h2>
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <Skeleton className="h-4 w-3/4 mt-2" />
                  <Skeleton className="h-3 w-full mt-1" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {agentDefinitions.map((definition) => (
              <AgentCard
                key={definition.id}
                definition={definition}
                agent={agentMap.get(definition.id)}
                onToggle={handleToggle}
                onRun={handleRun}
              />
            ))}
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Agent Communication Log</CardTitle>
          <CardDescription>
            Real-time inter-agent messages and coordination
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Bot className="h-12 w-12 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">
              Agent communication logs will appear here when agents are active
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
