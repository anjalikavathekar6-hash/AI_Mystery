import { env } from '../config/env.js';
import { generatedCaseSchema } from '../schemas/case.js';
import { MysteryCase } from '../models/models.js';
import { generateWithGemini } from './geminiService.js';
import { validateGeneratedCase } from './caseValidationService.js';
import { AppError } from '../utils/errors.js';
import { ZodError } from 'zod';

export async function createMystery(input: { scenario: string; difficulty: string; category: string; suspectCount: number; evidenceRichness: string }) {
  const raw = await generateWithGemini(input) as any;
  // The provider isn't configured to create image or video files, so enforce the
  // honest fallback label on visual evidence even if Gemini omits that metadata.
  if (Array.isArray(raw?.evidence)) {
    for (const item of raw.evidence) {
      if ((item?.type === 'image' || item?.type === 'cctv') && item && typeof item === 'object') {
        item.metadata = { ...(item.metadata && typeof item.metadata === 'object' ? item.metadata : {}), fallbackType: 'text_reconstruction' };
      }
    }
  }

  let generated: ReturnType<typeof validateGeneratedCase>;
  try {
    generated = validateGeneratedCase(raw, input.suspectCount);
  } catch (error) {
    const reason = error instanceof ZodError
      ? `schemaPaths=${[...new Set(error.issues.map(issue => issue.path.join('.')))].join(',') || 'unknown'}`
      : `reason=${error instanceof Error ? error.message : 'unknown'}`;
    console.warn(`[case-generation] validationFailed ${reason}`);
    throw new AppError(502, 'CASE_GENERATION_FAILED', 'Gemini returned a case with inconsistent details. Please try generating it again.');
  }
  const publicCase = { summary: generated.summary, incidentDescription: generated.incidentDescription, location: generated.location, incidentTime: generated.incidentTime, suspects: generated.suspects, evidence: generated.evidence, timeline: generated.timeline, investigationInstructions: generated.investigationInstructions };
  const privateSolution = { culpritSuspectId: generated.culpritSuspectId, trueMotive: generated.trueMotive, actualSequenceOfEvents: generated.actualSequenceOfEvents, evidenceReasoning: generated.evidenceReasoning, redHerringExplanations: generated.redHerringExplanations, finalExplanation: generated.finalExplanation };
  const doc = await MysteryCase.create({ title: generated.title, scenario: input.scenario, category: input.category, difficulty: input.difficulty, status: 'ready', publicCase, privateSolution, generationMetadata: { model: env.GEMINI_MODEL, generatedAt: new Date() } });
  return { caseId: doc.id, title: doc.title, status: doc.status, summary: publicCase.summary };
}

export function parseGeneratedCase(value: unknown) { return generatedCaseSchema.parse(value); }
