export const FOOD_DATABASE = [
  // Breakfast items
  { id: 'fb-1', name: 'Masala Oats', category: 'Breakfast', serving: '1 bowl (200g)', calories: 210, protein: 7.5, carbs: 32, fats: 5.5, fiber: 4.8, tag: 'Veg' },
  { id: 'fb-2', name: 'Paneer Stuffed Paratha', category: 'Breakfast', serving: '1 paratha (120g)', calories: 290, protein: 11.0, carbs: 34, fats: 12.0, fiber: 3.5, tag: 'Veg' },
  { id: 'fb-3', name: 'Boiled Eggs (2 pcs)', category: 'Breakfast', serving: '2 large eggs (100g)', calories: 155, protein: 13.0, carbs: 1.1, fats: 10.6, fiber: 0, tag: 'Non-Veg' },
  { id: 'fb-4', name: 'Poha with Peanuts', category: 'Breakfast', serving: '1 plate (180g)', calories: 260, protein: 6.2, carbs: 42, fats: 7.8, fiber: 3.2, tag: 'Veg' },
  { id: 'fb-5', name: 'Idli with Sambar (2 pcs)', category: 'Breakfast', serving: '2 idlis + sambar', calories: 180, protein: 6.8, carbs: 35, fats: 1.8, fiber: 4.0, tag: 'Veg' },
  { id: 'fb-6', name: 'Masala Dosa', category: 'Breakfast', serving: '1 medium dosa', calories: 310, protein: 6.0, carbs: 48, fats: 10.5, fiber: 3.0, tag: 'Veg' },
  { id: 'fb-7', name: 'Greek Yogurt with Berries', category: 'Breakfast', serving: '1 cup (180g)', calories: 165, protein: 16.0, carbs: 14, fats: 4.0, fiber: 2.5, tag: 'Veg' },
  { id: 'fb-8', name: 'Egg White Omelette (3 whites)', category: 'Breakfast', serving: '1 omelette', calories: 95, protein: 18.0, carbs: 2.0, fats: 1.5, fiber: 0.5, tag: 'Non-Veg' },

  // Lunch & Dinner Indian Mains
  { id: 'fm-1', name: 'Whole Wheat Roti / Chapati', category: 'Indian Breads', serving: '1 medium (35g)', calories: 85, protein: 3.1, carbs: 16.5, fats: 0.8, fiber: 2.3, tag: 'Veg' },
  { id: 'fm-2', name: 'Dal Tadka (Yellow Lentil)', category: 'Mains', serving: '1 katori (150g)', calories: 145, protein: 7.8, carbs: 20, fats: 4.2, fiber: 4.5, tag: 'Veg' },
  { id: 'fm-3', name: 'Paneer Butter Masala', category: 'Mains', serving: '1 bowl (180g)', calories: 340, protein: 14.5, carbs: 12, fats: 26.0, fiber: 2.8, tag: 'Veg' },
  { id: 'fm-4', name: 'Palak Paneer', category: 'Mains', serving: '1 bowl (180g)', calories: 230, protein: 13.0, carbs: 8, fats: 16.0, fiber: 4.2, tag: 'Veg' },
  { id: 'fm-5', name: 'Chicken Breast Curry', category: 'Mains', serving: '1 bowl (200g)', calories: 260, protein: 32.0, carbs: 6, fats: 11.5, fiber: 2.0, tag: 'Non-Veg' },
  { id: 'fm-6', name: 'Grilled Chicken Breast', category: 'Mains', serving: '1 fillet (150g)', calories: 220, protein: 38.0, carbs: 0, fats: 6.5, fiber: 0, tag: 'Non-Veg' },
  { id: 'fm-7', name: 'Jeera Rice / Steamed Rice', category: 'Grains', serving: '1 plate (150g)', calories: 195, protein: 4.0, carbs: 42, fats: 1.2, fiber: 1.0, tag: 'Veg' },
  { id: 'fm-8', name: 'Rajma Masala (Kidney Beans)', category: 'Mains', serving: '1 katori (180g)', calories: 190, protein: 9.5, carbs: 28, fats: 4.5, fiber: 7.2, tag: 'Veg' },
  { id: 'fm-9', name: 'Chole (Chickpea Curry)', category: 'Mains', serving: '1 katori (180g)', calories: 220, protein: 10.5, carbs: 32, fats: 5.5, fiber: 6.8, tag: 'Veg' },
  { id: 'fm-10', name: 'Mixed Vegetable Subzi', category: 'Mains', serving: '1 katori (150g)', calories: 110, protein: 3.2, carbs: 14, fats: 4.8, fiber: 4.0, tag: 'Veg' },
  { id: 'fm-11', name: 'Egg Curry (2 Eggs)', category: 'Mains', serving: '1 bowl', calories: 240, protein: 15.0, carbs: 8, fats: 16.0, fiber: 1.5, tag: 'Non-Veg' },
  { id: 'fm-12', name: 'Hyderabadi Chicken Biryani', category: 'Mains', serving: '1 plate (300g)', calories: 460, protein: 26.0, carbs: 54, fats: 16.0, fiber: 3.0, tag: 'Non-Veg' },
  { id: 'fm-13', name: 'Moong Dal Khichdi with Ghee', category: 'Mains', serving: '1 plate (200g)', calories: 240, protein: 8.5, carbs: 38, fats: 6.0, fiber: 4.0, tag: 'Veg' },
  { id: 'fm-14', name: 'Soya Chunks Curry', category: 'Mains', serving: '1 bowl (160g)', calories: 185, protein: 21.0, carbs: 12, fats: 4.5, fiber: 6.0, tag: 'Veg' },

  // Snacks & Beverages
  { id: 'fs-1', name: 'Roasted Chana / Chickpeas', category: 'Snacks', serving: '1 fistful (40g)', calories: 140, protein: 8.0, carbs: 22, fats: 2.5, fiber: 5.0, tag: 'Veg' },
  { id: 'fs-2', name: 'Whey Protein Shake', category: 'Fitness', serving: '1 scoop (30g) in water', calories: 120, protein: 24.0, carbs: 2.5, fats: 1.5, fiber: 0.5, tag: 'Veg' },
  { id: 'fs-3', name: 'Masala Chai with Low Sugar', category: 'Beverages', serving: '1 cup (150ml)', calories: 65, protein: 2.2, carbs: 9, fats: 2.0, fiber: 0, tag: 'Veg' },
  { id: 'fs-4', name: 'Sprouts Chaat', category: 'Snacks', serving: '1 bowl (120g)', calories: 130, protein: 8.5, carbs: 20, fats: 1.5, fiber: 5.5, tag: 'Veg' },
  { id: 'fs-5', name: 'Almonds & Walnuts mix', category: 'Snacks', serving: '30g', calories: 185, protein: 5.5, carbs: 5, fats: 17.0, fiber: 3.0, tag: 'Veg' },
  { id: 'fs-6', name: 'Peanut Butter on Whole Wheat Toast', category: 'Snacks', serving: '1 slice + 1 tbsp', calories: 175, protein: 7.0, carbs: 16, fats: 9.5, fiber: 2.8, tag: 'Veg' },
  { id: 'fs-7', name: 'Green Salad with Lemon', category: 'Salads', serving: '1 bowl (120g)', calories: 35, protein: 1.5, carbs: 6, fats: 0.4, fiber: 2.5, tag: 'Veg' },
  { id: 'fs-8', name: 'Curd / Dahi', category: 'Sides', serving: '1 cup (150g)', calories: 95, protein: 5.2, carbs: 7, fats: 5.0, fiber: 0, tag: 'Veg' }
];

export const CATEGORIES = ['All', 'Breakfast', 'Mains', 'Indian Breads', 'Grains', 'Snacks', 'Fitness', 'Salads', 'Beverages', 'Sides'];
