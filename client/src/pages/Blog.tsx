import { motion } from "framer-motion";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Clock, ArrowRight, Sparkles, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import type { BlogPost } from "@shared/schema";

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

function formatDate(date: Date | string | null) {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function estimateReadTime(content: string) {
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
}

export default function Blog() {
  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
  });

  return (
    <div className="min-h-screen">
      <SEO 
        title="Insights & Updates - Hawaii Business Technology Blog | Edify"
        description="Expert insights on web design, digital marketing, and technology for Hawaii businesses. Learn strategies to grow your local business online."
      />
      
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
              <BookOpen className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Industry Insights</span>
            </motion.div>
            
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white leading-tight" data-testid="heading-blog-main">
              Insights for Hawaii <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-accent animate-gradient-x">
                Business Growth
              </span>
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-xl text-slate-400 max-w-2xl mx-auto">
              Expert strategies, industry updates, and actionable tips to help your Hawaii business thrive in the digital landscape.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-2xl bg-slate-900/50 border border-white/5 animate-pulse">
                  <div className="aspect-video bg-slate-800" />
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-slate-800 rounded w-1/4" />
                    <div className="h-6 bg-slate-800 rounded w-3/4" />
                    <div className="h-4 bg-slate-800 rounded w-full" />
                    <div className="h-4 bg-slate-800 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : posts && posts.length > 0 ? (
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {posts.map((post) => (
                <motion.article
                  key={post.id}
                  variants={fadeInUp}
                  data-testid={`card-blog-${post.id}`}
                  className="group relative rounded-2xl overflow-hidden bg-slate-900/50 border border-white/5 backdrop-blur-sm hover:border-white/20 transition-all duration-500"
                >
                  <Link href={`/blog/${post.slug}`} data-testid={`link-blog-${post.slug}`}>
                    {post.featuredImage && (
                      <div className="aspect-video overflow-hidden relative">
                        <img 
                          src={post.featuredImage} 
                          alt={post.title}
                          data-testid={`img-blog-${post.id}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 text-xs font-medium bg-primary/90 text-white rounded-full" data-testid={`badge-category-${post.id}`}>
                            {post.category}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <div className="p-6 space-y-4">
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1" data-testid={`text-date-${post.id}`}>
                          <Calendar className="w-3 h-3" />
                          {formatDate(post.createdAt)}
                        </span>
                        <span className="flex items-center gap-1" data-testid={`text-readtime-${post.id}`}>
                          <Clock className="w-3 h-3" />
                          {estimateReadTime(post.content)}
                        </span>
                      </div>
                      
                      <h2 className="text-xl font-display font-bold text-white group-hover:text-primary transition-colors line-clamp-2" data-testid={`heading-blog-${post.id}`}>
                        {post.title}
                      </h2>
                      
                      <p className="text-sm text-slate-400 line-clamp-3" data-testid={`text-excerpt-${post.id}`}>
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center text-primary text-sm font-medium group-hover:gap-2 transition-all" data-testid={`link-readmore-${post.id}`}>
                        Read More
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Sparkles className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-display font-bold text-white mb-2">Coming Soon</h3>
              <p className="text-slate-400">We're working on exciting content for you. Check back soon!</p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
