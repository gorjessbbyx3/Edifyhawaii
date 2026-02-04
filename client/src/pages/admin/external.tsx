import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Database,
  RefreshCw,
  Users,
  MessageSquare,
  BarChart3,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  Download,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { ExternalContact, ExternalConversation } from "@shared/schema";

function SyncStatus({ lastSync }: { lastSync?: Date }) {
  if (!lastSync) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Clock className="h-4 w-4" />
        <span className="text-sm">Never synced</span>
      </div>
    );
  }

  const now = new Date();
  const diffMs = now.getTime() - new Date(lastSync).getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 5) {
    return (
      <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
        <CheckCircle2 className="h-4 w-4" />
        <span className="text-sm">Just synced</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <Clock className="h-4 w-4" />
      <span className="text-sm">
        Synced {diffMins < 60 ? `${diffMins}m ago` : `${Math.floor(diffMins / 60)}h ago`}
      </span>
    </div>
  );
}

export default function External() {
  const { toast } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);

  const { data: contacts, isLoading: contactsLoading } = useQuery<ExternalContact[]>({
    queryKey: ["/api/external/contacts"],
  });

  const { data: conversations, isLoading: conversationsLoading } = useQuery<ExternalConversation[]>({
    queryKey: ["/api/external/conversations"],
  });

  const { data: pageViewStats } = useQuery<{ path: string; count: number }[]>({
    queryKey: ["/api/external/analytics/stats"],
  });

  const syncMutation = useMutation({
    mutationFn: async () => {
      setIsSyncing(true);
      const response = await apiRequest("POST", "/api/external/sync", {});
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/external/contacts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/external/conversations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/external/analytics/stats"] });
      toast({
        title: "Sync completed",
        description: `Synced ${data.contactsCount || 0} contacts and ${data.conversationsCount || 0} conversations.`,
      });
      setIsSyncing(false);
    },
    onError: (error) => {
      toast({
        title: "Sync failed",
        description: "Could not connect to external CRM. Please check your API key.",
        variant: "destructive",
      });
      setIsSyncing(false);
    },
  });

  const importToLeadsMutation = useMutation({
    mutationFn: async (contactId: string) => {
      const response = await apiRequest("POST", `/api/external/contacts/${contactId}/import`, {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
      toast({
        title: "Contact imported",
        description: "Contact has been added to your leads.",
      });
    },
  });

  const lastContactSync = contacts?.[0]?.syncedAt;
  const lastConversationSync = conversations?.[0]?.syncedAt;

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-external-title">External CRM</h1>
          <p className="text-muted-foreground">
            Sync data from Edify Limited CRM API
          </p>
        </div>
        <Button
          onClick={() => syncMutation.mutate()}
          disabled={isSyncing}
          data-testid="button-sync-external"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
          {isSyncing ? "Syncing..." : "Sync Now"}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Contacts</p>
                <p className="text-2xl font-bold mt-1">{contacts?.length || 0}</p>
                <SyncStatus lastSync={lastContactSync ? new Date(lastContactSync) : undefined} />
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Conversations</p>
                <p className="text-2xl font-bold mt-1">{conversations?.length || 0}</p>
                <SyncStatus lastSync={lastConversationSync ? new Date(lastConversationSync) : undefined} />
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <MessageSquare className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Page Views</p>
                <p className="text-2xl font-bold mt-1">
                  {pageViewStats?.reduce((sum, s) => sum + s.count, 0) || 0}
                </p>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <BarChart3 className="h-4 w-4" />
                  <span className="text-sm">{pageViewStats?.length || 0} pages tracked</span>
                </div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                <BarChart3 className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="contacts">
        <TabsList>
          <TabsTrigger value="contacts" data-testid="tab-contacts">
            <Users className="mr-2 h-4 w-4" />
            Contacts
          </TabsTrigger>
          <TabsTrigger value="conversations" data-testid="tab-conversations">
            <MessageSquare className="mr-2 h-4 w-4" />
            Conversations
          </TabsTrigger>
          <TabsTrigger value="analytics" data-testid="tab-analytics">
            <BarChart3 className="mr-2 h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contacts" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Contact Submissions</CardTitle>
                  <CardDescription>Website contact form submissions from Edify API</CardDescription>
                </div>
                <Badge variant="outline">
                  <Database className="mr-1 h-3 w-3" />
                  edifylimited.tech
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {contactsLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : contacts && contacts.length > 0 ? (
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Received</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contacts.map((contact) => (
                        <TableRow key={contact.id} data-testid={`contact-row-${contact.id}`}>
                          <TableCell className="font-medium">{contact.name}</TableCell>
                          <TableCell>{contact.email}</TableCell>
                          <TableCell className="max-w-[300px] truncate">
                            {contact.message || "-"}
                          </TableCell>
                          <TableCell>
                            {contact.createdAt
                              ? new Date(contact.createdAt).toLocaleDateString()
                              : "-"}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => importToLeadsMutation.mutate(contact.id)}
                              disabled={importToLeadsMutation.isPending}
                              data-testid={`button-import-${contact.id}`}
                            >
                              <Download className="mr-1 h-3 w-3" />
                              Import
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Users className="h-16 w-16 text-muted-foreground/30 mb-4" />
                  <h3 className="text-lg font-medium">No contacts synced</h3>
                  <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                    Click "Sync Now" to fetch contacts from the Edify CRM API
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversations" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Chat Conversations</CardTitle>
              <CardDescription>Audit chat conversations from website visitors</CardDescription>
            </CardHeader>
            <CardContent>
              {conversationsLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : conversations && conversations.length > 0 ? (
                <div className="space-y-4">
                  {conversations.map((conv) => (
                    <Card key={conv.id} data-testid={`conversation-card-${conv.id}`}>
                      <CardHeader className="py-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{conv.title || "Untitled Conversation"}</span>
                          </div>
                          <Badge variant="secondary">
                            {(conv.messages as any[])?.length || 0} messages
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="py-2">
                        <div className="text-sm text-muted-foreground">
                          {conv.createdAt
                            ? new Date(conv.createdAt).toLocaleString()
                            : "Unknown date"}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <MessageSquare className="h-16 w-16 text-muted-foreground/30 mb-4" />
                  <h3 className="text-lg font-medium">No conversations synced</h3>
                  <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                    Click "Sync Now" to fetch conversations from the Edify CRM API
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Page View Statistics</CardTitle>
              <CardDescription>Website traffic data from Edify analytics</CardDescription>
            </CardHeader>
            <CardContent>
              {pageViewStats && pageViewStats.length > 0 ? (
                <div className="space-y-3">
                  {pageViewStats.map((stat, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2 border-b last:border-0"
                    >
                      <div className="flex items-center gap-2">
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{stat.path}</span>
                      </div>
                      <Badge variant="outline">{stat.count} views</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <BarChart3 className="h-16 w-16 text-muted-foreground/30 mb-4" />
                  <h3 className="text-lg font-medium">No analytics data</h3>
                  <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                    Sync with external CRM to fetch page view statistics
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
