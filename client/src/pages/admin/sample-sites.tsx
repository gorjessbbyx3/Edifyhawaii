import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Globe,
  QrCode,
  Eye,
  Edit,
  Trash2,
  ExternalLink,
  Copy,
  Plus,
  RefreshCw,
  Calendar,
  Palette,
  Image,
  FileText,
  Star,
  Phone,
  Mail,
  Clock,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface SampleSite {
  id: string;
  leadId: string;
  businessId: string;
  slug: string;
  businessName: string;
  tagline?: string;
  industry?: string;
  heroImageUrl?: string;
  colorScheme?: { primary: string; secondary: string; accent: string };
  aboutText?: string;
  servicesJson?: Array<{ name: string; description: string; price?: string }>;
  contactInfo?: { phone?: string; email?: string; address?: string; hours?: string };
  testimonials?: Array<{ name: string; text: string; rating: number }>;
  galleryImages?: string[];
  hasOnlineBooking?: boolean;
  hasContactForm?: boolean;
  hasGoogleMap?: boolean;
  hasSocialLinks?: boolean;
  qrCodeDataUrl?: string;
  viewCount: number;
  lastViewedAt?: string;
  status: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface Lead {
  id: string;
  businessId: string;
  status: string;
  business?: {
    name: string;
    industry?: string;
  };
}

function SampleSiteCard({
  site,
  onView,
  onEdit,
  onDelete,
  onCopyLink,
}: {
  site: SampleSite;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onCopyLink: () => void;
}) {
  const siteUrl = `${window.location.origin}/sample/${site.slug}`;
  const isExpired = site.expiresAt && new Date(site.expiresAt) < new Date();

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              {site.businessName}
            </CardTitle>
            <CardDescription className="mt-1">
              {site.tagline || `${site.industry || "Business"} website preview`}
            </CardDescription>
          </div>
          <Badge variant={isExpired ? "destructive" : site.status === "active" ? "default" : "secondary"}>
            {isExpired ? "Expired" : site.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        {/* Preview with color scheme */}
        <div
          className="h-32 rounded-lg flex items-center justify-center relative overflow-hidden"
          style={{
            background: site.colorScheme
              ? `linear-gradient(135deg, ${site.colorScheme.primary} 0%, ${site.colorScheme.secondary} 100%)`
              : "linear-gradient(135deg, #1976D2 0%, #455A64 100%)",
          }}
        >
          <div className="text-white text-center px-4">
            <p className="font-bold text-lg">{site.businessName}</p>
            <p className="text-sm opacity-80">{site.tagline || "Professional website"}</p>
          </div>
          {site.qrCodeDataUrl && (
            <div className="absolute bottom-2 right-2 bg-white p-1 rounded">
              <img src={site.qrCodeDataUrl} alt="QR Code" className="w-12 h-12" />
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-muted-foreground" />
            <span>{site.viewCount} views</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>
              {site.expiresAt
                ? `Expires ${new Date(site.expiresAt).toLocaleDateString()}`
                : "No expiry"}
            </span>
          </div>
        </div>

        {/* URL */}
        <div className="flex items-center gap-2 bg-muted p-2 rounded text-sm">
          <code className="flex-1 truncate text-xs">{siteUrl}</code>
          <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={onCopyLink}>
            <Copy className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 gap-2">
        <Button variant="outline" size="sm" className="flex-1" onClick={onView}>
          <ExternalLink className="h-4 w-4 mr-1" />
          Preview
        </Button>
        <Button variant="outline" size="sm" className="flex-1" onClick={onEdit}>
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
        <Button variant="ghost" size="icon" className="shrink-0 text-destructive" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}

function EditSampleSiteDialog({
  site,
  open,
  onOpenChange,
  onSave,
}: {
  site: SampleSite;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updates: Partial<SampleSite>) => void;
}) {
  const [formData, setFormData] = useState({
    tagline: site.tagline || "",
    aboutText: site.aboutText || "",
    services: site.servicesJson || [],
    testimonials: site.testimonials || [],
    contactInfo: site.contactInfo || {},
    colorScheme: site.colorScheme || { primary: "#1976D2", secondary: "#455A64", accent: "#FF7043" },
  });

  const [newService, setNewService] = useState({ name: "", description: "", price: "" });
  const [newTestimonial, setNewTestimonial] = useState({ name: "", text: "", rating: 5 });

  const handleSave = () => {
    onSave({
      tagline: formData.tagline,
      aboutText: formData.aboutText,
      servicesJson: formData.services,
      testimonials: formData.testimonials,
      contactInfo: formData.contactInfo,
      colorScheme: formData.colorScheme,
    });
  };

  const addService = () => {
    if (newService.name && newService.description) {
      setFormData({
        ...formData,
        services: [...formData.services, newService],
      });
      setNewService({ name: "", description: "", price: "" });
    }
  };

  const removeService = (index: number) => {
    setFormData({
      ...formData,
      services: formData.services.filter((_, i) => i !== index),
    });
  };

  const addTestimonial = () => {
    if (newTestimonial.name && newTestimonial.text) {
      setFormData({
        ...formData,
        testimonials: [...formData.testimonials, newTestimonial],
      });
      setNewTestimonial({ name: "", text: "", rating: 5 });
    }
  };

  const removeTestimonial = (index: number) => {
    setFormData({
      ...formData,
      testimonials: formData.testimonials.filter((_, i) => i !== index),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Sample Site: {site.businessName}</DialogTitle>
          <DialogDescription>
            Customize the sample website content to make it more compelling for this lead.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="content" className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="content">
              <FileText className="h-4 w-4 mr-1" />
              Content
            </TabsTrigger>
            <TabsTrigger value="services">
              <Star className="h-4 w-4 mr-1" />
              Services
            </TabsTrigger>
            <TabsTrigger value="reviews">
              <Star className="h-4 w-4 mr-1" />
              Reviews
            </TabsTrigger>
            <TabsTrigger value="design">
              <Palette className="h-4 w-4 mr-1" />
              Design
            </TabsTrigger>
          </TabsList>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline</Label>
              <Input
                id="tagline"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                placeholder="Your trusted partner in Hawaii"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="about">About Section</Label>
              <Textarea
                id="about"
                value={formData.aboutText}
                onChange={(e) => setFormData({ ...formData, aboutText: e.target.value })}
                placeholder="Tell their story..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">
                  <Phone className="h-4 w-4 inline mr-1" />
                  Phone
                </Label>
                <Input
                  id="phone"
                  value={formData.contactInfo.phone || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contactInfo: { ...formData.contactInfo, phone: e.target.value },
                    })
                  }
                  placeholder="(808) 555-0123"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">
                  <Mail className="h-4 w-4 inline mr-1" />
                  Email
                </Label>
                <Input
                  id="email"
                  value={formData.contactInfo.email || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contactInfo: { ...formData.contactInfo, email: e.target.value },
                    })
                  }
                  placeholder="contact@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hours">
                <Clock className="h-4 w-4 inline mr-1" />
                Business Hours
              </Label>
              <Input
                id="hours"
                value={formData.contactInfo.hours || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contactInfo: { ...formData.contactInfo, hours: e.target.value },
                  })
                }
                placeholder="Mon-Fri: 9am-6pm, Sat: 10am-4pm"
              />
            </div>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-4 mt-4">
            <div className="space-y-2">
              {formData.services.map((service, index) => (
                <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{service.name}</p>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                    {service.price && (
                      <p className="text-sm font-medium text-primary">{service.price}</p>
                    )}
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeService(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-3">
              <p className="font-medium">Add New Service</p>
              <div className="grid grid-cols-3 gap-2">
                <Input
                  placeholder="Service name"
                  value={newService.name}
                  onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                />
                <Input
                  placeholder="Description"
                  value={newService.description}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                />
                <Input
                  placeholder="Price (optional)"
                  value={newService.price}
                  onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                />
              </div>
              <Button onClick={addService} variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-1" />
                Add Service
              </Button>
            </div>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-4 mt-4">
            <div className="space-y-2">
              {formData.testimonials.map((testimonial, index) => (
                <div key={index} className="flex items-start gap-2 p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{testimonial.name}</p>
                      <span className="text-yellow-500">
                        {"★".repeat(testimonial.rating)}
                        {"☆".repeat(5 - testimonial.rating)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">"{testimonial.text}"</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeTestimonial(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-3">
              <p className="font-medium">Add New Testimonial</p>
              <div className="space-y-2">
                <Input
                  placeholder="Customer name (e.g., Sarah K.)"
                  value={newTestimonial.name}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                />
                <Textarea
                  placeholder="Their review text..."
                  value={newTestimonial.text}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, text: e.target.value })}
                  rows={2}
                />
                <div className="flex items-center gap-2">
                  <Label>Rating:</Label>
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setNewTestimonial({ ...newTestimonial, rating })}
                      className={`text-xl ${
                        rating <= newTestimonial.rating ? "text-yellow-500" : "text-gray-300"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <Button onClick={addTestimonial} variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-1" />
                Add Testimonial
              </Button>
            </div>
          </TabsContent>

          {/* Design Tab */}
          <TabsContent value="design" className="space-y-4 mt-4">
            <p className="text-sm text-muted-foreground">
              Customize the color scheme for the sample website.
            </p>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primary">Primary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="primary"
                    type="color"
                    value={formData.colorScheme.primary}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        colorScheme: { ...formData.colorScheme, primary: e.target.value },
                      })
                    }
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    value={formData.colorScheme.primary}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        colorScheme: { ...formData.colorScheme, primary: e.target.value },
                      })
                    }
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondary">Secondary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="secondary"
                    type="color"
                    value={formData.colorScheme.secondary}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        colorScheme: { ...formData.colorScheme, secondary: e.target.value },
                      })
                    }
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    value={formData.colorScheme.secondary}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        colorScheme: { ...formData.colorScheme, secondary: e.target.value },
                      })
                    }
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="accent">Accent Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="accent"
                    type="color"
                    value={formData.colorScheme.accent}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        colorScheme: { ...formData.colorScheme, accent: e.target.value },
                      })
                    }
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    value={formData.colorScheme.accent}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        colorScheme: { ...formData.colorScheme, accent: e.target.value },
                      })
                    }
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="mt-4">
              <Label>Preview</Label>
              <div
                className="h-24 rounded-lg mt-2 flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${formData.colorScheme.primary} 0%, ${formData.colorScheme.secondary} 100%)`,
                }}
              >
                <Button
                  style={{ backgroundColor: formData.colorScheme.accent }}
                  className="text-white"
                >
                  Sample Button
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function SampleSitesPage() {
  const { toast } = useToast();
  const [selectedSite, setSelectedSite] = useState<SampleSite | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // Fetch all leads to show their sample sites
  const { data: leads, isLoading: leadsLoading } = useQuery<Lead[]>({
    queryKey: ["/api/leads"],
  });

  // Fetch sample sites for each lead
  const { data: allSampleSites, isLoading: sitesLoading } = useQuery<SampleSite[]>({
    queryKey: ["/api/sample-sites/all"],
    queryFn: async () => {
      // Fetch sample sites for all leads
      if (!leads || leads.length === 0) return [];

      const sitesPromises = leads.map(async (lead) => {
        try {
          const response = await fetch(`/api/leads/${lead.id}/sample-sites`);
          if (response.ok) {
            return await response.json();
          }
          return [];
        } catch {
          return [];
        }
      });

      const results = await Promise.all(sitesPromises);
      return results.flat();
    },
    enabled: !!leads && leads.length > 0,
  });

  const updateSiteMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<SampleSite> }) => {
      const response = await fetch(`/api/sample-sites/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error("Failed to update sample site");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Sample site updated",
        description: "The changes have been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/sample-sites/all"] });
      setEditDialogOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update sample site. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteSiteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/sample-sites/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete sample site");
    },
    onSuccess: () => {
      toast({
        title: "Sample site deleted",
        description: "The sample site has been removed.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/sample-sites/all"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete sample site. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCopyLink = (site: SampleSite) => {
    const url = `${window.location.origin}/sample/${site.slug}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied",
      description: "Sample site URL copied to clipboard.",
    });
  };

  const handleView = (site: SampleSite) => {
    window.open(`/sample/${site.slug}`, "_blank");
  };

  const handleEdit = (site: SampleSite) => {
    setSelectedSite(site);
    setEditDialogOpen(true);
  };

  const handleDelete = (site: SampleSite) => {
    if (confirm(`Are you sure you want to delete the sample site for ${site.businessName}?`)) {
      deleteSiteMutation.mutate(site.id);
    }
  };

  const handleSave = (updates: Partial<SampleSite>) => {
    if (selectedSite) {
      updateSiteMutation.mutate({ id: selectedSite.id, updates });
    }
  };

  const isLoading = leadsLoading || sitesLoading;
  const sampleSites = allSampleSites || [];

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Globe className="h-8 w-8 text-primary" />
            Sample Sites
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage personalized website previews for your leads
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/sample-sites/all"] })}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Sample Sites
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sampleSites.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Sites</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {sampleSites.filter((s) => s.status === "active").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {sampleSites.reduce((sum, s) => sum + (s.viewCount || 0), 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Expiring Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {
                sampleSites.filter((s) => {
                  if (!s.expiresAt) return false;
                  const daysUntilExpiry =
                    (new Date(s.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
                  return daysUntilExpiry > 0 && daysUntilExpiry <= 7;
                }).length
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sample Sites Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-48 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : sampleSites.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Globe className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No Sample Sites Yet</h3>
            <p className="text-muted-foreground mt-2">
              Sample sites are automatically generated when leads are enrolled in nurturing sequences.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleSites.map((site) => (
            <SampleSiteCard
              key={site.id}
              site={site}
              onView={() => handleView(site)}
              onEdit={() => handleEdit(site)}
              onDelete={() => handleDelete(site)}
              onCopyLink={() => handleCopyLink(site)}
            />
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      {selectedSite && (
        <EditSampleSiteDialog
          site={selectedSite}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
