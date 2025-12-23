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
  shadowColor: '#3DFF8E',
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
    background: '#07080D',
    surface: '#0F1118',
    card: '#171A26',

    // 🌿 Green Neon Accent
    primary: '#3DFF8E',
    alert: '#FF5C5C',

    textPrimary: '#FFFFFF',
    textSecondary: '#BDE6D2',
    textMuted: '#7FBFA0',
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
    background: '#F8FFF9',
    surface: '#FFFFFF',
    card: '#ECFFF3',

    // 🌿 Softer Green Neon
    primary: '#24C16B',
    alert: '#E53935',

    textPrimary: '#0A0B14',
    textSecondary: '#3F6B54',
    textMuted: '#6F9E85',
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
