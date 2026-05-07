// ─────────────────────────────────────────────────────────────
// RedQuest Design System — Centralized Theme
// ─────────────────────────────────────────────────────────────

export const COLORS = {
  // ── Brand reds (blood-inspired, professional, not error-looking)
  primary:        '#C62828',   // Deep red – main brand
  primaryLight:   '#EF5350',   // Vibrant red – accents, gradients
  primarySurface: '#FFF5F5',   // Very faint red tint – card highlights
  primaryMuted:   '#FFCDD2',   // Soft pink-red – icon backgrounds
  primaryDark:    '#8E0000',   // Darkest red – pressed / shadow tones

  // ── Neutrals
  background:     '#FAFAFA',   // Page background
  surface:        '#FFFFFF',   // Cards, panels
  border:         '#F0F0F0',   // Dividers, card borders
  inputBg:        '#F7F7F9',   // Input backgrounds
  inputBorder:    '#E8E8EC',   // Input borders

  // ── Typography
  textPrimary:    '#1A1A1A',   // Headings, strong text
  textSecondary:  '#555555',   // Body text
  textMuted:      '#999999',   // Captions, hints
  textPlaceholder:'#BDBDBD',   // Input placeholders

  // ── Semantic
  success:        '#2E7D32',   // Green – verified, done
  successLight:   '#E8F5E9',   // Light green surface
  warning:        '#F57F17',   // Amber – urgent
  warningLight:   '#FFF8E1',   // Light amber surface
  info:           '#1565C0',   // Blue – transit, info
  infoLight:      '#E3F2FD',   // Light blue surface
  error:          '#D32F2F',   // Red – errors (same as brand but contextual)

  // ── Misc
  white:          '#FFFFFF',
  black:          '#000000',
  overlay:        'rgba(0,0,0,0.05)',
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
  },
  button: {
    shadowColor: '#C62828',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 5,
  },
};

export const RADIUS = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  full: 50,
};

export const FONT_SIZES = {
  xs:   11,
  sm:   12,
  body: 14,
  md:   15,
  lg:   17,
  xl:   20,
  xxl:  24,
  title: 28,
};

export const FONT_WEIGHTS = {
  regular: '400',
  medium:  '500',
  semi:    '600',
  bold:    '700',
  heavy:   '800',
};
