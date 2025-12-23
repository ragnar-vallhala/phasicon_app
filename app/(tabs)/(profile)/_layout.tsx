import { Stack } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';

export default function ProfileLayout() {
  const theme = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.background },
        headerTintColor: theme.colors.textPrimary,
        headerTitleStyle: { fontWeight: '600' },
        headerShown: false,
      }}
    />
  );
}
