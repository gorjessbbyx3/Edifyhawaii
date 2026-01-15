import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Globe, Sparkles, Zap, Shield } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import imgJadeRoyale from "@assets/IMG_6085_1768473306904.jpeg";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function JadeRoyale() {
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
              <motion.div variants={fadeIn} className="inline-flex items-center space-x-2 bg-emerald-500/10 rounded-full px-4 py-1">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Gaming Platform</span>
              </motion.div>
              <motion.h1 variants={fadeIn} className="text-4xl md:text-6xl font-display font-bold text-white">
                Jade Royale <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Premium Gaming</span>
              </motion.h1>
              <motion.p variants={fadeIn} className="text-lg text-slate-400 leading-relaxed">
                A premium online gaming platform featuring an immersive user experience with real-time cashout functionality, bonus systems, and sleek Asian-inspired design aesthetics. Built for performance and engagement.
              </motion.p>
              <motion.div variants={fadeIn} className="flex gap-4">
                <a href="https://cashout.realconnect.online" target="_blank" rel="noopener noreferrer">
                  <Button className="bg-emerald-500 hover:bg-emerald-600" data-testid="button-visit-jade-royale">
                    Visit Live Site
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
                  cashout.realconnect.online
                </div>
              </div>
              <div className="absolute inset-0 pt-8 overflow-hidden bg-slate-900">
                <img 
                  src={imgJadeRoyale} 
                  className="w-full h-full object-cover"
                  alt="Jade Royale Gaming Platform"
                />
              </div>
            </motion.div>
          </div>

          <section className="py-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div variants={fadeIn} className="p-8 bg-slate-900/40 border border-white/5 rounded-2xl shadow-sm backdrop-blur-sm">
                <div className="p-3 bg-emerald-500/10 rounded-xl w-fit mb-6 text-emerald-400">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-display mb-3 text-white">Premium Experience</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Immersive gaming interface with stunning visuals, smooth animations, and Asian-inspired design elements.</p>
              </motion.div>
              <motion.div variants={fadeIn} className="p-8 bg-slate-900/40 border border-white/5 rounded-2xl shadow-sm backdrop-blur-sm">
                <div className="p-3 bg-teal-500/10 rounded-xl w-fit mb-6 text-teal-400">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-display mb-3 text-white">Real-Time Cashout</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Instant cashout functionality with secure transaction processing and live balance updates.</p>
              </motion.div>
              <motion.div variants={fadeIn} className="p-8 bg-slate-900/40 border border-white/5 rounded-2xl shadow-sm backdrop-blur-sm">
                <div className="p-3 bg-emerald-500/10 rounded-xl w-fit mb-6 text-emerald-400">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-display mb-3 text-white">Bonus Systems</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Comprehensive bonus and referral systems with level-up rewards and daily claim features.</p>
              </motion.div>
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
