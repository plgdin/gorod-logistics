export type CargoType = 'air' | 'sea';

export type ContainerSize = '20ft' | '40ft';

export type HandlingType = 'manual' | 'mechanical';

export interface AirCargoTariffConfig {
  effectiveDate: string;
  sourceDocument: string;
  location: string;
  currency: string;
  rates: {
    bonding: {
      minimumCharge: number;
      ratePerKg: number;
      unit: string;
      description: string;
    };
    debonding: {
      minimumCharge: number;
      ratePerKg: number;
      unit: string;
      description: string;
    };
    handling: {
      minimumCharge: number;
      ratePerKg: number;
      unit: string;
      description: string;
    };
    partDelivery: {
      minimumCharge: number;
      ratePerKg: number;
      unit: string;
      description: string;
    };
    storage: {
      minimumCharge: number;
      ratePerKgPerWeek: number;
      unit: string;
      minimumDurationWeeks: number;
      description: string;
    };
    specialCargoSurchargePercent: number; // 30% for valuable / hazardous / temperature-sensitive
  };
  insuranceNote: {
    publishedWording: string;
    cargoValueDefinition: string;
    minimumPeriodWeeks: number;
    flaggedStatus: 'REQUIRES_BUSINESS_CONFIRMATION';
    warningMessage: string;
  };
  onDemandServices: string[];
  terms: string[];
}

export interface SeaCargoTariffConfig {
  effectiveDate: string;
  sourceDocument: string;
  location: string;
  currency: string;
  rates: {
    coveredStorage: {
      ratePerSqMeterPerWeek: number;
      minimumDurationWeeks: number;
      unit: string;
      description: string;
    };
    containerMinimums: {
      '20ft': {
        areaSqMeters: number;
        description: string;
      };
      '40ft': {
        areaSqMeters: number;
        description: string;
      };
    };
    handling: {
      '20ft': {
        manual: number;
        mechanical: number;
      };
      '40ft': {
        manual: number;
        mechanical: number;
      };
      equipmentDescription: string;
    };
    partDelivery: {
      manual: number;
      mechanical: number;
      unit: string;
      description: string;
    };
    documentation: {
      ratePerConsignment: number;
      unit: string;
      description: string;
    };
  };
  insuranceNote: {
    publishedWording: string;
    cargoValueDefinition: string;
    minimumPeriodWeeks: number;
    flaggedStatus: 'REQUIRES_BUSINESS_CONFIRMATION';
    warningMessage: string;
  };
  onDemandServices: string[];
  terms: string[];
}

export interface TariffsData {
  airCargo: AirCargoTariffConfig;
  seaCargo: SeaCargoTariffConfig;
  generalTerms: string[];
}
