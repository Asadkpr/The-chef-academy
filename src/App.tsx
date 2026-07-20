/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AcademyProvider, useAcademy } from './context/AcademyContext';
import Navbar from './components/Navbar';
import AdmissionForm from './components/AdmissionForm';
import Footer from './components/Footer';
import CMSAdmin from './components/CMSAdmin';
import Website from './components/Website';
import AnnouncementPopup from './components/AnnouncementPopup';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, AlertTriangle, X } from 'lucide-react';

function StorageWarningToast() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleQuotaExceeded = () => {
      setVisible(true);
    };

    window.addEventListener('storage-quota-exceeded', handleQuotaExceeded);
    return () => {
      window.removeEventListener('storage-quota-exceeded', handleQuotaExceeded);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 md:left-auto md:max-w-md z-50 bg-slate-900/95 backdrop-blur border border-amber-500/40 p-4 rounded-xl shadow-2xl flex items-start gap-3 transition-all">
      <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500 flex-shrink-0">
        <AlertTriangle className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0 text-left">
        <h4 className="text-sm font-bold text-slate-200">Browser Storage Quota Reached</h4>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
          The uploaded file is too large to fit in your browser's persistent database. 
          Your updates are fully active in-memory for this session, but could not be saved permanently.
        </p>
        <p className="text-[10px] text-amber-500 mt-1.5 font-medium">
          💡 Try uploading smaller, compressed images or using direct links/URLs for video files.
        </p>
      </div>
      <button 
        onClick={() => setVisible(false)} 
        className="text-slate-500 hover:text-slate-200 p-1 hover:bg-slate-800 rounded transition-colors flex-shrink-0"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

function AppContent() {
  const { activeView, setView, websiteData } = useAcademy();

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-[#c19d53] selection:text-slate-950">
      {activeView !== 'home' && <Navbar />}
      
      <AnimatePresence mode="wait">
        {activeView === 'home' ? (
          <motion.div
            key="home-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Website />
          </motion.div>
        ) : activeView === 'portal' ? (
          <motion.div
            key="portal-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="pt-20"
          >
            <AdmissionForm />
          </motion.div>
        ) : (
          <motion.div
            key="cms-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="pt-20"
          >
            <CMSAdmin />
          </motion.div>
        )}
      </AnimatePresence>

      <StorageWarningToast />

      {/* Announcement Popup — only shown on home view */}
      {activeView === 'home' && (
        <AnnouncementPopup
          popupSettings={websiteData?.popupSettings}
          onNavigateToPortal={() => setView('portal')}
        />
      )}

      {/* Floating WhatsApp Quick-Connect Button only on portal view */}
      {activeView === 'portal' && (
        <a
          href="https://wa.me/923339123456?text=Hi%21+I+am+interested+in+joining+The+Chef%27s+Academy+Lahore.+Please+send+me+the+next+batch+details."
          target="_blank"
          rel="noreferrer"
          className="fixed bottom-6 right-6 z-40 bg-emerald-500 hover:bg-emerald-400 text-slate-950 p-4 rounded-full shadow-2xl flex items-center justify-center group transition-all duration-300 hover:scale-110 active:scale-95 border border-emerald-400/20"
          title="Chat with Admissions Department"
        >
          <div className="absolute -inset-1 bg-emerald-400 rounded-full blur-md opacity-30 group-hover:opacity-50 animate-ping pointer-events-none"></div>
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-500 ease-out font-sans text-xs font-bold uppercase tracking-wider pl-0 group-hover:pl-2 text-white">
            WhatsApp Helpline
          </span>
          <MessageCircle className="h-6 w-6 stroke-[2.5] text-white" />
        </a>
      )}

      {activeView !== 'home' && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <AcademyProvider>
      <AppContent />
    </AcademyProvider>
  );
}
