export const adminTheme = {
  colors: {
    // Sidebar
    sidebarBg: '#0f172a',
    sidebarText: 'rgba(255,255,255,0.65)',
    sidebarTextActive: '#ffffff',
    sidebarAccent: '#1DA1F2',
    sidebarHover: 'rgba(255,255,255,0.06)',
    sidebarBorder: 'rgba(255,255,255,0.07)',

    // Canvas
    bg: '#f8fafc',
    surface: '#ffffff',
    surfaceAlt: '#f1f5f9',
    border: '#e2e8f0',
    borderStrong: '#cbd5e1',

    // Text
    text: '#0f172a',
    textSecondary: '#475569',
    textMuted: '#94a3b8',

    // Brand
    primary: '#1DA1F2',
    primaryDark: '#1a8fd1',
    primaryLight: 'rgba(29,161,242,0.1)',

    // Semantic
    success: '#10b981',
    successLight: 'rgba(16,185,129,0.1)',
    warning: '#f59e0b',
    warningLight: 'rgba(245,158,11,0.1)',
    danger: '#ef4444',
    dangerLight: 'rgba(239,68,68,0.1)',
    info: '#6366f1',
    infoLight: 'rgba(99,102,241,0.1)',
    purple: '#8b5cf6',
    purpleLight: 'rgba(139,92,246,0.1)',

    // Accent from public site
    accent: '#4a6741',
    accentLight: 'rgba(74,103,65,0.1)',
    gold: '#b8973a',
    goldLight: 'rgba(184,151,58,0.1)',
  },
  fonts: {
    sans: "'Noto Sans', Helvetica, Arial, sans-serif",
    serif: "'Noto Serif', Georgia, serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
  },
  radius: {
    sm: '6px',
    md: '10px',
    lg: '14px',
    xl: '20px',
    full: '9999px',
  },
  shadows: {
    xs: '0 1px 2px rgba(0,0,0,0.05)',
    sm: '0 1px 4px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
    md: '0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)',
    lg: '0 12px 32px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.06)',
    xl: '0 24px 48px rgba(0,0,0,0.12)',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  sidebarWidth: '240px',
  sidebarCollapsed: '64px',
  topbarHeight: '60px',
  transition: {
    fast: '0.15s ease',
    base: '0.2s ease',
    slow: '0.35s ease',
  },
}

export type AdminTheme = typeof adminTheme
