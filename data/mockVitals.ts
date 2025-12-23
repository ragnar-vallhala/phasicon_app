// data/mockVitals.ts

export const mockVitals = {
  heartRate: {
    value: 130,
    unit: 'bpm',
    trend: +3,
    status: 'Normal',
    threshold: {
      min: 50,
      max: 110,
    },

    // ✅ NEW (non-breaking)
    trends: {
      Daily: [88, 92, 95, 110, 130],
      Weekly: [82, 85, 90, 94, 98, 102, 108],
      Monthly: [78, 80, 83, 85, 88, 92, 96],
      Lifetime: [72, 75, 78, 82, 86, 90],
    },
  },

  spo2: {
    value: 98,
    unit: '%',
    trend: 0,
    status: 'Optimal',
    threshold: {
      min: 92,
      max: 100,
    },

    trends: {
      Daily: [96, 97, 98, 98, 98],
      Weekly: [95, 96, 97, 98, 98, 97, 98],
      Monthly: [96, 96, 97, 97, 98, 98],
      Lifetime: [95, 96, 97, 98],
    },
  },

  gsr: {
    value: 1.2,
    unit: 'µS',
    trend: -0.08,
    status: 'Calm',
    threshold: {
      min: 0.5,
      max: 3.5,
    },

    trends: {
      Daily: [1.6, 1.4, 1.3, 1.25, 1.2],
      Weekly: [1.8, 1.6, 1.5, 1.4, 1.3],
      Monthly: [2.1, 1.9, 1.7, 1.5, 1.3],
      Lifetime: [2.4, 2.1, 1.9, 1.6],
    },
  },

  respiration: {
    value: 14,
    unit: 'br/min',
    trend: +1,
    status: 'Normal',
    threshold: {
      min: 10,
      max: 20,
    },

    trends: {
      Daily: [13, 14, 15, 14, 14],
      Weekly: [12, 13, 14, 14, 15, 14, 14],
      Monthly: [12, 13, 13, 14, 14, 15],
      Lifetime: [12, 13, 14, 14],
    },
  },

  temperature: {
    value: 36.8,
    unit: '°C',
    trend: +0.2,
    status: 'Normal',
    baseline: 36.7,
    threshold: {
      max: 38.0,
    },

    trends: {
      Daily: [36.6, 36.7, 36.8, 36.8],
      Weekly: [36.5, 36.6, 36.7, 36.8],
      Monthly: [36.4, 36.5, 36.6, 36.7],
      Lifetime: [36.2, 36.4, 36.6],
    },
  },

  steps: {
    value: 8420,
    unit: 'steps',
    trend: +6.5, // %
    status: 'Active',
    threshold: {
      min: 3000,
      max: 10000,
    },

    trends: {
      Daily: [1200, 1800, 2200, 1600, 1620],
      Weekly: [6500, 7200, 8000, 7400, 7600, 7800, 8420],
      Monthly: [18000, 22000, 26000, 31000, 36000],
      Lifetime: [5000, 15000, 30000, 60000],
    },
  },
  // data/mockVitals.ts (append only)
  spo2Trend: {
    current: [97, 96, 98, 97, 98, 97],
    previous: [96, 95, 96, 96, 97, 96],
    baseline: 96,
  },
};
