import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Calendar, ChevronLeft, ChevronRight, Sparkles, LogOut, Maximize2, Minimize2 } from 'lucide-react';

export default function Navbar({
  user,
  streakDays = 5,
  healthScore = 88,
  selectedDate,
  onDateChange,
  onLogout,
  isWideMode,
  onToggleWideMode,
  onOpenProfile
}) {
  const isToday = selectedDate === 'Today';

  return (
    <header className="w-full pt-4 pb-3 px-4 flex items-center justify-between sticky top-0 z-30 backdrop-blur-xl bg-[#121316]/80 border-b border-white/[0.06]">
      {/* Brand & Greeting */}
      <div className="flex items-center gap-3">
        <motion.div
          whileHover={{ scale: 1.05, rotate: 6 }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpenProfile}
          className="relative cursor-pointer"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-amber-400 p-[2px] shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-[#1A1C23] rounded-[14px] flex items-center justify-center font-display font-bold text-cream text-base">
              {user?.email ? user.email.slice(0, 2).toUpperCase() : 'NS'}
            </div>
          </div>
          <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#121316] rounded-full" />
        </motion.div>

        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 font-mono">NutriSnap AI</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-emerald-500/10 text-emerald-300 rounded border border-emerald-500/20 font-mono">PRO</span>
          </div>
          <h1 className="text-sm font-bold text-cream tracking-tight flex items-center gap-1">
            Hi, {user?.email ? user.email.split('@')[0] : 'Fitness Enthusiast'} 👋
          </h1>
        </div>
      </div>

      {/* Date Switcher Pill */}
      <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs">
        <button
          onClick={() => onDateChange && onDateChange('Yesterday')}
          className={`px-2 py-0.5 rounded-lg transition-all ${selectedDate === 'Yesterday' ? 'bg-white/10 text-white font-medium' : 'text-cream/50 hover:text-white'}`}
        >
          Yesterday
        </button>
        <button
          onClick={() => onDateChange && onDateChange('Today')}
          className={`px-2.5 py-0.5 rounded-lg transition-all ${isToday ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30' : 'text-cream/50 hover:text-white'}`}
        >
          Today
        </button>
      </div>

      {/* Right Stats & Controls */}
      <div className="flex items-center gap-2">
        {/* Streak Pill */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold text-xs shadow-sm cursor-default"
          title="Daily Logging Streak"
        >
          <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400 animate-pulse" />
          <span>{streakDays}d</span>
        </motion.div>

        {/* Health Grade Score */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="hidden xs:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-xs cursor-default"
          title="Daily Nutrition Score"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>{healthScore}/100</span>
        </motion.div>

        {/* Desktop Wide Mode Toggle */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={onToggleWideMode}
          className="w-8 h-8 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] flex items-center justify-center text-cream/70 hover:text-white transition-colors"
          title={isWideMode ? "Switch to Mobile View" : "Switch to Desktop Widescreen"}
        >
          {isWideMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </motion.button>

        {/* Logout button */}
        {onLogout && (
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={onLogout}
            className="w-8 h-8 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 flex items-center justify-center text-rose-400 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </motion.button>
        )}
      </div>
    </header>
  );
}
