import { View, Text } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import SpotlightCard from '@/components/SpotlightCard';
import HRVTrendChart from './HRVTrendChart';

export default function HRVCard({
  value,
  trend,
  baseline,
  currentSeries,
  previousSeries,
}: {
  value: number;
  trend: number;
  baseline: number;
  currentSeries: number[];
  previousSeries: number[];
}) {
  const theme = useTheme();

  const trendColor =
    trend > 0 ? '#3DDC97' : trend < 0 ? theme.colors.alert : theme.colors.textMuted;

  const status =
    value > baseline + 10
      ? 'Recovered'
      : value < baseline - 10
      ? 'Stressed'
      : 'Balanced';

  return (
    <SpotlightCard intensity={0.45}>
      <Text
        style={{
          fontSize: 12,
          color: theme.colors.textMuted,
          letterSpacing: 0.6,
        }}
      >
        HRV · RMSSD
      </Text>

      <Text
        style={{
          fontSize: 32,
          fontWeight: '900',
          color: theme.colors.textPrimary,
          marginTop: 4,
        }}
      >
        {value}{' '}
        <Text style={{ fontSize: 14, color: theme.colors.textSecondary }}>
          ms
        </Text>
      </Text>

      <Text
        style={{
          marginTop: 4,
          fontSize: 13,
          fontWeight: '600',
          color: trendColor,
        }}
      >
        {trend > 0 ? '▲' : trend < 0 ? '▼' : '–'} {Math.abs(trend)} ms vs baseline
      </Text>

      <Text
        style={{
          marginTop: 6,
          fontSize: 12,
          color: theme.colors.textMuted,
        }}
      >
        Status: {status.toLowerCase()}
      </Text>

      <HRVTrendChart
        current={currentSeries}
        previous={previousSeries}
        baseline={baseline}
      />
    </SpotlightCard>
  );
}
