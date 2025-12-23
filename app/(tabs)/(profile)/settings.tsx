import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/theme/ThemeProvider';

/* ========================================================= */

export default function SettingsScreen() {
  const router = useRouter();
  const { logout } = useAuth();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  /* ---------------- ACTIONS ---------------- */

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action is permanent and cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Request Submitted',
              'Account deletion will be processed.'
            );
          },
        },
      ]
    );
  };

  /* ---------------- UI ---------------- */

  return (
    <SafeAreaView
      edges={['top']}
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
    >
      {/* ---------- HEADER ---------- */}
      <View
        style={{
          paddingTop: insets.top + theme.spacing.md,
          paddingBottom: theme.spacing.md,
          paddingHorizontal: theme.spacing.lg,
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
          Settings
        </Text>

        <View style={{ width: 22 }} />
      </View>

      {/* ---------- CONTENT ---------- */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: theme.spacing.xl,
        }}
      >
        {/* APPEARANCE */}
        <Section title="Appearance">
          <ThemeOption
            label="System"
            selected={theme.mode === 'system'}
            onPress={() => theme.setMode('system')}
          />
          <ThemeOption
            label="Dark"
            selected={theme.mode === 'dark'}
            onPress={() => theme.setMode('dark')}
          />
          <ThemeOption
            label="Light"
            selected={theme.mode === 'light'}
            onPress={() => theme.setMode('light')}
          />
        </Section>

        {/* PRIVACY */}
        <Section title="Privacy">
          <NavItem
            icon="document-text-outline"
            title="Privacy Policy"
            onPress={() => router.push('/privacy')}
          />
        </Section>

        {/* ACCOUNT */}
        <Section title="Account">
          <NavItem
            icon="log-out-outline"
            title="Logout"
            danger
            onPress={handleLogout}
          />
          <NavItem
            icon="trash-outline"
            title="Delete Account"
            danger
            onPress={handleDeleteAccount}
          />
        </Section>

        <Text
          style={{
            textAlign: 'center',
            color: theme.colors.textMuted,
            fontSize: 12,
            marginTop: theme.spacing.lg,
          }}
        >
          Version 1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ========================================================= */
/* ---------------- REUSABLE COMPONENTS -------------------- */
/* ========================================================= */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const theme = useTheme();

  return (
    <View
      style={{
        marginHorizontal: theme.spacing.lg,
        marginBottom: theme.spacing.lg,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.md,
        padding: theme.spacing.md,
      }}
    >
      <Text
        style={{
          fontSize: 12,
          fontWeight: '600',
          color: theme.colors.textSecondary,
          marginBottom: theme.spacing.sm,
        }}
      >
        {title.toUpperCase()}
      </Text>
      {children}
    </View>
  );
}

/* ---------------- THEME OPTION ---------------- */

function ThemeOption({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        paddingVertical: 14,
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <Text
        style={{
          flex: 1,
          fontSize: 15,
          color: theme.colors.textPrimary,
        }}
      >
        {label}
      </Text>

      {selected && (
        <Ionicons
          name="checkmark"
          size={18}
          color={theme.colors.primary}
        />
      )}
    </TouchableOpacity>
  );
}

/* ---------------- NAV ITEM ---------------- */

function NavItem({
  icon,
  title,
  onPress,
  danger,
}: {
  icon: string;
  title: string;
  onPress: () => void;
  danger?: boolean;
}) {
  const theme = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
      }}
    >
      <Ionicons
        name={icon as any}
        size={20}
        color={danger ? theme.colors.alert : theme.colors.primary}
        style={{ width: 26 }}
      />

      <Text
        style={{
          flex: 1,
          fontSize: 15,
          color: danger
            ? theme.colors.alert
            : theme.colors.textPrimary,
        }}
      >
        {title}
      </Text>

      <Ionicons
        name="chevron-forward"
        size={18}
        color={theme.colors.textMuted}
      />
    </TouchableOpacity>
  );
}
