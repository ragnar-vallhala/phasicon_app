import { useRouter } from 'expo-router';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

import api from '@/contexts/axios.instance';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfileIndex() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [healthMetrics, setHealthMetrics] = useState({
    streak: 7,
    points: 1240,
    level: 'Bronze',
  });

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        const res = await api.get(`/profiles/${user.id}`);
        setProfile(res.data);
        console.log("profile",res.data);
        
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
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={StyleSheet.absoluteFill}
        />
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Loading your health profile...</Text>
      </View>
    );
  }

  const getLevelColor = (level: string) => {
    switch(level) {
      case 'Bronze': return '#CD7F32';
      case 'Silver': return '#C0C0C0';
      case 'Gold': return '#FFD700';
      case 'Platinum': return '#E5E4E2';
      default: return '#667eea';
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* ---------- HEADER WITH GRADIENT ---------- */}
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View style={styles.avatarContainer}>
              <Image
                source={
                  profile?.user_profile_picture
                    ? { uri: profile.user_profile_picture }
                    : require('@/assets/avatar.png')
                }
                style={styles.avatar}
              />
              <View style={[styles.levelBadge, { backgroundColor: getLevelColor(healthMetrics.level) }]}>
                <Text style={styles.levelText}>{healthMetrics.level}</Text>
              </View>
            </View>

            <Text style={styles.name}>
              {profile?.first_name} {profile?.last_name}
            </Text>
            <Text style={styles.sub}>{user?.email}</Text>
            
            {/* Health Stats */}
            <View style={styles.healthStats}>
              <View style={styles.statItem}>
                <Ionicons name="flame" size={24} color="#FF6B6B" />
                <Text style={styles.statNumber}>{healthMetrics.streak}</Text>
                <Text style={styles.statLabel}>Day Streak</Text>
              </View>
              
              <View style={styles.statDivider} />
              
              <View style={styles.statItem}>
                <Ionicons name="trophy" size={24} color="#FFD166" />
                <Text style={styles.statNumber}>{healthMetrics.points}</Text>
                <Text style={styles.statLabel}>Points</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* ---------- QUICK ACTIONS ---------- */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => router.push('/(tabs)/(profile)/health-report')}
          >
            <LinearGradient
              colors={['#4ECDC4', '#44A08D']}
              style={styles.quickActionIcon}
            >
              <Ionicons name="pulse-outline" size={24} color="#fff" />
            </LinearGradient>
            <Text style={styles.quickActionText}>Health Report</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => router.push('/(tabs)/(profile)/appointments')}
          >
            <LinearGradient
              colors={['#FF9A9E', '#FAD0C4']}
              style={styles.quickActionIcon}
            >
              <Ionicons name="calendar-outline" size={24} color="#fff" />
            </LinearGradient>
            <Text style={styles.quickActionText}>Appointments</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => router.push('/(tabs)/(profile)/medications')}
          >
            <LinearGradient
              colors={['#A18CD1', '#FBC2EB']}
              style={styles.quickActionIcon}
            >
              <Ionicons name="medkit-outline" size={24} color="#fff" />
            </LinearGradient>
            <Text style={styles.quickActionText}>Medications</Text>
          </TouchableOpacity>
        </View>

        {/* ---------- PROFILE SECTIONS ---------- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <ProfileItem
            icon="person-circle-outline"
            title="Personal Information"
            description="Update your personal details"
            onPress={() => router.push('/(tabs)/(profile)/personal')}
          />

          <ProfileItem
            icon="camera-outline"
            title="Face & Profile Picture"
            description="Update your profile photo"
            onPress={() => router.push('/(tabs)/(profile)/face')}
          />

          <ProfileItem
            icon="shield-checkmark-outline"
            title="Privacy & Security"
            description="Manage your privacy settings"
            onPress={() => router.push('/(tabs)/(profile)/privacy')}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health</Text>
          
          <ProfileItem
            icon="fitness-outline"
            title="Health Goals"
            description="Set and track your health goals"
            onPress={() => router.push('/(tabs)/(profile)/goals')}
          />

          <ProfileItem
            icon="nutrition-outline"
            title="Diet & Nutrition"
            description="Manage your meal plans"
            onPress={() => router.push('/(tabs)/(profile)/nutrition')}
          />

          <ProfileItem
            icon="bed-outline"
            title="Sleep Tracking"
            description="View sleep patterns"
            onPress={() => router.push('/(tabs)/(profile)/sleep')}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <ProfileItem
            icon="notifications-outline"
            title="Notifications"
            description="Customize alerts and reminders"
            onPress={() => router.push('/(tabs)/(profile)/notifications')}
          />

          <ProfileItem
            icon="settings-outline"
            title="App Settings"
            description="Customize app experience"
            onPress={() => router.push('/(tabs)/(profile)/settings')}
          />

          <ProfileItem
            icon="help-circle-outline"
            title="Help & Support"
            description="FAQs and contact support"
            onPress={() => router.push('/(tabs)/(profile)/support')}
          />
        </View>

        {/* ---------- LOGOUT BUTTON ---------- */}
        <TouchableOpacity 
          style={styles.logoutBtn} 
          onPress={handleLogout}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#FF6B6B', '#FF8E8E']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
          <Ionicons name="log-out-outline" size={22} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Version 1.0.0 • Preventive Health Care</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------- PROFILE ITEM COMPONENT ---------- */
function ProfileItem({ icon, title, description, onPress }: any) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.itemIconContainer}>
        <Ionicons name={icon} size={22} color="#667eea" />
      </View>
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{title}</Text>
        <Text style={styles.itemDescription}>{description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
  );
}

/* ---------- STYLES ---------- */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 20,
    color: '#fff',
    fontSize: 16,
    opacity: 0.8,
  },

  // Header Styles
  header: {
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingBottom: 30,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  headerContent: {
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: '#eee',
  },
  levelBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
  },
  levelText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  name: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  sub: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginBottom: 20,
  },
  healthStats: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 15,
    marginTop: 10,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  statNumber: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 5,
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginTop: 2,
  },

  // Quick Actions
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 30,
    marginTop: -40,
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  quickActionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  quickActionText: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
  },

  // Sections
  section: {
    marginHorizontal: 20,
    marginBottom: 25,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 15,
    paddingLeft: 5,
  },

  // Profile Items
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  itemIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 3,
  },
  itemDescription: {
    fontSize: 12,
    color: '#666',
  },

  // Logout Button
  logoutBtn: {
    marginHorizontal: 20,
    marginVertical: 30,
    padding: 18,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    overflow: 'hidden',
  },
  logoutText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 10,
  },

  // Version
  version: {
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
});