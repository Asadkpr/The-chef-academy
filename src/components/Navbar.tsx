import React, { useState, useEffect } from 'react';
import { useAcademy } from '../context/AcademyContext';
import { Menu, X, ChevronRight, LayoutDashboard, SearchCode, Sparkles, LogIn, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const { activeView, setView, websiteData } = useAcademy();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      id="academy-navbar" 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#0a0f18]/95 backdrop-blur-md border-b border-[#c19d53]/20 py-2 shadow-lg' 
          : 'bg-transparent py-3'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          
          {/* Logo Crest */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => { setView('home'); }}>
            <img 
              src={websiteData?.logo || "/logo.png"} 
              alt="The Chef's Academy Logo" 
              className="brand-logo-img h-8 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="font-display leading-[0.9] text-white">
              <div className="flex items-end gap-1">
                <span className="text-[10px] text-[#F7F2DE] font-light">The</span>
                <span className="text-lg text-[#F7F2DE] font-medium leading-none">Chef's</span>
              </div>
              <div className="text-base text-[#F7F2DE] font-medium tracking-wide -mt-0.5 leading-none">Academy</div>
            </div>
          </div>

          {/* Desktop Right Side buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {activeView === 'portal' ? (
              <>
                <button
                  onClick={() => setView('home')}
                  className="text-xs font-sans font-bold text-slate-300 hover:text-white transition-colors duration-200 tracking-wider uppercase px-3 py-2 mr-2"
                >
                  Back to Website
                </button>
                
                <a
                  href="https://wa.me/923339123456?text=Hi%21+I+am+interested+in+joining+The+Chef%27s+Academy+Lahore.+Please+send+me+more+information."
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 rounded-lg font-sans text-xs font-bold uppercase tracking-wider border border-[#c19d53] text-[#c19d53] hover:bg-[#c19d53]/5 transition-all duration-300 flex items-center space-x-1.5"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>WhatsApp Help</span>
                </a>

                <button
                  onClick={() => setView('cms')}
                  className="bg-slate-900 border border-slate-800 text-[#c19d53] px-5 py-2.5 rounded-lg font-sans text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-all duration-300 flex items-center space-x-1.5 cursor-pointer"
                  title="Academy CMS Admin Panel"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Admin Login</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setView('home')}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-lg font-sans text-xs font-bold uppercase tracking-wider transition-all duration-300 bg-[#c19d53] text-slate-950 hover:brightness-110 shadow-lg"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Exit Admin Portal</span>
              </button>
            )}
          </div>

          {/* Mobile toggle */}
          <div className="flex items-center space-x-2 md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 focus:outline-none transition-colors duration-200"
            >
              {isOpen ? <X className="h-6 w-6 text-[#c19d53]" /> : <Menu className="h-6 w-6 text-white" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-[#0c121e] border-t border-[#c19d53]/15 overflow-hidden shadow-2xl"
          >
            <div className="px-3 pt-3 pb-6 space-y-2">
              {activeView === 'portal' ? (
                <>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setView('home');
                    }}
                    className="flex w-full items-center justify-between px-4 py-3 rounded-xl text-sm font-sans font-medium text-slate-300 hover:bg-slate-900 transition-all"
                  >
                    <span>← Back to Website</span>
                    <ChevronRight className="h-4 w-4 text-[#c19d53]/40" />
                  </button>

                  <div className="pt-4 border-t border-slate-900 px-4 flex flex-col gap-3">
                    <a
                      href="https://wa.me/923339123456"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center space-x-2 border border-[#c19d53] text-[#c19d53] py-2.5 rounded-lg font-sans text-xs font-bold uppercase tracking-wider"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>WhatsApp Helpline</span>
                    </a>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        setView('cms');
                      }}
                      className="flex items-center justify-center space-x-2 bg-slate-900 border border-slate-800 text-[#c19d53] py-2.5 rounded-lg font-sans text-xs font-bold uppercase tracking-wider shadow-lg"
                    >
                      <LogIn className="h-4 w-4" />
                      <span>Admin Login Portal</span>
                    </button>
                  </div>
                </>
              ) : (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setView('home');
                  }}
                  className="flex w-full items-center justify-between px-4 py-3 rounded-xl text-sm font-sans font-medium text-slate-300 hover:bg-slate-900 transition-all"
                >
                  <span>← Exit Admin Portal</span>
                  <ChevronRight className="h-4 w-4 text-[#c19d53]/40" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
