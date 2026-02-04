import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Mail,
  MessageSquare,
  Clock,
  Play,
  Pause,
  Plus,
  Users,
  TrendingUp,
  Send,
  Eye,
  MousePointer,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Calendar,
  Zap,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface NurturingSequence {
  id: string;
  name: string;
  description?: string;
  status: "active" | "paused" | "draft";
  triggerEvent: string;
  stepCount: number;
  activeEnrollments: number;
  totalEnrollments: number;
  createdAt: string;
}

interface NurturingStep {
  id: string;
  sequenceId: string;
  stepOrder: number;
  name: string;
  channel: "email" | "sms" | "both";
  delayMinutes: number;
  emailSubject?: string;
  emailBody?: string;
  smsBody?: string;
  isEngagementCheck: boolean;
}

interface ScheduledMessage {
  id: string;
  leadId: string;
  channel: string;
  scheduledFor: string;
  status: string;
  subject?: string;
}

interface NurturingStatus {
  configured: boolean;
  message: string;
}

function SequenceCard({
  sequence,
  onToggle,
  onView,
}: {
  sequence: NurturingSequence;
  onToggle: (id: string, status: string) => void;
  onView: (id: string) => void;
}) {
  const isActive = sequence.status === "active";

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
          <Mail className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">{sequence.name}</CardTitle>
            <Badge variant={isActive ? "default" : "secondary"}>
              {sequence.status}
            </Badge>
          </div>
          <CardDescription className="mt-1 line-clamp-2">
            {sequence.description || `Triggered by ${sequence.triggerEvent}`}
          </CardDescription>
        </div>
        <Switch
          checked={isActive}
          onCheckedChange={(checked) =>
            onToggle(sequence.id, checked ? "active" : "paused")
          }
        />
      </CardHeader>
      <CardContent className="flex-1">
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Steps</span>
            <span className="text-lg font-semibold">{sequence.stepCount}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Active</span>
            <span className="text-lg font-semibold">{sequence.activeEnrollments}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Total</span>
            <span className="text-lg font-semibold">{sequence.totalEnrollments}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onView(sequence.id)}
        >
          <Eye className="mr-2 h-4 w-4" />
          View Steps
        </Button>
      </CardFooter>
    </Card>
  );
}

function StepCard({ step, index }: { step: NurturingStep; index: number }) {
  const getChannelIcon = () => {
    switch (step.channel) {
      case "email":
        return <Mail className="h-4 w-4" />;
      case "sms":
        return <MessageSquare className="h-4 w-4" />;
      default:
        return (
          <div className="flex gap-1">
            <Mail className="h-3 w-3" />
            <MessageSquare className="h-3 w-3" />
          </div>
        );
    }
  };

  const formatDelay = (minutes: number) => {
    if (minutes === 0) return "Immediately";
    if (minutes < 60) return `${minutes} minutes`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)} hours`;
    return `${Math.floor(minutes / 1440)} days`;
  };

  return (
    <div className="flex items-start gap-4 p-4 border rounded-lg">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
        {index + 1}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium">{step.name}</span>
          <Badge variant="outline" className="gap-1">
            {getChannelIcon()}
            {step.channel}
          </Badge>
          {step.isEngagementCheck && (
            <Badge variant="secondary">Engagement Check</Badge>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-3 w-3" />
          {formatDelay(step.delayMinutes)}
        </div>
        {step.emailSubject && (
          <p className="text-sm mt-2 text-muted-foreground">
            Subject: {step.emailSubject}
          </p>
        )}
      </div>
    </div>
  );
}

function CreateSequenceDialog({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [triggerEvent, setTriggerEvent] = useState("CONTACT_ENRICHED");
  const { toast } = useToast();

  const createMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/nurturing/sequences", {
        name,
        description,
        triggerEvent,
        status: "draft",
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/nurturing/sequences"] });
      toast({ title: "Sequence created", description: "Your nurturing sequence has been created." });
      setOpen(false);
      setName("");
      setDescription("");
      onCreated();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create sequence.", variant: "destructive" });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Sequence
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Nurturing Sequence</DialogTitle>
          <DialogDescription>
            Set up an automated email/SMS sequence to nurture leads.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Sequence Name</Label>
            <Input
              id="name"
              placeholder="e.g., Website Services Outreach"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe this sequence..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="trigger">Trigger Event</Label>
            <Select value={triggerEvent} onValueChange={setTriggerEvent}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CONTACT_ENRICHED">Contact Enriched</SelectItem>
                <SelectItem value="ONLINE_PRESENCE_VERIFIED">Online Presence Verified</SelectItem>
                <SelectItem value="LEAD_CREATED">Lead Created</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => createMutation.mutate()} disabled={!name}>
            Create Sequence
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function NurturingStats() {
  const { data: sequences } = useQuery<NurturingSequence[]>({
    queryKey: ["/api/nurturing/sequences"],
  });

  const { data: messages } = useQuery<ScheduledMessage[]>({
    queryKey: ["/api/nurturing/messages"],
  });

  const activeSequences = sequences?.filter(s => s.status === "active").length || 0;
  const totalEnrollments = sequences?.reduce((sum, s) => sum + s.activeEnrollments, 0) || 0;
  const pendingMessages = messages?.length || 0;

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-green-100 dark:bg-green-900/30">
              <Play className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{activeSequences}</p>
              <p className="text-sm text-muted-foreground">Active Sequences</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-100 dark:bg-blue-900/30">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalEnrollments}</p>
              <p className="text-sm text-muted-foreground">Leads in Sequences</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-yellow-100 dark:bg-yellow-900/30">
              <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pendingMessages}</p>
              <p className="text-sm text-muted-foreground">Pending Messages</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-purple-100 dark:bg-purple-900/30">
              <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">--</p>
              <p className="text-sm text-muted-foreground">Open Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Nurturing() {
  const { toast } = useToast();
  const [selectedSequence, setSelectedSequence] = useState<string | null>(null);

  const { data: status } = useQuery<NurturingStatus>({
    queryKey: ["/api/nurturing/status"],
  });

  const { data: sequences, isLoading } = useQuery<NurturingSequence[]>({
    queryKey: ["/api/nurturing/sequences"],
  });

  const { data: steps } = useQuery<NurturingStep[]>({
    queryKey: ["/api/nurturing/sequences", selectedSequence, "steps"],
    queryFn: async () => {
      if (!selectedSequence) return [];
      const response = await apiRequest("GET", `/api/nurturing/sequences/${selectedSequence}/steps`);
      return response.json();
    },
    enabled: !!selectedSequence,
  });

  const toggleSequenceMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await apiRequest("PATCH", `/api/nurturing/sequences/${id}`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/nurturing/sequences"] });
      toast({ title: "Status updated", description: "Sequence status has been changed." });
    },
  });

  const processMessagesMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/nurturing/process", {});
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Messages processed",
        description: `Sent ${data.messagesSent} messages.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/nurturing/messages"] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to process messages.", variant: "destructive" });
    },
  });

  const handleToggle = (id: string, status: string) => {
    toggleSequenceMutation.mutate({ id, status });
  };

  const handleView = (id: string) => {
    setSelectedSequence(id);
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">Lead Nurturing</h1>
          <p className="text-muted-foreground">
            Automated email and SMS sequences to convert leads with weak online presence
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => processMessagesMutation.mutate()}
            disabled={processMessagesMutation.isPending}
          >
            <Send className="mr-2 h-4 w-4" />
            Process Queue
          </Button>
          <CreateSequenceDialog onCreated={() => {}} />
        </div>
      </div>

      {!status?.configured && (
        <Card className="border-yellow-500/50 bg-yellow-50 dark:bg-yellow-900/10">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-800 dark:text-yellow-200">
                  Email/SMS services not configured
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Set SENDGRID_API_KEY or TWILIO credentials to enable sending. Messages will be simulated until configured.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <NurturingStats />

      <Tabs defaultValue="sequences" className="w-full">
        <TabsList>
          <TabsTrigger value="sequences">Sequences</TabsTrigger>
          <TabsTrigger value="steps" disabled={!selectedSequence}>
            Steps {selectedSequence && `(${steps?.length || 0})`}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sequences" className="mt-4">
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-12 w-12 rounded-lg" />
                    <Skeleton className="h-4 w-3/4 mt-2" />
                    <Skeleton className="h-3 w-full mt-1" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-16 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : sequences?.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Mail className="h-12 w-12 text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-medium mb-2">No Nurturing Sequences</h3>
                <p className="text-sm text-muted-foreground text-center max-w-md mb-4">
                  Create your first nurturing sequence to automatically follow up with leads that have weak online presence.
                </p>
                <CreateSequenceDialog onCreated={() => {}} />
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {sequences?.map((sequence) => (
                <SequenceCard
                  key={sequence.id}
                  sequence={sequence}
                  onToggle={handleToggle}
                  onView={handleView}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="steps" className="mt-4">
          {selectedSequence && (
            <Card>
              <CardHeader>
                <CardTitle>Sequence Steps</CardTitle>
                <CardDescription>
                  Configure the automated follow-up steps for this sequence
                </CardDescription>
              </CardHeader>
              <CardContent>
                {steps?.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <Clock className="h-12 w-12 text-muted-foreground/30 mb-4" />
                    <p className="text-sm text-muted-foreground">
                      No steps configured. Add steps to start nurturing leads.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {steps?.map((step, index) => (
                      <StepCard key={step.id} step={step} index={index} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
          <CardDescription>
            The nurturing system automatically follows up with leads
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="flex flex-col items-center text-center p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 mb-3">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <h4 className="font-medium mb-1">1. Lead Discovered</h4>
              <p className="text-sm text-muted-foreground">
                AI crawler finds businesses with weak online presence
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 mb-3">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <h4 className="font-medium mb-1">2. Welcome Message</h4>
              <p className="text-sm text-muted-foreground">
                Instant welcome email + SMS offering website services
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 mb-3">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <h4 className="font-medium mb-1">3. Timed Follow-ups</h4>
              <p className="text-sm text-muted-foreground">
                24h and 48h follow-ups with engagement tracking
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 mb-3">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
              <h4 className="font-medium mb-1">4. Lead Tagged</h4>
              <p className="text-sm text-muted-foreground">
                Interested leads tagged for sales team follow-up
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
