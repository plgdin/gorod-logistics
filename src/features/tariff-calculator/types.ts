import { ContainerSize, HandlingType } from '../../types';

export interface AirCargoCalculationInput {
  weightKg: number;
  durationUnit: 'days' | 'weeks';
  durationValue: number;
  includeBonding: boolean;
  includeDebonding: boolean;
  includeHandling: boolean;
  includePartDelivery: boolean;
  isSpecialCargo: boolean;
}

export interface CalculationLineItem {
  name: string;
  category: 'bonding' | 'debonding' | 'handling' | 'storage' | 'partDelivery' | 'documentation' | 'surcharge';
  description: string;
  unitRateDisplay: string;
  calculatedAmount: number;
  isMinimumApplied: boolean;
  minimumCharge?: number;
}

export interface AirCargoCalculationResult {
  chargeableWeightKg: number;
  inputDurationValue: number;
  inputDurationUnit: 'days' | 'weeks';
  chargeableWeeks: number;
  lineItems: CalculationLineItem[];
  subtotal: number;
  specialCargoSurcharge: number;
  totalEstimated: number;
  currency: string;
  isSpecialCargo: boolean;
  disclaimers: string[];
}

export interface SeaCargoCalculationInput {
  containerSize: ContainerSize;
  areaSqMeters: number;
  durationWeeks: number;
  handlingType: HandlingType;
  includePartDelivery: boolean;
  partDeliveryHandlingType?: HandlingType;
  includeDocumentation: boolean;
}

export interface SeaCargoCalculationResult {
  containerSize: ContainerSize;
  inputAreaSqMeters: number;
  chargeableAreaSqMeters: number;
  inputDurationWeeks: number;
  chargeableDurationWeeks: number;
  lineItems: CalculationLineItem[];
  subtotal: number;
  totalEstimated: number;
  currency: string;
  disclaimers: string[];
}
