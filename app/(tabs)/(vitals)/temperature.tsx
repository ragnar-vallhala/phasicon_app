import { View, Text, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/theme/ThemeProvider';
import SpotlightCard from '@/components/SpotlightCard';
import TemperatureTrendChart from '@/components/TemperatureTrendChart';

import { mockVitals } from '@/data/mockVitals';

export default function TemperatureScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const temp = mockVitals.temperature.value;
  const trend = mockVitals.temperature.trend;
  const status = mockVitals.temperature.status;
  const baseline = mockVitals.temperature.baseline;

  const trendColor =
    trend > 0
      ? theme.colors.alert
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
      {/* Header */}
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
          Core body temperature & regulation
        </Text>
      </View>

      {/* Current Temperature */}
      <SpotlightCard intensity={0.45}>
        <Text
          style={{
            fontSize: 12,
            color: theme.colors.textMuted,
            letterSpacing: 0.6,
            marginBottom: 6,
          }}
        >
          BODY TEMPERATURE
        </Text>

        <Text
          style={{
            fontSize: 36,
            fontWeight: '900',
            color: theme.colors.textPrimary,
          }}
        >
          {temp.toFixed(1)}{' '}
          <Text
            style={{
              fontSize: 14,
              fontWeight: '500',
              color: theme.colors.textSecondary,
            }}
          >
            °C
          </Text>
        </Text>

        <Text
          style={{
            marginTop: 8,
            fontSize: 13,
            color: theme.colors.textMuted,
          }}
        >
          Status: {status.toLowerCase()}
        </Text>

        <Text
          style={{
            marginTop: 6,
            fontSize: 14,
            fontWeight: '600',
            color: trendColor,
          }}
        >
          {trend > 0 ? '▲' : trend < 0 ? '▼' : '–'} {Math.abs(trend).toFixed(1)}°C
          vs baseline
        </Text>
      </SpotlightCard>

      {/* Temperature Trend */}
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
            Temperature Trend
          </Text>

          <TemperatureTrendChart
            data={mockVitals.temperature.trends.Daily}
            baseline={baseline}
          />
        </SpotlightCard>
      </View>

      {/* Interpretation */}
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
            Interpretation
          </Text>

          <Text
            style={{
              fontSize: 13,
              lineHeight: 18,
              color: theme.colors.textSecondary,
            }}
          >
            Your body temperature is close to baseline, indicating stable
            thermoregulation. Minor fluctuations throughout the day are normal.
          </Text>
        </SpotlightCard>
      </View>

      {/* Footnote */}
      <Text
        style={{
          marginTop: theme.spacing.xl,
          textAlign: 'center',
          fontSize: 11,
          color: theme.colors.textMuted,
        }}
      >
        Body temperature reflects metabolic activity and immune response
      </Text>
    </ScrollView>
  );
}
