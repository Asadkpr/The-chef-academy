import React, { useState } from 'react';
import { useAcademy } from '../context/AcademyContext';
import { Image as ImageIcon, ZoomIn, X, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Gallery() {
  const { gallery } = useAcademy();
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const filters = ['All', 'Dish', 'Kitchen Lab', 'Event'];

  const filteredItems = activeFilter === 'All'
    ? gallery
    : gallery.filter(item => item.category === activeFilter);

  return (
    <section id="gallery" className="py-24 bg-slate-950 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="flex items-center justify-center space-x-2 text-amber-500">
            <ImageIcon className="h-5 w-5" />
            <span className="text-xs font-sans font-bold uppercase tracking-[0.2em]">Our Practical Lab</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            Academy Culinary Gallery
          </h2>
          <p className="font-sans text-slate-400 text-sm leading-relaxed">
            Witness our professional students, active commercial kitchen training labs, and gourmet dishes plated live by our future executive chefs.
          </p>
        </div>

        {/* Filter Categories Tabs */}
        <div className="flex items-center justify-center space-x-2 mb-12">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-lg font-sans text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                activeFilter === filter
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10'
                  : 'bg-slate-900 text-slate-400 hover:text-amber-400 border border-slate-800'
              }`}
            >
              {filter === 'All' ? 'All Photos' : filter + 's'}
            </button>
          ))}
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25 }}
                className="group relative h-64 rounded-2xl overflow-hidden border border-slate-900 hover:border-amber-500/20 bg-slate-900 cursor-pointer shadow-lg"
                onClick={() => setSelectedImage(item.image)}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Overlay details */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <span className="text-[9px] uppercase tracking-widest text-amber-400 font-sans font-bold">
                    {item.category}
                  </span>
                  <h4 className="font-serif text-sm font-bold text-white mt-1">
                    {item.title}
                  </h4>
                  <div className="absolute top-4 right-4 bg-amber-500/20 text-amber-400 border border-amber-500/30 p-2 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn className="h-4 w-4" />
                  </div>
                </div>

              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
              className="absolute inset-0 bg-slate-950/95 backdrop-blur-sm"
            ></motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 20 }}
              className="relative max-w-4xl max-h-[85vh] w-full flex items-center justify-center rounded-2xl overflow-hidden border border-slate-900"
            >
              <img
                src={selectedImage}
                alt="Academy Highlight Zoomed"
                className="w-full max-h-[85vh] object-contain"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 bg-slate-950/80 hover:bg-slate-900 text-white p-2.5 rounded-full border border-slate-800 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
