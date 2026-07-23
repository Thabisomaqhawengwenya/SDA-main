export const theme = {
  fonts: {
    serif: "'Noto Serif', Georgia, serif",
    sans: "'Noto Sans', Helvetica, Arial, sans-serif",
  },
  colors: {
    bg: '#fafaf8',
    surface: '#ffffff',
    text: '#2c2c2c',
    textMuted: '#6b6b6b',
    accent: '#4a6741',
    accentLight: '#6a9465',
    accentDark: '#2d4028',
    border: '#e8e6e0',
    gold: '#b8973a',
    white: '#ffffff',
    offWhite: '#f5f4f0',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '40px',
    xxl: '64px',
    xxxl: '96px',
  },
  breakpoints: {
    sm: '576px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
  navHeight: '72px',
  maxWidth: '1200px',
  radius: {
    sm: '4px',
    md: '8px',
    lg: '16px',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 3px rgba(0,0,0,0.08)',
    md: '0 4px 16px rgba(0,0,0,0.08)',
    lg: '0 12px 40px rgba(0,0,0,0.12)',
  },
  transition: {
    fast: '0.15s ease',
    base: '0.25s ease',
    slow: '0.4s ease',
  },
};

export type Theme = typeof theme;
