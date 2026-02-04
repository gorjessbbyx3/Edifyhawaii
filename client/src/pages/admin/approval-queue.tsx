import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle,
  XCircle,
  MessageSquare,
  Globe,
  Mail,
  Clock,
  RefreshCw,
  Eye,
  ExternalLink,
  Send,
  Bot,
  User,
  AlertCircle,
  Filter,
  Building,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

interface ApprovalQueueItem {
  id: string;
  itemType: "sample_site" | "scheduled_message";
  itemId: string;
  leadId: string;
  businessName: string;
  previewTitle?: string;
  previewContent?: string;
  status: string;
  priority: number;
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  itemData?: SampleSiteData | ScheduledMessageData;
  lead?: {
    id: string;
    status: string;
    businessId: string;
  };
  editRequestCount: number;
}

interface SampleSiteData {
  id: string;
  slug: string;
  businessName: string;
  tagline?: string;
  aboutText?: string;
  servicesJson?: unknown[];
  colorScheme?: { primary: string; secondary: string; accent: string };
  status: string;
  url?: string;
}

interface ScheduledMessageData {
  id: string;
  channel: string;
  subject?: string;
  body?: string;
  scheduledFor: string;
  status: string;
}

interface EditRequest {
  id: string;
  itemType: string;
  itemId: string;
  leadId: string;
  role: "user" | "assistant";
  message: string;
  appliedChanges?: Record<string, unknown>;
  status: string;
  createdAt: string;
}

function ApprovalCard({
  item,
  onApprove,
  onReject,
  onViewDetails,
  isApproving,
  isRejecting,
}: {
  item: ApprovalQueueItem;
  onApprove: () => void;
  onReject: () => void;
  onViewDetails: () => void;
  isApproving: boolean;
  isRejecting: boolean;
}) {
  const isSampleSite = item.itemType === "sample_site";
  const siteData = isSampleSite ? (item.itemData as SampleSiteData) : null;
  const messageData = !isSampleSite ? (item.itemData as ScheduledMessageData) : null;

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              {isSampleSite ? (
                <Globe className="h-5 w-5 text-blue-500" />
              ) : (
                <Mail className="h-5 w-5 text-green-500" />
              )}
              {item.previewTitle || item.businessName}
            </CardTitle>
            <CardDescription className="mt-1 flex items-center gap-2">
              <Building className="h-4 w-4" />
              {item.businessName}
            </CardDescription>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge variant={item.status === "pending" ? "outline" : "secondary"}>
              {item.status}
            </Badge>
            {item.priority > 0 && (
              <Badge variant="destructive" className="text-xs">
                High Priority
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        {/* Preview */}
        {isSampleSite && siteData?.colorScheme && (
          <div
            className="h-24 rounded-lg flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${siteData.colorScheme.primary} 0%, ${siteData.colorScheme.secondary} 100%)`,
            }}
          >
            <div className="text-white text-center px-4">
              <p className="font-bold">{siteData.businessName}</p>
              <p className="text-sm opacity-80">{siteData.tagline || "Website Preview"}</p>
            </div>
          </div>
        )}

        {!isSampleSite && messageData && (
          <div className="bg-muted p-3 rounded-lg">
            {messageData.subject && (
              <p className="font-medium text-sm mb-1">Subject: {messageData.subject}</p>
            )}
            <p className="text-sm text-muted-foreground line-clamp-3">
              {messageData.body || "No message body"}
            </p>
            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              Scheduled: {new Date(messageData.scheduledFor).toLocaleString()}
            </div>
          </div>
        )}

        {/* Content preview */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {item.previewContent || "No preview available"}
        </p>

        {/* Chat indicator */}
        {item.editRequestCount > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MessageSquare className="h-4 w-4" />
            {item.editRequestCount} edit request{item.editRequestCount !== 1 ? "s" : ""}
          </div>
        )}

        {/* Created time */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          Created {new Date(item.createdAt).toLocaleString()}
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 gap-2 flex-wrap">
        <Button
          variant="default"
          size="sm"
          className="flex-1 bg-green-600 hover:bg-green-700"
          onClick={onApprove}
          disabled={isApproving || isRejecting}
        >
          <CheckCircle className="h-4 w-4 mr-1" />
          {isApproving ? "Approving..." : "Approve"}
        </Button>
        <Button
          variant="destructive"
          size="sm"
          className="flex-1"
          onClick={onReject}
          disabled={isApproving || isRejecting}
        >
          <XCircle className="h-4 w-4 mr-1" />
          {isRejecting ? "Rejecting..." : "Reject"}
        </Button>
        <Button variant="outline" size="sm" className="flex-1" onClick={onViewDetails}>
          <MessageSquare className="h-4 w-4 mr-1" />
          Edit & Chat
        </Button>
      </CardFooter>
    </Card>
  );
}

function EditChatDialog({
  item,
  open,
  onOpenChange,
  onApprove,
  onReject,
}: {
  item: ApprovalQueueItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove: () => void;
  onReject: () => void;
}) {
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const isSampleSite = item.itemType === "sample_site";

  // Fetch edit requests/chat history
  const { data: editRequests, isLoading: loadingChat, refetch: refetchChat } = useQuery<EditRequest[]>({
    queryKey: [`/api/approval-queue/${item.id}/edit-requests`],
    enabled: open,
  });

  // Fetch updated item data
  const { data: updatedItem, refetch: refetchItem } = useQuery<ApprovalQueueItem>({
    queryKey: [`/api/approval-queue/${item.id}`],
    enabled: open,
  });

  const displayItem = updatedItem || item;
  const siteData = isSampleSite ? (displayItem.itemData as SampleSiteData) : null;
  const messageData = !isSampleSite ? (displayItem.itemData as ScheduledMessageData) : null;

  // Send edit request mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (userMessage: string) => {
      const response = await fetch(`/api/approval-queue/${item.id}/edit-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });
      if (!response.ok) throw new Error("Failed to send message");
      return response.json();
    },
    onSuccess: () => {
      setMessage("");
      refetchChat();
      refetchItem();
      toast({
        title: "Edit applied",
        description: "The AI has processed your request and made changes.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to process your edit request. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [editRequests]);

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessageMutation.mutate(message.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isSampleSite ? (
              <Globe className="h-5 w-5 text-blue-500" />
            ) : (
              <Mail className="h-5 w-5 text-green-500" />
            )}
            Review: {displayItem.previewTitle || displayItem.businessName}
          </DialogTitle>
          <DialogDescription>
            Chat with AI to make edits, then approve or reject
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 grid grid-cols-2 gap-4 min-h-0">
          {/* Left side: Content preview */}
          <div className="border rounded-lg p-4 overflow-auto">
            <h3 className="font-medium mb-3">Content Preview</h3>

            {isSampleSite && siteData && (
              <div className="space-y-4">
                {siteData.colorScheme && (
                  <div
                    className="h-24 rounded-lg flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${siteData.colorScheme.primary} 0%, ${siteData.colorScheme.secondary} 100%)`,
                    }}
                  >
                    <div className="text-white text-center px-4">
                      <p className="font-bold">{siteData.businessName}</p>
                      <p className="text-sm opacity-80">{siteData.tagline}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Tagline:</span>
                    <p className="text-muted-foreground">{siteData.tagline || "Not set"}</p>
                  </div>
                  <div>
                    <span className="font-medium">About:</span>
                    <p className="text-muted-foreground">{siteData.aboutText || "Not set"}</p>
                  </div>
                  {siteData.servicesJson && siteData.servicesJson.length > 0 && (
                    <div>
                      <span className="font-medium">Services:</span>
                      <ul className="text-muted-foreground list-disc list-inside">
                        {(siteData.servicesJson as any[]).map((s, i) => (
                          <li key={i}>{s.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {siteData.slug && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => window.open(`/sample/${siteData.slug}`, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Preview Site
                  </Button>
                )}
              </div>
            )}

            {!isSampleSite && messageData && (
              <div className="space-y-4">
                <div className="bg-muted p-3 rounded-lg">
                  <Badge className="mb-2">{messageData.channel}</Badge>
                  {messageData.subject && (
                    <p className="font-medium mb-2">Subject: {messageData.subject}</p>
                  )}
                  <p className="text-sm whitespace-pre-wrap">{messageData.body}</p>
                </div>
                <div className="text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 inline mr-1" />
                  Scheduled for: {new Date(messageData.scheduledFor).toLocaleString()}
                </div>
              </div>
            )}
          </div>

          {/* Right side: Chat interface */}
          <div className="border rounded-lg flex flex-col min-h-0">
            <div className="p-3 border-b bg-muted/50">
              <h3 className="font-medium flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Edit Chat
              </h3>
              <p className="text-xs text-muted-foreground">
                Ask AI to make changes to this content
              </p>
            </div>

            {/* Chat messages */}
            <ScrollArea className="flex-1 p-3">
              {loadingChat ? (
                <div className="space-y-2">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : editRequests && editRequests.length > 0 ? (
                <div className="space-y-3">
                  {editRequests.map((req) => (
                    <div
                      key={req.id}
                      className={`flex gap-2 ${req.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          req.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {req.role === "user" ? (
                            <User className="h-3 w-3" />
                          ) : (
                            <Bot className="h-3 w-3" />
                          )}
                          <span className="text-xs font-medium">
                            {req.role === "user" ? "You" : "AI Assistant"}
                          </span>
                        </div>
                        <p className="text-sm">{req.message}</p>
                        {req.appliedChanges && Object.keys(req.appliedChanges).length > 0 && (
                          <div className="mt-2 text-xs opacity-80">
                            <CheckCircle className="h-3 w-3 inline mr-1" />
                            Changes applied: {Object.keys(req.appliedChanges).join(", ")}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No edits yet</p>
                  <p className="text-xs">Ask AI to make changes below</p>
                </div>
              )}
            </ScrollArea>

            {/* Chat input */}
            <div className="p-3 border-t">
              <div className="flex gap-2">
                <Textarea
                  placeholder="Ask AI to edit... (e.g., 'Make the tagline more exciting' or 'Add urgency to the email')"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 min-h-[60px] resize-none"
                  disabled={sendMessageMutation.isPending}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || sendMessageMutation.isPending}
                  className="self-end"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Press Enter to send, Shift+Enter for new line
              </p>
            </div>
          </div>
        </div>

        <Separator />

        <DialogFooter className="flex-shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onReject();
              onOpenChange(false);
            }}
          >
            <XCircle className="h-4 w-4 mr-1" />
            Reject
          </Button>
          <Button
            className="bg-green-600 hover:bg-green-700"
            onClick={() => {
              onApprove();
              onOpenChange(false);
            }}
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function ApprovalQueuePage() {
  const { toast } = useToast();
  const [selectedItem, setSelectedItem] = useState<ApprovalQueueItem | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "sample_site" | "scheduled_message">("all");
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);

  // Fetch approval queue
  const { data: queueItems, isLoading, refetch } = useQuery<ApprovalQueueItem[]>({
    queryKey: ["/api/approval-queue", { status: "pending" }],
  });

  // Approve mutation
  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/approval-queue/${id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approvedBy: "dashboard-user" }),
      });
      if (!response.ok) throw new Error("Failed to approve item");
      return response.json();
    },
    onSuccess: (_, id) => {
      toast({
        title: "Approved",
        description: "The item has been approved and will proceed.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/approval-queue"] });
      setApprovingId(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to approve item. Please try again.",
        variant: "destructive",
      });
      setApprovingId(null);
    },
  });

  // Reject mutation
  const rejectMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/approval-queue/${id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rejectedBy: "dashboard-user", reason: "Rejected by user" }),
      });
      if (!response.ok) throw new Error("Failed to reject item");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Rejected",
        description: "The item has been rejected.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/approval-queue"] });
      setRejectingId(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to reject item. Please try again.",
        variant: "destructive",
      });
      setRejectingId(null);
    },
  });

  const handleApprove = (id: string) => {
    setApprovingId(id);
    approveMutation.mutate(id);
  };

  const handleReject = (id: string) => {
    setRejectingId(id);
    rejectMutation.mutate(id);
  };

  const handleViewDetails = (item: ApprovalQueueItem) => {
    setSelectedItem(item);
    setEditDialogOpen(true);
  };

  // Filter items
  const filteredItems = (queueItems || []).filter((item) => {
    if (filter === "all") return true;
    return item.itemType === filter;
  });

  // Separate by type for stats
  const sampleSiteCount = (queueItems || []).filter((i) => i.itemType === "sample_site").length;
  const messageCount = (queueItems || []).filter((i) => i.itemType === "scheduled_message").length;
  const highPriorityCount = (queueItems || []).filter((i) => i.priority > 0).length;

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <CheckCircle className="h-8 w-8 text-primary" />
            Approval Queue
          </h1>
          <p className="text-muted-foreground mt-1">
            Review and approve sample sites and messages before they're sent
          </p>
        </div>
        <Button variant="outline" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(queueItems || []).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <Globe className="h-4 w-4 text-blue-500" />
              Sample Sites
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{sampleSiteCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <Mail className="h-4 w-4 text-green-500" />
              Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{messageCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <AlertCircle className="h-4 w-4 text-orange-500" />
              High Priority
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{highPriorityCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Tabs value={filter} onValueChange={(v) => setFilter(v as any)}>
          <TabsList>
            <TabsTrigger value="all">All ({(queueItems || []).length})</TabsTrigger>
            <TabsTrigger value="sample_site">
              <Globe className="h-4 w-4 mr-1" />
              Sites ({sampleSiteCount})
            </TabsTrigger>
            <TabsTrigger value="scheduled_message">
              <Mail className="h-4 w-4 mr-1" />
              Messages ({messageCount})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Queue Items Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-48 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
            <h3 className="text-lg font-medium">All Caught Up!</h3>
            <p className="text-muted-foreground mt-2">
              {filter === "all"
                ? "No items pending approval"
                : `No ${filter === "sample_site" ? "sample sites" : "messages"} pending approval`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <ApprovalCard
              key={item.id}
              item={item}
              onApprove={() => handleApprove(item.id)}
              onReject={() => handleReject(item.id)}
              onViewDetails={() => handleViewDetails(item)}
              isApproving={approvingId === item.id}
              isRejecting={rejectingId === item.id}
            />
          ))}
        </div>
      )}

      {/* Edit/Chat Dialog */}
      {selectedItem && (
        <EditChatDialog
          item={selectedItem}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onApprove={() => handleApprove(selectedItem.id)}
          onReject={() => handleReject(selectedItem.id)}
        />
      )}
    </div>
  );
}
