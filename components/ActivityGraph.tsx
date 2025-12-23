import { View, Text } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

export default function ActivityGraph({
  data,
}: {
  data: Record<string, number>;
}) {
  const theme = useTheme();

  const max = Math.max(...Object.values(data));

  return (
    <View
      style={{
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.md,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
      }}
    >
      <Text
        style={{
          fontSize: 14,
          fontWeight: '600',
          color: theme.colors.textPrimary,
          marginBottom: theme.spacing.sm,
        }}
      >
        Activity Distribution
      </Text>

      {Object.entries(data).map(([key, value]) => {
        const widthPct = (value / max) * 100;

        return (
          <View key={key} style={{ marginBottom: 10 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 4,
              }}
            >
              <Text style={{ color: theme.colors.textSecondary }}>
                {key.toUpperCase()}
              </Text>
              <Text style={{ color: theme.colors.textSecondary }}>
                {Math.round(value / 60)}h
              </Text>
            </View>

            <View
              style={{
                height: 8,
                borderRadius: 4,
                backgroundColor: theme.colors.card,
                overflow: 'hidden',
              }}
            >
              <View
                style={{
                  height: '100%',
                  width: `${widthPct}%`,
                  backgroundColor: theme.colors.primary,
                }}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
}
