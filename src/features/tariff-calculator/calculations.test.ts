import { describe, it, expect } from 'vitest';
import { calculateAirCargoTariff, calculateSeaCargoTariff, formatINR } from './calculations';

describe('Tariff Calculation Engine', () => {
  describe('formatINR', () => {
    it('formats Indian rupees properly with commas', () => {
      const formatted = formatINR(100000);
      expect(formatted).toContain('1,00,000');
    });

    it('handles zero and NaN safely', () => {
      expect(formatINR(0)).toBe('₹0');
      expect(formatINR(NaN)).toBe('₹0');
    });
  });

  describe('Air Cargo Calculations', () => {
    it('enforces 8 days as 2 chargeable weeks (ceiling rounding)', () => {
      const result = calculateAirCargoTariff({
        weightKg: 500,
        durationUnit: 'days',
        durationValue: 8,
        includeBonding: true,
        includeDebonding: false,
        includeHandling: true,
        includePartDelivery: false,
        isSpecialCargo: false,
      });

      expect(result.chargeableWeeks).toBe(2);
      // Storage: 500kg * ₹4/kg/week * 2 weeks = ₹4,000 (> min ₹1,000)
      const storageItem = result.lineItems.find((i) => i.category === 'storage');
      expect(storageItem?.calculatedAmount).toBe(4000);
    });

    it('enforces minimum consignment charges for small consignments', () => {
      const result = calculateAirCargoTariff({
        weightKg: 50, // Small consignment
        durationUnit: 'weeks',
        durationValue: 1,
        includeBonding: true,
        includeDebonding: true,
        includeHandling: true,
        includePartDelivery: true,
        isSpecialCargo: false,
      });

      // Bonding: 50 * 1 = 50 -> min 1000
      const bonding = result.lineItems.find((i) => i.category === 'bonding');
      expect(bonding?.calculatedAmount).toBe(1000);
      expect(bonding?.isMinimumApplied).toBe(true);

      // Debonding: 50 * 1 = 50 -> min 1000
      const debonding = result.lineItems.find((i) => i.category === 'debonding');
      expect(debonding?.calculatedAmount).toBe(1000);
      expect(debonding?.isMinimumApplied).toBe(true);

      // Handling: 50 * 4 = 200 -> min 1000
      const handling = result.lineItems.find((i) => i.category === 'handling');
      expect(handling?.calculatedAmount).toBe(1000);
      expect(handling?.isMinimumApplied).toBe(true);

      // Part delivery: 50 * 2 = 100 -> min 500
      const partDelivery = result.lineItems.find((i) => i.category === 'partDelivery');
      expect(partDelivery?.calculatedAmount).toBe(500);
      expect(partDelivery?.isMinimumApplied).toBe(true);

      // Storage: 50 * 4 * 1 = 200 -> min 1000
      const storage = result.lineItems.find((i) => i.category === 'storage');
      expect(storage?.calculatedAmount).toBe(1000);
      expect(storage?.isMinimumApplied).toBe(true);

      // Total: 1000 + 1000 + 1000 + 500 + 1000 = 4500
      expect(result.totalEstimated).toBe(4500);
    });

    it('applies 30% special cargo surcharge correctly', () => {
      const standardResult = calculateAirCargoTariff({
        weightKg: 1000,
        durationUnit: 'weeks',
        durationValue: 1,
        includeBonding: true,
        includeDebonding: false,
        includeHandling: true,
        includePartDelivery: false,
        isSpecialCargo: false,
      });

      const specialResult = calculateAirCargoTariff({
        weightKg: 1000,
        durationUnit: 'weeks',
        durationValue: 1,
        includeBonding: true,
        includeDebonding: false,
        includeHandling: true,
        includePartDelivery: false,
        isSpecialCargo: true,
      });

      const surcharge = Math.round((standardResult.subtotal * 30) / 100);
      expect(specialResult.specialCargoSurcharge).toBe(surcharge);
      expect(specialResult.totalEstimated).toBe(standardResult.subtotal + surcharge);
    });
  });

  describe('Sea Cargo Calculations', () => {
    it('enforces 20ft container minimum 20m² and 4-week minimum', () => {
      const result = calculateSeaCargoTariff({
        containerSize: '20ft',
        areaSqMeters: 10, // Below 20m² minimum
        durationWeeks: 2, // Below 4-week minimum
        handlingType: 'manual',
        includePartDelivery: false,
        includeDocumentation: true,
      });

      expect(result.chargeableAreaSqMeters).toBe(20);
      expect(result.chargeableDurationWeeks).toBe(4);

      // Storage: 20m² * ₹150 * 4 weeks = ₹12,000
      const storage = result.lineItems.find((i) => i.category === 'storage');
      expect(storage?.calculatedAmount).toBe(12000);

      // Manual handling 20ft: ₹2,500
      const handling = result.lineItems.find((i) => i.category === 'handling');
      expect(handling?.calculatedAmount).toBe(2500);

      // Documentation: ₹2,500
      const doc = result.lineItems.find((i) => i.category === 'documentation');
      expect(doc?.calculatedAmount).toBe(2500);

      expect(result.totalEstimated).toBe(12000 + 2500 + 2500);
    });

    it('calculates 40ft container with mechanical handling and part delivery', () => {
      const result = calculateSeaCargoTariff({
        containerSize: '40ft',
        areaSqMeters: 50,
        durationWeeks: 6,
        handlingType: 'mechanical',
        includePartDelivery: true,
        partDeliveryHandlingType: 'mechanical',
        includeDocumentation: true,
      });

      expect(result.chargeableAreaSqMeters).toBe(50);
      expect(result.chargeableDurationWeeks).toBe(6);

      // Storage: 50 * 150 * 6 = 45,000
      const storage = result.lineItems.find((i) => i.category === 'storage');
      expect(storage?.calculatedAmount).toBe(45000);

      // Mechanical handling 40ft (3 MT forklift): 5,000
      const handling = result.lineItems.find((i) => i.category === 'handling');
      expect(handling?.calculatedAmount).toBe(5000);

      // Mechanical part delivery: 750
      const part = result.lineItems.find((i) => i.category === 'partDelivery');
      expect(part?.calculatedAmount).toBe(750);

      // Documentation: 2500
      const doc = result.lineItems.find((i) => i.category === 'documentation');
      expect(doc?.calculatedAmount).toBe(2500);

      expect(result.totalEstimated).toBe(45000 + 5000 + 750 + 2500);
    });
  });
});
