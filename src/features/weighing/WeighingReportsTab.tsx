import React, { useCallback, useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2, RefreshCw, Scale, Settings2 } from 'lucide-react';
import {
  fetchAllMeasurements,
  updateWeighingThreshold,
  type DashboardJob,
} from '../../lib/jobsApi';
import { formatDateTime, formatKg, formatSignedKg } from '../../lib/format';
import type { WeighingMeasurementRecord } from './types';

interface WeighingReportsTabProps {
  jobs: DashboardJob[];
  thresholdKg: number;
  canConfigureThreshold: boolean;
  onThresholdUpdated: (nextThreshold: number) => void;
}

export const WeighingReportsTab: React.FC<WeighingReportsTabProps> = ({
  jobs,
  thresholdKg,
  canConfigureThreshold,
  onThresholdUpdated,
}) => {
  const [measurements, setMeasurements] = useState<WeighingMeasurementRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [newThreshold, setNewThreshold] = useState(String(thresholdKg));
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const rows = await fetchAllMeasurements(150);
      setMeasurements(rows);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load weighing audit log.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    setNewThreshold(String(thresholdKg));
  }, [thresholdKg]);

  const jobMap = new Map(jobs.map((j) => [j.id, j]));

  const handleSaveThreshold = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setNotice(null);
    const val = Number(newThreshold);
    if (!Number.isFinite(val) || val <= 0 || val > 100) {
      setError('Threshold must be between 0.001 and 100 kg.');
      return;
    }
    if (!reason.trim()) {
      setError('Provide a statutory or operational reason for changing the threshold.');
      return;
    }

    setBusy(true);
    try {
      await updateWeighingThreshold(val, reason);
      setReason('');
      setNotice(`Discrepancy threshold updated to ±${val} kg with audit record.`);
      onThresholdUpdated(val);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update threshold.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4 p-5 text-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div>
          <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <Scale className="h-4 w-4 text-[#0c323b]" />
            <span>Weighing Audit Report &amp; Form A Reconciliation</span>
          </h2>
          <p className="mt-0.5 text-slate-500">
            Immutable scale measurements across inward receipts, reweighs, and outward delivery-zone
            verifications.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void load()}
          className="inline-flex items-center gap-1.5 rounded border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Refresh Report</span>
        </button>
      </div>

      {canConfigureThreshold && (
        <form
          onSubmit={handleSaveThreshold}
          className="grid grid-cols-1 gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3.5 sm:grid-cols-12"
        >
          <div className="sm:col-span-3">
            <label className="mb-1 flex items-center gap-1 text-[11px] font-semibold text-slate-700">
              <Settings2 className="h-3.5 w-3.5 text-slate-500" />
              <span>Discrepancy Threshold (± kg)</span>
            </label>
            <input
              type="number"
              min={0.001}
              max={100}
              step="0.1"
              value={newThreshold}
              onChange={(e) => setNewThreshold(e.target.value)}
              className="w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 font-mono text-xs text-slate-900"
            />
          </div>
          <div className="sm:col-span-6">
            <label className="mb-1 block text-[11px] font-semibold text-slate-700">
              Audit Reason (Warehouse Keeper Authorization)
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="SOP GL-BWH-SOP-01 Sec 4.1.8 default is 5 kg"
              className="w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900"
            />
          </div>
          <div className="flex items-end sm:col-span-3">
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded bg-[#0c323b] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#154652] disabled:opacity-60"
            >
              {busy ? 'Updating…' : 'Update Threshold'}
            </button>
          </div>
        </form>
      )}

      {error && (
        <div className="rounded border border-red-300 bg-red-50 px-3 py-2 text-red-900">
          {error}
        </div>
      )}
      {notice && (
        <div className="rounded border border-emerald-300 bg-emerald-50 px-3 py-2 text-emerald-900">
          {notice}
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-600">
              <th className="px-3 py-2">Timestamp</th>
              <th className="px-3 py-2">Job / BOE</th>
              <th className="px-3 py-2">Direction / Purpose</th>
              <th className="px-3 py-2">Reference</th>
              <th className="px-3 py-2">Actual</th>
              <th className="px-3 py-2">Variance</th>
              <th className="px-3 py-2">Provenance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                  Loading scale measurement records…
                </td>
              </tr>
            ) : measurements.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                  No scale measurements recorded yet.
                </td>
              </tr>
            ) : (
              measurements.map((m) => {
                const job = jobMap.get(m.jobId);
                return (
                  <tr key={m.id} className="hover:bg-slate-50">
                    <td className="px-3 py-2 font-mono text-[11px] text-slate-600">
                      {formatDateTime(m.capturedAt)}
                    </td>
                    <td className="px-3 py-2">
                      <div className="font-mono font-semibold text-slate-900">
                        {job?.jobNumber || m.jobId.slice(0, 8)}
                      </div>
                      <div className="font-mono text-[10px] text-slate-500">
                        {job?.boeNumber || '—'}
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase text-slate-700">
                        {m.direction} · {m.purpose}
                      </span>
                    </td>
                    <td className="px-3 py-2 font-mono text-slate-700">
                      {formatKg(m.referenceWeightKg)}
                    </td>
                    <td className="px-3 py-2 font-mono font-bold text-slate-900">
                      {m.weightKg.toFixed(3)} kg
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-[10px] font-bold ${
                          m.discrepancyStatus === 'DISCREPANCY'
                            ? 'border-red-200 bg-red-50 text-red-700'
                            : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        {m.discrepancyStatus === 'DISCREPANCY' ? (
                          <AlertTriangle className="h-3 w-3" />
                        ) : (
                          <CheckCircle2 className="h-3 w-3" />
                        )}
                        {formatSignedKg(m.varianceKg)}
                      </span>
                    </td>
                    <td className="px-3 py-2 font-mono text-[10px] text-slate-500">
                      <div>
                        {m.stabilitySource} {m.comPort ? `· ${m.comPort}` : ''}
                      </div>
                      {m.rawPacket && (
                        <div className="max-w-[180px] truncate" title={m.rawPacket}>
                          {m.rawPacket}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

