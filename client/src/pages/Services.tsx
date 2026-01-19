import { motion } from "framer-motion";
import { CheckCircle2, Server, Code, BarChart, Lock, Phone, Globe, Shield, Cpu, ArrowRight, Sparkles, Zap, HelpCircle, Bot, MessageCircle } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { SEO, seoConfig, generateFAQSchema, generateServiceOfferingSchema } from "@/components/SEO";
import { AuditChatTrigger } from "@/components/AuditChat";

const faqs = [
  {
    question: "How much does a small business website cost in Hawaii?",
    answer: "Our website packages start at $3,500 for essential business websites and go up to $15,000+ for full custom solutions with software development. We provide transparent pricing with no hidden fees, and every project includes a free strategy consultation."
  },
  {
    question: "How long does it take to build a professional website?",
    answer: "Most business websites are completed within 4-6 weeks from start to launch. Custom software projects may take 8-12 weeks depending on complexity. We provide a detailed timeline during your free consultation."
  },
  {
    question: "Do I own my website after it's built?",
    answer: "Yes, absolutely. You own 100% of your website, all content, and any custom code we develop. We provide full access to all files, hosting accounts, and domain registrations."
  },
  {
    question: "Can you help my business show up in Google searches?",
    answer: "Yes! Every website we build is optimized for local search visibility. We focus on helping Hawaii businesses rank for relevant local searches, driving qualified leads directly to your door."
  },
  {
    question: "Do you provide ongoing support and maintenance?",
    answer: "We offer flexible support packages including 24/7 monitoring, regular updates, security patches, and priority technical support. Our Pro and VIP packages include ongoing maintenance as standard."
  }
];

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
};

const servicesSchema = {
  "@context": "https://schema.org",
  "@graph": [
    generateFAQSchema(faqs, false),
    generateServiceOfferingSchema(false)
  ]
};

export default function Services() {
  return (
    <div className="min-h-screen">
      <SEO 
        title={seoConfig.services.title}
        description={seoConfig.services.description}
        structuredData={servicesSchema}
      />
      {/* Hero Section - SEO Optimized */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[128px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center space-y-6"
          >
            <motion.div variants={scaleIn} className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-5 py-2">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Full-Service Technology Partner</span>
            </motion.div>
            
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white leading-tight">
              Is Your Website Costing You <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-accent animate-gradient-x">
                Hawaii Market Share?
              </span>
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-xl text-slate-400 max-w-2xl mx-auto">
              Edify delivers complete technology solutions—from high-converting websites to managed IT—that help Hawaii businesses grow and thrive.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Managed IT Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          >
            <div className="space-y-8">
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 p-4 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-xl shadow-lg w-fit">
                <Server className="w-8 h-8 text-white" />
              </motion.div>
              <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-display font-bold text-white">
                Managed IT Services
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-lg text-slate-400 leading-relaxed">
                Think of us as your IT department down the hall, just virtual. We monitor your systems 24/7 to catch issues before they disrupt your business.
              </motion.p>
              
              <motion.div variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <FeatureItem text="24/7 Network Monitoring" />
                <FeatureItem text="Help Desk Support" />
                <FeatureItem text="Data Backup & Recovery" />
                <FeatureItem text="Email & Office 365 Management" />
                <FeatureItem text="Cybersecurity Protection" />
                <FeatureItem text="Vendor Management" />
              </motion.div>
            </div>
            
            <motion.div variants={scaleIn} className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/30 to-cyan-400/30 rounded-3xl blur-2xl opacity-50" />
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80" 
                  alt="IT Support" 
                  className="w-full"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Custom Development Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          >
            <motion.div variants={scaleIn} className="order-2 lg:order-1 relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/30 to-pink-400/30 rounded-3xl blur-2xl opacity-50" />
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80" 
                  alt="Software Development" 
                  className="w-full"
                />
              </div>
            </motion.div>

            <div className="order-1 lg:order-2 space-y-8">
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 p-4 bg-gradient-to-r from-purple-500 to-pink-400 rounded-xl shadow-lg w-fit">
                <Code className="w-8 h-8 text-white" />
              </motion.div>
              <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-display font-bold text-white">
                Custom Development
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-lg text-slate-400 leading-relaxed">
                Off-the-shelf software doesn't always fit. We build custom web applications, websites, and dashboards tailored to your specific workflow.
              </motion.p>
              
              <motion.div variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <FeatureItem text="Custom Web Apps" />
                <FeatureItem text="E-commerce Websites" />
                <FeatureItem text="Internal Dashboards" />
                <FeatureItem text="API Integrations" />
                <FeatureItem text="Mobile-First Design" />
                <FeatureItem text="Cloud Migration" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Additional Services Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-16"
          >
            <div className="text-center">
              <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
                Complete Technology Stack
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-lg text-slate-400 max-w-2xl mx-auto">
                Everything you need to run a modern, secure, and efficient business.
              </motion.p>
            </div>

            <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <ServiceCard 
                icon={<Globe className="w-6 h-6" />}
                title="Web Development"
                description="High-performance, SEO-optimized websites that convert visitors into customers."
                gradient="from-blue-500 to-cyan-400"
              />
              <ServiceCard 
                icon={<Shield className="w-6 h-6" />}
                title="Cybersecurity"
                description="Enterprise-grade protection including threat detection, prevention, and response."
                gradient="from-red-500 to-rose-400"
              />
              <ServiceCard 
                icon={<Cpu className="w-6 h-6" />}
                title="Hardware Solutions"
                description="Complete procurement, setup, and lifecycle management for all your equipment."
                gradient="from-orange-500 to-amber-400"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-12"
          >
            <div className="text-center">
              <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
                Simple, Transparent Partnership
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-lg text-slate-400 max-w-2xl mx-auto">
                No hidden fees. No confusing jargon. Just honest work and reliable technology.
              </motion.p>
            </div>

            <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <ProcessCard 
                icon={<Phone className="w-8 h-8" />}
                step="01"
                title="Consultation"
                description="We listen to your needs and audit your current setup completely free."
              />
              <ProcessCard 
                icon={<BarChart className="w-8 h-8" />}
                step="02"
                title="Strategy"
                description="We propose a tailored plan that fits your budget and goals."
              />
              <ProcessCard 
                icon={<Lock className="w-8 h-8" />}
                step="03"
                title="Execution"
                description="We implement, monitor, and support so you can rest easy."
              />
            </motion.div>

            <motion.div variants={fadeInUp} className="text-center pt-8">
              <Link href="/contact" data-testid="link-start-conversation-services">
                <Button 
                  size="lg" 
                  data-testid="button-start-conversation-services"
                  className="group bg-gradient-to-r from-primary to-blue-500 text-white font-semibold rounded-xl shadow-2xl shadow-primary/30"
                >
                  Start the Conversation
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* AI Audit Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-blue-500/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          >
            <div className="space-y-8">
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5">
                <Bot className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">AI-Powered Analysis</span>
              </motion.div>
              
              <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-display font-bold text-white leading-tight">
                Discover Your Growth Potential
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
                  In 2 Minutes
                </span>
              </motion.h2>
              
              <motion.p variants={fadeInUp} className="text-lg text-slate-400 leading-relaxed">
                Our AI assistant analyzes your digital presence and identifies hidden opportunities. Get instant insights about your website's conversion potential, local SEO gaps, and technical roadblocks—all for free.
              </motion.p>
              
              <motion.div variants={staggerContainer} className="space-y-4">
                <motion.div variants={fadeInUp} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary to-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div>
                    <span className="text-white font-medium">Instant Analysis</span>
                    <p className="text-sm text-slate-400">Get actionable insights in real-time, not days</p>
                  </div>
                </motion.div>
                
                <motion.div variants={fadeInUp} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary to-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div>
                    <span className="text-white font-medium">Hawaii Market Focus</span>
                    <p className="text-sm text-slate-400">Tailored recommendations for local business success</p>
                  </div>
                </motion.div>
                
                <motion.div variants={fadeInUp} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary to-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div>
                    <span className="text-white font-medium">No Commitment</span>
                    <p className="text-sm text-slate-400">Free insights with no pressure to purchase</p>
                  </div>
                </motion.div>
              </motion.div>
              
              <motion.div variants={fadeInUp}>
                <AuditChatTrigger />
              </motion.div>
              
              <motion.p variants={fadeInUp} className="text-sm text-slate-500">
                <MessageCircle className="w-4 h-4 inline mr-1" />
                AI-powered by Edify. For in-depth strategy, our human team is ready to help.
              </motion.p>
            </div>
            
            <motion.div variants={scaleIn} className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/40 to-blue-500/40 rounded-3xl blur-2xl opacity-50" />
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-slate-900 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-white">Edify AI Assistant</h4>
                    <p className="text-xs text-slate-400">AI-Powered Growth Audit</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-slate-800 rounded-2xl rounded-tl-none px-4 py-3 max-w-[85%]">
                    <p className="text-sm text-slate-200">Aloha! I'm the Edify AI assistant. I help Hawaii business owners identify growth opportunities. What's your biggest digital challenge right now?</p>
                  </div>
                  
                  <div className="bg-primary rounded-2xl rounded-tr-none px-4 py-3 max-w-[85%] ml-auto">
                    <p className="text-sm text-white">My website isn't generating enough leads...</p>
                  </div>
                  
                  <div className="bg-slate-800 rounded-2xl rounded-tl-none px-4 py-3 max-w-[85%]">
                    <p className="text-sm text-slate-200">That's a common challenge! Let me ask a few questions to identify what might be holding your website back...</p>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Sparkles className="w-3 h-3 text-primary" />
                    AI-powered by Replit's Agent technology
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section - SEO Rich Results */}
      <section className="py-24 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-12"
          >
            <div className="text-center">
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-1.5 mb-4">
                <HelpCircle className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-accent">Frequently Asked Questions</span>
              </motion.div>
              <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
                Common Questions About
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-cyan-400">Our Services</span>
              </motion.h2>
            </div>

            <motion.div variants={staggerContainer} className="space-y-4">
              {faqs.map((faq, index) => (
                <FAQItem key={index} question={faq.question} answer={faq.answer} />
              ))}
            </motion.div>

            <motion.div variants={fadeInUp} className="text-center pt-4">
              <p className="text-slate-400 mb-4">Have a question we didn't answer?</p>
              <Link href="/contact" data-testid="link-ask-question">
                <Button variant="outline" data-testid="button-ask-question" className="border-white/20 text-white">
                  Ask Us Directly
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <motion.div 
      variants={fadeInUp}
      className="p-6 rounded-xl bg-slate-900/50 border border-white/10"
    >
      <h3 className="text-lg font-semibold text-white mb-3 flex items-start gap-3">
        <HelpCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        {question}
      </h3>
      <p className="text-slate-400 leading-relaxed pl-8">{answer}</p>
    </motion.div>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <motion.div variants={fadeInUp} className="flex items-center gap-3">
      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center flex-shrink-0">
        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
      </div>
      <span className="text-slate-300 font-medium">{text}</span>
    </motion.div>
  );
}

function ServiceCard({ icon, title, description, gradient }: { icon: React.ReactNode, title: string, description: string, gradient: string }) {
  return (
    <motion.div 
      variants={fadeInUp}
      whileHover={{ y: -8 }}
      className="group relative p-8 rounded-2xl bg-slate-900/50 border border-white/5 backdrop-blur-sm overflow-hidden transition-all duration-500 hover:border-white/20"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
      
      <div className="relative z-10">
        <div className={`mb-6 p-4 rounded-xl bg-gradient-to-br ${gradient} w-fit shadow-lg`}>
          <div className="text-white">{icon}</div>
        </div>
        <h3 className="text-xl font-bold font-display mb-3 text-white">{title}</h3>
        <p className="text-slate-400 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

function ProcessCard({ icon, step, title, description }: { icon: React.ReactNode, step: string, title: string, description: string }) {
  return (
    <motion.div 
      variants={fadeInUp}
      className="relative p-8 rounded-2xl bg-slate-900/50 border border-white/10 backdrop-blur-sm text-center"
    >
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary to-accent rounded-full text-xs font-bold text-white">
        Step {step}
      </div>
      <div className="mb-6 p-4 rounded-xl bg-white/5 w-fit mx-auto text-primary">
        {icon}
      </div>
      <h3 className="text-xl font-bold font-display mb-3 text-white">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{description}</p>
    </motion.div>
  );
}
