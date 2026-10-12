import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getStoredAuth, verifyMagicLink, findLearnerInRoster } from '../src/utils/auth';

class MockStorage {
  private store: Record<string, string> = {};
  getItem(key: string) { return this.store[key] || null; }
  setItem(key: string, value: string) { this.store[key] = String(value); }
  removeItem(key: string) { delete this.store[key]; }
  clear() { this.store = {}; }
}

describe('TKI Auth Security & Verification Guard Tests', () => {
  beforeEach(() => {
    const mockLocal = new MockStorage();
    const mockSession = new MockStorage();
    (globalThis as any).localStorage = mockLocal;
    (globalThis as any).sessionStorage = mockSession;
    (globalThis as any).window = {
      location: new URL('http://localhost:5175/'),
      localStorage: mockLocal,
      sessionStorage: mockSession
    };
    vi.restoreAllMocks();
  });

  it('V-03 Fix: getStoredAuth should NOT automatically grant verified status via source=lms query param', () => {
    (globalThis as any).window.location = new URL('http://localhost:5175/?email=victim@example.com&source=lms');

    const auth = getStoredAuth();
    expect(auth).toBeNull();
    expect(globalThis.localStorage.getItem('dhm_user_auth')).toBeNull();
  });

  it('V-07 Fix: verifyMagicLink must be Fail-Closed when network error happens', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network connection timeout'));

    const res = await verifyMagicLink('invalid-or-timeout-token', 'victim@example.com');
    expect(res.success).toBe(false);
    expect(res.verified).toBe(false);
    expect(res.error).toBe('NETWORK_ERROR');
    expect(res.user).toBeUndefined();
  });

  it('V-01 Fix: findLearnerInRoster should only match anonymous mock data and reject leaked PII', () => {
    const mockRoster = [
      {
        name: 'Học viên Thử nghiệm 01',
        email: 'demo.learner01@example.com',
        phone: '0900000001',
        cohort: 'DHM - Demo',
        role: 'Learner'
      }
    ];

    const match = findLearnerInRoster('demo.learner01@example.com', mockRoster);
    expect(match).not.toBeNull();
    expect(match?.full_name).toBe('Học viên Thử nghiệm 01');

    // Real PII learner should NOT match against mock roster
    const realVictim = findLearnerInRoster('chauhm71@gmail.com', mockRoster);
    expect(realVictim).toBeNull();
  });

  it('Valid local session should be retrieved properly without regressions', () => {
    const validAuth = {
      full_name: 'Nguyen Van A',
      phone: '0901234567',
      email: 'user@example.com',
      status: 'verified',
      expires_at: new Date(Date.now() + 86400000).toISOString()
    };
    globalThis.localStorage.setItem('dhm_user_auth', JSON.stringify(validAuth));
    const auth = getStoredAuth();
    expect(auth).not.toBeNull();
    expect(auth?.email).toBe('user@example.com');
  });
});
