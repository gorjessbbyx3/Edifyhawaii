import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Globe, Search, Smartphone, Zap } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function PoormanWebsite() {
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
          <section className="py-16 space-y-8">
            <motion.h2 variants={fadeIn} className="text-3xl font-display font-bold text-center text-white">Live Website Preview</motion.h2>
            <motion.div 
              variants={fadeIn}
              className="rounded-2xl overflow-hidden shadow-2xl border-8 border-slate-800 bg-slate-800 aspect-[16/10] relative"
            >
              <div className="absolute top-0 left-0 right-0 h-8 bg-slate-700 flex items-center px-4 space-x-2 z-20">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <div className="ml-4 flex-grow bg-slate-800 rounded px-3 py-0.5 text-[10px] text-slate-400 font-mono truncate">
                  https://www.poormantowing.com
                </div>
              </div>
              <div className="absolute inset-0 pt-8 overflow-hidden bg-slate-800">
                <div 
                  className="w-[1280px] h-[800px] origin-top-left"
                  style={{ transform: 'scale(calc(100cqw / 1280))' }}
                >
                  <iframe 
                    src="https://www.poormantowing.com" 
                    className="w-full h-full bg-white"
                    title="Poorman Towing Live Website"
                    loading="lazy"
                  />
                </div>
              </div>
            </motion.div>
            <div className="text-center">
              <a href="https://www.poormantowing.com" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" data-testid="button-open-poorman-website">
                  Open in New Tab
                  <ExternalLink className="ml-2 w-4 h-4" />
                </Button>
              </a>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <motion.div variants={fadeIn} className="inline-flex items-center space-x-2 bg-blue-500/10 rounded-full px-4 py-1">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Marketing Website</span>
              </motion.div>
              <motion.h1 variants={fadeIn} className="text-4xl md:text-6xl font-display font-bold text-white">
                PoormanTowing.com <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Lead Generation</span>
              </motion.h1>
              <motion.p variants={fadeIn} className="text-lg text-slate-400 leading-relaxed">
                A high-performance marketing website built for Hawaii's trusted towing service. Designed to convert visitors into customers with strategic SEO, mobile-first design, and clear calls to action.
              </motion.p>
              <motion.div variants={fadeIn} className="flex gap-4">
                <a href="https://www.poormantowing.com" target="_blank" rel="noopener noreferrer">
                  <Button className="bg-blue-500 hover:bg-blue-600" data-testid="button-visit-poorman-website">
                    Visit Live Site
                    <ExternalLink className="ml-2 w-4 h-4" />
                  </Button>
                </a>
              </motion.div>
            </div>
            
            <motion.div variants={fadeIn} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-slate-900/40 border border-white/5 rounded-xl text-center">
                  <div className="text-3xl font-bold text-blue-400">500+</div>
                  <div className="text-sm text-slate-400">Monthly Leads</div>
                </div>
                <div className="p-6 bg-slate-900/40 border border-white/5 rounded-xl text-center">
                  <div className="text-3xl font-bold text-cyan-400">#1</div>
                  <div className="text-sm text-slate-400">Local SEO Ranking</div>
                </div>
              </div>
            </motion.div>
          </div>

          <section className="py-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div variants={fadeIn} className="p-8 bg-slate-900/40 border border-white/5 rounded-2xl shadow-sm backdrop-blur-sm">
                <div className="p-3 bg-blue-500/10 rounded-xl w-fit mb-6 text-blue-400">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-display mb-3 text-white">SEO Optimized</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Strategic keyword targeting and technical SEO to dominate Hawaii towing search results.</p>
              </motion.div>
              <motion.div variants={fadeIn} className="p-8 bg-slate-900/40 border border-white/5 rounded-2xl shadow-sm backdrop-blur-sm">
                <div className="p-3 bg-cyan-500/10 rounded-xl w-fit mb-6 text-cyan-400">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-display mb-3 text-white">Mobile-First</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Fully responsive design optimized for mobile users who need towing services on the go.</p>
              </motion.div>
              <motion.div variants={fadeIn} className="p-8 bg-slate-900/40 border border-white/5 rounded-2xl shadow-sm backdrop-blur-sm">
                <div className="p-3 bg-blue-500/10 rounded-xl w-fit mb-6 text-blue-400">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-display mb-3 text-white">Fast Performance</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Lightning-fast load times ensure visitors don't bounce before making contact.</p>
              </motion.div>
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
