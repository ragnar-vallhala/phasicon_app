import { View, Text } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

export default function ActivityBreakdown({
  data,
}: {
  data: Record<string, number>;
}) {
  const theme = useTheme();

  return (
    <View
      style={{
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.md,
        padding: theme.spacing.md,
      }}
    >
      {Object.entries(data).map(([key, value]) => (
        <View
          key={key}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: 6,
          }}
        >
          <Text style={{ color: theme.colors.textPrimary }}>
            {key.toUpperCase()}
          </Text>
          <Text style={{ color: theme.colors.textSecondary }}>
            {Math.round(value / 60)} hrs
          </Text>
        </View>
      ))}
    </View>
  );
}
