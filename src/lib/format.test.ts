import { describe, expect, it } from 'vitest';
import { formatKg, formatSignedKg, toDateTimeLocalValue } from './format';

describe('format helpers', () => {
  it('formats kilograms and preserves zero', () => {
    expect(formatKg(0)).toBe('0 kg');
    expect(formatKg(4802.5)).toBe('4,802.5 kg');
    expect(formatKg(undefined)).toBe('—');
  });

  it('formats signed variance values', () => {
    expect(formatSignedKg(8.2)).toBe('+8.2 kg');
    expect(formatSignedKg(-8.2)).toBe('-8.2 kg');
    expect(formatSignedKg(0)).toBe('0 kg');
    expect(formatSignedKg(undefined)).toBe('—');
  });

  it('produces a datetime-local value without seconds', () => {
    const value = toDateTimeLocalValue(new Date(2026, 4, 20, 10, 5, 0));
    expect(value).toBe('2026-05-20T10:05');
  });
});
