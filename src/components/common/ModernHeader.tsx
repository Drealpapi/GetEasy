import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT, SHADOWS } from '../../utils/constants';

interface ModernHeaderProps {
  title?: string;
  subtitle?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  variant?: 'default' | 'gradient' | 'transparent';
  showBackButton?: boolean;
}

export default function ModernHeader({
  title,
  subtitle,
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
  variant = 'gradient',
  showBackButton = false,
}: ModernHeaderProps) {
  const statusBarHeight = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0;

  const renderContent = () => (
    <View style={[styles.container, { paddingTop: statusBarHeight + SPACING.md }]}>
      <View style={styles.content}>
        {/* Left side */}
        <View style={styles.leftContainer}>
          {(leftIcon || showBackButton) && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onLeftPress}
              activeOpacity={0.7}
            >
              {leftIcon || (
                <Text style={styles.backIcon}>←</Text>
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* Center content */}
        <View style={styles.centerContainer}>
          {title && (
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
          )}
          {subtitle && (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>

        {/* Right side */}
        <View style={styles.rightContainer}>
          {rightIcon && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onRightPress}
              activeOpacity={0.7}
            >
              {rightIcon}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  if (variant === 'gradient') {
    return (
      <LinearGradient
        colors={COLORS.PRIMARY_GRADIENT}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradientHeader}
      >
        {renderContent()}
      </LinearGradient>
    );
  }

  if (variant === 'transparent') {
    return (
      <View style={styles.transparentHeader}>
        {renderContent()}
      </View>
    );
  }

  return (
    <View style={styles.defaultHeader}>
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: SPACING.lg,
  },
  
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    minHeight: 56,
  },
  
  leftContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  
  centerContainer: {
    flex: 2,
    alignItems: 'center',
  },
  
  rightContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  backIcon: {
    fontSize: 20,
    color: COLORS.WHITE,
    fontWeight: FONT_WEIGHT.bold,
  },
  
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.WHITE,
    textAlign: 'center',
  },
  
  subtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.WHITE,
    opacity: 0.9,
    textAlign: 'center',
    marginTop: 2,
  },
  
  // Header variants
  gradientHeader: {
    ...SHADOWS.medium,
  },
  
  defaultHeader: {
    backgroundColor: COLORS.WHITE,
    ...SHADOWS.small,
  },
  
  transparentHeader: {
    backgroundColor: COLORS.TRANSPARENT,
  },
});