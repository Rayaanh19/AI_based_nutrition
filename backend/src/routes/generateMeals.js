import { Router } from 'express';
import Joi from 'joi';
import { chatWithOllama } from '../ollamaClient.js';

const router = Router();

const schema = Joi.object({
  age: Joi.number().integer().min(1).max(120).required(),
  sex: Joi.string().valid('male', 'female', 'other').required(),
  height_cm: Joi.number().min(50).max(250).required(),
  weight_kg: Joi.number().min(20).max(300).required(),
  activity_level: Joi.string().valid('sedentary', 'light', 'moderate', 'active', 'very_active').required(),
  dietary_preferences: Joi.array().items(Joi.string()).default([]),
  allergies: Joi.array().items(Joi.string()).default([]),
  goals: Joi.array().items(Joi.string()).default([]),
  cuisine_preferences: Joi.array().items(Joi.string()).default([]),
});

router.post('/generate-meals', async (req, res) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ error: 'Invalid input', details: error.details });
  }

  try {
    const prompt = buildPrompt(value);
    const response = await chatWithOllama(prompt);
    res.json({ result: response });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to generate meals', details: e.message });
  }
});

function buildPrompt(input) {
  const prefs = input.dietary_preferences.join(', ') || 'none';
  const allergies = input.allergies.join(', ') || 'none';
  const goals = input.goals.join(', ') || 'balanced nutrition';
  const cuisines = input.cuisine_preferences.join(', ') || 'any';

  return `You are a certified nutritionist and meal planning assistant.
Generate a one-day meal plan (breakfast, lunch, dinner, and 2 snacks) with easy recipes and approximate macros and calories.

User profile:
- Age: ${input.age}
- Sex: ${input.sex}
- Height: ${input.height_cm} cm
- Weight: ${input.weight_kg} kg
- Activity level: ${input.activity_level}
- Dietary preferences: ${prefs}
- Allergies: ${allergies}
- Goals: ${goals}
- Cuisine preferences: ${cuisines}

Constraints:
- Avoid allergens strictly.
- Respect preferences and goals.
- Provide simple ingredients available in common grocery stores.
- Output in concise markdown with clear section headings.
`;
}

export default router;
