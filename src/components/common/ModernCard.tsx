import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../../utils/constants';

interface ModernCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'gradient';
  onPress?: () => void;
  style?: ViewStyle;
  padding?: keyof typeof SPACING;
  margin?: keyof typeof SPACING;
  borderRadius?: keyof typeof BORDER_RADIUS;
}

export default function ModernCard({
  children,
  variant = 'default',
  onPress,
  style,
  padding = 'lg',
  margin,
  borderRadius = 'xl',
}: ModernCardProps) {
  const cardStyle = [
    styles.card,
    styles[`${variant}Card`],
    {
      padding: SPACING[padding],
      borderRadius: BORDER_RADIUS[borderRadius],
      ...(margin && { margin: SPACING[margin] }),
    },
    style,
  ];

  if (variant === 'gradient') {
    const CardComponent = onPress ? TouchableOpacity : View;
    return (
      <CardComponent
        style={[styles.card, { borderRadius: BORDER_RADIUS[borderRadius] }, style]}
        onPress={onPress}
        activeOpacity={onPress ? 0.9 : 1}
      >
        <LinearGradient
          colors={['rgba(99, 102, 241, 0.05)', 'rgba(139, 92, 246, 0.05)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.gradientCard,
            {
              padding: SPACING[padding],
              borderRadius: BORDER_RADIUS[borderRadius],
            },
          ]}
        >
          {children}
        </LinearGradient>
      </CardComponent>
    );
  }

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        activeOpacity={0.9}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyle}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.CARD,
  },
  
  defaultCard: {
    ...SHADOWS.small,
  },
  
  elevatedCard: {
    ...SHADOWS.large,
    backgroundColor: COLORS.WHITE,
  },
  
  outlinedCard: {
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    backgroundColor: COLORS.WHITE,
  },
  
  gradientCard: {
    borderWidth: 1,
    borderColor: COLORS.PRIMARY + '20',
  },
});