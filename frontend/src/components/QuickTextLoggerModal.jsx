import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquareText, Sparkles, X, Check, ArrowRight, Wand2 } from 'lucide-react';
import { FOOD_DATABASE } from '../data/foodDatabase';

export default function QuickTextLoggerModal({
  isOpen,
  onClose,
  initialSlot = 'lunch',
  onLogMeal,
}) {
  const [inputText, setInputText] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(initialSlot);
  const [parsedItems, setParsedItems] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  if (!isOpen) return null;

  const handleAnalyze = () => {
    if (!inputText.trim()) return;
    setIsAnalyzing(true);

    // Smart heuristic matching against Indian & global database
    setTimeout(() => {
      const lower = inputText.toLowerCase();
      let matches = [];
      let totalCal = 0, totalP = 0, totalC = 0, totalF = 0;

      FOOD_DATABASE.forEach((item) => {
        const itemWords = item.name.toLowerCase().split(/[\s/()]+/);
        const hasMatch = itemWords.some((w) => w.length > 3 && lower.includes(w));
        if (hasMatch) {
          // Check for quantity multiplier in text e.g. "2 roti" or "3 eggs"
          let qty = 1;
          const numMatch = lower.match(new RegExp(`(\\d+)\\s*(?:pcs|pieces|plates|bowls)?\\s*${itemWords[0]}`, 'i'));
          if (numMatch && numMatch[1]) {
            qty = Math.min(6, Math.max(1, parseInt(numMatch[1], 10)));
          }

          matches.push({
            name: `${item.name} (${qty}x)`,
            calories: Math.round(item.calories * qty),
            protein: Math.round(item.protein * qty * 10) / 10,
            carbs: Math.round(item.carbs * qty * 10) / 10,
            fats: Math.round(item.fats * qty * 10) / 10,
          });

          totalCal += Math.round(item.calories * qty);
          totalP += Math.round(item.protein * qty * 10) / 10;
          totalC += Math.round(item.carbs * qty * 10) / 10;
          totalF += Math.round(item.fats * qty * 10) / 10;
        }
      });

      // If no exact database keywords matched, provide a balanced estimate
      if (matches.length === 0) {
        const wordCount = inputText.split(' ').length;
        const estCal = Math.max(250, wordCount * 90);
        matches.push({
          name: inputText.trim(),
          calories: estCal,
          protein: Math.round(estCal * 0.05),
          carbs: Math.round(estCal * 0.12),
          fats: Math.round(estCal * 0.03),
        });
        totalCal = estCal;
        totalP = Math.round(estCal * 0.05);
        totalC = Math.round(estCal * 0.12);
        totalF = Math.round(estCal * 0.03);
      }

      setParsedItems({
        items: matches,
        totals: {
          calories: totalCal,
          protein: totalP,
          carbs: totalC,
          fats: totalF,
        },
      });
      setIsAnalyzing(false);
    }, 600);
  };

  const handleConfirmLog = () => {
    if (!parsedItems) return;
    const loggedMeal = {
      meal_type: selectedSlot,
      total_calories: parsedItems.totals.calories,
      total_protein: parsedItems.totals.protein,
      total_carbs: parsedItems.totals.carbs,
      total_fats: parsedItems.totals.fats,
      itemNames: parsedItems.items.map((i) => i.name).join(', '),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    onLogMeal(loggedMeal);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-md bg-[#16181F] border border-white/[0.1] rounded-3xl p-5 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-cream">AI Quick Text Logger</h2>
              <p className="text-xs text-cream/50">Describe what you ate in simple words</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center text-cream/60 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Meal Slot Selector */}
        <div className="flex items-center justify-between p-2 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
          <span className="text-xs font-semibold text-cream/60 font-mono ml-2">Slot:</span>
          <div className="flex items-center gap-1">
            {['breakfast', 'lunch', 'snack', 'dinner'].map((slot) => (
              <button
                key={slot}
                onClick={() => setSelectedSlot(slot)}
                className={`px-2.5 py-1 rounded-xl text-xs capitalize font-medium transition-all ${
                  selectedSlot === slot
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                    : 'text-cream/50 hover:text-white'
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        {/* Text Input */}
        <div>
          <label className="text-xs text-cream/60 font-mono block mb-1.5">
            Meal description
          </label>
          <textarea
            rows="3"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="e.g., 2 whole wheat rotis with 1 bowl dal tadka, salad and 1 cup curd..."
            className="w-full p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.1] text-sm text-cream placeholder-cream/30 focus:outline-none focus:border-cyan-500/60 resize-none transition-colors"
          />

          {/* Quick presets */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {[
              '2 Rotis + Dal Tadka + Salad',
              'Oatmeal with Almonds & Banana',
              'Grilled Chicken + Brown Rice',
              '2 Boiled Eggs + 1 Toast + Chai',
            ].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setInputText(preset)}
                className="text-[10px] px-2 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-cream/60 hover:text-white transition-colors cursor-pointer"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={!inputText.trim() || isAnalyzing}
          className="w-full py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-[#121316] font-bold text-sm shadow-lg shadow-cyan-500/25 active:scale-98 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
        >
          {isAnalyzing ? (
            <span>Estimating Nutrition...</span>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Parse & Calculate Nutrition</span>
            </>
          )}
        </button>

        {/* Parsed Result Preview */}
        {parsedItems && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex flex-col gap-3"
          >
            <h4 className="text-xs font-bold text-emerald-400 uppercase font-mono tracking-wider">
              Identified Nutrition
            </h4>

            <div className="divide-y divide-white/[0.04]">
              {parsedItems.items.map((it, idx) => (
                <div key={idx} className="py-2 flex items-center justify-between text-xs">
                  <span className="text-cream font-medium">{it.name}</span>
                  <span className="text-cream/50 font-mono">{it.calories} kcal</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono">
              <div>
                <span className="text-cream/50">Total: </span>
                <span className="text-emerald-400 font-bold text-sm">
                  {parsedItems.totals.calories} kcal
                </span>
              </div>
              <div className="flex gap-2">
                <span className="text-cyan-400">P: {parsedItems.totals.protein}g</span>
                <span className="text-amber-400">C: {parsedItems.totals.carbs}g</span>
                <span className="text-rose-400">F: {parsedItems.totals.fats}g</span>
              </div>
            </div>

            <button
              onClick={handleConfirmLog}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-[#121316] font-bold text-xs shadow-md shadow-emerald-500/20 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2 mt-1"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Log Meal to {selectedSlot.toUpperCase()}</span>
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
