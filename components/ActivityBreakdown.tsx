import { View, Text } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { formatLabel } from '@/utils/formatLabel';
import { formatDuration } from '@/utils/formatDuration';

type ActivityAgg = {
  activity: string;
  seconds: number;
};

export default function ActivityBreakdown({
  data,
}: {
  data: Record<string, ActivityAgg>;
}) {
  const theme = useTheme();

  const sorted = Object.values(data)
    .filter(item => item.seconds > 0)
    .sort((a, b) => b.seconds - a.seconds);

  return (
    <View
      style={{
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.md,
        padding: theme.spacing.md,
      }}
    >
      {sorted.length === 0 ? (
        <Text
          style={{
            textAlign: 'center',
            color: theme.colors.textMuted,
            fontSize: 13,
            paddingVertical: theme.spacing.md,
          }}
        >
          No activity detected in this time range
        </Text>
      ) : (
        sorted.map(item => (
          <View
            key={item.activity}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: 6,
            }}
          >
            <Text style={{ color: theme.colors.textPrimary }}>
              {formatLabel(item.activity)}
            </Text>

            <Text style={{ color: theme.colors.textSecondary }}>
              {formatDuration(item.seconds)}
            </Text>
          </View>
        ))
      )}
    </View>
  );
}
