/**
 * Authoritative Standard Operating Procedure (SOP) Dataset
 * Source: Gorod Logistics Customs Bonded Warehouse SOP Manual (TRV1U001 • Bond No: 2002591018)
 * Location: Directorate of Port, Valiyathura, Thiruvananthapuram, Kerala, 695008
 */

export interface SOPRole {
  id: string;
  title: string;
  department: string;
  isExternal?: boolean;
  summary: string;
  keyResponsibilities: string[];
  escalationRole: string;
}

export interface RemovalTypeData {
  id: 'home_consumption' | 're_export' | 'warehouse_transfer';
  title: string;
  legalBasis: string;
  mandatoryDocuments: string[];
  customsRequirements: string[];
  sealOrOTLRequirement: string;
}

export const CBW_DETAILS = {
  companyName: 'Gorod Logistics',
  parentCompany: 'A Division of Gorod International Agency Pvt Ltd',
  warehouseCode: 'TRV1U001',
  bondNumber: '2002591018',
  location: 'Directorate of Port, Valiyathura, Thiruvananthapuram, Kerala, 695008',
  phone: '0471-3191914',
  email: 'business@gorod.agency',
  weightThresholdKg: 5, // ±5 kg internal escalation trigger
  pdfUrl: '/tariffs/doc2.pdf',
};

export const SOP_ROLES: SOPRole[] = [
  {
    id: 'warehouse_keeper',
    title: 'Warehouse Keeper',
    department: 'Management & Statutory Compliance',
    summary: 'Overall custodian holding statutory responsibility for warehouse operations and Customs compliance under the Indian Customs Act 1962.',
    keyResponsibilities: [
      'Overall responsibility for warehouse operations and statutory Customs compliance.',
      'Primary liaison officer with the jurisdictional Customs Bond Officer.',
      'Reviews and approves Space Certificates, warehousing extensions, and special handling requests.',
      'Ensures statutory monthly returns (ICEGATE Form A & B) and mandatory notifications are completed.',
      'Handles escalations, discrepancies (including weight/seal exceptions), and Customs inspections.',
    ],
    escalationRole: 'Jurisdictional Customs Authorities / Gorod Board',
  },
  {
    id: 'admin_compliance',
    title: 'Admin Team',
    department: 'Customs Compliance & Documentation',
    summary: 'Executes customer onboarding, document scrutiny, statutory notifications, Space Certificates, and ERP consignment lifecycle.',
    keyResponsibilities: [
      'Obtains customer onboarding, shipment details, and billing particulars before cargo arrival.',
      'Scrutinizes and verifies into-bond and ex-bond documentation against Customs regulations.',
      'Prepares Space Certificates and Goods Received Acknowledgements (GRA) with official seal.',
      'Notifies the Customs Bond Officer via official email for incoming cargo, removals, and discrepancies.',
      'Prepares monthly ICEGATE returns (Form A & B) and maintains correspondence filing records.',
      'Coordinates customer requests and customer portal status updates in real time.',
    ],
    escalationRole: 'Warehouse Keeper',
  },
  {
    id: 'warehouse_manager',
    title: 'Warehouse Manager / Operations Team',
    department: 'Warehouse Operations',
    summary: 'Supervises physical intake, tally, precision weighing, 360° photography, bin storage, union labor, and picking.',
    keyResponsibilities: [
      'Manages physical receipts, staging, tallying, storage, inventory control, and cargo removal.',
      'Executes receipt inspection: verifies cargo package count, condition, seals (OTL), and weight.',
      'Coordinates local union labor for loading, unloading, and specialized cargo handling.',
      'Coordinates onsite with the Customs Bond Officer during physical inspections or escorts.',
      'Enforces strict weight discrepancy rule (escalates if variance > ±5 kg).',
      'Assigns bin locations in ERP, affixes barcodes, and confirms barcode scan upon storage.',
      'Enforces release lock: cargo is NEVER released without verified Customs clearance and Outpass.',
    ],
    escalationRole: 'Warehouse Keeper & Admin Team',
  },
  {
    id: 'security_team',
    title: 'Security Team',
    department: 'Perimeter & Gate Security',
    summary: 'Maintains physical inward and outward gate registers, vehicle logs, visitor safety checks, and gate pass verification.',
    keyResponsibilities: [
      'Maintains permanent physical inward and outward gate registers as statutory backup to ERP.',
      'Logs vehicle registration number, driver credentials, entry/exit timestamp, and container seal IDs.',
      'Verifies staff and union labor ID cards, issues visitor tags, and ensures PPE/safety compliance.',
      'Strictly verifies authorized Outpass/Gate Pass before permitting any vehicle or cargo to exit.',
      'Obtains physical signatures from driver, Gorod representative, and Customs Inspector where present.',
    ],
    escalationRole: 'Warehouse Manager',
  },
  {
    id: 'accounts_team',
    title: 'Accounts Team',
    department: 'Finance & Billing',
    summary: 'Calculates tariff charges, issues commercial invoices, clears payments, and issues mandatory No-Due Certificates (NDC).',
    keyResponsibilities: [
      'Calculates applicable warehousing, handling, and value-added charges per published tariff.',
      'Prepares proforma and tax invoices for storage, handling, bonding/debonding, and overtime.',
      'Verifies receipt and bank clearance of customer payments.',
      'Issues the mandatory No-Due Certificate (NDC) or financial clearance in ERP prior to cargo release.',
      'Enforces financial clearance stop: Gate Pass cannot be issued until NDC is approved.',
    ],
    escalationRole: 'Warehouse Keeper',
  },
  {
    id: 'customs_bond_officer',
    title: 'Customs Bond Officer',
    department: 'Indian Customs (External Statutory Authority)',
    isExternal: true,
    summary: 'Government Customs authority overseeing bonded operations, receiving statutory notifications, and conducting official inspections.',
    keyResponsibilities: [
      'Oversees bonded warehouse operations pursuant to Section 57/58 of the Customs Act 1962.',
      'Receives mandatory advance email notifications for incoming cargo, removals, and discrepancies.',
      'Attends cargo receipt, unsealing of OTL, physical verification, or dispatch when required.',
      'Inspects cargo, verifies escort documentation, and issues official directions on discrepancies.',
      'Grants formal statutory permissions for Section 64 handling, Section 67 transfers, and Section 69 re-exports.',
    ],
    escalationRole: 'Assistant/Deputy Commissioner of Customs',
  },
];

export const REMOVAL_TYPES: RemovalTypeData[] = [
  {
    id: 'home_consumption',
    title: 'Home Consumption (Ex-Bond Clearance)',
    legalBasis: 'Section 68 of the Customs Act 1962',
    mandatoryDocuments: [
      'Ex-Bond Bill of Entry (Form for ex-bonding)',
      'Out of Charge (OOC) order copy issued by Proper Officer of Customs',
      'Proof of payment of duty, interest, fine, and applicable penalties',
      'Customs Bond Officer physical removal permission',
      'Gorod Logistics No-Due Certificate (NDC)',
    ],
    customsRequirements: [
      'Verification that the duty and applicable interest under Section 61 have been fully paid.',
      'Confirmation that Out of Charge (OOC) is authentic and recorded in ICES/ICEGATE.',
      'Customs Bond Officer permission for physical gating out.',
    ],
    sealOrOTLRequirement: 'Commercial vehicle verification; OTL not required once OOC is granted for domestic consumption.',
  },
  {
    id: 're_export',
    title: 'Re-Export of Warehoused Goods',
    legalBasis: 'Section 69 of the Customs Act 1962',
    mandatoryDocuments: [
      'Ex-Bond Shipping Bill with Let Export Order (LEO) copy',
      'Clearance order under Section 69 issued by Proper Officer',
      'Proof of payment of applicable warehousing rent, handling, and export duties',
      'Gorod Logistics No-Due Certificate (NDC)',
      'Transport waybill and vehicle registration details',
    ],
    customsRequirements: [
      'Mandatory Customs Bond Officer physical presence during loading at warehouse bay.',
      'Supervision of container sealing with Customs One-Time-Lock (OTL).',
      'Endorsement of Shipping Bill by Bond Officer upon container departure.',
    ],
    sealOrOTLRequirement: 'MANDATORY One-Time-Lock (OTL) affixed and sealed by Customs Officer prior to gate exit.',
  },
  {
    id: 'warehouse_transfer',
    title: 'Transfer to Another Customs Bonded Warehouse',
    legalBasis: 'Section 67 of the Customs Act 1962 & Removal Regulations 2016',
    mandatoryDocuments: [
      'Customer-signed prescribed Form for Transfer of Goods from a Warehouse (Form A under Sec 67)',
      'Formal permission of jurisdictional Customs Bond Officer',
      'Consignee warehouse license copy and valid space confirmation at destination warehouse',
      'Transport details, vehicle registration, and driver particulars',
      'Gorod Logistics No-Due Certificate (NDC)',
    ],
    customsRequirements: [
      'Verification of destination bonded warehouse code and license validity.',
      'Form A endorsement by dispatching Bond Officer.',
      'Tracking of arrival acknowledgement from destination warehouse keeper.',
    ],
    sealOrOTLRequirement: 'MANDATORY One-Time-Lock (OTL) applied under Customs supervision unless formal written statutory exemption applies.',
  },
];

// Dashboard widgets read SOP_ROLES and REMOVAL_TYPES from this file.
// The full clause text lives in sopFull.ts and is rendered on /sop.
