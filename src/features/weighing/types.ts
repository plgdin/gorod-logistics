export type BridgeConnectionState =
  | 'DISCONNECTED'
  | 'DISCOVERING'
  | 'CONNECTING'
  | 'CONNECTED'
  | 'RECEIVING'
  | 'RECONNECTING'
  | 'ERROR';

export type StabilitySource = 'DEVICE' | 'SOFTWARE' | 'MANUAL' | 'UNSTABLE';

export type BridgeMode = 'hardware' | 'simulator';

export type SimulatorScenarioId =
  | 'zero'
  | 'small_1kg'
  | 'decimal_24_6'
  | 'heavy_1254_2'
  | 'unstable'
  | 'negative'
  | 'overload'
  | 'malformed'
  | 'within_threshold_103'
  | 'exact_boundary_105'
  | 'breach_105_1'
  | 'breach_94_9'
  | 'software_stable_stream'
  | 'disconnect';

export interface DiscoveredSerialPort {
  port: string;
  description: string;
  hwid: string;
  manufacturer: string;
  isBluetooth: boolean;
}

export interface LiveWeightReading {
  weight: number | null;
  unit: string;
  rawWeight: number | null;
  rawUnit: string;
  stable: boolean;
  stabilitySource: Exclude<StabilitySource, 'MANUAL'>;
  overload: boolean;
  invalid: boolean;
  raw: string;
  timestamp: string;
  mode: BridgeMode;
  error?: string | null;
}

export interface DiagnosticLogEntry {
  id: string;
  timestamp: string;
  byteCount: number;
  totalBytes: number;
  ascii: string;
  hex: string;
  port: string | null;
  baudRate: number | null;
}

export interface CapturedScaleReading {
  weightKg: number;
  measuredWeight: number;
  measuredUnit: string;
  rawPacket: string;
  comPort: string;
  stabilitySource: StabilitySource;
  isStable: boolean;
  isSimulated: boolean;
  capturedAt: string;
  deviceCode: string;
}

export type DiscrepancyStatus = 'WITHIN_THRESHOLD' | 'DISCREPANCY';

export interface WeightDiscrepancyResult {
  actualWeightKg: number;
  referenceWeightKg: number;
  differenceKg: number;
  absDifferenceKg: number;
  thresholdKg: number;
  status: DiscrepancyStatus;
  exceedsThreshold: boolean;
}

export type MeasurementPurpose = 'initial' | 'reweigh' | 'verification' | 'correction';

export type WeighingExceptionStatus =
  | 'WITHIN_THRESHOLD'
  | 'DISCREPANCY'
  | 'UNDER_REVIEW'
  | 'CUSTOMS_NOTIFIED'
  | 'AWAITING_INSTRUCTIONS'
  | 'RESOLVED'
  | 'CLOSED';

export interface WeighingMeasurementRecord {
  id: string;
  jobId: string;
  inwardReceiptId?: string;
  removalId?: string;
  direction: 'inward' | 'outward';
  purpose: MeasurementPurpose;
  measuredWeight: number;
  measuredUnit: string;
  weightKg: number;
  referenceWeightKg: number;
  varianceKg: number;
  thresholdKg: number;
  discrepancyStatus: DiscrepancyStatus;
  rawPacket?: string;
  comPort?: string;
  stabilitySource: StabilitySource;
  isStable: boolean;
  supersedesMeasurementId?: string;
  correctionReason?: string;
  notes?: string;
  capturedBy: string;
  capturedByName?: string;
  capturedAt: string;
}

export interface WeighingExceptionRecord {
  id: string;
  jobId: string;
  boeNumber: string;
  direction: 'inward' | 'outward';
  inwardReceiptId?: string;
  removalId?: string;
  measurementId: string;
  referenceWeightKg: number;
  actualWeightKg: number;
  differenceKg: number;
  thresholdKg: number;
  unit: string;
  status: WeighingExceptionStatus;
  customsNotifiedTo?: string;
  customsEmailRef?: string;
  customsNotifiedAt?: string;
  resolutionRef?: string;
  resolutionNotes?: string;
  createdAt: string;
  updatedAt: string;
}

