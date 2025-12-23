/* ===========================
   THEME TYPES
   =========================== */

export interface AppTheme {
  mode?: 'dark' | 'light' | 'system';

  colors: {
    background: string;
    surface: string;
    card: string;

    primary: string;
    alert: string;

    textPrimary: string;
    textSecondary: string;
    textMuted: string;
  };

  spacing: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };

  radius: {
    sm: number;
    md: number;
    lg: number;
  };
}

/* ===========================
   NEON GLOW (OPTIONAL UTILITY)
   =========================== */

export const neonGlow = {
  shadowColor: '#7C8CFF',
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.6,
  shadowRadius: 14,
  elevation: 14,
};

/* ===========================
   DARK THEME (PRIMARY)
   Ultrahuman-style Neon
   =========================== */

export const DarkTheme: AppTheme = {
  mode: 'dark',

  colors: {
    // Base layers (near-black, AMOLED-friendly)
    background: '#07080D',   // app background
    surface: '#0F1118',      // cards / inputs
    card: '#171A26',         // elevated blocks

    // Accent
    primary: '#7C8CFF',      // electric neon indigo
    alert: '#FF5C5C',        // neon red

    // Text
    textPrimary: '#FFFFFF',
    textSecondary: '#B8BDE6',
    textMuted: '#7D82B8',
  },

  spacing: {
    sm: 8,
    md: 14,
    lg: 22,
    xl: 30,
  },

  radius: {
    sm: 8,
    md: 14,
    lg: 22,
  },
};

/* ===========================
   LIGHT THEME
   Soft Neon (NOT pure white)
   =========================== */

export const LightTheme: AppTheme = {
  mode: 'light',

  colors: {
    background: '#F9FAFF',
    surface: '#FFFFFF',
    card: '#EEF0FF',

    primary: '#5E6BFF',      // same hue, toned down
    alert: '#E53935',

    textPrimary: '#0A0B14',
    textSecondary: '#4C4F75',
    textMuted: '#7A7FAE',
  },

  spacing: {
    sm: 8,
    md: 14,
    lg: 22,
    xl: 30,
  },

  radius: {
    sm: 8,
    md: 14,
    lg: 22,
  },
};
