// utils/hrv.ts

export function calculateHRV(hrSeries: number[]): number {
  if (hrSeries.length < 2) return 0;

  let sumSq = 0;
  for (let i = 1; i < hrSeries.length; i++) {
    const diff = hrSeries[i] - hrSeries[i - 1];
    sumSq += diff * diff;
  }

  return Math.round(Math.sqrt(sumSq / (hrSeries.length - 1)));
}
