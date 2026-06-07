// Design tokens — all colors, spacing, typography in one place

export const Colors = {
  // Primary brand — teal/green
  primary: '#1D9E75',
  primaryLight: '#E1F5EE',
  primaryDark: '#0F6E56',
  primaryDeep: '#085041',

  // Accent — warm amber
  accent: '#EF9F27',
  accentLight: '#FAEEDA',
  accentDark: '#BA7517',

  // Semantic
  danger: '#E24B4A',
  dangerLight: '#FCEBEB',
  warning: '#EF9F27',
  warningLight: '#FAEEDA',
  info: '#378ADD',
  infoLight: '#E6F1FB',

  // Neutrals
  white: '#FFFFFF',
  black: '#1A1A1A',
  gray50: '#F8F9FA',
  gray100: '#F1EFE8',
  gray200: '#D3D1C7',
  gray300: '#B4B2A9',
  gray400: '#888780',
  gray500: '#5F5E5A',
  gray600: '#444441',
  gray700: '#2C2C2A',

  // Mood colors
  mood1: '#E24B4A',
  mood2: '#EF9F27',
  mood3: '#FAC775',
  mood4: '#9FE1CB',
  mood5: '#1D9E75',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

export const FontSize = {
  xs: 11,
  sm: 12,
  md: 14,
  base: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const Shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#1D9E75',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
};

// Light theme
export const LightTheme = {
  bg: Colors.gray50,
  surface: Colors.white,
  surfaceAlt: Colors.gray100,
  border: Colors.gray200,
  borderLight: '#EBEBEB',
  text: Colors.black,
  textSecondary: Colors.gray500,
  textTertiary: Colors.gray400,
  tabBar: Colors.white,
  card: Colors.white,
};

// Dark theme
export const DarkTheme = {
  bg: '#111211',
  surface: '#1C1E1C',
  surfaceAlt: '#242624',
  border: '#2E302E',
  borderLight: '#252725',
  text: '#F0F2F0',
  textSecondary: '#8A8E8A',
  textTertiary: '#5A5E5A',
  tabBar: '#1C1E1C',
  card: '#1C1E1C',
};

export const MEAL_OPTIONS = {
  breakfast: ['Oats / Porridge', 'Eggs & Toast', 'Rice & Curry', 'Bread / Roti', 'Fruit Bowl', 'Smoothie', 'Hoppers', 'String Hoppers', 'Cereal', 'Other'],
  lunch: ['Rice & Curry', 'Kottu', 'Noodles', 'Sandwich', 'Salad', 'Fried Rice', 'Pasta', 'Soup', 'Other'],
  dinner: ['Rice & Curry', 'Kottu', 'Hoppers', 'Light Meal', 'Salad', 'Soup', 'Leftovers', 'Other'],
};

export const WORKOUT_TYPES = ['Running', 'Walking', 'Cycling', 'Swimming', 'Weight Training', 'Yoga', 'HIIT', 'Pilates', 'Football', 'Cricket', 'Basketball', 'Badminton'];

export const SNACK_OPTIONS = ['Fruit', 'Nuts', 'Biscuits', 'Milk / Curd', 'Tea / Coffee', 'Juice', 'Chocolate', 'Chips', 'Protein Bar'];

export const SLEEP_QUALITY_OPTIONS = [
  { label: 'Poor', value: 'poor', score: 20 },
  { label: 'Fair', value: 'fair', score: 40 },
  { label: 'OK', value: 'ok', score: 60 },
  { label: 'Good', value: 'good', score: 80 },
  { label: 'Great', value: 'great', score: 100 },
];

export const MOOD_OPTIONS = [
  { value: 1, emoji: '😞', label: 'Terrible', color: Colors.mood1 },
  { value: 2, emoji: '😕', label: 'Bad', color: Colors.mood2 },
  { value: 3, emoji: '😐', label: 'Neutral', color: Colors.mood3 },
  { value: 4, emoji: '🙂', label: 'Good', color: Colors.mood4 },
  { value: 5, emoji: '😄', label: 'Great', color: Colors.mood5 },
];
