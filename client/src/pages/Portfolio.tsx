import { motion } from "framer-motion";
import { Link } from "wouter";
import { ExternalLink, Layout, Smartphone, Globe, Code, Gavel, Car, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const projects = [
  {
    title: "PoormanTowing.com",
    category: "Web Development & SEO",
    description: "A high-performance lead generation machine for a major Hawaii towing service. Includes custom dispatch integration and SEO strategies that dominate local search results.",
    image: "/assets/IMG_6041.jpeg",
    tags: ["React", "Node.js", "SEO", "Lead Gen"],
    icon: <Globe className="w-6 h-6" />,
    slug: "tow-dispatch"
  },
  {
    title: "RealtorPro",
    category: "Real Estate Platform",
    description: "A comprehensive platform for real estate professionals featuring property listings, client management, and automated marketing tools.",
    image: "/assets/IMG_6034.jpeg",
    tags: ["Real Estate", "CRM", "Listings"],
    icon: <Layout className="w-6 h-6" />,
    slug: "realtor-pro"
  },
  {
    title: "All-in-1 Bonding",
    category: "Web Development",
    description: "A modern, high-conversion web presence for a premier bonding service. Optimized for local SEO and lead generation.",
    image: "/assets/IMG_6083.jpeg",
    tags: ["Vercel", "React", "SEO"],
    icon: <Code className="w-6 h-6" />,
    slug: "all-in-1-bonding"
  },
  {
    title: "Oahu Elite Tours",
    category: "Tourism & Booking",
    description: "A visually stunning tour booking platform for Hawaii's premier guided experiences. Built for high conversion and mobile speed.",
    image: "/assets/IMG_6078.jpeg",
    tags: ["React", "Tailwind", "Tourism"],
    icon: <Globe className="w-6 h-6" />,
    slug: "oahu-elite-tours"
  },
  {
    title: "Mason Martin Law",
    category: "Legal Services",
    description: "A professional digital presence for a trusted Hawaii litigation attorney. Focused on authority, experience, and clear client communication.",
    image: "/assets/IMG_6080.jpeg",
    tags: ["React", "Legal", "Branding"],
    icon: <Gavel className="w-6 h-6" />,
    slug: "martin-law"
  },
  {
    title: "Son Antique",
    category: "Automotive Sales",
    description: "A luxury vehicle marketplace featuring integrated financing and professional service scheduling for Hawaii's auto buyers.",
    image: "/assets/IMG_6081.jpeg",
    tags: ["React", "E-commerce", "Auto"],
    icon: <Car className="w-6 h-6" />,
    slug: "sons-auto"
  },
  {
    title: "Street Patrol",
    category: "Community Safety",
    description: "A community-focused platform designed to enhance neighborhood safety through real-time communication and resource sharing.",
    image: "/assets/IMG_6082.jpeg",
    tags: ["React", "Community", "Safety"],
    icon: <Shield className="w-6 h-6" />,
    slug: "street-patrol"
  }
];

export default function Portfolio() {
  return (
    <div className="pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="space-y-16"
        >
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto">
            <motion.h1 variants={fadeIn} className="text-4xl md:text-6xl font-display font-bold mb-6">
              Our <span className="text-primary">Portfolio</span>
            </motion.h1>
            <motion.p variants={fadeIn} className="text-lg text-muted-foreground">
              From high-traffic websites to complex internal software systems, we build technical solutions that solve real business problems.
            </motion.p>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="group relative bg-white rounded-2xl border border-border overflow-hidden hover:shadow-2xl transition-all duration-500"
              >
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-8 space-y-4">
                  <div className="flex items-center gap-3 text-primary">
                    {project.icon}
                    <span className="text-xs font-bold uppercase tracking-widest">{project.category}</span>
                  </div>
                  <h3 className="text-2xl font-bold font-display">{project.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {project.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-secondary/50 rounded-full text-[10px] font-bold text-primary uppercase tracking-wider">
                        {tag}
                      </span>
                    ))}
                  </div>
                  {project.slug && (
                    <div className="pt-4">
                      <Link href={`/portfolio/${project.slug}`}>
                        <Button variant="link" className="p-0 h-auto text-primary font-bold group-hover:translate-x-1 transition-transform">
                          View Project Details →
                        </Button>
                      </Link>
                    </div>
                  )}
                  {project.url && (
                    <div className="pt-4">
                      <a href={project.url} target="_blank" rel="noopener noreferrer">
                        <Button variant="link" className="p-0 h-auto text-primary font-bold group-hover:translate-x-1 transition-transform">
                          Visit Website →
                        </Button>
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Call to Action */}
          <motion.div 
            variants={fadeIn}
            className="bg-secondary/30 rounded-3xl p-12 text-center max-w-4xl mx-auto border border-primary/10"
          >
            <h2 className="text-3xl font-display font-bold mb-4">Have a project in mind?</h2>
            <p className="text-muted-foreground mb-8">
              Let's build something great together. Whether it's a new website or a custom internal tool, we have the expertise to bring it to life.
            </p>
            <Link href="/contact">
              <Button size="lg" className="px-8 h-auto py-4 text-base">
                Start Your Project
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
