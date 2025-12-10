import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface ThemeColors {
  EMERALD_GREEN: string;
  EMERALD_DARK: string;
  PRIMARY: string;
  SECONDARY: string;
  BACKGROUND: string;
  SURFACE: string;
  TEXT_PRIMARY: string;
  TEXT_SECONDARY: string;
  TEXT_TERTIARY: string;
  BORDER: string;
  INPUT_BACKGROUND: string;
  ERROR: string;
  SUCCESS: string;
  WARNING: string;
  CARD_BACKGROUND: string;
  SHADOW: string;
}

const lightTheme: ThemeColors = {
  EMERALD_GREEN: "#0a8a60",
  EMERALD_DARK: "#076644",
  PRIMARY: "#0a8a60",
  SECONDARY: "#076644",
  BACKGROUND: "#ffffff",
  SURFACE: "#f8f9fa",
  TEXT_PRIMARY: "#000000",
  TEXT_SECONDARY: "#666666",
  TEXT_TERTIARY: "#888888",
  BORDER: "#e0e0e0",
  INPUT_BACKGROUND: "#ffffff",
  ERROR: "#dc2626",
  SUCCESS: "#0a8a60",
  WARNING: "#f59e0b",
  CARD_BACKGROUND: "#ffffff",
  SHADOW: "#000000",
};

const darkTheme: ThemeColors = {
  EMERALD_GREEN: "#10b981",
  EMERALD_DARK: "#059669",
  PRIMARY: "#10b981",
  SECONDARY: "#059669",
  BACKGROUND: "#121212",
  SURFACE: "#1e1e1e",
  TEXT_PRIMARY: "#ffffff",
  TEXT_SECONDARY: "#b3b3b3",
  TEXT_TERTIARY: "#888888",
  BORDER: "#333333",
  INPUT_BACKGROUND: "#2a2a2a",
  ERROR: "#ef4444",
  SUCCESS: "#10b981",
  WARNING: "#f59e0b",
  CARD_BACKGROUND: "#1e1e1e",
  SHADOW: "#000000",
};

interface ThemeContextValue {
  colors: ThemeColors;
  isDarkMode: boolean;
  isSystemTheme: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
  useSystemTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

const THEME_STORAGE_KEY = '@GetEasy:theme_preference';

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');
  const [isSystemTheme, setIsSystemTheme] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved theme preference on app start
  useEffect(() => {
    loadThemePreference();
  }, []);

  // Update theme when system theme changes (only if using system theme)
  useEffect(() => {
    if (isSystemTheme && isLoaded) {
      setIsDarkMode(systemColorScheme === 'dark');
    }
  }, [systemColorScheme, isSystemTheme, isLoaded]);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme !== null) {
        const themeData = JSON.parse(savedTheme);
        setIsSystemTheme(themeData.isSystemTheme);
        if (!themeData.isSystemTheme) {
          setIsDarkMode(themeData.isDarkMode);
        } else {
          setIsDarkMode(systemColorScheme === 'dark');
        }
      }
    } catch (error) {
      console.log('Error loading theme preference:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  const saveThemePreference = async (isDark: boolean, useSystem: boolean) => {
    try {
      const themeData = {
        isDarkMode: isDark,
        isSystemTheme: useSystem,
      };
      await AsyncStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(themeData));
    } catch (error) {
      console.log('Error saving theme preference:', error);
    }
  };

  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    setIsSystemTheme(false);
    saveThemePreference(newDarkMode, false);
  };

  const setTheme = (isDark: boolean) => {
    setIsDarkMode(isDark);
    setIsSystemTheme(false);
    saveThemePreference(isDark, false);
  };

  const useSystemTheme = () => {
    setIsSystemTheme(true);
    setIsDarkMode(systemColorScheme === 'dark');
    saveThemePreference(systemColorScheme === 'dark', true);
  };

  const colors = isDarkMode ? darkTheme : lightTheme;

  const value: ThemeContextValue = {
    colors,
    isDarkMode,
    isSystemTheme,
    toggleTheme,
    setTheme,
    useSystemTheme,
  };

  // Don't render children until theme is loaded
  if (!isLoaded) {
    return null;
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Legacy support - export individual colors for backward compatibility
export const COLORS = lightTheme;

// Export spacing and font sizes (unchanged)
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