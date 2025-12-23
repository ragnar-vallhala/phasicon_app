import { View, Text } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import SpotlightCard from '@/components/SpotlightCard';
import StepsTrendGraph from '@/components/StepsTrendGraph';

export default function StepsTrendCard({
  trend,
  previousTrend,
  range,
}: {
  trend: number[];
  previousTrend: number[];
  range: string;
}) {
  const theme = useTheme();

  return (
    <SpotlightCard intensity={0.35}>
      <Text
        style={{
          fontSize: 12,
          color: theme.colors.textMuted,
          letterSpacing: 0.6,
        }}
      >
        STEP TREND · {range.toUpperCase()}
      </Text>

      <View style={{ marginTop: theme.spacing.md }}>
        <StepsTrendGraph
          current={trend}
          previous={previousTrend}
        />
      </View>
    </SpotlightCard>
  );
}
