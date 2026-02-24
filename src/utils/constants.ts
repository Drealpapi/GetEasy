// Global color palette - used throughout the app
export const COLORS = {
  // Primary brand colors
  PRIMARY: "#0a8a60",
  PRIMARY_DARK: "#076644",
  PRIMARY_LIGHT: "#0cb878",
  
  // Background colors
  BACKGROUND: "#ffffff",
  SURFACE: "#f8f9fa",
  CARD: "#ffffff",
  
  // Text colors
  TEXT_PRIMARY: "#1a1a1a",
  TEXT_SECONDARY: "#666666",
  TEXT_TERTIARY: "#999999",
  TEXT_LIGHT: "#ffffff",
  
  // Border and divider colors
  BORDER: "#e0e0e0",
  DIVIDER: "#f0f0f0",
  
  // Input colors
  INPUT_BACKGROUND: "#f5f5f5",
  INPUT_BORDER: "#d0d0d0",
  INPUT_FOCUS: "#0a8a60",
  
  // Status colors
  SUCCESS: "#0a8a60",
  ERROR: "#dc2626",
  WARNING: "#f59e0b",
  INFO: "#3b82f6",
  
  // Utility colors
  WHITE: "#ffffff",
  BLACK: "#000000",
  GRAY_LIGHT: "#f2f2f2",
  GRAY: "#888888",
  GRAY_DARK: "#4a4a4a",
  
  // Shadow
  SHADOW: "rgba(0, 0, 0, 0.1)",
  SHADOW_DARK: "rgba(0, 0, 0, 0.2)",
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const FONT_SIZE = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 24,
  xxl: 32,
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
