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
import TowDispatch from "@/pages/portfolio/TowDispatch";
import RealtorPro from "@/pages/portfolio/RealtorPro";
import AllIn1Bonding from "@/pages/portfolio/AllIn1Bonding";
import OahuEliteTours from "@/pages/portfolio/OahuEliteTours";
import MartinLaw from "@/pages/portfolio/MartinLaw";
import SonsAuto from "@/pages/portfolio/SonsAuto";
import StreetPatrol from "@/pages/portfolio/StreetPatrol";
import CaptureByChristian from "@/pages/portfolio/CaptureByChristian";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
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
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <Navbar />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/services" component={Services} />
          <Route path="/portfolio" component={Portfolio} />
          <Route path="/portfolio/tow-dispatch" component={TowDispatch} />
          <Route path="/portfolio/realtor-pro" component={RealtorPro} />
          <Route path="/portfolio/all-in-1-bonding" component={AllIn1Bonding} />
          <Route path="/portfolio/oahu-elite-tours" component={OahuEliteTours} />
          <Route path="/portfolio/martin-law" component={MartinLaw} />
          <Route path="/portfolio/sons-auto" component={SonsAuto} />
          <Route path="/portfolio/street-patrol" component={StreetPatrol} />
          <Route path="/portfolio/capture-by-christian" component={CaptureByChristian} />
          <Route path="/contact" component={Contact} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
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
