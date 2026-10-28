import { generatedCaseSchema } from '../schemas/case.js';

export function validateGeneratedCase(value: unknown, expectedSuspects?: number) {
  const data = generatedCaseSchema.parse(value);
  const allIds = [...data.suspects.map(x => x.id), ...data.evidence.map(x => x.id), ...data.timeline.map(x => x.id)];
  if (new Set(allIds).size !== allIds.length) throw new Error('Generated case contains duplicate IDs.');
  const suspectIds = new Set(data.suspects.map(x => x.id));
  const evidenceIds = new Set(data.evidence.map(x => x.id));
  const eventIds = new Set(data.timeline.map(x => x.id));
  if (expectedSuspects && data.suspects.length !== expectedSuspects) throw new Error('Generated suspect count did not match the request.');
  const requiredTypes = ['chat', 'image', 'cctv', 'witness_statement'];
  for (const type of requiredTypes) if (!data.evidence.some(item => item.type === type)) throw new Error(`Generated case is missing required ${type} evidence.`);
  for (const item of data.evidence.filter(item => item.type === 'image' || item.type === 'cctv')) {
    if (item.metadata.fallbackType !== 'text_reconstruction') throw new Error('Visual evidence must identify its text reconstruction fallback.');
  }
  if (!suspectIds.has(data.culpritSuspectId)) throw new Error('Culprit does not reference a case suspect.');
  for (const suspect of data.suspects) for (const id of suspect.relatedEvidenceIds) if (!evidenceIds.has(id)) throw new Error('Suspect references unknown evidence.');
  for (const item of data.evidence) for (const id of item.relatedSuspectIds) if (!suspectIds.has(id)) throw new Error('Evidence references an unknown suspect.');
  for (const item of data.evidence) for (const id of item.relatedEventIds) if (!eventIds.has(id)) throw new Error('Evidence references an unknown event.');
  for (const item of data.timeline) for (const id of item.relatedEvidenceIds) if (!evidenceIds.has(id)) throw new Error('Timeline references unknown evidence.');
  for (const item of data.timeline) for (const id of item.relatedSuspectIds) if (!suspectIds.has(id)) throw new Error('Timeline references an unknown suspect.');
  for (const item of data.evidenceReasoning) if (!evidenceIds.has(item.evidenceId)) throw new Error('Solution references unknown evidence.');
  if (data.evidenceReasoning.filter(x => x.supportsConclusion).length < 2) throw new Error('At least two clues must support the solution.');
  const dates = [data.incidentTime, ...data.timeline.map(x => x.timestamp), ...data.evidence.flatMap(x => x.timestamp ? [x.timestamp] : []), ...data.evidence.flatMap(x => x.transcript?.map(m => m.timestamp) ?? [])].map(Date.parse);
  if (dates.some(date => !Number.isFinite(date))) throw new Error('Case timestamps must use valid ISO date/time values.');
  const timelineDates = data.timeline.map(x => Date.parse(x.timestamp));
  if (timelineDates.some((date, index) => index > 0 && date < timelineDates[index - 1])) throw new Error('Timeline events are not chronological.');
  if (data.evidenceReasoning.filter(x => x.supportsConclusion).some(item => !data.finalExplanation.includes(item.evidenceId))) throw new Error('Final explanation must cite its supporting evidence IDs.');
  const publicText = JSON.stringify({ ...data, culpritSuspectId: undefined, trueMotive: undefined, actualSequenceOfEvents: undefined, evidenceReasoning: undefined, redHerringExplanations: undefined, finalExplanation: undefined }).toLowerCase();
  const culprit = data.suspects.find(x => x.id === data.culpritSuspectId)!;
  if (publicText.includes(`culprit is ${culprit.name.toLowerCase()}`) || publicText.includes(`the culprit: ${culprit.name.toLowerCase()}`)) throw new Error('Generated public content leaks the solution.');
  return data;
}
