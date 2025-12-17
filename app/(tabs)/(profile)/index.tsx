import { useRouter } from 'expo-router';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';

import api from '@/contexts/axios.instance';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfileIndex() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        const res = await api.get(`/profiles/${user.id}`);
        setProfile(res.data);
      } catch(err:any) {
        console.log(err);
        
        Alert.alert('Error', 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
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

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* ---------- HEADER ---------- */}
      <View style={styles.header}>
        <Image
          source={
            profile?.user_profile_picture
              ? { uri: profile.user_profile_picture }
              : require('@/assets/avatar.png')
          }
          style={styles.avatar}
        />

        <Text style={styles.name}>
          {profile?.first_name} {profile?.last_name}
        </Text>

        <Text style={styles.sub}>{user?.email}</Text>
      </View>

      {/* ---------- OPTIONS ---------- */}
      <ProfileItem
        icon="person-outline"
        title="Personal Information"
        onPress={() => router.push('/(tabs)/(profile)/personal')}
      />

      <ProfileItem
        icon="camera-outline"
        title="Face & Profile Picture"
        onPress={() => router.push('/(tabs)/(profile)/face')}
      />

      <ProfileItem
        icon="settings-outline"
        title="Settings"
        onPress={() => router.push('/(tabs)/(profile)/settings')}
      />

      {/* ---------- LOGOUT ---------- */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#fff" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

/* ---------- OPTION ROW ---------- */

function ProfileItem({ icon, title, onPress }: any) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <Ionicons name={icon} size={22} />
      <Text style={styles.itemText}>{title}</Text>
      <Ionicons name="chevron-forward" size={20} />
    </TouchableOpacity>
  );
}

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  header: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#007AFF',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#eee',
    marginBottom: 10,
  },

  name: { color: '#fff', fontSize: 18, fontWeight: '600' },
  sub: { color: '#e0e0e0', marginTop: 4 },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },

  itemText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },

  logoutBtn: {
    marginTop: 30,
    marginHorizontal: 20,
    backgroundColor: '#FF3B30',
    padding: 16,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  logoutText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
});
