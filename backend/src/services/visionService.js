const fs = require('fs');
require('dotenv').config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Verified & currently working free vision models on OpenRouter
const VISION_MODELS = [
  'google/gemini-2.0-flash-lite-preview-02-05:free',
  'google/gemini-2.0-pro-exp-02-05:free',
  'meta-llama/llama-3.2-11b-vision-instruct:free',
  'qwen/qwen-2-vl-7b-instruct:free'
];

if (!OPENROUTER_API_KEY) {
  throw new Error('OPENROUTER_API_KEY missing in .env file!');
}

function fileToBase64DataUrl(filePath, mimeType) {
  const base64 = fs.readFileSync(filePath).toString('base64');
  return `data:${mimeType};base64,${base64}`;
}

/**
 * Safely parses JSON from AI response even if wrapped in markdown code blocks
 */
function parseAIJSON(responseText, context = 'meal analysis') {
  if (!responseText) {
    throw new Error('AI returned no response. Please try again.');
  }

  // Extract raw JSON content between braces if markdown or extra text is present
  const jsonMatch = responseText.match(/\{[\s\S]*\}/);
  const cleanedText = jsonMatch ? jsonMatch[0].trim() : responseText.replace(/```json|```/g, '').trim();

  try {
    return JSON.parse(cleanedText);
  } catch (parseError) {
    console.error(`[${context}] JSON parse failed. Raw response:`, responseText);
    console.error(`[${context}] Cleaned text:`, cleanedText);

    if (cleanedText.includes('SAFETY') || cleanedText.includes('safety') || cleanedText.includes('blocked')) {
      throw new Error('Photo content violates safety policy. Try a different photo.');
    }
    if (cleanedText.includes('quota') || cleanedText.includes('rate limit')) {
      throw new Error('AI service is busy. Please try again later.');
    }

    throw new Error('Could not understand AI response. Please try again.');
  }
}

async function tryOneModel(model, prompt, imageDataUrl) {
  const response = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: imageDataUrl } },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    const error = new Error(`OpenRouter error for ${model}: ${response.status}`);
    error.status = response.status;
    error.rawBody = errText;
    throw error;
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error(`No content returned from ${model}`);
  }
  return text;
}

async function callOpenRouterVision(prompt, imageDataUrl) {
  let lastError = null;

  for (const model of VISION_MODELS) {
    try {
      return await tryOneModel(model, prompt, imageDataUrl);
    } catch (err) {
      lastError = err;
      console.error(`Vision model failed: ${model}`, err.status || '', err.rawBody || err.message);

      const isRetryable = err.status === 429 || (err.status >= 500 && err.status < 600) || err.status === 404;
      if (!isRetryable) {
        break;
      }
    }
  }

  console.error('All vision models failed. Last error:', lastError?.message);
  throw new Error('AI vision service is currently busy. Please try again in a moment.');
}

async function analyzeMealPhoto(filePath, mimeType) {
  const prompt = `You are an expert nutritionist specializing in Indian and global cuisines. Analyze this food image and provide an accurate nutrition breakdown.

Respond strictly in raw JSON without any explanations or conversational text:
{
  "items": [
    {
      "name": "Item name (e.g., Paneer Tikka, Chapati, Dal)",
      "quantity": "Portion size (e.g., 2 pieces, 1 bowl)",
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

  const imageDataUrl = fileToBase64DataUrl(filePath, mimeType);
  const responseText = await callOpenRouterVision(prompt, imageDataUrl);
  return parseAIJSON(responseText, 'meal analysis');
}

module.exports = { analyzeMealPhoto };