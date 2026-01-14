import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Globe, Camera, Image, Zap } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function CaptureByChristian() {
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
                <span className="text-xs font-bold text-primary uppercase tracking-wider">Photography Portfolio</span>
              </motion.div>
              <motion.h1 variants={fadeIn} className="text-4xl md:text-6xl font-display font-bold">
                Capture by Christian <br />
                <span className="text-primary">Visual Storytelling</span>
              </motion.h1>
              <motion.p variants={fadeIn} className="text-lg text-muted-foreground leading-relaxed">
                A high-performance photography portfolio designed to showcase breathtaking visual stories. Built with a focus on image quality, fast loading, and an immersive user experience.
              </motion.p>
              <motion.div variants={fadeIn} className="flex gap-4">
                <a href="https://capturebychristian.vercel.app" target="_blank" rel="noopener noreferrer">
                  <Button className="bg-primary hover:bg-primary/90">
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
                  https://capturebychristian.vercel.app
                </div>
              </div>
              <div className="absolute inset-0 pt-8 overflow-hidden bg-slate-800">
                <div 
                  className="w-[1280px] h-[800px] origin-top-left"
                  style={{ transform: 'scale(calc(100cqw / 1280))' }}
                >
                  <iframe 
                    src="https://capturebychristian.vercel.app" 
                    className="w-full h-full bg-white"
                    title="Capture by Christian Live Website"
                    loading="lazy"
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Features */}
          <section className="py-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div variants={fadeIn} className="p-8 bg-white rounded-2xl border border-border shadow-sm">
                <div className="p-3 bg-primary/10 rounded-xl w-fit mb-6 text-primary">
                  <Camera className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-display mb-3">Stunning Galleries</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">Immersive, high-resolution galleries that bring every detail to life with seamless transitions.</p>
              </motion.div>
              <motion.div variants={fadeIn} className="p-8 bg-white rounded-2xl border border-border shadow-sm">
                <div className="p-3 bg-accent/10 rounded-xl w-fit mb-6 text-accent">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-display mb-3">Lightning Fast</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">Optimized image delivery ensuring rapid load times without compromising on visual fidelity.</p>
              </motion.div>
              <motion.div variants={fadeIn} className="p-8 bg-white rounded-2xl border border-border shadow-sm">
                <div className="p-3 bg-primary/10 rounded-xl w-fit mb-6 text-primary">
                  <Image className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-display mb-3">Visual Storytelling</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">A clean, minimal interface designed to let the photography remain the central focus.</p>
              </motion.div>
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
