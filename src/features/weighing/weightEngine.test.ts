import { describe, expect, it } from 'vitest';
import {
  SoftwareStabilityTracker,
  calculateWeightDiscrepancy,
  convertWeightToKg,
  parseScalePacket,
} from './weightEngine';

describe('SOP 4.1.8 weight discrepancy rules', () => {
  it('treats 103 kg vs 100 kg reference as WITHIN_THRESHOLD', () => {
    const res = calculateWeightDiscrepancy(103, 100);
    expect(res.differenceKg).toBe(3);
    expect(res.exceedsThreshold).toBe(false);
    expect(res.status).toBe('WITHIN_THRESHOLD');
  });

  it('treats exactly +5 kg (105 vs 100) as WITHIN_THRESHOLD under strict >5 kg rule', () => {
    const res = calculateWeightDiscrepancy(105, 100);
    expect(res.differenceKg).toBe(5);
    expect(res.exceedsThreshold).toBe(false);
    expect(res.status).toBe('WITHIN_THRESHOLD');
  });

  it('treats exactly -5 kg (95 vs 100) as WITHIN_THRESHOLD', () => {
    const res = calculateWeightDiscrepancy(95, 100);
    expect(res.differenceKg).toBe(-5);
    expect(res.exceedsThreshold).toBe(false);
    expect(res.status).toBe('WITHIN_THRESHOLD');
  });

  it('flags 105.1 kg vs 100 kg reference as DISCREPANCY', () => {
    const res = calculateWeightDiscrepancy(105.1, 100);
    expect(res.differenceKg).toBe(5.1);
    expect(res.exceedsThreshold).toBe(true);
    expect(res.status).toBe('DISCREPANCY');
  });

  it('flags 94.9 kg vs 100 kg reference as DISCREPANCY', () => {
    const res = calculateWeightDiscrepancy(94.9, 100);
    expect(res.differenceKg).toBe(-5.1);
    expect(res.exceedsThreshold).toBe(true);
    expect(res.status).toBe('DISCREPANCY');
  });
});

describe('Scale packet parser & unit conversion', () => {
  it('parses Casio-style stable, unstable, zero, negative, and decimal packets', () => {
    const heavy = parseScalePacket('ST,GS,+1254.20 kg');
    expect(heavy.valid).toBe(true);
    expect(heavy.weightKg).toBe(1254.2);
    expect(heavy.deviceStable).toBe(true);

    const zero = parseScalePacket('ST,GS,0.00 kg');
    expect(zero.valid).toBe(true);
    expect(zero.weightKg).toBe(0);

    const dec = parseScalePacket('ST,GS,+0024.60 kg');
    expect(dec.valid).toBe(true);
    expect(dec.weightKg).toBe(24.6);

    const neg = parseScalePacket('US,NT,-0002.40 kg');
    expect(neg.valid).toBe(true);
    expect(neg.weightKg).toBe(-2.4);
    expect(neg.deviceStable).toBe(false);
  });

  it('detects overload and malformed packets', () => {
    const ov = parseScalePacket('OL,GS,+9999.99 kg');
    expect(ov.valid).toBe(false);
    expect(ov.overload).toBe(true);

    const bad = parseScalePacket('??GARBAGE#12');
    expect(bad.valid).toBe(false);
    expect(bad.overload).toBe(false);
  });

  it('normalizes grams and pounds into kilograms', () => {
    expect(convertWeightToKg(24600, 'g')).toBe(24.6);
    expect(convertWeightToKg(1, 't')).toBe(1000);
    expect(convertWeightToKg(100, 'lb')).toBeCloseTo(45.3592, 4);
  });
});

describe('SoftwareStabilityTracker', () => {
  it('requires window size, tolerance, and duration before marking stable', () => {
    const tracker = new SoftwareStabilityTracker(4, 0.05, 1000);
    expect(tracker.push(100.0, 0)).toBe(false);
    expect(tracker.push(100.01, 400)).toBe(false);
    expect(tracker.push(100.02, 800)).toBe(false);
    expect(tracker.push(100.01, 1200)).toBe(true);

    // Spike breaks stability immediately
    expect(tracker.push(100.5, 1500)).toBe(false);
  });
});

