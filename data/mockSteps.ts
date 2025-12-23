export const mockSteps = {
  Daily: {
    total: 8420,
    previousTotal: 7900,
    trend: [1200, 1600, 2000, 1800, 1820],
    previousTrend: [1000, 1500, 1700, 1600, 1700],
  },

  Weekly: {
    total: 52100,
    previousTotal: 49800,
    trend: [6500, 7200, 8000, 7400, 7600, 7800, 7600],
    previousTrend: [6000, 6800, 7500, 7000, 7200, 7400, 7300],
  },

  Monthly: {
    total: 212400,
    previousTotal: 198000,
    trend: [6800, 7200, 7400, 7600, 8000, 8200, 8400],
    previousTrend: [6500, 7000, 7200, 7400, 7600, 7800, 8000],
  },

  Lifetime: {
    total: 1248200,
    previousTotal: 1185000,
    trend: [4000, 5200, 6000, 7200, 8000, 9000, 10000],
    previousTrend: [3500, 4800, 5600, 6500, 7300, 8200, 9000],
  },
} as const;
