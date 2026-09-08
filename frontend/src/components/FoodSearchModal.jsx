import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Plus, Dumbbell, Wheat, Droplet, Check, Sparkles, Filter } from 'lucide-react';
import { FOOD_DATABASE, CATEGORIES } from '../data/foodDatabase';

export default function FoodSearchModal({
  isOpen,
  onClose,
  initialSlot = 'lunch',
  onLogFoodItem,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSlot, setSelectedSlot] = useState(initialSlot);
  const [selectedFood, setSelectedFood] = useState(null);
  const [portion, setPortion] = useState(1);
  const [showCustomModal, setShowCustomModal] = useState(false);

  // Custom food state
  const [customFood, setCustomFood] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: '',
  });

  const filteredFoods = useMemo(() => {
    return FOOD_DATABASE.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  if (!isOpen) return null;

  const handleSelectFood = (food) => {
    setSelectedFood(food);
    setPortion(1);
  };

  const handleConfirmLog = () => {
    if (!selectedFood) return;
    const loggedMeal = {
      meal_type: selectedSlot,
      total_calories: Math.round(selectedFood.calories * portion),
      total_protein: Math.round(selectedFood.protein * portion * 10) / 10,
      total_carbs: Math.round(selectedFood.carbs * portion * 10) / 10,
      total_fats: Math.round(selectedFood.fats * portion * 10) / 10,
      itemNames: `${selectedFood.name} (${portion}x ${selectedFood.serving})`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    onLogFoodItem(loggedMeal);
    setSelectedFood(null);
    onClose();
  };

  const handleLogCustomFood = (e) => {
    e.preventDefault();
    if (!customFood.name || !customFood.calories) return;

    const loggedMeal = {
      meal_type: selectedSlot,
      total_calories: Number(customFood.calories) || 0,
      total_protein: Number(customFood.protein) || 0,
      total_carbs: Number(customFood.carbs) || 0,
      total_fats: Number(customFood.fats) || 0,
      itemNames: `${customFood.name} (Custom Entry)`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    onLogFoodItem(loggedMeal);
    setShowCustomModal(false);
    setCustomFood({ name: '', calories: '', protein: '', carbs: '', fats: '' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-lg bg-[#16181F] border border-white/[0.1] rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-cream">Food Database & Hub</h2>
              <p className="text-xs text-cream/50">Search verified Indian & Global foods</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center text-cream/60 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Meal Slot Picker */}
        <div className="px-4 py-2.5 bg-white/[0.02] border-b border-white/[0.06] flex items-center justify-between">
          <span className="text-xs font-semibold text-cream/60 font-mono">Log to:</span>
          <div className="flex items-center gap-1">
            {['breakfast', 'lunch', 'snack', 'dinner'].map((slot) => (
              <button
                key={slot}
                onClick={() => setSelectedSlot(slot)}
                className={`px-2.5 py-1 rounded-xl text-xs capitalize font-medium transition-all ${
                  selectedSlot === slot
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                    : 'text-cream/50 hover:text-white'
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        {/* Search Input */}
        <div className="p-4 pb-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-cream/40" />
            <input
              type="text"
              placeholder="Search roti, dal, paneer, chicken, oats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-white/[0.04] border border-white/[0.1] text-sm text-cream placeholder-cream/30 focus:outline-none focus:border-emerald-500/60 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-cream/40 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Chips Horizontal Scroll */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-2.5 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-500 text-[#121316] font-bold shadow-md shadow-emerald-500/20'
                    : 'bg-white/[0.04] hover:bg-white/[0.08] text-cream/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Food List */}
        <div className="flex-1 overflow-y-auto px-4 divide-y divide-white/[0.04]">
          {filteredFoods.length === 0 ? (
            <div className="py-10 text-center flex flex-col items-center gap-3">
              <p className="text-sm text-cream/40">No matching food found.</p>
              <button
                onClick={() => setShowCustomModal(true)}
                className="px-4 py-2 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all cursor-pointer"
              >
                + Add Custom Food Entry
              </button>
            </div>
          ) : (
            filteredFoods.map((item) => {
              const isVeg = item.tag === 'Veg';
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectFood(item)}
                  className="py-3 flex items-center justify-between hover:bg-white/[0.02] px-2 rounded-2xl cursor-pointer transition-colors group"
                >
                  <div className="flex items-start gap-2.5">
                    {/* Veg / Non-Veg dot */}
                    <div className="mt-1 w-3.5 h-3.5 border rounded-sm flex items-center justify-center p-[2px] shrink-0 border-current"
                         style={{ color: isVeg ? '#10B981' : '#EF4444' }}>
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: isVeg ? '#10B981' : '#EF4444' }} />
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-cream group-hover:text-emerald-300 transition-colors">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-cream/40 font-mono mt-0.5">
                        {item.serving} • {item.category}
                      </p>
                      <div className="flex items-center gap-2.5 mt-1 text-[10px] font-mono">
                        <span className="text-cyan-400 font-bold">P: {item.protein}g</span>
                        <span className="text-amber-400">C: {item.carbs}g</span>
                        <span className="text-rose-400">F: {item.fats}g</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-sm font-bold text-cream font-mono">
                        {item.calories}
                      </span>
                      <span className="text-[10px] text-cream/40 block font-mono">kcal</span>
                    </div>

                    <button className="w-8 h-8 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-all">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Portion Selector Sheet */}
        <AnimatePresence>
          {selectedFood && (
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="p-4 sm:p-5 bg-[#1A1C23] border-t border-white/[0.12] rounded-t-3xl shadow-2xl flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-cream">{selectedFood.name}</h3>
                  <p className="text-xs text-cream/50">
                    Base: {selectedFood.serving} ({selectedFood.calories} kcal)
                  </p>
                </div>
                <button
                  onClick={() => setSelectedFood(null)}
                  className="text-xs text-cream/40 hover:text-white"
                >
                  Cancel
                </button>
              </div>

              {/* Portion multipliers */}
              <div className="flex items-center gap-2">
                {[0.5, 1, 1.5, 2, 3].map((val) => (
                  <button
                    key={val}
                    onClick={() => setPortion(val)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                      portion === val
                        ? 'bg-emerald-500 text-[#121316] shadow-md shadow-emerald-500/30'
                        : 'bg-white/[0.06] text-cream/70 hover:bg-white/[0.1]'
                    }`}
                  >
                    {val}x
                  </button>
                ))}
              </div>

              {/* Calculated Summary */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.04] border border-white/[0.06]">
                <div className="text-center">
                  <span className="text-[10px] text-cream/40 block uppercase">Calories</span>
                  <span className="text-sm font-bold text-emerald-400 font-mono">
                    {Math.round(selectedFood.calories * portion)} kcal
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-[10px] text-cream/40 block uppercase">Protein</span>
                  <span className="text-sm font-bold text-cyan-400 font-mono">
                    {Math.round(selectedFood.protein * portion * 10) / 10}g
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-[10px] text-cream/40 block uppercase">Carbs</span>
                  <span className="text-sm font-bold text-amber-400 font-mono">
                    {Math.round(selectedFood.carbs * portion * 10) / 10}g
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-[10px] text-cream/40 block uppercase">Fats</span>
                  <span className="text-sm font-bold text-rose-400 font-mono">
                    {Math.round(selectedFood.fats * portion * 10) / 10}g
                  </span>
                </div>
              </div>

              <button
                onClick={handleConfirmLog}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-[#121316] font-bold text-sm shadow-lg shadow-emerald-500/25 hover:brightness-110 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Log to {selectedSlot.toUpperCase()}</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Custom Food Creation Modal */}
        {showCustomModal && (
          <div className="absolute inset-0 z-50 bg-[#16181F] p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <h3 className="text-base font-bold text-cream">Add Custom Food</h3>
                <button
                  onClick={() => setShowCustomModal(false)}
                  className="text-cream/50 hover:text-white text-sm"
                >
                  Close
                </button>
              </div>

              <form className="flex flex-col gap-3.5 mt-4">
                <div>
                  <label className="text-xs text-cream/60 font-mono block mb-1">Food Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Mom's Special Dal Khichdi"
                    value={customFood.name}
                    onChange={(e) => setCustomFood({ ...customFood, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-sm text-cream focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-cream/60 font-mono block mb-1">Calories (kcal) *</label>
                    <input
                      type="number"
                      required
                      placeholder="250"
                      value={customFood.calories}
                      onChange={(e) => setCustomFood({ ...customFood, calories: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-white/[0.05] border border-white/[0.1] text-sm text-cream"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-cyan-400 font-mono block mb-1">Protein (g)</label>
                    <input
                      type="number"
                      placeholder="12"
                      value={customFood.protein}
                      onChange={(e) => setCustomFood({ ...customFood, protein: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-white/[0.05] border border-white/[0.1] text-sm text-cream"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-amber-400 font-mono block mb-1">Carbs (g)</label>
                    <input
                      type="number"
                      placeholder="30"
                      value={customFood.carbs}
                      onChange={(e) => setCustomFood({ ...customFood, carbs: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-white/[0.05] border border-white/[0.1] text-sm text-cream"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-rose-400 font-mono block mb-1">Fats (g)</label>
                    <input
                      type="number"
                      placeholder="8"
                      value={customFood.fats}
                      onChange={(e) => setCustomFood({ ...customFood, fats: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-white/[0.05] border border-white/[0.1] text-sm text-cream"
                    />
                  </div>
                </div>
              </form>
            </div>

            <button
              onClick={handleLogCustomFood}
              className="w-full py-3 rounded-2xl bg-emerald-500 text-[#121316] font-bold text-sm shadow-lg shadow-emerald-500/25 hover:brightness-110 active:scale-98 transition-all cursor-pointer"
            >
              Save & Log Food
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
