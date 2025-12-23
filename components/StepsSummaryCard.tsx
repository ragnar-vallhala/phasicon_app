import { View, Text } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import SpotlightCard from '@/components/SpotlightCard';
import AnimatedCounter from '@/components/AnimatedCounter';

export default function StepsSummaryCard({
  steps,
  previousSteps,
  range,
}: {
  steps: number;
  previousSteps: number;
  range: string;
}) {
  const theme = useTheme();

  const diff = steps - previousSteps;
  const percent =
    previousSteps === 0 ? 0 : (diff / previousSteps) * 100;

  const isUp = percent >= 0;

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

      <View style={{ marginTop: theme.spacing.sm }}>
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

        <Text
          style={{
            marginTop: 8,
            fontSize: 13,
            fontWeight: '600',
            color: isUp
              ? '#3DDC97'
              : theme.colors.alert,
          }}
        >
          {isUp ? '▲' : '▼'} {Math.abs(percent).toFixed(1)}%
          <Text
            style={{
              color: theme.colors.textMuted,
              fontWeight: '400',
            }}
          >
            {' '}vs previous
          </Text>
        </Text>
      </View>
    </SpotlightCard>
  );
}
