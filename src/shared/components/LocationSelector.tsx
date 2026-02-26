import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BORDER_RADIUS, COLORS, FONT_SIZE, FONT_WEIGHT, SHADOWS, SPACING, STATES } from '../constants/constants';

interface LocationSelectorProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectLocation: (location: string) => void;
  selectedLocation?: string;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function LocationSelector({
  isVisible,
  onClose,
  onSelectLocation,
  selectedLocation,
}: LocationSelectorProps) {
  const slideAnim = useRef(new Animated.Value(-300)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: -300,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible]);

  const handleLocationSelect = (location: string) => {
    onSelectLocation(location);
    onClose();
  };

  if (!isVisible) return null;

  return (
    <View style={styles.container}>
      {/* Backdrop */}
      <Animated.View
        style={[
          styles.backdrop,
          {
            opacity: backdropAnim,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.backdropTouchable}
          onPress={onClose}
          activeOpacity={1}
        />
      </Animated.View>

      {/* Slide-down panel */}
      <Animated.View
        style={[
          styles.panel,
          {
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Handle bar */}
        <View style={styles.handleContainer}>
          <View style={styles.handle} />
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Select Location</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Current location option */}
        <TouchableOpacity
          style={[
            styles.locationItem,
            styles.currentLocationItem,
          ]}
          onPress={() => handleLocationSelect('Current Location')}
          activeOpacity={0.8}
        >
          <View style={styles.locationIcon}>
            <Text style={styles.locationIconText}>📍</Text>
          </View>
          <View style={styles.locationInfo}>
            <Text style={styles.currentLocationText}>Use Current Location</Text>
            <Text style={styles.currentLocationSubtext}>Automatically detect your area</Text>
          </View>
          <View style={styles.locationArrow}>
            <Text style={styles.arrowText}>→</Text>
          </View>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>Or choose a state</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* States list */}
        <ScrollView
          style={styles.statesList}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          {STATES.map((state) => (
            <TouchableOpacity
              key={state}
              style={[
                styles.locationItem,
                selectedLocation === state && styles.selectedLocationItem,
              ]}
              onPress={() => handleLocationSelect(state)}
              activeOpacity={0.8}
            >
              <View style={styles.locationIcon}>
                <Text style={styles.locationIconText}>🏛️</Text>
              </View>
              <View style={styles.locationInfo}>
                <Text style={[
                  styles.locationText,
                  selectedLocation === state && styles.selectedLocationText,
                ]}>
                  {state}
                </Text>
              </View>
              {selectedLocation === state && (
                <View style={styles.selectedIcon}>
                  <Text style={styles.selectedIconText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },

  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.BACKDROP,
  },

  backdropTouchable: {
    flex: 1,
  },

  panel: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.WHITE,
    borderBottomLeftRadius: BORDER_RADIUS.xxl,
    borderBottomRightRadius: BORDER_RADIUS.xxl,
    maxHeight: SCREEN_HEIGHT * 0.7,
    ...SHADOWS.large,
  },

  handleContainer: {
    alignItems: 'center',
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },

  handle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.GRAY_300,
    borderRadius: BORDER_RADIUS.full,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
  },

  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.TEXT_PRIMARY,
  },

  closeButton: {
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.GRAY_100,
    justifyContent: 'center',
    alignItems: 'center',
  },

  closeIcon: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: FONT_WEIGHT.bold,
  },

  currentLocationItem: {
    backgroundColor: COLORS.PRIMARY + '10',
    borderColor: COLORS.PRIMARY + '30',
    borderWidth: 1,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },

  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.xs,
  },

  selectedLocationItem: {
    backgroundColor: COLORS.PRIMARY + '15',
    borderColor: COLORS.PRIMARY + '40',
    borderWidth: 1,
  },

  locationIcon: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.GRAY_100,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },

  locationIconText: {
    fontSize: 20,
  },

  locationInfo: {
    flex: 1,
  },

  currentLocationText: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.PRIMARY,
    marginBottom: 2,
  },

  currentLocationSubtext: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.TEXT_SECONDARY,
  },

  locationText: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.TEXT_PRIMARY,
  },

  selectedLocationText: {
    color: COLORS.PRIMARY,
    fontWeight: FONT_WEIGHT.semibold,
  },

  locationArrow: {
    marginLeft: SPACING.sm,
  },

  arrowText: {
    fontSize: 18,
    color: COLORS.PRIMARY,
    fontWeight: FONT_WEIGHT.bold,
  },

  selectedIcon: {
    width: 24,
    height: 24,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.sm,
  },

  selectedIconText: {
    fontSize: 14,
    color: COLORS.WHITE,
    fontWeight: FONT_WEIGHT.bold,
  },

  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    marginVertical: SPACING.md,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.BORDER,
  },

  dividerText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.TEXT_TERTIARY,
    marginHorizontal: SPACING.md,
    fontWeight: FONT_WEIGHT.medium,
  },

  statesList: {
    maxHeight: 300,
    paddingBottom: SPACING.lg,
  },
});