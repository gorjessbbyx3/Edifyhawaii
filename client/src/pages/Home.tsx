import { motion, useInView } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Server, Globe, ShieldCheck, Cpu, Layout, Terminal, Sparkles, Zap, TrendingUp, Users, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useEffect, useState } from "react";
import heroVideo from "@assets/_users_9b25cb5e-ce71-4d7e-bbca-6899b4a7896f_generated_dcfe4f1d_1768470906588.mp4";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
};

function AnimatedCounter({ end, duration = 2, suffix = "" }: { end: number, duration?: number, suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let startTime: number;
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
        setCount(Math.floor(progress * end));
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [isInView, end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      {/* Hero Section - Full Impact */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover scale-105"
          >
            <source src={heroVideo} type="video/mp4" />
          </video>
          {/* Premium gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/50 to-slate-950" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10" />
        </div>

        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-pulse pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/15 rounded-full blur-[100px] animate-pulse pointer-events-none" style={{ animationDelay: "1s" }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-32">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center space-y-8"
          >
            {/* Premium Badge */}
            <motion.div 
              variants={scaleIn}
              className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-xl rounded-full px-6 py-2.5 border border-white/10 shadow-2xl shadow-primary/10"
            >
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-white/90 tracking-wide">Hawaii's Premier IT & Web Development Partner</span>
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            </motion.div>
            
            {/* Main Headline - Bold & Impactful */}
            <motion.h1 
              variants={fadeIn}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-display font-extrabold leading-[0.95] tracking-tight"
            >
              <span className="text-white">We Build</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-accent animate-gradient-x">
                Digital Empires
              </span>
            </motion.h1>
            
            {/* Subheadline */}
            <motion.p 
              variants={fadeIn}
              className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed font-light"
            >
              Enterprise-grade websites. Custom software. IT infrastructure. 
              <br className="hidden md:block" />
              <span className="text-white font-medium">One team. Unlimited potential.</span>
            </motion.p>
            
            {/* CTA Buttons */}
            <motion.div 
              variants={fadeIn}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
            >
              <Link href="/contact" data-testid="link-start-project-hero">
                <Button 
                  size="lg" 
                  data-testid="button-start-project-hero"
                  className="group relative bg-gradient-to-r from-primary to-blue-500 text-white font-semibold rounded-xl shadow-2xl shadow-primary/30"
                >
                  <span className="relative z-10 flex items-center">
                    Start Your Project
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>
              <Link href="/portfolio" data-testid="link-view-work-hero">
                <Button 
                  variant="outline" 
                  size="lg" 
                  data-testid="button-view-work-hero"
                  className="border-2 border-white/20 text-white backdrop-blur-sm font-semibold rounded-xl"
                >
                  View Our Work
                </Button>
              </Link>
            </motion.div>

            {/* Quick Stats */}
            <motion.div 
              variants={fadeIn}
              className="flex flex-wrap justify-center gap-8 md:gap-16 pt-12"
            >
              <div className="text-center">
                <div data-testid="text-stat-projects" className="text-4xl md:text-5xl font-display font-bold text-white">
                  <AnimatedCounter end={50} suffix="+" />
                </div>
                <p className="text-sm text-white/50 mt-1 uppercase tracking-wider">Projects Delivered</p>
              </div>
              <div className="text-center">
                <div data-testid="text-stat-satisfaction" className="text-4xl md:text-5xl font-display font-bold text-white">
                  <AnimatedCounter end={100} suffix="%" />
                </div>
                <p className="text-sm text-white/50 mt-1 uppercase tracking-wider">Client Satisfaction</p>
              </div>
              <div className="text-center">
                <div data-testid="text-stat-support" className="text-4xl md:text-5xl font-display font-bold text-white">
                  <AnimatedCounter end={24} suffix="/7" />
                </div>
                <p className="text-sm text-white/50 mt-1 uppercase tracking-wider">Support Available</p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-2">
            <motion.div 
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-1.5 h-1.5 bg-white rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* Services Section - Premium Cards */}
      <section className="py-32 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="absolute -top-40 left-1/2 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="space-y-16"
          >
            <div className="text-center space-y-4">
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Full-Stack Capabilities</span>
              </motion.div>
              <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white">
                Everything You Need.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Nothing You Don't.</span>
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-lg text-slate-400 max-w-2xl mx-auto">
                From network infrastructure to pixel-perfect websites, we handle the entire tech stack so you can focus on what matters most.
              </motion.p>
            </div>

            <motion.div 
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <ServiceCard 
                icon={<Globe className="w-7 h-7" />}
                title="Web Development"
                description="Stunning, high-performance websites that captivate visitors and convert them into loyal customers."
                gradient="from-blue-500 to-cyan-400"
              />
              <ServiceCard 
                icon={<Terminal className="w-7 h-7" />}
                title="Custom Software"
                description="Bespoke applications and dashboards tailored to your exact business workflows and requirements."
                gradient="from-purple-500 to-pink-400"
              />
              <ServiceCard 
                icon={<Server className="w-7 h-7" />}
                title="IT Infrastructure"
                description="Enterprise-grade network setup, monitoring, and maintenance that keeps your operations running smoothly."
                gradient="from-orange-500 to-amber-400"
              />
              <ServiceCard 
                icon={<ShieldCheck className="w-7 h-7" />}
                title="Cybersecurity"
                description="Military-grade protection for your data with advanced threat detection and prevention systems."
                gradient="from-red-500 to-rose-400"
              />
              <ServiceCard 
                icon={<Layout className="w-7 h-7" />}
                title="CRM Systems"
                description="Custom-built dashboards that give you real-time insights and automate your customer relationships."
                gradient="from-green-500 to-emerald-400"
              />
              <ServiceCard 
                icon={<Cpu className="w-7 h-7" />}
                title="Hardware Solutions"
                description="Complete procurement, setup, and management of all your technology hardware needs."
                gradient="from-indigo-500 to-violet-400"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us - Impact Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          >
            <div className="space-y-8">
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-1.5">
                <TrendingUp className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-accent">Proven Results</span>
              </motion.div>
              <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-display font-bold text-white leading-tight">
                We Don't Just Build Websites.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-cyan-400">We Build Success Stories.</span>
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-lg text-slate-400 leading-relaxed">
                Every project we take on is treated like our own business. We obsess over the details because we know that's what separates good from exceptional.
              </motion.p>
              
              <motion.div variants={staggerContainer} className="space-y-4">
                {[
                  "Lightning-fast performance that ranks higher on Google",
                  "Mobile-first design for today's on-the-go customers",
                  "SEO-optimized from the ground up",
                  "24/7 support when you need us most"
                ].map((item, i) => (
                  <motion.div key={i} variants={fadeInUp} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-slate-300 font-medium">{item}</span>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Link href="/portfolio" data-testid="link-see-portfolio">
                  <Button 
                    size="lg" 
                    variant="outline"
                    data-testid="button-see-portfolio"
                    className="group bg-white/10 text-white border-white/20 backdrop-blur-sm font-semibold rounded-xl"
                  >
                    See Our Portfolio
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </motion.div>
            </div>

            {/* Featured Project Preview */}
            <motion.div variants={scaleIn} className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30 rounded-3xl blur-2xl opacity-50" />
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <div className="bg-slate-800 px-4 py-3 flex items-center gap-2">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="flex-1 bg-slate-700 rounded-lg px-4 py-1 text-xs text-slate-400 font-mono text-center">
                    poormantowing.com
                  </div>
                </div>
                <img 
                  src="/assets/IMG_6077.jpeg"
                  alt="Featured Project Showcase"
                  className="w-full"
                />
              </div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="absolute -bottom-6 -right-6 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-2xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-400 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">300%</p>
                    <p className="text-xs text-slate-400">Increase in Leads</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA - Maximum Impact */}
      <section className="py-32 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="space-y-8"
          >
            <motion.div variants={scaleIn} className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-6 py-2">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-white/80">Join Our Growing List of Happy Clients</span>
            </motion.div>
            
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white leading-tight">
              Ready to Stand Out?
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-accent">
                Let's Build Something Epic.
              </span>
            </motion.h2>
            
            <motion.p variants={fadeInUp} className="text-xl text-slate-300 max-w-2xl mx-auto">
              Schedule a free consultation and discover how we can transform your digital presence into a competitive advantage.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="pt-4">
              <Link href="/contact" data-testid="link-get-consultation-cta">
                <Button 
                  size="lg" 
                  data-testid="button-get-consultation-cta"
                  className="group relative bg-gradient-to-r from-primary via-blue-500 to-accent text-white font-bold rounded-2xl shadow-2xl shadow-primary/40"
                >
                  <span className="relative z-10 flex items-center">
                    Get Your Free Consultation
                    <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
                  </span>
                </Button>
              </Link>
            </motion.div>
            
            <motion.p variants={fadeInUp} className="text-sm text-slate-500">
              No commitment required. Let's just talk about your goals.
            </motion.p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function ServiceCard({ icon, title, description, gradient }: { icon: React.ReactNode, title: string, description: string, gradient: string }) {
  return (
    <motion.div 
      variants={fadeInUp}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative p-8 rounded-2xl bg-slate-900/50 border border-white/5 backdrop-blur-sm overflow-hidden transition-all duration-500 hover:border-white/20"
    >
      {/* Glow effect on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
      <div className={`absolute -inset-px bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`} />
      
      <div className="relative z-10">
        <div className={`mb-6 p-4 rounded-xl bg-gradient-to-br ${gradient} w-fit shadow-lg`}>
          <div className="text-white">{icon}</div>
        </div>
        <h3 className="text-xl font-bold font-display mb-3 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 transition-all duration-300">
          {title}
        </h3>
        <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
          {description}
        </p>
      </div>
    </motion.div>
  );
}
