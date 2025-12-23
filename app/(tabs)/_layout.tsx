import { Redirect, Tabs } from 'expo-router';
import { ActivityIndicator, View, Platform } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/contexts/axios.instance';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeProvider';

export default function TabLayout() {
  const { user } = useAuth();
  const theme = useTheme();

  const [checkingProfile, setCheckingProfile] = useState(true);
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);

  useEffect(() => {
    if (!user) {
      setCheckingProfile(false);
      return;
    }

    const checkProfile = async () => {
      try {
        await api.get(`/profiles/${user.id}`);
        setHasProfile(true);
      } catch {
        setHasProfile(false);
      } finally {
        setCheckingProfile(false);
      }
    };

    checkProfile();
  }, [user]);

  /* ---------------- Loading ---------------- */
  if (checkingProfile) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator
          size="large"
          color={theme.colors.primary}
        />
      </View>
    );
  }

  /* ---------------- Force Profile Completion ---------------- */
  if (hasProfile === false) {
    return <Redirect href="/(auth)/complete-profile" />;
  }

  /* ---------------- Tabs ---------------- */
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.card,
          height: Platform.OS === 'ios' ? 88 : 64,
        },

        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
      }}
    >
      {/* -------- Home / Dashboard -------- */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />

      {/* -------- Vitals -------- */}
      <Tabs.Screen
        name="(vitals)"
        options={{
          title: 'Vitals',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart-outline" color={color} size={size} />
          ),
        }}
      />

      {/* -------- Activity -------- */}
      <Tabs.Screen
        name="(activity)"
        options={{
          title: 'Activity',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="walk-outline" color={color} size={size} />
          ),
        }}
      />

      {/* -------- Profile -------- */}
      <Tabs.Screen
        name="(profile)"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
