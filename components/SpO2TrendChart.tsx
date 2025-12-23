import { View } from 'react-native';
import Svg, { Path, Line } from 'react-native-svg';
import { useTheme } from '@/theme/ThemeProvider';

function buildPath(
  data: number[],
  width: number,
  height: number,
  min = 90,
  max = 100
) {
  const stepX = width / (data.length - 1);

  return data
    .map((v, i) => {
      const x = i * stepX;
      const y = height - ((v - min) / (max - min)) * height;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');
}

export default function SpO2TrendChart({
  current,
  previous,
  baseline = 96,
}: {
  current: number[];
  previous?: number[];
  baseline?: number;
}) {
  const theme = useTheme();

  const width = 260;
  const height = 90;

  const currentPath = buildPath(current, width, height);
  const previousPath = previous
    ? buildPath(previous, width, height)
    : null;

  const baselineY =
    height - ((baseline - 90) / (100 - 90)) * height;

  return (
    <View style={{ marginTop: 12 }}>
      <Svg width={width} height={height}>
        {/* Baseline */}
        <Line
          x1={0}
          y1={baselineY}
          x2={width}
          y2={baselineY}
          stroke={theme.colors.textMuted}
          strokeDasharray="4 4"
          strokeWidth={1}
        />

        {/* Previous trend */}
        {previousPath && (
          <Path
            d={previousPath}
            stroke={theme.colors.textMuted}
            strokeWidth={1.5}
            fill="none"
            opacity={0.4}
          />
        )}

        {/* Current trend */}
        <Path
          d={currentPath}
          stroke={theme.colors.primary}
          strokeWidth={2.5}
          fill="none"
        />
      </Svg>
    </View>
  );
}
