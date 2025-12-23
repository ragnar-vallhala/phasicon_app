import React from 'react';
import { Text, TextInput, View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

export default function ThemedInput({
  label,
  value,
  onChange,
  keyboardType,
  editable = true,
  placeholder,
  containerStyle,
  inputStyle,
}: {
  label?: string;
  value: string;
  onChange?: (v: string) => void;
  keyboardType?: any;
  editable?: boolean;
  placeholder?: string;
  containerStyle?: any;
  inputStyle?: any;
}) {
  const theme = useTheme();

  return (
    <View style={[{ marginBottom: theme.spacing.md }, containerStyle]}>
      {label && (
        <Text
          style={{
            marginBottom: 6,
            fontSize: 13,
            color: theme.colors.textSecondary,
            fontWeight: '500',
          }}
        >
          {label}
        </Text>
      )}

      <TextInput
        value={value}
        onChangeText={onChange}
        editable={editable}
        keyboardType={keyboardType}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textMuted}
        style={[
          {
            backgroundColor: theme.colors.surface,
            borderWidth: 1,
            borderColor: theme.colors.card,
            borderRadius: theme.radius.md,
            padding: 14,
            fontSize: 16,
            color: theme.colors.textPrimary,
          },
          inputStyle,
        ]}
      />
    </View>
  );
}
