import React from 'react';
import { useAcademy } from '../context/AcademyContext';
import { 
  MapPin, Phone, Mail, Clock, ShieldCheck, GraduationCap, 
  Facebook, Instagram, MessageCircle 
} from 'lucide-react';

export default function Footer() {
  const { setView } = useAcademy();

  return (
    <footer className="bg-slate-950 text-slate-400 font-sans border-t border-slate-900">
      
      {/* Top Footer Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Col 1: About & Logo */}
          <div className="space-y-6">
            <div className="flex items-center cursor-pointer" onClick={() => setView('home')}>
              <div className="p-2 bg-[#c19d53] rounded-lg text-slate-950 mr-3">
                <GraduationCap className="h-5 w-5 stroke-[2.5]" />
              </div>
              <div>
                <span className="font-serif text-lg font-bold tracking-tight text-white block">THE CHEF'S</span>
                <span className="text-[9px] tracking-[0.3em] font-sans font-semibold text-[#c19d53] uppercase -mt-1 block">ACADEMY</span>
              </div>
            </div>
            
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-light">
              An SECP-registered culinary & hospitality training academy in Gulberg, Lahore — built for the next generation of chefs, bakers, baristas, and food innovators.
            </p>

            {/* Social Links */}
            <div className="flex items-center space-x-3.5">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noreferrer" 
                className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 hover:border-[#c19d53] hover:text-[#c19d53] flex items-center justify-center transition-all"
                title="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer" 
                className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 hover:border-[#c19d53] hover:text-[#c19d53] flex items-center justify-center transition-all"
                title="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a 
                href="https://wa.me/923288888907" 
                target="_blank" 
                rel="noreferrer" 
                className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 hover:border-[#c19d53] hover:text-[#c19d53] flex items-center justify-center transition-all"
                title="WhatsApp"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>

            <div className="flex items-center space-x-2 text-[10px] text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 px-3 py-1.5 rounded-lg w-max">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              <span className="font-bold tracking-wider uppercase">SECP Registered Institute</span>
            </div>
          </div>

          {/* Col 2: Courses */}
          <div className="space-y-4">
            <h4 className="font-serif text-white font-bold text-xs uppercase tracking-wider border-l-2 border-[#c19d53] pl-3">
              Our Courses
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <button onClick={() => setView('home')} className="hover:text-[#c19d53] transition-colors text-left font-light">
                  Culinary Arts
                </button>
              </li>
              <li>
                <button onClick={() => setView('home')} className="hover:text-[#c19d53] transition-colors text-left font-light">
                  Professional Chef
                </button>
              </li>
              <li>
                <button onClick={() => setView('home')} className="hover:text-[#c19d53] transition-colors text-left font-light">
                  Baking & Desserts
                </button>
              </li>
              <li>
                <button onClick={() => setView('home')} className="hover:text-[#c19d53] transition-colors text-left font-light">
                  Barista Skills
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Links */}
          <div className="space-y-4">
            <h4 className="font-serif text-white font-bold text-xs uppercase tracking-wider border-l-2 border-[#c19d53] pl-3">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <button onClick={() => setView('home')} className="hover:text-[#c19d53] transition-colors text-left font-light">
                  About
                </button>
              </li>
              <li>
                <button onClick={() => setView('home')} className="hover:text-[#c19d53] transition-colors text-left font-light flex items-center space-x-1.5">
                  <span>Admissions</span>
                  <span className="bg-[#c19d53]/10 text-[#c19d53] text-[9px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">Open</span>
                </button>
              </li>
              <li>
                <button onClick={() => setView('home')} className="hover:text-[#c19d53] transition-colors text-left font-light">
                  FAQs
                </button>
              </li>
              <li>
                <button onClick={() => setView('home')} className="hover:text-[#c19d53] transition-colors text-left font-light">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => setView('home')} className="hover:text-[#c19d53] transition-colors text-left font-light">
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Location */}
          <div className="space-y-4">
            <h4 className="font-serif text-white font-bold text-xs uppercase tracking-wider border-l-2 border-[#c19d53] pl-3">
              Contact Details
            </h4>
            
            <ul className="space-y-4 text-xs sm:text-sm">
              <li className="flex items-start space-x-2.5">
                <MapPin className="h-5 w-5 text-[#c19d53] flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed text-slate-300 font-light">
                  📍 79-B3 Gulberg III, Lahore, Pakistan
                </span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone className="h-4 w-4 text-[#c19d53] flex-shrink-0" />
                <div className="space-y-0.5">
                  <a href="tel:+923288888907" className="text-slate-300 block hover:text-[#c19d53] transition-colors font-mono font-medium">+92 328 8888907</a>
                  <span className="text-[10px] text-slate-500 block">Admissions Department</span>
                </div>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail className="h-4 w-4 text-[#c19d53] flex-shrink-0" />
                <a href="mailto:info@thechefsacademy.pk" className="text-slate-300 select-all hover:text-[#c19d53] transition-colors font-light">
                  info@thechefsacademy.pk
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Footer Credits */}
      <div className="bg-slate-950 border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 The Chef's Academy. All rights reserved.</p>
          <div className="flex items-center space-x-2 text-[11px] font-medium text-slate-400">
            <span>SECP Registered</span>
            <span>·</span>
            <span>Lahore, Pakistan</span>
          </div>
        </div>
      </div>

    </footer>
  );
}
