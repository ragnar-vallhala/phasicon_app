import { View, Text } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import SpotlightCard from '@/components/SpotlightCard';
import { mockVitals } from '@/data/mockVitals';

export default function GoalsCard() {
  const theme = useTheme();

  const steps = mockVitals.steps.value;
  const stepGoal = 10000;

  const stressOk = mockVitals.gsr.value <= mockVitals.gsr.threshold.max! * 0.7;
  const respirationOk =
    mockVitals.respiration.value >= 10 &&
    mockVitals.respiration.value <= 18;

  return (
    <SpotlightCard intensity={0.3}>
      <Text
        style={{
          fontSize: 12,
          color: theme.colors.textMuted,
          letterSpacing: 0.6,
          marginBottom: 8,
        }}
      >
        TODAY’S GOALS
      </Text>

      {/* Steps */}
      <GoalRow
        label="Steps"
        value={`${steps.toLocaleString()} / ${stepGoal.toLocaleString()}`}
        done={steps >= stepGoal}
      />

      {/* Stress */}
      <GoalRow
        label="Stress"
        value={stressOk ? 'Within range' : 'Elevated'}
        done={stressOk}
      />

      {/* Respiration */}
      <GoalRow
        label="Breathing"
        value={respirationOk ? 'Balanced' : 'Out of range'}
        done={respirationOk}
      />
    </SpotlightCard>
  );
}

function GoalRow({
  label,
  value,
  done,
}: {
  label: string;
  value: string;
  done: boolean;
}) {
  const theme = useTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 6,
      }}
    >
      <Text
        style={{
          fontSize: 13,
          color: theme.colors.textSecondary,
        }}
      >
        {label}
      </Text>

      <Text
        style={{
          fontSize: 13,
          fontWeight: '600',
          color: done ? '#3DDC97' : theme.colors.textMuted,
        }}
      >
        {value}
      </Text>
    </View>
  );
}
