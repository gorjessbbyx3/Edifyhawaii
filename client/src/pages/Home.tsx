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
              className="space-y-8"
            >
              <motion.div variants={fadeIn} className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 border border-white/20">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-xs font-semibold text-white uppercase tracking-wide">Aloha from Edify</span>
              </motion.div>
              
              <motion.h1 variants={fadeIn} className="text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.1] text-white">
                Your In-House <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">IT Department</span>, <br />
                Outsourced.
              </motion.h1>
              
              <motion.p variants={fadeIn} className="text-lg md:text-xl text-white/80 max-w-lg leading-relaxed">
                We empower Hawaii's small businesses with enterprise-grade IT support and custom software solutions. Focus on your business, we'll handle the tech.
              </motion.p>
              
              <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4">
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

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative hidden lg:block"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-slate-900/50 backdrop-blur-md aspect-[4/3]">
                <img 
                  src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&auto=format&fit=crop&q=80" 
                  alt="Modern office technology setup" 
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent flex items-end p-8">
                  <div className="text-white">
                    <p className="font-bold text-lg">Simplifying Complexity</p>
                    <p className="text-white/80 text-sm">Custom solutions built for your needs.</p>
                  </div>
                </div>
              </div>
              
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute -bottom-6 -left-6 bg-slate-900/90 backdrop-blur-md p-6 rounded-xl shadow-xl border border-white/10 max-w-xs"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <p className="font-bold text-white">System Operational</p>
                </div>
                <p className="text-xs text-white/60">24/7 Monitoring & Support for your peace of mind.</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Comprehensive Tech Solutions</h2>
            <p className="text-muted-foreground">Whether you need someone to fix the printer or build a custom CRM, we are your one-stop technical partner.</p>
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
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              {/* laptop computer screen displaying website mockup */}
              <div className="relative rounded-xl overflow-hidden shadow-2xl border-4 border-white transform rotate-1 hover:rotate-0 transition-transform duration-500">
                <img 
                  src="/assets/IMG_6077.jpeg"
                  alt="Poorman Towing Project Showcase"
                  className="w-full"
                />
              </div>
            </div>
            <div className="order-1 lg:order-2 space-y-6">
              <h2 className="text-3xl md:text-4xl font-display font-bold">Featured Project: <br/><span className="text-primary">PoormanTowing.com</span></h2>
              <p className="text-muted-foreground leading-relaxed">
                We don't just fix computers; we build businesses online. For Poorman Towing, we developed a high-performance, SEO-optimized website that drives leads and integrates directly with their dispatch system.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-accent">✓</div>
                  <span className="font-medium text-foreground">Custom Design & Branding</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-accent">✓</div>
                  <span className="font-medium text-foreground">SEO Optimization</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-accent">✓</div>
                  <span className="font-medium text-foreground">Mobile Responsive</span>
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
        <div className="absolute inset-0 bg-primary" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10 space-y-8">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white">Ready to upgrade your IT?</h2>
          <p className="text-primary-foreground/80 text-lg md:text-xl max-w-2xl mx-auto">
            Stop worrying about downtime and start focusing on growth. Let Edify be your partner in technology.
          </p>
          <Link href="/contact">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-bold text-lg px-8 py-6 h-auto shadow-xl">
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
      className="p-8 rounded-2xl bg-white border border-border shadow-lg shadow-black/5 hover:shadow-xl hover:border-primary/20 transition-all duration-300 group"
    >
      <div className="mb-6 p-3 bg-secondary/30 rounded-xl w-fit group-hover:bg-primary/10 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold font-display mb-3 text-foreground group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}
