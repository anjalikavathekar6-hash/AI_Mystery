import { beforeEach, describe, expect, it, vi } from 'vitest';

const { createMystery } = vi.hoisted(() => ({ createMystery: vi.fn() }));
vi.mock('../services/mysteryGenerationService.js', () => ({ createMystery }));

import supertest from 'supertest';
import { app } from '../app.js';

describe('POST /api/v1/cases', () => {
  beforeEach(() => {
    createMystery.mockReset();
    createMystery.mockResolvedValue({ caseId: 'case-123', title: 'The Quiet Archive', status: 'ready', summary: 'A ledger disappeared.' });
  });

  it('generates a case and completes the request with HTTP 201', async () => {
    const response = await supertest(app).post('/api/v1/cases').send({ scenario: 'A valuable ledger vanished from a locked archive during a private evening event.', difficulty: 'medium', category: 'theft', suspectCount: 4, evidenceRichness: 'standard' });
    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({ success: true, data: { caseId: 'case-123', status: 'ready' } });
    expect(createMystery).toHaveBeenCalledOnce();
  });

  it('rejects invalid scenarios without calling the generator', async () => {
    const response = await supertest(app).post('/api/v1/cases').send({ scenario: 'too short' });
    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ success: false, error: { code: 'INVALID_INPUT' } });
    expect(createMystery).not.toHaveBeenCalled();
  });
});
