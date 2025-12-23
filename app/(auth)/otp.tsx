import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/theme/ThemeProvider';

export default function OtpScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const { verifyOTP } = useAuth();
  const theme = useTheme();

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      Alert.alert('Error', 'Enter valid 6 digit OTP');
      return;
    }

    setLoading(true);

    try {
      await verifyOTP(email!, otp);

      Alert.alert('Success', 'Account verified successfully', [
        {
          text: 'Login',
          onPress: () => router.replace('/(auth)/login'),
        },
      ]);
    } catch (err: any) {
      Alert.alert(
        'Error',
        err?.message || 'OTP verification failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: '',
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.textPrimary,
        }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
          justifyContent: 'center',
          paddingHorizontal: theme.spacing.lg,
        }}
      >
        {/* Header */}
        <View style={{ marginBottom: theme.spacing.xl }}>
          <Text
            style={{
              fontSize: 28,
              fontWeight: '700',
              color: theme.colors.textPrimary,
              marginBottom: 8,
            }}
          >
            Verify your email
          </Text>

          <Text
            style={{
              fontSize: 14,
              color: theme.colors.textSecondary,
            }}
          >
            Enter the 6-digit code sent to{' '}
            <Text style={{ color: theme.colors.textPrimary }}>
              {email}
            </Text>
          </Text>
        </View>

        {/* OTP Input */}
        <TextInput
          value={otp}
          onChangeText={setOtp}
          keyboardType="number-pad"
          maxLength={6}
          placeholder="● ● ● ● ● ●"
          placeholderTextColor={theme.colors.textMuted}
          style={{
            backgroundColor: theme.colors.surface,
            borderWidth: 1,
            borderColor: theme.colors.card,
            borderRadius: theme.radius.md,
            paddingVertical: 18,
            fontSize: 20,
            letterSpacing: 12,
            textAlign: 'center',
            color: theme.colors.textPrimary,
            marginBottom: theme.spacing.lg,
          }}
        />

        {/* Verify Button */}
        <TouchableOpacity
          onPress={handleVerifyOtp}
          disabled={loading}
          activeOpacity={0.85}
          style={{
            backgroundColor: loading
              ? theme.colors.surface
              : theme.colors.primary,
            paddingVertical: 18,
            borderRadius: theme.radius.md,
            alignItems: 'center',
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
              Verify OTP
            </Text>
          )}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </>
  );
}
