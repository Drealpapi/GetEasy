// Advanced Professional Color System
export const COLORS = {
  // Primary brand colors - Modern tech gradient
  PRIMARY: "#6366f1", // Indigo-500
  PRIMARY_DARK: "#4338ca", // Indigo-700
  PRIMARY_LIGHT: "#818cf8", // Indigo-400
  PRIMARY_GRADIENT: ["#6366f1", "#8b5cf6"], // Indigo to Purple
  
  // Secondary accent colors
  SECONDARY: "#06b6d4", // Cyan-500
  SECONDARY_DARK: "#0891b2", // Cyan-600
  SECONDARY_LIGHT: "#67e8f9", // Cyan-300
  
  // Background colors - Modern dark/light system
  BACKGROUND: "#fafafa", // Neutral-50
  BACKGROUND_DARK: "#0f172a", // Slate-900
  SURFACE: "#ffffff",
  SURFACE_DARK: "#1e293b", // Slate-800
  CARD: "#ffffff",
  CARD_DARK: "#334155", // Slate-700
  
  // Text colors - High contrast
  TEXT_PRIMARY: "#0f172a", // Slate-900
  TEXT_SECONDARY: "#475569", // Slate-600
  TEXT_TERTIARY: "#94a3b8", // Slate-400
  TEXT_LIGHT: "#ffffff",
  TEXT_MUTED: "#64748b", // Slate-500
  
  // Border and divider colors
  BORDER: "#e2e8f0", // Slate-200
  BORDER_LIGHT: "#f1f5f9", // Slate-100
  DIVIDER: "#cbd5e1", // Slate-300
  
  // Input colors - Modern focus states
  INPUT_BACKGROUND: "#f8fafc", // Slate-50
  INPUT_BORDER: "#d1d5db", // Gray-300
  INPUT_FOCUS: "#6366f1", // Primary
  INPUT_ERROR: "#ef4444", // Red-500
  
  // Status colors - Vibrant and clear
  SUCCESS: "#10b981", // Emerald-500
  SUCCESS_LIGHT: "#d1fae5", // Emerald-100
  ERROR: "#ef4444", // Red-500
  ERROR_LIGHT: "#fee2e2", // Red-100
  WARNING: "#f59e0b", // Amber-500
  WARNING_LIGHT: "#fef3c7", // Amber-100
  INFO: "#3b82f6", // Blue-500
  INFO_LIGHT: "#dbeafe", // Blue-100
  
  // Utility colors
  WHITE: "#ffffff",
  BLACK: "#000000",
  TRANSPARENT: "transparent",
  
  // Gray scale - Professional
  GRAY_50: "#f9fafb",
  GRAY_100: "#f3f4f6",
  GRAY_200: "#e5e7eb",
  GRAY_300: "#d1d5db",
  GRAY_400: "#9ca3af",
  GRAY_500: "#6b7280",
  GRAY_600: "#4b5563",
  GRAY_700: "#374151",
  GRAY_800: "#1f2937",
  GRAY_900: "#111827",
  
  // Shadow colors - Layered depth
  SHADOW_LIGHT: "rgba(0, 0, 0, 0.05)",
  SHADOW: "rgba(0, 0, 0, 0.1)",
  SHADOW_MEDIUM: "rgba(0, 0, 0, 0.15)",
  SHADOW_DARK: "rgba(0, 0, 0, 0.25)",
  SHADOW_COLORED: "rgba(99, 102, 241, 0.15)", // Primary shadow
  
  // Overlay colors
  OVERLAY_LIGHT: "rgba(255, 255, 255, 0.9)",
  OVERLAY_DARK: "rgba(0, 0, 0, 0.5)",
  BACKDROP: "rgba(0, 0, 0, 0.6)",
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const FONT_SIZE = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  display: 40,
};

export const FONT_WEIGHT = {
  light: "300",
  normal: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
  extrabold: "800",
};

export const BORDER_RADIUS = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 9999,
};

export const SHADOWS = {
  small: {
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  colored: {
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
};

export const ROLES = ["user", "provider"] as const;

export const SERVICE_CATEGORIES = [
  "Electricians",
  "Plumbers",
  "Cleaners",
  "Tutors",
  "Mechanics",
] as const;

export const STATES = [
  "California",
  "Texas",
  "Florida",
  "New York",
  "Illinois",
  "Pennsylvania",
  "Ohio",
  "Georgia",
  "North Carolina",
  "Michigan",
] as const;

export const BOOKING_STATUS = [
  "Pending",
  "Accepted",
  "Declined",
  "Completed",
] as const;
