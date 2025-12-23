import { Stack } from 'expo-router';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AuthLayout() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  
  return (
    <View style={{ 
      flex: 1, 
      backgroundColor: theme.colors.background,
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
    }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top : 0}
      >
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: theme.colors.background,
            },
          }}
        />
      </KeyboardAvoidingView>
    </View>
  );
}