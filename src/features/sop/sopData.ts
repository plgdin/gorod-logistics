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

export interface SOPStep {
  stepNumber: string;
  title: string;
  responsible: string;
  approval?: string;
  objective: string;
  keyActions: string[];
  mandatoryDocuments?: string[];
  rulesOrEscalations?: string[];
}

export interface CheckpointItem {
  checkpoint: string;
  requiredAction: string;
}

export interface RemovalTypeData {
  id: 'home_consumption' | 're_export' | 'warehouse_transfer';
  title: string;
  legalBasis: string;
  mandatoryDocuments: string[];
  customsRequirements: string[];
  sealOrOTLRequirement: string;
}

export interface HandlingActivity {
  id: string;
  title: string;
  customsSection: string;
  description: string;
  requiredDetails: string[];
  commercialRule: string;
}

export interface MonthlyReturnData {
  formName: string;
  icegatePath: string;
  filingDeadline: string;
  scope: string;
  mandatoryFields: string[];
  verificationWorkflow: string[];
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
    id: 'operations_team',
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
    id: 'customs_officer',
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

export const RECEIPT_CHECKPOINTS: CheckpointItem[] = [
  {
    checkpoint: 'Job & Documents',
    requiredAction: 'Confirm unique Job Number and match Against Into-Bond Bill of Entry (BOE) or warehouse transfer document.',
  },
  {
    checkpoint: 'Vehicle & Transport',
    requiredAction: 'Record vehicle registration number, driver details, and capture photographs of vehicle and license plate.',
  },
  {
    checkpoint: 'OTL / Customs Escort',
    requiredAction: 'Inspect One-Time-Lock (OTL) condition & serial number, or obtain signed and stamped Customs Escort Receipt.',
  },
  {
    checkpoint: 'Cargo Description',
    requiredAction: 'Verify physical cargo markings, commodity description, and packaging against the manifest and invoice.',
  },
  {
    checkpoint: 'Package Count',
    requiredAction: 'Verify actual package count piece-by-piece; record and flag any visible surplus or shortage.',
  },
  {
    checkpoint: 'Cargo Condition',
    requiredAction: 'Inspect for physical crushing, moisture, leakage, tampering, broken straps, or abnormal odors.',
  },
  {
    checkpoint: 'Weight Verification',
    requiredAction: 'Identify declared reference weight; weigh consignment on certified scale. Flag if variance exceeds ±5 kg.',
  },
  {
    checkpoint: 'Customs Attendance',
    requiredAction: 'Confirm whether jurisdictional Bond Officer or Customs Inspector is required to attend unsealing/intake.',
  },
  {
    checkpoint: 'Unloading Readiness',
    requiredAction: 'Confirm all pre-intake checks, equipment calibration, union labor briefing, and safety clearances are complete.',
  },
];

export const RECEIPT_STEPS: SOPStep[] = [
  {
    stepNumber: '4.1.1',
    title: 'Customer Enquiry & Job Number Creation',
    responsible: 'Admin Team',
    objective: 'Establish master reference tracking for incoming consignment.',
    keyActions: [
      'Receive customer enquiry for warehouse space and bonded storage services.',
      'Open a new job record in Gorod Logistics ERP when Space Certificate workflow is initiated.',
      'Generate a unique Job Number as the permanent reference key across the warehouse lifecycle.',
      'Apply 1:1 Rule: Each Bill of Entry (BOE) must have a separate Job Number even under the same customer.',
    ],
    rulesOrEscalations: ['Job Number must be cited in all future emails, tally sheets, and Customs filings.'],
  },
  {
    stepNumber: '4.1.2',
    title: 'Customer Onboarding & Document Collection',
    responsible: 'Admin Team',
    objective: 'Collect and verify all statutory trade and customs documents prior to cargo dispatch.',
    keyActions: [
      'Send registration and secure upload link on Gorod Logistics customer portal.',
      'Obtain BOE number & date, Bond number & date, cargo description, package count, and declared weight.',
      'Verify commercial invoice, packing list, Port Code/Warehouse Code (TRV1U001), and warehousing authorization.',
      'Review transport particulars and One-Time-Lock (OTL) details where already available.',
    ],
    mandatoryDocuments: ['Into-Bond Bill of Entry', 'Warehousing Bond Copy', 'Commercial Invoice & Packing List', 'Transport Waybill'],
  },
  {
    stepNumber: '4.1.3',
    title: 'Space Certificate Issuance',
    responsible: 'Admin Team',
    approval: 'Warehouse Keeper',
    objective: 'Confirm physical warehouse space availability for the consignment.',
    keyActions: [
      'Check requested volume against current bay and rack capacity in TRV1U001.',
      'Admin prepares the official Space Certificate containing customer and cargo particulars.',
      'Warehouse Keeper reviews capacity and signs the Space Certificate.',
      'Admin issues the signed certificate to customer and uploads a digital copy against the Job Number.',
    ],
    rulesOrEscalations: ['Space Certificate confirms physical capacity only; does not substitute Customs warehousing permissions.'],
  },
  {
    stepNumber: '4.1.4',
    title: 'ETA Entry & Pre-Arrival Coordination',
    responsible: 'Admin Team & Operations Team',
    objective: 'Ensure synchronized arrival readiness across internal teams and Customs.',
    keyActions: [
      'Customer logs Estimated Time of Arrival (ETA) via portal, or Admin inputs ETA in ERP.',
      'ERP automatically triggers an alert to Operations with consignment profile and Job Number.',
      'Admin sends advance email to Customs Bond Officer with consignment details and expected arrival time.',
      'Admin contacts Bond Officer to confirm if official attendance or inspection is required at gate.',
      'Warehouse Manager arranges local union labor and prepares staging zone and calibrated scales.',
    ],
  },
  {
    stepNumber: '4.1.5',
    title: 'Vehicle Arrival & Security Inward Entry',
    responsible: 'Security Team & Operations',
    objective: 'Log vehicle ingress and conduct initial perimeter verification.',
    keyActions: [
      'Security logs arrival date, time, vehicle registration, and driver particulars in physical inward register.',
      'Direct vehicle to designated bonded inspection and acceptance zone.',
      'Verify driver identity, issue visitor credentials, and confirm safety gear (PPE).',
      'Operations verifies Job Number and matches transport documents against BOE.',
    ],
  },
  {
    stepNumber: '4.1.6',
    title: 'OTL & Customs Escort Verification',
    responsible: 'Operations Team (Coordination: Admin & Warehouse Keeper)',
    objective: 'Validate cargo integrity and seal security prior to breaking seal.',
    keyActions: [
      'Case A (OTL Seal): Verify OTL number against transport documents; inspect seal integrity; take timestamped photos.',
      'If OTL is missing, broken, or tampered: STOP IMMEDIATELY. Do NOT unload. Inform Warehouse Keeper & Admin. Admin emails Customs Bond Officer. Hold cargo under security until Customs issues instructions.',
      'Case B (Customs Escort): Obtain written Customs Escort Receipt signed and sealed by the accompanying Inspector. Upload to ERP.',
    ],
    rulesOrEscalations: ['Strict prohibition: Never cut seal or unload without intact OTL or signed Customs Escort Receipt.'],
  },
  {
    stepNumber: '4.1.7',
    title: 'Pre-Unloading Inspection & Acceptance Checklist',
    responsible: 'Warehouse Manager / Operations',
    objective: 'Execute systematic 9-point pre-unloading safety and compliance verification.',
    keyActions: [
      'Complete the formal 9-checkpoint receipt checklist in ERP before breaking container seal.',
      'Verify Job docs, vehicle plate photo, OTL condition, cargo description, and condition.',
      'Confirm Customs attendance requirement has been fulfilled.',
    ],
  },
  {
    stepNumber: '4.1.8',
    title: 'Unloading, Weighing & Weight Escalation Protocol',
    responsible: 'Warehouse Manager / Operations',
    objective: 'Supervise physical unloading, tally, precision weighing, and 360° photographic record.',
    keyActions: [
      'Supervise unloading with local union labor; tally package count against manifest.',
      'Inspect external packaging for tears, leaks, crushing, or water damage.',
      'Weigh cargo on calibrated digital scale; measure dimensions (L x W x H) for volume calculation.',
      'Take 360-degree high-resolution photos of cargo and any visible exceptions; upload to ERP.',
      'Record actual weight, count, and condition in ERP in real time.',
      'WEIGHT ESCALATION RULE: If actual weight differs from declared by more than ±5 kg: (1) Record variance in ERP; (2) Immediately alert Admin & Warehouse Keeper; (3) Admin emails Customs Bond Officer with photos and evidence; (4) Coordinate onsite inspection or re-weighing.',
    ],
    rulesOrEscalations: ['±5 kg variance triggers mandatory internal escalation and formal notification to Customs.'],
  },
  {
    stepNumber: '4.1.9',
    title: 'Bin Allocation, Barcode & Storage',
    responsible: 'Warehouse Manager / Operations',
    objective: 'Securely transfer cargo to designated bay/rack and sync physical with digital location.',
    keyActions: [
      'Warehouse Manager assigns specific storage bin/location in ERP.',
      'ERP registers Job Number, quantity, actual weight, dimensions, and bin code.',
      'Generate unique barcode label containing Job Number and bin coordinate; affix to pallet/handling unit.',
      'Scan barcode with handheld scanner to confirm physical placement in assigned bin.',
      'Update cargo status to "Stored - In Bond" in ERP inventory.',
    ],
  },
  {
    stepNumber: '4.1.10',
    title: 'Goods Received Acknowledgement (GRA) Issuance',
    responsible: 'Admin Team (Input: Operations)',
    objective: 'Issue official statutory acknowledgement of cargo deposit.',
    keyActions: [
      'Operations submits verified receipt tally and photos via ERP.',
      'Admin generates formal Goods Received Acknowledgement / Receipt.',
      'Document must state exact received quantity and any discrepancy clearly (no false "clean" receipts).',
      'Authorized signatory signs and affixes official Gorod Logistics seal.',
      'Admin emails signed GRA to customer and Customs Bond Officer; archives trail in ERP.',
    ],
  },
  {
    stepNumber: '4.1.11',
    title: 'Physical Inward Register Recording',
    responsible: 'Security Team',
    objective: 'Maintain physical statutory gate log as offline backup.',
    keyActions: [
      'Record arrival time, Job #, BOE/bond ref, vehicle #, OTL/escort ref, package count, and status.',
      'Obtain physical signatures from Gorod representative, transport driver, and Customs Inspector (if present).',
    ],
  },
  {
    stepNumber: '4.1.12',
    title: 'Receipt Closure in ERP',
    responsible: 'Admin Team',
    objective: 'Formally close intake milestone once all 9 compliance criteria are verified.',
    keyActions: [
      'Verify all customer documents, OTL verification, checklist, tally, photos, barcode scan, inward register, and signed GRA are filed.',
      'Any open discrepancy is marked as a tracked exception.',
      'Mark intake job status as "Complete" in ERP.',
    ],
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

export const REMOVAL_STEPS: SOPStep[] = [
  {
    stepNumber: '4.2.1',
    title: 'Customer Removal Request & Quantity Confirmation',
    responsible: 'Admin Team',
    objective: 'Receive request, confirm remaining stock, and link removal to master Into-Bond Job Number.',
    keyActions: [
      'Customer submits removal request via portal specifying removal type (Home Consumption, Re-Export, Transfer).',
      'Customer specifies exact package count and weight to be released.',
      'Verify remaining inventory against original Job Number and Into-Bond BOE.',
      'Partial Removal Rule: Partial releases are tracked separately while remaining balance continues under original Job #.',
    ],
  },
  {
    stepNumber: '4.2.2',
    title: 'Removal Document Collection & Verification',
    responsible: 'Admin Team',
    objective: 'Scrutinize statutory clearance orders and customs permissions.',
    keyActions: [
      'Collect mandatory documents based on removal type (OOC for Home Consumption, LEO for Re-Export, Form A for Transfer).',
      'Scrutinize Job Number, BOE reference, cargo description, and requested quantity for 100% match.',
      'Record all supporting documents against the removal transaction in ERP.',
    ],
  },
  {
    stepNumber: '4.2.3',
    title: 'Customs Notification & ETD Update',
    responsible: 'Admin Team',
    objective: 'Formally notify Customs Bond Officer and coordinate required attendance.',
    keyActions: [
      'Notify Customs Bond Officer by replying to original intake email thread (retaining Job Number in subject).',
      'Include Into-Bond BOE #, removal type, cargo description, released quantity, and clearance copies.',
      'Update planned delivery date/ETD in ERP and alert Operations.',
      'CONTROL RULE: Email notification alone DOES NOT authorize release; physical clearance order must be verified.',
    ],
  },
  {
    stepNumber: '4.2.4',
    title: 'Cargo Picking & Movement to Delivery Zone',
    responsible: 'Warehouse Manager / Operations',
    objective: 'Pick exact authorized items from bin and stage in delivery zone.',
    keyActions: [
      'Locate cargo using ERP bin location and scan barcode to verify identity.',
      'Pick ONLY the verified quantity authorized for removal.',
      'Move selected cargo to designated outbound staging / delivery zone.',
      'Update cargo movement status in ERP and ensure remaining balance remains safely secured.',
    ],
  },
  {
    stepNumber: '4.2.5',
    title: 'Physical Verification, Weighing & Photography',
    responsible: 'Warehouse Manager / Operations',
    objective: 'Conduct outbound tally, weight check, condition review, and photographic archive.',
    keyActions: [
      'Count and verify packages at delivery zone against release order.',
      'Weigh cargo on warehouse scale and record outbound weight in ERP.',
      'Inspect physical packaging and take pre-dispatch photographs.',
      'For Re-Export & Transfer: Photograph vehicle license plate, container interior, and intact OTL seal.',
    ],
  },
  {
    stepNumber: '4.2.6',
    title: 'Invoice, Payment & No-Due Certificate (NDC)',
    responsible: 'Accounts Team',
    objective: 'Enforce mandatory financial clearance before gate pass creation.',
    keyActions: [
      'Calculate warehousing rent, handling, and value-added charges per published tariff.',
      'Issue commercial tax invoice for the removal.',
      'Verify receipt and bank clearance of customer payment.',
      'Issue official No-Due Certificate (NDC) in ERP.',
      'GATE PASS LOCK: Outpass CANNOT be generated without approved NDC in ERP.',
    ],
  },
  {
    stepNumber: '4.2.7',
    title: 'Removal-Type Specific Customs Verification',
    responsible: 'Admin Team & Warehouse Manager',
    objective: 'Complete statutory requirements tailored to Home Consumption, Re-Export, or Transfer.',
    keyActions: [
      'Home Consumption: Verify OOC, confirm duty payment, update quantity released.',
      'Re-Export: Verify LEO, coordinate Customs Officer attendance at loading, inspect OTL.',
      'Transfer: Verify Form A under Sec 67, confirm destination warehouse license, inspect OTL, initiate transit tracking.',
    ],
  },
  {
    stepNumber: '4.2.8',
    title: 'Outpass / Gate Pass Issuance',
    responsible: 'Admin Team (Verification: Operations & Accounts)',
    objective: 'Generate authorized internal release pass permitting vehicle gate-out.',
    keyActions: [
      'Admin confirms removal request, Customs OOC/LEO/Form A, Operations verification, and Accounts NDC.',
      'Generate official Gorod Logistics Outpass / Gate Pass with unique sequential number.',
      'Record Outpass number against Job Number in ERP.',
      'Transmit release authorization to Security and Operations.',
    ],
  },
  {
    stepNumber: '4.2.9',
    title: 'Outward Register & Gate-Out Verification',
    responsible: 'Security Team',
    objective: 'Execute final perimeter check and log vehicle exit in physical register.',
    keyActions: [
      'Security inspects physical Outpass, vehicle license plate, driver ID, and cargo count.',
      'Verify OTL seal integrity for Re-Export and Transfer consignments.',
      'Record departure in physical outward register (timestamp, Job #, BOE #, customer, Outpass #, driver, signatures).',
      'Allow vehicle to exit and log actual gate-out time in ERP.',
    ],
  },
  {
    stepNumber: '4.2.10',
    title: 'Inventory Update & Removal Closure',
    responsible: 'Warehouse Manager & Admin Team',
    objective: 'Deduct inventory in ERP and archive complete audit trail.',
    keyActions: [
      'Deduct released quantity from ERP inventory; update remaining balance on original Job Number.',
      'Archive request, Customs correspondence, photos, invoice, payment receipt, NDC, and Outpass.',
      'For warehouse transfers: track destination warehouse arrival confirmation.',
      'Formally close removal milestone in ERP.',
    ],
  },
];

export const HANDLING_ACTIVITIES: HandlingActivity[] = [
  {
    id: 'sec_64',
    title: 'Owner Operations on Warehoused Goods',
    customsSection: 'Section 64, Customs Act 1962',
    description: 'Permits owner of warehoused goods to inspect, sort, label, repack, or deal with containers to prevent loss, deterioration, or show goods for sale.',
    requiredDetails: [
      'Into-Bond BOE number and date',
      'Date and proposed timeframe of activity',
      'Exact nature of operation (inspection, sorting, labelling, repacking, or sampling)',
      'Specific purpose of the requested activity',
    ],
    commercialRule: 'Admin confirms scope with Operations (manpower, equipment, materials). Accounts issues proforma invoice including Customs overtime charges if outside normal hours. Warehouse Keeper approves.',
  },
  {
    id: 'govt_samples',
    title: 'Samples Drawn by Government Agencies',
    customsSection: 'Statutory Regulatory Inspections (FSSAI, Plant/Animal Quarantine, Drug Controller)',
    description: 'Formal sampling of warehoused cargo by authorized government agencies or Customs inspecting officers.',
    requiredDetails: [
      'Into-Bond BOE number and date',
      'Date sample drawn and official agency designation',
      'Description, quantity, and unit of sample drawn',
      'Official statutory sampling order or seizure memo reference',
    ],
    commercialRule: 'Operations assists with sample extraction in Value Addon Service zone, records photos and exact quantity in ERP, and updates inventory records.',
  },
  {
    id: 'warehousing_extension',
    title: 'Extension of Warehousing Period',
    customsSection: 'Section 61, Customs Act 1962',
    description: 'Formal extension of initial statutory warehousing period granted by competent Customs authority upon application.',
    requiredDetails: [
      'Into-Bond BOE number and date',
      'Description and current quantity of stored goods',
      'Current warehousing expiry date and requested extension duration',
      'Justification/reason for extension and approved Customs extension order copy',
    ],
    commercialRule: 'Admin verifies compliance with Section 61 interest provisions, records extension order in ERP, and updates expiry date in Form B tracker.',
  },
  {
    id: 'bank_guarantees',
    title: 'Bank Guarantees & Security Undertakings',
    customsSection: 'Customs Bond Conditions & Security Regulations',
    description: 'Recording and monitoring of Bank Guarantees furnished towards Customs duties, penalties, or compliance undertakings.',
    requiredDetails: [
      'Into-Bond BOE number and date',
      'Description and valuation of covered goods',
      'Bank Guarantee reference number, issuing bank, and amount',
      'Validity period and expiry date',
      'Certified copy of Bank Guarantee',
    ],
    commercialRule: 'Admin tracks validity in ERP and flags expirations 30 days in advance to ensure continuous statutory compliance.',
  },
  {
    id: 'relinquishment',
    title: 'Relinquishment of Warehoused Goods',
    customsSection: 'Section 68 (Proviso), Customs Act 1962',
    description: 'Relinquishment of title to warehoused goods to the Customs Department before an order for clearance for home consumption has been made.',
    requiredDetails: [
      'Into-Bond BOE number and date',
      'Description and full particulars of goods',
      'Available stored quantity and quantity proposed for relinquishment',
      'Customer formal written request and affidavit',
    ],
    commercialRule: 'Warehouse Keeper verifies all applicable storage and handling rent is settled; submits notice to Assistant Commissioner of Customs.',
  },
];

export const MONTHLY_RETURNS: MonthlyReturnData[] = [
  {
    formName: 'Form A — Monthly Movement Return',
    icegatePath: 'ICEGATE Portal → Services → Warehouse → Warehouse Monthly Return → Form A',
    filingDeadline: 'Within 10 days after the close of the relevant calendar month (e.g. by 10th of next month)',
    scope: 'Comprehensive monthly statutory reconciliation of all cargo receipts, storage status, handling operations, sample drawings, and outward releases.',
    mandatoryFields: [
      'Warehouse Code (TRV1U001) & Return Month/Year',
      'Opening stock balance for each Into-Bond BOE',
      'Receipts during the month (BOE #, packages, weight, commodity, value, duty)',
      'Removals for Home Consumption (Ex-Bond BOE #, OOC date, quantity, duty paid)',
      'Removals for Re-Export (Shipping Bill #, LEO date, destination port, OTL #)',
      'Transfers to other warehouses (Form A ref, destination warehouse code, OTL #)',
      'Section 64 handling activities and Government agency samples drawn',
      'Closing stock balance and physical storage locations',
    ],
    verificationWorkflow: [
      '1. Admin & Operations compile data across all Job Numbers from ERP.',
      '2. Cross-verify with physical inward/outward registers and gate passes.',
      '3. Warehouse Keeper conducts formal audit and signs approval memo.',
      '4. Admin uploads return on ICEGATE and secures digital acknowledgement.',
      '5. Email acknowledgement to Customs Bond Officer and archive in ERP.',
    ],
  },
  {
    formName: 'Form B — Expiring Warehousing Period Return',
    icegatePath: 'ICEGATE Portal → Services → Warehouse → Warehouse Monthly Return → Form B',
    filingDeadline: 'On or before the 10th day of the month immediately preceding the month in which warehousing period expires',
    scope: 'Early statutory warning list of consignments whose warehousing period under Section 61 is due to expire in the subsequent calendar month.',
    mandatoryFields: [
      'Warehouse Code (TRV1U001) & Target Expiry Month',
      'Into-Bond BOE number, date, and original bond registration date',
      'Importer name, IEC code, and customs broker contact',
      'Commodity description, package count, and stored balance',
      'Assessable value and applicable duty liability',
      'Current warehousing expiry date',
      'Extension status (whether extension applied, approved, or pending under Section 61)',
    ],
    verificationWorkflow: [
      '1. ERP automated scan identifies all BOEs with expiry in next month.',
      '2. Admin verifies customer communications and extension filings.',
      '3. Warehouse Keeper reviews and approves Form B dataset.',
      '4. Admin files on ICEGATE by the statutory deadline (10th of prior month).',
      '5. Transmit formal copy to Customs Bond Officer for statutory notice issuance.',
    ],
  },
];
