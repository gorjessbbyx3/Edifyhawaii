import { motion } from "framer-motion";
import { CheckCircle2, Server, Code, BarChart, Lock, Phone } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Services() {
  return (
    <div className="pt-32 pb-24">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-6">
            Technology Solutions for <br/> <span className="text-primary">Modern Business</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            We bridge the gap between complex technology and your business goals. 
            From keeping the lights on to building the future.
          </p>
        </div>
      </section>

      {/* Managed IT Section */}
      <section className="mb-24 bg-secondary/20 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block p-3 bg-primary/10 rounded-xl text-primary mb-2">
                <Server className="w-8 h-8" />
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold">Managed IT Services</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Think of us as your IT department down the hall, just virtual. We monitor your systems 24/7 to catch issues before they disrupt your business.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <FeatureItem text="24/7 Network Monitoring" />
                <FeatureItem text="Help Desk Support" />
                <FeatureItem text="Data Backup & Recovery" />
                <FeatureItem text="Email & Office 365 Management" />
                <FeatureItem text="Cybersecurity Protection" />
                <FeatureItem text="Vendor Management" />
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-2xl transform rotate-3" />
              {/* server room data center IT technician */}
              <img 
                src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80" 
                alt="IT Support" 
                className="relative rounded-2xl shadow-2xl border border-white"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Custom Dev Section */}
      <section className="mb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="absolute inset-0 bg-gradient-to-tl from-accent/20 to-transparent rounded-2xl transform -rotate-3" />
              {/* developer coding on laptop screen close up */}
              <img 
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80" 
                alt="Software Development" 
                className="relative rounded-2xl shadow-2xl border border-white"
              />
            </div>

            <div className="order-1 lg:order-2 space-y-6">
              <div className="inline-block p-3 bg-accent/10 rounded-xl text-accent mb-2">
                <Code className="w-8 h-8" />
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold">Custom Development</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Off-the-shelf software doesn't always fit. We build custom web applications, websites, and dashboards tailored to your specific workflow.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <FeatureItem text="Custom Web Apps" />
                <FeatureItem text="E-commerce Websites" />
                <FeatureItem text="Internal Dashboards" />
                <FeatureItem text="API Integrations" />
                <FeatureItem text="Mobile-First Design" />
                <FeatureItem text="Cloud Migration" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing/Engagement Model Hint */}
      <section className="bg-primary text-white py-20">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-display font-bold">Simple, Transparent Partnership</h2>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            No hidden fees. No confusing jargon. Just honest work and reliable technology for your business.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
              <Phone className="w-10 h-10 mx-auto mb-4 opacity-80" />
              <h3 className="font-bold text-xl mb-2">1. Consultation</h3>
              <p className="text-sm opacity-75">We listen to your needs and audit your current setup completely free.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
              <BarChart className="w-10 h-10 mx-auto mb-4 opacity-80" />
              <h3 className="font-bold text-xl mb-2">2. Strategy</h3>
              <p className="text-sm opacity-75">We propose a tailored plan that fits your budget and goals.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
              <Lock className="w-10 h-10 mx-auto mb-4 opacity-80" />
              <h3 className="font-bold text-xl mb-2">3. Execution</h3>
              <p className="text-sm opacity-75">We implement, monitor, and support so you can rest easy.</p>
            </div>
          </div>
          <div className="pt-8">
             <Link href="/contact">
              <Button size="lg" className="bg-accent text-white hover:bg-accent/90 border-none">
                Start the Conversation
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
      <span className="text-foreground font-medium">{text}</span>
    </div>
  );
}
