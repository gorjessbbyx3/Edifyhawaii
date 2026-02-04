import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  Search,
  Globe,
  Server,
  Mail,
  DollarSign,
  AlertTriangle,
  Calendar,
  ExternalLink,
  Plus,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { ClientAsset, Client, Business } from "@shared/schema";

type EnrichedAsset = ClientAsset & {
  client: Client | null;
  clientName: string | null;
};

const assetTypeIcons: Record<string, typeof Globe> = {
  domain: Globe,
  hosting: Server,
  subscription: DollarSign,
  email: Mail,
  ssl: Globe,
  other: Globe,
};

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

function daysUntil(date: Date | string | null): number | null {
  if (!date) return null;
  const d = new Date(date);
  const now = new Date();
  const diff = d.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function Assets() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("all");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newAsset, setNewAsset] = useState({
    name: "",
    type: "domain",
    provider: "",
    cost: "",
    expiryDate: "",
    notes: "",
    clientId: "",
  });

  const { data: allAssets = [], isLoading: loadingAll } = useQuery<EnrichedAsset[]>({
    queryKey: ["/api/assets"],
  });

  const { data: clients = [] } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });

  const createAssetMutation = useMutation({
    mutationFn: async (data: typeof newAsset) => {
      const response = await apiRequest("POST", "/api/assets", {
        ...data,
        clientId: data.clientId || null,
        cost: data.cost ? parseFloat(data.cost) : 0,
        expiryDate: data.expiryDate || null,
        notes: data.notes || null,
        provider: data.provider || null,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/assets"] });
      setAddDialogOpen(false);
      setNewAsset({
        name: "",
        type: "domain",
        provider: "",
        cost: "",
        expiryDate: "",
        notes: "",
        clientId: "",
      });
      toast({ title: "Asset created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create asset", variant: "destructive" });
    },
  });

  const { data: expiringAssets = [], isLoading: loadingExpiring } = useQuery<EnrichedAsset[]>({
    queryKey: ["/api/assets/expiring", { days: 30 }],
  });

  const filteredAssets = allAssets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.clientName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || asset.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const stats = {
    total: allAssets.length,
    domains: allAssets.filter((a) => a.type === "domain").length,
    hosting: allAssets.filter((a) => a.type === "hosting").length,
    subscriptions: allAssets.filter((a) => a.type === "subscription").length,
    expiringSoon: expiringAssets.length,
    totalMonthlyCost: allAssets.reduce((sum, a) => sum + (a.cost || 0), 0),
  };

  const renderAssetRow = (asset: EnrichedAsset) => {
    const Icon = assetTypeIcons[asset.type] || Globe;
    const days = daysUntil(asset.expiryDate);
    const isExpiringSoon = days !== null && days <= 30 && days > 0;
    const isExpired = days !== null && days <= 0;

    return (
      <TableRow
        key={asset.id}
        className="cursor-pointer hover-elevate"
        onClick={() => asset.client && navigate(`/admin/clients/${asset.client.id}`)}
      >
        <TableCell>
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{asset.name}</span>
          </div>
        </TableCell>
        <TableCell>
          <AssetTypeBadge type={asset.type} />
        </TableCell>
        <TableCell>
          <span className="text-muted-foreground">{asset.clientName || "Unknown"}</span>
        </TableCell>
        <TableCell>{asset.provider || "-"}</TableCell>
        <TableCell>${asset.cost || 0}/mo</TableCell>
        <TableCell>
          <AssetStatusBadge status={asset.status} />
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            {isExpired ? (
              <span className="text-red-600 font-medium flex items-center gap-1">
                <AlertTriangle className="h-4 w-4" />
                Expired
              </span>
            ) : isExpiringSoon ? (
              <span className="text-yellow-600 font-medium flex items-center gap-1">
                <AlertTriangle className="h-4 w-4" />
                {days} days
              </span>
            ) : asset.expiryDate ? (
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                {new Date(asset.expiryDate).toLocaleDateString()}
              </span>
            ) : (
              "-"
            )}
          </div>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Assets</h1>
          <p className="text-muted-foreground">
            Track domains, hosting, and subscriptions across all clients
          </p>
        </div>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-asset">
              <Plus className="h-4 w-4 mr-2" />
              Add Asset
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Asset</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createAssetMutation.mutate(newAsset);
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="asset-name">Asset Name</Label>
                <Input
                  id="asset-name"
                  placeholder="e.g., example.com"
                  value={newAsset.name}
                  onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                  required
                  data-testid="input-asset-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="asset-type">Type</Label>
                <Select
                  value={newAsset.type}
                  onValueChange={(value) => setNewAsset({ ...newAsset, type: value })}
                >
                  <SelectTrigger id="asset-type" data-testid="select-asset-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="domain">Domain</SelectItem>
                    <SelectItem value="hosting">Hosting</SelectItem>
                    <SelectItem value="subscription">Subscription</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="ssl">SSL Certificate</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="asset-client">Client (Optional)</Label>
                <Select
                  value={newAsset.clientId}
                  onValueChange={(value) => setNewAsset({ ...newAsset, clientId: value })}
                >
                  <SelectTrigger id="asset-client" data-testid="select-asset-client">
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No client</SelectItem>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="asset-provider">Provider</Label>
                <Input
                  id="asset-provider"
                  placeholder="e.g., GoDaddy, AWS"
                  value={newAsset.provider}
                  onChange={(e) => setNewAsset({ ...newAsset, provider: e.target.value })}
                  data-testid="input-asset-provider"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="asset-cost">Monthly Cost ($)</Label>
                  <Input
                    id="asset-cost"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={newAsset.cost}
                    onChange={(e) => setNewAsset({ ...newAsset, cost: e.target.value })}
                    data-testid="input-asset-cost"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="asset-expiry">Expiry Date</Label>
                  <Input
                    id="asset-expiry"
                    type="date"
                    value={newAsset.expiryDate}
                    onChange={(e) => setNewAsset({ ...newAsset, expiryDate: e.target.value })}
                    data-testid="input-asset-expiry"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="asset-notes">Notes</Label>
                <Textarea
                  id="asset-notes"
                  placeholder="Additional notes..."
                  value={newAsset.notes}
                  onChange={(e) => setNewAsset({ ...newAsset, notes: e.target.value })}
                  data-testid="input-asset-notes"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setAddDialogOpen(false)}
                  data-testid="button-cancel-asset"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createAssetMutation.isPending || !newAsset.name}
                  data-testid="button-submit-asset"
                >
                  {createAssetMutation.isPending ? "Creating..." : "Create Asset"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium">Domains</CardTitle>
            <Globe className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.domains}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium">Hosting</CardTitle>
            <Server className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.hosting}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.subscriptions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.expiringSoon}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalMonthlyCost.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Assets</TabsTrigger>
          <TabsTrigger value="expiring">
            Expiring Soon ({expiringAssets.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <CardTitle>All Assets</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search assets..."
                      className="pl-8 w-64"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      data-testid="input-search-assets"
                    />
                  </div>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-32" data-testid="select-type-filter">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="domain">Domain</SelectItem>
                      <SelectItem value="hosting">Hosting</SelectItem>
                      <SelectItem value="subscription">Subscription</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="ssl">SSL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loadingAll ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : filteredAssets.length === 0 ? (
                <div className="text-center py-12">
                  <Globe className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No assets found</h3>
                  <p className="text-muted-foreground">
                    Add assets to clients to track them here
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Asset</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead>Cost</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Expiry</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>{filteredAssets.map(renderAssetRow)}</TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expiring" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Expiring in Next 30 Days
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingExpiring ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : expiringAssets.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No assets expiring soon</h3>
                  <p className="text-muted-foreground">
                    All assets are up to date
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Asset</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead>Cost</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Expiry</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>{expiringAssets.map(renderAssetRow)}</TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
