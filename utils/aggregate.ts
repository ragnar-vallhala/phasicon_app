import { ActivityRecord } from '../data/mockActivity';

export function aggregateByActivity(data: { activity: string; seconds: number }[]) {
  const acc: Record<
    string,
    { activity: string; seconds: number }
  > = {};

  for (const item of data) {
    if (!acc[item.activity]) {
      acc[item.activity] = {
        activity: item.activity,
        seconds: 0,
      };
    }

    acc[item.activity].seconds += Number(item.seconds) || 0;
  }

  return acc;
}

export function dominantActivity(
  aggregated: Record<string, { activity: string; seconds: number }>
) {
  let max = 0;
  let dominant = '';

  for (const key in aggregated) {
    const secs = aggregated[key].seconds;
    if (secs > max) {
      max = secs;
      dominant = aggregated[key].activity;
    }
  }

  return dominant;
}
