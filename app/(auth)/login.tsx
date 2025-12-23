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
import { useTheme } from '@/theme/ThemeProvider';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const theme = useTheme();

  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localLoading, setLocalLoading] = useState(false);

  const isButtonLoading = localLoading || isLoading;

  const handleEmailContinue = () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }
    setStep(2);
  };

  const handleLogin = async () => {
    if (!password) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }

    try {
      setLocalLoading(true);
      await login(email, password);
      router.replace('/(tabs)');
    } catch (err: any) {
      Alert.alert(
        'Login Failed',
        err?.message || 'Invalid email or password'
      );
    } finally {
      setLocalLoading(false);
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
        style={{ flex: 1, backgroundColor: theme.colors.background }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            paddingHorizontal: theme.spacing.lg,
          }}
        >
          {/* Header */}
          <View style={{ marginBottom: theme.spacing.xl }}>
            <Text
              style={{
                fontSize: 32,
                fontWeight: '700',
                color: theme.colors.textPrimary,
                marginBottom: 6,
              }}
            >
              Welcome Back
            </Text>

            <Text
              style={{
                color: theme.colors.textSecondary,
                fontSize: 14,
              }}
            >
              {step === 1
                ? 'Enter your email to continue'
                : 'Enter your password'}
            </Text>
          </View>

          {/* Email (Always visible, locked in step 2) */}
          <TextInput
            style={inputStyle(theme, step === 2)}
            placeholder="Email"
            placeholderTextColor={theme.colors.textMuted}
            value={email}
            onChangeText={setEmail}
            editable={step === 1 && !isButtonLoading}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          {/* Password (Only step 2) */}
          {step === 2 && (
            <>
              <TextInput
                style={inputStyle(theme)}
                placeholder="Password"
                placeholderTextColor={theme.colors.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!isButtonLoading}
              />

              {/* Forgot Password */}
              <TouchableOpacity
                onPress={() => router.push('/(auth)/forgot-password')}
                style={{ alignSelf: 'flex-end', marginBottom: 24 }}
              >
                <Text
                  style={{
                    color: theme.colors.primary,
                    fontSize: 13,
                    fontWeight: '500',
                  }}
                >
                  Forgot password?
                </Text>
              </TouchableOpacity>
            </>
          )}

          {/* Primary Button */}
          <TouchableOpacity
            style={{
              backgroundColor: isButtonLoading
                ? theme.colors.surface
                : theme.colors.primary,
              borderRadius: theme.radius.md,
              paddingVertical: 18,
              alignItems: 'center',
              marginBottom: theme.spacing.lg,
            }}
            onPress={step === 1 ? handleEmailContinue : handleLogin}
            disabled={isButtonLoading}
            activeOpacity={0.85}
          >
            {isButtonLoading ? (
              <ActivityIndicator color={theme.colors.background} />
            ) : (
              <Text
                style={{
                  color: theme.colors.background,
                  fontSize: 18,
                  fontWeight: '600',
                }}
              >
                {step === 1 ? 'Continue' : 'Login'}
              </Text>
            )}
          </TouchableOpacity>

          {/* Footer */}
          {step === 1 && (
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <Text style={{ color: theme.colors.textSecondary }}>
                New here?{' '}
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/(auth)/signup')}
              >
                <Text
                  style={{
                    color: theme.colors.primary,
                    fontWeight: '600',
                  }}
                >
                  Create account
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

/* ---------------- THEME INPUT ---------------- */

const inputStyle = (theme: any, locked = false) => ({
  backgroundColor: locked
    ? theme.colors.card
    : theme.colors.surface,
  borderWidth: 1,
  borderColor: theme.colors.card,
  borderRadius: theme.radius.md,
  padding: 16,
  marginBottom: 16,
  fontSize: 16,
  color: theme.colors.textPrimary,
  opacity: locked ? 0.7 : 1,
});
