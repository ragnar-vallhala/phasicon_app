import { View, Text } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import SpotlightCard from '@/components/SpotlightCard';
import AnimatedCounter from '@/components/AnimatedCounter';
import StepsTrendGraph from '@/components/StepsTrendGraph';

export default function StepsCard({
  steps,
  trend,
  range,
}: {
  steps: number;
  trend: number[];
  range: string;
}) {
  const theme = useTheme();

  return (
    <SpotlightCard intensity={0.45}>
      <Text
        style={{
          fontSize: 12,
          color: theme.colors.textMuted,
          letterSpacing: 0.6,
        }}
      >
        STEPS · {range.toUpperCase()}
      </Text>

      <View
        style={{
          flexDirection: 'row',
          marginTop: theme.spacing.sm,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Steps Counter */}
        <View>
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
        </View>

        {/* Trend Graph */}
        <StepsTrendGraph data={trend} />
      </View>
    </SpotlightCard>
  );
}
