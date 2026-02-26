import { LinearGradient } from 'expo-linear-gradient';
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { BORDER_RADIUS, COLORS, FONT_SIZE, FONT_WEIGHT, SHADOWS, SPACING } from "../../../shared/constants/constants";

interface RoleSelectionScreenProps {
  navigation: any;
}

export default function RoleSelectionScreen({ navigation }: RoleSelectionScreenProps) {

  const handleUserLogin = () => {
    navigation.navigate("UserLogin");
  };

  const handleProviderLogin = () => {
    navigation.navigate("ProviderLogin");
  };

  return (
    <View style={styles.container}>
      {/* Header with gradient */}
      <LinearGradient
        colors={COLORS.PRIMARY_GRADIENT}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.logo}>GetEasy</Text>
          <Text style={styles.headerTitle}>Choose Your Role</Text>
          <Text style={styles.headerSubtitle}>Select how you want to continue</Text>
        </View>
      </LinearGradient>

      {/* Role Cards */}
      <View style={styles.content}>
        {/* User Card */}
        <TouchableOpacity
          style={styles.roleCard}
          onPress={handleUserLogin}
          activeOpacity={0.9}
        >
          <View style={styles.roleCardContent}>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>👤</Text>
            </View>
            <Text style={styles.roleTitle}>I'm a User</Text>
            <Text style={styles.roleDescription}>
              Find and book services from trusted providers
            </Text>
            <View style={styles.roleButton}>
              <LinearGradient
                colors={COLORS.PRIMARY_GRADIENT}
                style={styles.roleButtonGradient}
              >
                <Text style={styles.roleButtonText}>Continue as User</Text>
              </LinearGradient>
            </View>
          </View>
        </TouchableOpacity>

        {/* Provider Card */}
        <TouchableOpacity
          style={styles.roleCard}
          onPress={handleProviderLogin}
          activeOpacity={0.9}
        >
          <View style={styles.roleCardContent}>
            <View style={[styles.iconContainer, styles.iconContainerProvider]}>
              <Text style={styles.icon}>💼</Text>
            </View>
            <Text style={styles.roleTitle}>I'm a Provider</Text>
            <Text style={styles.roleDescription}>
              Offer your services and grow your business
            </Text>
            <View style={styles.roleButton}>
              <LinearGradient
                colors={[COLORS.PURPLE_600, COLORS.PURPLE_700]}
                style={styles.roleButtonGradient}
              >
                <Text style={styles.roleButtonText}>Continue as Provider</Text>
              </LinearGradient>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },

  // Header
  header: {
    paddingTop: SPACING.xxxl + 20,
    paddingBottom: SPACING.xxxl,
    paddingHorizontal: SPACING.xl,
  },

  headerContent: {
    alignItems: 'center',
  },

  logo: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.WHITE,
    marginBottom: SPACING.lg,
    letterSpacing: 1,
  },

  headerTitle: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.WHITE,
    marginBottom: SPACING.xs,
  },

  headerSubtitle: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.WHITE,
    opacity: 0.9,
  },

  // Content
  content: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
    gap: SPACING.lg,
  },

  // Role Card
  roleCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.xl,
    ...SHADOWS.large,
  },

  roleCardContent: {
    padding: SPACING.xl,
    alignItems: 'center',
  },

  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.INDIGO_50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },

  iconContainerProvider: {
    backgroundColor: COLORS.PURPLE_50,
  },

  icon: {
    fontSize: 40,
  },

  roleTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.sm,
  },

  roleDescription: {
    fontSize: FONT_SIZE.md,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 22,
  },

  roleButton: {
    width: '100%',
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },

  roleButtonGradient: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },

  roleButtonText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
  },
};