import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function getAvatarState(stamina) {
  if (stamina >= 75) return { emoji: '💪', label: 'Strong', color: 'var(--color-curry, #10B981)' };
  if (stamina >= 40) return { emoji: '🙂', label: 'Okay', color: 'var(--color-haldi, #F59E0B)' };
  return { emoji: '😮‍💨', label: 'Weak', color: 'var(--color-masala, #EF4444)' };
}

function useCountUp(end, duration = 800) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return count;
}

function Avatar({ stamina = 100, strengthPoints = 0, deficitDays = 0, user = null, level = 1 }) {
  const state = getAvatarState(stamina);
  const animatedStamina = useCountUp(stamina, 1000);
  const animatedStrength = useCountUp(strengthPoints, 800);

  const userInitials = user?.first_name
    ? `${user.first_name[0]}${user.last_name ? user.last_name[0] : ''}`.toUpperCase()
    : 'NS';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 120, damping: 25 }}
      className="relative overflow-hidden bg-[var(--color-steel)] rounded-3xl p-6 border border-white/10 shadow-2xl shadow-[0_25px_50px_rgba(0,0,0,0.5)] flex flex-col gap-5 group"
    >
      {/* Background Ambient Glow Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
        className="absolute -top-8 -right-8 w-48 h-48 rounded-full blur-3xl pointer-events-none"
        style={{ backgroundColor: state.color, opacity: 0.4 }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
        className="flex items-center gap-5 relative z-10"
      >
        {/* User Profile Avatar Frame */}
        <div className="relative">
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            className="absolute -inset-1 rounded-3xl blur-sm opacity-60"
            style={{ backgroundColor: state.color }}
          />

          <motion.div
            whileHover={{ scale: 1.1, boxShadow: `0 0 20px ${state.color}40` }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative w-20 h-20 rounded-3xl flex items-center justify-center border-2 border-white/20 bg-black/50 backdrop-blur-md shadow-lg overflow-hidden"
            style={{ borderColor: state.color }}
          >
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center">
                <span className="text-3xl">{state.emoji}</span>
                <span className="text-[12px] font-mono font-bold text-cream/80">{userInitials}</span>
              </div>
            )}
          </motion.div>

          {/* Level Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
            className="absolute -bottom-2 -right-1 bg-[var(--color-masala)] border border-white/20 text-cream font-mono font-bold text-[10px] px-2.5 py-0.5 rounded-full shadow-xl flex items-center gap-1"
          >
            <span className="text-haldi">★</span> Lvl {level}
          </motion.div>
        </div>

        <div className="flex-1">
          <motion.p
            key={state.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.15 }}
            className="font-display font-bold text-xl text-cream tracking-wide flex items-center gap-2"
          >
            <span>{state.label}</span>
            <span className="text-xs font-mono font-normal px-2.5 py-1.5 rounded-md bg-white/5 border border-white/10 text-cream/70">
              {user?.first_name || 'Hero'}
            </span>
          </motion.p>
          <motion.p
            key={animatedStrength}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-cream/60 text-xs font-body font-medium mt-1 flex items-center gap-1.5"
          >
            <span className="text-haldi">⚡</span>
            <span>{animatedStrength} strength points</span>
          </motion.p>
        </div>
      </motion.div>

      {/* Glassmorphic Stamina bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, type: 'spring', stiffness: 200, damping: 20 }}
        className="flex flex-col gap-2 relative z-10"
      >
        <div className="flex justify-between text-xs font-body font-semibold text-cream/70">
          <span className="flex items-center gap-1">
            <span>🔋</span> Stamina
          </span>
          <motion.span
            key={animatedStamina}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="font-mono text-cream font-bold"
          >
            {animatedStamina}%
          </motion.span>
        </div>
        <div className="w-full h-4 bg-black/50 rounded-2xl p-0 overflow-hidden">
          <motion.div
            key={stamina}
            initial={{ width: 0 }}
            animate={{ width: `${stamina}%` }}
            transition={{ type: 'spring', stiffness: 80, damping: 15, duration: 1.2 }}
            className="h-full rounded-2xl relative overflow-hidden"
            style={{
              backgroundColor: state.color,
              boxShadow: `0 0 16px ${state.color}33, inset 0 1px 0 rgba(255,255,255,0.1)`,
            }}
          >
            {/* Glossy overlay with subtle gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          </motion.div>
        </div>
      </motion.div>

      {/* Protein Deficit Warning Alert */}
      <AnimatePresence>
        {deficitDays > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="text-[var(--color-masala)] text-xs font-body font-medium bg-[var(--color-masala)]/20 border border-[var(--color-masala)]/40 rounded-2xl px-4 py-3 backdrop-blur-md flex items-center gap-3 shadow-lg relative z-10"
          >
            <span className="text-sm">⚠️</span>
            <span>
              {deficitDays} day{deficitDays > 1 ? 's' : ''} short on protein — stamina dropping!
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default Avatar;
