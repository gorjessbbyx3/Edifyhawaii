import { motion } from "framer-motion";
import { Link, useParams } from "wouter";
import { ArrowLeft, ArrowRight, CheckCircle2, Server, Code, BarChart, Cloud, Bot, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";

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

const services: Record<string, {
  title: string;
  tagline: string;
  description: string;
  icon: JSX.Element;
  gradient: string;
  features: string[];
  benefits: { title: string; description: string }[];
  pricing?: string;
}> = {
  "managed-it": {
    title: "Managed IT Support",
    tagline: "Your IT Department, Virtually",
    description: "Think of us as your IT department down the hall, just virtual. We monitor your systems 24/7 to catch issues before they disrupt your business, providing enterprise-level support at a fraction of the cost of an in-house team.",
    icon: <Server className="w-8 h-8" />,
    gradient: "from-blue-500 to-cyan-400",
    features: [
      "24/7 Network Monitoring & Alerts",
      "Help Desk Support (Phone, Email, Chat)",
      "Data Backup & Disaster Recovery",
      "Email & Office 365 Management",
      "Cybersecurity & Threat Protection",
      "Vendor Management & Coordination",
      "Hardware & Software Procurement",
      "Regular System Health Reports"
    ],
    benefits: [
      { title: "Reduce Downtime", description: "Proactive monitoring catches issues before they become problems, keeping your team productive." },
      { title: "Predictable Costs", description: "Flat monthly rate means no surprise IT bills. Budget with confidence." },
      { title: "Enterprise Security", description: "Bank-level security protocols protect your business from cyber threats." },
      { title: "Focus on Growth", description: "Let us handle the tech so you can focus on growing your business." }
    ],
    pricing: "Starting at $500/month"
  },
  "web-development": {
    title: "Custom Web Development",
    tagline: "Websites That Convert Visitors to Customers",
    description: "We don't just build websites—we build digital sales machines. Every site we create is designed to convert visitors into paying customers, with SEO baked in from day one to ensure you're found by the right people.",
    icon: <Code className="w-8 h-8" />,
    gradient: "from-purple-500 to-pink-400",
    features: [
      "Custom Design Tailored to Your Brand",
      "Mobile-First Responsive Development",
      "Local SEO Optimization",
      "Fast Load Times (Under 2 Seconds)",
      "Lead Capture & Contact Forms",
      "Google Analytics & Tracking Setup",
      "Content Management System",
      "SSL Security & Hosting Setup"
    ],
    benefits: [
      { title: "Increase Leads", description: "Conversion-focused design means more inquiries and sales from your website." },
      { title: "Rank Higher", description: "SEO-optimized from the ground up to help you dominate local search results." },
      { title: "Stand Out", description: "Custom design that sets you apart from competitors using templates." },
      { title: "Own Everything", description: "You own 100% of your website, code, and content. No lock-ins." }
    ],
    pricing: "Starting at $3,500"
  },
  "crm-dashboards": {
    title: "CRM Dashboards",
    tagline: "Custom Business Software Built for You",
    description: "Off-the-shelf software rarely fits your business perfectly. We build custom CRM systems and dashboards tailored to your exact workflows, helping you manage customers, track sales, and automate repetitive tasks.",
    icon: <BarChart className="w-8 h-8" />,
    gradient: "from-emerald-500 to-teal-400",
    features: [
      "Custom CRM Development",
      "Sales Pipeline Management",
      "Customer Database & History",
      "Automated Follow-ups & Reminders",
      "Reporting & Analytics Dashboards",
      "Integration with Existing Tools",
      "Mobile-Friendly Access",
      "Role-Based User Permissions"
    ],
    benefits: [
      { title: "Never Miss a Lead", description: "Automated follow-ups ensure no opportunity slips through the cracks." },
      { title: "Data-Driven Decisions", description: "Real-time dashboards give you insights to make smarter business decisions." },
      { title: "Save Time", description: "Automate repetitive tasks and free up hours every week." },
      { title: "Scale Efficiently", description: "Systems that grow with your business without breaking." }
    ],
    pricing: "Starting at $5,000"
  },
  "cloud-solutions": {
    title: "Cloud Solutions",
    tagline: "Work From Anywhere, Securely",
    description: "Move your business to the cloud and unlock flexibility, security, and cost savings. We handle the migration, setup, and ongoing management so your team can work from anywhere without compromising security.",
    icon: <Cloud className="w-8 h-8" />,
    gradient: "from-orange-500 to-amber-400",
    features: [
      "Cloud Migration Planning",
      "Microsoft 365 & Google Workspace",
      "Cloud Backup Solutions",
      "Virtual Desktop Infrastructure",
      "Cloud Security & Compliance",
      "File Sharing & Collaboration",
      "Remote Work Enablement",
      "Cost Optimization & Management"
    ],
    benefits: [
      { title: "Work Anywhere", description: "Access your files, apps, and data securely from any device, anywhere." },
      { title: "Reduce Costs", description: "Eliminate expensive on-premise servers and reduce IT overhead." },
      { title: "Automatic Backups", description: "Your data is automatically backed up and protected from disasters." },
      { title: "Enterprise Security", description: "Advanced security features protect your business data in the cloud." }
    ],
    pricing: "Starting at $300/month"
  },
  "ai-chatbox": {
    title: "AI Chatbox",
    tagline: "24/7 Customer Support That Never Sleeps",
    description: "Deploy an intelligent AI-powered chatbot on your website that answers customer questions, qualifies leads, and books appointments around the clock. Train it on your business knowledge to provide accurate, helpful responses.",
    icon: <Bot className="w-8 h-8" />,
    gradient: "from-indigo-500 to-violet-400",
    features: [
      "Custom AI Training on Your Business",
      "24/7 Automated Customer Support",
      "Lead Qualification & Capture",
      "Appointment Scheduling Integration",
      "Multi-Language Support",
      "Seamless Handoff to Human Agents",
      "Analytics & Conversation Insights",
      "Website Widget Customization"
    ],
    benefits: [
      { title: "Never Miss a Lead", description: "Capture and qualify leads even when you're closed or busy." },
      { title: "Reduce Support Costs", description: "Handle common questions automatically, freeing up your team." },
      { title: "Instant Responses", description: "Customers get immediate answers instead of waiting for callbacks." },
      { title: "Learn & Improve", description: "AI gets smarter over time based on real customer interactions." }
    ],
    pricing: "Starting at $200/month"
  },
  "email-marketing": {
    title: "Mass Email Marketing",
    tagline: "Reach Your Audience at Scale",
    description: "Build and nurture your customer relationships with professional email marketing campaigns. From beautiful templates to automated sequences, we help you stay top-of-mind and drive repeat business.",
    icon: <Mail className="w-8 h-8" />,
    gradient: "from-rose-500 to-red-400",
    features: [
      "Custom Email Template Design",
      "Automated Drip Campaigns",
      "List Building & Segmentation",
      "A/B Testing & Optimization",
      "Performance Analytics & Reports",
      "CAN-SPAM Compliance",
      "Integration with Your CRM",
      "Newsletter Management"
    ],
    benefits: [
      { title: "Stay Top of Mind", description: "Regular communication keeps your business in front of customers." },
      { title: "Increase Sales", description: "Targeted campaigns drive repeat purchases and referrals." },
      { title: "Automate Nurturing", description: "Set up once, nurture leads automatically for months." },
      { title: "Measure Everything", description: "Track opens, clicks, and conversions to optimize results." }
    ],
    pricing: "Starting at $300/month"
  }
};

export default function ServiceDetail() {
  const params = useParams<{ slug: string }>();
  const service = services[params.slug || ""];

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">Service Not Found</h1>
          <p className="text-slate-400">The service you're looking for doesn't exist.</p>
          <Link href="/services">
            <Button data-testid="button-back-to-services">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back to Services
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SEO 
        title={`${service.title} | Edify Hawaii IT Services`}
        description={service.description}
      />
      
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[128px] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-8"
          >
            <motion.div variants={fadeInUp}>
              <Link href="/services" data-testid="link-back-services">
                <Button variant="ghost" className="text-slate-400 mb-6">
                  <ArrowLeft className="mr-2 w-4 h-4" />
                  Back to Services
                </Button>
              </Link>
            </motion.div>

            <motion.div variants={fadeInUp} className="space-y-4">
              <div className={`inline-flex items-center gap-3 p-4 bg-gradient-to-r ${service.gradient} rounded-xl shadow-lg w-fit`}>
                <span className="text-white">{service.icon}</span>
              </div>
              
              <h1 data-testid="text-service-title" className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white">
                {service.title}
              </h1>
              
              <p data-testid="text-service-tagline" className="text-2xl text-slate-200 font-medium">
                {service.tagline}
              </p>
              
              <p data-testid="text-service-description" className="text-xl text-slate-400 max-w-3xl">
                {service.description}
              </p>

              {service.pricing && (
                <div className="pt-4">
                  <span data-testid="text-service-pricing" className="inline-block px-4 py-2 bg-white/5 border border-white/10 rounded-full text-lg font-medium text-white">
                    {service.pricing}
                  </span>
                </div>
              )}
            </motion.div>

            <motion.div variants={fadeInUp} className="p-8 rounded-2xl bg-slate-900/50 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">What's Included</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {service.features.map((feature, index) => (
                  <div key={index} data-testid={`text-feature-${index}`} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-slate-300">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {service.benefits.map((benefit, index) => (
                <motion.div 
                  key={index}
                  data-testid={`card-benefit-${index}`}
                  variants={fadeInUp} 
                  className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/50 to-slate-800/30 border border-white/10"
                >
                  <h4 className="text-xl font-bold text-white mb-2">{benefit.title}</h4>
                  <p className="text-slate-400">{benefit.description}</p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 pt-8">
              <Link href="/contact">
                <Button 
                  size="lg"
                  data-testid="button-get-started" 
                  className="bg-gradient-to-r from-primary to-blue-500 text-white font-semibold rounded-xl shadow-2xl shadow-primary/30"
                >
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button 
                  size="lg"
                  variant="outline" 
                  data-testid="button-schedule-call" 
                  className="border-white/20 text-white"
                >
                  Schedule a Call
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
