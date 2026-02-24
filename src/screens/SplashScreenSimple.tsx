import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Dimensions, Animated, Easing } from "react-native";
import { COLORS, FONT_SIZE, SPACING } from "../utils/constants";

interface SplashScreenSimpleProps {
  onFinish: () => void;
}

const { width, height } = Dimensions.get('window');

export default function SplashScreenSimple({ onFinish }: SplashScreenSimpleProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 7000,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
    ]).start();

    const timer = setTimeout(() => {
      onFinish();
    }, 7000); // 7 seconds

    return () => clearTimeout(timer);
  }, [onFinish, fadeAnim, scaleAnim, progressAnim]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={[styles.container, { backgroundColor: COLORS.PRIMARY }]}>
      {/* Animated logo container */}
      <Animated.View 
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }
        ]}
      >
        <Text style={[styles.logoText, { color: COLORS.BACKGROUND }]}>
          GetEasy
        </Text>
        <Text style={[styles.tagline, { color: COLORS.BACKGROUND }]}>
          Making services easy
        </Text>
      </Animated.View>
      
      {/* Animated loading indicator */}
      <Animated.View style={[styles.loadingContainer, { opacity: fadeAnim }]}>
        <View style={[styles.loadingBar, { backgroundColor: COLORS.BACKGROUND + '30' }]}>
          <Animated.View 
            style={[
              styles.loadingProgress, 
              { 
                backgroundColor: COLORS.BACKGROUND,
                width: progressWidth,
              }
            ]} 
          />
        </View>
        <Text style={[styles.loadingText, { color: COLORS.BACKGROUND }]}>
          Loading...
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xxl * 2,
  },
  logoText: {
    fontSize: FONT_SIZE.xxl * 1.5,
    fontWeight: 'bold',
    marginBottom: SPACING.sm,
  },
  tagline: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '300',
    opacity: 0.9,
  },
  loadingContainer: {
    position: 'absolute',
    bottom: SPACING.xxl * 2,
    width: width * 0.6,
    alignItems: 'center',
  },
  loadingBar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    width: '100%',
    marginBottom: SPACING.md,
  },
  loadingProgress: {
    height: '100%',
    borderRadius: 2,
  },
  loadingText: {
    fontSize: FONT_SIZE.sm,
    opacity: 0.8,
  },
});