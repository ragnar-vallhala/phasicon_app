import React, { useEffect } from 'react';
import Animated, {
  useSharedValue,
  withRepeat,
  withTiming,
  useAnimatedStyle,
  Easing,
} from 'react-native-reanimated';
import { ViewStyle } from 'react-native';

export default function AlertGlow({
  active,
  color = '#FF3B3B',
  intensity = 1,
  children,
}: {
  active: boolean;
  color?: string;
  intensity?: number; // 0.5 – 1.5
  children: React.ReactNode;
}) {
  const pulse = useSharedValue(0);

  useEffect(() => {
    if (active) {
      pulse.value = withRepeat(
        withTiming(1, {
          duration: 1400,
          easing: Easing.inOut(Easing.sin),
        }),
        -1,
        true
      );
    } else {
      pulse.value = withTiming(0, { duration: 200 });
    }
  }, [active]);

  const glowStyle = useAnimatedStyle<ViewStyle>(() => ({
    shadowOpacity: pulse.value * 0.6 * intensity,
    shadowRadius: 18 + pulse.value * 12 * intensity,
    elevation: active ? 14 : 0,
  }));

  if (!active) return <>{children}</>;

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          shadowColor: color,
          borderRadius: 18,
        },
        glowStyle,
      ]}
    >
      {children}
    </Animated.View>
  );
}
