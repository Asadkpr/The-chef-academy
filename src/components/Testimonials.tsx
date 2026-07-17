import React, { useState } from 'react';
import { useAcademy } from '../context/AcademyContext';
import { MessageSquare, Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Testimonials() {
  const { testimonials } = useAcademy();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  if (testimonials.length === 0) return null;

  const current = testimonials[currentIndex];

  return (
    <section id="testimonials" className="py-24 bg-slate-900 text-white relative overflow-hidden border-b border-slate-950">
      {/* Decorative vectors */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <div className="flex items-center justify-center space-x-2 text-amber-500">
            <MessageSquare className="h-5 w-5" />
            <span className="text-xs font-sans font-bold uppercase tracking-[0.2em]">Alumni Success Stories</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
            Hear From Our Future Chefs
          </h2>
          <p className="font-sans text-slate-400 text-sm leading-relaxed">
            Discover how our 100% practical training transformed passionate home-cooks into certified culinary professionals and boutique food business owners.
          </p>
        </div>

        {/* Carousel Testimonial view */}
        <div className="relative bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-12 shadow-2xl overflow-hidden">
          {/* Huge quotation mark backdrop */}
          <div className="absolute top-6 left-6 text-slate-900 select-none pointer-events-none">
            <Quote className="h-24 w-24 stroke-[1] text-slate-900 opacity-20" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
            >
              
              {/* Photo */}
              <div className="md:col-span-4 flex justify-center">
                <div className="relative">
                  <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-2 border-amber-500 shadow-xl">
                    <img
                      src={current.image}
                      alt={current.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Decorative badge */}
                  <span className="absolute -bottom-2 -right-2 bg-amber-500 text-slate-950 text-[10px] font-sans font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
                    {current.role}
                  </span>
                </div>
              </div>

              {/* Review Text */}
              <div className="md:col-span-8 space-y-5 text-center md:text-left font-sans">
                {/* Rating stars */}
                <div className="flex justify-center md:justify-start space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-5 w-5 ${i < current.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`} />
                  ))}
                </div>

                <p className="text-slate-300 italic text-sm sm:text-base leading-relaxed">
                  "{current.text}"
                </p>

                <div>
                  <h4 className="font-serif text-lg font-bold text-white block">
                    {current.name}
                  </h4>
                  <span className="text-amber-400 text-xs block mt-1">
                    Graduate of: <strong className="text-slate-200">{current.course}</strong>
                  </span>
                </div>
              </div>

            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex items-center justify-end space-x-3 mt-8 border-t border-slate-900 pt-6">
            <button
              onClick={handlePrev}
              className="p-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white rounded-full transition-colors focus:outline-none"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-xs text-slate-500 font-mono">
              {currentIndex + 1} / {testimonials.length}
            </span>
            <button
              onClick={handleNext}
              className="p-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white rounded-full transition-colors focus:outline-none"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
