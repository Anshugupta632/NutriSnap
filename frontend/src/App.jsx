import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

// Components
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import CalorieCard from './components/CalorieCard';
import MealDiary from './components/MealDiary';
import WaterTracker from './components/WaterTracker';
import ScanActionMenu from './components/ScanActionMenu';
import ScanCamera from './components/ScanCamera';
import FoodSearchModal from './components/FoodSearchModal';
import QuickTextLoggerModal from './components/QuickTextLoggerModal';
import UploadModal from './components/UploadModal';
import LabelScannerModal from './components/LabelScannerModal';
import AnalyticsTab from './components/AnalyticsTab';
import AvatarRPGTab from './components/AvatarRPGTab';
import ProfileSetup from './components/ProfileSetup';
import Login from './components/Login';

// Services
import { getAvatarStatus, getMealHistory, getStoredUser, logout } from './services/api';

const INITIAL_DEMO_MEALS = [
  {
    id: 'm-1',
    meal_type: 'breakfast',
    meal_name: 'Masala Oats & Seeds',
    items: [
      { name: 'Masala Oats', quantity: '1 bowl', calories: 260, protein: 9.5, carbs: 38, fats: 7.0 },
      { name: 'Chia Seeds & Almonds', quantity: 'sprinkle', calories: 0, protein: 1, carbs: 0, fats: 0 }
    ],
    total_calories: 260,
    total_protein: 9.5,
    total_carbs: 38,
    total_fats: 7.0,
    time: '08:45 AM',
  },
  {
    id: 'm-2',
    meal_type: 'lunch',
    meal_name: 'Roti & Dal Lunch',
    items: [
      { name: '2 Whole Wheat Rotis', quantity: '2 pcs', calories: 300, protein: 12, carbs: 45, fats: 5.0 },
      { name: 'Dal Tadka', quantity: '1 katori', calories: 120, protein: 4.2, carbs: 15, fats: 4.5 },
      { name: 'Cucumber Salad', quantity: '1 bowl', calories: 50, protein: 0, carbs: 5, fats: 0 }
    ],
    total_calories: 410,
    total_protein: 16.2,
    total_carbs: 62,
    total_fats: 9.5,
    time: '01:30 PM',
  },
  {
    id: 'm-3',
    meal_type: 'snack',
    meal_name: 'Evening Snack',
    items: [
      { name: 'Roasted Chana', quantity: '1 bowl', calories: 140, protein: 8.0, carbs: 22, fats: 2.5 },
      { name: 'Masala Green Tea', quantity: '1 cup', calories: 0, protein: 0, carbs: 0, fats: 0 }
    ],
    total_calories: 140,
    total_protein: 8.0,
    total_carbs: 22,
    total_fats: 2.5,
    time: '05:15 PM',
  },
];

export default function App() {
  // 1. Top-Level State Hooks
  const [view, setView] = useState('auth');
  const [activeTab, setActiveTab] = useState('diary');
  const [selectedDate, setSelectedDate] = useState('Today');
  const [isWideMode, setIsWideMode] = useState(false);

  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [meals, setMeals] = useState(INITIAL_DEMO_MEALS);
  const [waterMl, setWaterMl] = useState(1500);
  const [streakDays, setStreakDays] = useState(5);
  const [avatar, setAvatar] = useState({ stamina: 85, strength_points: 340, protein_deficit_days: 0 });

  // Modal Control States
  const [isScanMenuOpen, setIsScanMenuOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isLabelModalOpen, setIsLabelModalOpen] = useState(false);
  const [isScanCameraOpen, setIsScanCameraOpen] = useState(false);
  const [isFoodSearchOpen, setIsFoodSearchOpen] = useState(false);
  const [isQuickTextOpen, setIsQuickTextOpen] = useState(false);
  const [activeSlot, setActiveSlot] = useState('lunch');

  // 2. Computed Live Totals
  const totals = meals.reduce(
    (acc, m) => ({
      calories: acc.calories + (Number(m.total_calories || m.calories) || 0),
      protein: acc.protein + (Number(m.total_protein || m.protein) || 0),
      carbs: acc.carbs + (Number(m.total_carbs || m.carbs) || 0),
      fats: acc.fats + (Number(m.total_fats || m.fats) || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  const targets = {
    calorie: user?.daily_calorie_target || 2100,
    protein: user?.daily_protein_target || 120,
    carbs: user?.daily_carbs_target || 240,
    fats: user?.daily_fats_target || 65,
    water: 2500,
  };

  // 3. Effects & API Sync
  useEffect(() => {
    const stored = getStoredUser();
    if (stored) {
      setUser(stored);
      setView(stored.body_type ? 'main' : 'profile');
      loadBackendData();
    } else {
      setView('auth');
    }
    setCheckingAuth(false);
  }, []);

  const loadBackendData = async () => {
    try {
      const [avatarRes, historyRes] = await Promise.allSettled([
        getAvatarStatus(),
        getMealHistory(),
      ]);

      if (avatarRes.status === 'fulfilled' && avatarRes.value?.avatar) {
        setAvatar(avatarRes.value.avatar);
      }
      if (historyRes.status === 'fulfilled' && historyRes.value?.meals?.length > 0) {
        setMeals(historyRes.value.meals);
      }
    } catch (e) {
      console.warn('Backend sync note: using local state', e);
    }
  };

  // Handlers
  const handleLogin = (userData) => {
    setUser(userData);
    if (userData.body_type) {
      setView('main');
      loadBackendData();
    } else {
      setView('profile');
    }
  };

  const handleProfileComplete = (userData) => {
    setUser((prev) => ({ ...prev, ...userData }));
    setView('main');
    loadBackendData();
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setView('auth');
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#10B981', '#F59E0B', '#06B6D4'],
    });
  };

  const handleAddMeal = (newMeal) => {
    setMeals((prev) => [
      {
        ...newMeal,
        id: `meal-${Date.now()}`,
        time: newMeal.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
      ...prev,
    ]);

    setAvatar((prev) => ({
      ...prev,
      stamina: Math.min(100, prev.stamina + 5),
      strength_points: prev.strength_points + 25,
    }));

    triggerConfetti();
  };

  // Detailed AI Vision Handler
  const handleCameraVisionScan = (visionResult) => {
    const parsedItems = visionResult.items && visionResult.items.length > 0
      ? visionResult.items
      : [
          {
            name: visionResult.meal_name || visionResult.itemNames || 'Scanned Meal Item',
            quantity: '1 serving',
            calories: Number(visionResult.total_calories || 0),
            protein: Number(visionResult.total_protein || 0),
            carbs: Number(visionResult.total_carbs || 0),
            fats: Number(visionResult.total_fats || 0),
          },
        ];

    const itemsWithNames = parsedItems.map(item => ({
      item_name: item.name,
      calories: item.calories,
      total_protein: item.protein,
      total_carbs: item.carbs,
      total_fats: item.fats,
    }));

    const scannedMeal = {
      meal_type: visionResult.meal_type || activeSlot,
      meal_name: visionResult.meal_name || parsedItems[0]?.name || 'AI Vision Scan',
      item_names: parsedItems.map(item => item.name).join(', '),
      meal_items: itemsWithNames,
      calories: Number(visionResult.total_calories || 0),
      total_calories: Number(visionResult.total_calories || 0),
      total_protein: Number(visionResult.total_protein || 0),
      total_carbs: Number(visionResult.total_carbs || 0),
      total_fats: Number(visionResult.total_fats || 0),
      health_score: visionResult.health_score || 88,
      health_tip: visionResult.health_tip || 'Balanced nutrition profile.',
    };

    handleAddMeal(scannedMeal);
    setIsScanCameraOpen(false);
  };

  const handleDeleteMeal = (mealId) => {
    setMeals((prev) => prev.filter((m) => m.id !== mealId));
  };

  const handleAddWater = (amount) => {
    setWaterMl((prev) => {
      const next = prev + amount;
      if (next >= targets.water && prev < targets.water) {
        triggerConfetti();
      }
      return next;
    });
  };

  const handleRemoveWater = (amount) => {
    setWaterMl((prev) => Math.max(0, prev - amount));
  };

  const handleAddFoodToSlot = (slotId) => {
    setActiveSlot(slotId);
    setIsFoodSearchOpen(true);
  };

  const handleSnapSlot = (slotId) => {
    setActiveSlot(slotId);
    setIsPhotoModalOpen(true);
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#0d0f12] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-3 border-emerald-400/30 border-t-emerald-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0f12] text-cream flex justify-center selection:bg-emerald-500/30">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[380px] bg-emerald-500/10 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="fixed bottom-10 right-10 w-[450px] h-[450px] bg-amber-500/10 rounded-full blur-[170px] pointer-events-none z-0" />

      {view === 'auth' && <Login onLogin={handleLogin} />}
      {view === 'profile' && <ProfileSetup onComplete={handleProfileComplete} />}

      {view === 'main' && (
        <div
          className={`w-full relative z-10 transition-all duration-300 ${
            isWideMode ? 'max-w-4xl px-4 sm:px-8' : 'max-w-md px-3 sm:px-4'
          }`}
        >
          <Navbar
            user={user}
            streakDays={streakDays}
            healthScore={88}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            onLogout={handleLogout}
            isWideMode={isWideMode}
            onToggleWideMode={() => setIsWideMode(!isWideMode)}
            onOpenProfile={() => setView('profile')}
          />

          <main className="pt-4 pb-28">
            <AnimatePresence mode="wait">
              {activeTab === 'diary' && (
                <motion.div
                  key="diary"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-5"
                >
                  <CalorieCard
                    totalCalories={totals.calories}
                    calorieTarget={targets.calorie}
                    protein={Math.round(totals.protein)}
                    proteinTarget={targets.protein}
                    carbs={Math.round(totals.carbs)}
                    carbsTarget={targets.carbs}
                    fats={Math.round(totals.fats)}
                    fatsTarget={targets.fats}
                  />

                  <WaterTracker
                    waterMl={waterMl}
                    waterTarget={targets.water}
                    onAddWater={handleAddWater}
                    onRemoveWater={handleRemoveWater}
                  />

                  <MealDiary
                    meals={meals}
                    onAddFood={handleAddFoodToSlot}
                    onSnapMeal={handleSnapSlot}
                    onDeleteMeal={handleDeleteMeal}
                  />
                </motion.div>
              )}

              {activeTab === 'search' && (
                <motion.div
                  key="search"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-4"
                >
                  <div className="p-4 rounded-3xl bg-[#1A1C23]/90 border border-white/[0.08] shadow-md flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-cream">Indian Food Hub</h3>
                      <p className="text-xs text-cream/50">Explore dishes & fitness foods</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsFoodSearchOpen(true)}
                      className="px-4 py-2 rounded-2xl bg-emerald-500 text-[#121316] font-bold text-xs shadow-md shadow-emerald-500/20 hover:brightness-110 cursor-pointer"
                    >
                      Open Search Hub
                    </button>
                  </div>

                  <FoodSearchModal
                    isOpen={true}
                    onClose={() => setActiveTab('diary')}
                    initialSlot={activeSlot}
                    onLogFoodItem={handleAddMeal}
                  />
                </motion.div>
              )}

              {activeTab === 'analytics' && (
                <motion.div
                  key="analytics"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                >
                  <AnalyticsTab
                    user={user}
                    meals={meals}
                    macros={{
                      protein: totals.protein,
                      carbs: totals.carbs,
                      fats: totals.fats,
                    }}
                  />
                </motion.div>
              )}

              {activeTab === 'avatar' && (
                <motion.div
                  key="avatar"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                >
                  <AvatarRPGTab
                    avatar={avatar}
                    user={user}
                    macros={totals}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          <BottomNav
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onOpenScanMenu={() => setIsScanMenuOpen(true)}
          />

          {/* Action Menu Component with All Handlers Connected */}
          <ScanActionMenu
            isOpen={isScanMenuOpen}
            onClose={() => setIsScanMenuOpen(false)}
            onOpenScanCamera={() => setIsScanCameraOpen(true)}
            onOpenPhotoScanner={() => setIsPhotoModalOpen(true)}
            onOpenLabelScanner={() => setIsLabelModalOpen(true)}
            onOpenQuickText={() => setIsQuickTextOpen(true)}
            onOpenFoodSearch={() => setIsFoodSearchOpen(true)}
          />

          <UploadModal
            isOpen={isPhotoModalOpen}
            onClose={() => setIsPhotoModalOpen(false)}
            initialSlot={activeSlot}
            onSuccess={(result) => {
              const loggedMeal = {
                meal_type: result.meal?.meal_type || activeSlot,
                meal_name: result.meal_name || 'AI Photo Meal',
                items: result.items || [],
                total_calories: result.meal?.total_calories || result.total_calories || 0,
                total_protein: result.meal?.total_protein || result.total_protein || 0,
                total_carbs: result.meal?.total_carbs || result.total_carbs || 0,
                total_fats: result.meal?.total_fats || result.total_fats || 0,
              };
              handleAddMeal(loggedMeal);
            }}
          />

          <LabelScannerModal
            isOpen={isLabelModalOpen}
            onClose={() => setIsLabelModalOpen(false)}
          />

          {isScanCameraOpen && (
            <ScanCamera
              onClose={() => setIsScanCameraOpen(false)}
              onScan={handleCameraVisionScan}
            />
          )}

          {activeTab !== 'search' && (
            <FoodSearchModal
              isOpen={isFoodSearchOpen}
              onClose={() => setIsFoodSearchOpen(false)}
              initialSlot={activeSlot}
              onLogFoodItem={handleAddMeal}
            />
          )}

          <QuickTextLoggerModal
            isOpen={isQuickTextOpen}
            onClose={() => setIsQuickTextOpen(false)}
            initialSlot={activeSlot}
            onLogMeal={handleAddMeal}
          />
        </div>
      )}
    </div>
  );
}