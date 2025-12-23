import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeProvider';
import SpotlightCard from '@/components/SpotlightCard';
import AlertGlow from '@/components/AlertGlow';
import HeartPulseIcon from './HeartPulseIcon';
import GSRBand from './GSRBand';

const ICON_MAP: Record<string, string> = {
  'Heart Rate': 'heart',
  'SpO₂': 'water',
  'GSR': 'pulse',
  'Respiration': 'leaf',
  'Temperature': 'thermometer',
  'Steps': 'walk',
};

function thresholdBreached(
  value: number,
  threshold?: { min?: number; max?: number }
) {
  if (!threshold) return false;
  if (threshold.min !== undefined && value < threshold.min) return true;
  if (threshold.max !== undefined && value > threshold.max) return true;
  return false;
}

export default function VitalCard({
  label,
  value,
  unit,
  trend,
  status,
  threshold,
  onPress,
}: {
  label: string;
  value: number;
  unit: string;
  trend: number;
  status: string;
  threshold?: { min?: number; max?: number };
  onPress?: () => void;
}) {
  const theme = useTheme();

  const alert = thresholdBreached(value, threshold);

  const trendColor =
    trend > 0
      ? '#3DDC97'
      : trend < 0
        ? theme.colors.alert
        : theme.colors.textMuted;

  const alertColor =
    label === 'Heart Rate'
      ? '#FF4D4D'
      : label === 'SpO₂'
        ? '#FFD60A'
        : '#FF6B6B';

  const iconName = ICON_MAP[label] ?? 'analytics';

  const spotlightColor = alert
    ? alertColor
    : status.toLowerCase().includes('normal')
      ? '#3DDC97'
      : status.toLowerCase().includes('optimal')
        ? '#3DDC97'
        : status.toLowerCase().includes('elevated')
          ? '#FFC857'
          : theme.colors.primary;

  return (
    <Pressable
      onPress={() => {
        console.log('Pressed:', label);
        onPress?.();
      }}

      disabled={!onPress}
      style={{ flex: 1 }}
    >
      <AlertGlow
        active={alert}
        color={alertColor}
        intensity={label === 'Heart Rate' ? 1.2 : 0.8}
      >
        <SpotlightCard intensity={alert ? 0.65 : 0.35} accentColor={spotlightColor} showChevron={!!onPress}>
          {/* HEADER */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            {label === 'Heart Rate' ? (
              <HeartPulseIcon bpm={value} color={theme.colors.primary} />
            ) : (
              <Ionicons
                name={iconName as any}
                size={14}
                color={theme.colors.primary}
              />
            )}

            <Text
              style={{
                fontSize: 12,
                color: theme.colors.textMuted,
                letterSpacing: 0.6,
              }}
            >
              {label.toUpperCase()}
            </Text>
          </View>

          {/* VALUE */}
          <Text
            style={{
              fontSize: 24,
              fontWeight: '800',
              color: theme.colors.textPrimary,
              marginTop: 6,
            }}
          >
            {value}{' '}
            <Text style={{ fontSize: 13, color: theme.colors.textSecondary }}>
              {unit}
            </Text>
          </Text>

          {/* TREND */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Ionicons
              name={
                trend > 0
                  ? 'trending-up'
                  : trend < 0
                    ? 'trending-down'
                    : 'remove'
              }
              size={12}
              color={trendColor}
            />
            <Text style={{ fontSize: 12, fontWeight: '600', color: trendColor }}>
              {Math.abs(trend)}
            </Text>
          </View>

          {/* STATUS / GSR */}
          {label !== 'GSR' ? (
            <Text
              style={{
                marginTop: 4,
                fontSize: 11,
                color: alert ? alertColor : theme.colors.textMuted,
              }}
            >
              Status: {status.toLowerCase()}
            </Text>
          ) : (
            <View style={{ marginTop: 4 }}>
              <GSRBand value={value} />
            </View>
          )}
        </SpotlightCard>
      </AlertGlow>
    </Pressable>
  );
}
