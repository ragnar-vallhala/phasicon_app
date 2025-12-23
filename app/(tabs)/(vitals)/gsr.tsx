import { View, Text, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/theme/ThemeProvider';
import SpotlightCard from '@/components/SpotlightCard';
import GSRBand from '@/components/GSRBand';
import BreathingCoachCard from '@/components/BreathingCoachCard';

import { mockVitals } from '@/data/mockVitals';
import { isStressed } from '@/utils/stress';

export default function GSRScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const gsr = mockVitals.gsr.value;
  const trend = mockVitals.gsr.trend;
  const status = mockVitals.gsr.status;

  const stressed = isStressed({
    hr: mockVitals.heartRate.value,
    gsr,
  });

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
      {/* ---------- HEADER ---------- */}
      <View style={{ marginBottom: theme.spacing.lg }}>
        <Text
          style={{
            fontSize: 26,
            fontWeight: '800',
            color: theme.colors.textPrimary,
          }}
        >
          Stress (GSR)
        </Text>

        <Text
          style={{
            marginTop: 4,
            fontSize: 13,
            color: theme.colors.textSecondary,
          }}
        >
          Nervous system activity & emotional load
        </Text>
      </View>

      {/* ---------- CURRENT GSR ---------- */}
      <SpotlightCard intensity={0.45}>
        <Text
          style={{
            fontSize: 12,
            color: theme.colors.textMuted,
            letterSpacing: 0.6,
            marginBottom: 6,
          }}
        >
          GALVANIC SKIN RESPONSE
        </Text>

        <Text
          style={{
            fontSize: 36,
            fontWeight: '900',
            color: theme.colors.textPrimary,
          }}
        >
          {gsr.toFixed(2)}{' '}
          <Text
            style={{
              fontSize: 14,
              fontWeight: '500',
              color: theme.colors.textSecondary,
            }}
          >
            µS
          </Text>
        </Text>

        {/* GSR Band */}
        <View style={{ marginTop: 12 }}>
          <GSRBand value={gsr} />
        </View>

        {/* Status */}
        <Text
          style={{
            marginTop: 8,
            fontSize: 13,
            color: theme.colors.textMuted,
          }}
        >
          Status: {status.toLowerCase()}
        </Text>

        {/* Trend */}
        <Text
          style={{
            marginTop: 6,
            fontSize: 14,
            fontWeight: '600',
            color: trendColor,
          }}
        >
          {trend > 0 ? '▲' : trend < 0 ? '▼' : '–'} {Math.abs(trend)} µS vs baseline
        </Text>
      </SpotlightCard>

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
            {stressed
              ? 'Your skin conductance is elevated, indicating heightened sympathetic nervous system activity. This often correlates with stress, anxiety, or mental overload.'
              : 'Your skin conductance is stable, suggesting a calm and regulated nervous system.'}
          </Text>
        </SpotlightCard>
      </View>

      {/* ---------- BREATHING COACH ---------- */}
      <View style={{ marginTop: theme.spacing.lg }}>
        <BreathingCoachCard stressed={stressed} />
      </View>

      {/* ---------- RECENT SPIKES ---------- */}
      <View style={{ marginTop: theme.spacing.lg }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: '700',
            color: theme.colors.textPrimary,
            marginBottom: theme.spacing.sm,
          }}
        >
          Recent Spikes
        </Text>

        <SpotlightCard intensity={0.3}>
          <Text
            style={{
              fontSize: 13,
              color: theme.colors.textSecondary,
              lineHeight: 18,
            }}
          >
            • 12:06 PM — Sudden rise (+0.21 µS){'\n'}
            • 09:47 AM — Gradual increase (+0.14 µS)
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
        GSR reflects autonomic nervous system activity and emotional arousal
      </Text>
    </ScrollView>
  );
}
