import { TariffsData } from '../types';

export const TARIFFS: TariffsData = {
  airCargo: {
    effectiveDate: '1 May 2026',
    sourceDocument: 'Public Bonded Warehouse Tariff (Air Cargo)',
    location: 'Thiruvananthapuram, Kerala, India',
    currency: 'INR',
    rates: {
      bonding: {
        minimumCharge: 1000,
        ratePerKg: 1,
        unit: '₹ per kg (Min ₹1,000/consignment)',
        description: 'Customs bonding formalities and physical consignment intake into bonded warehouse custody.',
      },
      debonding: {
        minimumCharge: 1000,
        ratePerKg: 1,
        unit: '₹ per kg (Min ₹1,000/consignment)',
        description: 'Customs de-bonding procedures, verification, and ex-bond clearance processing.',
      },
      handling: {
        minimumCharge: 1000,
        ratePerKg: 4,
        unit: '₹ per kg (Min ₹1,000/consignment)',
        description: 'Comprehensive inward and outward physical cargo handling and staging.',
      },
      partDelivery: {
        minimumCharge: 500,
        ratePerKg: 2,
        unit: '₹ per kg (Min ₹500/consignment)',
        description: 'Segregation, customs re-inspection, and handover for partial consignment clearances.',
      },
      storage: {
        minimumCharge: 1000,
        ratePerKgPerWeek: 4,
        unit: '₹ per kg per week (Min ₹1,000/consignment)',
        minimumDurationWeeks: 1,
        description: 'Secure bonded storage with 24/7 surveillance and round-the-clock customs supervision.',
      },
      specialCargoSurchargePercent: 30,
    },
    insuranceNote: {
      publishedWording: 'INR 0.20 Paise/1000 INR of Cargo Value',
      cargoValueDefinition: 'Assessable Value + Applicable Customs Duty',
      minimumPeriodWeeks: 4,
      flaggedStatus: 'REQUIRES_BUSINESS_CONFIRMATION',
      warningMessage:
        'The published tariff text ("INR 0.20 Paise/1000 INR") is ambiguous regarding whether the rate is 0.20 Rupees or 0.20 Paise per ₹1,000. To prevent inaccurate billing, insurance charges are excluded from automatic estimates and will be computed manually upon business confirmation.',
    },
    onDemandServices: [
      'Bonded transportation & specialized container trucking',
      'Value-added services (palletization, strapping, shrink-wrapping, repacking)',
      'Temperature-monitored staging',
      'Customs overtime & designated escort handling',
    ],
    terms: [
      'Storage has a minimum chargeable duration of 1 (one) week.',
      'Partial weeks are rounded up to the next full week (e.g., 8 days of storage is billed as 2 weeks).',
      'Minimum consignment charges apply individually to bonding, debonding, handling, part delivery, and storage.',
      'Special cargo (valuable cargo, perishables, hazardous, or temperature-sensitive goods) may attract a 30% surcharge.',
      'GST and other statutory taxes are applicable extra at prevailing government rates.',
      'Customers are responsible for appropriate cargo insurance unless official coverage is separately arranged and verified in writing.',
      'All warehouse operations comply with Indian Customs Act and CBIC bonded warehousing regulations.',
    ],
  },

  seaCargo: {
    effectiveDate: '1 May 2026',
    sourceDocument: 'Public Bonded Warehouse Tariff (Sea Cargo)',
    location: 'Thiruvananthapuram, Kerala, India',
    currency: 'INR',
    rates: {
      coveredStorage: {
        ratePerSqMeterPerWeek: 150,
        minimumDurationWeeks: 4,
        unit: '₹150 per sq. metre per week',
        description: 'Weatherproof covered bonded floor and bay storage with industrial high-load flooring.',
      },
      containerMinimums: {
        '20ft': {
          areaSqMeters: 20,
          description: 'Standard 20-foot container booking requires a minimum chargeable area of 20 m².',
        },
        '40ft': {
          areaSqMeters: 40,
          description: 'Standard 40-foot container booking requires a minimum chargeable area of 40 m².',
        },
      },
      handling: {
        '20ft': {
          manual: 2500,
          mechanical: 4000,
        },
        '40ft': {
          manual: 3500,
          mechanical: 5000,
        },
        equipmentDescription: 'Mechanical handling performed using dedicated 3 MT industrial forklifts.',
      },
      partDelivery: {
        manual: 500,
        mechanical: 750,
        unit: '₹ per consignment / operation',
        description: 'Handover fee for partial unstuffing, physical segregation, and gate-out clearance.',
      },
      documentation: {
        ratePerConsignment: 2500,
        unit: '₹ per consignment',
        description: 'Customs bonded ledger maintenance, bond registry documentation, and compliance filings.',
      },
    },
    insuranceNote: {
      publishedWording: 'INR 0.20 Paise/1000 INR of Cargo Value',
      cargoValueDefinition: 'Assessable Value + Applicable Customs Duty',
      minimumPeriodWeeks: 4,
      flaggedStatus: 'REQUIRES_BUSINESS_CONFIRMATION',
      warningMessage:
        'The published tariff text specifies "INR 0.20 Paise/1000 INR of Cargo Value" with a minimum 4-week period from bond number date. Due to linguistic ambiguity in unit denomination, this charge is excluded from calculator totals and confirmed on official quotation.',
    },
    onDemandServices: [
      'Bonded container trailer transportation from port/ICD to bonded facility',
      'Value-added services: palletization, strapping, wooden crating, re-labeling',
      'Heavy cargo & crane handling above 3 MT forklift capacity',
      'Reefer container plug-in & continuous temperature logging',
    ],
    terms: [
      'Covered storage has an obligatory minimum billing period of 4 (four) consecutive weeks.',
      'Billing for storage is calculated per square metre per week (not monthly).',
      'Minimum storage area is strictly enforced: 20 m² for 20-foot container consignments and 40 m² for 40-foot container consignments.',
      'Handling charges cover inward and outward operations according to chosen method (manual or 3 MT mechanical forklift).',
      'Documentation charges (₹2,500/consignment) apply to all bonded sea consignments.',
      'GST, customs overtime, and statutory fees are charged extra as per actuals.',
      'Rates and port haulage subject to statutory operational updates without prior notice.',
    ],
  },

  generalTerms: [
    'GST and all other applicable statutory government levies are charged extra at prevailing rates.',
    'Local transportation, port-to-warehouse drayage, and dedicated escorts are charged separately.',
    'Special handling for heavy cargo, awkward dimensions, machinery positioning, or crane assistance will be billed at actual cost plus service overheads.',
    'Customs overtime fees, merchant overtime (MOT), customs inspection charges, and statutory officer expenses are billed directly to consignee.',
    'All published rates are subject to operational revisions; quotation validity is 30 days unless specified otherwise.',
    'Special cargo (hazardous, perishables, high-value) attracts a 30% surcharge under Air Cargo tariffs.',
    'Consignees/importers remain responsible for comprehensive marine/all-risk transit & storage insurance unless comprehensive policy issuance is agreed upon in writing.',
    'Operations are governed by the Customs Act 1962, CBIC Public Warehouse licensing regulations, and warehouse bylaws.',
  ],
};
