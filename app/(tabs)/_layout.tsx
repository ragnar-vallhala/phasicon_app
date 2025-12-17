import { Redirect, Tabs } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/contexts/axios.instance';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  const { user } = useAuth();

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

  if (checkingProfile) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (hasProfile === false) {
    return <Redirect href="/(auth)/complete-profile" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />

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
