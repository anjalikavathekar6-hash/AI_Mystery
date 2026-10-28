import { z } from 'zod';

export const createCaseSchema = z.object({
  scenario: z.string().trim().min(30).max(5000),
  difficulty: z.enum(['easy', 'medium', 'hard']).default('medium'),
  category: z.enum(['theft', 'missing_object', 'suspicious_incident', 'corporate_mystery', 'historical_mystery', 'custom']).default('custom'),
  suspectCount: z.number().int().min(3).max(6).default(4),
  evidenceRichness: z.enum(['standard', 'detailed']).default('standard')
});

const suspect = z.object({ id: z.string().min(1), name: z.string(), age: z.number().int().min(18).max(120), occupation: z.string(), relationshipToIncident: z.string(), background: z.string(), motive: z.string(), alibi: z.string(), relatedEvidenceIds: z.array(z.string()), suspicionSummary: z.string() });
const message = z.object({ sender: z.string(), recipient: z.string(), timestamp: z.string(), content: z.string() });
const evidence = z.object({ id: z.string().min(1), type: z.enum(['chat','image','cctv','witness_statement','document','access_log','other']), title: z.string(), description: z.string(), timestamp: z.string().optional(), relatedSuspectIds: z.array(z.string()).default([]), relatedEventIds: z.array(z.string()).default([]), metadata: z.record(z.unknown()).default({}), transcript: z.array(message).optional() });
const event = z.object({ id: z.string(), timestamp: z.string(), description: z.string(), relatedSuspectIds: z.array(z.string()).default([]), relatedEvidenceIds: z.array(z.string()), certainty: z.enum(['confirmed','alleged','uncertain']) });
const reasoning = z.object({ evidenceId: z.string(), reasoning: z.string(), supportsConclusion: z.boolean() });
export const generatedCaseSchema = z.object({
  title: z.string(), summary: z.string(), incidentDescription: z.string(), location: z.string(), incidentTime: z.string(),
  suspects: z.array(suspect).min(3).max(6), evidence: z.array(evidence).min(4), timeline: z.array(event).min(3),
  investigationInstructions: z.string(), culpritSuspectId: z.string(), trueMotive: z.string(), actualSequenceOfEvents: z.array(z.string()).min(2),
  evidenceReasoning: z.array(reasoning).min(2), redHerringExplanations: z.array(z.string()), finalExplanation: z.string()
});
export const accusationSchema = z.object({ suspectId: z.string().min(1).max(100), reasoning: z.string().max(2000).optional().default('') });
export const notesSchema = z.object({ notes: z.array(z.object({ content: z.string().trim().min(1).max(2000) })).max(100) });
