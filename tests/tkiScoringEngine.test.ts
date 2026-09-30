import { describe, it, expect } from 'vitest';
import { calculateTKIAssessment } from '../src/engine/tkiScoringEngine';
import { QUESTIONS_30 } from '../src/data/questions30';
import { UserProfile, TKIMode } from '../src/types/tki';

describe('TKI Scoring Engine Tests', () => {
  const mockProfile: UserProfile = {
    fullName: 'Nguyen Van A',
    email: 'nguyenvana@example.com',
    organizationOrRole: 'Team Lead',
    mode: 'cloud_sync',
  };

  const anonProfile: UserProfile = {
    fullName: 'Ẩn Danh',
    email: '',
    organizationOrRole: '',
    mode: 'local_anonymous',
  };

  it('should have exactly 30 questions', () => {
    expect(QUESTIONS_30.length).toBe(30);
  });

  it('each question should have both Option A and Option B', () => {
    QUESTIONS_30.forEach((q) => {
      expect(q.options.A).toBeDefined();
      expect(q.options.B).toBeDefined();
      expect(q.options.A.text.length).toBeGreaterThan(10);
      expect(q.options.B.text.length).toBeGreaterThan(10);
      expect(q.options.A.mode).toBeDefined();
      expect(q.options.B.mode).toBeDefined();
    });
  });

  it('each mode should appear exactly 12 times across all 30 questions (6 in A, 6 in B)', () => {
    const counts: Record<TKIMode, number> = {
      competing: 0,
      collaborating: 0,
      compromising: 0,
      avoiding: 0,
      accommodating: 0,
    };

    const aCounts: Record<TKIMode, number> = {
      competing: 0,
      collaborating: 0,
      compromising: 0,
      avoiding: 0,
      accommodating: 0,
    };

    const bCounts: Record<TKIMode, number> = {
      competing: 0,
      collaborating: 0,
      compromising: 0,
      avoiding: 0,
      accommodating: 0,
    };

    QUESTIONS_30.forEach((q) => {
      counts[q.options.A.mode] += 1;
      counts[q.options.B.mode] += 1;
      aCounts[q.options.A.mode] += 1;
      bCounts[q.options.B.mode] += 1;
    });

    (['competing', 'collaborating', 'compromising', 'avoiding', 'accommodating'] as TKIMode[]).forEach((m) => {
      expect(counts[m]).toBe(12);
      expect(aCounts[m]).toBe(6);
      expect(bCounts[m]).toBe(6);
    });
  });

  it('should calculate balanced scores when all A options are chosen', () => {
    const allA: Record<number, 'A' | 'B'> = {};
    for (let i = 1; i <= 30; i++) allA[i] = 'A';

    const result = calculateTKIAssessment(allA, anonProfile);
    expect(result.totalScore).toBe(30);

    // Each mode gets 6 points
    (['competing', 'collaborating', 'compromising', 'avoiding', 'accommodating'] as TKIMode[]).forEach((m) => {
      expect(result.scores[m].rawScore).toBe(6);
      expect(result.scores[m].maxScore).toBe(12);
      expect(result.scores[m].percentage).toBe(20);
    });

    // Collaborating score of 6 is medium (6 - 9)
    expect(result.scores.collaborating.percentileLevel).toBe('medium');
    // Accommodating score of 6 is medium (3 - 7)
    expect(result.scores.accommodating.percentileLevel).toBe('medium');
  });

  it('should identify high percentile for Collaborating when score >= 10', () => {
    // Select Collaborating whenever available
    const customAnswers: Record<number, 'A' | 'B'> = {};
    QUESTIONS_30.forEach((q) => {
      if (q.options.A.mode === 'collaborating') {
        customAnswers[q.id] = 'A';
      } else if (q.options.B.mode === 'collaborating') {
        customAnswers[q.id] = 'B';
      } else {
        customAnswers[q.id] = 'A';
      }
    });

    const result = calculateTKIAssessment(customAnswers, mockProfile);
    expect(result.scores.collaborating.rawScore).toBe(12);
    expect(result.scores.collaborating.percentileLevel).toBe('high');
    expect(result.overusedModes).toContain('collaborating');
    expect(result.dominantMode).toBe('collaborating');
    expect(result.totalScore).toBe(30);
  });

  it('should calculate matrix 2D coordinates within [0, 100]', () => {
    const allA: Record<number, 'A' | 'B'> = {};
    for (let i = 1; i <= 30; i++) allA[i] = 'A';

    const result = calculateTKIAssessment(allA, anonProfile);
    expect(result.matrixCoords.assertiveness).toBeGreaterThanOrEqual(0);
    expect(result.matrixCoords.assertiveness).toBeLessThanOrEqual(100);
    expect(result.matrixCoords.cooperativeness).toBeGreaterThanOrEqual(0);
    expect(result.matrixCoords.cooperativeness).toBeLessThanOrEqual(100);
  });
});
