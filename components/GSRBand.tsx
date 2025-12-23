import { View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

function gsrColor(value: number) {
  if (value < 1.5) return '#3DDC97';   // calm green
  if (value < 3) return '#FFD166';     // yellow
  if (value < 4.2) return '#FF9F1C';   // orange
  return '#FF4D4D';                    // red (high stress)
}

export default function GSRBand({ value }: { value: number }) {
  const theme = useTheme();

  // Normalize (0–5 µS)
  const clamped = Math.min(5, Math.max(0, value));
  const position = (clamped / 5) * 100;

  const color = gsrColor(value);

  return (
    <View style={{ marginTop: 10 }}>
      {/* Track */}
      <View
        style={{
          height: 6,
          borderRadius: 3,
          backgroundColor: theme.colors.card,
          overflow: 'hidden',
        }}
      >
        {/* Indicator */}
        <View
          style={{
            position: 'absolute',
            left: `${position}%`,
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: color,
            transform: [{ translateX: -4 }, { translateY: -1 }],
            shadowColor: color,
            shadowOpacity: 0.9,
            shadowRadius: 6,
            elevation: 6, // Android glow
          }}
        />
      </View>
    </View>
  );
}
