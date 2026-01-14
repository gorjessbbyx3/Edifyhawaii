import { Link } from "wouter";
import { Code, MapPin, Mail, Phone, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-6 text-white">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight">EDIFY</span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400 mb-6">
              Your in-house IT department, outsourced. Empowering Hawaii's businesses with robust technology solutions and custom software.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-display font-semibold mb-4 text-lg">Services</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/services" className="hover:text-accent transition-colors">Managed IT Support</Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-accent transition-colors">Custom Web Development</Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-accent transition-colors">CRM Dashboards</Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-accent transition-colors">Cloud Solutions</Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-display font-semibold mb-4 text-lg">Company</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="hover:text-accent transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-accent transition-colors">Portfolio</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-accent transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-display font-semibold mb-4 text-lg">Contact</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-accent shrink-0" />
                <span>Honolulu, Hawaii</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-accent shrink-0" />
                <a href="mailto:edifyhawaii@gmail.com" className="hover:text-white transition-colors">edifyhawaii@gmail.com</a>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-accent shrink-0" />
                <a href="tel:+18087675460" className="hover:text-white transition-colors">(808) 767-5460</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} Edify, Limited. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span className="flex items-center gap-1">
              Made with <span className="text-accent">♥</span> in Hawaii
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
