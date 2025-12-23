import { ActivityType } from '@/utils/types';

export type ActivityRecord = {
  timestamp: number;
  activity: ActivityType;
  durationMin: number;
};

export const mockActivityData: ActivityRecord[] = [
  { timestamp: Date.now(), activity: 'walking', durationMin: 120 },
  { timestamp: Date.now(), activity: 'sitting', durationMin: 300 },
  { timestamp: Date.now(), activity: 'running', durationMin: 45 },
  { timestamp: Date.now(), activity: 'sleeping', durationMin: 420 },
];
