import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Health Check Route for Render
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'NutriSnap Backend is Live' });
});

// Helper function to safely get AI client
const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('⚠️ GEMINI_API_KEY is missing in environment variables!');
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

// Vision Route
app.post('/api/meals/analyze-vision', async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Image data is required.' });
    }

    const matches = image.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!matches) {
      return res.status(400).json({ error: 'Invalid base64 image format.' });
    }

    const mimeType = matches[1];
    const base64Data = matches[2];

    const ai = getAiClient();
    if (!ai) {
      return res.status(500).json({
        error: 'Gemini API key is not configured on the server.',
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          inlineData: {
            mimeType: mimeType,
            data: base64Data,
          },
        },
        `You are a top nutritionist. Analyze this food image in deep detail:
        1. Identify the overall meal name (e.g. North Indian Thali, Chicken Salad).
        2. Breakdown every food item visible with estimated portion size and individual calories/macros.
        3. Calculate total calories, protein, carbs, and fats in grams.
        4. Give a health score out of 100 and a 1-sentence health advice tip.`,
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            meal_name: { type: Type.STRING },
            health_score: { type: Type.NUMBER },
            health_tip: { type: Type.STRING },
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  quantity: { type: Type.STRING },
                  calories: { type: Type.NUMBER },
                  protein: { type: Type.NUMBER },
                  carbs: { type: Type.NUMBER },
                  fats: { type: Type.NUMBER },
                },
                required: ['name', 'quantity', 'calories', 'protein', 'carbs', 'fats'],
              },
            },
            total_calories: { type: Type.NUMBER },
            total_protein: { type: Type.NUMBER },
            total_carbs: { type: Type.NUMBER },
            total_fats: { type: Type.NUMBER },
          },
          required: [
            'meal_name',
            'health_score',
            'health_tip',
            'items',
            'total_calories',
            'total_protein',
            'total_carbs',
            'total_fats',
          ],
        },
      },
    });

    const parsedData = JSON.parse(response.text);
    return res.status(200).json(parsedData);
  } catch (error) {
    console.error('Vision analysis error:', error);
    return res.status(500).json({ error: 'Failed to analyze meal image.' });
  }
});

// Port binding for Render
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server successfully running on port ${PORT}`);
});