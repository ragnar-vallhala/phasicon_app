import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeProvider';
import SpotlightCard from '@/components/SpotlightCard';
import AnimatedCounter from '@/components/AnimatedCounter';

export default function AbnormalEventsCard({
  count,
  previousCount,
  range,
}: {
  count: number;
  previousCount: number;
  range: string;
}) {
  const theme = useTheme();

  const diff = count - previousCount;
  const isDown = diff < 0;

  const color = isDown ? '#3DDC97' : theme.colors.alert;
  const icon = isDown ? 'arrow-down' : 'arrow-up';

  return (
    <SpotlightCard intensity={0.55}>
      {/* HEADER */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <Ionicons
          name="warning-outline"
          size={14}
          color={color}
        />
        <Text
          style={{
            fontSize: 12,
            letterSpacing: 0.6,
            color: theme.colors.textMuted,
          }}
        >
          ABNORMAL EVENTS · {range.toUpperCase()}
        </Text>
      </View>

      {/* VALUE */}
      <View style={{ marginTop: theme.spacing.sm }}>
        <AnimatedCounter value={count} />
        <Text
          style={{
            fontSize: 12,
            color: theme.colors.textSecondary,
            marginTop: 4,
          }}
        >
          threshold crossings
        </Text>
      </View>

      {/* TREND */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 10,
          gap: 6,
        }}
      >
        <Ionicons name={icon as any} size={14} color={color} />
        <Text
          style={{
            fontSize: 13,
            fontWeight: '600',
            color,
          }}
        >
          {Math.abs(diff)} {isDown ? 'fewer' : 'more'}
          <Text
            style={{
              fontWeight: '400',
              color: theme.colors.textMuted,
            }}
          >
            {' '}vs previous
          </Text>
        </Text>
      </View>
    </SpotlightCard>
  );
}
