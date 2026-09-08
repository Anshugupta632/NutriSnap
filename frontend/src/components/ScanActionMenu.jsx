import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, ScanBarcode, MessageSquareText, Search, X, Sparkles, ArrowRight } from 'lucide-react';
import ScanCamera from './ScanCamera';

export default function ScanActionMenu({
  isOpen,
  onClose,
  onOpenPhotoScanner,
  onOpenLabelScanner,
  onOpenQuickText,
  onOpenFoodSearch,
  onOpenScanCamera,
}) {
  if (!isOpen) return null;

  const actions = [
    {
      title: 'AI Food Photo Scanner',
      desc: 'Snap your plate. Gemini AI automatically identifies items, calories & macros.',
      icon: Camera,
      gradient: 'from-emerald-500 to-teal-500',
      badge: 'GEMINI AI',
      onClick: () => {
        onClose();
        onOpenPhotoScanner();
      },
    },
    {
      title: 'Packaged Label & Nutri-Score',
      desc: 'Scan barcode or ingredient table to reveal hidden sugars, palm oil & additives.',
      icon: ScanBarcode,
      gradient: 'from-amber-500 to-orange-500',
      badge: 'YUKA STYLE',
      onClick: () => {
        onClose();
        onOpenLabelScanner();
      },
    },
    {
      title: 'Quick Text / AI Prompt Logger',
      desc: 'Type natural sentences like "2 rotis, bowl of dal and cucumber salad".',
      icon: MessageSquareText,
      gradient: 'from-cyan-500 to-blue-500',
      badge: 'FAST LOG',
      onClick: () => {
        onClose();
        onOpenQuickText();
      },
    },
{
      title: 'Indian & Global Food Database',
      desc: 'Search 500+ verified Indian meals, rotis, curries, and fitness supplements.',
      icon: Search,
      gradient: 'from-violet-500 to-purple-500',
      badge: 'VERIFIED',
      onClick: () => {
        onClose();
        onOpenFoodSearch();
      },
    },
    {
      title: 'Direct Camera Scan',
      desc: 'Open camera and scan barcode or QR code directly',
      icon: Camera,
      gradient: 'from-emerald-500 to-emerald-400',
      badge: 'BARCODE',
      onClick: () => {
        onClose();
        onOpenScanCamera();
      },
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 26, stiffness: 280 }}
        className="w-full max-w-md bg-[#16181F] border border-white/[0.12] rounded-t-3xl sm:rounded-3xl p-5 pb-8 sm:pb-5 shadow-2xl overflow-hidden"
      >
        {/* Handle for mobile */}
        <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-4 sm:hidden" />

        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <h3 className="text-base font-bold text-cream">Log Your Meal</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center text-cream/60 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

<div className="flex flex-col gap-2.5 mt-4">
          {actions.map((act) => {
            const Icon = act.icon;
            return (
              <motion.button
                key={act.title}
                whileHover={{ scale: 1.02, translateX: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={act.onClick}
                className="w-full text-left p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-white/[0.15] transition-all flex items-center gap-3.5 group cursor-pointer"
              >
                <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${act.gradient} p-[2px] shrink-0 shadow-md`}>
                  <div className="w-full h-full bg-[#121316] rounded-[14px] flex items-center justify-center text-white">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-cream group-hover:text-emerald-300 transition-colors truncate">
                      {act.title}
                    </h4>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/[0.08] text-cream/70 font-semibold shrink-0">
                      {act.badge}
                    </span>
                  </div>
                  <p className="text-xs text-cream/50 mt-0.5 line-clamp-1">
                    {act.desc}
                  </p>
                </div>

                <ArrowRight className="w-4 h-4 text-cream/30 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all shrink-0" />
              </motion.button>
            );
          })}

          {onOpenScanCamera && (
            <motion.button
              key="direct-camera-scan"
              whileHover={{ scale: 1.02, translateX: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                onClose();
                onOpenScanCamera();
              }}
              className="w-full text-left p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-white/[0.15] transition-all flex items-center gap-3.5 group cursor-pointer"
            >
              <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-emerald-400 p-[2px] shrink-0 shadow-md`}>
                <div className="w-full h-full bg-[#121316] rounded-[14px] flex items-center justify-center text-white">
                  <Camera className="w-5 h-5" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-cream">Direct Camera Scan</h4>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/[0.08] text-cream/70 font-semibold shrink-0">BARCODE</span>
                </div>
                <p className="text-xs text-cream/50 mt-0.5 line-clamp-1">
                  Open camera and scan barcode or QR code directly
                </p>
              </div>

              <ArrowRight className="w-4 h-4 text-cream/30 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all shrink-0" />
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
