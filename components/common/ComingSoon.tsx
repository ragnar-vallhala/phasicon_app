import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/theme/ThemeProvider';

export default function ComingSoon({
  title,
  description,
  showBack = true,
}: {
  title: string;
  description?: string;
  showBack?: boolean;
}) {
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
    >
      {/* ---------- HEADER ---------- */}
      <View
        style={{
          paddingTop: insets.top + theme.spacing.md,
          paddingHorizontal: theme.spacing.lg,
          paddingBottom: theme.spacing.md,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        {showBack ? (
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons
              name="arrow-back"
              size={22}
              color={theme.colors.textPrimary}
            />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 22 }} />
        )}

        <Text
          style={{
            flex: 1,
            textAlign: 'center',
            fontSize: 16,
            fontWeight: '600',
            color: theme.colors.textPrimary,
          }}
        >
          {title}
        </Text>

        <View style={{ width: 22 }} />
      </View>

      {/* ---------- CONTENT ---------- */}
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: theme.spacing.xl,
        }}
      >
        <Ionicons
          name="construct-outline"
          size={64}
          color={theme.colors.textMuted}
          style={{ marginBottom: 20 }}
        />

        <Text
          style={{
            fontSize: 22,
            fontWeight: '700',
            color: theme.colors.textPrimary,
            marginBottom: 8,
            textAlign: 'center',
          }}
        >
          Coming Soon
        </Text>

        <Text
          style={{
            fontSize: 14,
            color: theme.colors.textSecondary,
            textAlign: 'center',
            lineHeight: 20,
          }}
        >
          {description ||
            'This feature is under active development and will be available in a future update.'}
        </Text>
      </View>
    </View>
  );
}
