import { Link, useLocation } from "wouter";
import { Menu, X, Code } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  const links = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="fixed w-full z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* Logo */}
          <Link href="/" data-testid="link-logo" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary via-blue-500 to-accent flex items-center justify-center text-white shadow-lg shadow-primary/20 transition-all duration-300">
              <Code className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-xl leading-none text-white tracking-tight">
                EDIFY
              </span>
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
                Limited
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {links.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                data-testid={`link-nav-${link.label.toLowerCase()}`}
                className={`text-sm font-medium transition-colors ${
                  location === link.href ? "text-primary font-bold" : "text-slate-300"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/contact">
              <Button data-testid="button-get-started-nav" className="bg-gradient-to-r from-primary to-blue-500 text-white shadow-lg shadow-primary/30">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              size="icon"
              variant="ghost"
              data-testid="button-mobile-menu"
              onClick={() => setIsOpen(!isOpen)}
              className="text-white"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-950/95 backdrop-blur-xl border-b border-white/5"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {links.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  data-testid={`link-mobile-nav-${link.label.toLowerCase()}`}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    location === link.href 
                      ? "bg-primary/10 text-primary" 
                      : "text-slate-300"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 px-4">
                <Link href="/contact" onClick={() => setIsOpen(false)}>
                  <Button data-testid="button-get-started-mobile" className="w-full bg-gradient-to-r from-primary to-blue-500 text-white shadow-lg">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
