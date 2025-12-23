import { useEffect, useRef } from 'react';
import Svg, { Path } from 'react-native-svg';
import { Animated } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

const AnimatedPath = Animated.createAnimatedComponent(Path);

function buildPath(points: number[]): string {
  // Default empty array if invalid
  const safePoints = Array.isArray(points) ? points : [];
  
  // Return empty string for invalid data
  if (safePoints.length < 2) {
    return '';
  }
  
  const max = Math.max(...safePoints);
  const min = Math.min(...safePoints);
  const height = 90;
  const width = 260;
  const stepX = width / (safePoints.length - 1);
  const range = max - min;

  return safePoints
    .map((p, i) => {
      const x = i * stepX;
      const y = range === 0 
        ? height / 2 
        : height - ((p - min) / range) * height;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');
}

export default function StepsTrendGraph({
  current = [],
  previous = [],
}: {
  current?: number[];
  previous?: number[];
}) {
  const theme = useTheme();
  const animatedValue = useRef(new Animated.Value(0)).current;

  const currentPath = buildPath(current);
  const previousPath = buildPath(previous);

  useEffect(() => {
    if (currentPath) {
      animatedValue.setValue(0);
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 700,
        useNativeDriver: false,
      }).start();
    }
  }, [currentPath]);

  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0],
  });

  if (!currentPath && !previousPath) {
    // Return a placeholder if no data
    return (
      <Svg width={260} height={90}>
        <Path
          d="M 0 45 L 260 45"
          stroke={theme.colors.textMuted}
          strokeWidth={2}
          fill="none"
          opacity={0.3}
          strokeDasharray="5,5"
        />
      </Svg>
    );
  }

  return (
    <Svg width={260} height={90}>
      {/* Previous trend */}
      {previousPath && (
        <Path
          d={previousPath}
          stroke={theme.colors.textMuted}
          strokeWidth={2}
          fill="none"
          opacity={0.35}
        />
      )}

      {/* Current trend */}
      {currentPath && (
        <AnimatedPath
          d={currentPath}
          stroke={theme.colors.primary}
          strokeWidth={2.8}
          fill="none"
          strokeDasharray={300}
          strokeDashoffset={strokeDashoffset}
        />
      )}
    </Svg>
  );
}