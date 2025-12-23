import { View, Text, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/theme/ThemeProvider';
import SpotlightCard from '@/components/SpotlightCard';
import AlertGlow from '@/components/AlertGlow';

import { mockVitals } from '@/data/mockVitals';
import SpO2TrendChart from '@/components/SpO2TrendChart';

export default function SpO2Screen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const spo2 = mockVitals.spo2.value; // %
  const trend = mockVitals.spo2.trend;
  const status = mockVitals.spo2.status;

  const isLow = spo2 < 94;
  const isOptimal = spo2 >= 96;

  const trendColor =
    trend > 0
      ? '#3DDC97'
      : trend < 0
        ? theme.colors.alert
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
          SpO₂
        </Text>

        <Text
          style={{
            marginTop: 4,
            fontSize: 13,
            color: theme.colors.textSecondary,
          }}
        >
          Blood oxygen saturation & recovery health
        </Text>
      </View>

      {/* ---------- CURRENT SpO₂ ---------- */}
      <AlertGlow active={isLow} color="#FFD60A" intensity={0.8}>
        <SpotlightCard intensity={isLow ? 0.6 : 0.4}>
          <Text
            style={{
              fontSize: 12,
              color: theme.colors.textMuted,
              letterSpacing: 0.6,
              marginBottom: 6,
            }}
          >
            OXYGEN SATURATION
          </Text>

          <Text
            style={{
              fontSize: 42,
              fontWeight: '900',
              color: theme.colors.textPrimary,
            }}
          >
            {spo2}
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: theme.colors.textSecondary,
              }}
            >
              %
            </Text>
          </Text>

          {/* STATUS */}
          <Text
            style={{
              marginTop: 8,
              fontSize: 13,
              color: isLow
                ? theme.colors.alert
                : isOptimal
                  ? '#3DDC97'
                  : theme.colors.textSecondary,
              fontWeight: '600',
            }}
          >
            Status: {status.toLowerCase()}
          </Text>

          {/* TREND */}
          <Text
            style={{
              marginTop: 6,
              fontSize: 14,
              fontWeight: '600',
              color: trendColor,
            }}
          >
            {trend > 0 ? '▲' : trend < 0 ? '▼' : '–'}{' '}
            {Math.abs(trend)}% vs baseline
          </Text>
        </SpotlightCard>
      </AlertGlow>
      
      {/* ---------- TREND ---------- */}
      <View style={{ marginTop: theme.spacing.lg }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: '700',
            color: theme.colors.textPrimary,
            marginBottom: theme.spacing.sm,
          }}
        >
          Oxygen Saturation Trend
        </Text>

        <SpotlightCard intensity={0.35}>
          <SpO2TrendChart
            current={mockVitals.spo2Trend.current}
            previous={mockVitals.spo2Trend.previous}
            baseline={mockVitals.spo2Trend.baseline}
          />

          <Text
            style={{
              marginTop: 8,
              fontSize: 12,
              color: theme.colors.textMuted,
            }}
          >
            Solid line shows current trend · dotted line shows baseline
          </Text>
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
            What this means
          </Text>

          <Text
            style={{
              fontSize: 13,
              lineHeight: 18,
              color: theme.colors.textSecondary,
            }}
          >
            {isOptimal
              ? 'Your oxygen saturation is in the optimal range, supporting efficient energy production and recovery.'
              : isLow
                ? 'Your oxygen saturation is lower than usual. This can occur due to poor sleep, illness, altitude changes, or respiratory stress.'
                : 'Your oxygen saturation is slightly below optimal but not concerning.'}
          </Text>
        </SpotlightCard>
      </View>

      {/* ---------- RECOVERY CONTEXT ---------- */}
      <View style={{ marginTop: theme.spacing.lg }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: '700',
            color: theme.colors.textPrimary,
            marginBottom: theme.spacing.sm,
          }}
        >
          Recovery Insight
        </Text>

        <SpotlightCard intensity={0.3}>
          <Text
            style={{
              fontSize: 13,
              color: theme.colors.textSecondary,
              lineHeight: 18,
            }}
          >
            Stable SpO₂ overnight is strongly associated with good recovery,
            immune readiness, and cardiovascular health.
          </Text>
        </SpotlightCard>
      </View>

      {/* ---------- ACTIONABLE TIP ---------- */}
      <View style={{ marginTop: theme.spacing.lg }}>
        <SpotlightCard intensity={0.25}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '700',
              color: theme.colors.textPrimary,
              marginBottom: 4,
            }}
          >
            Tip
          </Text>

          <Text
            style={{
              fontSize: 13,
              color: theme.colors.textSecondary,
            }}
          >
            Nasal breathing, hydration, and quality sleep help maintain optimal
            oxygen saturation.
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
        SpO₂ is estimated using optical sensors and may vary with movement
      </Text>
    </ScrollView>
  );
}
