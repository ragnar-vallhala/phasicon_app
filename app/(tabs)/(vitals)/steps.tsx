import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '@/theme/ThemeProvider';
import SpotlightCard from '@/components/SpotlightCard';
import AlertGlow from '@/components/AlertGlow';
import StepsTrendGraph from '@/components/StepsTrendGraph';
import AnimatedCounter from '@/components/AnimatedCounter';

import { mockSteps } from '@/data/mockSteps';
import { useRouter } from 'expo-router';

export default function StepsScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // 🔁 For now default Daily (can be wired to selector later)
  const range = 'Daily';
  const steps = mockSteps[range].total;
  const previous = mockSteps[range].previousTotal;
  const trend = mockSteps[range].trend;
  const prevTrend = mockSteps[range].previousTrend;

  const diff = steps - previous;
  const percent =
    previous === 0 ? 0 : (diff / previous) * 100;

  const isUp = percent >= 0;

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
          Steps
        </Text>

        <Text
          style={{
            marginTop: 4,
            fontSize: 13,
            color: theme.colors.textSecondary,
          }}
        >
          Daily movement & consistency
        </Text>
      </View>

      {/* ---------- TOTAL STEPS ---------- */}
      <AlertGlow active={steps < 4000} color="#6C7CFF" intensity={0.6}>
        <SpotlightCard intensity={0.45}>
          <Text
            style={{
              fontSize: 12,
              color: theme.colors.textMuted,
              letterSpacing: 0.6,
            }}
          >
            TODAY
          </Text>

          <AnimatedCounter value={steps} />

          <Text
            style={{
              fontSize: 12,
              color: theme.colors.textSecondary,
              marginTop: 4,
            }}
          >
            total steps
          </Text>

          {/* TREND */}
          <Text
            style={{
              marginTop: 8,
              fontSize: 14,
              fontWeight: '600',
              color: isUp ? '#3DDC97' : theme.colors.alert,
            }}
          >
            {isUp ? '▲' : '▼'} {Math.abs(percent).toFixed(1)}%
            <Text
              style={{
                color: theme.colors.textMuted,
                fontWeight: '400',
              }}
            >
              {' '}vs yesterday
            </Text>
          </Text>
        </SpotlightCard>
      </AlertGlow>

      {/* ---------- TREND GRAPH ---------- */}
      <View style={{ marginTop: theme.spacing.lg }}>
        <SpotlightCard intensity={0.35}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '700',
              color: theme.colors.textPrimary,
              marginBottom: theme.spacing.sm,
            }}
          >
            Movement Trend
          </Text>

          <StepsTrendGraph
            data={trend}
            previousData={prevTrend}
          />

          <Text
            style={{
              marginTop: 8,
              fontSize: 12,
              color: theme.colors.textMuted,
            }}
          >
            Comparison with previous period
          </Text>
        </SpotlightCard>
      </View>

      {/* ---------- INSIGHT ---------- */}
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
            {steps >= 7000
              ? 'Great consistency today. Regular movement improves cardiovascular health and stress resilience.'
              : 'You are moving less than usual. Short walks can significantly boost energy and recovery.'}
          </Text>
        </SpotlightCard>
      </View>

      {/* ---------- CTA ---------- */}
      <TouchableOpacity
        onPress={() => router.push('/(tabs)/(activity)')}
        style={{
          marginTop: theme.spacing.lg,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 6,
        }}
      >
        <Ionicons
          name="walk"
          size={16}
          color={theme.colors.primary}
        />
        <Text
          style={{
            fontSize: 13,
            color: theme.colors.primary,
            fontWeight: '600',
          }}
        >
          View activity breakdown
        </Text>
      </TouchableOpacity>

      {/* ---------- FOOTNOTE ---------- */}
      <Text
        style={{
          marginTop: theme.spacing.xl,
          textAlign: 'center',
          fontSize: 11,
          color: theme.colors.textMuted,
        }}
      >
        Step count is estimated using motion and visual signals
      </Text>
    </ScrollView>
  );
}
