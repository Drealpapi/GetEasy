export const COLORS = {
  EMERALD_GREEN: "#0a8a60",
  EMERALD_DARK: "#076644",
  WHITE: "#ffffff",
  BLACK: "#000000",
  GRAY: "#888888",
  LIGHT_GRAY: "#f2f2f2",
  ERROR: "#dc2626",
  SUCCESS: "#0a8a60",
  WARNING: "#f59e0b",
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
