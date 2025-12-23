import { useEffect, useRef } from 'react';
import Svg, { Path } from 'react-native-svg';
import { Animated } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

const AnimatedPath = Animated.createAnimatedComponent(Path);

function buildPath(points: number[]) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const height = 90;
  const width = 260;
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

export default function StepsTrendGraph({
  current,
  previous,
}: {
  current: number[];
  previous: number[];
}) {
  const theme = useTheme();
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    animatedValue.setValue(0);
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 700,
      useNativeDriver: false,
    }).start();
  }, [current]);

  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0],
  });

  return (
    <Svg width={260} height={90}>
      {/* Previous trend (faded) */}
      <Path
        d={buildPath(previous)}
        stroke={theme.colors.textMuted}
        strokeWidth={2}
        fill="none"
        opacity={0.35}
      />

      {/* Current trend (animated) */}
      <AnimatedPath
        d={buildPath(current)}
        stroke={theme.colors.primary}
        strokeWidth={2.8}
        fill="none"
        strokeDasharray={300}
        strokeDashoffset={strokeDashoffset}
      />
    </Svg>
  );
}
