import React, { useState, useEffect } from 'react';
import { useAcademy } from '../context/AcademyContext';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle } from 'lucide-react';

export default function Hero() {
  const { setSection } = useAcademy();
  const [backgroundText, setBackgroundText] = useState('BARISTA SKILLS');

  // Rotate the background giant outline text for extra flavor
  useEffect(() => {
    const skills = ['BARISTA SKILLS', 'CULINARY ARTS', 'BAKING SCIENCE', 'PASTRY CRAFT'];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % skills.length;
      setBackgroundText(skills[idx]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section 
      id="hero" 
      className="relative min-h-screen flex items-center justify-start overflow-hidden bg-[#0d131f] text-white pt-20"
    >
      {/* 1. Unsplash latte art cup seen from top, perfectly warm espresso tone */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1570968915860-54d5c301fc9f?auto=format&fit=crop&q=80&w=1920"
          alt="Luxury Coffee Latte Art"
          className="w-full h-full object-cover object-right sm:object-center brightness-[0.6] contrast-[1.05]"
        />
        
        {/* Cinematic rich dark gradient overlay exactly matching the screenshot's depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d131f] via-[#0d131f]/90 to-[#0d131f]/40 z-10"></div>
        <div className="absolute inset-0 bg-black/35 z-0"></div>
      </div>

      {/* 2. Giant backdrop outline typography - animated */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10 select-none pointer-events-none hidden md:block max-w-[50%] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={backgroundText}
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 0.18, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.95 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="text-[8vw] font-sans font-black tracking-widest text-[#c19d53] leading-none select-none text-right font-extrabold"
            style={{
              WebkitTextStroke: '2px #c19d53',
              textShadow: '0 0 20px rgba(193, 157, 83, 0.2)',
            }}
          >
            {backgroundText}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 3. Main content area (left-aligned) */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 w-full flex flex-col justify-center min-h-[calc(100vh-5rem)]">
        
        <div className="max-w-3xl space-y-7 md:space-y-8">
          
          {/* Yellow/Gold Cap-Label */}
          <motion.div 
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center space-x-3"
          >
            <span className="text-[11px] sm:text-xs md:text-sm font-sans font-bold tracking-[0.2em] text-[#c19d53] uppercase">
              A PROFESSIONAL CULINARY & HOSPITALITY ACADEMY — LAHORE
            </span>
          </motion.div>

          {/* Core Headline */}
          <div className="space-y-2">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight text-white leading-[1.1]"
            >
              Train like a professional.
            </motion.h1>
            <motion.h1 
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="font-cursive italic text-4xl sm:text-6xl md:text-7xl tracking-normal text-[#c19d53] leading-normal"
            >
              Cook like one.
            </motion.h1>
          </div>



          {/* Action CTAs Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4"
          >
            <button
              onClick={() => setSection('courses')}
              className="px-8 py-3.5 rounded-lg bg-[#c19d53] text-slate-950 font-sans text-xs font-bold uppercase tracking-wider text-center transition-all duration-300 hover:bg-[#d4b065] shadow-lg shadow-[#c19d53]/10 active:scale-95 cursor-pointer"
            >
              Explore Courses
            </button>
            
            <a
              href="https://wa.me/923339123456?text=Hi%21+I+am+interested+in+joining+The+Chef%27s+Academy+Lahore.+Please+send+me+course+batch+details."
              target="_blank"
              rel="noreferrer"
              className="px-8 py-3.5 rounded-lg border border-white text-white font-sans text-xs font-bold uppercase tracking-wider text-center transition-all duration-300 hover:bg-white/5 active:scale-95"
            >
              Talk to Admissions on WhatsApp
            </a>
          </motion.div>

          {/* Bottom Trust Tags */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.85 }}
            className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-6 border-t border-slate-800/60 text-slate-400 text-xs font-medium font-sans"
          >
            <span className="flex items-center space-x-1.5">
              <span className="text-[#c19d53]">✓</span>
              <span>SECP Registered</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="text-[#c19d53]">✓</span>
              <span>Industry-Partnered</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="text-[#c19d53]">✓</span>
              <span>Morning, Afternoon & Evening Batches</span>
            </span>
          </motion.div>

        </div>
      </div>

    </section>
  );
}
