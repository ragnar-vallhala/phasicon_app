import { View, Text, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/theme/ThemeProvider';
import SpotlightCard from '@/components/SpotlightCard';
import BreathingCoachCard from '@/components/BreathingCoachCard';
import RespirationTrendChart from '@/components/RespirationTrendChart';

import { mockVitals } from '@/data/mockVitals';
import { isStressed } from '@/utils/stress';

export default function RespirationScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const respiration = mockVitals.respiration.value; // breaths/min
  const trend = mockVitals.respiration.trend;
  const status = mockVitals.respiration.status;

  const stressed = isStressed({
    hr: mockVitals.heartRate.value,
    gsr: mockVitals.gsr.value,
  });

  const trendColor =
    trend > 0
      ? theme.colors.alert
      : trend < 0
      ? '#3DDC97'
      : theme.colors.textMuted;

  const breathingState =
    respiration > 18
      ? 'Rapid'
      : respiration < 10
      ? 'Slow'
      : 'Balanced';

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      contentContainerStyle={{
        paddingTop: insets.top + theme.spacing.md,
        paddingBottom: insets.bottom + theme.spacing.xl,
        paddingHorizontal: theme.spacing.lg,
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* ---------- HEADER ---------- */}
      <View style={{ marginBottom: theme.spacing.lg }}>
        <Text
          style={{
            fontSize: 26,
            fontWeight: '800',
            color: theme.colors.textPrimary,
          }}
        >
          Respiration
        </Text>

        <Text
          style={{
            marginTop: 4,
            fontSize: 13,
            color: theme.colors.textSecondary,
          }}
        >
          Breathing rhythm & nervous system balance
        </Text>
      </View>

      {/* ---------- CURRENT RESPIRATION ---------- */}
      <SpotlightCard intensity={0.45}>
        <Text
          style={{
            fontSize: 12,
            color: theme.colors.textMuted,
            letterSpacing: 0.6,
            marginBottom: 6,
          }}
        >
          BREATHING RATE
        </Text>

        <Text
          style={{
            fontSize: 36,
            fontWeight: '900',
            color: theme.colors.textPrimary,
          }}
        >
          {respiration}{' '}
          <Text
            style={{
              fontSize: 14,
              fontWeight: '500',
              color: theme.colors.textSecondary,
            }}
          >
            br/min
          </Text>
        </Text>

        <Text
          style={{
            marginTop: 8,
            fontSize: 13,
            color: theme.colors.textMuted,
          }}
        >
          State: {breathingState.toLowerCase()}
        </Text>

        <Text
          style={{
            marginTop: 6,
            fontSize: 14,
            fontWeight: '600',
            color: trendColor,
          }}
        >
          {trend > 0 ? '▲' : trend < 0 ? '▼' : '–'} {Math.abs(trend)} br/min vs
          baseline
        </Text>
      </SpotlightCard>

      {/* ---------- RESPIRATION TREND ---------- */}
      <View style={{ marginTop: theme.spacing.lg }}>
        <SpotlightCard intensity={0.35}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '700',
              color: theme.colors.textPrimary,
              marginBottom: 8,
            }}
          >
            Respiration Trend
          </Text>

          <RespirationTrendChart
            data={mockVitals.respiration.trends.Daily}
            normalMin={mockVitals.respiration.threshold.min!}
            normalMax={mockVitals.respiration.threshold.max!}
          />
        </SpotlightCard>
      </View>

      {/* ---------- INTERPRETATION ---------- */}
      <View style={{ marginTop: theme.spacing.lg }}>
        <SpotlightCard intensity={0.35}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '700',
              color: theme.colors.textPrimary,
              marginBottom: 6,
            }}
          >
            What your breathing says
          </Text>

          <Text
            style={{
              fontSize: 13,
              lineHeight: 18,
              color: theme.colors.textSecondary,
            }}
          >
            {breathingState === 'Rapid'
              ? 'Your breathing is faster than optimal, often associated with stress, cognitive load, or anxiety.'
              : breathingState === 'Slow'
              ? 'Your breathing is slow and deep, commonly seen during relaxation or recovery.'
              : 'Your breathing rhythm is balanced, supporting calm focus and physiological stability.'}
          </Text>
        </SpotlightCard>
      </View>

      {/* ---------- BREATHING COACH ---------- */}
      <View style={{ marginTop: theme.spacing.lg }}>
        <BreathingCoachCard stressed={stressed} />
      </View>

      {/* ---------- BREATH CONSISTENCY ---------- */}
      <View style={{ marginTop: theme.spacing.lg }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: '700',
            color: theme.colors.textPrimary,
            marginBottom: theme.spacing.sm,
          }}
        >
          Rhythm Stability
        </Text>

        <SpotlightCard intensity={0.3}>
          <Text
            style={{
              fontSize: 13,
              color: theme.colors.textSecondary,
              lineHeight: 18,
            }}
          >
            Your breathing rhythm has been{' '}
            <Text style={{ color: '#3DDC97', fontWeight: '600' }}>
              consistent
            </Text>{' '}
            over the last 30 minutes, indicating stable autonomic regulation.
          </Text>
        </SpotlightCard>
      </View>

      {/* ---------- FOOTNOTE ---------- */}
      <Text
        style={{
          marginTop: theme.spacing.xl,
          textAlign: 'center',
          fontSize: 11,
          color: theme.colors.textMuted,
        }}
      >
        Breathing patterns directly influence heart rate variability and stress
      </Text>
    </ScrollView>
  );
}
