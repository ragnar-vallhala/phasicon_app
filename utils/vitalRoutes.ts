export const VITAL_ROUTES = {
  'Heart Rate': '/(tabs)/(vitals)/heart-rate',
  'SpO₂': '/(tabs)/(vitals)/spo2',
  'GSR': '/(tabs)/(vitals)/gsr',
  'Respiration': '/(tabs)/(vitals)/respiration',
  'Temperature': '/(tabs)/(vitals)/temperature',
  'Steps': '/(tabs)/(vitals)/steps',
} as const;

export type VitalLabel = keyof typeof VITAL_ROUTES;
export type VitalRoute = (typeof VITAL_ROUTES)[VitalLabel];
