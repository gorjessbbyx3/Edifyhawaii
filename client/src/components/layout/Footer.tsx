import { Link } from "wouter";
import { MapPin, Mail, Phone } from "lucide-react";
import logoImage from "@assets/9538FA01-20E4-4643-BCF9-025719F0F037_1768472217370.png";
import footerVideo from "@assets/Grok-Video-31F3FA52-10E0-44E7-AD6D-9FE7D3C08021_1768908569124.mp4";

export function Footer() {
  return (
    <footer className="bg-black text-slate-300 pt-20 pb-8 border-t border-white/5 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" data-testid="link-footer-logo" className="flex items-center space-x-3 mb-6 text-white group">
              <img 
                src={logoImage} 
                alt="Edify Limited Logo" 
                className="w-10 h-10 rounded-xl shadow-lg shadow-primary/20 transition-all"
              />
              <span className="font-display font-bold text-xl tracking-tight">EDIFY</span>
            </Link>
            <p data-testid="text-footer-description" className="text-sm leading-relaxed text-slate-400 mb-6">
              Your in-house IT department, outsourced. Empowering Hawaii's businesses with robust technology solutions and custom software.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-display font-semibold mb-4 text-lg">Services</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/services" data-testid="link-footer-managed-it" className="text-slate-300 transition-colors">Managed IT Support</Link>
              </li>
              <li>
                <Link href="/services" data-testid="link-footer-web-dev" className="text-slate-300 transition-colors">Custom Web Development</Link>
              </li>
              <li>
                <Link href="/services" data-testid="link-footer-crm" className="text-slate-300 transition-colors">CRM Dashboards</Link>
              </li>
              <li>
                <Link href="/services" data-testid="link-footer-cloud" className="text-slate-300 transition-colors">Cloud Solutions</Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-display font-semibold mb-4 text-lg">Company</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" data-testid="link-footer-about" className="text-slate-300 transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/portfolio" data-testid="link-footer-portfolio" className="text-slate-300 transition-colors">Our Work</Link>
              </li>
              <li>
                <Link href="/services" data-testid="link-footer-process" className="text-slate-300 transition-colors">Our Process</Link>
              </li>
              <li>
                <Link href="/blog" data-testid="link-footer-blog" className="text-slate-300 transition-colors">Insights & Blog</Link>
              </li>
              <li>
                <Link href="/contact" data-testid="link-footer-contact" className="text-slate-300 transition-colors">Free Strategy Audit</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-display font-semibold mb-4 text-lg">Contact</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-accent shrink-0" />
                <span data-testid="text-footer-location">Honolulu, Hawaii</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-accent shrink-0" />
                <a href="mailto:edifyhawaii@gmail.com" data-testid="link-footer-email" className="text-slate-300 transition-colors">edifyhawaii@gmail.com</a>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-accent shrink-0" />
                <a href="tel:+18087675460" data-testid="link-footer-phone" className="text-slate-300 transition-colors">(808) 767-5460</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Video Section */}
        <div className="border-t border-white/5 pt-8 mb-8">
          <div className="max-w-2xl mx-auto rounded-2xl overflow-hidden border border-white/10">
            <video
              src={footerVideo}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto"
              data-testid="video-footer-showcase"
            />
          </div>
        </div>

        {/* Local SEO Footer */}
        <div className="border-t border-white/5 pt-8 mb-8">
          <p className="text-sm text-slate-400 text-center max-w-3xl mx-auto">
            Edify Limited provides professional <strong className="text-slate-300">web design</strong>, <strong className="text-slate-300">IT services</strong>, and <strong className="text-slate-300">custom software development</strong> for small businesses throughout Hawaii, including Honolulu, Maui, Kauai, and the Big Island.
          </p>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <p data-testid="text-copyright">&copy; {new Date().getFullYear()} Edify, Limited. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span className="flex items-center gap-2">
              Hawaii's Trusted Technology Partner
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
