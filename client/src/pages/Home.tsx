import { motion, useInView } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, TrendingUp, AlertTriangle, CheckCircle2, Shield, Zap, Target, DollarSign, Clock, Users, Star, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useEffect, useState } from "react";
import { SEO, seoConfig, generateLocalBusinessSchema, generateOrganizationSchema, generateCaseStudySchema } from "@/components/SEO";
import heroVideo from "@assets/_users_9b25cb5e-ce71-4d7e-bbca-6899b4a7896f_generated_dcfe4f1d_1768470906588.mp4";
import imgPoormanWebsite from "@assets/IMG_6122_1768864416866.jpeg";

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

function AnimatedCounter({ end, duration = 2, suffix = "", prefix = "" }: { end: number, duration?: number, suffix?: string, prefix?: string }) {
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

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

const caseStudies = [
  {
    name: "Poorman Towing Website Redesign",
    client: "Poorman Towing",
    result: "+300%",
    metric: "Increase in monthly leads",
    description: "Hawaii towing company transformed from losing 5+ calls daily to competitors into local market leader through high-performance website and local SEO strategy."
  },
  {
    name: "Mason Martin Law Digital Presence",
    client: "Mason Martin Law",
    result: "+45%",
    metric: "More consultation requests",
    description: "Hawaii litigation attorney's outdated template replaced with authoritative, trust-building website that positions them as the premier litigation firm."
  }
];

const combinedSchema = {
  "@context": "https://schema.org",
  "@graph": [
    generateLocalBusinessSchema(false),
    generateOrganizationSchema(false),
    generateCaseStudySchema(caseStudies, false)
  ]
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <SEO 
        title={seoConfig.home.title}
        description={seoConfig.home.description}
        structuredData={combinedSchema}
      />
      {/* 1. HERO SECTION - Identity & Immediate Trust */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
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
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-slate-950" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10" />
        </div>

        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-pulse pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/15 rounded-full blur-[100px] animate-pulse pointer-events-none" style={{ animationDelay: "1s" }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-32">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center space-y-8"
          >
            <motion.div 
              variants={scaleIn}
              className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-xl rounded-full px-6 py-2.5 border border-white/10 shadow-2xl shadow-primary/10"
            >
              <Shield className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-white/90 tracking-wide">Hawaii's Trusted Technology Partner</span>
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            </motion.div>
            
            {/* SEO-Optimized H1 - Identity Appeal + Local Keywords */}
            <motion.h1 
              variants={fadeIn}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-extrabold leading-[0.95] tracking-tight"
            >
              <span className="text-white">The Digital Foundation for</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-accent animate-gradient-x">
                Hawaii's Market Leaders
              </span>
            </motion.h1>
            
            {/* SEO Subheadline - Clear outcome */}
            <motion.p 
              variants={fadeIn}
              className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed font-light"
            >
              Edify builds clear, conversion-focused websites that 
              <span className="text-white font-medium"> turn visitors into customers</span>.
              <br className="hidden md:block" />
              An outdated site is a <span className="text-red-400 font-medium">silent tax on your growth</span>—stop losing leads.
            </motion.p>
            
            {/* Low-Friction CTA */}
            <motion.div 
              variants={fadeIn}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
            >
              <Link href="/contact" data-testid="link-audit-hero">
                <Button 
                  size="lg" 
                  data-testid="button-audit-hero"
                  className="group relative bg-gradient-to-r from-primary to-blue-500 text-white font-semibold rounded-xl shadow-2xl shadow-primary/30"
                >
                  <span className="relative z-10 flex items-center">
                    Audit Your Growth Potential
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
                  See Real Results
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

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

      {/* 2. SOCIAL PROOF BAR - Instant Validation with LLM-Ready Metrics */}
      <section className="py-12 border-y border-white/5 bg-slate-900/50" aria-label="Client Results and Social Proof">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center space-y-8"
          >
            <p className="text-sm text-slate-500 uppercase tracking-widest font-medium">Trusted by Hawaii Businesses</p>
            
            {/* LLM-Ready Outcome Metrics - Clear data for AI crawling */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto" role="list" aria-label="Key business outcomes and metrics">
              <div className="text-center" role="listitem">
                <div className="text-3xl font-display font-bold text-primary">300%</div>
                <p className="text-xs text-slate-500 mt-1">Average Lead Increase</p>
              </div>
              <div className="text-center" role="listitem">
                <div className="text-3xl font-display font-bold text-green-400">45%</div>
                <p className="text-xs text-slate-500 mt-1">More Consultation Requests</p>
              </div>
              <div className="text-center" role="listitem">
                <div className="text-3xl font-display font-bold text-accent">9+</div>
                <p className="text-xs text-slate-500 mt-1">Hawaii Businesses Served</p>
              </div>
              <div className="text-center" role="listitem">
                <div className="text-3xl font-display font-bold text-white">100%</div>
                <p className="text-xs text-slate-500 mt-1">Client Ownership Guarantee</p>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale">
              <div className="text-xl font-display font-bold text-slate-400">Poorman Towing</div>
              <div className="text-xl font-display font-bold text-slate-400">Mason Martin Law</div>
              <div className="text-xl font-display font-bold text-slate-400">Oahu Elite Tours</div>
              <div className="text-xl font-display font-bold text-slate-400">All-in-1 Bonding</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. AGITATION SECTION - Problem-Agitate-Solve */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="space-y-16"
          >
            <div className="text-center space-y-6">
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-1.5">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="text-sm font-medium text-red-400">The Hard Truth</span>
              </motion.div>
              <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white">
                Is Your Website Costing You
                <br />
                <span className="text-red-400">Local Market Share?</span>
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-lg text-slate-400 max-w-3xl mx-auto">
                While you're stuck with a template site that "does the job," your competitors are capturing the high-value customers who judged you in the first 3 seconds.
              </motion.p>
            </div>

            {/* Inaction Math */}
            <motion.div variants={fadeInUp} className="max-w-4xl mx-auto">
              <div className="bg-slate-900/80 border border-red-500/20 rounded-2xl p-8 md:p-12">
                <h3 className="text-2xl font-display font-bold text-white mb-8 text-center">The Cost of Doing Nothing</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                  <div className="space-y-2">
                    <div className="text-5xl font-display font-bold text-red-400">1</div>
                    <p className="text-slate-400">Lost lead per month</p>
                  </div>
                  <div className="space-y-2 flex flex-col items-center justify-center">
                    <div className="text-3xl text-slate-500">×</div>
                    <div className="text-5xl font-display font-bold text-orange-400">$2,500</div>
                    <p className="text-slate-400">Average customer value</p>
                  </div>
                  <div className="space-y-2">
                    <div className="text-3xl text-slate-500">=</div>
                    <div className="text-5xl font-display font-bold text-white">
                      <AnimatedCounter end={30000} prefix="$" suffix="" />
                    </div>
                    <p className="text-slate-400">Lost annually</p>
                  </div>
                </div>
                <p className="text-center text-slate-500 mt-8 text-sm">
                  Every month you wait, you're paying a tax to your competitors.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 4. SIGNATURE SYSTEM - The Guide's Plan */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="space-y-16"
          >
            <div className="text-center space-y-6">
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5">
                <Target className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Your Path to Growth</span>
              </motion.div>
              <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white">
                A Simple 3-Step Plan
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Built for Your Success</span>
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-lg text-slate-400 max-w-2xl mx-auto">
                No confusing tech jargon. No endless meetings. Just a clear path from where you are to where you want to be.
              </motion.p>
            </div>

            <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <ProcessStep 
                number="1"
                title="Decode Roadblocks"
                description="We analyze what's holding your business back—hidden technical issues, missed opportunities, and growth blockers."
                gradient="from-blue-500 to-cyan-400"
              />
              <ProcessStep 
                number="2"
                title="Rebuild the Foundation"
                description="We create a digital presence that commands attention, builds trust, and turns visitors into customers."
                gradient="from-purple-500 to-pink-400"
              />
              <ProcessStep 
                number="3"
                title="Scale the Results"
                description="We optimize for local discoverability and continuous improvement so your growth compounds over time."
                gradient="from-orange-500 to-amber-400"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 5. STRATEGIC SERVICE TIERS - Anchoring */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="space-y-16"
          >
            <div className="text-center space-y-6">
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-1.5">
                <DollarSign className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-accent">Investment Options</span>
              </motion.div>
              <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white">
                Choose Your Level of
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-cyan-400">Digital Transformation</span>
              </motion.h2>
            </div>

            <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* VIP Tier - Anchor */}
              <PricingTier 
                name="VIP"
                tagline="Full Digital Dominance"
                price="15,000"
                description="Complete digital ecosystem with custom software, ongoing optimization, and priority support."
                features={[
                  "Custom web application",
                  "Proprietary dashboard/CRM",
                  "Full IT infrastructure setup",
                  "24/7 priority support",
                  "Quarterly strategy reviews"
                ]}
                highlighted={false}
              />
              
              {/* Pro Tier - Best Value */}
              <PricingTier 
                name="Pro"
                tagline="Best Value"
                price="7,500"
                description="High-performance website with local SEO domination and ongoing maintenance."
                features={[
                  "Premium responsive website",
                  "Local SEO optimization",
                  "Lead generation setup",
                  "Monthly maintenance",
                  "Analytics & reporting"
                ]}
                highlighted={true}
              />
              
              {/* Core Tier */}
              <PricingTier 
                name="Core"
                tagline="Essential Foundation"
                price="3,500"
                description="Professional website that establishes your credibility and captures leads."
                features={[
                  "Modern responsive website",
                  "Mobile optimization",
                  "Contact form integration",
                  "Basic SEO setup",
                  "30-day support"
                ]}
                highlighted={false}
              />
            </motion.div>

            <motion.p variants={fadeInUp} className="text-center text-slate-500 text-sm">
              All packages include free consultation. Custom solutions available upon request.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* 6. NARRATIVE CASE STORIES - The Proof */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="space-y-16"
          >
            <div className="text-center space-y-6">
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-1.5">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-sm font-medium text-green-400">Honolulu Client Transformations</span>
              </motion.div>
              <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white">
                From Struggling to
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">Thriving</span>
              </motion.h2>
            </div>

            <motion.div variants={staggerContainer} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <CaseStory 
                company="Poorman Towing"
                roadblock="Losing 5+ calls daily to competitors with better online presence. Their old site looked outdated and wasn't showing up in local searches."
                strategy="Built a high-performance website with local SEO domination strategy. Added custom dispatch dashboard for operations efficiency."
                result="+300%"
                resultLabel="Increase in monthly leads"
                image={imgPoormanWebsite}
                link="/portfolio/poorman-website"
              />
              <CaseStory 
                company="Mason Martin Law"
                roadblock="Professional reputation didn't match their generic website template. Potential clients were bouncing to firms with stronger digital presence."
                strategy="Created an authoritative, trust-building website that positions them as the premier litigation firm in Hawaii."
                result="+45%"
                resultLabel="More consultation requests"
                link="/portfolio/martin-law"
              />
            </motion.div>

            <motion.div variants={fadeInUp} className="text-center">
              <Link href="/portfolio" data-testid="link-all-stories">
                <Button 
                  variant="outline" 
                  size="lg" 
                  data-testid="button-all-stories"
                  className="group border-white/20 text-white backdrop-blur-sm"
                >
                  See All Success Stories
                  <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 7. FINAL CONVERSION & RISK REVERSAL */}
      <section className="py-32 relative overflow-hidden">
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
              <Shield className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-white/80">Risk-Free Guarantee</span>
            </motion.div>
            
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white leading-tight">
              Ready to Stop Losing
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-accent">
                Customers to Your Competition?
              </span>
            </motion.h2>
            
            {/* Risk Reversal */}
            <motion.div variants={fadeInUp} className="bg-slate-900/80 border border-green-500/20 rounded-2xl p-8 max-w-2xl mx-auto">
              <p className="text-lg text-white font-medium mb-4">
                Our Guarantee
              </p>
              <p className="text-slate-300 leading-relaxed">
                If we can't identify at least <span className="text-green-400 font-bold">$5,000 in hidden technical debt or lost lead potential</span> during your free strategy audit, the session is on us—no strings attached.
              </p>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="pt-4">
              <Link href="/contact" data-testid="link-free-audit-cta">
                <Button 
                  size="lg" 
                  data-testid="button-free-audit-cta"
                  className="group relative bg-gradient-to-r from-primary via-blue-500 to-accent text-white font-bold rounded-2xl shadow-2xl shadow-primary/40"
                >
                  <span className="relative z-10 flex items-center">
                    Get Your Free Strategy Audit
                    <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
                  </span>
                </Button>
              </Link>
            </motion.div>
            
            <motion.p variants={fadeInUp} className="text-sm text-slate-500">
              No pressure. No commitment. Just honest insights about your growth potential.
            </motion.p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function ProcessStep({ number, title, description, gradient }: { number: string, title: string, description: string, gradient: string }) {
  return (
    <motion.div 
      variants={fadeInUp}
      className="relative p-8 rounded-2xl bg-slate-900/50 border border-white/5 backdrop-blur-sm text-center"
    >
      <div className={`mx-auto mb-6 w-16 h-16 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-3xl font-display font-bold text-white shadow-lg`}>
        {number}
      </div>
      <h3 className="text-xl font-bold font-display mb-3 text-white">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{description}</p>
    </motion.div>
  );
}

function PricingTier({ name, tagline, price, description, features, highlighted }: { name: string, tagline: string, price: string, description: string, features: string[], highlighted: boolean }) {
  return (
    <motion.div 
      variants={fadeInUp}
      className={`relative p-8 rounded-2xl border backdrop-blur-sm ${
        highlighted 
          ? "bg-gradient-to-b from-primary/20 to-slate-900/80 border-primary/50 shadow-2xl shadow-primary/20 scale-105" 
          : "bg-slate-900/50 border-white/10"
      }`}
    >
      {highlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-accent px-4 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider">
          Most Popular
        </div>
      )}
      <div className="text-center mb-6">
        <p className={`text-sm font-medium mb-2 ${highlighted ? "text-primary" : "text-slate-500"}`}>{tagline}</p>
        <h3 className="text-2xl font-display font-bold text-white mb-2">{name}</h3>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-4xl font-display font-bold text-white">${price}</span>
          <span className="text-slate-500">starting</span>
        </div>
      </div>
      <p className="text-slate-400 text-sm text-center mb-6">{description}</p>
      <ul className="space-y-3 mb-8">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-3 text-slate-300">
            <CheckCircle2 className={`w-5 h-5 flex-shrink-0 ${highlighted ? "text-primary" : "text-slate-500"}`} />
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>
      <Link href="/contact" data-testid={`link-tier-${name.toLowerCase()}`}>
        <Button 
          className={`w-full ${highlighted ? "bg-gradient-to-r from-primary to-blue-500" : ""}`}
          variant={highlighted ? "default" : "outline"}
          data-testid={`button-tier-${name.toLowerCase()}`}
        >
          Get Started
        </Button>
      </Link>
    </motion.div>
  );
}

function CaseStory({ company, roadblock, strategy, result, resultLabel, image, link }: { company: string, roadblock: string, strategy: string, result: string, resultLabel: string, image?: string, link?: string }) {
  const content = (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="flex-1 space-y-6">
        <h3 className="text-2xl font-display font-bold text-white">{company}</h3>
        
        <div className="space-y-4">
          <div>
            <p className="text-xs text-red-400 uppercase tracking-wider font-medium mb-1">The Roadblock</p>
            <p className="text-slate-400 text-sm">{roadblock}</p>
          </div>
          <div>
            <p className="text-xs text-primary uppercase tracking-wider font-medium mb-1">The Strategy</p>
            <p className="text-slate-400 text-sm">{strategy}</p>
          </div>
        </div>
        
        <div className="pt-4 border-t border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-green-500 to-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-3xl font-display font-bold text-green-400">{result}</p>
              <p className="text-xs text-slate-500">{resultLabel}</p>
            </div>
          </div>
        </div>
        
        {link && (
          <Link href={link} data-testid={`link-case-${company.toLowerCase().replace(/\s+/g, '-')}`}>
            <span className="text-sm text-primary flex items-center gap-1 group">
              View full case study
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        )}
      </div>
      
      {image && (
        <div className="w-full md:w-48 h-32 md:h-auto rounded-xl overflow-hidden border border-white/10">
          <img src={image} alt={`Hawaii business ${company} viewing increased lead generation metrics on Edify dashboard`} className="w-full h-full object-cover" />
        </div>
      )}
    </div>
  );

  return (
    <motion.div 
      variants={fadeInUp}
      className="p-8 rounded-2xl bg-slate-900/50 border border-white/10 backdrop-blur-sm"
    >
      {content}
    </motion.div>
  );
}
