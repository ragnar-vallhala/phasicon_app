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

export default function SignupScreen() {
  const router = useRouter();
  const { signup, isLoading } = useAuth();
  const theme = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localLoading, setLocalLoading] = useState(false);

  const validateForm = () => {
    if (!email || !password || !confirmPassword)
      return 'Please fill all fields';

    if (password !== confirmPassword)
      return 'Passwords do not match';

    if (password.length < 6)
      return 'Password must be at least 6 characters';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      return 'Please enter a valid email';

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

      const res = await signup(email, password);

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
              Create Account
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: theme.colors.textSecondary,
              }}
            >
              Verify your email to continue
            </Text>
          </View>


          <TextInput
            style={inputStyle(theme)}
            placeholder="Email"
            placeholderTextColor={theme.colors.textMuted}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!isButtonLoading}
          />

          <TextInput
            style={inputStyle(theme)}
            placeholder="Password"
            placeholderTextColor={theme.colors.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!isButtonLoading}
          />

          <TextInput
            style={inputStyle(theme)}
            placeholder="Confirm Password"
            placeholderTextColor={theme.colors.textMuted}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            editable={!isButtonLoading}
          />

          {/* CTA */}
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
            onPress={handleSignup}
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
                Continue
              </Text>
            )}
          </TouchableOpacity>

          {/* Footer */}
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Text style={{ color: theme.colors.textSecondary }}>
              Already have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text
                style={{
                  color: theme.colors.primary,
                  fontWeight: '600',
                }}
              >
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

/* ---------------- THEME INPUT ---------------- */

const inputStyle = (theme: any) => ({
  backgroundColor: theme.colors.surface,
  borderWidth: 1,
  borderColor: theme.colors.card,
  borderRadius: theme.radius.md,
  padding: 16,
  marginBottom: 16,
  fontSize: 16,
  color: theme.colors.textPrimary,
});
