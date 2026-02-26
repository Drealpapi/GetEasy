import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { BORDER_RADIUS, COLORS, FONT_SIZE, FONT_WEIGHT, SHADOWS, SPACING } from "../../../shared/constants/constants";
import { ProviderRegistrationData, useAuth } from "../context/AuthContext";

interface ProviderRegistrationScreenProps {
  navigation: any;
}

export default function ProviderRegistrationScreen({ navigation }: ProviderRegistrationScreenProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [serviceCategory, setServiceCategory] = useState("");
  const [state, setState] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedProviderTerms, setAcceptedProviderTerms] = useState(false);
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);
  const [businessFocused, setBusinessFocused] = useState(false);
  const [categoryFocused, setCategoryFocused] = useState(false);
  const [stateFocused, setStateFocused] = useState(false);
  const { registerProvider, isLoading, error, clearError } = useAuth();

  const handleRegistration = async () => {
    if (!name || !email || !password || !phone || !businessName || !serviceCategory || !state) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    if (!acceptedTerms || !acceptedProviderTerms) {
      Alert.alert("Error", "Please accept all terms and conditions");
      return;
    }

    const providerData: ProviderRegistrationData = {
      name,
      email,
      password,
      phone,
      businessName,
      serviceCategory,
      state,
      acceptedTerms,
      acceptedProviderTerms,
    };

    try {
      clearError();
      await registerProvider(providerData);
      Alert.alert(
        "Success",
        "Provider account created successfully! Please login with your credentials.",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("ProviderLogin")
          }
        ]
      );
    } catch (err) {
      // Error is already set in context
    }
  };

  const handleBackToLogin = () => {
    navigation.navigate("ProviderLogin");
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
      >
        {/* Header with gradient */}
        <LinearGradient
          colors={[COLORS.PURPLE_600, COLORS.PURPLE_700]}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View style={styles.providerBadge}>
              <Text style={styles.badgeText}>💼 PROVIDER</Text>
            </View>
            <Text style={styles.logo}>GetEasy</Text>
            <Text style={styles.headerTitle}>Start Your Business 🚀</Text>
            <Text style={styles.headerSubtitle}>Join as a Service Provider</Text>
          </View>
        </LinearGradient>

        {/* Form Card */}
        <View style={styles.formCard}>
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorIcon}>⚠️</Text>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Name Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <View style={[
              styles.inputContainer,
              nameFocused && styles.inputContainerFocused
            ]}>
              <Text style={styles.inputIcon}>👤</Text>
              <TextInput
                style={styles.input}
                placeholder="John Doe"
                value={name}
                onChangeText={setName}
                placeholderTextColor={COLORS.TEXT_TERTIARY}
                editable={!isLoading}
              />
            </View>
          </View>

          {/* Email Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <View style={[
              styles.inputContainer,
              emailFocused && styles.inputContainerFocused
            ]}>
              <Text style={styles.inputIcon}>📧</Text>
              <TextInput
                style={styles.input}
                placeholder="your@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={COLORS.TEXT_TERTIARY}
                editable={!isLoading}
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={[
              styles.inputContainer,
              passwordFocused && styles.inputContainerFocused
            ]}>
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput
                style={styles.input}
                placeholder="Min 6 characters"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor={COLORS.TEXT_TERTIARY}
                editable={!isLoading}
              />
            </View>
          </View>

          {/* Phone Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <View style={[
              styles.inputContainer,
              phoneFocused && styles.inputContainerFocused
            ]}>
              <Text style={styles.inputIcon}>📱</Text>
              <TextInput
                style={styles.input}
                placeholder="(555) 123-4567"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                placeholderTextColor={COLORS.TEXT_TERTIARY}
                editable={!isLoading}
              />
            </View>
          </View>

          {/* Business Name Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Business Name</Text>
            <View style={[
              styles.inputContainer,
              businessFocused && styles.inputContainerFocused
            ]}>
              <Text style={styles.inputIcon}>🏢</Text>
              <TextInput
                style={styles.input}
                placeholder="Your Business Name"
                value={businessName}
                onChangeText={setBusinessName}
                placeholderTextColor={COLORS.TEXT_TERTIARY}
                editable={!isLoading}
              />
            </View>
          </View>

          {/* Service Category Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Service Category</Text>
            <View style={[
              styles.inputContainer,
              categoryFocused && styles.inputContainerFocused
            ]}>
              <Text style={styles.inputIcon}>🔧</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Plumbing, Cleaning"
                value={serviceCategory}
                onChangeText={setServiceCategory}
                placeholderTextColor={COLORS.TEXT_TERTIARY}
                editable={!isLoading}
              />
            </View>
          </View>

          {/* State Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>State</Text>
            <View style={[
              styles.inputContainer,
              stateFocused && styles.inputContainerFocused
            ]}>
              <Text style={styles.inputIcon}>📍</Text>
              <TextInput
                style={styles.input}
                placeholder="Your State"
                value={state}
                onChangeText={setState}
                placeholderTextColor={COLORS.TEXT_TERTIARY}
                editable={!isLoading}
              />
            </View>
          </View>

          {/* Terms Checkbox */}
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setAcceptedTerms(!acceptedTerms)}
            disabled={isLoading}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
              {acceptedTerms && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxText}>
              I accept the Terms and Conditions
            </Text>
          </TouchableOpacity>

          {/* Provider Terms Checkbox */}
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setAcceptedProviderTerms(!acceptedProviderTerms)}
            disabled={isLoading}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, acceptedProviderTerms && styles.checkboxChecked]}>
              {acceptedProviderTerms && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxText}>
              I accept the Provider Terms and Conditions
            </Text>
          </TouchableOpacity>

          {/* Create Account Button */}
          <TouchableOpacity
            style={[styles.createButton, isLoading && styles.createButtonDisabled]}
            onPress={handleRegistration}
            disabled={isLoading}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={isLoading ? [COLORS.GRAY_300, COLORS.GRAY_400] : [COLORS.PURPLE_600, COLORS.PURPLE_700]}
              style={styles.createButtonGradient}
            >
              {isLoading ? (
                <ActivityIndicator color={COLORS.WHITE} />
              ) : (
                <Text style={styles.createButtonText}>Create Provider Account</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Back to Login */}
          <TouchableOpacity
            onPress={handleBackToLogin}
            disabled={isLoading}
            style={styles.loginButton}
          >
            <Text style={styles.loginText}>
              Already have an account? <Text style={styles.loginLink}>Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
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

  providerBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    marginBottom: SPACING.md,
  },

  badgeText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: 1,
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

  // Form Card
  formCard: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    borderTopLeftRadius: BORDER_RADIUS.xxl,
    borderTopRightRadius: BORDER_RADIUS.xxl,
    marginTop: -SPACING.xl,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xxxl,
    paddingBottom: SPACING.xl,
    ...SHADOWS.large,
  },

  // Error
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.ERROR_LIGHT,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.lg,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.ERROR,
  },

  errorIcon: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },

  errorText: {
    flex: 1,
    color: COLORS.ERROR,
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.medium,
  },

  // Input Group
  inputGroup: {
    marginBottom: SPACING.lg,
  },

  inputLabel: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.sm,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.GRAY_50,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 2,
    borderColor: COLORS.BORDER,
    paddingHorizontal: SPACING.md,
  },

  inputContainerFocused: {
    borderColor: COLORS.PURPLE_600,
    backgroundColor: COLORS.WHITE,
    shadowColor: COLORS.PURPLE_600,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },

  inputIcon: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },

  input: {
    flex: 1,
    paddingVertical: SPACING.md,
    fontSize: FONT_SIZE.md,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: FONT_WEIGHT.medium,
  },

  // Checkbox
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },

  checkbox: {
    width: 24,
    height: 24,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 2,
    borderColor: COLORS.BORDER,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
    backgroundColor: COLORS.WHITE,
  },

  checkboxChecked: {
    backgroundColor: COLORS.PURPLE_600,
    borderColor: COLORS.PURPLE_600,
  },

  checkmark: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: FONT_WEIGHT.bold,
  },

  checkboxText: {
    flex: 1,
    fontSize: FONT_SIZE.sm,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: FONT_WEIGHT.medium,
  },

  // Create Button
  createButton: {
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    marginTop: SPACING.lg,
    ...SHADOWS.medium,
  },

  createButtonDisabled: {
    opacity: 0.6,
  },

  createButtonGradient: {
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },

  createButtonText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
  },

  // Divider
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.xl,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.BORDER,
  },

  dividerText: {
    marginHorizontal: SPACING.md,
    fontSize: FONT_SIZE.sm,
    color: COLORS.TEXT_TERTIARY,
    fontWeight: FONT_WEIGHT.medium,
  },

  // Login
  loginButton: {
    alignItems: 'center',
  },

  loginText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: FONT_WEIGHT.medium,
  },

  loginLink: {
    color: COLORS.PURPLE_600,
    fontWeight: FONT_WEIGHT.bold,
  },
};
