import type { WeightDiscrepancyResult } from './types';

export const DEFAULT_WEIGHT_THRESHOLD_KG = 5;

const UNIT_FACTORS_TO_KG: Record<string, number> = {
  kg: 1,
  kgs: 1,
  g: 0.001,
  gm: 0.001,
  gms: 0.001,
  lb: 0.45359237,
  lbs: 0.45359237,
  t: 1000,
  ton: 1000,
  mt: 1000,
};

export function normalizeWeightUnit(unit: string | null | undefined): string {
  if (!unit) return 'kg';
  const lowered = unit.trim().toLowerCase();
  if (lowered === 'kgs') return 'kg';
  if (lowered === 'gm' || lowered === 'gms') return 'g';
  if (lowered === 'lbs') return 'lb';
  if (lowered === 'ton' || lowered === 'mt') return 't';
  return lowered;
}

export function convertWeightToKg(value: number, unit: string): number {
  const norm = normalizeWeightUnit(unit);
  const factor = UNIT_FACTORS_TO_KG[norm];
  if (factor === undefined) {
    throw new Error(`Unsupported weight unit: ${unit}`);
  }
  return Number((value * factor).toFixed(4));
}

/**
 * SOP Section 4.1.8:
 * difference = actual_weight - reference_weight
 * Escalation condition: ABS(difference) > 5.0 kg (strictly greater than threshold).
 */
export function calculateWeightDiscrepancy(
  actualWeightKg: number,
  referenceWeightKg: number,
  thresholdKg: number = DEFAULT_WEIGHT_THRESHOLD_KG
): WeightDiscrepancyResult {
  const differenceKg = Number((actualWeightKg - referenceWeightKg).toFixed(4));
  const absDifferenceKg = Number(Math.abs(differenceKg).toFixed(4));
  const exceedsThreshold = absDifferenceKg > thresholdKg;

  return {
    actualWeightKg,
    referenceWeightKg,
    differenceKg,
    absDifferenceKg,
    thresholdKg,
    status: exceedsThreshold ? 'DISCREPANCY' : 'WITHIN_THRESHOLD',
    exceedsThreshold,
  };
}

export interface ParsedScalePacket {
  valid: boolean;
  raw: string;
  weightKg: number | null;
  rawWeight: number | null;
  rawUnit: string;
  deviceStable: boolean | null;
  overload: boolean;
  error?: string;
}

const STATUS_PREFIX_RE =
  /^(?<status>ST|US|OL|OK|GS|NT|TR|M\+)(?:[\s,;:]+(?<substatus>GS|NT|TR|ST|US|OL))?[\s,;:]+/i;
const OVERLOAD_RE = /\b(OL|OVER|OVERLOAD|ERR|EEEE|-----|\+\+\+\+\+)\b/i;
const VALUE_UNIT_RE =
  /(?<sign>[+-])?\s*(?<num>\d+(?:\.\d+)?)\s*(?<unit>kgs?|gms?|g|lbs?|lb|mt|ton|t)?\b/i;

export function parseScalePacket(packet: string): ParsedScalePacket {
  const cleaned = packet.replace(/[\x00\x02\x03\r\n]/g, '').trim();
  if (!cleaned) {
    return {
      valid: false,
      raw: packet,
      weightKg: null,
      rawWeight: null,
      rawUnit: 'kg',
      deviceStable: null,
      overload: false,
      error: 'Empty packet',
    };
  }

  let deviceStable: boolean | null = null;
  let working = cleaned;

  const prefixMatch = STATUS_PREFIX_RE.exec(working);
  if (prefixMatch?.groups) {
    const tokens = new Set(
      [prefixMatch.groups.status, prefixMatch.groups.substatus]
        .filter(Boolean)
        .map((t) => t.toUpperCase())
    );
    if (tokens.has('OL')) {
      return {
        valid: false,
        raw: cleaned,
        weightKg: null,
        rawWeight: null,
        rawUnit: 'kg',
        deviceStable: false,
        overload: true,
        error: 'Scale overload',
      };
    }
    if (tokens.has('ST') || tokens.has('OK')) {
      deviceStable = true;
    } else if (tokens.has('US')) {
      deviceStable = false;
    }
    working = working.slice(prefixMatch[0].length).trim();
  }

  if (OVERLOAD_RE.test(cleaned)) {
    return {
      valid: false,
      raw: cleaned,
      weightKg: null,
      rawWeight: null,
      rawUnit: 'kg',
      deviceStable: false,
      overload: true,
      error: 'Scale overload',
    };
  }

  if (deviceStable === null) {
    const flagMatch = /^(S|STABLE|U|UNSTABLE)\s+/i.exec(working);
    if (flagMatch) {
      const flag = flagMatch[1].toUpperCase();
      deviceStable = flag === 'S' || flag === 'STABLE';
      working = working.slice(flagMatch[0].length).trim();
    }
  }

  const valueMatch = VALUE_UNIT_RE.exec(working);
  if (!valueMatch?.groups) {
    return {
      valid: false,
      raw: cleaned,
      weightKg: null,
      rawWeight: null,
      rawUnit: 'kg',
      deviceStable: null,
      overload: false,
      error: 'Malformed packet: no numeric reading',
    };
  }

  const remainder = (
    working.slice(0, valueMatch.index) +
    working.slice(valueMatch.index + valueMatch[0].length)
  )
    .replace(/[,;]/g, '')
    .trim();

  if (remainder && !/^(NET|GROSS|N|G|WT|W)$/i.test(remainder)) {
    return {
      valid: false,
      raw: cleaned,
      weightKg: null,
      rawWeight: null,
      rawUnit: 'kg',
      deviceStable: null,
      overload: false,
      error: `Malformed packet: unexpected token '${remainder}'`,
    };
  }

  const sign = valueMatch.groups.sign === '-' ? -1 : 1;
  const rawWeight = Number((sign * Number(valueMatch.groups.num)).toFixed(4));
  const rawUnit = normalizeWeightUnit(valueMatch.groups.unit);

  try {
    const weightKg = convertWeightToKg(rawWeight, rawUnit);
    return {
      valid: true,
      raw: cleaned,
      weightKg,
      rawWeight,
      rawUnit,
      deviceStable,
      overload: false,
    };
  } catch (err) {
    return {
      valid: false,
      raw: cleaned,
      weightKg: null,
      rawWeight: null,
      rawUnit,
      deviceStable: null,
      overload: false,
      error: err instanceof Error ? err.message : 'Unsupported unit',
    };
  }
}

export class SoftwareStabilityTracker {
  private readonly samples: Array<{ tsMs: number; weightKg: number }> = [];
  private readonly windowSize: number;
  private readonly toleranceKg: number;
  private readonly minDurationMs: number;

  constructor(
    windowSize: number = 5,
    toleranceKg: number = 0.05,
    minDurationMs: number = 1200
  ) {
    this.windowSize = Math.max(2, windowSize);
    this.toleranceKg = Math.max(0, toleranceKg);
    this.minDurationMs = Math.max(0, minDurationMs);
  }

  reset(): void {
    this.samples.length = 0;
  }

  push(weightKg: number, tsMs: number = Date.now()): boolean {
    this.samples.push({ tsMs, weightKg });
    if (this.samples.length > this.windowSize) {
      this.samples.shift();
    }
    if (this.samples.length < this.windowSize) {
      return false;
    }
    const weights = this.samples.map((s) => s.weightKg);
    const span = Math.max(...weights) - Math.min(...weights);
    const elapsed = this.samples[this.samples.length - 1].tsMs - this.samples[0].tsMs;
    return span <= this.toleranceKg && elapsed >= this.minDurationMs;
  }
}

