import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Dumbbell, Wheat, Droplet, Info, ShieldCheck, AlertCircle } from 'lucide-react';

export default function CalorieCard({
  totalCalories = 860,
  calorieTarget = 2100,
  protein = 48,
  proteinTarget = 120,
  carbs = 98,
  carbsTarget = 240,
  fats = 32,
  fatsTarget = 65,
  fiber = 18,
  fiberTarget = 30,
}) {
  const caloriesRemaining = Math.max(0, calorieTarget - totalCalories);
  const calPercent = Math.min(100, Math.round((totalCalories / (calorieTarget || 1)) * 100));

  // Circular progress calculations
  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (calPercent / 100) * circumference;

  // Macro percentages
  const proteinPercent = Math.min(100, Math.round((protein / (proteinTarget || 1)) * 100));
  const carbsPercent = Math.min(100, Math.round((carbs / (carbsTarget || 1)) * 100));
  const fatsPercent = Math.min(100, Math.round((fats / (fatsTarget || 1)) * 100));

  // Indian diet balance evaluation
  let thaliStatus = {
    title: 'Balanced Indian Thali',
    desc: 'Great macro distribution today!',
    type: 'good',
  };
  if (proteinPercent < 35 && carbsPercent > 60) {
    thaliStatus = {
      title: 'Carb-Heavy Ratio',
      desc: 'Add dal, paneer, or eggs to boost protein.',
      type: 'warning',
    };
  } else if (proteinPercent >= 80) {
    thaliStatus = {
      title: 'High Protein Champion',
      desc: 'Muscle recovery & satiety optimized!',
      type: 'great',
    };
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      className="w-full bg-[#1A1C23]/90 backdrop-blur-2xl rounded-3xl p-5 border border-white/[0.08] shadow-[0_15px_35px_rgba(0,0,0,0.35)] relative overflow-hidden"
    >
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-cream/50 font-semibold">
            Daily Budget
          </span>
          <h2 className="text-lg font-bold text-cream flex items-center gap-1.5">
            <span>Calories & Macros</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-mono font-medium border border-emerald-500/20">
              {calPercent}% Target
            </span>
          </h2>
        </div>

        <div className="flex items-center gap-1 text-xs text-cream/50 font-mono">
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          <span>Goal: {calorieTarget} kcal</span>
        </div>
      </div>

      {/* Center Calorie Circle & Big Numbers */}
      <div className="flex items-center justify-around py-2">
        {/* SVG Circular Meter */}
        <div className="relative w-36 h-36 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 148 148">
            {/* Background track */}
            <circle
              cx="74"
              cy="74"
              r={radius}
              fill="transparent"
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="10"
            />
            {/* Progress Stroke */}
            <motion.circle
              cx="74"
              cy="74"
              r={radius}
              fill="transparent"
              stroke="url(#calorieGradient)"
              strokeWidth="11"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              strokeLinecap="round"
            />
            {/* Gradient definition */}
            <defs>
              <linearGradient id="calorieGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="60%" stopColor="#06B6D4" />
                <stop offset="100%" stopColor="#F59E0B" />
              </linearGradient>
            </defs>
          </svg>

          {/* Inner Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-black font-display text-cream tracking-tight">
              {caloriesRemaining}
            </span>
            <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider font-mono -mt-0.5">
              kcal left
            </span>
            <span className="text-[10px] text-cream/40 font-mono mt-0.5">
              {totalCalories} eaten
            </span>
          </div>
        </div>

        {/* Quick Legend / Calorie Math */}
        <div className="flex flex-col gap-2 text-xs">
          <div className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.03] border border-white/[0.05]">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <div>
              <p className="text-cream/50 text-[10px]">Consumed</p>
              <p className="font-bold text-cream font-mono">{totalCalories} kcal</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.03] border border-white/[0.05]">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
            <div>
              <p className="text-cream/50 text-[10px]">Budget Limit</p>
              <p className="font-bold text-cream font-mono">{calorieTarget} kcal</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.03] border border-white/[0.05]">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
            <div>
              <p className="text-cream/50 text-[10px]">Net Remaining</p>
              <p className="font-bold text-emerald-400 font-mono">{caloriesRemaining} kcal</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Macro Progress Bars */}
      <div className="grid grid-cols-3 gap-2.5 mt-4 pt-4 border-t border-white/[0.08]">
        {/* Protein */}
        <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-cyan-400 flex items-center gap-1">
              <Dumbbell className="w-3 h-3" /> Protein
            </span>
            <span className="text-[10px] font-mono text-cream/40">{proteinPercent}%</span>
          </div>
          <div>
            <div className="flex items-baseline justify-between mb-1 text-[11px] font-mono">
              <span className="font-bold text-cream">{protein}g</span>
              <span className="text-cream/40">/ {proteinTarget}g</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${proteinPercent}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-400 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.5)]"
              />
            </div>
          </div>
        </div>

        {/* Carbs */}
        <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
              <Wheat className="w-3 h-3" /> Carbs
            </span>
            <span className="text-[10px] font-mono text-cream/40">{carbsPercent}%</span>
          </div>
          <div>
            <div className="flex items-baseline justify-between mb-1 text-[11px] font-mono">
              <span className="font-bold text-cream">{carbs}g</span>
              <span className="text-cream/40">/ {carbsTarget}g</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${carbsPercent}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)]"
              />
            </div>
          </div>
        </div>

        {/* Fats */}
        <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-rose-400 flex items-center gap-1">
              <Droplet className="w-3 h-3" /> Fats
            </span>
            <span className="text-[10px] font-mono text-cream/40">{fatsPercent}%</span>
          </div>
          <div>
            <div className="flex items-baseline justify-between mb-1 text-[11px] font-mono">
              <span className="font-bold text-cream">{fats}g</span>
              <span className="text-cream/40">/ {fatsTarget}g</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${fatsPercent}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-rose-500 to-red-400 rounded-full shadow-[0_0_8px_rgba(244,63,94,0.5)]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Thali Health Badge */}
      <div className={`mt-3 px-3 py-2 rounded-2xl flex items-center gap-2.5 text-xs border ${
        thaliStatus.type === 'warning'
          ? 'bg-amber-500/10 border-amber-500/20 text-amber-300'
          : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
      }`}>
        {thaliStatus.type === 'warning' ? (
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
        ) : (
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
        )}
        <div className="flex-1">
          <span className="font-bold">{thaliStatus.title}: </span>
          <span className="text-cream/70 text-[11px]">{thaliStatus.desc}</span>
        </div>
      </div>
    </motion.div>
  );
}
