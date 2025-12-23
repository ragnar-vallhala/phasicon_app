import { useRouter } from 'expo-router';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState, useRef } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import api from '@/contexts/axios.instance';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/theme/ThemeProvider';

export default function ProfileIndex() {
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  /* ---------------- Fetch Profile ---------------- */
  const fetchProfile = async (showLoader = false) => {
    if (!user) return;

    if (showLoader) setLoading(true);

    try {
      const res = await api.get(`/profiles/${user.id}`);
      setProfile(res.data);
    } catch {
      Alert.alert('Error', 'Failed to load profile');
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  /* ---------------- Initial Load + Polling ---------------- */
  useEffect(() => {
    if (!user) return;

    // Initial fetch with loader
    fetchProfile(true);

    // Poll every 5 seconds
    intervalRef.current = setInterval(() => {
      fetchProfile(false);
    }, 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [user]);

  /* ---------------- Logout ---------------- */
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

  /* ---------------- Loading ---------------- */
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      contentContainerStyle={{
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: theme.spacing.xl,
      }}
    >
      {/* ---------- HEADER (SAFE AREA AWARE) ---------- */}
      <View
        style={{
          alignItems: 'center',
          paddingTop: insets.top + theme.spacing.lg, // ✅ FIX
          marginBottom: theme.spacing.xl,
        }}
      >
        <Image
          source={
            profile?.user_profile_picture
              ? { uri: profile.user_profile_picture }
              : require('@/assets/avatar.png')
          }
          style={{
            width: 96,
            height: 96,
            borderRadius: 48,
            marginBottom: 12,
            backgroundColor: theme.colors.surface,
          }}
        />

        <Text
          style={{
            color: theme.colors.textPrimary,
            fontSize: 20,
            fontWeight: '700',
          }}
        >
          {profile?.first_name} {profile?.last_name}
        </Text>

        <Text
          style={{
            color: theme.colors.textSecondary,
            fontSize: 13,
            marginTop: 2,
          }}
        >
          {user?.email}
        </Text>
      </View>

      {/* ---------- SECTIONS ---------- */}
      <ProfileSection title="Account">
        <ProfileItem
          icon="person-outline"
          title="Personal Information"
          onPress={() => router.push('/(tabs)/(profile)/personal')}
        />
        <ProfileItem
          icon="camera-outline"
          title="Profile Photo"
          onPress={() => router.push('/(tabs)/(profile)/face')}
        />
        <ProfileItem
          icon="shield-checkmark-outline"
          title="Privacy & Security"
          onPress={() => router.push('/(tabs)/(profile)/privacy')}
        />
      </ProfileSection>

      <ProfileSection title="Health">
        <ProfileItem
          icon="fitness-outline"
          title="Health Goals"
          onPress={() => router.push('/(tabs)/(profile)/goals')}
        />
        <ProfileItem
          icon="bed-outline"
          title="Sleep Tracking"
          onPress={() => router.push('/(tabs)/(profile)/sleep')}
        />
      </ProfileSection>

      <ProfileSection title="Preferences">
        <ProfileItem
          icon="notifications-outline"
          title="Notifications"
          onPress={() => router.push('/(tabs)/(profile)/notifications')}
        />
        <ProfileItem
          icon="settings-outline"
          title="App Settings"
          onPress={() => router.push('/(tabs)/(profile)/settings')}
        />
      </ProfileSection>

      {/* ---------- LOGOUT ---------- */}
      <TouchableOpacity
        onPress={handleLogout}
        style={{
          marginTop: theme.spacing.xl,
          padding: 16,
          borderRadius: theme.radius.md,
          backgroundColor: theme.colors.surface,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Ionicons
          name="log-out-outline"
          size={20}
          color={theme.colors.alert}
        />
        <Text
          style={{
            color: theme.colors.alert,
            fontWeight: '600',
            marginLeft: 8,
          }}
        >
          Logout
        </Text>
      </TouchableOpacity>

      <Text
        style={{
          textAlign: 'center',
          color: theme.colors.textMuted,
          fontSize: 12,
          marginTop: 20,
        }}
      >
        Version 1.0.0
      </Text>
    </ScrollView>
  );
}

/* ---------- REUSABLE COMPONENTS ---------- */

function ProfileSection({ title, children }: any) {
  const theme = useTheme();

  return (
    <View
      style={{
        marginBottom: theme.spacing.lg,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.md,
        padding: theme.spacing.md,
      }}
    >
      <Text
        style={{
          color: theme.colors.textSecondary,
          fontSize: 12,
          marginBottom: 10,
          fontWeight: '600',
        }}
      >
        {title.toUpperCase()}
      </Text>
      {children}
    </View>
  );
}

function ProfileItem({ icon, title, onPress }: any) {
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
        name={icon}
        size={20}
        color={theme.colors.primary}
        style={{ width: 26 }}
      />
      <Text
        style={{
          color: theme.colors.textPrimary,
          fontSize: 15,
          flex: 1,
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
