import { View, Text, ScrollView } from 'react-native';
import { useState, useCallback, useRef } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';

import { useTheme } from '@/theme/ThemeProvider';
import TimeRangeSelector from '@/components/TimeRangeSelector';
import ActivityBreakdown from '@/components/ActivityBreakdown';
import SpotlightCard from '@/components/SpotlightCard';
import AnimatedCounter from '@/components/AnimatedCounter';
import { useAuth } from '@/contexts/AuthContext';

import { aggregateByActivity, dominantActivity } from '@/utils/aggregate';
import { fetchCameraSummary } from '@/contexts/camera.service';
import { getTimeRange } from '@/utils/timeRange';
import { calculateIdleActive } from '@/utils/calculateIdleActive';
import { formatLabel } from '@/utils/formatLabel';

type Range = 'Daily' | 'Weekly' | 'Monthly' | 'Lifetime';

type ActivityItem = {
  activity: string;
  seconds: number;
};

export default function ActivityIndex() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const USER_ID = user?.id; // TODO: move to auth context

  const [range, setRange] = useState<Range>('Daily');
  const [activityData, setActivityData] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const isFirstLoad = useRef(true);

  /* 🔁 Reset animated counters when screen gains focus */
  useFocusEffect(
    useCallback(() => {
      isFirstLoad.current = true;
    }, [])
  );

  /* 🔁 Poll server every 5 seconds */
  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      let interval: NodeJS.Timeout;

      async function loadActivity() {
        try {
          if (isFirstLoad.current) {
            setLoading(true);
          } else {
            setRefreshing(true);
          }

          const { start, end } = getTimeRange(range);
          const res = await fetchCameraSummary(USER_ID, start, end);

          if (!mounted) return;

          const normalized: ActivityItem[] = res.map(item => ({
            activity: item.activity,
            seconds: Number(item.total_seconds) || 0,
          }));

          // 🔒 Prevent unnecessary re-renders
          setActivityData(prev => {
            if (JSON.stringify(prev) === JSON.stringify(normalized)) {
              return prev;
            }
            return normalized;
          });

          isFirstLoad.current = false;
        } catch (e) {
          console.error('Failed to fetch activity summary', e);
        } finally {
          setLoading(false);
          setRefreshing(false);
        }
      }

      loadActivity(); // immediate fetch
      interval = setInterval(loadActivity, 5000);

      return () => {
        mounted = false;
        clearInterval(interval);
      };
    }, [range])
  );

  /* ---------- DERIVED DATA ---------- */

  const aggregated = aggregateByActivity(activityData);
  const dominant = dominantActivity(aggregated);

  const { activeMinutes, idleMinutes } = calculateIdleActive(
    activityData.map(item => ({
      activity: item.activity,
      total_seconds: item.seconds,
    }))
  );

  /* ---------- UI ---------- */

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
      {/* HEADER */}
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

      {/* RANGE */}
      <TimeRangeSelector
        value={range}
        onChange={setRange}
      />

      {/* DOMINANT */}
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
          {dominant ? formatLabel(dominant) : '—'}
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

      {/* INSIGHTS */}
      <View
        style={{
          flexDirection: 'row',
          marginTop: theme.spacing.lg,
          gap: theme.spacing.md,
        }}
      >
        <InsightCard label="Active Time" minutes={activeMinutes} />
        <InsightCard label="Idle Time" minutes={idleMinutes} />
      </View>

      {/* BREAKDOWN */}
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

        {loading ? (
          <Text style={{ color: theme.colors.textMuted }}>
            Loading activity…
          </Text>
        ) : (
          <ActivityBreakdown data={aggregated} />
        )}
      </View>

      {/* FOOTNOTE */}
      <Text
        style={{
          marginTop: theme.spacing.xl,
          textAlign: 'center',
          fontSize: 11,
          color: theme.colors.textMuted,
        }}
      >
        Classification inferred using AI visual models.
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

      <AnimatedCounter value={minutes} mode="minutes" />
    </View>
  );
}
