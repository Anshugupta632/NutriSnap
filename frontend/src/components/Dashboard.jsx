// Dashboard.jsx
import React, { useState } from 'react';
import ScanActionMenu from './ScanActionMenu';
import ScanCamera from './ScanCamera';

export default function Dashboard() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [loggedMeals, setLoggedMeals] = useState([]);

  // Handler passed to ScanCamera via onScan prop
  const handleScanComplete = (scannedMealData) => {
    // Add new meal to application state
    const newEntry = {
      id: Date.now(),
      name: scannedMealData.items?.[0]?.name || 'Scanned Meal',
      calories: scannedMealData.total_calories || 0,
      protein: scannedMealData.total_protein || 0,
      carbs: scannedMealData.total_carbs || 0,
      fats: scannedMealData.total_fats || 0,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setLoggedMeals((prev) => [newEntry, ...prev]);

    // Optional: Auto-close camera after logging after a brief delay
    setTimeout(() => {
      setIsCameraOpen(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0F1015] text-white p-6">
      {/* Log Meal Trigger Button */}
      <button
        onClick={() => setIsMenuOpen(true)}
        className="px-5 py-3 rounded-2xl bg-emerald-500 text-black font-bold text-sm hover:bg-emerald-400 transition-colors cursor-pointer"
      >
        + Log Meal
      </button>

      {/* Action Menu Sheet */}
      <ScanActionMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onOpenScanCamera={() => setIsCameraOpen(true)}
        onOpenPhotoScanner={() => console.log('Open Photo Modal')}
        onOpenLabelScanner={() => console.log('Open Label Scanner Modal')}
        onOpenQuickText={() => console.log('Open Quick Text Modal')}
        onOpenFoodSearch={() => console.log('Open Food Search Modal')}
      />

      {/* Live Vision Camera Scanner Modal */}
      {isCameraOpen && (
        <ScanCamera
          onScan={handleScanComplete}
          onClose={() => setIsCameraOpen(false)}
        />
      )}

      {/* Daily Log Display */}
      <div className="mt-8 flex flex-col gap-3 max-w-md">
        <h3 className="text-lg font-bold text-white/80">Today's Meal Log</h3>
        {loggedMeals.length === 0 ? (
          <p className="text-sm text-white/40">No meals logged today yet.</p>
        ) : (
          loggedMeals.map((meal) => (
            <div
              key={meal.id}
              className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex justify-between items-center"
            >
              <div>
                <h4 className="font-bold text-sm text-white">{meal.name}</h4>
                <p className="text-xs text-white/50">
                  P: {meal.protein}g | C: {meal.carbs}g | F: {meal.fats}g
                </p>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-emerald-400">{meal.calories} kcal</span>
                <span className="block text-[10px] text-white/40">{meal.timestamp}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}