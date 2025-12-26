import { ACTIVITY_BUCKET } from './activityBuckets';

type SummaryItem = {
  activity: string;
  total_seconds: number;
};

export function calculateIdleActive(summary: SummaryItem[]) {
  let activeSeconds = 0;
  let idleSeconds = 0;

  for (const item of summary) {
    const seconds = Number(item.total_seconds) || 0;
    const bucket = ACTIVITY_BUCKET[item.activity] ?? 'idle';

    if (bucket === 'active') {
      activeSeconds += seconds;
    } else {
      idleSeconds += seconds;
    }
  }

  return {
    activeSeconds,
    idleSeconds,
    activeMinutes: Math.round(activeSeconds / 60),
    idleMinutes: Math.round(idleSeconds / 60),
  };
}
