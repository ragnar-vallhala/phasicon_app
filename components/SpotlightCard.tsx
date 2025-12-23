import { View, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/theme/ThemeProvider';

export default function SpotlightCard({
  children,
  intensity = 0.25,
  onPress,
}: {
  children: React.ReactNode;
  intensity?: number;
  onPress?: () => void;
}) {
  const theme = useTheme();

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}   // ✅ REQUIRED
        style={({ pressed }) => [
          styles.container,
          {
            backgroundColor: theme.colors.card,
            borderRadius: theme.radius.lg,
            opacity: pressed ? 0.96 : 1,
            transform: pressed ? [{ scale: 0.985 }] : [],
          },
        ]}
      >
        {/* Spotlight */}
        <LinearGradient
          colors={[
            `rgba(124,140,255,${intensity})`,
            'rgba(124,140,255,0.0)',
          ]}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        <View style={{ position: 'relative' }}>{children}</View>
      </Pressable>
    );
  }

  // ---------- Non-pressable ----------
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.card,
          borderRadius: theme.radius.lg,
        },
      ]}
    >
      <LinearGradient
        colors={[
          `rgba(124,140,255,${intensity})`,
          'rgba(124,140,255,0.0)',
        ]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <View style={{ position: 'relative' }}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    padding: 16,
  },
});
