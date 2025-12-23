import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/theme/ThemeProvider';

const hexToRgba = (hex: string, alpha: number) => {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
};

export default function SpotlightCard({
  children,
  intensity = 0.25,
  onPress,
  showChevron = false,
  accentColor,
}: {
  children: React.ReactNode;
  intensity?: number;
  onPress?: () => void;
  showChevron?: boolean;
  accentColor?: string;
}) {
  const theme = useTheme();
  const glow = accentColor || theme.colors.primary;

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
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
            hexToRgba(glow, intensity),
            hexToRgba(glow, 0),
          ]}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        {/* Chevron */}
        {showChevron && (
          <Text
            style={{
              position: 'absolute',
              top: 14,
              right: 14,
              fontSize: 18,
              color: theme.colors.textMuted,
            }}
          >
            ›
          </Text>
        )}

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
          hexToRgba(glow, intensity),
          hexToRgba(glow, 0),
        ]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {showChevron && (
        <Text
          style={{
            position: 'absolute',
            top: 14,
            right: 14,
            fontSize: 18,
            color: theme.colors.textMuted,
          }}
        >
          ›
        </Text>
      )}
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
