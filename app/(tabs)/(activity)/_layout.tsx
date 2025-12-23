import { Stack } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';

export default function ActivityLayout() {
  const theme = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerShown: false,
        headerTintColor: theme.colors.textPrimary,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    />
  );
}
