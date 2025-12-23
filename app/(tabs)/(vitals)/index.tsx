import { View, Text, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router'; // Add this import

import { useTheme } from '@/theme/ThemeProvider';
import VitalGrid from '@/components/VitalGrid'; // Import the VitalGrid component
import BreathingCoachCard from '@/components/BreathingCoachCard';
import AbnormalEventsCard from '@/components/AbnormalEventsCard';

import { mockVitals } from '@/data/mockVitals';
import { mockAbnormal } from '@/data/mockAbnormal';
import { isStressed } from '@/utils/stress';

export default function VitalsIndex() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  /* ---------- FIXED RANGE FOR VITALS ---------- */
  const range: 'Daily' = 'Daily';

  /* ---------- STRESS DETECTION ---------- */
  const stressed = isStressed({
    hr: mockVitals.heartRate.value,
    gsr: mockVitals.gsr.value,
  });

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
        Vitals
      </Text>

      <Text
        style={{
          marginTop: 4,
          fontSize: 13,
          color: theme.colors.textSecondary,
          marginBottom: theme.spacing.lg,
        }}
      >
        Real-time physiological signals from patch
      </Text>

      {/* ---------- VITALS GRID ---------- */}
      <View style={{ marginBottom: theme.spacing.lg }}>
        <VitalGrid />
      </View>

      {/* ---------- BREATHING COACH ---------- */}
      <View style={{ marginBottom: theme.spacing.lg }}>
        <BreathingCoachCard stressed={stressed} />
      </View>

      {/* ---------- ABNORMAL EVENTS ---------- */}
      <View style={{ marginBottom: theme.spacing.lg }}>
        <AbnormalEventsCard
          count={mockAbnormal[range].count}
          previousCount={mockAbnormal[range].previousCount}
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
        Data updated continuously from on-body sensors
      </Text>
    </ScrollView>
  );
}