import { Router, Request, Response, NextFunction } from 'express';
import crypto from 'node:crypto';
import mongoose from 'mongoose';
import { rateLimit } from 'express-rate-limit';
import { createCaseSchema, accusationSchema, notesSchema } from '../schemas/case.js';
import { MysteryCase, InvestigationSession } from '../models/models.js';
import { createMystery } from '../services/mysteryGenerationService.js';
import { publicCaseProjection, revealAccusation, tokenHash } from '../services/solutionService.js';
import { AppError } from '../utils/errors.js';

export const api = Router();
const generateLimiter = rateLimit({ windowMs: 60_000, limit: 5, standardHeaders: 'draft-8', legacyHeaders: false });
const accuseLimiter = rateLimit({ windowMs: 60_000, limit: 10, standardHeaders: 'draft-8', legacyHeaders: false });
const wrap = (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) => (req: Request, res: Response, next: NextFunction) => { void fn(req, res, next).catch(next); };
const validId = (id: string) => mongoose.isValidObjectId(id);

api.get('/health', (_req, res) => res.json({ success: true, data: { service: 'ai-mystery-room-api', status: 'ok', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected', timestamp: new Date().toISOString() } }));

api.post('/cases', generateLimiter, wrap(async (req, res) => {
  const startedAt = Date.now();
  const parsed = createCaseSchema.safeParse(req.body);
  if (!parsed.success) throw new AppError(400, 'INVALID_INPUT', parsed.error.issues[0]?.message ?? 'Please check the submitted information.');
  try {
    const data = await createMystery(parsed.data);
    console.info(`[case-generation] requestDurationMs=${Date.now() - startedAt}`);
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.warn(`[case-generation] requestFailedAfterMs=${Date.now() - startedAt}`);
    throw error;
  }
}));

api.get('/cases/:caseId', wrap(async (req, res) => {
  if (!validId(String(req.params.caseId))) throw new AppError(400, 'INVALID_CASE_ID', 'The case ID is invalid.');
  const doc = await MysteryCase.findById(req.params.caseId).select('-privateSolution -scenario -generationMetadata -__v');
  if (!doc) throw new AppError(404, 'CASE_NOT_FOUND', 'This case could not be found.');
  res.json({ success: true, data: publicCaseProjection(doc) });
}));

api.get('/cases/:caseId/evidence', wrap(async (req, res) => {
  if (!validId(String(req.params.caseId))) throw new AppError(400, 'INVALID_CASE_ID', 'The case ID is invalid.');
  const doc = await MysteryCase.findById(req.params.caseId).select('publicCase.evidence');
  if (!doc) throw new AppError(404, 'CASE_NOT_FOUND', 'This case could not be found.');
  const page = Math.max(1, Number(req.query.page) || 1); const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
  const type = typeof req.query.type === 'string' ? req.query.type : '';
  const list = (doc.publicCase.evidence as any[]).filter(item => !type || item.type === type);
  res.json({ success: true, data: { items: list.slice((page - 1) * limit, page * limit), page, limit, total: list.length } });
}));

api.get('/cases/:caseId/evidence/:evidenceId', wrap(async (req, res) => {
  if (!validId(String(req.params.caseId))) throw new AppError(400, 'INVALID_CASE_ID', 'The case ID is invalid.');
  const doc = await MysteryCase.findById(req.params.caseId).select('publicCase.evidence');
  const item = (doc?.publicCase.evidence as any[] | undefined)?.find(x => x.id === req.params.evidenceId);
  if (!item) throw new AppError(404, 'EVIDENCE_NOT_FOUND', 'This evidence item could not be found.');
  res.json({ success: true, data: item });
}));

api.post('/cases/:caseId/sessions', wrap(async (req, res) => {
  if (!validId(String(req.params.caseId))) throw new AppError(400, 'INVALID_CASE_ID', 'The case ID is invalid.');
  const doc = await MysteryCase.findById(req.params.caseId).select('_id');
  if (!doc) throw new AppError(404, 'CASE_NOT_FOUND', 'This case could not be found.');
  const token = crypto.randomBytes(32).toString('base64url');
  const session = await InvestigationSession.create({ caseId: doc._id, sessionTokenHash: tokenHash(token) });
  res.status(201).json({ success: true, data: { sessionId: session.id, sessionToken: token, status: session.status, reviewedEvidenceIds: [], notes: [] } });
}));

const authenticate = wrap(async (req, _res, next) => {
  const token = req.header('x-session-token');
  if (!validId(req.params.caseId as string)) throw new AppError(401, 'SESSION_UNAUTHORIZED', 'Your investigation session could not be verified.');
  const session = await InvestigationSession.findById(req.params.sessionId);
  if (!session || session.sessionTokenHash !== tokenHash(token ?? '')) throw new AppError(401, 'SESSION_UNAUTHORIZED', 'Your investigation session could not be verified.');
  (req as any).investigationSession = session;
  next();
});

api.patch('/sessions/:sessionId/evidence/:evidenceId', authenticate, wrap(async (req, res) => {
  const session = (req as any).investigationSession;
  if (session.status === 'revealed') throw new AppError(409, 'SESSION_LOCKED', 'This investigation is complete.');
  const doc = await MysteryCase.findById(session.caseId).select('publicCase.evidence');
  if (!(doc?.publicCase.evidence as any[]).some(x => x.id === req.params.evidenceId)) throw new AppError(404, 'EVIDENCE_NOT_FOUND', 'This evidence item does not belong to the case.');
  if (req.body?.reviewed === true && !session.reviewedEvidenceIds.includes(req.params.evidenceId)) session.reviewedEvidenceIds.push(req.params.evidenceId);
  if (req.body?.reviewed === false) session.reviewedEvidenceIds = session.reviewedEvidenceIds.filter((id: string) => id !== req.params.evidenceId);
  await session.save();
  res.json({ success: true, data: { reviewedEvidenceIds: session.reviewedEvidenceIds } });
}));

api.put('/sessions/:sessionId/notes', authenticate, wrap(async (req, res) => {
  const session = (req as any).investigationSession;
  if (session.status === 'revealed') throw new AppError(409, 'SESSION_LOCKED', 'This investigation is complete.');
  const parsed = notesSchema.safeParse(req.body);
  
if (!parsed.success) {
  console.error(
    'Create case validation errors:',
    parsed.error.issues
  );

  return res.status(400).json({
    success: false,
    error: {
      code: 'INVALID_INPUT',
      message: 'Please check the submitted information.'
    }
  });
}

}));

api.post('/sessions/:sessionId/accusation', accuseLimiter, authenticate, wrap(async (req, res) => {
  const session = (req as any).investigationSession;
  const parsed = accusationSchema.safeParse(req.body);
  
if (!parsed.success) {
  console.error(
    'Create case validation errors:',
    parsed.error.issues
  );

  return res.status(400).json({
    success: false,
    error: {
      code: 'INVALID_INPUT',
      message: 'Please check the submitted information.'
    }
  });
}

}));

api.get('/sessions/:sessionId', authenticate, wrap(async (req, res) => {
  const session = (req as any).investigationSession;
  res.json({ success: true, data: { sessionId: session.id, caseId: session.caseId, status: session.status, reviewedEvidenceIds: session.reviewedEvidenceIds, notes: session.notes, ...(session.status === 'revealed' ? { result: session.result } : {}) } });
}));
