import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Plus,
  Search,
  MoreHorizontal,
  Building2,
  Phone,
  Mail,
  MapPin,
  User,
  Users,
  Globe,
  CheckCircle2,
  XCircle,
  Clock,
  UserCheck,
  UserX,
  ExternalLink,
  Archive,
  AlertTriangle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Lead, Business, Contact } from "@shared/schema";
import { pipelineStages, businessSourceEnum } from "@shared/schema";

type EnrichedLead = Lead & { 
  business: Business | null;
  contacts?: Contact[];
  hasContacts?: boolean;
};

const createLeadSchema = z.object({
  name: z.string().min(1, "Business name is required"),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  industry: z.string().optional(),
  source: z.string().default("manual"),
});

type CreateLeadForm = z.infer<typeof createLeadSchema>;

function StatusBadge({ status }: { status: string }) {
  const stage = pipelineStages.find((s) => s.id === status);
  const colorMap: Record<string, string> = {
    blue: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    cyan: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400",
    yellow: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    purple: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    green: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  };

  return (
    <Badge className={`${colorMap[stage?.color || "blue"]} border-0`}>
      {stage?.label || status}
    </Badge>
  );
}

function ContactStatusBadge({ hasContacts, hasPhone }: { hasContacts: boolean; hasPhone: boolean }) {
  if (hasContacts) {
    return (
      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-0">
        <UserCheck className="h-3 w-3 mr-1" />
        Has Contact
      </Badge>
    );
  }
  if (hasPhone) {
    return (
      <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-0">
        <Phone className="h-3 w-3 mr-1" />
        Phone Only
      </Badge>
    );
  }
  return (
    <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 border-0">
      <UserX className="h-3 w-3 mr-1" />
      No Contact
    </Badge>
  );
}

function LeadRow({ 
  lead, 
  onStatusChange,
  onViewDetails,
  contacts 
}: { 
  lead: EnrichedLead; 
  onStatusChange: (id: string, status: string) => void;
  onViewDetails: (id: string) => void;
  contacts: Contact[];
}) {
  const business = lead.business;
  const leadContacts = contacts.filter(c => c.businessId === business?.id);
  const hasContacts = leadContacts.length > 0;
  const hasPhone = !!(business?.phone);
  
  return (
    <TableRow data-testid={`lead-row-${lead.id}`}>
      <TableCell>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{business?.name || "Unknown Business"}</span>
          </div>
          {business?.industry && (
            <span className="text-xs text-muted-foreground ml-6">{business.industry}</span>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1.5 text-sm">
          <MapPin className="h-3 w-3 text-muted-foreground" />
          <span>
            {business?.city && business?.state 
              ? `${business.city}, ${business.state}` 
              : business?.address || "No address"}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-col gap-1">
          {business?.phone && (
            <div className="flex items-center gap-1 text-xs">
              <Phone className="h-3 w-3 text-muted-foreground" />
              <span>{business.phone}</span>
            </div>
          )}
          {business?.website && (
            <div className="flex items-center gap-1 text-xs">
              <Globe className="h-3 w-3 text-muted-foreground" />
              <a 
                href={business.website} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted-foreground hover:underline truncate max-w-[150px]"
                data-testid={`link-website-${lead.id}`}
              >
                {business.website.replace(/^https?:\/\//, '').split('/')[0]}
              </a>
            </div>
          )}
          {!business?.phone && !business?.website && (
            <span className="text-xs text-muted-foreground">No contact info</span>
          )}
        </div>
      </TableCell>
      <TableCell>
        <ContactStatusBadge hasContacts={hasContacts} hasPhone={hasPhone} />
      </TableCell>
      <TableCell>
        <StatusBadge status={lead.status || "new"} />
      </TableCell>
      <TableCell>
        <Badge variant="outline" className="text-xs">
          {business?.source || "manual"}
        </Badge>
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" data-testid={`button-lead-actions-${lead.id}`}>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem 
              onClick={() => onViewDetails(lead.id)}
              data-testid={`menu-view-details-${lead.id}`}
            >
              <User className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => onStatusChange(lead.id, "verified")}
              data-testid={`menu-mark-verified-${lead.id}`}
            >
              Mark as Verified
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onStatusChange(lead.id, "contacted")}
              data-testid={`menu-mark-contacted-${lead.id}`}
            >
              Mark as Contacted
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onStatusChange(lead.id, "qualified")}
              data-testid={`menu-mark-qualified-${lead.id}`}
            >
              Mark as Qualified
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => onStatusChange(lead.id, "closed")}
              data-testid={`menu-mark-closed-${lead.id}`}
            >
              Mark as Closed (Won)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

function LeadStats({ leads, contacts }: { leads: EnrichedLead[]; contacts: Contact[] }) {
  const newLeads = leads.filter(l => l.status === "new").length;
  const needsHelpLeads = leads.filter(l => l.status === "verified").length;
  const contactedLeads = leads.filter(l => l.status === "contacted").length;
  const qualifiedLeads = leads.filter(l => l.status === "qualified").length;
  const closedLeads = leads.filter(l => l.status === "closed").length;
  const archivedLeads = leads.filter(l => l.status === "archived").length;
  
  const leadsWithContacts = leads.filter(l => {
    const businessId = l.business?.id;
    return businessId && contacts.some(c => c.businessId === businessId);
  }).length;

  return (
    <div className="grid gap-4 md:grid-cols-7">
      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-100 dark:bg-blue-900/30">
              <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xl font-bold">{newLeads}</p>
              <p className="text-xs text-muted-foreground">Discovered</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-orange-100 dark:bg-orange-900/30">
              <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-xl font-bold">{needsHelpLeads}</p>
              <p className="text-xs text-muted-foreground">Needs Help</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-yellow-100 dark:bg-yellow-900/30">
              <Phone className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-xl font-bold">{contactedLeads}</p>
              <p className="text-xs text-muted-foreground">Contacted</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-purple-100 dark:bg-purple-900/30">
              <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-xl font-bold">{qualifiedLeads}</p>
              <p className="text-xs text-muted-foreground">Qualified</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-green-100 dark:bg-green-900/30">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-xl font-bold">{closedLeads}</p>
              <p className="text-xs text-muted-foreground">Closed/Won</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-teal-100 dark:bg-teal-900/30">
              <UserCheck className="h-4 w-4 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <p className="text-xl font-bold">{leadsWithContacts}</p>
              <p className="text-xs text-muted-foreground">Has Contacts</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-gray-100 dark:bg-gray-800/50">
              <Archive className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <p className="text-xl font-bold">{archivedLeads}</p>
              <p className="text-xs text-muted-foreground">Archived</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function LeadsTable({ 
  leads, 
  contacts,
  onStatusChange, 
  searchQuery,
  isLoading 
}: { 
  leads: EnrichedLead[]; 
  contacts: Contact[];
  onStatusChange: (id: string, status: string) => void;
  searchQuery: string;
  isLoading: boolean;
}) {
  const [, navigate] = useLocation();
  const filteredLeads = leads.filter((lead) => {
    const businessName = lead.business?.name || "";
    return businessName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (filteredLeads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Users className="h-12 w-12 text-muted-foreground/30 mb-4" />
        <h3 className="text-lg font-medium">No leads in this category</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Run the Crawler Agent to discover new businesses
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Business</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Contact Info</TableHead>
            <TableHead>Contact Status</TableHead>
            <TableHead>Pipeline Status</TableHead>
            <TableHead>Source</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredLeads.map((lead) => (
            <LeadRow
              key={lead.id}
              lead={lead}
              contacts={contacts}
              onStatusChange={onStatusChange}
              onViewDetails={(id) => navigate(`/leads/${id}`)}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default function Leads() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: leads, isLoading: leadsLoading } = useQuery<EnrichedLead[]>({
    queryKey: ["/api/leads"],
  });

  const { data: contacts } = useQuery<Contact[]>({
    queryKey: ["/api/contacts"],
  });

  const createLeadMutation = useMutation({
    mutationFn: async (data: CreateLeadForm) => {
      const response = await apiRequest("POST", "/api/leads", {
        business: {
          name: data.name,
          address: data.address,
          city: data.city,
          state: data.state,
          zip: data.zip,
          industry: data.industry,
          source: data.source,
        },
        organizationId: "org-default",
        status: "new",
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
      setIsCreateDialogOpen(false);
      form.reset();
      toast({
        title: "Lead created",
        description: "The new lead has been added successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create lead. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await apiRequest("PATCH", `/api/leads/${id}`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      toast({
        title: "Status updated",
        description: "Lead status has been updated.",
      });
    },
  });

  const form = useForm<CreateLeadForm>({
    resolver: zodResolver(createLeadSchema),
    defaultValues: {
      name: "",
      address: "",
      city: "",
      state: "HI",
      zip: "",
      industry: "",
      source: "manual",
    },
  });

  const onSubmit = (data: CreateLeadForm) => {
    createLeadMutation.mutate(data);
  };

  const handleStatusChange = (id: string, status: string) => {
    updateStatusMutation.mutate({ id, status });
  };

  const allLeads = leads || [];
  const allContacts = contacts || [];

  const getFilteredLeads = (tab: string) => {
    switch (tab) {
      case "new":
        return allLeads.filter(l => l.status === "new");
      case "verified":
        return allLeads.filter(l => l.status === "verified");
      case "contacted":
        return allLeads.filter(l => l.status === "contacted");
      case "qualified":
        return allLeads.filter(l => l.status === "qualified");
      case "closed":
        return allLeads.filter(l => l.status === "closed");
      case "archived":
        return allLeads.filter(l => l.status === "archived");
      case "has-contact":
        return allLeads.filter(l => {
          const businessId = l.business?.id;
          return (businessId && allContacts.some(c => c.businessId === businessId)) || l.business?.phone;
        });
      case "no-contact":
        return allLeads.filter(l => {
          const businessId = l.business?.id;
          const hasContact = businessId && allContacts.some(c => c.businessId === businessId);
          return !hasContact && !l.business?.phone;
        });
      default:
        return allLeads.filter(l => l.status !== "archived");
    }
  };

  const tabLeads = getFilteredLeads(activeTab);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-leads-title">Lead Pipeline</h1>
          <p className="text-muted-foreground">
            Track leads from discovery to conversion
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-create-lead">
              <Plus className="mr-2 h-4 w-4" />
              Add Lead
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Lead</DialogTitle>
              <DialogDescription>
                Add a new business lead to your CRM pipeline.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Acme Corporation" {...field} data-testid="input-business-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="industry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Industry</FormLabel>
                        <FormControl>
                          <Input placeholder="Technology" {...field} data-testid="input-industry" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="source"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Source</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-source">
                              <SelectValue placeholder="Select source" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {businessSourceEnum.map((source) => (
                              <SelectItem key={source} value={source}>
                                {source.replace(/_/g, " ")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St" {...field} data-testid="input-address" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="Honolulu" {...field} data-testid="input-city" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input placeholder="HI" {...field} data-testid="input-state" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="zip"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ZIP</FormLabel>
                        <FormControl>
                          <Input placeholder="96815" {...field} data-testid="input-zip" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsCreateDialogOpen(false)}
                    data-testid="button-cancel-lead"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createLeadMutation.isPending} data-testid="button-submit-lead">
                    {createLeadMutation.isPending ? "Creating..." : "Create Lead"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <LeadStats leads={allLeads} contacts={allContacts} />

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 lg:grid-cols-9">
                <TabsTrigger value="all" data-testid="tab-all">
                  All ({allLeads.filter(l => l.status !== "archived").length})
                </TabsTrigger>
                <TabsTrigger value="new" data-testid="tab-new">
                  Discovered ({allLeads.filter(l => l.status === "new").length})
                </TabsTrigger>
                <TabsTrigger value="verified" data-testid="tab-verified">
                  Needs Help ({allLeads.filter(l => l.status === "verified").length})
                </TabsTrigger>
                <TabsTrigger value="contacted" data-testid="tab-contacted">
                  Contacted ({allLeads.filter(l => l.status === "contacted").length})
                </TabsTrigger>
                <TabsTrigger value="qualified" data-testid="tab-qualified">
                  Qualified ({allLeads.filter(l => l.status === "qualified").length})
                </TabsTrigger>
                <TabsTrigger value="closed" data-testid="tab-closed">
                  Won ({allLeads.filter(l => l.status === "closed").length})
                </TabsTrigger>
                <TabsTrigger value="has-contact" data-testid="tab-has-contact">
                  Has Contact
                </TabsTrigger>
                <TabsTrigger value="no-contact" data-testid="tab-no-contact">
                  No Contact
                </TabsTrigger>
                <TabsTrigger value="archived" data-testid="tab-archived">
                  Archived ({allLeads.filter(l => l.status === "archived").length})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search leads..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search-leads"
              />
            </div>
          </div>
          <LeadsTable
            leads={tabLeads}
            contacts={allContacts}
            onStatusChange={handleStatusChange}
            searchQuery={searchQuery}
            isLoading={leadsLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
