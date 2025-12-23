import { View, Text, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/theme/ThemeProvider';
import SpotlightCard from '@/components/SpotlightCard';
import HeartPulseIcon from '@/components/HeartPulseIcon';
import HeartRateTrendChart from '@/components/HeartRateTrendChart';

import { mockVitals } from '@/data/mockVitals';
import HRVCard from '@/components/HRVCard';
import { calculateHRV } from '@/utils/hrv';

export default function HeartRateScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const hr = mockVitals.heartRate.value;
  const trend = mockVitals.heartRate.trend;
  const status = mockVitals.heartRate.status;

  const trends = mockVitals.heartRate.trends;
  const hrvCurrent = calculateHRV(
    mockVitals.heartRate.trends.Daily
  );

  const hrvPrevious = calculateHRV(
    mockVitals.heartRate.trends.Weekly
  );
  const baseline =
    trends.Lifetime.reduce((a, b) => a + b, 0) /
    trends.Lifetime.length;

  const trendColor =
    trend > 0
      ? '#FF6B6B'
      : trend < 0
        ? '#3DDC97'
        : theme.colors.textMuted;

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
          Heart Rate
        </Text>

        <Text
          style={{
            marginTop: 4,
            fontSize: 13,
            color: theme.colors.textSecondary,
          }}
        >
          Cardiac load & recovery dynamics
        </Text>
      </View>

      {/* ---------- LIVE HR ---------- */}
      <SpotlightCard intensity={0.5}>
        <View style={{ alignItems: 'center' }}>
          <HeartPulseIcon bpm={hr} color={theme.colors.primary} />

          <Text
            style={{
              fontSize: 42,
              fontWeight: '900',
              color: theme.colors.textPrimary,
              marginTop: 8,
            }}
          >
            {hr}{' '}
            <Text
              style={{
                fontSize: 16,
                fontWeight: '500',
                color: theme.colors.textSecondary,
              }}
            >
              bpm
            </Text>
          </Text>

          <Text
            style={{
              marginTop: 4,
              fontSize: 13,
              color: theme.colors.textMuted,
            }}
          >
            Status: {status.toLowerCase()}
          </Text>

          <Text
            style={{
              marginTop: 8,
              fontSize: 14,
              fontWeight: '600',
              color: trendColor,
            }}
          >
            {trend > 0 ? '▲' : trend < 0 ? '▼' : '–'} {Math.abs(trend)} bpm vs baseline
          </Text>
        </View>
      </SpotlightCard>

      {/* ---------- TREND CHART ---------- */}
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
            Trend Comparison
          </Text>

          <Text
            style={{
              fontSize: 12,
              color: theme.colors.textSecondary,
              marginBottom: theme.spacing.sm,
            }}
          >
            Current vs previous period with baseline reference
          </Text>

          <HeartRateTrendChart
            current={trends.Daily}
            previous={trends.Weekly.slice(-trends.Daily.length)}
            baseline={baseline}
          />
        </SpotlightCard>
      </View>
      {/* ---------- HRV CARD ---------- */}
      <View style={{ marginTop: theme.spacing.lg }}>
        <HRVCard
          value={hrvCurrent}
          trend={hrvCurrent - hrvPrevious}
          baseline={42}
          currentSeries={[38, 40, 41, 43, 45, 44]}
          previousSeries={[36, 37, 39, 40, 41, 42]}
        />
      </View>
      {/* ---------- INTERPRETATION ---------- */}
      <View style={{ marginTop: theme.spacing.lg }}>
        <SpotlightCard intensity={0.32}>
          <Text
            style={{
              fontSize: 15,
              fontWeight: '700',
              color: theme.colors.textPrimary,
              marginBottom: 8,
            }}
          >
            What this means
          </Text>

          <Text
            style={{
              fontSize: 13,
              lineHeight: 19,
              color: theme.colors.textSecondary,
            }}
          >
            • Heart rate reflects how hard your cardiovascular system is working
            right now. A sustained elevation above your baseline may indicate
            physical strain, emotional stress, dehydration, or fatigue.
            {'\n\n'}
            • Heart Rate Variability (HRV) represents how well your nervous system
            is adapting and recovering. Higher HRV generally signals better recovery
            and resilience, while lower HRV suggests increased stress load.
            {'\n\n'}
            • Short spikes in heart rate are normal during movement, excitement,
            or focused effort. These usually resolve quickly when recovery is adequate.
            {'\n\n'}
            • Persistent elevation in heart rate combined with reduced HRV may
            indicate incomplete recovery or prolonged sympathetic activation.
            {'\n\n'}
            • Comparing trends across days and weeks helps distinguish temporary
            stressors from patterns that may require changes in rest, hydration,
            or training load.
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
        Heart rate is continuously inferred from on-body sensors
      </Text>
    </ScrollView>
  );
}
