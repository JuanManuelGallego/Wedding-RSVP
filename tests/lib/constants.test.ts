import { describe, it, expect } from 'vitest';
import { WEDDING_DATE, WEDDING_TIMESTAMP } from '@/lib/constants';

describe('constants', () => {
  it('WEDDING_DATE is a valid ISO date string', () => {
    const date = new Date(WEDDING_DATE);
    expect(date.toString()).not.toBe('Invalid Date');
  });

  it('WEDDING_TIMESTAMP matches WEDDING_DATE', () => {
    expect(WEDDING_TIMESTAMP).toBe(new Date(WEDDING_DATE).getTime());
  });

  it('wedding is in the future', () => {
    expect(WEDDING_TIMESTAMP).toBeGreaterThan(Date.now());
  });
});
