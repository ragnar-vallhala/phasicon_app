// components/StressTrendChart.tsx
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

interface StressTrendChartProps {
  data: number[];
  restingLevel: number;
  height?: number;
}

export default function StressTrendChart({
  data,
  restingLevel,
  height = 160,
}: StressTrendChartProps) {
  const theme = useTheme();
  const animatedValue = useRef(new Animated.Value(0)).current;

  const width = Dimensions.get('window').width - 48;
  const padding = 20;

  const safeData =
    Array.isArray(data) && data.length > 1
      ? data
      : Array(12)
          .fill(0)
          .map(() => restingLevel * (0.8 + Math.random() * 0.6));

  const max = Math.max(...safeData, restingLevel * 1.4);
  const min = Math.min(...safeData, restingLevel * 0.6);
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

  const peakValue = Math.max(...safeData);
  const peakIndex = safeData.indexOf(peakValue);
  const lowValue = Math.min(...safeData);
  const lowIndex = safeData.indexOf(lowValue);

  const restingY = yFromValue(restingLevel);

  useEffect(() => {
    animatedValue.setValue(0);
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 1400,
      useNativeDriver: false,
    }).start();
  }, [data]);

  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [width * 2, 0],
  });

  const pointRadius = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 5],
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

        {/* Resting Line */}
        <Line
          x1={0}
          y1={restingY}
          x2={width}
          y2={restingY}
          stroke={theme.colors.textMuted}
          strokeDasharray="4,4"
          strokeOpacity={0.4}
        />

        {/* Resting Label */}
        <Rect
          x={width - 52}
          y={restingY - 22}
          width={48}
          height={18}
          rx={6}
          fill={theme.colors.surface}
          opacity={0.9}
        />
        <SvgText
          x={width - 28}
          y={restingY - 9}
          textAnchor="middle"
          fontSize="10"
          fill={theme.colors.textMuted}
          fontWeight="600"
        >
          Resting
        </SvgText>

        {/* Trend Path */}
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
          cy={yFromValue(peakValue)}
          r={pointRadius}
          fill={theme.colors.alert}
          stroke={theme.colors.background}
          strokeWidth={2}
        />

        {/* Low */}
        <AnimatedCircle
          cx={lowIndex * stepX}
          cy={yFromValue(lowValue)}
          r={pointRadius}
          fill="#3DDC97"
          stroke={theme.colors.background}
          strokeWidth={2}
        />
      </Svg>
    </View>
  );
}
