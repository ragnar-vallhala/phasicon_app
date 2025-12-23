import { View, Text, ScrollView } from 'react-native';
import { useState, useCallback } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';

import { useTheme } from '@/theme/ThemeProvider';
import TimeRangeSelector from '@/components/TimeRangeSelector';
import ActivityBreakdown from '@/components/ActivityBreakdown';
import SpotlightCard from '@/components/SpotlightCard';
import AnimatedCounter from '@/components/AnimatedCounter';

import StepsSummaryCard from '@/components/StepsSummaryCard';
import StepsTrendCard from '@/components/StepsTrendCard';
import { mockSteps } from '@/data/mockSteps';

import { mockActivityData } from '@/data/mockActivity';
import { aggregateByActivity, dominantActivity } from '@/utils/aggregate';

export default function ActivityIndex() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const [range, setRange] =
    useState<'Daily' | 'Weekly' | 'Monthly' | 'Lifetime'>('Daily');

  const [counterKey, setCounterKey] = useState(0);

  // 🔁 Reset counters when screen opens
  useFocusEffect(
    useCallback(() => {
      setCounterKey(prev => prev + 1);
    }, [])
  );

  // 🔁 Later filter by range
  const aggregated = aggregateByActivity(mockActivityData);
  const dominant = dominantActivity(aggregated);

  // Mock insights (minutes)
  const totalActive = 272;
  const idleTime = 370;

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
      <Text
        style={{
          fontSize: 26,
          fontWeight: '800',
          color: theme.colors.textPrimary,
        }}
      >
        Activity
      </Text>

      <Text
        style={{
          color: theme.colors.textSecondary,
          fontSize: 13,
          marginBottom: theme.spacing.md,
        }}
      >
        Vision-derived movement intelligence
      </Text>

      {/* ---------- RANGE ---------- */}
      <TimeRangeSelector
        value={range}
        onChange={(r) => {
          setRange(r);
          setCounterKey(prev => prev + 1);
        }}
      />

      {/* ---------- DOMINANT ACTIVITY ---------- */}
      <SpotlightCard intensity={0.35}>
        <Text
          style={{
            fontSize: 12,
            color: theme.colors.textMuted,
            letterSpacing: 0.6,
          }}
        >
          DOMINANT · {range.toUpperCase()}
        </Text>

        <Text
          style={{
            fontSize: 22,
            fontWeight: '800',
            color: theme.colors.textPrimary,
            marginTop: 6,
          }}
        >
          {dominant.toUpperCase()}
        </Text>

        <Text
          style={{
            marginTop: 6,
            fontSize: 13,
            color: theme.colors.textSecondary,
            lineHeight: 18,
          }}
        >
          Most frequent classified activity in the selected window.
        </Text>
      </SpotlightCard>

      {/* ---------- QUICK INSIGHTS ---------- */}
      <View
        style={{
          flexDirection: 'row',
          marginTop: theme.spacing.lg,
          gap: theme.spacing.md,
        }}
      >
        <InsightCard
          key={`active-${counterKey}`}
          label="Active Time"
          minutes={totalActive}
        />

        <InsightCard
          key={`idle-${counterKey}`}
          label="Idle Time"
          minutes={idleTime}
        />
      </View>

      {/* ---------- DISTRIBUTION ---------- */}
      <View style={{ marginTop: theme.spacing.xl }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: '700',
            color: theme.colors.textPrimary,
            marginBottom: theme.spacing.sm,
          }}
        >
          Activity Breakdown
        </Text>

        <ActivityBreakdown data={aggregated} />
      </View>
      {/* ---------- STEPS CARD ---------- */}
      <View style={{ marginTop: theme.spacing.lg, gap: theme.spacing.md }}>
        <StepsSummaryCard
          key={`steps-summary-${counterKey}-${range}`}
          steps={mockSteps[range].total}
          previousSteps={mockSteps[range].previousTotal}
          range={range}
        />

        <StepsTrendCard
          key={`steps-trend-${counterKey}-${range}`}
          trend={mockSteps[range].trend}
          previousTrend={mockSteps[range].previousTrend}
          range={range}
        />
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
        Classification inferred using on-device visual models.
      </Text>
    </ScrollView>
  );
}

/* ---------- INSIGHT CARD ---------- */

function InsightCard({
  label,
  minutes,
}: {
  label: string;
  minutes: number;
}) {
  const theme = useTheme();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.md,
        padding: theme.spacing.md,
      }}
    >
      <Text
        style={{
          fontSize: 12,
          color: theme.colors.textMuted,
          marginBottom: 6,
        }}
      >
        {label}
      </Text>

      <AnimatedCounter value={minutes} mode='minutes' />
    </View>
  );
}
