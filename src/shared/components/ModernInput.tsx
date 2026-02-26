import React, { useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import { BORDER_RADIUS, COLORS, FONT_SIZE, FONT_WEIGHT, SPACING } from '../constants/constants';

interface ModernInputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'filled' | 'outlined';
  containerStyle?: ViewStyle;
}

export default function ModernInput({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  variant = 'outlined',
  containerStyle,
  style,
  ...props
}: ModernInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [animatedValue] = useState(new Animated.Value(props.value ? 1 : 0));

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (!props.value) {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  const labelStyle = {
    position: 'absolute' as const,
    left: leftIcon ? 48 : SPACING.md,
    top: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [20, -8],
    }),
    fontSize: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [FONT_SIZE.md, FONT_SIZE.sm],
    }),
    color: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [COLORS.TEXT_TERTIARY, isFocused ? COLORS.PRIMARY : COLORS.TEXT_SECONDARY],
    }),
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: 4,
    zIndex: 1,
  };

  const inputContainerStyle = [
    styles.inputContainer,
    styles[`${variant}Container`],
    isFocused && styles.focusedContainer,
    error && styles.errorContainer,
    containerStyle,
  ];

  const inputStyle = [
    styles.input,
    leftIcon && styles.inputWithLeftIcon,
    rightIcon && styles.inputWithRightIcon,
    style,
  ];

  return (
    <View style={styles.container}>
      <View style={inputContainerStyle}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

        {label && variant === 'outlined' && (
          <Animated.Text style={labelStyle}>
            {label}
          </Animated.Text>
        )}

        <TextInput
          {...props}
          style={inputStyle}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={variant !== 'outlined' ? props.placeholder : ''}
          placeholderTextColor={COLORS.TEXT_TERTIARY}
        />

        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>

      {variant !== 'outlined' && label && (
        <Text style={styles.label}>{label}</Text>
      )}

      {error && <Text style={styles.errorText}>{error}</Text>}
      {hint && !error && <Text style={styles.hintText}>{hint}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.lg,
    minHeight: 56,
    position: 'relative',
  },

  defaultContainer: {
    backgroundColor: COLORS.INPUT_BACKGROUND,
    borderWidth: 1,
    borderColor: COLORS.TRANSPARENT,
  },

  filledContainer: {
    backgroundColor: COLORS.GRAY_100,
    borderWidth: 1,
    borderColor: COLORS.TRANSPARENT,
  },

  outlinedContainer: {
    backgroundColor: COLORS.WHITE,
    borderWidth: 2,
    borderColor: COLORS.BORDER,
  },

  focusedContainer: {
    borderColor: COLORS.PRIMARY,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },

  errorContainer: {
    borderColor: COLORS.ERROR,
  },

  input: {
    flex: 1,
    fontSize: FONT_SIZE.md,
    color: COLORS.TEXT_PRIMARY,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },

  inputWithLeftIcon: {
    paddingLeft: SPACING.xs,
  },

  inputWithRightIcon: {
    paddingRight: SPACING.xs,
  },

  leftIcon: {
    paddingLeft: SPACING.md,
    paddingRight: SPACING.xs,
  },

  rightIcon: {
    paddingRight: SPACING.md,
    paddingLeft: SPACING.xs,
  },

  label: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.xs,
  },

  errorText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.ERROR,
    marginTop: SPACING.xs,
    marginLeft: SPACING.sm,
  },

  hintText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.TEXT_TERTIARY,
    marginTop: SPACING.xs,
    marginLeft: SPACING.sm,
  },
});