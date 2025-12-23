import { useRouter, Stack } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/theme/ThemeProvider';

export default function PrivacyScreen() {
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <>
      <Stack.Screen
        options={{
          title: '',
          headerShown: false,
        }}
      />

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
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons
              name="arrow-back"
              size={22}
              color={theme.colors.textPrimary}
            />
          </TouchableOpacity>

          <Text
            style={{
              flex: 1,
              textAlign: 'center',
              fontSize: 16,
              fontWeight: '600',
              color: theme.colors.textPrimary,
            }}
          >
            Privacy & Security
          </Text>

          <View style={{ width: 22 }} />
        </View>

        {/* ---------- CONTENT ---------- */}
        <ScrollView
          contentContainerStyle={{
            padding: theme.spacing.lg,
            paddingBottom: theme.spacing.xl,
          }}
        >
          <Section
            title="Your Data"
            description="Your health and biometric data belongs to you. We never sell or share your personal information with third parties without your explicit consent."
          />

          <Section
            title="Face Recognition Data"
            description="Face embeddings are stored in encrypted form and are used only for authentication and security purposes. Raw images are never used for identification."
          />

          <Section
            title="Health Metrics"
            description="Vitals, activity, and health metrics are securely stored and processed to provide insights and recommendations. Only you can access your detailed data."
          />

          <Section
            title="Data Security"
            description="We use industry-standard encryption, secure storage, and access control mechanisms to protect your data from unauthorized access."
          />

          <Section
            title="Account Control"
            description="You can update, export, or request deletion of your account data at any time from the profile settings."
          />

          <View
            style={{
              marginTop: theme.spacing.lg,
              padding: theme.spacing.md,
              borderRadius: theme.radius.md,
              backgroundColor: theme.colors.surface,
            }}
          >
            <Text
              style={{
                color: theme.colors.textSecondary,
                fontSize: 12,
                lineHeight: 18,
              }}
            >
              By using this application, you agree to the handling of your data
              as described above. For any privacy-related concerns, please
              contact our support team.
            </Text>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

/* ---------------- SMALL COMPONENT ---------------- */

function Section({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const theme = useTheme();

  return (
    <View
      style={{
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.md,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
      }}
    >
      <Text
        style={{
          fontSize: 14,
          fontWeight: '600',
          color: theme.colors.textPrimary,
          marginBottom: 6,
        }}
      >
        {title}
      </Text>

      <Text
        style={{
          fontSize: 13,
          color: theme.colors.textSecondary,
          lineHeight: 20,
        }}
      >
        {description}
      </Text>
    </View>
  );
}
