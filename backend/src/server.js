// routes/meals.js (or server.js)
const express = require('express');
const { GoogleGenAI, Type } = require('@google/genai');

const router = express.Router();
const ai = new GoogleGenAI(); // Uses process.env.GEMINI_API_KEY by default

router.post('/analyze-vision', async (req, res) => {
  try {
    const { image } = req.body; // Expects data URL "data:image/jpeg;base64,..."

    if (!image) {
      return res.status(400).json({ error: 'Image data is required.' });
    }

    // Extract base64 payload and mime type
    const matches = image.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!matches) {
      return res.status(400).json({ error: 'Invalid base64 image format.' });
    }

    const mimeType = matches[1];
    const base64Data = matches[2];

    // Call Gemini 2.5 Flash with structured output schema
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          inlineData: {
            mimeType: mimeType,
            data: base64Data,
          },
        },
        'Analyze this meal photo. Identify the primary food item, estimated total calories, and macronutrient breakdown in grams (protein, carbs, fats).',
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  portion: { type: Type.STRING },
                },
                required: ['name'],
              },
            },
            total_calories: { type: Type.NUMBER },
            total_protein: { type: Type.NUMBER },
            total_carbs: { type: Type.NUMBER },
            total_fats: { type: Type.NUMBER },
          },
          required: [
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

export default router;