import { View, Text } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import SpotlightCard from '@/components/SpotlightCard';
import { getBodyState } from '@/utils/bodyState';

export default function BodyStateCard() {
  const theme = useTheme();
  const { state, description, level } = getBodyState();

  const accentColor =
    level === 'alert'
      ? theme.colors.alert
      : level === 'warn'
      ? '#FFC857'
      : '#3DDC97';

  const intensity =
    level === 'alert'
      ? 0.65
      : level === 'warn'
      ? 0.5
      : 0.35;

  return (
    <SpotlightCard
      intensity={intensity}
      accentColor={accentColor}   // ✅ glow matches state
    >
      <Text
        style={{
          fontSize: 12,
          color: theme.colors.textMuted,
          letterSpacing: 0.6,
          marginBottom: 6,
        }}
      >
        TODAY’S STATE
      </Text>

      <Text
        style={{
          fontSize: 28,
          fontWeight: '900',
          color: accentColor,      // ✅ text matches glow
        }}
      >
        {state}
      </Text>

      <Text
        style={{
          marginTop: 6,
          fontSize: 13,
          color: theme.colors.textSecondary,
        }}
      >
        {description}
      </Text>
    </SpotlightCard>
  );
}
