import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Platform, useColorScheme } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';
import { StatusBar } from 'expo-status-bar';

import { DarkTheme, LightTheme } from './theme';

/* ---------------- TYPES ---------------- */

export type ThemeMode = 'light' | 'dark' | 'system';

export interface AppTheme {
  mode: ThemeMode;
  colors: typeof DarkTheme.colors;
  spacing: typeof DarkTheme.spacing;
  radius: typeof DarkTheme.radius;
  setMode: (mode: ThemeMode) => void;
}

/* ---------------- CONTEXT ---------------- */

const ThemeContext = createContext<AppTheme | null>(null);

/* ---------------- PROVIDER ---------------- */

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const systemScheme = useColorScheme(); // 'dark' | 'light'
  const [mode, setMode] = useState<ThemeMode>('system');

  const resolvedMode: 'dark' | 'light' =
    mode === 'system'
      ? systemScheme === 'dark'
        ? 'dark'
        : 'light'
      : mode;

  const baseTheme = resolvedMode === 'dark' ? DarkTheme : LightTheme;

  const theme = useMemo<AppTheme>(
    () => ({
      ...baseTheme,
      mode,
      setMode,
    }),
    [baseTheme, mode]
  );

  /* ---------- SYSTEM UI SYNC ---------- */
  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setVisibilityAsync('visible');
      NavigationBar.setButtonStyleAsync(
        resolvedMode === 'dark' ? 'light' : 'dark'
      );
    }
  }, [resolvedMode]);

  return (
    <ThemeContext.Provider value={theme}>
      <StatusBar
        style={resolvedMode === 'dark' ? 'light' : 'dark'}
        translucent
        backgroundColor="transparent"
      />
      {children}
    </ThemeContext.Provider>
  );
};

/* ---------------- HOOK ---------------- */

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used inside ThemeProvider');
  }
  return ctx;
};
