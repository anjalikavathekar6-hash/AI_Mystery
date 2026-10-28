import { describe, expect, it } from 'vitest';
import { parseGeminiJson } from './geminiService.js';

describe('Gemini JSON parsing', () => {
  it('parses structured JSON and valid JSON code fences', () => {
    expect(parseGeminiJson('{"title":"A Case"}')).toEqual({ title: 'A Case' });
    expect(parseGeminiJson('```json\n{"title":"A Case"}\n```')).toEqual({ title: 'A Case' });
  });

  it('returns a safe, actionable error for malformed output', () => {
    expect(() => parseGeminiJson('{"suspects":[Rohan\'s file]}')).toThrow('Gemini returned malformed case JSON');
    try { parseGeminiJson('{"suspects":[Rohan\'s file]}'); } catch (error) {
      expect((error as Error).message).not.toContain('Rohan');
    }
  });
});
