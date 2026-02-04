import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  Activity, 
  Zap, 
  Phone, 
  Globe, 
  UserSearch, 
  FileText, 
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Filter,
} from "lucide-react";
import type { Event } from "@shared/schema";
import { eventTypeEnum } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";

const eventIcons: Record<string, any> = {
  BUSINESS_DISCOVERED: Globe,
  ONLINE_PRESENCE_VERIFIED: Globe,
  LEAD_CREATED: Zap,
  CONTACT_ENRICHED: UserSearch,
  CALL_REQUESTED: Phone,
  CALL_STARTED: Phone,
  CALL_COMPLETED: Phone,
  CALL_TRANSCRIPT_READY: FileText,
  CALL_OUTCOME_RECORDED: FileText,
  MEETING_REQUESTED: Activity,
  WEB_FORM_SUBMITTED: FileText,
  LEAD_STATUS_UPDATED: ArrowRight,
  ACTIVITY_LOGGED: Activity,
  AGENT_ERROR: AlertCircle,
};

const eventColors: Record<string, string> = {
  BUSINESS_DISCOVERED: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  ONLINE_PRESENCE_VERIFIED: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400",
  LEAD_CREATED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  CONTACT_ENRICHED: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  CALL_REQUESTED: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  CALL_STARTED: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  CALL_COMPLETED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  CALL_TRANSCRIPT_READY: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
  CALL_OUTCOME_RECORDED: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400",
  MEETING_REQUESTED: "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400",
  WEB_FORM_SUBMITTED: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400",
  LEAD_STATUS_UPDATED: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  ACTIVITY_LOGGED: "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400",
  AGENT_ERROR: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

function EventCard({ event }: { event: Event }) {
  const Icon = eventIcons[event.eventType] || Activity;
  const colorClass = eventColors[event.eventType] || "bg-gray-100 text-gray-800";
  
  const formatTime = (date: Date | string | null) => {
    if (!date) return "Unknown";
    const d = new Date(date);
    return d.toLocaleTimeString("en-US", { 
      hour: "2-digit", 
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatEventType = (type: string) => {
    return type.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  };

  return (
    <div 
      className="flex items-start gap-3 p-3 rounded-md border bg-card hover-elevate"
      data-testid={`event-${event.id}`}
    >
      <div className={`flex h-8 w-8 items-center justify-center rounded-md ${colorClass}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-sm">{formatEventType(event.eventType)}</span>
          {event.sourceAgent && (
            <Badge variant="outline" className="text-xs">
              {event.sourceAgent}
            </Badge>
          )}
          {event.processed && (
            <Badge variant="secondary" className="text-xs">Processed</Badge>
          )}
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          {formatTime(event.timestamp)}
          {event.correlationId && (
            <span className="ml-2 opacity-50">
              ID: {event.correlationId.slice(0, 8)}...
            </span>
          )}
        </div>
        {event.payload != null && (
          <div className="mt-2 text-xs bg-muted p-2 rounded overflow-x-auto">
            <pre className="whitespace-pre-wrap break-all">
              {(() => {
                try {
                  return JSON.stringify(event.payload, null, 2);
                } catch {
                  return String(event.payload);
                }
              })()}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

function EventStats({ events }: { events: Event[] }) {
  const byType: Record<string, number> = {};
  for (const event of events) {
    byType[event.eventType] = (byType[event.eventType] || 0) + 1;
  }
  
  const topTypes = Object.entries(byType)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{events.length}</p>
              <p className="text-sm text-muted-foreground">Total Events</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-green-100 dark:bg-green-900/30">
              <Activity className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{events.filter(e => e.processed).length}</p>
              <p className="text-sm text-muted-foreground">Processed</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-yellow-100 dark:bg-yellow-900/30">
              <RefreshCw className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{events.filter(e => !e.processed).length}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
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
              <p className="text-2xl font-bold">{events.filter(e => e.eventType === "AGENT_ERROR").length}</p>
              <p className="text-sm text-muted-foreground">Errors</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Events() {
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("");

  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
    refetchInterval: 5000,
  });

  const filteredEvents = useMemo(() => {
    if (!events) return [];
    return events.filter((event) => {
      if (typeFilter !== "all" && event.eventType !== typeFilter) return false;
      if (sourceFilter && event.sourceAgent && !event.sourceAgent.toLowerCase().includes(sourceFilter.toLowerCase())) return false;
      return true;
    });
  }, [events, typeFilter, sourceFilter]);

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/events"] });
  };

  const handleClearFilters = () => {
    setTypeFilter("all");
    setSourceFilter("");
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" data-testid="page-title">Event Stream</h1>
          <p className="text-muted-foreground">Real-time pub/sub event monitoring</p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleRefresh}
          data-testid="button-refresh-events"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <EventStats events={events || []} />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <CardTitle>Event Log</CardTitle>
              <CardDescription>
                Events are emitted by agents and processed in real-time
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[200px]" data-testid="select-event-type">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Event Types</SelectItem>
                  {eventTypeEnum.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Filter by source..."
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="w-[160px]"
                data-testid="input-source-filter"
              />
              {(typeFilter !== "all" || sourceFilter) && (
                <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                  Clear
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredEvents.length !== (events?.length || 0) && (
            <div className="mb-3 text-sm text-muted-foreground">
              Showing {filteredEvents.length} of {events?.length || 0} events
            </div>
          )}
          <ScrollArea className="h-[500px]">
            {filteredEvents.length > 0 ? (
              <div className="space-y-2">
                {filteredEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : events && events.length > 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <Filter className="h-12 w-12 mb-4 opacity-50" />
                <p className="text-lg font-medium">No matching events</p>
                <p className="text-sm">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <Activity className="h-12 w-12 mb-4 opacity-50" />
                <p className="text-lg font-medium">No events yet</p>
                <p className="text-sm">Events will appear here as agents process tasks</p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
