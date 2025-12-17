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

export default function OtpScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const {verifyOTP}  = useAuth();
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
      Alert.alert('Error', err.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Verify OTP' }} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, justifyContent: 'center', padding: 20 }}
      >
        <Text style={{ fontSize: 22, fontWeight: '600', marginBottom: 8 }}>
          Verify your email
        </Text>
        <Text style={{ color: '#666', marginBottom: 20 }}>
          OTP sent to {email}
        </Text>

        <TextInput
          value={otp}
          onChangeText={setOtp}
          keyboardType="number-pad"
          maxLength={6}
          placeholder="Enter OTP"
          style={{
            borderWidth: 1,
            borderRadius: 8,
            padding: 14,
            fontSize: 18,
            letterSpacing: 8,
            textAlign: 'center',
            marginBottom: 20,
          }}
        />

        <TouchableOpacity
          onPress={handleVerifyOtp}
          disabled={loading}
          style={{
            backgroundColor: '#007AFF',
            padding: 16,
            borderRadius: 8,
            alignItems: 'center',
          }}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
              Verify OTP
            </Text>
          )}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </>
  );
}
