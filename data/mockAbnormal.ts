// data/mockAbnormal.ts

export type AbnormalRange = {
  count: number;
  previousCount: number;
};

export const mockAbnormal: Record<
  'Daily' | 'Weekly' | 'Monthly' | 'Lifetime',
  AbnormalRange
> = {
  Daily: {
    count: 4,
    previousCount: 7,
  },

  Weekly: {
    count: 18,
    previousCount: 22,
  },

  Monthly: {
    count: 61,
    previousCount: 54,
  },

  Lifetime: {
    count: 342,
    previousCount: 0, // no comparison baseline
  },
};
