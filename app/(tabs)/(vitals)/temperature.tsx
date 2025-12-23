import { View, Text, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/theme/ThemeProvider';
import SpotlightCard from '@/components/SpotlightCard';
import AlertGlow from '@/components/AlertGlow';
import AnimatedCounter from '@/components/AnimatedCounter';

import { mockVitals } from '@/data/mockVitals';

export default function TemperatureScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const current = mockVitals.temperature.value; // °C
  const baseline = mockVitals.temperature.baseline; // °C
  const deviation = +(current - baseline).toFixed(2);

  const elevated = deviation >= 0.5;
  const suppressed = deviation <= -0.5;

  const alertColor = elevated
    ? '#FF6B6B'
    : suppressed
    ? '#6C7CFF'
    : theme.colors.primary;

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
          Temperature
        </Text>

        <Text
          style={{
            marginTop: 4,
            fontSize: 13,
            color: theme.colors.textSecondary,
          }}
        >
          Skin temperature relative to your baseline
        </Text>
      </View>

      {/* ---------- CURRENT TEMPERATURE ---------- */}
      <AlertGlow active={elevated || suppressed} color={alertColor}>
        <SpotlightCard intensity={elevated || suppressed ? 0.6 : 0.35}>
          <Text
            style={{
              fontSize: 12,
              color: theme.colors.textMuted,
              letterSpacing: 0.6,
            }}
          >
            CURRENT
          </Text>

          <Text
            style={{
              fontSize: 32,
              fontWeight: '800',
              color: theme.colors.textPrimary,
              marginTop: 6,
            }}
          >
            {current.toFixed(2)}
            <Text
              style={{
                fontSize: 16,
                fontWeight: '500',
                color: theme.colors.textSecondary,
              }}
            >
              {' '}°C
            </Text>
          </Text>

          <Text
            style={{
              marginTop: 6,
              fontSize: 13,
              color: theme.colors.textSecondary,
            }}
          >
            Baseline: {baseline.toFixed(2)} °C
          </Text>
        </SpotlightCard>
      </AlertGlow>

      {/* ---------- BASELINE DEVIATION ---------- */}
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
            Baseline Deviation
          </Text>

          <Text
            style={{
              fontSize: 28,
              fontWeight: '800',
              color: alertColor,
            }}
          >
            {deviation > 0 ? '+' : ''}
            {deviation} °C
          </Text>

          <Text
            style={{
              marginTop: 8,
              fontSize: 13,
              color: theme.colors.textSecondary,
              lineHeight: 18,
            }}
          >
            {elevated &&
              'Elevated temperature may indicate inflammation, illness onset, or accumulated stress.'}
            {suppressed &&
              'Lower-than-usual temperature can be associated with fatigue or reduced metabolic activity.'}
            {!elevated &&
              !suppressed &&
              'Your temperature is within your normal physiological range.'}
          </Text>
        </SpotlightCard>
      </View>

      {/* ---------- CONTEXTUAL INSIGHT ---------- */}
      <View style={{ marginTop: theme.spacing.lg }}>
        <SpotlightCard intensity={0.3}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '700',
              color: theme.colors.textPrimary,
              marginBottom: 6,
            }}
          >
            Insight
          </Text>

          <Text
            style={{
              fontSize: 13,
              lineHeight: 18,
              color: theme.colors.textSecondary,
            }}
          >
            Skin temperature trends are most meaningful when tracked over time.
            Sudden deviations often precede changes in recovery, sleep quality,
            or immune response.
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
        Temperature values are relative and optimized for trend detection
      </Text>
    </ScrollView>
  );
}
