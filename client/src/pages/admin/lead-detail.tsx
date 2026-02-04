import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Building2,
  Globe,
  Phone,
  PhoneCall,
  PhoneOff,
  MapPin,
  Calendar,
  TrendingUp,
  ExternalLink,
  User,
  CheckCircle2,
  AlertCircle,
  Activity,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Lead, Business, Contact, OnlinePresenceCheck, ActivityLog } from "@shared/schema";

type LeadDetail = Lead & {
  business: Business | null;
  contacts: Contact[];
  onlinePresence: OnlinePresenceCheck | null;
};

const statusLabels: Record<string, string> = {
  new: "Discovered",
  verified: "Needs Help",
  contacted: "Contacted",
  qualified: "Qualified",
  closed: "Won",
  archived: "Archived",
};

const statusColors: Record<string, string> = {
  new: "bg-blue-500/10 text-blue-600",
  verified: "bg-amber-500/10 text-amber-600",
  contacted: "bg-purple-500/10 text-purple-600",
  qualified: "bg-emerald-500/10 text-emerald-600",
  closed: "bg-green-500/10 text-green-600",
  archived: "bg-gray-500/10 text-gray-600",
};

export default function LeadDetail() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const { data: lead, isLoading } = useQuery<LeadDetail>({
    queryKey: ["/api/leads", id],
  });

  const { data: activityLogs = [] } = useQuery<ActivityLog[]>({
    queryKey: ["/api/activity-logs"],
    select: (logs) => logs.filter((log) => log.leadId === id).slice(0, 20),
  });

  const updateStatusMutation = useMutation({
    mutationFn: async (newStatus: string) => {
      const response = await apiRequest("PATCH", `/api/leads/${id}`, { status: newStatus });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leads", id] });
      queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
      toast({ title: "Status updated" });
    },
    onError: () => {
      toast({ title: "Failed to update status", variant: "destructive" });
    },
  });

  const { data: vapiStatus } = useQuery<{ configured: boolean; message: string }>({
    queryKey: ["/api/vapi/status"],
  });

  const initiateCallMutation = useMutation({
    mutationFn: async (contactId: string) => {
      const response = await apiRequest("POST", "/api/vapi/call", { leadId: id, contactId });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/leads", id] });
      queryClient.invalidateQueries({ queryKey: ["/api/activity-logs"] });
      toast({ 
        title: "Call initiated", 
        description: `Call ID: ${data.callId}. The AI agent is now calling...` 
      });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Failed to initiate call", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 lg:col-span-2" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Lead not found</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => navigate("/leads")}
              data-testid="button-back-to-leads"
            >
              Back to Leads
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const business = lead.business;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/leads")}
          data-testid="button-back"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold" data-testid="text-lead-name">
            {business?.name || "Unknown Business"}
          </h1>
          <p className="text-muted-foreground">
            {business?.industry || "No industry"} · {business?.city}, {business?.state || "HI"}
          </p>
        </div>
        <Badge className={statusColors[lead.status] || ""}>
          {statusLabels[lead.status] || lead.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Business Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{business?.name || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Industry</p>
                  <p className="font-medium">{business?.industry || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <p className="font-medium">
                      {business?.address || "—"}, {business?.city}, {business?.state} {business?.zip}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Source</p>
                  <Badge variant="outline">{business?.source || "—"}</Badge>
                </div>
              </div>

              <div className="border-t pt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <div className="flex items-center gap-1">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <p className="font-medium">{business?.phone || "Not available"}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Website</p>
                  <div className="flex items-center gap-1">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    {business?.website ? (
                      <a
                        href={business.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-muted-foreground hover:underline flex items-center gap-1"
                      >
                        {business.website.includes("yelp.com") ? "Yelp Only" : "View Site"}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <p className="font-medium">No website</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Online Presence Analysis
              </CardTitle>
              <CardDescription>
                AI-powered verification of the business's digital footprint
              </CardDescription>
            </CardHeader>
            <CardContent>
              {lead.onlinePresence ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <PresenceIndicator
                    label="Website Found"
                    value={lead.onlinePresence.websiteFound}
                  />
                  <PresenceIndicator
                    label="Google Business"
                    value={lead.onlinePresence.googleBusinessFound}
                  />
                  <PresenceIndicator
                    label="Social Media"
                    value={lead.onlinePresence.socialPresence}
                  />
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <p className="text-2xl font-bold">
                      {lead.onlinePresence.confidenceScore}%
                    </p>
                    <p className="text-sm text-muted-foreground">Confidence</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                  <p>No verification data yet</p>
                  <p className="text-sm">Run the Verification Agent to analyze online presence</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Contacts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {lead.contacts && lead.contacts.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lead.contacts.map((contact) => (
                      <TableRow key={contact.id}>
                        <TableCell className="font-medium">{contact.fullName}</TableCell>
                        <TableCell>{contact.role || "—"}</TableCell>
                        <TableCell>{contact.phone || "—"}</TableCell>
                        <TableCell>{contact.email || "—"}</TableCell>
                        <TableCell>
                          {contact.isDnc ? (
                            <Badge variant="destructive">DNC</Badge>
                          ) : contact.verified ? (
                            <Badge className="bg-green-500/10 text-green-600">Verified</Badge>
                          ) : (
                            <Badge variant="outline">Unverified</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {contact.phone && !contact.isDnc ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => initiateCallMutation.mutate(contact.id)}
                              disabled={!vapiStatus?.configured || initiateCallMutation.isPending}
                              data-testid={`button-call-${contact.id}`}
                            >
                              {initiateCallMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <PhoneCall className="h-4 w-4 mr-1" />
                                  Call
                                </>
                              )}
                            </Button>
                          ) : contact.isDnc ? (
                            <span className="flex items-center text-sm text-muted-foreground gap-1">
                              <PhoneOff className="h-4 w-4" />
                              DNC
                            </span>
                          ) : (
                            <span className="text-sm text-muted-foreground">No phone</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <User className="h-8 w-8 mx-auto mb-2" />
                  <p>No contacts yet</p>
                  <p className="text-sm">Run the Contact Agent to extract contact information</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Lead Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">{lead.score || 0}</div>
                <p className="text-sm text-muted-foreground">out of 100</p>
              </div>
              <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${lead.score || 0}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pipeline Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={lead.status}
                onValueChange={(value) => updateStatusMutation.mutate(value)}
              >
                <SelectTrigger data-testid="select-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">Discovered</SelectItem>
                  <SelectItem value="verified">Needs Help</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="closed">Won</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground mt-2">
                Created: {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : "—"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activityLogs.length > 0 ? (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {activityLogs.map((log) => (
                    <div key={log.id} className="text-sm border-b pb-2 last:border-0">
                      <p className="font-medium capitalize">
                        {log.action.replace(/_/g, " ")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {log.actorType} · {log.createdAt ? new Date(log.createdAt).toLocaleString() : "—"}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No activity recorded
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function PresenceIndicator({ label, value }: { label: string; value: boolean | null }) {
  return (
    <div className="text-center p-3 rounded-lg bg-muted/50">
      {value ? (
        <CheckCircle2 className="h-6 w-6 mx-auto text-green-500 mb-1" />
      ) : (
        <AlertCircle className="h-6 w-6 mx-auto text-amber-500 mb-1" />
      )}
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
