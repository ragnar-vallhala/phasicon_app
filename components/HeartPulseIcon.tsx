import Animated, {
  useSharedValue,
  withRepeat,
  withTiming,
  useAnimatedStyle,
  Easing,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';

export default function HeartPulseIcon({
  bpm,
  color,
  size = 14,
}: {
  bpm: number;
  color: string;
  size?: number;
}) {
  const scale = useSharedValue(1);

  useEffect(() => {
    const interval = Math.max(400, 60000 / bpm);

    scale.value = withRepeat(
      withTiming(1.3, {
        duration: interval / 2,
        easing: Easing.out(Easing.ease),
      }),
      -1,
      true
    );
  }, [bpm]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={style}>
      <Ionicons name="heart" size={size} color={color} />
    </Animated.View>
  );
}
