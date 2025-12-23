import { View, TouchableOpacity, Text } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

const ranges = ['Daily', 'Weekly', 'Monthly', 'Lifetime'];

export default function TimeRangeSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const theme = useTheme();

  return (
    <View style={{ flexDirection: 'row', marginBottom: theme.spacing.md }}>
      {ranges.map(r => (
        <TouchableOpacity
          key={r}
          onPress={() => onChange(r)}
          style={{
            paddingVertical: 8,
            paddingHorizontal: 14,
            borderRadius: theme.radius.sm,
            marginRight: 8,
            backgroundColor:
              value === r
                ? theme.colors.primary
                : theme.colors.surface,
          }}
        >
          <Text
            style={{
              color:
                value === r
                  ? theme.colors.background
                  : theme.colors.textPrimary,
              fontWeight: '600',
              fontSize: 13,
            }}
          >
            {r}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
