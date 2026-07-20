import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Megaphone, Calendar, ArrowRight } from "lucide-react";
import { PopupSettings } from "../types";

interface AnnouncementPopupProps {
  popupSettings?: PopupSettings;
  onNavigateToPortal?: () => void;
}

const AnnouncementPopup: React.FC<AnnouncementPopupProps> = ({ popupSettings, onNavigateToPortal }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!popupSettings?.enabled) return;

    const now = new Date();
    const start = popupSettings.startDate ? new Date(popupSettings.startDate) : null;
    const end = popupSettings.endDate ? new Date(popupSettings.endDate) : null;

    if (start && now < start) return;
    if (end) {
      const endOfDay = new Date(end);
      endOfDay.setHours(23, 59, 59, 999);
      if (now > endOfDay) return;
    }

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 600);

    return () => clearTimeout(timer);
  }, [popupSettings]);

  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isVisible]);

  const handleClose = () => setIsVisible(false);

  const handleCtaClick = () => {
    setIsVisible(false);
    if (popupSettings?.link && popupSettings.link.startsWith("http")) {
      window.open(popupSettings.link, "_blank");
    } else if (onNavigateToPortal) {
      onNavigateToPortal();
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          <motion.div
            key="popup-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9998] bg-slate-950/80 backdrop-blur-sm"
            onClick={handleClose}
          />
          <motion.div
            key="popup-modal"
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", damping: 22, stiffness: 300, delay: 0.05 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="relative w-full max-w-lg pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute -inset-2 bg-gradient-to-r from-amber-500/20 via-amber-400/10 to-amber-600/20 rounded-3xl blur-xl pointer-events-none" />
              <div className="relative bg-slate-900 border border-slate-700/60 rounded-2xl overflow-hidden shadow-2xl shadow-black/60">
                <div className="h-1 w-full bg-gradient-to-r from-amber-600 via-[#c19d53] to-amber-400" />
                <div className="flex items-start justify-between px-6 pt-5 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                      <Megaphone className="h-5 w-5 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-[10px] text-amber-500/80 font-mono uppercase tracking-[0.2em] font-bold mb-0.5">
                        Announcement
                      </p>
                      <h2 className="font-serif text-lg sm:text-xl font-bold text-white leading-tight">
                        {popupSettings?.title || "Important Announcement"}
                      </h2>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    className="flex-shrink-0 ml-3 p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-all"
                    title="Close"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                {popupSettings?.image && (
                  <div className="mx-6 mb-4 rounded-xl overflow-hidden border border-slate-700/50">
                    <img
                      src={popupSettings.image}
                      alt="Announcement"
                      className="w-full h-44 object-cover"
                    />
                  </div>
                )}
                <div className="px-6 pb-4">
                  <p className="text-slate-300 text-sm font-sans leading-relaxed whitespace-pre-line">
                    {popupSettings?.content}
                  </p>
                </div>
                {(popupSettings?.startDate || popupSettings?.endDate) && (
                  <div className="mx-6 mb-4 flex items-center gap-2 bg-slate-800/60 border border-slate-700/40 rounded-lg px-3 py-2">
                    <Calendar className="h-3.5 w-3.5 text-amber-500/70 flex-shrink-0" />
                    <span className="text-[11px] text-slate-400 font-sans">
                      {popupSettings.startDate && (
                        <>Valid from <span className="text-amber-400">{new Date(popupSettings.startDate).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}</span></>
                      )}
                      {popupSettings.startDate && popupSettings.endDate && " — "}
                      {popupSettings.endDate && (
                        <>until <span className="text-amber-400">{new Date(popupSettings.endDate).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}</span></>
                      )}
                    </span>
                  </div>
                )}
                <div className="px-6 pb-5 pt-1 flex items-center gap-3">
                  <button
                    onClick={handleCtaClick}
                    className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold uppercase tracking-wider rounded-xl transition-all active:scale-95 shadow-lg shadow-amber-500/20"
                  >
                    <span>Apply Now</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={handleClose}
                    className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AnnouncementPopup;
