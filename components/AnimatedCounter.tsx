import { useEffect, useState } from 'react';
import Animated, {
  useSharedValue,
  withTiming,
  Easing,
  useAnimatedReaction,
  runOnJS,
} from 'react-native-reanimated';
import { useTheme } from '@/theme/ThemeProvider';

/* ---------- JS FORMATTERS (SAFE) ---------- */

function formatMinutes(totalMinutes: number) {
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;

  const parts: string[] = [];
  if (days) parts.push(`${days}d`);
  if (hours) parts.push(`${hours}h`);
  if (minutes || parts.length === 0) parts.push(`${minutes}m`);

  return parts.join(' ');
}

function formatNumber(value: number) {
  return value.toLocaleString();
}

/* ---------- COMPONENT ---------- */

export default function AnimatedCounter({
  value,
  mode = 'number',
}: {
  value: number;
  mode?: 'minutes' | 'number';
}) {
  const theme = useTheme();

  const animated = useSharedValue(0);
  const lastEmitted = useSharedValue(-1);
  const [display, setDisplay] = useState(
    mode === 'minutes' ? '0m' : '0'
  );

  /* ---------- JS UPDATE (SAFE) ---------- */
  const updateDisplay = (v: number) => {
    setDisplay(
      mode === 'minutes'
        ? formatMinutes(v)
        : formatNumber(v)
    );
  };

  /* ---------- START ANIMATION ---------- */
  useEffect(() => {
    animated.value = 0;
    lastEmitted.value = -1;

    animated.value = withTiming(value, {
      duration: 900,
      easing: Easing.out(Easing.cubic),
    });
  }, [value, mode]);

  /* ---------- UI → JS BRIDGE ---------- */
  useAnimatedReaction(
    () => Math.floor(animated.value),
    (current) => {
      if (current !== lastEmitted.value) {
        lastEmitted.value = current;
        runOnJS(updateDisplay)(current);
      }
    }
  );

  return (
    <Animated.Text
      style={{
        fontSize: 28,
        fontWeight: '800',
        color: theme.colors.textPrimary,
        letterSpacing: 0.4,
      }}
    >
      {display}
    </Animated.Text>
  );
}
