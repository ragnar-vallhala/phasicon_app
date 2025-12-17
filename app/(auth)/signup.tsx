import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';

export default function SignupScreen() {
  const router = useRouter();
  const { signup, isLoading } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localLoading, setLocalLoading] = useState(false);

  const validateForm = () => {
    if (!name || !email || !password || !confirmPassword) {
      return 'Please fill all fields';
    }
    if (password !== confirmPassword) {
      return 'Passwords do not match';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email';
    }
    return null;
  };

  const handleSignup = async () => {
    const validationError = validateForm();
    if (validationError) {
      Alert.alert('Error', validationError);
      return;
    }

    try {
      setLocalLoading(true);

      const res = await signup(name, email, password);

      if (res?.next_step === 'verify_otp') {
        router.push({
          pathname: '/(auth)/otp',
          params: { email },
        });
      } else {
        Alert.alert('Error', 'Unexpected signup response');
      }
    } catch (error: any) {
      Alert.alert(
        'Signup Failed',
        error?.message || 'Could not create account'
      );
    } finally {
      setLocalLoading(false);
    }
  };

  const isButtonLoading = localLoading || isLoading;

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Sign Up',
          headerShown: true,
        }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, backgroundColor: '#fff' }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            paddingHorizontal: 20,
            paddingVertical: 40,
          }}
        >
          <View style={{ alignItems: 'center', marginBottom: 40 }}>
            <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#333' }}>
              Create Account
            </Text>
            <Text style={{ fontSize: 16, color: '#666' }}>
              Verify email to continue
            </Text>
          </View>

          <View style={{ width: '100%' }}>
            <TextInput style={inputStyle} placeholder="Full Name" value={name} onChangeText={setName} editable={!isButtonLoading} />
            <TextInput style={inputStyle} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" editable={!isButtonLoading} />
            <TextInput style={inputStyle} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry editable={!isButtonLoading} />
            <TextInput style={inputStyle} placeholder="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry editable={!isButtonLoading} />

            <TouchableOpacity
              style={{
                backgroundColor: isButtonLoading ? '#ccc' : '#34C759',
                borderRadius: 10,
                padding: 18,
                alignItems: 'center',
                marginBottom: 25,
              }}
              onPress={handleSignup}
              disabled={isButtonLoading}
            >
              {isButtonLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{ color: '#fff', fontSize: 18, fontWeight: '600' }}>
                  Continue
                </Text>
              )}
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <Text style={{ color: '#666' }}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                <Text style={{ color: '#007AFF', fontWeight: '600' }}>
                  Login
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

/* ---------------- STYLES ---------------- */

const inputStyle = {
  backgroundColor: '#f8f8f8',
  borderWidth: 1,
  borderColor: '#e8e8e8',
  borderRadius: 10,
  padding: 15,
  marginBottom: 15,
  fontSize: 16,
};
