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

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localLoading, setLocalLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      setLocalLoading(true);

      // 🔐 Authenticate ONLY
      await login(email, password);

      // ✅ Do NOT route here
      // Tabs layout will handle redirect
    } catch (err: any) {
      Alert.alert(
        'Login Failed',
        err?.message || 'Invalid email or password'
      );
    } finally {
      setLocalLoading(false);
    }
  };

  const isButtonLoading = localLoading || isLoading;

  return (
    <>
      <Stack.Screen options={{ title: 'Login', headerShown: true }} />

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
            <Text style={{ fontSize: 32, fontWeight: 'bold' }}>
              Welcome Back
            </Text>
            <Text style={{ color: '#666' }}>
              Sign in to continue
            </Text>
          </View>

          <TextInput
            style={inputStyle}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!isButtonLoading}
          />

          <TextInput
            style={inputStyle}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!isButtonLoading}
          />

          <TouchableOpacity
            style={{
              backgroundColor: isButtonLoading ? '#ccc' : '#007AFF',
              borderRadius: 10,
              padding: 18,
              alignItems: 'center',
              marginBottom: 25,
            }}
            onPress={handleLogin}
            disabled={isButtonLoading}
          >
            {isButtonLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: '#fff', fontSize: 18 }}>
                Login
              </Text>
            )}
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Text>Don't have an account? </Text>
            <TouchableOpacity
              onPress={() => router.push('/(auth)/signup')}
            >
              <Text style={{ color: '#007AFF', fontWeight: '600' }}>
                Sign Up
              </Text>
            </TouchableOpacity>
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
