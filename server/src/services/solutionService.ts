import crypto from 'node:crypto';
import { InvestigationSession, MysteryCase } from '../models/models.js';

export const tokenHash = (token: string) => crypto.createHash('sha256').update(token).digest('hex');
export const publicCaseProjection = (doc: any) => ({ caseId: doc.id, title: doc.title, status: doc.status, category: doc.category, difficulty: doc.difficulty, ...doc.publicCase });

export async function revealAccusation(session: any, suspectId: string, reasoning = '') {
  if (session.status === 'revealed') throw Object.assign(new Error('This investigation is already complete.'), { status: 409, code: 'DUPLICATE_SUBMISSION' });
  const doc = await MysteryCase.findById(session.caseId);
  if (!doc) throw Object.assign(new Error('Case not found.'), { status: 404, code: 'CASE_NOT_FOUND' });
  const culpritId = doc.privateSolution.culpritSuspectId as string;
  if (!(doc.publicCase.suspects as any[]).some(x => x.id === suspectId)) throw Object.assign(new Error('Choose a suspect from this case.'), { status: 400, code: 'INVALID_SUSPECT' });
  const result = { correct: suspectId === culpritId, culpritSuspectId: culpritId, culpritName: (doc.publicCase.suspects as any[]).find(x => x.id === culpritId)?.name, motive: doc.privateSolution.trueMotive, explanation: doc.privateSolution.finalExplanation, supportingEvidenceIds: (doc.privateSolution.evidenceReasoning as any[]).filter(x => x.supportsConclusion).map(x => x.evidenceId), evidenceReasoning: doc.privateSolution.evidenceReasoning, redHerringExplanations: doc.privateSolution.redHerringExplanations, reconstruction: doc.privateSolution.actualSequenceOfEvents, fictionalNotice: 'This case and all associated evidence are simulated fiction.' };
  session.status = 'revealed'; session.accusation = { suspectId, reasoning, submittedAt: new Date() }; session.result = result;
  await session.save();
  return result;
}
