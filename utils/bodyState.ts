import { mockVitals } from '@/data/mockVitals';

export type BodyState =
  | 'Balanced'
  | 'Elevated'
  | 'Stressed'
  | 'Recovering';

export function getBodyState(): {
  state: BodyState;
  description: string;
  level: 'good' | 'warn' | 'alert';
} {
  const hr = mockVitals.heartRate.value;
  const gsr = mockVitals.gsr.value;
  const resp = mockVitals.respiration.value;

  const hrHigh = hr > mockVitals.heartRate.threshold.max!;
  const gsrHigh = gsr > mockVitals.gsr.threshold.max! * 0.6;
  const respHigh = resp > mockVitals.respiration.threshold.max!;

  if (hrHigh && gsrHigh) {
    return {
      state: 'Stressed',
      description: 'Heart rate and stress levels are elevated',
      level: 'alert',
    };
  }

  if (gsrHigh || respHigh) {
    return {
      state: 'Elevated',
      description: 'Your nervous system shows increased activity',
      level: 'warn',
    };
  }

  if (mockVitals.gsr.trend < 0) {
    return {
      state: 'Recovering',
      description: 'Stress levels are declining',
      level: 'good',
    };
  }

  return {
    state: 'Balanced',
    description: 'Your vitals are within personal baseline',
    level: 'good',
  };
}
