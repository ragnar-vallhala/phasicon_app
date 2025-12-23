import React, { useEffect, useRef } from 'react';
import { Animated, View, Dimensions } from 'react-native';
import Svg, {
  Path,
  Line,
  Circle,
  Text as SvgText,
  Rect,
} from 'react-native-svg';
import { useTheme } from '@/theme/ThemeProvider';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface RespirationTrendChartProps {
  data: number[];
  normalMin: number;
  normalMax: number;
  height?: number;
}

export default function RespirationTrendChart({
  data,
  normalMin,
  normalMax,
  height = 150,
}: RespirationTrendChartProps) {
  const theme = useTheme();
  const animated = useRef(new Animated.Value(0)).current;

  const width = Dimensions.get('window').width - 48;
  const padding = 18;

  const safeData =
    Array.isArray(data) && data.length > 1
      ? data
      : Array(8).fill((normalMin + normalMax) / 2);

  const baseline = (normalMin + normalMax) / 2;

  const max = Math.max(...safeData, normalMax + 2);
  const min = Math.min(...safeData, normalMin - 2);
  const range = max - min || 1;

  const stepX = width / (safeData.length - 1);

  const yFromValue = (v: number) =>
    height -
    padding -
    ((v - min) / range) * (height - padding * 2);

  const path = safeData
    .map((v, i) => {
      const x = i * stepX;
      const y = yFromValue(v);
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  const peak = Math.max(...safeData);
  const peakIndex = safeData.indexOf(peak);
  const low = Math.min(...safeData);
  const lowIndex = safeData.indexOf(low);

  const baselineY = yFromValue(baseline);

  useEffect(() => {
    animated.setValue(0);
    Animated.timing(animated, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: false,
    }).start();
  }, [data]);

  const strokeDashoffset = animated.interpolate({
    inputRange: [0, 1],
    outputRange: [width * 2, 0],
  });

  const pointRadius = animated.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 4],
  });

  return (
    <View>
      <Svg width={width} height={height}>
        {/* Grid */}
        {[0.25, 0.5, 0.75].map((r) => {
          const y = padding + r * (height - padding * 2);
          return (
            <Line
              key={r}
              x1={0}
              y1={y}
              x2={width}
              y2={y}
              stroke={theme.colors.card}
              strokeOpacity={0.2}
            />
          );
        })}

        {/* Baseline */}
        <Line
          x1={0}
          y1={baselineY}
          x2={width}
          y2={baselineY}
          stroke={theme.colors.textMuted}
          strokeDasharray="4,4"
          strokeOpacity={0.4}
        />

        {/* Baseline Label */}
        <Rect
          x={width - 64}
          y={baselineY - 22}
          width={60}
          height={18}
          rx={6}
          fill={theme.colors.surface}
          opacity={0.9}
        />
        <SvgText
          x={width - 34}
          y={baselineY - 9}
          textAnchor="middle"
          fontSize="10"
          fill={theme.colors.textMuted}
          fontWeight="600"
        >
          Normal
        </SvgText>

        {/* Trend */}
        <AnimatedPath
          d={path}
          stroke={theme.colors.primary}
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={width * 2}
          strokeDashoffset={strokeDashoffset}
        />

        {/* Peak */}
        <AnimatedCircle
          cx={peakIndex * stepX}
          cy={yFromValue(peak)}
          r={pointRadius}
          fill={theme.colors.alert}
          stroke={theme.colors.background}
          strokeWidth={2}
        />

        {/* Lowest */}
        <AnimatedCircle
          cx={lowIndex * stepX}
          cy={yFromValue(low)}
          r={pointRadius}
          fill="#3DDC97"
          stroke={theme.colors.background}
          strokeWidth={2}
        />

        {/* Y Labels */}
        <SvgText
          x={8}
          y={padding - 6}
          fontSize="9"
          fill={theme.colors.textMuted}
          fontWeight="600"
        >
          {max} br/min
        </SvgText>

        <SvgText
          x={8}
          y={height - padding + 14}
          fontSize="9"
          fill={theme.colors.textMuted}
          fontWeight="600"
        >
          {min} br/min
        </SvgText>
      </Svg>
    </View>
  );
}
