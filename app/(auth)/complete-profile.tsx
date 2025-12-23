import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import api from '@/contexts/axios.instance';
import { useAuth } from '@/contexts/AuthContext';
import {
  getAccessToken,
  getRefreshToken,
  clearTokens,
} from '@/contexts/token.service';
import { useTheme } from '@/theme/ThemeProvider';
import ProfileForm from '@/components/profile/ProfileForm';

export default function CompleteProfileScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { user } = useAuth();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    dob: '',
    address1: '',
    address2: '',
    state: '',
    pincode: '',
  });

  useEffect(() => {
    const validateAuth = async () => {
      const accessToken = await getAccessToken();
      const refreshToken = await getRefreshToken();

      if (!user || !accessToken || !refreshToken) {
        await clearTokens();
        router.replace('/(auth)/login');
        return;
      }

      setCheckingAuth(false);
    };

    validateAuth();
  }, []);

  const handleSubmit = async () => {
    if (!form.firstName || !form.phone) {
      Alert.alert('Error', 'First name and phone are required');
      return;
    }

    setLoading(true);
    try {
      await api.put(`/profiles/${user?.id}`, {
        first_name: form.firstName,
        last_name: form.lastName,
        phone: form.phone,
        dob: form.dob,
        address_line1: form.address1,
        address_line2: form.address2,
        state: form.state,
        pincode: form.pincode,
      });

      Alert.alert('Success', 'Profile completed');
      router.replace('/(tabs)');
    } catch (err: any) {
      Alert.alert(
        'Error',
        err.response?.data?.error || 'Failed to update profile'
      );
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
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
    <>
      <Stack.Screen
        options={{
          title: '',
          headerBackVisible: false,
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.textPrimary,
        }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, backgroundColor: theme.colors.background }}
      >
        <ScrollView
          contentContainerStyle={{
            padding: theme.spacing.lg,
            paddingBottom: theme.spacing.xl,
          }}
        >
          {/* Header */}
          <View style={{ marginBottom: theme.spacing.xl }}>
            <Text
              style={{
                fontSize: 28,
                fontWeight: '700',
                color: theme.colors.textPrimary,
                marginBottom: 6,
              }}
            >
              Complete your profile
            </Text>
            <Text
              style={{
                color: theme.colors.textSecondary,
                fontSize: 14,
              }}
            >
              This information is required to continue
            </Text>
          </View>

          {/* Form */}
          <ProfileForm form={form} setForm={setForm} />

          {/* CTA */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.85}
            style={{
              backgroundColor: loading
                ? theme.colors.surface
                : theme.colors.primary,
              paddingVertical: 18,
              borderRadius: theme.radius.md,
              alignItems: 'center',
              marginTop: theme.spacing.lg,
            }}
          >
            {loading ? (
              <ActivityIndicator color={theme.colors.background} />
            ) : (
              <Text
                style={{
                  color: theme.colors.background,
                  fontSize: 16,
                  fontWeight: '600',
                }}
              >
                Save & Continue
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
