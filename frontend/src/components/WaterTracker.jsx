import React from 'react';
import { motion } from 'framer-motion';
import { Droplet, Plus, Minus, Sparkles, CheckCircle2 } from 'lucide-react';

export default function WaterTracker({
  waterMl = 1500,
  waterTarget = 2500,
  onAddWater,
  onRemoveWater,
}) {
  const percent = Math.min(100, Math.round((waterMl / (waterTarget || 1)) * 100));
  const glasses = Math.round(waterMl / 250);
  const totalGlasses = Math.round(waterTarget / 250);
  const isGoalReached = waterMl >= waterTarget;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20, delay: 0.1 }}
      className="w-full bg-[#1A1C23]/80 backdrop-blur-xl rounded-3xl p-5 border border-white/[0.08] relative overflow-hidden shadow-md"
    >
      {/* Glow */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Droplet className="w-5 h-5 fill-cyan-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-cream">Water Hydration</h3>
            <p className="text-[10px] text-cream/40 font-mono">
              Target: {waterTarget} ml ({totalGlasses} glasses)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {isGoalReached ? (
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-mono">
              <CheckCircle2 className="w-3 h-3" /> Goal Met!
            </span>
          ) : (
            <span className="text-xs font-mono font-semibold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 rounded-full">
              {percent}%
            </span>
          )}
        </div>
      </div>

      {/* Main Hydration Display & Controls */}
      <div className="flex items-center justify-between gap-4">
        {/* Left: Big ml & glasses counter */}
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black font-display text-cream tracking-tight">
              {waterMl}
            </span>
            <span className="text-xs font-mono text-cream/40">/ {waterTarget} ml</span>
          </div>
          <p className="text-xs text-cyan-300 font-medium mt-0.5 flex items-center gap-1">
            <span>💧 {glasses} of {totalGlasses} glasses consumed</span>
          </p>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex items-center gap-2">
          {waterMl > 0 && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => onRemoveWater && onRemoveWater(250)}
              className="w-9 h-9 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] flex items-center justify-center text-cream/60 hover:text-cream cursor-pointer transition-colors"
              title="Remove 250ml"
            >
              <Minus className="w-4 h-4" />
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onAddWater && onAddWater(250)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-bold text-xs shadow-[0_0_15px_rgba(6,182,212,0.2)] cursor-pointer transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+250 ml</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onAddWater && onAddWater(500)}
            className="hidden sm:flex items-center gap-1 px-3 py-2 rounded-2xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-cream text-xs font-medium cursor-pointer transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+500 ml</span>
          </motion.button>
        </div>
      </div>

      {/* Animated Liquid Bar */}
      <div className="w-full h-2.5 bg-white/[0.06] rounded-full mt-4 overflow-hidden p-[1px]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-cyan-500 to-blue-400 rounded-full shadow-[0_0_12px_rgba(6,182,212,0.6)]"
        />
      </div>

      {/* Mini Glass Icons row */}
      <div className="flex items-center justify-between mt-3 px-1">
        {Array.from({ length: 8 }).map((_, i) => {
          const isFilled = i < glasses;
          return (
            <motion.div
              key={i}
              initial={false}
              animate={{ scale: isFilled ? 1.08 : 1 }}
              className={`text-sm cursor-pointer transition-opacity ${
                isFilled ? 'opacity-100' : 'opacity-20'
              }`}
              onClick={() => onAddWater && onAddWater(250)}
              title={`Glass ${i + 1} (250ml)`}
            >
              🥛
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
