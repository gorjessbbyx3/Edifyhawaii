import { Switch, Route } from "wouter";
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
import { useLocation } from "wouter";

// Scroll to top on route change
function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}

function Router() {
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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
