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
import ShopCatalog from './components/ShopCatalog';
import AnnouncementPopup from './components/AnnouncementPopup';
import TcaLoader from './components/TcaLoader';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, AlertTriangle, X } from 'lucide-react';

function StorageWarningToast() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleQuotaExceeded = () => setVisible(true);
    window.addEventListener('storage-quota-exceeded', handleQuotaExceeded);
    return () => window.removeEventListener('storage-quota-exceeded', handleQuotaExceeded);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm bg-amber-950/90 border border-amber-500/40 p-4 rounded-xl shadow-2xl backdrop-blur text-amber-200 text-xs flex items-start space-x-3">
      <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
      <div className="flex-1 space-y-1">
        <p className="font-bold text-amber-100">Browser Storage Quota Exceeded</p>
        <p className="text-[11px] leading-relaxed text-amber-300/90">
          Your browser's local storage is full. Changes will still be saved to the database.
        </p>
      </div>
      <button 
        onClick={() => setVisible(false)}
        className="text-amber-400 hover:text-white p-1"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

function AppContent() {
  const { activeView, setView, websiteData } = useAcademy();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Reduced artificial delay for the loader to make site load faster
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-[#c19d53] selection:text-slate-950">
      <AnimatePresence>
        {isLoading && <TcaLoader key="tca-global-loader" />}
      </AnimatePresence>

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
        ) : activeView === 'shop' ? (
          <motion.div
            key="shop-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="pt-20"
          >
            <ShopCatalog />
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

      {/* Floating WhatsApp Quick-Connect Button on portal and admin views */}
      {(activeView === 'portal' || activeView === 'cms') && (
        <a
          href="https://wa.me/923288888907?text=Hi%21+I+am+interested+in+joining+The+Chef%27s+Academy+Lahore.+Please+send+me+the+next+batch+details."
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
