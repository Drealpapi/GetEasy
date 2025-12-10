import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { useTheme, SPACING, FONT_SIZE } from "../../context/ThemeContext";

interface ThemeToggleProps {
  showLabel?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export default function ThemeToggle({ showLabel = true, size = 'medium' }: ThemeToggleProps) {
  const { colors, isDarkMode, isSystemTheme, toggleTheme } = useTheme();

  const getSize = () => {
    switch (size) {
      case 'small':
        return { width: 40, height: 24, padding: 2 };
      case 'large':
        return { width: 60, height: 36, padding: 3 };
      default:
        return { width: 50, height: 30, padding: 2 };
    }
  };

  const sizeConfig = getSize();
  const circleSize = sizeConfig.height - (sizeConfig.padding * 2);

  const dynamicStyles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    toggle: {
      width: sizeConfig.width,
      height: sizeConfig.height,
      borderRadius: sizeConfig.height / 2,
      backgroundColor: isDarkMode ? colors.PRIMARY : colors.BORDER,
      padding: sizeConfig.padding,
      justifyContent: isDarkMode ? 'flex-end' : 'flex-start',
    },
    circle: {
      width: circleSize,
      height: circleSize,
      borderRadius: circleSize / 2,
      backgroundColor: colors.BACKGROUND,
      shadowColor: colors.SHADOW,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    label: {
      marginLeft: SPACING.sm,
      fontSize: size === 'small' ? FONT_SIZE.sm : FONT_SIZE.md,
      color: colors.TEXT_PRIMARY,
      fontWeight: '500',
    },
  });

  return (
    <TouchableOpacity style={dynamicStyles.container} onPress={toggleTheme}>
      <View style={dynamicStyles.toggle}>
        <View style={dynamicStyles.circle} />
      </View>
      {showLabel && (
        <Text style={dynamicStyles.label}>
          {isSystemTheme 
            ? `Auto (${isDarkMode ? 'Dark' : 'Light'})` 
            : (isDarkMode ? 'Dark Mode' : 'Light Mode')
          }
        </Text>
      )}
    </TouchableOpacity>
  );
}