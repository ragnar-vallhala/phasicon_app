import { Stack } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';

export default function VitalsLayout() {
  const theme = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.textPrimary,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    />
  );
}
