// utils/stress.ts

export interface StressMetrics {
  gsr: number; // Galvanic Skin Response in µS
  hr?: number; // Heart Rate in BPM
  hrv?: number; // Heart Rate Variability in ms
  userBaseline?: number; // User's personal baseline GSR
}

export interface StressLevel {
  level: 'Very Low' | 'Low' | 'Moderate' | 'High' | 'Very High' | 'Critical';
  color: string;
  description: string;
  icon: string;
  recommendations: string[];
}

/**
 * Get stress level based on GSR value with optional heart rate context
 */
export const getStressLevel = (
  metrics: StressMetrics | number
): StressLevel => {
  // Handle both number input and object input
  const gsr = typeof metrics === 'number' ? metrics : metrics.gsr;
  const hr = typeof metrics === 'object' ? metrics.hr : undefined;
  const userBaseline = typeof metrics === 'object' ? metrics.userBaseline : undefined;
  
  // Use user's baseline if provided, otherwise use default thresholds
  const baseline = userBaseline || 0.8;
  
  // Calculate relative to baseline
  const relativeToBaseline = gsr / baseline;
  
  let level: StressLevel['level'];
  let color: string;
  let description: string;
  let icon: string;
  let recommendations: string[];
  
  if (gsr < 0.3) {
    level = 'Very Low';
    color = '#4FC3F7'; // Light Blue
    description = 'Extremely relaxed, possibly fatigued';
    icon = '😴';
    recommendations = [
      'Consider light activity to increase alertness',
      'Check hydration and nutrition',
      'Ensure adequate sleep quality'
    ];
  } else if (gsr < 0.6) {
    level = 'Low';
    color = '#81C784'; // Light Green
    description = 'Calm and relaxed state';
    icon = '😌';
    recommendations = [
      'Maintain current routine',
      'Practice mindfulness to stay centered',
      'Light physical activity is beneficial'
    ];
  } else if (gsr < 1.0) {
    level = 'Moderate';
    color = '#FFB74D'; // Orange
    description = 'Normal daily stress, alert and focused';
    icon = '😊';
    recommendations = [
      'Take short breaks every 60 minutes',
      'Practice deep breathing exercises',
      'Stay hydrated throughout the day'
    ];
  } else if (gsr < 1.5) {
    level = 'High';
    color = '#FF9800'; // Dark Orange
    description = 'Elevated stress, sympathetic activation';
    icon = '😟';
    recommendations = [
      'Take a 5-minute walk outside',
      'Practice box breathing (4-7-8 technique)',
      'Consider a brief meditation session',
      'Reduce caffeine intake'
    ];
  } else if (gsr < 2.0) {
    level = 'Very High';
    color = '#F44336'; // Red
    description = 'Significant stress response';
    icon = '😰';
    recommendations = [
      'Take immediate 10-minute break',
      'Practice progressive muscle relaxation',
      'Cold water splash on face',
      'Listen to calming music',
      'Consider discussing stressors with someone'
    ];
  } else {
    level = 'Critical';
    color = '#C62828'; // Dark Red
    description = 'Extreme stress response';
    icon = '😨';
    recommendations = [
      'Stop current activity immediately',
      'Find a quiet space to sit down',
      'Practice 5-5-5 breathing (5 sec inhale, 5 hold, 5 exhale)',
      'Drink cold water',
      'Consider seeking support if this persists'
    ];
  }
  
  // Adjust based on heart rate if provided
  if (hr && hr > 100 && level !== 'Critical' && level !== 'Very High') {
    // Elevated heart rate suggests higher stress than GSR alone
    if (level === 'Moderate') level = 'High';
    if (level === 'Low') level = 'Moderate';
    
    recommendations.unshift('Heart rate elevated - focus on calming techniques');
  }
  
  // Adjust if relative to baseline is significantly different
  if (relativeToBaseline > 1.5 && level !== 'Critical' && level !== 'Very High') {
    if (level === 'Moderate') level = 'High';
    if (level === 'Low') level = 'Moderate';
    
    recommendations.unshift('Significantly above your baseline - consider stress management');
  }

  return {
    level,
    color,
    description,
    icon,
    recommendations: recommendations.slice(0, 3), // Return top 3 recommendations
  };
};

/**
 * Check if user is currently stressed based on multiple metrics
 */
export const isStressed = (metrics: { gsr: number; hr: number; hrv?: number }): boolean => {
  const stressLevel = getStressLevel(metrics.gsr);
  
  // Consider stressed if level is High or above
  if (stressLevel.level === 'High' || 
      stressLevel.level === 'Very High' || 
      stressLevel.level === 'Critical') {
    return true;
  }
  
  // Also consider stressed if HR is elevated significantly
  if (metrics.hr > 90) {
    return true;
  }
  
  // Or if HRV is very low (high stress)
  if (metrics.hrv && metrics.hrv < 40) {
    return true;
  }
  
  return false;
};

/**
 * Calculate stress recovery score (0-100)
 * Lower score means better recovery from stress
 */
export const calculateRecoveryScore = (
  currentGSR: number,
  peakGSR: number,
  timeSincePeak: number // in minutes
): number => {
  const reduction = peakGSR - currentGSR;
  const percentReduction = (reduction / peakGSR) * 100;
  
  // Weight factors
  const reductionWeight = 0.6;
  const timeWeight = 0.4;
  
  // Time factor: faster recovery gets higher score
  const timeFactor = Math.min(100, (60 / timeSincePeak) * 100);
  
  const score = (percentReduction * reductionWeight) + (timeFactor * timeWeight);
  
  return Math.min(100, Math.max(0, score));
};

/**
 * Get stress trend direction
 */
export const getStressTrend = (
  currentGSR: number,
  previousGSR: number
): 'increasing' | 'decreasing' | 'stable' => {
  const threshold = 0.1; // 0.1 µS change threshold
  
  if (currentGSR > previousGSR + threshold) {
    return 'increasing';
  } else if (currentGSR < previousGSR - threshold) {
    return 'decreasing';
  } else {
    return 'stable';
  }
};

/**
 * Get personalized stress insights based on time of day
 */
export const getTimeBasedInsights = (
  gsr: number,
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night'
): string => {
  const stressLevel = getStressLevel(gsr);
  
  const insights: Record<string, Record<StressLevel['level'], string>> = {
    morning: {
      'Very Low': 'Great start to the day! Consider light exercise to boost energy.',
      'Low': 'Calm morning. Perfect for planning your day.',
      'Moderate': 'Normal morning alertness. Good for focused work.',
      'High': 'Morning stress detected. Try starting with deep breathing.',
      'Very High': 'High morning stress. Consider delaying demanding tasks.',
      'Critical': 'Critical morning stress. Prioritize self-care immediately.',
    },
    afternoon: {
      'Very Low': 'Afternoon slump detected. Consider a short walk.',
      'Low': 'Steady afternoon. Good time for routine tasks.',
      'Moderate': 'Normal post-lunch focus. Stay hydrated.',
      'High': 'Afternoon stress building. Take a 5-minute break.',
      'Very High': 'High afternoon stress. Consider changing environment.',
      'Critical': 'Critical afternoon stress. Immediate break needed.',
    },
    evening: {
      'Very Low': 'Very relaxed evening. Perfect for winding down.',
      'Low': 'Calm evening. Good for family time or hobbies.',
      'Moderate': 'Normal evening stress. Consider relaxation techniques.',
      'High': 'Evening stress detected. Avoid stimulating activities.',
      'Very High': 'High evening stress affecting relaxation. Try meditation.',
      'Critical': 'Critical evening stress. Seek calm environment immediately.',
    },
    night: {
      'Very Low': 'Deeply relaxed. Good for quality sleep.',
      'Low': 'Calm before sleep. Avoid screens for better rest.',
      'Moderate': 'Some nighttime stress. Try reading or light stretching.',
      'High': 'Stress affecting sleep onset. Practice 4-7-8 breathing.',
      'Very High': 'High nighttime stress. Consider sleep hygiene practices.',
      'Critical': 'Critical nighttime stress. May need professional support.',
    },
  };
  
  return insights[timeOfDay][stressLevel.level];
};

// Usage examples:
// const stressLevel = getStressLevel(1.2); // Returns full stress level object
// const isStressedNow = isStressed({ gsr: 1.2, hr: 85 });
// const recoveryScore = calculateRecoveryScore(0.9, 1.5, 15);
// const trend = getStressTrend(1.1, 0.9);
// const insight = getTimeBasedInsights(0.8, 'morning');