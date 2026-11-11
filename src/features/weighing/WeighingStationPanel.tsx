import React, { useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Bluetooth,
  CheckCircle2,
  Plug,
  PlugZap,
  RefreshCw,
  Scale,
  Terminal,
  Unplug,
  WifiOff,
} from 'lucide-react';
import { formatDateTime, formatKg, formatSignedKg } from '../../lib/format';
import { calculateWeightDiscrepancy, DEFAULT_WEIGHT_THRESHOLD_KG } from './weightEngine';
import type {
  CapturedScaleReading,
  SimulatorScenarioId,
} from './types';
import { useScaleBridge } from './useScaleBridge';

interface WeighingStationPanelProps {
  direction: 'inward' | 'outward';
  jobNumber: string;
  boeNumber: string;
  referenceWeightKg: number;
  thresholdKg?: number;
  isAuthorized: boolean;
  isTransactionValid: boolean;
  capturedReading: CapturedScaleReading | null;
  onCapture: (reading: CapturedScaleReading) => void;
  onClearCapture?: () => void;
}

const BAUD_OPTIONS = [2400, 4800, 9600, 19200, 38400, 57600, 115200];

const SIMULATOR_OPTIONS: Array<{ id: SimulatorScenarioId; label: string }> = [
  { id: 'heavy_1254_2', label: '1254.2 kg (Stable)' },
  { id: 'decimal_24_6', label: '24.6 kg (Stable)' },
  { id: 'small_1kg', label: '1.0 kg (Stable)' },
  { id: 'zero', label: '0.0 kg (Zero)' },
  { id: 'within_threshold_103', label: '103.0 kg (Test within ±5)' },
  { id: 'exact_boundary_105', label: '105.0 kg (Exact +5 boundary)' },
  { id: 'breach_105_1', label: '105.1 kg (Discrepancy >5)' },
  { id: 'breach_94_9', label: '94.9 kg (Discrepancy <-5)' },
  { id: 'unstable', label: 'Unstable stream' },
  { id: 'software_stable_stream', label: 'Software stability stream' },
  { id: 'negative', label: 'Negative (-2.4 kg)' },
  { id: 'overload', label: 'Overload (OL)' },
  { id: 'malformed', label: 'Malformed packet' },
  { id: 'disconnect', label: 'Drop connection' },
];

export const WeighingStationPanel: React.FC<WeighingStationPanelProps> = ({
  direction,
  jobNumber,
  boeNumber,
  referenceWeightKg,
  thresholdKg = DEFAULT_WEIGHT_THRESHOLD_KG,
  isAuthorized,
  isTransactionValid,
  capturedReading,
  onCapture,
  onClearCapture,
}) => {
  const bridge = useScaleBridge(true);
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  const isConnected =
    bridge.connectionState === 'CONNECTED' || bridge.connectionState === 'RECEIVING';

  const readingStatus = useMemo(() => {
    if (!isConnected) {
      return {
        label: 'NO DEVICE CONNECTED',
        tone: 'slate' as const,
        detail: 'Connect the HC-05 Bluetooth scale via the local bridge.',
      };
    }
    if (!bridge.liveReading) {
      return {
        label: 'CONNECTED — NO DATA RECEIVED',
        tone: 'amber' as const,
        detail:
          'Serial port is open, but the indicator has not transmitted weight bytes yet.',
      };
    }
    if (bridge.liveReading.overload) {
      return {
        label: 'OVERLOAD',
        tone: 'red' as const,
        detail: 'Scale reports overload condition. Remove excess load before weighing.',
      };
    }
    if (bridge.liveReading.invalid || bridge.liveReading.weight === null) {
      return {
        label: 'INVALID PACKET',
        tone: 'red' as const,
        detail: bridge.liveReading.error || 'Unrecognized serial packet.',
      };
    }
    if (bridge.liveReading.weight <= 0) {
      return {
        label: 'ZERO / NON-POSITIVE READING',
        tone: 'amber' as const,
        detail: 'Place cargo on scale platform to capture a positive net cargo weight.',
      };
    }
    if (!bridge.liveReading.stable) {
      return {
        label: 'RECEIVING — UNSTABLE',
        tone: 'amber' as const,
        detail: 'Waiting for scale reading to stabilize before capture.',
      };
    }
    return {
      label:
        bridge.liveReading.stabilitySource === 'DEVICE'
          ? 'STABLE (DEVICE CONFIRMED)'
          : 'STABLE (SOFTWARE ESTIMATED)',
      tone: 'emerald' as const,
      detail:
        bridge.liveReading.stabilitySource === 'DEVICE'
          ? 'Hardware indicator confirmed stable reading.'
          : 'Software window confirmed stability (indicator did not send stability flag).',
    };
  }, [bridge.liveReading, isConnected]);

  const canCaptureLive = Boolean(
    bridge.bridgeOnline &&
      isConnected &&
      bridge.liveReading &&
      !bridge.liveReading.invalid &&
      !bridge.liveReading.overload &&
      bridge.liveReading.weight !== null &&
      bridge.liveReading.weight > 0 &&
      bridge.liveReading.stable &&
      bridge.liveReading.mode === 'hardware' &&
      isAuthorized &&
      isTransactionValid
  );

  const previewWeight =
    capturedReading?.weightKg ??
    (bridge.liveReading && !bridge.liveReading.invalid && bridge.liveReading.weight !== null
      ? bridge.liveReading.weight
      : null);

  const discrepancyPreview = useMemo(() => {
    if (previewWeight === null || previewWeight <= 0) return null;
    return calculateWeightDiscrepancy(previewWeight, referenceWeightKg, thresholdKg);
  }, [previewWeight, referenceWeightKg, thresholdKg]);

  const handleCaptureClick = () => {
    if (!canCaptureLive || !bridge.liveReading || bridge.liveReading.weight === null) {
      return;
    }
    onCapture({
      weightKg: bridge.liveReading.weight,
      measuredWeight: bridge.liveReading.rawWeight ?? bridge.liveReading.weight,
      measuredUnit: bridge.liveReading.rawUnit || 'kg',
      rawPacket: bridge.liveReading.raw,
      comPort: bridge.selectedPort || 'UNKNOWN',
      stabilitySource: bridge.liveReading.stabilitySource,
      isStable: bridge.liveReading.stable,
      isSimulated: bridge.liveReading.mode === 'simulator',
      capturedAt: new Date().toISOString(),
      deviceCode: 'GL-SCALE-01',
    });
  };

  const badgeStyles: Record<'slate' | 'amber' | 'red' | 'emerald', string> = {
    slate: 'border-slate-600 bg-slate-800 text-slate-300',
    amber: 'border-amber-500/50 bg-amber-950/70 text-amber-300',
    red: 'border-red-500/60 bg-red-950/80 text-red-300',
    emerald: 'border-emerald-500/60 bg-emerald-950/80 text-emerald-300',
  };

  return (
    <div className="space-y-3 rounded-lg border border-slate-300 bg-slate-50 p-3.5 text-xs">
      {/* Station Context Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded bg-[#0c323b] text-white">
            <Scale className="h-4 w-4" />
          </div>
          <div>
            <div className="font-bold text-slate-900">
              Electronic Weighing Station ({direction === 'inward' ? 'SOP 4.1.8 Acceptance' : 'SOP 4.2.5 Delivery'})
            </div>
            <div className="font-mono text-[10px] text-slate-500">
              Job: {jobNumber} &bull; BOE: {boeNumber} &bull; Ref: {formatKg(referenceWeightKg)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span
            className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 font-mono text-[10px] font-semibold ${
              bridge.bridgeOnline
                ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                : 'border-red-300 bg-red-50 text-red-800'
            }`}
          >
            {bridge.bridgeOnline ? (
              <PlugZap className="h-3 w-3" />
            ) : (
              <WifiOff className="h-3 w-3" />
            )}
            <span>{bridge.bridgeOnline ? 'Bridge Online' : 'Bridge Offline'}</span>
          </span>

          {!bridge.bridgeOnline && (
            <button
              type="button"
              onClick={bridge.retryBridge}
              className="rounded border border-slate-300 bg-white px-2 py-0.5 text-[11px] font-medium text-slate-700 hover:bg-slate-100"
            >
              Retry
            </button>
          )}
        </div>
      </div>

      {/* Bridge Offline Message */}
      {!bridge.bridgeOnline && (
        <div className="rounded border border-amber-300 bg-amber-50 px-3 py-2 text-[11px] leading-relaxed text-amber-950">
          <strong>Local Windows Scale Bridge unavailable</strong> ({bridge.bridgeUrl}). Start{' '}
          <code className="rounded bg-amber-100 px-1 font-mono">
            hardware-bridge/scripts/start-bridge.ps1
          </code>{' '}
          on the workstation paired to the HC-05 scale, then click <strong>Retry</strong>.
        </div>
      )}

      {/* Simulator Mode Banner */}
      {bridge.mode === 'simulator' && (
        <div className="flex items-center gap-2 rounded border border-red-300 bg-red-50 px-3 py-2 text-[11px] font-semibold text-red-900">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-red-600" />
          <span>
            SIMULATOR MODE ACTIVE (QA ONLY) — Simulated weights are displayed for diagnostics and
            cannot be committed to production Supabase records.
          </span>
        </div>
      )}

      {/* Device Controls */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-12">
        <div className="sm:col-span-3">
          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-slate-500">
            Source Mode
          </label>
          <select
            className="w-full rounded border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-900"
            value={bridge.mode}
            disabled={isConnected}
            onChange={(e) => bridge.setMode(e.target.value as 'hardware' | 'simulator')}
          >
            <option value="hardware">Hardware (HC-05 SPP)</option>
            <option value="simulator">QA Simulator (Non-Prod)</option>
          </select>
        </div>

        {bridge.mode === 'hardware' ? (
          <>
            <div className="sm:col-span-5">
              <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                Serial / Bluetooth COM Port
              </label>
              <div className="flex gap-1">
                <select
                  className="w-full rounded border border-slate-300 bg-white px-2 py-1.5 font-mono text-xs text-slate-900"
                  value={bridge.selectedPort}
                  disabled={!bridge.bridgeOnline || isConnected}
                  onChange={(e) => bridge.setSelectedPort(e.target.value)}
                >
                  {bridge.ports.length === 0 ? (
                    <option value="">No COM ports discovered</option>
                  ) : (
                    bridge.ports.map((p) => (
                      <option key={p.port} value={p.port}>
                        {p.port} {p.isBluetooth ? '· BT SPP' : ''} — {p.description}
                      </option>
                    ))
                  )}
                </select>
                <button
                  type="button"
                  onClick={bridge.refreshPorts}
                  disabled={!bridge.bridgeOnline || isConnected}
                  title="Refresh COM ports"
                  className="rounded border border-slate-300 bg-white px-2 text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                Baud
              </label>
              <select
                className="w-full rounded border border-slate-300 bg-white px-2 py-1.5 font-mono text-xs text-slate-900"
                value={bridge.baudRate}
                disabled={!bridge.bridgeOnline || isConnected}
                onChange={(e) => bridge.setBaudRate(Number(e.target.value))}
              >
                {BAUD_OPTIONS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          </>
        ) : (
          <div className="sm:col-span-7">
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              Simulator Test Scenario
            </label>
            <select
              className="w-full rounded border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-900"
              value={bridge.scenario}
              onChange={(e) => bridge.setSimulatorScenario(e.target.value as SimulatorScenarioId)}
            >
              {SIMULATOR_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex items-end gap-1 sm:col-span-2">
          {!isConnected ? (
            <button
              type="button"
              onClick={() => bridge.connectScale()}
              disabled={!bridge.bridgeOnline}
              className="inline-flex w-full items-center justify-center gap-1 rounded bg-[#0c323b] px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-[#154652] disabled:opacity-50"
            >
              <Plug className="h-3.5 w-3.5" />
              <span>Connect</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={bridge.disconnectScale}
              className="inline-flex w-full items-center justify-center gap-1 rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              <Unplug className="h-3.5 w-3.5" />
              <span>Disconnect</span>
            </button>
          )}
        </div>
      </div>

      {/* Live Weight Display Panel */}
      <div className="rounded-lg border border-slate-800 bg-[#0c1e28] p-4 text-white">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-[11px] text-slate-300">
            <Bluetooth className="h-3.5 w-3.5 text-sky-400" />
            <span className="font-semibold">{bridge.deviceName}</span>
            {bridge.selectedPort && bridge.mode === 'hardware' && (
              <span className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px]">
                {bridge.selectedPort} @ {bridge.baudRate}
              </span>
            )}
            <span className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px]">
              {bridge.connectionState}
            </span>
          </div>

          <span
            className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 font-mono text-[10px] font-bold ${badgeStyles[readingStatus.tone]}`}
          >
            <Activity className="h-3 w-3" />
            <span>{readingStatus.label}</span>
          </span>
        </div>

        <div className="mt-3 flex flex-wrap items-baseline justify-between gap-4">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Current Live Weight
            </div>
            <div className="mt-0.5 font-mono text-3xl font-black tracking-tight text-white tabular-nums sm:text-4xl">
              {bridge.liveReading?.overload
                ? 'OVERLOAD'
                : bridge.liveReading &&
                    !bridge.liveReading.invalid &&
                    bridge.liveReading.weight !== null
                  ? `${bridge.liveReading.weight.toFixed(3)} ${bridge.liveReading.unit}`
                  : '---.--- kg'}
            </div>
            <div className="mt-1 text-[11px] text-slate-400">{readingStatus.detail}</div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <button
              type="button"
              disabled={!canCaptureLive}
              onClick={handleCaptureClick}
              className="inline-flex items-center gap-1.5 rounded bg-[#852929] px-4 py-2 text-xs font-bold text-white shadow-sm transition-colors hover:bg-[#6e2222] disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
            >
              <Scale className="h-3.5 w-3.5" />
              <span>Capture Stable Weight</span>
            </button>
            <div className="font-mono text-[10px] text-slate-400">
              Last packet: {bridge.lastReadingAt ? formatDateTime(bridge.lastReadingAt) : 'None'}
            </div>
          </div>
        </div>

        {bridge.error && (
          <div className="mt-2.5 rounded border border-red-500/40 bg-red-950/60 px-2.5 py-1.5 text-[11px] text-red-200">
            {bridge.error}
          </div>
        )}
      </div>

      {/* Captured Confirmation + Discrepancy Preview */}
      {capturedReading && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded border border-emerald-300 bg-emerald-50 px-3 py-2 text-[11px] text-emerald-950">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <div>
              <strong>Captured from scale:</strong>{' '}
              <span className="font-mono font-bold">{capturedReading.weightKg.toFixed(3)} kg</span>{' '}
              <span className="text-emerald-800">
                ({capturedReading.stabilitySource} · {capturedReading.comPort} · Raw:{' '}
                <code>{capturedReading.rawPacket}</code>)
              </span>
            </div>
          </div>
          {onClearCapture && (
            <button
              type="button"
              onClick={onClearCapture}
              className="rounded border border-emerald-300 bg-white px-2 py-0.5 text-[10px] font-semibold text-emerald-800 hover:bg-emerald-100"
            >
              Clear
            </button>
          )}
        </div>
      )}

      {discrepancyPreview && (
        <div
          className={`flex flex-wrap items-center justify-between gap-2 rounded border px-3 py-2 text-[11px] ${
            discrepancyPreview.exceedsThreshold
              ? 'border-red-300 bg-red-50 text-red-950'
              : 'border-emerald-200 bg-emerald-50/70 text-emerald-900'
          }`}
        >
          <div className="flex items-center gap-2">
            {discrepancyPreview.exceedsThreshold ? (
              <AlertTriangle className="h-4 w-4 shrink-0 text-red-600" />
            ) : (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            )}
            <span>
              <strong>
                {discrepancyPreview.exceedsThreshold
                  ? `DISCREPANCY (> ±${thresholdKg} kg):`
                  : `Within ±${thresholdKg} kg threshold:`}
              </strong>{' '}
              Variance{' '}
              <span className="font-mono font-bold">
                {formatSignedKg(discrepancyPreview.differenceKg)}
              </span>{' '}
              vs reference {formatKg(referenceWeightKg)}
            </span>
          </div>
          <span className="font-mono text-[10px] font-bold uppercase">
            {discrepancyPreview.status}
          </span>
        </div>
      )}

      {/* Diagnostics Toggle & Live Stream */}
      <div className="flex items-center justify-between pt-0.5">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              const next = !showDiagnostics;
              setShowDiagnostics(next);
              if (bridge.bridgeOnline) bridge.toggleDiagnostics(next);
            }}
            className="inline-flex items-center gap-1 rounded border border-slate-300 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100"
          >
            <Terminal className="h-3 w-3" />
            <span>{showDiagnostics ? 'Hide Serial Diagnostics' : 'Serial Diagnostics'}</span>
          </button>

          {isConnected && (
            <button
              type="button"
              onClick={bridge.reconnectScale}
              className="inline-flex items-center gap-1 rounded border border-slate-300 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Reconnect</span>
            </button>
          )}
        </div>

        <span className="text-[10px] text-slate-500">
          Live telemetry is never auto-saved; click Capture to lock weight.
        </span>
      </div>

      {showDiagnostics && (
        <div className="rounded border border-slate-300 bg-slate-950 p-2.5 font-mono text-[10px] text-slate-200">
          <div className="mb-1.5 flex items-center justify-between border-b border-slate-800 pb-1">
            <span className="font-semibold text-slate-300">
              Raw Serial Stream (ASCII / HEX / Byte Count)
            </span>
            <button
              type="button"
              onClick={bridge.clearDiagnostics}
              className="text-slate-400 hover:text-white"
            >
              Clear
            </button>
          </div>
          {bridge.diagnosticLogs.length === 0 ? (
            <div className="py-2 text-slate-500">
              Waiting for incoming bytes... (If port is open with 0 bytes, check scale TX mode or
              RS232-to-TTL level conversion.)
            </div>
          ) : (
            <div className="max-h-32 space-y-1 overflow-y-auto">
              {bridge.diagnosticLogs.map((entry) => (
                <div key={entry.id} className="border-b border-slate-900 pb-0.5">
                  <span className="text-slate-500">[{entry.timestamp.slice(11, 23)}]</span>{' '}
                  <span className="text-sky-400">
                    {entry.byteCount}B (tot {entry.totalBytes}B)
                  </span>{' '}
                  <span className="text-emerald-300">ASCII=&quot;{entry.ascii}&quot;</span>{' '}
                  <span className="text-amber-300">HEX={entry.hex}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

