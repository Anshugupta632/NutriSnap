import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Dumbbell, Zap, ShieldAlert, Award, Target, Flame, CheckCircle2, Lock } from 'lucide-react';
import Avatar3D from './Avatar3D';

export default function AvatarRPGTab({
  avatar = { stamina: 85, strength_points: 340, protein_deficit_days: 0 },
  user = null,
  macros = { protein: 48, carbs: 98, fats: 32 },
}) {
  const stamina = avatar?.stamina ?? 85;
  const strengthPoints = avatar?.strength_points ?? 340;
  const deficitDays = avatar?.protein_deficit_days ?? 0;
  const bodyType = user?.body_type || 'Mesomorph';

  const level = Math.max(1, Math.floor(strengthPoints / 100) + 1);
  const currentLevelXp = strengthPoints % 100;

  const quests = [
    { title: 'Hit 80% Daily Protein Target', xp: 50, done: macros.protein >= 80 },
    { title: 'Log 8 Glasses of Water', xp: 30, done: true },
    { title: 'Scan or Log a Balanced Lunch', xp: 40, done: true },
    { title: 'Zero High-Sugar Processed Foods', xp: 35, done: false },
  ];

  const badges = [
    { name: 'Protein Warrior', desc: 'Hit protein goal 3 days in a row', icon: '🥩', unlocked: true },
    { name: 'Hydration Hero', desc: 'Drank 2.5L water today', icon: '💧', unlocked: true },
    { name: 'Streak Igniter', desc: '5 consecutive days of meal logging', icon: '🔥', unlocked: true },
    { name: 'Label Detective', desc: 'Scanned 3 food labels for hidden sugar', icon: '🔍', unlocked: false },
  ];

  const getStateColor = () => {
    if (stamina >= 75) return 'var(--color-curry)';
    if (stamina >= 40) return 'var(--color-haldi)';
    return 'var(--color-masala)';
  };

  return (
    <div className="w-full flex flex-col gap-5 pb-20">
      {/* 3D Character Stage Card */}
      <div className="bg-[rgba(26,30,40,0.8)] backdrop-blur-2xl rounded-3xl p-6 border border-white/[0.06] shadow-2xl shadow-[0_25px_50px_rgba(0,0,0,0.4)] relative overflow-hidden">
        <motion.div
          whileHover={{ y: -4, boxShadow: '0 20px 50px -10px rgba(0,0,0,0.5)' }}
          transition={{ type: 'spring', stiffness: 150 }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-3xl pointer-events-none"
          style={{ backgroundColor: getStateColor() }}
        />

        {/* Somatotype & Level Badge */}
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20">
              {bodyType.toUpperCase()}
            </span>
            <span className="text-xs text-cream/50 font-mono">Somatotype</span>
          </div>

          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-[var(--color-masala)]/20 border border-[var(--color-masala)]/30 text-[var(--color-masala)] text-xs font-bold font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>LVL {level}</span>
          </div>
        </div>

        {/* 3D Canvas */}
        <div className="w-full h-64 sm:h-80 flex items-center justify-center my-4">
          <Avatar3D
            stamina={stamina}
            strengthPoints={strengthPoints}
            deficitDays={deficitDays}
            user={user}
            level={level}
            macros={macros}
          />
        </div>

        {/* Level XP Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 150 }}
          className="mt-3 pt-3 border-t border-white/[0.06] relative z-10"
        >
          <div className="flex items-center justify-between text-xs font-mono mb-1.5">
            <span className="text-cream/50">Level {level} Progress</span>
            <span className="text-amber-400 font-bold">{currentLevelXp} / 100 XP</span>
          </div>
          <div className="w-full h-2 bg-white/[0.06] rounded-full overflow-hidden rounded-pill p-[1px]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${currentLevelXp}%` }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
              className="h-full rounded-pill transition-all duration-1.5 bg-gradient-to-r from-amber-500 to-yellow-400 shadow-[0_0_8px_rgba(245,158,11,0.4)]"
            />
          </div>
        </motion.div>

        {/* Status Pill */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 150 }}
          className="mt-4 rounded-2xl bg-[var(--color-dabba)]/50 border border-white/[0.08] p-3 flex items-center gap-3 relative z-10"
        >
          <div className="w-10 h-10 rounded-xl bg-[var(--color-dabba)]/30 border border-[var(--color-dabba)]/50 flex items-center justify-center">
            <Zap className="w-4 h-4 text-[var(--color-haldi)]" />
          </div>
          <div>
            <span className="text-[10px] text-cream/40 font-mono block">Stamina Gauge</span>
            <span className="text-sm font-bold text-[var(--color-haldi)] font-mono">{stamina}% High</span>
          </div>
        </motion.div>
      </div>

      {/* Daily RPG Quests */}
      <div className="bg-[rgba(26,30,40,0.8)] backdrop-blur-xl rounded-3xl p-5 border border-white/[0.08] shadow-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-400" />
            <h4 className="text-sm font-bold text-cream">Daily Avatar Missions</h4>
          </div>
          <span className="text-xs text-cream/40 font-mono">Earn Strength XP</span>
        </div>

        <div className="flex flex-col gap-2">
          {quests.map((q, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: 'spring', stiffness: 150, delay: i * 0.1 }}
              className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                q.done
                  ? 'bg-emerald-500/12 border-emerald-500/25 text-emerald-300 hover:bg-emerald-500/20 hover:border-emerald-500/30'
                  : 'bg-white/[0.02] border-white/[0.05] text-cream/60 hover:bg-emerald-500/15 hover:border-emerald-500/30'
              }`}
            >
              <div className="flex items-center gap-3">
                {q.done ? (
                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
                ) : (
                  <div className="w-4.5 h-4.5 rounded-full border border-white/20 shrink-0" />
                )}
                <span className="text-xs font-medium">{q.title}</span>
              </div>

              <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg ${
                q.done ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/[0.05] text-cream/50'
              }`}>
                +{q.xp} XP
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Unlockable Badges Collection */}
      <div className="bg-[rgba(26,30,40,0.8)] backdrop-blur-xl rounded-3xl p-5 border border-white/[0.08] shadow-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <h4 className="text-sm font-bold text-cream">Achievements & Badges</h4>
          </div>
          <span className="text-xs text-cream/40 font-mono">{badges.filter((b) => b.unlocked).length} Unlocked</span>
        </div>

        <div className="grid grid-cols-2 gap-3.5">
          {badges.map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 130, delay: i * 0.08 }}
              className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                b.unlocked
                  ? 'bg-white/[0.04] border-white/[0.08] hover:bg-emerald-500/20 hover:border-emerald-500/30'
                  : 'bg-white/[0.01] border-white/[0.03] opacity-40 hover:opacity-60'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-2xl">{b.icon}</span>
                {b.unlocked ? (
                  <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                    UNLOCKED
                  </span>
                ) : (
                  <span className="text-[9px] font-mono text-cream/30">LOCKED</span>
                )}
              </div>
              <div>
                <h5 className="text-xs font-bold text-cream">{b.name}</h5>
                <p className="text-[10px] text-cream/50 mt-0.5 leading-snug">{b.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}