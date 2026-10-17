import { TARIFFS } from '../../data/tariffs';
import {
  AirCargoCalculationInput,
  AirCargoCalculationResult,
  CalculationLineItem,
  SeaCargoCalculationInput,
  SeaCargoCalculationResult,
} from './types';

/**
 * Format any numerical currency value according to Indian numbering standards (e.g. ₹1,25,000)
 */
export function formatINR(value: number): string {
  if (isNaN(value) || !isFinite(value)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

/**
 * Air Cargo Tariff Calculation Engine
 * 
 * Rules:
 * 1. Storage days are converted to weeks using ceiling rounding:
 *    ceil(days / 7). For example, 8 days = 2 chargeable weeks.
 * 2. Minimum storage period is 1 week.
 * 3. Consignment minimums applied per service:
 *    - Bonding: ₹1,000 min, ₹1/kg
 *    - Debonding: ₹1,000 min, ₹1/kg
 *    - Inward/Outward Handling: ₹1,000 min, ₹4/kg
 *    - Part Delivery: ₹500 min, ₹2/kg
 *    - Storage: ₹1,000 min, ₹4/kg/week
 * 4. Special cargo: 30% surcharge on total services if applicable.
 * 5. Insurance: Excluded because source wording is ambiguous ("INR 0.20 Paise/1000 INR").
 */
export function calculateAirCargoTariff(input: AirCargoCalculationInput): AirCargoCalculationResult {
  const safeWeight = Math.max(0, isNaN(input.weightKg) ? 0 : input.weightKg);

  // Storage duration calculation:
  // Convert days to weeks using ceiling rounding per business rules (e.g. 8 days -> 2 weeks)
  let chargeableWeeks = 1;
  const rawDuration = Math.max(0, isNaN(input.durationValue) ? 0 : input.durationValue);

  if (input.durationUnit === 'days') {
    chargeableWeeks = rawDuration === 0 ? 1 : Math.ceil(rawDuration / 7);
  } else {
    chargeableWeeks = Math.max(1, Math.ceil(rawDuration));
  }
  // Enforce published 1-week minimum
  chargeableWeeks = Math.max(TARIFFS.airCargo.rates.storage.minimumDurationWeeks, chargeableWeeks);

  const lineItems: CalculationLineItem[] = [];
  const rates = TARIFFS.airCargo.rates;

  // 1. Bonding (if selected)
  if (input.includeBonding && safeWeight > 0) {
    const rawCost = safeWeight * rates.bonding.ratePerKg;
    const finalCost = Math.max(rates.bonding.minimumCharge, rawCost);
    lineItems.push({
      name: 'Customs Bonding Formalities',
      category: 'bonding',
      description: rates.bonding.description,
      unitRateDisplay: `₹${rates.bonding.ratePerKg}/kg (Min ${formatINR(rates.bonding.minimumCharge)})`,
      calculatedAmount: finalCost,
      isMinimumApplied: finalCost > rawCost,
      minimumCharge: rates.bonding.minimumCharge,
    });
  }

  // 2. Inward/Outward Handling (if selected)
  if (input.includeHandling && safeWeight > 0) {
    const rawCost = safeWeight * rates.handling.ratePerKg;
    const finalCost = Math.max(rates.handling.minimumCharge, rawCost);
    lineItems.push({
      name: 'Inward & Outward Handling',
      category: 'handling',
      description: rates.handling.description,
      unitRateDisplay: `₹${rates.handling.ratePerKg}/kg (Min ${formatINR(rates.handling.minimumCharge)})`,
      calculatedAmount: finalCost,
      isMinimumApplied: finalCost > rawCost,
      minimumCharge: rates.handling.minimumCharge,
    });
  }

  // 3. Storage
  if (safeWeight > 0) {
    const rawCost = safeWeight * rates.storage.ratePerKgPerWeek * chargeableWeeks;
    const finalCost = Math.max(rates.storage.minimumCharge, rawCost);
    lineItems.push({
      name: `Bonded Storage (${chargeableWeeks} ${chargeableWeeks === 1 ? 'Week' : 'Weeks'})`,
      category: 'storage',
      description: `${rates.storage.description} (${safeWeight} kg × ₹${rates.storage.ratePerKgPerWeek}/kg/wk × ${chargeableWeeks} wk)`,
      unitRateDisplay: `₹${rates.storage.ratePerKgPerWeek}/kg/week (Min ${formatINR(rates.storage.minimumCharge)})`,
      calculatedAmount: finalCost,
      isMinimumApplied: finalCost > rawCost,
      minimumCharge: rates.storage.minimumCharge,
    });
  }

  // 4. De-bonding (if selected)
  if (input.includeDebonding && safeWeight > 0) {
    const rawCost = safeWeight * rates.debonding.ratePerKg;
    const finalCost = Math.max(rates.debonding.minimumCharge, rawCost);
    lineItems.push({
      name: 'De-Bonding Clearance',
      category: 'debonding',
      description: rates.debonding.description,
      unitRateDisplay: `₹${rates.debonding.ratePerKg}/kg (Min ${formatINR(rates.debonding.minimumCharge)})`,
      calculatedAmount: finalCost,
      isMinimumApplied: finalCost > rawCost,
      minimumCharge: rates.debonding.minimumCharge,
    });
  }

  // 5. Part Delivery (if selected)
  if (input.includePartDelivery && safeWeight > 0) {
    const rawCost = safeWeight * rates.partDelivery.ratePerKg;
    const finalCost = Math.max(rates.partDelivery.minimumCharge, rawCost);
    lineItems.push({
      name: 'Part Delivery Segregation & Handling',
      category: 'partDelivery',
      description: rates.partDelivery.description,
      unitRateDisplay: `₹${rates.partDelivery.ratePerKg}/kg (Min ${formatINR(rates.partDelivery.minimumCharge)})`,
      calculatedAmount: finalCost,
      isMinimumApplied: finalCost > rawCost,
      minimumCharge: rates.partDelivery.minimumCharge,
    });
  }

  const subtotal = lineItems.reduce((acc, item) => acc + item.calculatedAmount, 0);

  // 6. Special Cargo Surcharge (30% if applicable)
  let specialCargoSurcharge = 0;
  if (input.isSpecialCargo && subtotal > 0) {
    specialCargoSurcharge = Math.round((subtotal * rates.specialCargoSurchargePercent) / 100);
    lineItems.push({
      name: `Special Cargo Surcharge (${rates.specialCargoSurchargePercent}%)`,
      category: 'surcharge',
      description: 'Applicable to valuable, hazardous, perishables, or temperature-sensitive air cargo.',
      unitRateDisplay: `+${rates.specialCargoSurchargePercent}% on base tariff`,
      calculatedAmount: specialCargoSurcharge,
      isMinimumApplied: false,
    });
  }

  const totalEstimated = subtotal + specialCargoSurcharge;

  return {
    chargeableWeightKg: safeWeight,
    inputDurationValue: rawDuration,
    inputDurationUnit: input.durationUnit,
    chargeableWeeks,
    lineItems,
    subtotal,
    specialCargoSurcharge,
    totalEstimated,
    currency: 'INR',
    isSpecialCargo: input.isSpecialCargo,
    disclaimers: [
      'GST and other statutory government taxes are extra at prevailing rates.',
      'Insurance ("INR 0.20 Paise/1000 INR of Cargo Value") is excluded pending business clarification.',
      'Special handling, escort, customs overtime, and transportation are quoted on actuals.',
      'This calculation is an operational estimate and does not constitute a final binding invoice.',
    ],
  };
}

/**
 * Sea Cargo Tariff Calculation Engine
 * 
 * Rules:
 * 1. Covered storage rate: ₹150 per sq. metre per week.
 * 2. Minimum storage period: 4 consecutive weeks.
 * 3. Minimum booking area:
 *    - 20-foot container: 20 m²
 *    - 40-foot container: 40 m²
 * 4. Handling:
 *    - 20-ft manual: ₹2,500; mechanical (3 MT forklift): ₹4,000
 *    - 40-ft manual: ₹3,500; mechanical (3 MT forklift): ₹5,000
 * 5. Part delivery: Manual ₹500, Mechanical ₹750
 * 6. Documentation: ₹2,500 per consignment.
 * 7. Insurance: Excluded pending business clarification.
 */
export function calculateSeaCargoTariff(input: SeaCargoCalculationInput): SeaCargoCalculationResult {
  const rates = TARIFFS.seaCargo.rates;
  const containerMinArea = rates.containerMinimums[input.containerSize].areaSqMeters;

  const rawArea = Math.max(0, isNaN(input.areaSqMeters) ? 0 : input.areaSqMeters);
  const chargeableAreaSqMeters = Math.max(containerMinArea, rawArea);

  const rawWeeks = Math.max(0, isNaN(input.durationWeeks) ? 0 : input.durationWeeks);
  const chargeableDurationWeeks = Math.max(rates.coveredStorage.minimumDurationWeeks, Math.ceil(rawWeeks || 4));

  const lineItems: CalculationLineItem[] = [];

  // 1. Covered Storage
  const storageCost = chargeableAreaSqMeters * rates.coveredStorage.ratePerSqMeterPerWeek * chargeableDurationWeeks;
  lineItems.push({
    name: `Covered Bonded Storage (${chargeableAreaSqMeters} m² × ${chargeableDurationWeeks} wks)`,
    category: 'storage',
    description: `${rates.coveredStorage.description} (Min ${rates.coveredStorage.minimumDurationWeeks} weeks, Min ${containerMinArea} m² for ${input.containerSize})`,
    unitRateDisplay: `₹${rates.coveredStorage.ratePerSqMeterPerWeek}/m²/week`,
    calculatedAmount: storageCost,
    isMinimumApplied: chargeableAreaSqMeters > rawArea || chargeableDurationWeeks > rawWeeks,
  });

  // 2. Cargo Handling (Inward & Outward)
  const handlingCost = rates.handling[input.containerSize][input.handlingType];
  const handlingMethodLabel = input.handlingType === 'mechanical' ? 'Mechanical (3 MT Forklift)' : 'Manual Labor';
  lineItems.push({
    name: `Cargo Handling — ${handlingMethodLabel}`,
    category: 'handling',
    description: `${rates.handling.equipmentDescription} (${input.containerSize} container)`,
    unitRateDisplay: `₹${formatINR(handlingCost)} fixed`,
    calculatedAmount: handlingCost,
    isMinimumApplied: false,
  });

  // 3. Documentation (if selected)
  if (input.includeDocumentation) {
    const docCost = rates.documentation.ratePerConsignment;
    lineItems.push({
      name: 'Customs Bonded Documentation',
      category: 'documentation',
      description: rates.documentation.description,
      unitRateDisplay: `₹${formatINR(docCost)}/consignment`,
      calculatedAmount: docCost,
      isMinimumApplied: false,
    });
  }

  // 4. Part Delivery (if selected)
  if (input.includePartDelivery) {
    const partType = input.partDeliveryHandlingType || input.handlingType;
    const partCost = rates.partDelivery[partType];
    const partMethodLabel = partType === 'mechanical' ? 'Mechanical (Forklift)' : 'Manual Handover';
    lineItems.push({
      name: `Part Delivery Handover (${partMethodLabel})`,
      category: 'partDelivery',
      description: rates.partDelivery.description,
      unitRateDisplay: `₹${formatINR(partCost)}/operation`,
      calculatedAmount: partCost,
      isMinimumApplied: false,
    });
  }

  const subtotal = lineItems.reduce((acc, item) => acc + item.calculatedAmount, 0);

  return {
    containerSize: input.containerSize,
    inputAreaSqMeters: rawArea,
    chargeableAreaSqMeters,
    inputDurationWeeks: rawWeeks,
    chargeableDurationWeeks,
    lineItems,
    subtotal,
    totalEstimated: subtotal,
    currency: 'INR',
    disclaimers: [
      'Covered storage has a mandatory 4-week minimum billing period.',
      'GST and statutory government levies are extra at prevailing rates.',
      'Insurance ("INR 0.20 Paise/1000 INR") is excluded pending business confirmation of formula.',
      'Port haulage, crane operations (>3 MT), and bonded transportation are quoted separately on request.',
      'Estimates are indicative and subject to customs verification.',
    ],
  };
}
