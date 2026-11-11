import React, { useCallback, useEffect, useState } from 'react';
import { AlertTriangle, History, Scale } from 'lucide-react';
import {
  fetchJobExceptions,
  fetchJobMeasurements,
  updateWeighingExceptionStatus,
} from '../../lib/jobsApi';
import { formatDateTime, formatKg, formatSignedKg } from '../../lib/format';
import type {
  WeighingExceptionRecord,
  WeighingExceptionStatus,
  WeighingMeasurementRecord,
} from './types';

interface JobWeighingHistoryProps {
  jobId: string;
  refreshKey: number;
  canReviewException: boolean;
  canResolveException: boolean;
  onUpdated: (message: string) => void;
}

export const JobWeighingHistory: React.FC<JobWeighingHistoryProps> = ({
  jobId,
  refreshKey,
  canReviewException,
  canResolveException,
  onUpdated,
}) => {
  const [measurements, setMeasurements] = useState<WeighingMeasurementRecord[]>([]);
  const [exceptions, setExceptions] = useState<WeighingExceptionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [resolutionRef, setResolutionRef] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [mRows, eRows] = await Promise.all([
        fetchJobMeasurements(jobId),
        fetchJobExceptions(jobId),
      ]);
      setMeasurements(mRows);
      setExceptions(eRows);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load weighing records.');
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    void load();
  }, [load, refreshKey]);

  const handleTransition = async (
    exc: WeighingExceptionRecord,
    nextStatus: WeighingExceptionStatus
  ) => {
    setBusyId(exc.id);
    setError(null);
    try {
      await updateWeighingExceptionStatus({
        exceptionId: exc.id,
        status: nextStatus,
        resolutionRef:
          nextStatus === 'RESOLVED' || nextStatus === 'CLOSED'
            ? resolutionRef || exc.resolutionRef || 'KEEPER-DISP'
            : undefined,
        resolutionNotes: resolutionNotes || undefined,
      });
      setResolutionRef('');
      setResolutionNotes('');
      await load();
      onUpdated(`Exception marked ${nextStatus}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update exception.');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded border border-red-300 bg-red-50 px-3 py-2 text-[11px] text-red-900">
          {error}
        </div>
      )}

      {/* Discrepancy Exceptions (Phase 9) */}
      {exceptions.length > 0 && (
        <div className="space-y-2">
          <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
            <span>Discrepancy Exceptions ({exceptions.length})</span>
          </h3>

          <div className="space-y-2">
            {exceptions.map((exc) => (
              <div
                key={exc.id}
                className="space-y-2 rounded-md border border-amber-200 bg-amber-50/70 p-3 text-[11px]"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono font-bold text-amber-950">
                    {exc.direction.toUpperCase()} · {formatSignedKg(exc.differenceKg)} (threshold ±
                    {exc.thresholdKg} kg)
                  </span>
                  <span className="rounded border border-amber-300 bg-white px-2 py-0.5 font-mono text-[10px] font-bold text-amber-900">
                    {exc.status}
                  </span>
                </div>
                <div className="text-slate-700">
                  Ref: <strong className="font-mono">{formatKg(exc.referenceWeightKg)}</strong> &bull;
                  Actual: <strong className="font-mono">{formatKg(exc.actualWeightKg)}</strong> &bull;
                  Logged {formatDateTime(exc.createdAt)}
                </div>
                {exc.customsEmailRef && (
                  <div className="font-mono text-[10px] text-slate-600">
                    Customs notice: {exc.customsNotifiedTo} ({exc.customsEmailRef})
                  </div>
                )}
                {exc.resolutionRef && (
                  <div className="font-mono text-[10px] text-emerald-800">
                    Resolution: {exc.resolutionRef} {exc.resolutionNotes ? `— ${exc.resolutionNotes}` : ''}
                  </div>
                )}

                {exc.status !== 'CLOSED' && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {canReviewException && exc.status === 'DISCREPANCY' && (
                      <button
                        type="button"
                        disabled={busyId === exc.id}
                        onClick={() => void handleTransition(exc, 'UNDER_REVIEW')}
                        className="rounded border border-slate-300 bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-800 hover:bg-slate-100"
                      >
                        Mark Under Review
                      </button>
                    )}
                    {canReviewException &&
                      (exc.status === 'UNDER_REVIEW' || exc.status === 'CUSTOMS_NOTIFIED') && (
                        <button
                          type="button"
                          disabled={busyId === exc.id}
                          onClick={() => void handleTransition(exc, 'AWAITING_INSTRUCTIONS')}
                          className="rounded border border-slate-300 bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-800 hover:bg-slate-100"
                        >
                          Awaiting Customs Instructions
                        </button>
                      )}
                    {canResolveException && exc.status === 'RESOLVED' && (
                      <button
                        type="button"
                        disabled={busyId === exc.id}
                        onClick={() => void handleTransition(exc, 'CLOSED')}
                        className="rounded bg-emerald-700 px-2 py-0.5 text-[10px] font-semibold text-white hover:bg-emerald-800"
                      >
                        Close Exception
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Immutable Measurement Ledger (Phase 7) */}
      <div className="space-y-2">
        <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
          <History className="h-3.5 w-3.5 text-slate-500" />
          <span>Immutable Scale Measurement History ({measurements.length})</span>
        </h3>

        {loading ? (
          <div className="rounded border border-slate-200 bg-slate-50 p-3 text-[11px] text-slate-500">
            Loading measurement ledger…
          </div>
        ) : measurements.length === 0 ? (
          <div className="rounded border border-slate-200 bg-slate-50 p-3 text-[11px] text-slate-500">
            No detailed telemetry records logged yet (run <code>supabase_weighing_integration.sql</code>{' '}
            if migrating an existing project).
          </div>
        ) : (
          <div className="divide-y divide-slate-200 rounded-md border border-slate-200 bg-white">
            {measurements.map((m) => (
              <div key={m.id} className="space-y-1 p-2.5 text-[11px]">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <Scale className="h-3.5 w-3.5 text-[#0c323b]" />
                    <span className="font-mono font-bold text-slate-900">
                      {m.weightKg.toFixed(3)} kg
                    </span>
                    <span className="rounded bg-slate-100 px-1.5 py-0.2 font-mono text-[10px] uppercase text-slate-700">
                      {m.direction} · {m.purpose}
                    </span>
                    <span
                      className={`rounded border px-1.5 py-0.2 font-mono text-[10px] font-semibold ${
                        m.discrepancyStatus === 'DISCREPANCY'
                          ? 'border-red-200 bg-red-50 text-red-700'
                          : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {formatSignedKg(m.varianceKg)}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-500">
                    {formatDateTime(m.capturedAt)}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] text-slate-500">
                  <span>Stability: {m.stabilitySource}</span>
                  {m.comPort && <span>&bull; Port: {m.comPort}</span>}
                  {m.rawPacket && <span>&bull; Raw: &quot;{m.rawPacket}&quot;</span>}
                  {m.measuredUnit !== 'kg' && (
                    <span>
                      &bull; Orig: {m.measuredWeight} {m.measuredUnit}
                    </span>
                  )}
                </div>

                {m.correctionReason && (
                  <div className="text-[10px] text-slate-600">
                    Reason: <em>{m.correctionReason}</em>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
