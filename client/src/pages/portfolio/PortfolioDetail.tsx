import { motion } from "framer-motion";
import { Link, useParams } from "wouter";
import { ArrowLeft, ExternalLink, Globe, Layout, Code, Gavel, Car, Shield, Camera, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";

import imgTowing from "@assets/IMG_6041_1768357867879.jpeg";
import imgRealtor from "@assets/IMG_6034_1768357795603.jpeg";
import imgBonding from "@assets/IMG_6083_1768422171688.jpeg";
import imgTours from "@assets/IMG_6078_1768421334511.jpeg";
import imgLaw from "@assets/IMG_6080_1768421566889.jpeg";
import imgAuto from "@assets/IMG_6081_1768421794787.jpeg";
import imgPatrol from "@assets/IMG_6082_1768422114148.jpeg";
import imgCaptured from "@assets/IMG_6084_1768471472326.jpeg";
import imgDashboard from "@assets/IMG_6090_1768554040490.jpeg";

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

const projects: Record<string, {
  title: string;
  category: string;
  description: string;
  image: string;
  tags: string[];
  icon: JSX.Element;
  gradient: string;
  challenge: string;
  solution: string;
  results: string[];
  liveUrl?: string;
}> = {
  "poorman-website": {
    title: "PoormanTowing.com",
    category: "Web Development & SEO",
    description: "A high-performance marketing website for Hawaii's trusted towing service. Optimized for local SEO and lead generation with mobile-first design.",
    image: imgTowing,
    tags: ["React", "SEO", "Lead Gen"],
    icon: <Globe className="w-5 h-5" />,
    gradient: "from-blue-500 to-cyan-400",
    challenge: "Poorman Towing was losing 5+ calls daily to competitors due to an outdated website that didn't appear in local search results.",
    solution: "We built a lightning-fast, mobile-optimized website with aggressive local SEO targeting, Google Business integration, and conversion-focused design.",
    results: [
      "+300% increase in monthly leads",
      "Page 1 ranking for 'towing Oahu'",
      "Sub-2 second load times",
      "40% reduction in bounce rate"
    ],
    liveUrl: "https://poormantowing.com"
  },
  "poorman-dashboard": {
    title: "Poorman808 Dashboard",
    category: "Custom Software",
    description: "A proprietary dispatch management system with real-time fleet tracking, job queue management, invoicing, and live map integration for towing operations.",
    image: imgDashboard,
    tags: ["Dashboard", "Real-time", "Fleet Management"],
    icon: <Layout className="w-5 h-5" />,
    gradient: "from-orange-500 to-red-400",
    challenge: "Manual dispatch coordination was causing delays, missed jobs, and communication breakdowns across the fleet.",
    solution: "We developed a custom dispatch dashboard with real-time GPS tracking, automated job assignment, driver status updates, and integrated invoicing.",
    results: [
      "50% faster dispatch times",
      "Real-time fleet visibility",
      "Automated invoicing",
      "Reduced miscommunication by 80%"
    ]
  },
  "realtor-pro": {
    title: "RealtorPro",
    category: "Real Estate Platform",
    description: "A comprehensive platform for real estate professionals featuring property listings, client management, and automated marketing tools.",
    image: imgRealtor,
    tags: ["Real Estate", "CRM", "Listings"],
    icon: <Layout className="w-5 h-5" />,
    gradient: "from-emerald-500 to-teal-400",
    challenge: "Agents were juggling multiple tools for listings, client management, and marketing, leading to inefficiency and missed opportunities.",
    solution: "We created an all-in-one platform that centralizes property listings, automates follow-ups, and provides marketing templates.",
    results: [
      "Unified listing management",
      "Automated client follow-ups",
      "Integrated marketing tools",
      "30% time savings on admin tasks"
    ]
  },
  "all-in-1-bonding": {
    title: "All-in-1 Bonding",
    category: "Web Development",
    description: "A modern, high-conversion web presence for a premier bonding service. Optimized for local SEO and lead generation.",
    image: imgBonding,
    tags: ["Vercel", "React", "SEO"],
    icon: <Code className="w-5 h-5" />,
    gradient: "from-purple-500 to-pink-400",
    challenge: "The existing website was outdated and not generating leads for the bonding service.",
    solution: "We built a modern, trust-focused website with clear service explanations, easy contact forms, and local SEO optimization.",
    results: [
      "Modern, professional design",
      "Improved lead generation",
      "Better local search visibility",
      "Mobile-optimized experience"
    ]
  },
  "oahu-elite-tours": {
    title: "Oahu Elite Tours",
    category: "Tourism & Booking",
    description: "A visually stunning tour booking platform for Hawaii's premier guided experiences. Built for high conversion and mobile speed.",
    image: imgTours,
    tags: ["React", "Tailwind", "Tourism"],
    icon: <Globe className="w-5 h-5" />,
    gradient: "from-orange-500 to-amber-400",
    challenge: "The tour company needed a booking platform that showcased their experiences while handling reservations seamlessly.",
    solution: "We developed a visually immersive website with integrated booking, stunning imagery, and mobile-first design for travelers on the go.",
    results: [
      "Seamless online booking",
      "Stunning visual experience",
      "Mobile-optimized for travelers",
      "Increased direct bookings"
    ]
  },
  "martin-law": {
    title: "Mason Martin Law",
    category: "Legal Services",
    description: "A professional digital presence for a trusted Hawaii litigation attorney. Focused on authority, experience, and clear client communication.",
    image: imgLaw,
    tags: ["React", "Legal", "Branding"],
    icon: <Gavel className="w-5 h-5" />,
    gradient: "from-slate-500 to-slate-400",
    challenge: "The law firm's outdated website didn't convey the authority and expertise needed to attract high-value clients.",
    solution: "We created a sophisticated, trust-building website that highlights experience, case results, and provides clear paths to consultation.",
    results: [
      "+45% more consultation requests",
      "Professional authority established",
      "Clear client communication",
      "Improved search visibility for legal terms"
    ]
  },
  "sons-auto": {
    title: "Son Antique",
    category: "Automotive Sales",
    description: "A luxury vehicle marketplace featuring integrated financing and professional service scheduling for Hawaii's auto buyers.",
    image: imgAuto,
    tags: ["React", "E-commerce", "Auto"],
    icon: <Car className="w-5 h-5" />,
    gradient: "from-red-500 to-rose-400",
    challenge: "The dealership needed a modern platform to showcase inventory and streamline the buying process.",
    solution: "We built a sleek marketplace with vehicle galleries, financing integration, and easy scheduling for test drives and service.",
    results: [
      "Modern inventory showcase",
      "Integrated financing options",
      "Easy appointment scheduling",
      "Improved customer experience"
    ]
  },
  "street-patrol": {
    title: "Street Patrol",
    category: "Community Safety",
    description: "A community-focused platform designed to enhance neighborhood safety through real-time communication and resource sharing.",
    image: imgPatrol,
    tags: ["React", "Community", "Safety"],
    icon: <Shield className="w-5 h-5" />,
    gradient: "from-indigo-500 to-violet-400",
    challenge: "Communities lacked a centralized way to communicate about safety concerns and share resources.",
    solution: "We developed a community platform with real-time updates, incident reporting, and resource directories.",
    results: [
      "Real-time community updates",
      "Easy incident reporting",
      "Resource sharing capabilities",
      "Stronger neighborhood connections"
    ]
  },
  "captured-c-collective": {
    title: "Captured C Collective",
    category: "Photography & Media",
    description: "A premium photography and cinematic media platform by Christian, specializing in high-impact content for real estate, events, and branded visual storytelling.",
    image: imgCaptured,
    tags: ["Photography", "Cinematic", "Branding"],
    icon: <Camera className="w-5 h-5" />,
    gradient: "from-pink-500 to-fuchsia-400",
    challenge: "The photographer needed a portfolio that showcased their work with the same visual impact they deliver to clients.",
    solution: "We created a stunning, gallery-focused website that lets the work speak for itself with minimal distractions.",
    results: [
      "Stunning visual portfolio",
      "Easy gallery navigation",
      "Professional brand presence",
      "Increased booking inquiries"
    ]
  }
};

export default function PortfolioDetail() {
  const params = useParams<{ slug: string }>();
  const project = projects[params.slug || ""];

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">Project Not Found</h1>
          <p className="text-slate-400">The project you're looking for doesn't exist.</p>
          <Link href="/portfolio">
            <Button data-testid="button-back-to-portfolio">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back to Portfolio
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SEO 
        title={`${project.title} | Edify Portfolio`}
        description={project.description}
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
              <Link href="/portfolio" data-testid="link-back-portfolio">
                <Button variant="ghost" className="text-slate-400 hover:text-white mb-6">
                  <ArrowLeft className="mr-2 w-4 h-4" />
                  Back to Portfolio
                </Button>
              </Link>
            </motion.div>

            <motion.div variants={fadeInUp} className="space-y-4">
              <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${project.gradient} rounded-full px-4 py-2`}>
                <span className="text-white">{project.icon}</span>
                <span className="text-sm font-bold text-white uppercase tracking-wider">{project.category}</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white">
                {project.title}
              </h1>
              
              <p className="text-xl text-slate-400 max-w-3xl">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                {project.tags.map(tag => (
                  <span key={tag} className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-sm font-medium text-slate-300">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="rounded-2xl overflow-hidden border border-white/10">
              <img 
                src={project.image} 
                alt={project.title}
                className="w-full h-auto"
              />
            </motion.div>

            <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
              <motion.div variants={fadeInUp} className="p-6 rounded-2xl bg-slate-900/50 border border-white/10 space-y-4">
                <h3 className="text-xl font-bold text-white">The Challenge</h3>
                <p className="text-slate-400 leading-relaxed">{project.challenge}</p>
              </motion.div>
              
              <motion.div variants={fadeInUp} className="p-6 rounded-2xl bg-slate-900/50 border border-white/10 space-y-4">
                <h3 className="text-xl font-bold text-white">Our Solution</h3>
                <p className="text-slate-400 leading-relaxed">{project.solution}</p>
              </motion.div>
            </motion.div>

            <motion.div variants={fadeInUp} className="p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">Results</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {project.results.map((result, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-white font-medium">{result}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 pt-4">
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <Button data-testid="button-view-live" className="bg-gradient-to-r from-primary to-blue-500 text-white">
                    <ExternalLink className="mr-2 w-4 h-4" />
                    View Live Site
                  </Button>
                </a>
              )}
              <Link href="/contact">
                <Button variant="outline" data-testid="button-start-project-detail" className="border-white/20 text-white">
                  Start Your Project
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
