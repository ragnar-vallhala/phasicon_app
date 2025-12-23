import { View } from 'react-native';
import Svg, { Path, Line } from 'react-native-svg';
import { useTheme } from '@/theme/ThemeProvider';

/* ---------- HELPERS ---------- */

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
      const y =
        height - ((p - min) / (max - min || 1)) * height;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');
}

/* ---------- COMPONENT ---------- */

export default function HeartRateTrendChart({
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
  const paddingTop = 10;

  const allPoints = [...current, ...previous, baseline];
  const min = Math.min(...allPoints) - 3;
  const max = Math.max(...allPoints) + 3;

  const currentPath = buildPath(
    current,
    width,
    height,
    min,
    max
  );

  const previousPath = buildPath(
    previous,
    width,
    height,
    min,
    max
  );

  const baselineY =
    height - ((baseline - min) / (max - min || 1)) * height;

  return (
    <View style={{ marginTop: 12 }}>
      <Svg width={width} height={height + paddingTop}>
        {/* ---------- BASELINE ---------- */}
        <Line
          x1={0}
          x2={width}
          y1={baselineY}
          y2={baselineY}
          stroke={theme.colors.textMuted}
          strokeWidth={1}
          strokeDasharray="4 4"
          opacity={0.5}
        />

        {/* ---------- PREVIOUS TREND ---------- */}
        <Path
          d={previousPath}
          fill="none"
          stroke={theme.colors.textSecondary}
          strokeWidth={2}
          opacity={0.5}
        />

        {/* ---------- CURRENT TREND ---------- */}
        <Path
          d={currentPath}
          fill="none"
          stroke={theme.colors.primary}
          strokeWidth={3}
        />
      </Svg>
    </View>
  );
}
