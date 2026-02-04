import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Services from "@/pages/Services";
import Contact from "@/pages/Contact";
import Portfolio from "@/pages/Portfolio";
import PortfolioDetail from "@/pages/portfolio/PortfolioDetail";
import ServiceDetail from "@/pages/services/ServiceDetail";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/BackToTop";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { useEffect } from "react";

import AdminLogin from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminLeads from "@/pages/admin/leads";
import AdminLeadDetail from "@/pages/admin/lead-detail";
import AdminClients from "@/pages/admin/clients";
import AdminClientDetail from "@/pages/admin/client-detail";
import AdminAssets from "@/pages/admin/assets";
import AdminAgents from "@/pages/admin/agents";
import AdminAgentDetail from "@/pages/admin/agent-detail";
import AdminEvents from "@/pages/admin/events";
import AdminAnalytics from "@/pages/admin/analytics";
import AdminExternal from "@/pages/admin/external";
import AdminConversations from "@/pages/admin/conversations";
import AdminConfig from "@/pages/admin/config";
import AdminSettings from "@/pages/admin/settings";
import AdminNurturing from "@/pages/admin/nurturing";
import AdminSampleSites from "@/pages/admin/sample-sites";
import AdminApprovalQueue from "@/pages/admin/approval-queue";
import { AdminLayout } from "@/components/admin/AdminLayout";

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}

function PublicRouter() {
  return (
    <div className="flex flex-col min-h-screen relative">
      <AnimatedBackground />
      <ScrollToTop />
      <Navbar />
      <main className="flex-grow relative z-10">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/services" component={Services} />
          <Route path="/services/:slug" component={ServiceDetail} />
          <Route path="/portfolio" component={Portfolio} />
          <Route path="/portfolio/:slug" component={PortfolioDetail} />
          <Route path="/blog" component={Blog} />
          <Route path="/blog/:slug" component={BlogPost} />
          <Route path="/contact" component={Contact} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}

function AdminRouter() {
  return (
    <AdminLayout>
      <Switch>
        <Route path="/admin/dashboard" component={AdminDashboard} />
        <Route path="/admin/leads" component={AdminLeads} />
        <Route path="/admin/leads/:id" component={AdminLeadDetail} />
        <Route path="/admin/clients" component={AdminClients} />
        <Route path="/admin/clients/:id" component={AdminClientDetail} />
        <Route path="/admin/assets" component={AdminAssets} />
        <Route path="/admin/agents" component={AdminAgents} />
        <Route path="/admin/agents/:id" component={AdminAgentDetail} />
        <Route path="/admin/events" component={AdminEvents} />
        <Route path="/admin/analytics" component={AdminAnalytics} />
        <Route path="/admin/external" component={AdminExternal} />
        <Route path="/admin/conversations" component={AdminConversations} />
        <Route path="/admin/config" component={AdminConfig} />
        <Route path="/admin/settings" component={AdminSettings} />
        <Route path="/admin/nurturing" component={AdminNurturing} />
        <Route path="/admin/sample-sites" component={AdminSampleSites} />
        <Route path="/admin/approval-queue" component={AdminApprovalQueue} />
        <Route component={AdminDashboard} />
      </Switch>
    </AdminLayout>
  );
}

function App() {
  const [location] = useLocation();

  if (location === "/admin") {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <AdminLogin />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  if (location.startsWith("/admin/")) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <AdminRouter />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <PublicRouter />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
