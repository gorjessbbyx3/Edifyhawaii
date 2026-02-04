import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Phone,
  Target,
  Activity,
  Globe,
  Eye,
} from "lucide-react";
import type { Lead, CallLog } from "@shared/schema";
import { pipelineStages } from "@shared/schema";

const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#a855f7", "#ec4899", "#10b981", "#ef4444"];

function StatCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative";
  icon: React.ElementType;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {change && (
              <div className="flex items-center gap-1 mt-1">
                {changeType === "positive" ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                )}
                <span
                  className={`text-xs ${
                    changeType === "positive" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {change}
                </span>
              </div>
            )}
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Analytics() {
  const { data: leads, isLoading: leadsLoading } = useQuery<Lead[]>({
    queryKey: ["/api/leads"],
  });

  const { data: callLogs } = useQuery<CallLog[]>({
    queryKey: ["/api/call-logs"],
  });

  const { data: pageViews } = useQuery<{ path: string; count: number }[]>({
    queryKey: ["/api/analytics/page-views"],
  });

  const pipelineData = pipelineStages.map((stage, index) => ({
    name: stage.label,
    value: leads?.filter((l) => l.status === stage.id).length || 0,
    color: COLORS[index % COLORS.length],
  }));

  const sourceData = leads
    ? Object.entries(
        leads.reduce((acc, lead) => {
          const source = lead.source || "manual";
          acc[source] = (acc[source] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      ).map(([name, value]) => ({
        name: name.replace(/_/g, " "),
        value,
      }))
    : [];

  const callOutcomeData = callLogs
    ? Object.entries(
        callLogs.reduce((acc, log) => {
          const outcome = log.outcome || "unknown";
          acc[outcome] = (acc[outcome] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      ).map(([name, value], index) => ({
        name: name.replace(/_/g, " "),
        value,
        color: COLORS[index % COLORS.length],
      }))
    : [];

  const weeklyData = [
    { day: "Mon", leads: 12, calls: 8, conversions: 2 },
    { day: "Tue", leads: 19, calls: 12, conversions: 4 },
    { day: "Wed", leads: 15, calls: 10, conversions: 3 },
    { day: "Thu", leads: 22, calls: 15, conversions: 5 },
    { day: "Fri", leads: 18, calls: 14, conversions: 4 },
    { day: "Sat", leads: 8, calls: 5, conversions: 1 },
    { day: "Sun", leads: 5, calls: 3, conversions: 1 },
  ];

  const totalLeads = leads?.length || 0;
  const qualifiedLeads = leads?.filter((l) => l.status === "qualified").length || 0;
  const wonLeads = leads?.filter((l) => l.status === "won").length || 0;
  const conversionRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0;
  const totalCalls = callLogs?.length || 0;
  const avgCallDuration = callLogs?.length
    ? Math.round(callLogs.reduce((sum, c) => sum + (c.duration || 0), 0) / callLogs.length)
    : 0;

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold" data-testid="text-analytics-title">Analytics</h1>
        <p className="text-muted-foreground">
          Track your CRM performance and agent effectiveness
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {leadsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <StatCard
              title="Total Leads"
              value={totalLeads}
              change="+12% this week"
              changeType="positive"
              icon={Users}
            />
            <StatCard
              title="Conversion Rate"
              value={`${conversionRate}%`}
              change="+2.5% this week"
              changeType="positive"
              icon={Target}
            />
            <StatCard
              title="Total Calls"
              value={totalCalls}
              change="+18 this week"
              changeType="positive"
              icon={Phone}
            />
            <StatCard
              title="Avg Call Duration"
              value={`${avgCallDuration}s`}
              change="+15s"
              changeType="positive"
              icon={Activity}
            />
          </>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
            <CardDescription>Leads, calls, and conversions over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="day" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="leads"
                    stackId="1"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="calls"
                    stackId="2"
                    stroke="#22c55e"
                    fill="#22c55e"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="conversions"
                    stackId="3"
                    stroke="#a855f7"
                    fill="#a855f7"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pipeline Distribution</CardTitle>
            <CardDescription>Leads by sales stage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pipelineData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, value }) => (value > 0 ? `${name}: ${value}` : "")}
                  >
                    {pipelineData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Lead Sources</CardTitle>
            <CardDescription>Where your leads are coming from</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sourceData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" className="text-xs" />
                  <YAxis dataKey="name" type="category" width={100} className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                    }}
                  />
                  <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Page Views</CardTitle>
                <CardDescription>Website analytics from Edify API</CardDescription>
              </div>
              <Badge variant="secondary">
                <Globe className="mr-1 h-3 w-3" />
                External
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {pageViews && pageViews.length > 0 ? (
              <div className="space-y-4">
                {pageViews.slice(0, 6).map((view, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{view.path}</span>
                    </div>
                    <Badge variant="outline">{view.count} views</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Globe className="h-12 w-12 text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">
                  No page view data available. Sync with external CRM to see analytics.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {callOutcomeData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Call Outcomes</CardTitle>
            <CardDescription>Results from AI Voice Agent calls</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={callOutcomeData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                    }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {callOutcomeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
