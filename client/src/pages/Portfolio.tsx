import { motion } from "framer-motion";
import { Link } from "wouter";
import { ExternalLink, Layout, Globe, Code, Gavel, Car, Shield, Camera, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SEO, seoConfig } from "@/components/SEO";

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

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
};

const projects = [
  {
    title: "PoormanTowing.com",
    category: "Web Development & SEO",
    description: "A high-performance marketing website for Hawaii's trusted towing service. Optimized for local SEO and lead generation with mobile-first design.",
    image: imgTowing,
    tags: ["React", "SEO", "Lead Gen"],
    icon: <Globe className="w-5 h-5" />,
    slug: "poorman-website",
    gradient: "from-blue-500 to-cyan-400"
  },
  {
    title: "Poorman808 Dashboard",
    category: "Custom Software",
    description: "A proprietary dispatch management system with real-time fleet tracking, job queue management, invoicing, and live map integration for towing operations.",
    image: imgDashboard,
    tags: ["Dashboard", "Real-time", "Fleet Management"],
    icon: <Layout className="w-5 h-5" />,
    slug: "poorman-dashboard",
    gradient: "from-orange-500 to-red-400"
  },
  {
    title: "RealtorPro",
    category: "Real Estate Platform",
    description: "A comprehensive platform for real estate professionals featuring property listings, client management, and automated marketing tools.",
    image: imgRealtor,
    tags: ["Real Estate", "CRM", "Listings"],
    icon: <Layout className="w-5 h-5" />,
    slug: "realtor-pro",
    gradient: "from-emerald-500 to-teal-400"
  },
  {
    title: "All-in-1 Bonding",
    category: "Web Development",
    description: "A modern, high-conversion web presence for a premier bonding service. Optimized for local SEO and lead generation.",
    image: imgBonding,
    tags: ["Vercel", "React", "SEO"],
    icon: <Code className="w-5 h-5" />,
    slug: "all-in-1-bonding",
    gradient: "from-purple-500 to-pink-400"
  },
  {
    title: "Oahu Elite Tours",
    category: "Tourism & Booking",
    description: "A visually stunning tour booking platform for Hawaii's premier guided experiences. Built for high conversion and mobile speed.",
    image: imgTours,
    tags: ["React", "Tailwind", "Tourism"],
    icon: <Globe className="w-5 h-5" />,
    slug: "oahu-elite-tours",
    gradient: "from-orange-500 to-amber-400"
  },
  {
    title: "Mason Martin Law",
    category: "Legal Services",
    description: "A professional digital presence for a trusted Hawaii litigation attorney. Focused on authority, experience, and clear client communication.",
    image: imgLaw,
    tags: ["React", "Legal", "Branding"],
    icon: <Gavel className="w-5 h-5" />,
    slug: "martin-law",
    gradient: "from-slate-500 to-slate-400"
  },
  {
    title: "Son Antique",
    category: "Automotive Sales",
    description: "A luxury vehicle marketplace featuring integrated financing and professional service scheduling for Hawaii's auto buyers.",
    image: imgAuto,
    tags: ["React", "E-commerce", "Auto"],
    icon: <Car className="w-5 h-5" />,
    slug: "sons-auto",
    gradient: "from-red-500 to-rose-400"
  },
  {
    title: "Street Patrol",
    category: "Community Safety",
    description: "A community-focused platform designed to enhance neighborhood safety through real-time communication and resource sharing.",
    image: imgPatrol,
    tags: ["React", "Community", "Safety"],
    icon: <Shield className="w-5 h-5" />,
    slug: "street-patrol",
    gradient: "from-indigo-500 to-violet-400"
  },
  {
    title: "Captured C Collective",
    category: "Photography & Media",
    description: "A premium photography and cinematic media platform by Christian, specializing in high-impact content for real estate, events, and branded visual storytelling.",
    image: imgCaptured,
    tags: ["Photography", "Cinematic", "Branding"],
    icon: <Camera className="w-5 h-5" />,
    slug: "captured-c-collective",
    gradient: "from-pink-500 to-fuchsia-400"
  }
];

export default function Portfolio() {
  return (
    <div className="min-h-screen">
      <SEO 
        title={seoConfig.portfolio.title}
        description={seoConfig.portfolio.description}
      />
      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        {/* Background elements */}
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
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Our Work Speaks for Itself</span>
            </motion.div>
            
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white leading-tight">
              Hawaii Client <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-accent animate-gradient-x">
                Growth Stories
              </span>
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-xl text-slate-400 max-w-2xl mx-auto">
              Real transformations from Hawaii businesses. See how Edify helped local companies increase leads, revenue, and digital authority through strategic web design.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {projects.map((project, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -8 }}
                className="group relative rounded-2xl overflow-hidden bg-slate-900/50 border border-white/5 backdrop-blur-sm hover:border-white/20 transition-all duration-500"
              >
                {/* Glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                
                {/* Image */}
                <div className="aspect-video overflow-hidden relative">
                  <img 
                    src={project.image} 
                    alt={`${project.title} - Hawaii business website design showcasing increased lead generation and digital growth`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
                  
                  {/* Category badge */}
                  <div className="absolute top-4 left-4">
                    <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${project.gradient} rounded-full px-3 py-1.5`}>
                      <span className="text-white">{project.icon}</span>
                      <span className="text-xs font-bold text-white uppercase tracking-wider">{project.category}</span>
                    </div>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6 space-y-4">
                  <h3 className="text-2xl font-bold font-display text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 transition-all duration-300">
                    {project.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">
                    {project.description}
                  </p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  {/* Link */}
                  {project.slug && (
                    <Link 
                      href={`/portfolio/${project.slug}`}
                      data-testid={`link-view-project-${project.slug}`}
                      className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary/80 transition-colors group/btn"
                    >
                      View Project
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-8"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-display font-bold text-white">
              Ready to Join This List?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-slate-400 max-w-2xl mx-auto">
              Let's create something extraordinary together. Your project could be our next masterpiece.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Link href="/contact" data-testid="link-start-project-portfolio">
                <Button 
                  size="lg" 
                  data-testid="button-start-project-portfolio"
                  className="group bg-gradient-to-r from-primary to-blue-500 text-white font-semibold rounded-xl shadow-2xl shadow-primary/30"
                >
                  Start Your Project
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
