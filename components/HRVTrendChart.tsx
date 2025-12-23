import { View } from 'react-native';
import Svg, { Path, Line } from 'react-native-svg';
import { useTheme } from '@/theme/ThemeProvider';

function buildPath(
  points: number[],
  width: number,
  height: number,
  min: number,
  max: number
) {
  const stepX = width / (points.length - 1);

  return points
    .map((p, i) => {
      const x = i * stepX;
      const y = height - ((p - min) / (max - min || 1)) * height;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');
}

export default function HRVTrendChart({
  current,
  previous,
  baseline,
}: {
  current: number[];
  previous: number[];
  baseline: number;
}) {
  const theme = useTheme();
  const width = 300;
  const height = 120;

  const all = [...current, ...previous, baseline];
  const min = Math.min(...all) - 5;
  const max = Math.max(...all) + 5;

  return (
    <View style={{ marginTop: 12 }}>
      <Svg width={width} height={height}>
        {/* Baseline */}
        <Line
          x1={0}
          x2={width}
          y1={height - ((baseline - min) / (max - min)) * height}
          y2={height - ((baseline - min) / (max - min)) * height}
          stroke={theme.colors.textMuted}
          strokeDasharray="4 4"
        />

        {/* Previous */}
        <Path
          d={buildPath(previous, width, height, min, max)}
          stroke={theme.colors.textSecondary}
          strokeWidth={2}
          fill="none"
          opacity={0.5}
        />

        {/* Current */}
        <Path
          d={buildPath(current, width, height, min, max)}
          stroke={theme.colors.primary}
          strokeWidth={3}
          fill="none"
        />
      </Svg>
    </View>
  );
}
