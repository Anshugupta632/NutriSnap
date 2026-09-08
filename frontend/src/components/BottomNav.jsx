import React from 'react';
import { motion } from 'framer-motion';
import { UtensilsCrossed, Search, Camera, BarChart3, User, Sparkles } from 'lucide-react';

export default function BottomNav({ activeTab, onTabChange, onOpenScanMenu }) {
  const tabs = [
    { id: 'diary', label: 'Diary', icon: UtensilsCrossed },
    { id: 'search', label: 'Food Hub', icon: Search },
    { id: 'scan', label: 'Snap AI', icon: Camera, isCenter: true },
    { id: 'analytics', label: 'Trends', icon: BarChart3 },
    { id: 'avatar', label: '3D Avatar', icon: Sparkles },
  ];

  return (
    <div className="fixed bottom-3 inset-x-0 z-40 flex justify-center px-4 pointer-events-none">
      <nav className="pointer-events-auto w-full max-w-md bg-[#16181F]/90 backdrop-blur-2xl border border-white/[0.12] rounded-3xl p-2 px-3 flex items-center justify-between shadow-[0_20px_45px_rgba(0,0,0,0.6)]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          if (tab.isCenter) {
            return (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.08, translateY: -4 }}
                whileTap={{ scale: 0.92 }}
                onClick={onOpenScanMenu}
                className="relative -top-5 flex flex-col items-center group cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-amber-400 p-[2px] shadow-[0_8px_25px_rgba(16,185,129,0.5)] group-hover:shadow-[0_12px_35px_rgba(16,185,129,0.7)] transition-all">
                  <div className="w-full h-full bg-[#121316] rounded-[14px] flex items-center justify-center text-white">
                    <Icon className="w-6 h-6 text-emerald-400 group-hover:rotate-12 transition-transform" />
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 mt-1 uppercase tracking-wider font-mono">
                  Scan AI
                </span>
              </motion.button>
            );
          }

          return (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1.5 px-2 rounded-2xl transition-all relative cursor-pointer ${
                isActive ? 'text-emerald-400 font-semibold' : 'text-cream/45 hover:text-cream/70'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute inset-0 bg-white/[0.06] rounded-2xl border border-white/[0.08]"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-emerald-400' : ''}`} />
              <span className="text-[11px] mt-1 font-body tracking-tight z-10">{tab.label}</span>
            </motion.button>
          );
        })}
      </nav>
    </div>
  );
}
