import express from 'express';
import cors from 'cors';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { env } from './config/env.js';
import { api } from './routes/api.js';
import { AppError } from './utils/errors.js';

export const app = express();
app.disable('x-powered-by');
if (env.NODE_ENV === 'production') app.set('trust proxy', 1);
app.use(cors({ origin: env.CLIENT_ORIGIN.split(',').map(x => x.trim()), methods: ['GET','POST','PUT','PATCH','OPTIONS'], allowedHeaders: ['Content-Type','X-Session-Token'] }));
app.use(express.json({ limit: '64kb' }));
app.use('/api/v1', api);
const clientDist = resolve(dirname(fileURLToPath(import.meta.url)), '../../client/dist');
if (existsSync(clientDist)) {
  app.use(express.static(clientDist, { index: false, maxAge: '1y', immutable: true }));
  app.get(/^\/(?!api(?:\/|$)).*/, (req, res, next) => {
    res.sendFile(resolve(clientDist, 'index.html'), error => {
      if (error) next(error);
    });
  });
}
app.use((_req, res) => res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'The requested endpoint was not found.' } }));
app.use((error: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (error instanceof AppError || error?.status && error?.code) return res.status(error.status).json({ success: false, error: { code: error.code, message: error.message } });
  if (error?.name === 'ZodError') {
    const generatedCaseFailed = _req.method === 'POST' && _req.path === '/cases';
    return res.status(generatedCaseFailed ? 502 : 400).json({ success: false, error: { code: generatedCaseFailed ? 'CASE_GENERATION_FAILED' : 'INVALID_INPUT', message: generatedCaseFailed ? 'Gemini returned an incomplete case. Please try generating it again.' : 'Please check the submitted information.' } });
  }
  if (error?.type === 'entity.too.large') return res.status(413).json({ success: false, error: { code: 'REQUEST_TOO_LARGE', message: 'The request is too large.' } });
  console.error('API error:', error instanceof Error ? error.message : 'Unknown error');
  const providerMissing = error instanceof Error && /Gemini is not configured|API key|model/i.test(error.message);
  res.status(providerMissing ? 503 : 502).json({ success: false, error: { code: providerMissing ? 'AI_PROVIDER_UNAVAILABLE' : 'CASE_GENERATION_FAILED', message: providerMissing ? 'Case generation is not configured yet. Add the Gemini settings to server/.env.' : 'The mystery could not be generated. Please try again.' } });
});
