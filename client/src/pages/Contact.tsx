import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertContactSchema, type InsertContact } from "@shared/schema";
import { useSubmitContact } from "@/hooks/use-contact";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, MapPin, Phone, Sparkles, ArrowRight, Clock, Send } from "lucide-react";
import { motion } from "framer-motion";
import { SEO, seoConfig } from "@/components/SEO";

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

export default function Contact() {
  const submitMutation = useSubmitContact();
  
  const form = useForm<InsertContact>({
    resolver: zodResolver(insertContactSchema),
    defaultValues: {
      name: "",
      email: "",
      message: ""
    }
  });

  function onSubmit(data: InsertContact) {
    submitMutation.mutate(data, {
      onSuccess: () => {
        form.reset();
      }
    });
  }

  return (
    <div className="min-h-screen">
      <SEO 
        title={seoConfig.contact.title}
        description={seoConfig.contact.description}
      />
      {/* Hero Section */}
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
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Let's Build Something Great</span>
            </motion.div>
            
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white leading-tight">
              Free Strategy Audit <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-accent animate-gradient-x">
                for Hawaii Businesses
              </span>
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-xl text-slate-400 max-w-2xl mx-auto">
              Schedule your no-obligation consultation. We'll identify growth opportunities and technical issues holding your business back.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            
            {/* Contact Info */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="space-y-8"
            >
              {/* Main Contact Card */}
              <motion.div 
                variants={scaleIn}
                className="relative rounded-3xl overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-blue-500 to-accent" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                
                <div className="relative p-8 md:p-12 text-white">
                  <h2 className="text-2xl font-display font-bold mb-8">Contact Information</h2>
                  
                  <div className="space-y-8">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center shrink-0">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-white/60 mb-1 text-sm uppercase tracking-wider">Phone</p>
                        <a href="tel:+18087675460" data-testid="link-contact-phone" className="text-xl font-semibold text-white">
                          (808) 767-5460
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center shrink-0">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-white/60 mb-1 text-sm uppercase tracking-wider">Email</p>
                        <a href="mailto:edifyhawaii@gmail.com" data-testid="link-contact-email" className="text-xl font-semibold text-white">
                          edifyhawaii@gmail.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-white/60 mb-1 text-sm uppercase tracking-wider">Location</p>
                        <p data-testid="text-contact-location" className="text-xl font-semibold text-white">
                          Honolulu, Hawaii
                        </p>
                        <p className="text-white/70">Serving all islands</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Office Hours Card */}
              <motion.div 
                variants={fadeInUp}
                className="p-8 rounded-2xl bg-slate-900/50 border border-white/10 backdrop-blur-sm"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-white/5">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-xl text-white">Office Hours</h3>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="font-semibold text-white mb-1">Monday - Friday</p>
                    <p data-testid="text-weekday-hours" className="text-slate-400">8:00 AM - 6:00 PM HST</p>
                  </div>
                  <div>
                    <p className="font-semibold text-white mb-1">Weekends</p>
                    <p data-testid="text-weekend-hours" className="text-slate-400">Emergency Support Only</p>
                  </div>
                </div>
              </motion.div>

              {/* Quick Response Badge */}
              <motion.div 
                variants={fadeInUp}
                className="flex items-center gap-4 p-4 rounded-xl bg-green-500/10 border border-green-500/20"
              >
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                <p data-testid="text-response-time" className="text-green-400 font-medium">Usually responds within 2 hours during business hours</p>
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={scaleIn}
              className="relative"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-3xl blur-xl opacity-50" />
              
              <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-primary to-accent">
                    <Send className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-display font-bold text-white">Send us a Message</h2>
                </div>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-300">Full Name</FormLabel>
                          <FormControl>
                            <Input 
                              data-testid="input-name"
                              placeholder="John Doe" 
                              className="rounded-xl bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-primary/50 focus:ring-primary/20" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-300">Email Address</FormLabel>
                          <FormControl>
                            <Input 
                              data-testid="input-email"
                              placeholder="john@company.com" 
                              className="rounded-xl bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-primary/50 focus:ring-primary/20" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-300">How can we help?</FormLabel>
                          <FormControl>
                            <Textarea 
                              data-testid="input-message"
                              placeholder="Tell us about your project or IT needs..." 
                              className="min-h-[150px] rounded-xl bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-primary/50 focus:ring-primary/20 resize-none" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      data-testid="button-submit-contact"
                      disabled={submitMutation.isPending}
                      className="group w-full text-lg font-semibold rounded-xl bg-gradient-to-r from-primary to-blue-500 shadow-xl shadow-primary/25"
                    >
                      {submitMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
