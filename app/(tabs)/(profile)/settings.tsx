import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  SafeAreaView,
  StatusBar,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export default function SettingsScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  
  // Notification settings
  const [notifications, setNotifications] = useState({
    appointmentReminders: true,
    medicationAlerts: true,
    healthTips: true,
    emergencyAlerts: true,
    newsletter: false,
  });

  // App preferences
  const [preferences, setPreferences] = useState({
    darkMode: false,
    biometricLogin: true,
    autoSync: true,
    dataSaver: false,
    locationServices: true,
  });

  // Privacy settings
  const [privacy, setPrivacy] = useState({
    shareHealthData: false,
    shareWithProviders: true,
    shareForResearch: false,
    anonymousData: true,
  });

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const togglePreference = (key: keyof typeof preferences) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const togglePrivacy = (key: keyof typeof privacy) => {
    setPrivacy(prev => ({ ...prev, [key]: !prev[key] }));
  };

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

  const handleClearCache = () => {
    Alert.alert('Clear Cache', 'This will clear all cached data. Continue?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        onPress: () => {
          // Implement cache clearing logic
          Alert.alert('Success', 'Cache cleared successfully');
        },
      },
    ]);
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Health Data',
      'Your health data will be exported in JSON format. This may take a moment.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Export',
          onPress: () => {
            // Implement data export logic
            Alert.alert('Export Started', 'Your data export has been initiated.');
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action is permanent and cannot be undone. All your health data will be deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Implement account deletion logic
            Alert.alert('Account Deletion', 'Account deletion request submitted.');
          },
        },
      ]
    );
  };

  const openPrivacyPolicy = () => {
    Linking.openURL('https://yourhealthapp.com/privacy');
  };

  const openTermsOfService = () => {
    Linking.openURL('https://yourhealthapp.com/terms');
  };

  const openSupport = () => {
    Linking.openURL('mailto:support@yourhealthapp.com');
  };

  const openFeedback = () => {
    Linking.openURL('mailto:feedback@yourhealthapp.com');
  };

  const SettingSection = ({ 
    title, 
    icon, 
    children 
  }: { 
    title: string; 
    icon: string; 
    children: React.ReactNode;
  }) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons name={icon as any} size={22} color="#667eea" />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );

  const SettingItem = ({ 
    icon, 
    title, 
    description, 
    onPress,
    rightComponent,
    danger
  }: { 
    icon?: string; 
    title: string; 
    description?: string; 
    onPress?: () => void;
    rightComponent?: React.ReactNode;
    danger?: boolean;
  }) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.settingItemLeft}>
        {icon && (
          <View style={[styles.settingIcon, danger && styles.dangerIcon]}>
            <Ionicons 
              name={icon as any} 
              size={20} 
              color={danger ? '#FF6B6B' : '#667eea'} 
            />
          </View>
        )}
        <View style={styles.settingTextContainer}>
          <Text style={[styles.settingTitle, danger && styles.dangerText]}>
            {title}
          </Text>
          {description && (
            <Text style={styles.settingDescription}>{description}</Text>
          )}
        </View>
      </View>
      {rightComponent || (
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      )}
    </TouchableOpacity>
  );

  const SwitchItem = ({ 
    icon, 
    title, 
    description, 
    value, 
    onValueChange 
  }: { 
    icon: string; 
    title: string; 
    description?: string; 
    value: boolean; 
    onValueChange: (value: boolean) => void;
  }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingItemLeft}>
        <View style={styles.settingIcon}>
          <Ionicons name={icon as any} size={20} color="#667eea" />
        </View>
        <View style={styles.settingTextContainer}>
          <Text style={styles.settingTitle}>{title}</Text>
          {description && (
            <Text style={styles.settingDescription}>{description}</Text>
          )}
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#E0E0E0', true: '#4ECDC4' }}
        thumbColor={value ? '#fff' : '#fff'}
        ios_backgroundColor="#E0E0E0"
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      
      {/* Header */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* User Info */}
        <View style={styles.userSection}>
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.userCard}
          >
            <View style={styles.userInfo}>
              <Ionicons name="person-circle" size={50} color="#fff" />
              <View style={styles.userText}>
                <Text style={styles.userEmail}>{user?.email}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.editProfileButton}
              onPress={() => router.push('/(tabs)/(profile)/personal')}
            >
              <Text style={styles.editProfileText}>Edit Profile</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* Notifications */}
        <SettingSection title="Notifications" icon="notifications-outline">
          <SwitchItem
            icon="calendar-outline"
            title="Appointment Reminders"
            description="Get notified before appointments"
            value={notifications.appointmentReminders}
            onValueChange={() => toggleNotification('appointmentReminders')}
          />
          <SwitchItem
            icon="medical-outline"
            title="Medication Alerts"
            description="Reminders for medication schedules"
            value={notifications.medicationAlerts}
            onValueChange={() => toggleNotification('medicationAlerts')}
          />
          <SwitchItem
            icon="heart-outline"
            title="Health Tips"
            description="Daily health tips and recommendations"
            value={notifications.healthTips}
            onValueChange={() => toggleNotification('healthTips')}
          />
          <SwitchItem
            icon="warning-outline"
            title="Emergency Alerts"
            description="Critical health notifications"
            value={notifications.emergencyAlerts}
            onValueChange={() => toggleNotification('emergencyAlerts')}
          />
          <SwitchItem
            icon="mail-outline"
            title="Newsletter"
            description="Receive monthly health newsletter"
            value={notifications.newsletter}
            onValueChange={() => toggleNotification('newsletter')}
          />
        </SettingSection>

        {/* App Preferences */}
        <SettingSection title="App Preferences" icon="settings-outline">
          <SwitchItem
            icon="moon-outline"
            title="Dark Mode"
            description="Use dark theme throughout the app"
            value={preferences.darkMode}
            onValueChange={() => togglePreference('darkMode')}
          />
          <SwitchItem
            icon="finger-print-outline"
            title="Biometric Login"
            description="Use Face ID or fingerprint to login"
            value={preferences.biometricLogin}
            onValueChange={() => togglePreference('biometricLogin')}
          />
          <SwitchItem
            icon="sync-outline"
            title="Auto Sync"
            description="Automatically sync health data"
            value={preferences.autoSync}
            onValueChange={() => togglePreference('autoSync')}
          />
          <SwitchItem
            icon="cellular-outline"
            title="Data Saver"
            description="Reduce data usage"
            value={preferences.dataSaver}
            onValueChange={() => togglePreference('dataSaver')}
          />
          <SwitchItem
            icon="location-outline"
            title="Location Services"
            description="Use location for nearby services"
            value={preferences.locationServices}
            onValueChange={() => togglePreference('locationServices')}
          />
        </SettingSection>

        {/* Privacy & Data */}
        <SettingSection title="Privacy & Data" icon="shield-outline">
          <SwitchItem
            icon="share-social-outline"
            title="Share Health Data"
            description="Allow sharing with trusted providers"
            value={privacy.shareHealthData}
            onValueChange={() => togglePrivacy('shareHealthData')}
          />
          <SwitchItem
            icon="medical-outline"
            title="Share with Providers"
            description="Share data with your healthcare providers"
            value={privacy.shareWithProviders}
            onValueChange={() => togglePrivacy('shareWithProviders')}
          />
          <SwitchItem
            icon="analytics-outline"
            title="Share for Research"
            description="Contribute to medical research (anonymous)"
            value={privacy.shareForResearch}
            onValueChange={() => togglePrivacy('shareForResearch')}
          />
          <SwitchItem
            icon="eye-off-outline"
            title="Anonymous Data"
            description="Use anonymous data for analytics"
            value={privacy.anonymousData}
            onValueChange={() => togglePrivacy('anonymousData')}
          />
          
          <SettingItem
            icon="download-outline"
            title="Export Health Data"
            description="Download your health data in JSON format"
            onPress={handleExportData}
          />
          
          <SettingItem
            icon="trash-outline"
            title="Clear Cache"
            description="Remove temporary app data"
            onPress={handleClearCache}
          />
        </SettingSection>

        {/* Support & Legal */}
        <SettingSection title="Support & Legal" icon="help-circle-outline">
          <SettingItem
            icon="document-text-outline"
            title="Privacy Policy"
            onPress={openPrivacyPolicy}
          />
          <SettingItem
            icon="document-outline"
            title="Terms of Service"
            onPress={openTermsOfService}
          />
          <SettingItem
            icon="chatbubble-outline"
            title="Contact Support"
            onPress={openSupport}
          />
          <SettingItem
            icon="megaphone-outline"
            title="Send Feedback"
            onPress={openFeedback}
          />
          <SettingItem
            icon="information-circle-outline"
            title="About HealthApp"
            onPress={() => router.push('/(tabs)/(profile)')}
          />
        </SettingSection>

        {/* Account Actions */}
        <SettingSection title="Account" icon="person-outline">
          <SettingItem
            icon="lock-closed-outline"
            title="Change Password"
            onPress={() => router.push('/(tabs)/(profile)/change-password')}
          />
          <SettingItem
            icon="notifications-off-outline"
            title="Mute All Notifications"
            description="Temporarily disable all notifications"
            onPress={() => {
              setNotifications({
                appointmentReminders: false,
                medicationAlerts: false,
                healthTips: false,
                emergencyAlerts: false,
                newsletter: false,
              });
              Alert.alert('Success', 'All notifications have been muted');
            }}
          />
          <SettingItem
            icon="log-out-outline"
            title="Logout"
            onPress={handleLogout}
            danger
          />
          
          <SettingItem
            icon="trash-outline"
            title="Delete Account"
            description="Permanently delete your account and data"
            onPress={handleDeleteAccount}
            danger
          />
        </SettingSection>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#667eea',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },

  // Header
  header: {
    paddingTop: 50,
    paddingBottom: 15,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 50,
    padding: 8,
    zIndex: 1,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    paddingTop: 10,
  },

  // Scroll View
  scrollContent: {
    paddingBottom: 40,
  },

  // User Section
  userSection: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  userCard: {
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  userText: {
    marginLeft: 15,
    flex: 1,
  },
  userName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  userEmail: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  editProfileButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  editProfileText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },

  // Sections
  section: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 15,
    backgroundColor: '#F8F9FA',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginLeft: 10,
  },
  sectionContent: {
    paddingVertical: 5,
  },

  // Setting Items
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  dangerIcon: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  dangerText: {
    color: '#FF6B6B',
  },
});