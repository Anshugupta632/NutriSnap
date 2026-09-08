import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Award, FileText, Download, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import { downloadMonthlyReport } from '../services/api';

export default function AnalyticsTab({ user, meals = [], macros = { protein: 48, carbs: 98, fats: 32 } }) {
  const [isDownloading, setIsDownloading] = useState(false);

  // 7-day adherence mock data combining real logged meals
  const weekDays = [
    { day: 'Mon', cal: 1950, target: 2100, status: 'hit' },
    { day: 'Tue', cal: 2050, target: 2100, status: 'hit' },
    { day: 'Wed', cal: 2200, target: 2100, status: 'over' },
    { day: 'Thu', cal: 1850, target: 2100, status: 'hit' },
    { day: 'Fri', cal: 2120, target: 2100, status: 'hit' },
    { day: 'Sat', cal: 2350, target: 2100, status: 'over' },
    { day: 'Sun', cal: 1980, target: 2100, status: 'hit' },
  ];

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const data = await downloadMonthlyReport();
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nutrisnap-monthly-report-${new Date().toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 150);
    } catch (err) {
      console.error('Failed to download report:', err);
      alert('Could not download PDF report. Ensure backend server is running on port 5000.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-5 pb-20">
      {/* Hero Stats Card */}
      <div className="bg-gradient-to-br from-[#1A1C23] to-[#121316] rounded-3xl p-5 border border-white/[0.08] shadow-lg relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Award className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-cream">Health & Nutrition Score</h3>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 font-mono">
            GRADE A-
          </span>
        </div>

        <div className="flex items-baseline gap-2 my-2">
          <span className="text-4xl font-black font-display text-cream tracking-tight">88</span>
          <span className="text-sm text-cream/40 font-mono">/ 100 points</span>
        </div>
        <p className="text-xs text-cream/60 leading-relaxed">
          Based on 7-day calorie consistency, protein target adherence, and hydration balance.
        </p>

        {/* 4 Health Pillars */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-4 border-t border-white/[0.06]">
          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <span className="text-[10px] text-cream/40 block font-mono">Calorie Target</span>
            <span className="text-xs font-bold text-emerald-400 font-mono">92% Met</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <span className="text-[10px] text-cream/40 block font-mono">Protein Quality</span>
            <span className="text-xs font-bold text-cyan-400 font-mono">85% Met</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <span className="text-[10px] text-cream/40 block font-mono">Hydration</span>
            <span className="text-xs font-bold text-blue-400 font-mono">90% Met</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <span className="text-[10px] text-cream/40 block font-mono">Clean Diet</span>
            <span className="text-xs font-bold text-amber-400 font-mono">86% Score</span>
          </div>
        </div>
      </div>

      {/* 7-Day Calorie Adherence Bar Chart */}
      <div className="bg-[#1A1C23]/80 backdrop-blur-xl rounded-3xl p-5 border border-white/[0.08] shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-bold text-cream">7-Day Calorie Consistency</h4>
            <p className="text-[11px] text-cream/40 font-mono">Target: 2,100 kcal / day</p>
          </div>
          <span className="text-xs text-emerald-400 font-bold font-mono">5 of 7 Days On Track</span>
        </div>

        {/* Bar chart container */}
        <div className="h-44 flex items-end justify-between gap-2 pt-6 px-2">
          {weekDays.map((item, idx) => {
            const heightPercent = Math.min(100, Math.round((item.cal / 2500) * 100));
            const isHit = item.status === 'hit';

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                {/* Tooltip */}
                <div className="absolute -top-7 opacity-0 group-hover:opacity-100 bg-[#121316] text-[10px] font-mono text-cream px-2 py-0.5 rounded-lg border border-white/10 shadow-lg pointer-events-none transition-opacity whitespace-nowrap z-10">
                  {item.cal} kcal
                </div>

                <div className="w-full bg-white/[0.04] rounded-t-xl h-36 flex items-end p-1">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPercent}%` }}
                    transition={{ duration: 0.8, delay: idx * 0.08, ease: 'easeOut' }}
                    className={`w-full rounded-lg ${
                      isHit
                        ? 'bg-gradient-to-t from-emerald-500 to-teal-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                        : 'bg-gradient-to-t from-amber-500 to-orange-400 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                    }`}
                  />
                </div>
                <span className="text-[11px] font-mono font-medium text-cream/60">
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Macro Split Breakdown */}
      <div className="bg-[#1A1C23]/80 backdrop-blur-xl rounded-3xl p-5 border border-white/[0.08] shadow-md">
        <h4 className="text-sm font-bold text-cream mb-1">Average Macro Split</h4>
        <p className="text-[11px] text-cream/40 mb-4">Recommended for Somatotype: 30% Protein, 45% Carbs, 25% Fats</p>

        <div className="w-full h-4 bg-white/[0.05] rounded-full overflow-hidden flex p-[1px]">
          <div style={{ width: '28%' }} className="h-full bg-cyan-400" title="Protein 28%" />
          <div style={{ width: '48%' }} className="h-full bg-amber-400" title="Carbs 48%" />
          <div style={{ width: '24%' }} className="h-full bg-rose-400" title="Fats 24%" />
        </div>

        <div className="flex items-center justify-between mt-3 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <span className="text-cream/70">Protein: 28%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="text-cream/70">Carbs: 48%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
            <span className="text-cream/70">Fats: 24%</span>
          </div>
        </div>
      </div>

      {/* AI Nutritionist Insights */}
      <div className="bg-[#1A1C23]/80 backdrop-blur-xl rounded-3xl p-5 border border-white/[0.08] shadow-md flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <h4 className="text-sm font-bold text-cream">AI Dietitian Insights</h4>
        </div>

        <div className="flex items-start gap-3 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p>
            <strong>Protein intake improved:</strong> You averaged 112g of protein over the last 3 days. Your 3D avatar muscle recovery score has increased by 14%!
          </p>
        </div>

        <div className="flex items-start gap-3 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p>
            <strong>Evening snack optimization:</strong> Chai and biscuit logs are adding 22g of refined sugars. Try roasted makhana or chana for sustained satiety.
          </p>
        </div>
      </div>

      {/* Download PDF Monthly Report */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleDownloadPDF}
        disabled={isDownloading}
        className="w-full py-4 rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-[#121316] font-bold text-sm shadow-xl shadow-emerald-500/20 hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <Download className="w-4 h-4" />
        <span>{isDownloading ? 'Generating PDF...' : 'Download Official Monthly PDF Report'}</span>
      </motion.button>
    </div>
  );
}
