import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Layout, Map, Bell, Database, Clock, Users } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import imgDashboard from "@assets/IMG_6090_1768554040490.jpeg";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function PoormanDashboard() {
  return (
    <div className="pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/portfolio">
          <Button variant="ghost" className="mb-8" data-testid="button-back-portfolio">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <motion.div variants={fadeIn} className="inline-flex items-center space-x-2 bg-orange-500/10 rounded-full px-4 py-1">
                <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">Custom Software</span>
              </motion.div>
              <motion.h1 variants={fadeIn} className="text-4xl md:text-6xl font-display font-bold text-white">
                Poorman808 <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">Dispatch Dashboard</span>
              </motion.h1>
              <motion.p variants={fadeIn} className="text-lg text-slate-400 leading-relaxed">
                A proprietary dispatch management system custom-built for Poorman Towing. Features real-time fleet tracking, job queue management, automated invoicing, and live map integration for seamless towing operations.
              </motion.p>
              <motion.div variants={fadeIn} className="flex gap-4">
                <a href="https://poorman808-dashboard.vercel.app/" target="_blank" rel="noopener noreferrer">
                  <Button className="bg-orange-500 hover:bg-orange-600" data-testid="button-visit-poorman-dashboard">
                    View Live Dashboard
                    <ExternalLink className="ml-2 w-4 h-4" />
                  </Button>
                </a>
              </motion.div>
            </div>
            
            <motion.div 
              variants={fadeIn}
              className="rounded-2xl overflow-hidden shadow-2xl border-8 border-slate-800 bg-slate-800 aspect-[16/10] relative"
            >
              <div className="absolute top-0 left-0 right-0 h-8 bg-slate-700 flex items-center px-4 space-x-2 z-20">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <div className="ml-4 flex-grow bg-slate-800 rounded px-3 py-0.5 text-[10px] text-slate-400 font-mono truncate">
                  poorman808-dashboard.vercel.app
                </div>
              </div>
              <div className="absolute inset-0 pt-8 overflow-hidden bg-slate-900">
                <img 
                  src={imgDashboard} 
                  className="w-full h-full object-cover"
                  alt="Poorman808 Dispatch Dashboard"
                />
              </div>
            </motion.div>
          </div>

          <section className="py-16">
            <motion.h2 variants={fadeIn} className="text-3xl font-display font-bold text-center text-white mb-12">Dashboard Features</motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <motion.div variants={fadeIn} className="p-8 bg-slate-900/40 border border-white/5 rounded-2xl shadow-sm backdrop-blur-sm">
                <div className="p-3 bg-orange-500/10 rounded-xl w-fit mb-6 text-orange-400">
                  <Layout className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-display mb-3 text-white">Dispatch Overview</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Real-time fleet status with pending, in-progress, and completed job tracking plus revenue metrics.</p>
              </motion.div>
              <motion.div variants={fadeIn} className="p-8 bg-slate-900/40 border border-white/5 rounded-2xl shadow-sm backdrop-blur-sm">
                <div className="p-3 bg-red-500/10 rounded-xl w-fit mb-6 text-red-400">
                  <Map className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-display mb-3 text-white">Live Fleet Tracking</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Interactive map integration showing real-time driver positions across Honolulu and Oahu.</p>
              </motion.div>
              <motion.div variants={fadeIn} className="p-8 bg-slate-900/40 border border-white/5 rounded-2xl shadow-sm backdrop-blur-sm">
                <div className="p-3 bg-orange-500/10 rounded-xl w-fit mb-6 text-orange-400">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-display mb-3 text-white">Job Queue</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Streamlined job management with priority handling and automated status updates.</p>
              </motion.div>
              <motion.div variants={fadeIn} className="p-8 bg-slate-900/40 border border-white/5 rounded-2xl shadow-sm backdrop-blur-sm">
                <div className="p-3 bg-red-500/10 rounded-xl w-fit mb-6 text-red-400">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-display mb-3 text-white">Fleet Management</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Driver availability tracking with online, on-job, and offline status indicators.</p>
              </motion.div>
              <motion.div variants={fadeIn} className="p-8 bg-slate-900/40 border border-white/5 rounded-2xl shadow-sm backdrop-blur-sm">
                <div className="p-3 bg-orange-500/10 rounded-xl w-fit mb-6 text-orange-400">
                  <Database className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-display mb-3 text-white">Invoicing System</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Automated invoice generation with customer management and payment tracking.</p>
              </motion.div>
              <motion.div variants={fadeIn} className="p-8 bg-slate-900/40 border border-white/5 rounded-2xl shadow-sm backdrop-blur-sm">
                <div className="p-3 bg-red-500/10 rounded-xl w-fit mb-6 text-red-400">
                  <Bell className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-display mb-3 text-white">Inspections</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Vehicle inspection tracking and documentation management for fleet compliance.</p>
              </motion.div>
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
