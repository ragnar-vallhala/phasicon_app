import { CameraSummaryItem } from '@/contexts/camera.service';

export function normalizeSummary(data: CameraSummaryItem[]) {
  return data.map(item => ({
    activity: item.activity,
    minutes: Math.round(item.total_seconds / 60),
    seconds: Number(item.total_seconds) || 0,

  }));
}
