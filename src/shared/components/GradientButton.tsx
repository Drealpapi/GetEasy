import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { BORDER_RADIUS, COLORS, FONT_SIZE, FONT_WEIGHT, SHADOWS, SPACING } from '../constants/constants';

interface GradientButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export default function GradientButton({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
  fullWidth = false,
}: GradientButtonProps) {
  const getButtonStyle = () => {
    const baseStyle = [
      styles.button,
      styles[`${size}Button`],
      fullWidth && styles.fullWidth,
      disabled && styles.disabled,
      style,
    ];

    return baseStyle;
  };

  const getTextStyle = () => [
    styles.text,
    styles[`${size}Text`],
    styles[`${variant}Text`],
    disabled && styles.disabledText,
    textStyle,
  ];

  const renderContent = () => (
    <>
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'ghost' ? COLORS.PRIMARY : COLORS.WHITE}
          size="small"
        />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text style={getTextStyle()}>{title}</Text>
        </>
      )}
    </>
  );

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        style={getButtonStyle()}
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={disabled ? [COLORS.GRAY_300, COLORS.GRAY_400] : COLORS.PRIMARY_GRADIENT}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          {renderContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[getButtonStyle(), styles[`${variant}Button`]]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {renderContent()}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    ...SHADOWS.medium,
  },
  gradient: {
    flex: 1,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.6,
  },

  // Size variants
  smallButton: {
    height: 36,
    paddingHorizontal: SPACING.md,
  },
  mediumButton: {
    height: 48,
    paddingHorizontal: SPACING.lg,
  },
  largeButton: {
    height: 56,
    paddingHorizontal: SPACING.xl,
  },

  // Button variants
  secondaryButton: {
    backgroundColor: COLORS.SECONDARY,
  },
  outlineButton: {
    backgroundColor: COLORS.TRANSPARENT,
    borderWidth: 2,
    borderColor: COLORS.PRIMARY,
  },
  ghostButton: {
    backgroundColor: COLORS.TRANSPARENT,
  },

  // Text styles
  text: {
    fontWeight: FONT_WEIGHT.semibold,
    textAlign: 'center',
  },
  smallText: {
    fontSize: FONT_SIZE.sm,
  },
  mediumText: {
    fontSize: FONT_SIZE.md,
  },
  largeText: {
    fontSize: FONT_SIZE.lg,
  },

  // Text variants
  primaryText: {
    color: COLORS.WHITE,
  },
  secondaryText: {
    color: COLORS.WHITE,
  },
  outlineText: {
    color: COLORS.PRIMARY,
  },
  ghostText: {
    color: COLORS.PRIMARY,
  },
  disabledText: {
    opacity: 0.6,
  },
});