// app/(auth)/loading.tsx
import { View, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/theme/ThemeProvider';

export default function LoadingScreen() {
  const { isLoading, isAuthenticated } = useAuth();
  const theme = useTheme();

  // If still loading, show spinner
  if (isLoading) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
      }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  // Redirect based on auth state
  return isAuthenticated 
    ? <Redirect href="/(tabs)" />
    : <Redirect href="/(auth)/login" />;
}