const fs = require('fs');
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY || process.env.OPENROUTER_API_KEY;

if (!apiKey) {
  throw new Error('GEMINI_API_KEY missing in .env file!');
}

const ai = new GoogleGenAI({ apiKey });

function fileToGenerativePart(filePath, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(filePath)).toString('base64'),
      mimeType,
    },
  };
}

function parseAIJSON(responseText) {
  if (!responseText) {
    throw new Error('AI returned empty response');
  }

  const jsonMatch = responseText.match(/\{[\s\S]*\}/);
  const cleanedText = jsonMatch ? jsonMatch[0].trim() : responseText.replace(/```json|```/g, '').trim();

  return JSON.parse(cleanedText);
}

async function analyzeMealPhoto(filePath, mimeType) {
  try {
    const prompt = `Analyze this food image and return ONLY a valid JSON object matching this schema without markdown formatting:
{
  "items": [
    {
      "name": "Item name",
      "quantity": "Portion size",
      "calories": 250,
      "protein": 12,
      "carbs": 30,
      "fats": 8,
      "confidence_level": "high"
    }
  ],
  "total_calories": 250,
  "total_protein": 12,
  "total_carbs": 30,
  "total_fats": 8
}`;

    const imagePart = fileToGenerativePart(filePath, mimeType);

    // Using gemini-3.6-flash as required by API response
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: [prompt, imagePart],
    });

    const responseText = response.text;
    return parseAIJSON(responseText);
  } catch (error) {
    console.error('[Gemini Vision Error]:', error.message);
    throw new Error('AI vision service failed to process the image.');
  }
}

module.exports = { analyzeMealPhoto };