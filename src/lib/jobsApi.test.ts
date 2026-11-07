import { describe, expect, it } from 'vitest';
import { deriveJobStatus } from './jobsApi';

describe('deriveJobStatus', () => {
  const base = {
    jobStatus: 'binned_and_barcoded',
    escalationTriggered: false,
    escalationResolved: false,
  };

  it('maps the normal inward lifecycle', () => {
    expect(deriveJobStatus(base)).toBe('Binned & GRA Issued');
    expect(deriveJobStatus({ ...base, jobStatus: 'space_cert_issued' })).toBe(
      'Space Cert Issued'
    );
    expect(deriveJobStatus({ ...base, jobStatus: 'vehicle_arrived' })).toBe(
      'Vehicle Arrived'
    );
    expect(deriveJobStatus({ ...base, jobStatus: 'unloaded_and_weighed' })).toBe(
      'Inspection Passed'
    );
  });

  it('prioritises an unresolved weight hold above later removal records', () => {
    expect(
      deriveJobStatus({
        ...base,
        escalationTriggered: true,
        escalationResolved: false,
        removalStatus: 'outpass_issued',
        outpassNumber: 'GL-GP-2026-AAAAAA',
        removalId: 'removal-1',
      })
    ).toBe('Weight Escalated');
  });

  it('allows a resolved hold to continue through removal', () => {
    expect(
      deriveJobStatus({
        ...base,
        escalationTriggered: true,
        escalationResolved: true,
        removalId: 'removal-1',
      })
    ).toBe('Removal Requested');
  });

  it('reflects the removal clearance sequence', () => {
    expect(deriveJobStatus({ ...base, removalId: 'removal-1' })).toBe(
      'Removal Requested'
    );
    expect(
      deriveJobStatus({ ...base, removalId: 'removal-1', ndcNumber: 'NDC-2026-AAAAAA' })
    ).toBe('NDC Cleared');
    expect(
      deriveJobStatus({
        ...base,
        removalId: 'removal-1',
        ndcNumber: 'NDC-2026-AAAAAA',
        outpassNumber: 'GL-GP-2026-AAAAAA',
      })
    ).toBe('Outpass Issued');
    expect(
      deriveJobStatus({
        ...base,
        removalId: 'removal-1',
        ndcNumber: 'NDC-2026-AAAAAA',
        outpassNumber: 'GL-GP-2026-AAAAAA',
        removalStatus: 'gate_exited',
      })
    ).toBe('Gate Out Closed');
  });

  it('treats a legacy weight hold status as escalated', () => {
    expect(
      deriveJobStatus({ ...base, jobStatus: 'weight_escalation_hold' })
    ).toBe('Weight Escalated');
  });
});
