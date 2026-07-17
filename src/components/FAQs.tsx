import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQs() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqItems: FAQItem[] = [
    {
      question: "Are your certifications registered and recognized?",
      answer: "Yes, The Chef's Academy is fully registered with the SECP (Securities and Exchange Commission of Pakistan) and partner-certified with industry leaders, offering both national and international-level culinary standards."
    },
    {
      question: "What is the schedule for Morning, Afternoon, and Evening batches?",
      answer: "We offer highly flexible batch timings: Morning (09:00 AM - 12:00 PM), Afternoon (01:00 PM - 04:00 PM), and Evening (05:00 PM - 08:00 PM) to accommodate students, working professionals, and food enthusiasts."
    },
    {
      question: "Is there any entry test or prior kitchen experience required?",
      answer: "No prior experience or entry test is required! Our programs start from absolute basics and go up to advanced professional culinary arts. Anyone with a passion for cooking or hospitality can enroll."
    },
    {
      question: "Do you offer job placement support after graduation?",
      answer: "Absolutely! We have an extensive network of premium hospitality partners, high-end restaurants, and hotels across Pakistan and the Gulf region, and we actively assist our top graduates with placements."
    },
    {
      question: "How much of the training is practical vs theoretical?",
      answer: "Our academy takes pride in a 100% practical approach. You will spend every session in state-of-the-art commercial kitchen labs preparing dishes, handling high-end utensils, and learning directly from executive chefs."
    }
  ];

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faqs" className="py-24 bg-[#0a0f18] text-white relative overflow-hidden">
      {/* Decorative radial gradients for luxury feel */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#c19d53]/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center space-y-3 mb-16">
          <span className="text-[10px] sm:text-xs font-sans font-bold tracking-[0.25em] text-[#c19d53] uppercase block">
            Got Questions?
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight">
            Frequently Asked Questions
          </h2>
          <div className="w-12 h-[2px] bg-[#c19d53] mx-auto mt-4"></div>
        </div>

        {/* Accordions */}
        <div className="space-y-4">
          {faqItems.map((item, index) => {
            const isOpen = activeIndex === index;
            return (
              <div 
                key={index} 
                className={`border rounded-xl transition-all duration-300 ${
                  isOpen 
                    ? 'border-[#c19d53] bg-[#0d131f] shadow-lg shadow-[#c19d53]/5' 
                    : 'border-slate-800/80 bg-[#0d131f]/45 hover:border-slate-700'
                }`}
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                >
                  <div className="flex items-center space-x-3.5 pr-4">
                    <HelpCircle className={`h-5 w-5 flex-shrink-0 transition-colors duration-300 ${isOpen ? 'text-[#c19d53]' : 'text-slate-500'}`} />
                    <span className="font-sans text-sm sm:text-base font-medium text-slate-200">
                      {item.question}
                    </span>
                  </div>
                  <div className="flex-shrink-0">
                    {isOpen ? (
                      <Minus className="h-5 w-5 text-[#c19d53]" />
                    ) : (
                      <Plus className="h-5 w-5 text-slate-400" />
                    )}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-1 text-slate-300/90 font-sans text-sm leading-relaxed border-t border-slate-800/50 pl-14">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
