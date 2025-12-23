import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/theme/ThemeProvider';
import BodyStateCard from '@/components/BodyStateCard';
import GoalsCard from '@/components/GoalsCard';
import StepsCardHome from '@/components/StepsCardHome';

export default function HomeScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingTop: insets.top + theme.spacing.md,   // ✅ SAFE AREA
        paddingBottom: insets.bottom + theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
      }}
    >
      <BodyStateCard />
      <View style={{ height: theme.spacing.md }} />
      <GoalsCard />
      <View style={{ height: theme.spacing.md }} />
      <StepsCardHome />
      {/* Vitals Grid comes next */}
    </View>
  );
}
