import { motion } from "framer-motion";
import { Link, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Clock, ArrowLeft, User, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import type { BlogPost as BlogPostType } from "@shared/schema";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
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

function renderContent(content: string) {
  const paragraphs = content.split('\n\n');
  return paragraphs.map((para, index) => {
    if (para.startsWith('## ')) {
      return (
        <h2 key={index} className="text-2xl md:text-3xl font-display font-bold text-white mt-12 mb-6">
          {para.replace('## ', '')}
        </h2>
      );
    }
    if (para.startsWith('### ')) {
      return (
        <h3 key={index} className="text-xl md:text-2xl font-display font-bold text-white mt-8 mb-4">
          {para.replace('### ', '')}
        </h3>
      );
    }
    if (para.startsWith('- ')) {
      const items = para.split('\n').filter(line => line.startsWith('- '));
      return (
        <ul key={index} className="list-disc list-inside space-y-2 text-slate-300 my-6 ml-4">
          {items.map((item, i) => (
            <li key={i}>{item.replace('- ', '')}</li>
          ))}
        </ul>
      );
    }
    if (para.startsWith('> ')) {
      return (
        <blockquote key={index} className="border-l-4 border-primary pl-6 py-2 my-8 text-lg text-slate-300 italic">
          {para.replace('> ', '')}
        </blockquote>
      );
    }
    return (
      <p key={index} className="text-slate-300 leading-relaxed mb-6">
        {para}
      </p>
    );
  });
}

export default function BlogPost() {
  const params = useParams();
  const slug = params.slug;

  const { data: post, isLoading, error } = useQuery<BlogPostType>({
    queryKey: [`/api/blog/${slug}`],
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-slate-800 rounded w-3/4" />
            <div className="h-4 bg-slate-800 rounded w-1/2" />
            <div className="aspect-video bg-slate-800 rounded-2xl" />
            <div className="space-y-4">
              <div className="h-4 bg-slate-800 rounded w-full" />
              <div className="h-4 bg-slate-800 rounded w-full" />
              <div className="h-4 bg-slate-800 rounded w-3/4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-display font-bold text-white mb-4">Post Not Found</h1>
          <p className="text-slate-400 mb-8">The article you're looking for doesn't exist.</p>
          <Link href="/blog">
            <Button variant="outline" data-testid="button-back-blog">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SEO 
        title={`${post.title} | Edify Blog`}
        description={post.excerpt}
      />

      <article className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/blog">
            <Button variant="ghost" className="mb-8" data-testid="button-back-blog">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back to Blog
            </Button>
          </Link>

          <motion.header 
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="space-y-6 mb-12"
          >
            <span className="inline-block px-3 py-1 text-sm font-medium bg-primary/10 text-primary rounded-full border border-primary/20" data-testid="badge-category">
              {post.category}
            </span>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-tight" data-testid="heading-blog-title">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400">
              <span className="flex items-center gap-2" data-testid="text-author">
                <User className="w-4 h-4" />
                {post.author}
              </span>
              <span className="flex items-center gap-2" data-testid="text-date">
                <Calendar className="w-4 h-4" />
                Published {formatDate(post.createdAt)}
              </span>
              {post.updatedAt && post.updatedAt !== post.createdAt && (
                <span className="flex items-center gap-2" data-testid="text-updated">
                  <RefreshCw className="w-4 h-4" />
                  Updated {formatDate(post.updatedAt)}
                </span>
              )}
              <span className="flex items-center gap-2" data-testid="text-readtime">
                <Clock className="w-4 h-4" />
                {estimateReadTime(post.content)}
              </span>
            </div>
          </motion.header>

          {post.featuredImage && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-12 rounded-2xl overflow-hidden border border-white/10"
            >
              <img 
                src={post.featuredImage} 
                alt={post.title}
                className="w-full h-auto object-cover"
              />
            </motion.div>
          )}

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="prose prose-lg prose-invert max-w-none"
          >
            {renderContent(post.content)}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-16 pt-8 border-t border-white/10"
          >
            <div className="flex items-center justify-between">
              <Link href="/blog">
                <Button variant="outline" data-testid="button-more-articles">
                  <ArrowLeft className="mr-2 w-4 h-4" />
                  More Articles
                </Button>
              </Link>
              <Link href="/contact">
                <Button data-testid="button-cta-blog">
                  Get Your Free Audit
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </article>
    </div>
  );
}
