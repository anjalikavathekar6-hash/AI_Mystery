import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  MONGODB_URI: z.string().min(1).default('mongodb://127.0.0.1:27017/ai_mystery_room'),
  GEMINI_API_KEY: z.string().default(''), GEMINI_MODEL: z.string().default(''),
  CLIENT_ORIGIN: z.string().default('http://localhost:5173'),
  SESSION_SECRET: z.string().min(16).default('development-session-secret-change-me'),
  REQUEST_TIMEOUT_MS: z.coerce.number().int().positive().default(45000)
});
export const env = schema.parse(process.env);
console.log("Gemini configuration check:", {
  apiKeyLoaded: Boolean(env.GEMINI_API_KEY),
  model: env.GEMINI_MODEL || "(empty)"
});