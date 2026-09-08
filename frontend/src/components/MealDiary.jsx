import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, SunDim, Coffee, Moon, Plus, Camera, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

const MEAL_SLOTS = [
  { id: 'breakfast', title: 'Breakfast', icon: Sun, recommended: '400-500 kcal', time: '08:00 - 10:30 AM' },
  { id: 'lunch', title: 'Lunch', icon: SunDim, recommended: '600-750 kcal', time: '12:30 - 02:30 PM' },
  { id: 'snack', title: 'Snacks & Chai', icon: Coffee, recommended: '150-250 kcal', time: '04:30 - 06:30 PM' },
  { id: 'dinner', title: 'Dinner', icon: Moon, recommended: '500-650 kcal', time: '07:30 - 10:00 PM' },
];

export default function MealDiary({ meals = [], onAddFood, onSnapMeal, onDeleteMeal }) {
  const [expandedSlots, setExpandedSlots] = useState({
    breakfast: true,
    lunch: true,
    snack: true,
    dinner: true,
  });

  const toggleSlot = (slotId) => {
    setExpandedSlots((prev) => ({ ...prev, [slotId]: !prev[slotId] }));
  };

  // Group meals by meal_type or mealType
  const getSlotMeals = (slotId) => {
    return meals.filter(
      (m) => (m.meal_type || m.mealType || '').toLowerCase() === slotId.toLowerCase()
    );
  };

  return (
    <div className="w-full flex flex-col gap-3.5">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-bold uppercase tracking-wider text-cream/70 font-mono">
          Today's Meal Diary
        </h3>
        <span className="text-xs text-cream/40 font-mono">
          {meals.length} {meals.length === 1 ? 'entry' : 'entries'} logged
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {MEAL_SLOTS.map((slot) => {
          const Icon = slot.icon;
          const slotMeals = getSlotMeals(slot.id);
          const isExpanded = expandedSlots[slot.id];
          const slotCalories = slotMeals.reduce((sum, m) => sum + (Number(m.calories || m.total_calories) || 0), 0);

          return (
            <div
              key={slot.id}
              className="bg-[#1A1C23]/80 backdrop-blur-xl rounded-2xl border border-white/[0.07] overflow-hidden transition-all shadow-md"
            >
              {/* Slot Header */}
              <div
                onClick={() => toggleSlot(slot.id)}
                className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-white/[0.02] transition-colors select-none"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-emerald-400 shadow-sm">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-cream tracking-tight">{slot.title}</h4>
                      {slotCalories > 0 && (
                        <span className="text-xs font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          {slotCalories} kcal
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-cream/40 font-mono">
                      Rec: {slot.recommended}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddFood(slot.id);
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-semibold cursor-pointer transition-colors"
                    title={`Add food to ${slot.title}`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSnapMeal(slot.id);
                    }}
                    className="w-7 h-7 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] flex items-center justify-center text-cream/70 hover:text-white cursor-pointer transition-colors"
                    title={`Snap photo of ${slot.title}`}
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </motion.button>

                  <div className="text-cream/40 ml-1">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Collapsible Food Items List */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="px-3.5 pb-3 border-t border-white/[0.04]"
                  >
                    {slotMeals.length === 0 ? (
                      <div className="py-3 text-center">
                        <p className="text-xs text-cream/35">No items logged yet.</p>
                        <button
                          onClick={() => onAddFood(slot.id)}
                          className="mt-1 text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer underline decoration-dotted"
                        >
                          + Log from Indian Food Hub
                        </button>
                      </div>
                    ) : (
                      <div className="divide-y divide-white/[0.04] mt-1">
                        {slotMeals.map((meal, idx) => (
                          <div
                            key={meal.id || `${slot.id}-${idx}`}
                            className="py-2.5 flex items-center justify-between group"
                          >
                            <div className="flex-1 pr-2">
                              <p className="text-xs font-semibold text-cream">
                                {meal.itemNames || meal.item_name || (meal.meal_items && meal.meal_items.map(i => i.item_name).join(', ')) || 'Logged Meal'}
                              </p>
                              <div className="flex items-center gap-2 mt-1 text-[10px] text-cream/40 font-mono">
                                <span className="text-emerald-400 font-bold">
                                  {meal.calories || meal.total_calories} kcal
                                </span>
                                {meal.total_protein !== undefined && (
                                  <span>• P: {meal.total_protein}g</span>
                                )}
                                {meal.total_carbs !== undefined && (
                                  <span>• C: {meal.total_carbs}g</span>
                                )}
                                {meal.total_fats !== undefined && (
                                  <span>• F: {meal.total_fats}g</span>
                                )}
                                {meal.time && <span>• {meal.time}</span>}
                              </div>
                            </div>

                            {onDeleteMeal && (
                              <button
                                onClick={() => onDeleteMeal(meal.id || idx)}
                                className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-rose-400/60 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                                title="Remove meal"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
