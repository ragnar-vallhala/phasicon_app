import { Text } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import SpotlightCard from '@/components/SpotlightCard';
import StepsBarChart from '@/components/StepsBarChart';
import { mockVitals } from '@/data/mockVitals';

export default function StepsCardHome() {
  const theme = useTheme();

  const stepsToday = mockVitals.steps.value;
  const goal = 10000;
  const weeklyData = mockVitals.steps.trends.Weekly;

  return (
    <SpotlightCard intensity={0.35}>
      <Text
        style={{
          fontSize: 12,
          color: theme.colors.textMuted,
          letterSpacing: 0.6,
          marginBottom: 6,
        }}
      >
        STEPS
      </Text>

      <Text
        style={{
          fontSize: 28,
          fontWeight: '900',
          color: theme.colors.textPrimary,
          marginBottom: 8,
        }}
      >
        {stepsToday.toLocaleString()}
      </Text>

      <StepsBarChart data={weeklyData} goal={goal} />

      <Text
        style={{
          marginTop: 6,
          fontSize: 12,
          color: theme.colors.textSecondary,
        }}
      >
        {stepsToday >= goal
          ? 'Daily goal achieved'
          : `${goal - stepsToday} steps to goal`}
      </Text>
    </SpotlightCard>
  );
}
