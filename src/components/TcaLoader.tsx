import React from 'react';
import { motion } from 'motion/react';

const TcaLoader: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="fixed inset-0 z-[99999] bg-slate-950 flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="relative flex items-center justify-center">
        {/* Outer glowing ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="absolute w-32 h-32 rounded-full border-t-2 border-r-2 border-b-2 border-transparent border-t-[#AE8C45] border-r-[#AE8C45]/50 border-b-[#AE8C45]/20"
        />
        
        {/* Inner reverse ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="absolute w-24 h-24 rounded-full border-2 border-transparent border-t-[#C5A964] border-l-[#C5A964]/50"
        />

        {/* Center Logo text */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 flex items-center justify-center"
        >
          <span className="text-4xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#AE8C45] via-[#C5A964] to-[#AE8C45]">
            TCA
          </span>
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
