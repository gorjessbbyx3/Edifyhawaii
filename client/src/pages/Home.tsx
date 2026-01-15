import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Server, Globe, ShieldCheck, Cpu, Layout, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroVideo from "@assets/_users_9b25cb5e-ce71-4d7e-bbca-6899b4a7896f_generated_dcfe4f1d_1768470906588.mp4";

// Animation variants
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

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-slate-950">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={heroVideo} type="video/mp4" />
          </video>
          {/* Lighter Dark Wash Overlay for better visibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/40 to-slate-950/60" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="space-y-8 text-center lg:text-left"
            >
              <motion.div variants={fadeIn} className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 border border-white/20">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-xs font-semibold text-white uppercase tracking-wide">Aloha from Edify</span>
              </motion.div>
              
              <motion.h1 variants={fadeIn} className="text-5xl md:text-6xl lg:text-8xl font-display font-bold leading-[1.1] text-white">
                Your In-House <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">IT Department</span>, <br />
                Outsourced.
              </motion.h1>
              
              <motion.p variants={fadeIn} className="text-lg md:text-xl text-white/80 max-w-lg leading-relaxed mx-auto lg:mx-0">
                We empower Hawaii's small businesses with enterprise-grade IT support and custom software solutions. Focus on your business, we'll handle the tech.
              </motion.p>
              
              <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/contact">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all text-base px-8 py-6 h-auto">
                    Get a Free Consultation
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/services">
                  <Button variant="outline" size="lg" className="border-2 border-white/20 text-white hover:bg-white/10 backdrop-blur-sm text-base px-8 py-6 h-auto">
                    Explore Services
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            <div className="hidden lg:block" />
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-white">Comprehensive Tech Solutions</h2>
            <p className="text-slate-400">Whether you need someone to fix the printer or build a custom CRM, we are your one-stop technical partner.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ServiceCard 
              icon={<Server className="w-8 h-8 text-primary" />}
              title="Managed IT Services"
              description="Proactive monitoring, maintenance, and support for your entire network and workstation fleet."
            />
            <ServiceCard 
              icon={<Terminal className="w-8 h-8 text-accent" />}
              title="Custom Software"
              description="Tailor-made applications, dashboards, and automated workflows designed for your specific business logic."
            />
            <ServiceCard 
              icon={<Globe className="w-8 h-8 text-primary" />}
              title="Web Development"
              description="Modern, responsive, and high-performance websites that convert visitors into customers."
            />
            <ServiceCard 
              icon={<ShieldCheck className="w-8 h-8 text-accent" />}
              title="Cybersecurity"
              description="Protect your valuable business data with enterprise-grade security protocols and backups."
            />
            <ServiceCard 
              icon={<Cpu className="w-8 h-8 text-primary" />}
              title="Hardware Procurement"
              description="We handle the sourcing, setup, and installation of computers, servers, and networking gear."
            />
            <ServiceCard 
              icon={<Layout className="w-8 h-8 text-accent" />}
              title="CRM Dashboards"
              description="Visualize your data with custom-built dashboards that give you real-time insights."
            />
          </div>
        </div>
      </section>

      {/* Portfolio Highlight */}
      <section className="py-24 bg-slate-900/50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              {/* laptop computer screen displaying website mockup */}
              <div className="relative rounded-xl overflow-hidden shadow-2xl border-4 border-slate-800 transform rotate-1 hover:rotate-0 transition-transform duration-500">
                <img 
                  src="/assets/IMG_6077.jpeg"
                  alt="Poorman Towing Project Showcase"
                  className="w-full"
                />
              </div>
            </div>
            <div className="order-1 lg:order-2 space-y-6">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white">Featured Project: <br/><span className="text-primary">PoormanTowing.com</span></h2>
              <p className="text-slate-400 leading-relaxed">
                We don't just fix computers; we build businesses online. For Poorman Towing, we developed a high-performance, SEO-optimized website that drives leads and integrates directly with their dispatch system.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-accent">✓</div>
                  <span className="font-medium text-slate-200">Custom Design & Branding</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-accent">✓</div>
                  <span className="font-medium text-slate-200">SEO Optimization</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-accent">✓</div>
                  <span className="font-medium text-slate-200">Mobile Responsive</span>
                </li>
              </ul>
              <div className="pt-4">
                <Link href="/services">
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                    What We Do
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/20 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10 space-y-8">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white">Ready to upgrade your IT?</h2>
          <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto">
            Stop worrying about downtime and start focusing on growth. Let Edify be your partner in technology.
          </p>
          <Link href="/contact">
            <Button size="lg" className="bg-primary text-white hover:bg-primary/90 font-bold text-lg px-8 py-6 h-auto shadow-xl shadow-primary/20 transition-all">
              Schedule Your Free Audit
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

function ServiceCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="p-8 rounded-2xl bg-slate-900/40 border border-white/5 shadow-lg backdrop-blur-sm hover:border-primary/50 transition-all duration-300 group"
    >
      <div className="mb-6 p-3 bg-white/5 rounded-xl w-fit group-hover:bg-primary/10 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold font-display mb-3 text-white group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-slate-400 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}
