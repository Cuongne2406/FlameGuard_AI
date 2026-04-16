export const COLORS = {
  primary: '#4F46E5',     // Indigo 600
  secondary: '#6366F1',   // Indigo 500
  accent: '#F59E0B',      // Amber 500
  success: '#10B981',     // Emerald 500
  warning: '#F59E0B',     // Amber 500 (same as accent for consistency)
  danger: '#EF4444',      // Red 500
  error: '#EF4444',
  background: '#F8FAFC',  // Slate 50
  surface: '#FFFFFF',
  text: '#1E293B',        // Slate 800
  textSecondary: '#64748B', // Slate 500
  textMuted: '#94A3B8',   // Slate 400
  border: '#F1F5F9',      // Slate 100
  white: '#FFFFFF',
  black: '#0F172A',       // Slate 900
  gradient: ['#4F46E5', '#6366F1', '#818CF8'] // Indigo gradient
};

export const SIZES = {
  base: 8,
  font: 14,
  radius: 16,
  padding: 24,
  h1: 32,
  h2: 24,
  h3: 18,
  body: 16,
};

export const SHADOWS = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  light: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
  },
  medium: {
    shadowColor: "#4F46E5", // Tinted shadow for premium feel
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  heavy: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 15,
    },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 10,
  }
};
