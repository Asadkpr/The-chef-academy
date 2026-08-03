import React from 'react';
import { motion } from 'motion/react';

interface TcaLoaderProps {
  logoUrl?: string;
}

const TcaLoader: React.FC<TcaLoaderProps> = ({ logoUrl }) => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="fixed inset-0 z-[99999] bg-slate-950 flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="relative flex items-center justify-center min-w-[240px] min-h-[140px]">
        {/* Outer glowing ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          className="absolute w-36 h-36 sm:w-48 sm:h-48 rounded-full border-t-[3px] border-r-[3px] border-b-[3px] border-transparent border-t-[#AE8C45] border-r-[#AE8C45]/40 border-b-[#AE8C45]/10"
        />
        
        {/* Inner reverse ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
          className="absolute w-28 h-28 sm:w-36 sm:h-36 rounded-full border-[2px] border-transparent border-t-[#C5A964] border-l-[#C5A964]/40"
        />

        {/* Center Logo text */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 flex flex-col sm:flex-row items-center justify-center p-4"
        >
          <div className="flex items-center">
            <h1 className="font-serif font-bold text-white m-0 leading-none text-left tracking-normal">
              <span className="block text-xl sm:text-2xl"><span className="font-normal text-base sm:text-lg text-[#C5A964] tracking-normal">The</span> Chef's</span>
              <span className="block text-xl sm:text-2xl">Academy</span>
            </h1>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-8 flex flex-col items-center gap-2"
      >
        <span className="text-slate-400 text-xs font-mono uppercase tracking-[0.2em]">
          Loading Experience
        </span>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              className="w-1.5 h-1.5 rounded-full bg-[#AE8C45]"
            />
          ))}
        </div>
      </motion.div>
      
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#AE8C45]/10 blur-[100px] rounded-full pointer-events-none" />
    </motion.div>
  );
};

export default TcaLoader;
