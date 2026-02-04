import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  ArrowLeft,
  Building2,
  Globe,
  Server,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Plus,
  ExternalLink,
  Trash2,
  MessageSquare,
  User,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Client, Business, ClientAsset, ClientNote, Contact } from "@shared/schema";
import { assetTypeEnum, assetStatusEnum } from "@shared/schema";

type ClientDetail = Client & {
  business: Business | null;
  assets: ClientAsset[];
  notes: ClientNote[];
  contacts: Contact[];
};

const assetTypeIcons: Record<string, typeof Globe> = {
  domain: Globe,
  hosting: Server,
  subscription: DollarSign,
  email: Mail,
  ssl: Globe,
  other: Globe,
};

const createAssetSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  provider: z.string().optional(),
  cost: z.coerce.number().optional(),
  billingCycle: z.string().optional(),
  expiryDate: z.string().optional(),
  renewalDate: z.string().optional(),
  loginUrl: z.string().optional(),
  username: z.string().optional(),
  notes: z.string().optional(),
});

type CreateAssetForm = z.infer<typeof createAssetSchema>;

function AssetStatusBadge({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    active: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    expiring_soon: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    expired: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    cancelled: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
  };

  const label = status.replace("_", " ");
  return (
    <Badge className={`${colorMap[status] || colorMap.active} border-0`}>
      {label.charAt(0).toUpperCase() + label.slice(1)}
    </Badge>
  );
}

function AssetTypeBadge({ type }: { type: string }) {
  const colorMap: Record<string, string> = {
    domain: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    hosting: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    subscription: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    email: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
    ssl: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400",
    other: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
  };

  return (
    <Badge className={`${colorMap[type] || colorMap.other} border-0`}>
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </Badge>
  );
}

export default function ClientDetail() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [addAssetOpen, setAddAssetOpen] = useState(false);
  const [newNote, setNewNote] = useState("");

  const { data: client, isLoading } = useQuery<ClientDetail>({
    queryKey: ["/api/clients", params.id],
  });

  const addAssetForm = useForm<CreateAssetForm>({
    resolver: zodResolver(createAssetSchema),
    defaultValues: {
      name: "",
      type: "domain",
      provider: "",
      cost: 0,
      billingCycle: "monthly",
    },
  });

  const createAssetMutation = useMutation({
    mutationFn: async (data: CreateAssetForm) => {
      return apiRequest("POST", "/api/assets", {
        ...data,
        clientId: params.id,
        cost: data.cost || 0,
        expiryDate: data.expiryDate ? new Date(data.expiryDate).toISOString() : null,
        renewalDate: data.renewalDate ? new Date(data.renewalDate).toISOString() : null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients", params.id] });
      toast({ title: "Asset added successfully" });
      setAddAssetOpen(false);
      addAssetForm.reset();
    },
    onError: () => {
      toast({ title: "Failed to add asset", variant: "destructive" });
    },
  });

  const deleteAssetMutation = useMutation({
    mutationFn: async (assetId: string) => {
      return apiRequest("DELETE", `/api/assets/${assetId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients", params.id] });
      toast({ title: "Asset removed" });
    },
  });

  const addNoteMutation = useMutation({
    mutationFn: async (content: string) => {
      return apiRequest("POST", `/api/clients/${params.id}/notes`, {
        content,
        authorType: "user",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients", params.id] });
      setNewNote("");
      toast({ title: "Note added" });
    },
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Client not found</h2>
          <Button onClick={() => navigate("/clients")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Clients
          </Button>
        </div>
      </div>
    );
  }

  const totalAssetCost = client.assets.reduce((sum, a) => sum + (a.cost || 0), 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/clients")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{client.business?.name || "Unknown Client"}</h1>
          <p className="text-muted-foreground">{client.business?.industry || "No industry"}</p>
        </div>
        <Badge
          className={`${
            client.status === "active"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          } border-0`}
        >
          {client.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${client.monthlyRevenue?.toLocaleString() || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{client.assets.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium">Asset Costs</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalAssetCost}/mo</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium">Contacts</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{client.contacts.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="assets" className="space-y-4">
        <TabsList>
          <TabsTrigger value="assets">Assets ({client.assets.length})</TabsTrigger>
          <TabsTrigger value="contacts">Contacts ({client.contacts.length})</TabsTrigger>
          <TabsTrigger value="notes">Notes ({client.notes.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="assets" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Client Assets</CardTitle>
                <Dialog open={addAssetOpen} onOpenChange={setAddAssetOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" data-testid="button-add-asset">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Asset
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Asset</DialogTitle>
                      <DialogDescription>
                        Track a domain, hosting, or subscription for this client
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...addAssetForm}>
                      <form
                        onSubmit={addAssetForm.handleSubmit((data) =>
                          createAssetMutation.mutate(data)
                        )}
                        className="space-y-4"
                      >
                        <FormField
                          control={addAssetForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input placeholder="example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={addAssetForm.control}
                            name="type"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Type</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {assetTypeEnum.map((type) => (
                                      <SelectItem key={type} value={type}>
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={addAssetForm.control}
                            name="provider"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Provider</FormLabel>
                                <FormControl>
                                  <Input placeholder="GoDaddy, AWS..." {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={addAssetForm.control}
                            name="cost"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Monthly Cost ($)</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(parseFloat(e.target.value) || 0)
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={addAssetForm.control}
                            name="billingCycle"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Billing Cycle</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select cycle" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                    <SelectItem value="quarterly">Quarterly</SelectItem>
                                    <SelectItem value="yearly">Yearly</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={addAssetForm.control}
                            name="expiryDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Expiry Date</FormLabel>
                                <FormControl>
                                  <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={addAssetForm.control}
                            name="renewalDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Renewal Date</FormLabel>
                                <FormControl>
                                  <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={addAssetForm.control}
                          name="notes"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Notes</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Additional notes..." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <DialogFooter>
                          <Button
                            type="submit"
                            disabled={createAssetMutation.isPending}
                          >
                            {createAssetMutation.isPending ? "Adding..." : "Add Asset"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {client.assets.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No assets tracked yet</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Asset</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead>Cost</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Expiry</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {client.assets.map((asset) => {
                      const Icon = assetTypeIcons[asset.type] || Globe;
                      return (
                        <TableRow key={asset.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{asset.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <AssetTypeBadge type={asset.type} />
                          </TableCell>
                          <TableCell>{asset.provider || "-"}</TableCell>
                          <TableCell>${asset.cost || 0}/mo</TableCell>
                          <TableCell>
                            <AssetStatusBadge status={asset.status} />
                          </TableCell>
                          <TableCell>
                            {asset.expiryDate
                              ? new Date(asset.expiryDate).toLocaleDateString()
                              : "-"}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteAssetMutation.mutate(asset.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contacts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Client Contacts</CardTitle>
            </CardHeader>
            <CardContent>
              {client.contacts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No contacts found</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Email</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {client.contacts.map((contact) => (
                      <TableRow key={contact.id}>
                        <TableCell className="font-medium">{contact.fullName}</TableCell>
                        <TableCell>{contact.role || "-"}</TableCell>
                        <TableCell>
                          {contact.phone ? (
                            <a href={`tel:${contact.phone}`} className="text-primary">
                              {contact.phone}
                            </a>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>
                          {contact.email ? (
                            <a href={`mailto:${contact.email}`} className="text-primary">
                              {contact.email}
                            </a>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notes & Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Textarea
                  placeholder="Add a note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={() => newNote && addNoteMutation.mutate(newNote)}
                  disabled={!newNote || addNoteMutation.isPending}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {client.notes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No notes yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {client.notes.map((note) => (
                    <div key={note.id} className="border rounded-lg p-3">
                      <p className="text-sm">{note.content}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {note.createdAt
                          ? new Date(note.createdAt).toLocaleString()
                          : "Unknown date"}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
