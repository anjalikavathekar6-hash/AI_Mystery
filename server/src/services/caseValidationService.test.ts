import { describe, expect, it } from 'vitest';
import { validateGeneratedCase } from './caseValidationService.js';
import { accusationSchema, createCaseSchema } from '../schemas/case.js';

function validCase() {
  const suspects = ['suspect_a','suspect_b','suspect_c'].map((id, i) => ({ id, name: `Person ${i}`, age: 30 + i, occupation: 'Archivist', relationshipToIncident: 'Had access', background: 'A fictional profile.', motive: 'A plausible reason.', alibi: 'At the west entrance.', relatedEvidenceIds: ['evidence_a'], suspicionSummary: 'Their account needs checking.' }));
  const evidence = [
    { id: 'evidence_a', type: 'chat' as const, title: 'Message thread', description: 'An exchange before closing.', timestamp: '2026-01-01T20:10:00Z', relatedSuspectIds: ['suspect_a'], relatedEventIds: ['event_a'], metadata: {}, transcript: [{ sender: 'Person 0', recipient: 'Person 1', timestamp: '2026-01-01T20:10:00Z', content: 'Meet by the archive.' }] },
    { id: 'evidence_b', type: 'witness_statement' as const, title: 'Witness note', description: 'A witness heard the side door.', timestamp: '2026-01-01T20:30:00Z', relatedSuspectIds: ['suspect_b'], relatedEventIds: ['event_b'], metadata: {} },
    { id: 'evidence_c', type: 'image' as const, title: 'Room reconstruction', description: 'A simulated image description.', timestamp: '2026-01-01T20:40:00Z', relatedSuspectIds: ['suspect_c'], relatedEventIds: ['event_c'], metadata: { fallbackType: 'text_reconstruction' } },
    { id: 'evidence_d', type: 'cctv' as const, title: 'Camera log', description: 'Text reconstruction of camera events.', timestamp: '2026-01-01T20:50:00Z', relatedSuspectIds: ['suspect_a'], relatedEventIds: ['event_c'], metadata: { fallbackType: 'text_reconstruction' } }
  ];
  const timeline = ['event_a','event_b','event_c'].map((id, i) => ({ id, timestamp: `2026-01-01T20:${10 + i * 10}:00Z`, description: `Event ${i}`, relatedSuspectIds: ['suspect_a'], relatedEvidenceIds: [i === 0 ? 'evidence_a' : i === 1 ? 'evidence_b' : 'evidence_c'], certainty: 'confirmed' as const }));
  return { title: 'The Archive After Hours', summary: 'A ledger vanished from the town archive.', incidentDescription: 'During a winter exhibition, a ledger disappeared from a locked room.', location: 'West Archive', incidentTime: '2026-01-01T21:00:00Z', suspects, evidence, timeline, investigationInstructions: 'Compare the access log to the witness account.', culpritSuspectId: 'suspect_a', trueMotive: 'Recover a hidden family letter.', actualSequenceOfEvents: ['A message was sent.', 'The ledger was removed.'], evidenceReasoning: [{ evidenceId: 'evidence_a', reasoning: 'The exchange places the suspect near the archive.', supportsConclusion: true }, { evidenceId: 'evidence_b', reasoning: 'The witness account contradicts the stated route.', supportsConclusion: true }], redHerringExplanations: ['The damaged window was older than the incident.'], finalExplanation: 'evidence_a and evidence_b establish the route and timing.' };
}

describe('case input and generation validation', () => {
  it('accepts the documented case input limits and rejects short scenarios', () => {
    expect(createCaseSchema.safeParse({ scenario: 'A fictional incident long enough to make a case.', suspectCount: 4 }).success).toBe(true);
    expect(createCaseSchema.safeParse({ scenario: 'too short' }).success).toBe(false);
    expect(createCaseSchema.safeParse({ scenario: 'x'.repeat(5001) }).success).toBe(false);
  });

  it('accepts a consistent case with a private culprit and evidence-backed explanation', () => {
    expect(validateGeneratedCase(validCase(), 3).culpritSuspectId).toBe('suspect_a');
  });

  it('rejects invalid culprit references and answers leaking into cited evidence', () => {
    const invalid = validCase();
    invalid.culpritSuspectId = 'suspect_missing';
    expect(() => validateGeneratedCase(invalid, 3)).toThrow(/culprit/i);
    const leaked = validCase();
    leaked.finalExplanation = 'The answer follows from the file.';
    expect(() => validateGeneratedCase(leaked, 3)).toThrow(/evidence IDs/i);
  });

  it('rejects broken event ordering and references', () => {
    const invalid = validCase();
    invalid.timeline[2].relatedEvidenceIds = ['evidence_missing'];
    expect(() => validateGeneratedCase(invalid, 3)).toThrow(/unknown evidence/i);
  });

  it('validates accusation shape without trusting a client correctness flag', () => {
    expect(accusationSchema.safeParse({ suspectId: 'suspect_a', correct: true }).success).toBe(true);
    expect(accusationSchema.safeParse({ suspectId: '', correct: true }).success).toBe(false);
  });
});
