import { ActivityRecord } from '../data/mockActivity';

export function aggregateByActivity(
  records: ActivityRecord[]
): Record<string, number> {
  return records.reduce((acc, r) => {
    acc[r.activity] = (acc[r.activity] || 0) + r.durationMin;
    return acc;
  }, {} as Record<string, number>);
}

export function dominantActivity(
  aggregated: Record<string, number>
): string {
  return Object.entries(aggregated).sort(
    (a, b) => b[1] - a[1]
  )[0]?.[0] ?? 'unknown';
}
