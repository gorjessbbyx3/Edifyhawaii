import { motion } from "framer-motion";
import { ArrowLeft, Layout, Smartphone, Map, Bell, Clock, Database } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const features = [
  {
    icon: <Layout className="w-6 h-6" />,
    title: "Dispatch Overview",
    description: "Real-time fleet status dashboard with high-priority job alerts and revenue tracking."
  },
  {
    icon: <Map className="w-6 h-6" />,
    title: "Live Fleet Tracking",
    description: "Interactive map integration for real-time driver positioning and job assignment."
  },
  {
    icon: <Bell className="w-6 h-6" />,
    title: "Smart Notifications",
    description: "Automated alerts for pending jobs and attention-required status updates."
  },
  {
    icon: <Database className="w-6 h-6" />,
    title: "Job Management",
    description: "Complete lifecycle tracking from request to completion with automated invoicing."
  }
];

export default function TowDispatch() {
  return (
    <div className="pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/portfolio">
          <Button variant="ghost" className="mb-8 hover:bg-secondary">
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Portfolio
          </Button>
        </Link>

        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
          }}
          className="space-y-16"
        >
          {/* Header */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <motion.div variants={fadeIn} className="inline-flex items-center space-x-2 bg-primary/10 rounded-full px-4 py-1">
                <span className="text-xs font-bold text-primary uppercase tracking-wider">Project Example</span>
              </motion.div>
              <motion.h1 variants={fadeIn} className="text-4xl md:text-6xl font-display font-bold">
                Poorman Towing <br />
                <span className="text-primary">Website & Dashboard</span>
              </motion.h1>
              <motion.p variants={fadeIn} className="text-lg text-muted-foreground leading-relaxed">
                An example of the custom technical infrastructure Edify built for Poorman Towing. This includes a high-performance public website and a proprietary, custom-built dispatch dashboard for fleet management.
              </motion.p>
            </div>
            <motion.div variants={fadeIn} className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-border bg-white">
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bbda38a5f971?w=800&auto=format&fit=crop&q=80" 
                  alt="Dispatch Dashboard" 
                  className="w-full h-auto"
                />
              </div>
            </motion.div>
          </div>

          {/* Web Frame Section */}
          <section className="py-16 space-y-8">
            <motion.h2 variants={fadeIn} className="text-3xl font-display font-bold text-center">Live Preview</motion.h2>
            <motion.div 
              variants={fadeIn}
              className="rounded-2xl overflow-hidden shadow-2xl border-8 border-slate-800 bg-slate-800 aspect-video relative"
            >
              <div className="absolute top-0 left-0 right-0 h-8 bg-slate-700 flex items-center px-4 space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <div className="ml-4 flex-grow bg-slate-800 rounded px-3 py-0.5 text-[10px] text-slate-400 font-mono truncate">
                  https://www.poormantowing.com
                </div>
              </div>
              <div className="absolute inset-0 pt-8">
                <iframe 
                  src="https://www.poormantowing.com" 
                  className="w-full h-full bg-white"
                  title="Poorman Towing Live Website"
                  loading="lazy"
                />
              </div>
            </motion.div>
            <div className="text-center">
              <Link href="https://www.poormantowing.com" target="_blank">
                <Button variant="outline" size="sm">
                  Open in New Tab
                </Button>
              </Link>
            </div>
          </section>

          {/* Screenshot Gallery Section */}
          <section className="py-16 space-y-12">
            <motion.h2 variants={fadeIn} className="text-3xl font-display font-bold text-center">Custom Built Dispatch Dashboard</motion.h2>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto -mt-8">
              Visuals of the proprietary dashboard we developed to manage complex dispatch workflows and real-time fleet operations.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div variants={fadeIn} className="space-y-4">
                <div className="rounded-xl overflow-hidden shadow-lg border border-border aspect-[9/16]">
                  <img src="/attached_assets/IMG_6014_1768353676737.jpeg" alt="Mobile Dashboard Overview" className="w-full h-full object-cover" />
                </div>
                <p className="text-center text-sm font-medium">Dashboard Mobile View</p>
              </motion.div>
              <motion.div variants={fadeIn} className="space-y-4">
                <div className="rounded-xl overflow-hidden shadow-lg border border-border aspect-[9/16]">
                  <img src="/attached_assets/IMG_6016_1768353676737.jpeg" alt="Side Navigation" className="w-full h-full object-cover" />
                </div>
                <p className="text-center text-sm font-medium">Internal Navigation System</p>
              </motion.div>
              <motion.div variants={fadeIn} className="space-y-4">
                <div className="rounded-xl overflow-hidden shadow-lg border border-border aspect-[1.5/1]">
                  <img src="/attached_assets/IMG_6020_1768353676737.jpeg" alt="Job Management Desktop" className="w-full h-full object-cover" />
                </div>
                <p className="text-center text-sm font-medium">Desktop Job Management</p>
              </motion.div>
            </div>
          </section>

          {/* Features Grid */}
          <section className="py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn}
                  className="p-8 bg-white rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="p-3 bg-primary/10 rounded-xl w-fit mb-6 text-primary">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold font-display mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Results Section */}
          <motion.div variants={fadeIn} className="bg-primary text-white rounded-3xl p-12 text-center overflow-hidden relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
            <div className="relative z-10 space-y-6">
              <h2 className="text-3xl font-display font-bold">The Result</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                <div>
                  <div className="text-4xl font-bold mb-2">45%</div>
                  <div className="text-primary-foreground/80 text-sm uppercase tracking-widest">Efficiency Increase</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">100%</div>
                  <div className="text-primary-foreground/80 text-sm uppercase tracking-widest">Digital Transition</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2"><Clock className="inline-block mr-2" /> 24/7</div>
                  <div className="text-primary-foreground/80 text-sm uppercase tracking-widest">Operational Status</div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
