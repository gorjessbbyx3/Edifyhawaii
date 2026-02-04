import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Phone, Mail, MapPin, Clock, Star, ArrowRight } from "lucide-react";

interface SampleSite {
  id: string;
  businessName: string;
  tagline: string | null;
  industry: string | null;
  heroImageUrl: string | null;
  primaryColor: string | null;
  services: string[] | null;
  testimonials: Array<{ name: string; text: string; rating: number }> | null;
  contactInfo: { phone?: string; email?: string; address?: string; hours?: string } | null;
  callToAction: string | null;
  generatedHtml: string | null;
}

export default function SamplePreview() {
  const params = useParams<{ slug: string }>();
  
  const { data: site, isLoading, error } = useQuery<SampleSite>({
    queryKey: ["/api/sample", params.slug],
    enabled: !!params.slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="h-64 bg-muted animate-pulse" />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-12 w-64 mb-4" />
          <Skeleton className="h-6 w-96 mb-8" />
          <div className="grid md:grid-cols-3 gap-6">
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !site) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-2">Site Not Found</h1>
            <p className="text-muted-foreground">
              This sample site is no longer available or doesn't exist.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const primaryColor = site.primaryColor || "#3b82f6";

  return (
    <div className="min-h-screen bg-background">
      <div 
        className="relative h-80 flex items-center justify-center"
        style={{ 
          background: site.heroImageUrl 
            ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(${site.heroImageUrl}) center/cover`
            : `linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd)`
        }}
      >
        <div className="text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{site.businessName}</h1>
          {site.tagline && (
            <p className="text-xl md:text-2xl opacity-90 mb-6">{site.tagline}</p>
          )}
          <Button size="lg" className="bg-white text-black hover:bg-gray-100">
            {site.callToAction || "Get Started"} <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      {site.services && site.services.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {site.services.map((service, index) => (
                <Card key={index} className="hover-elevate">
                  <CardContent className="p-6 text-center">
                    <div 
                      className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center"
                      style={{ backgroundColor: `${primaryColor}20` }}
                    >
                      <Star className="h-6 w-6" style={{ color: primaryColor }} />
                    </div>
                    <h3 className="text-lg font-semibold">{service}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {site.testimonials && site.testimonials.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {site.testimonials.map((testimonial, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-3">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4">"{testimonial.text}"</p>
                    <p className="font-semibold">- {testimonial.name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {site.contactInfo && (
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Contact Us</h2>
            <div className="max-w-2xl mx-auto grid sm:grid-cols-2 gap-6">
              {site.contactInfo.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <span>{site.contactInfo.phone}</span>
                </div>
              )}
              {site.contactInfo.email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <span>{site.contactInfo.email}</span>
                </div>
              )}
              {site.contactInfo.address && (
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <span>{site.contactInfo.address}</span>
                </div>
              )}
              {site.contactInfo.hours && (
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span>{site.contactInfo.hours}</span>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      <footer className="py-8 border-t text-center text-muted-foreground">
        <p className="text-sm">
          This is a sample website created by EDIFY Limited to demonstrate what we can build for you.
        </p>
        <p className="text-sm mt-2">
          Interested? <a href="https://edifylimited.com" className="underline" style={{ color: primaryColor }}>Contact us today</a>
        </p>
      </footer>
    </div>
  );
}
