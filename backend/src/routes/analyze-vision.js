// backend route: /api/meals/analyze-vision
import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI(); // process.env.GEMINI_API_KEY

app.post('/api/meals/analyze-vision', async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) return res.status(400).json({ error: 'Image required' });

    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Data,
          },
        },
        `You are an expert nutritionist. Analyze this food photo in high detail:
        1. Identify EVERY dish/item visible on the plate with quantity estimates (e.g., "2 Rotis", "1 bowl Dal").
        2. Provide calories and macronutrients for each individual item.
        3. Provide estimated total macros (calories, protein, carbs, fats).
        4. Provide brief dietary advice or health rating for this meal.`,
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            meal_name: { type: Type.STRING, description: 'Overall meal name e.g. North Indian Thali' },
            health_score: { type: Type.NUMBER, description: 'Health score out of 100' },
            health_tip: { type: Type.STRING, description: 'Short dietary insight or advice' },
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

    const detailedData = JSON.parse(response.text);
    return res.status(200).json(detailedData);
  } catch (error) {
    console.error('Vision analysis error:', error);
    return res.status(500).json({ error: 'Failed to analyze meal' });
  }
});