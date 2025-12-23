import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  withRepeat,
  Easing,
  useAnimatedStyle,
  runOnJS,
  interpolate,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { useTheme } from '@/theme/ThemeProvider';
import SpotlightCard from '@/components/SpotlightCard';

const SESSION_SECONDS = 60;
const CYCLE_MS = 4200;

export default function BreathingCoachCard({
  stressed,
}: {
  stressed: boolean;
}) {
  const theme = useTheme();
  const [active, setActive] = useState(false);
  const [phase, setPhase] = useState<'Inhale' | 'Exhale'>('Inhale');
  const [seconds, setSeconds] = useState(SESSION_SECONDS);

  /* ---------- SHARED VALUES ---------- */
  const scale = useSharedValue(1);
  const glow = useSharedValue(0.25);
  const halo = useSharedValue(0.4);
  const breathProgress = useSharedValue(0); // New: For syncing light emission
  const lightIntensity = useSharedValue(0.3); // New: Constant light at idle
  const lightRadius = useSharedValue(30); // New: Light spread radius
  const pulse = useSharedValue(0); // New: Subtle 3D pulse effect

  const accent = stressed ? '#6BFFC1' : '#2EEA8C';

  /* ---------- HAPTICS ---------- */
  const inhaleHaptic = () =>
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  const exhaleHaptic = () =>
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

  /* ---------- BREATH LOOP ---------- */
  useEffect(() => {
    if (!active) {
      // Reset all animations to idle state
      scale.value = withTiming(1);
      glow.value = withTiming(0.25);
      halo.value = withTiming(0.4);
      breathProgress.value = withTiming(0);
      lightIntensity.value = withTiming(0.3); // Constant light at idle
      lightRadius.value = withTiming(30); // Base light radius
      pulse.value = withTiming(0);
      setPhase('Inhale');
      setSeconds(SESSION_SECONDS);
      return;
    }

    // Breathing animation with continuous progress
    breathProgress.value = withRepeat(
      withTiming(1, {
        duration: CYCLE_MS,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      false
    );

    scale.value = withRepeat(
      withTiming(1.18, {
        duration: CYCLE_MS,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );

    // Subtle 3D pulse effect
    pulse.value = withRepeat(
      withTiming(1, {
        duration: CYCLE_MS / 2,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );

    // Light emission synchronized with breathing
    lightIntensity.value = withRepeat(
      withTiming(0.8, {
        duration: CYCLE_MS,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );

    // Light radius expands and contracts with breathing
    lightRadius.value = withRepeat(
      withTiming(60, {
        duration: CYCLE_MS,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );

    glow.value = withRepeat(
      withTiming(0.55, { duration: CYCLE_MS }),
      -1,
      true
    );

    halo.value = withRepeat(
      withTiming(0.8, { duration: CYCLE_MS }),
      -1,
      true
    );

    inhaleHaptic();

    const phaseTimer = setInterval(() => {
      setPhase(p => {
        const next = p === 'Inhale' ? 'Exhale' : 'Inhale';
        runOnJS(next === 'Inhale' ? inhaleHaptic : exhaleHaptic)();
        return next;
      });
    }, CYCLE_MS);

    const timer = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) {
          setActive(false);
          return SESSION_SECONDS;
        }
        return s - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      clearInterval(phaseTimer);
    };
  }, [active]);

  /* ---------- STYLES ---------- */
  const orbStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      // Add 3D perspective effect
      { perspective: 1000 },
      { rotateY: `${pulse.value * 10}deg` },
    ],
    shadowOpacity: glow.value,
  }));

  const haloStyle = useAnimatedStyle(() => ({
    opacity: halo.value,
    transform: [{ scale: scale.value * 1.25 }],
  }));

  // New: Light emission style
  const lightEmissionStyle = useAnimatedStyle(() => ({
    opacity: lightIntensity.value,
    transform: [{ scale: scale.value * (1 + lightRadius.value / 100) }],
    shadowOpacity: interpolate(
      lightIntensity.value,
      [0.3, 0.8],
      [0.1, 0.4]
    ),
  }));

  // New: Back light (emitting from behind)
  const backLightStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      breathProgress.value,
      [0, 0.5, 1],
      [0.2, 0.6, 0.2] // Pulse with breathing
    ),
    transform: [
      { scale: 1.5 + lightIntensity.value * 0.5 },
      { translateY: -20 }, // Position behind
    ],
  }));

  // New: Orb inner glow for 3D effect
  const innerGlowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      breathProgress.value,
      [0, 0.5, 1],
      [0.1, 0.25, 0.1]
    ),
    transform: [
      { scale: 0.8 + pulse.value * 0.1 },
    ],
  }));

  /* ---------- UI ---------- */
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={() => setActive(a => !a)}>
      <SpotlightCard intensity={stressed ? 0.65 : 0.45}>
        <Text
          style={{
            fontSize: 12,
            letterSpacing: 0.6,
            color: stressed ? accent : theme.colors.textMuted,
          }}
        >
          BREATHING COACH
        </Text>

        {/* ---------- 3D ORB ZONE ---------- */}
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginVertical: theme.spacing.xl,
            height: 240, // Fixed height for proper layering
          }}
        >
          {/* BACK LIGHT EMISSION (constant at idle, synced when active) */}
          <Animated.View
            style={[
              {
                position: 'absolute',
                width: 220,
                height: 220,
                borderRadius: 110,
                backgroundColor: accent,
                shadowColor: accent,
                shadowRadius: 80,
                shadowOffset: { width: 0, height: 0 },
                // Position behind everything
                zIndex: 0,
              },
              backLightStyle,
            ]}
          />

          {/* PRIMARY LIGHT EMISSION */}
          <Animated.View
            style={[
              {
                position: 'absolute',
                width: 180,
                height: 180,
                borderRadius: 90,
                backgroundColor: accent,
                shadowColor: accent,
                shadowRadius: 60,
                shadowOffset: { width: 0, height: 0 },
                zIndex: 1,
              },
              lightEmissionStyle,
            ]}
          />

          {/* HALO */}
          <Animated.View
            style={[
              {
                position: 'absolute',
                width: 200,
                height: 200,
                borderRadius: 100,
                backgroundColor: accent,
                shadowColor: accent,
                shadowRadius: 60,
                zIndex: 2,
              },
              haloStyle,
            ]}
          />

          {/* 3D SPHERE */}
          <Animated.View
            style={[
              {
                width: 140,
                height: 140,
                borderRadius: 70,
                backgroundColor: accent,
                opacity: 0.18,
                shadowColor: accent,
                shadowRadius: 40,
                elevation: 30,
                zIndex: 3,
                overflow: 'hidden',
              },
              orbStyle,
            ]}
          >
            {/* INNER GRADIENT FOR 3D EFFECT */}
            <Animated.View
              style={[
                {
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  borderRadius: 70,
                  backgroundColor: '#FFFFFF',
                  zIndex: 4,
                },
                innerGlowStyle,
              ]}
            />

            {/* SPOTLIGHT REFLECTION */}
            <View
              style={{
                position: 'absolute',
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: '#FFFFFF',
                opacity: 0.12,
                top: 15,
                left: 15,
                transform: [{ rotate: '45deg' }],
                zIndex: 5,
              }}
            />
          </Animated.View>

          {/* LIGHT RAYS (subtle effect) */}
          <View style={{
            position: 'absolute',
            width: 240,
            height: 240,
            zIndex: 0,
          }}>
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => (
              <Animated.View
                key={index}
                style={[
                  {
                    position: 'absolute',
                    width: 2,
                    height: 80,
                    backgroundColor: accent,
                    opacity: 0.15,
                    left: '50%',
                    top: '50%',
                    transform: [
                      { translateX: -1 },
                      { translateY: -40 },
                      { rotate: `${angle}deg` },
                      { translateY: 90 },
                    ],
                  },
                ]}
              />
            ))}
          </View>

          {/* TEXT */}
          <View style={{
            position: 'absolute',
            alignItems: 'center',
            zIndex: 10, // Ensure text is on top
          }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '700',
                color: theme.colors.textPrimary,
                textShadowColor: 'rgba(255, 255, 255, 0.3)',
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 2,
              }}
            >
              {active ? phase : 'Tap to breathe'}
            </Text>

            {active && (
              <Text
                style={{
                  marginTop: 6,
                  fontSize: 13,
                  color: theme.colors.textMuted,
                }}
              >
                {seconds}s remaining
              </Text>
            )}
          </View>
        </View>

        <Text
          style={{
            textAlign: 'center',
            fontSize: 12,
            color: theme.colors.textSecondary,
          }}
        >
          {stressed
            ? 'Stress detected · guided breathing suggested'
            : '1-minute guided breathing'}
        </Text>
      </SpotlightCard>
    </TouchableOpacity>
  );
}