import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from "../../context/AuthContext";
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT, BORDER_RADIUS, SHADOWS } from "../../utils/constants";

interface ProviderLoginScreenProps {
  navigation: any;
}

export default function ProviderLoginScreen({ navigation }: ProviderLoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const { loginProvider, isLoading, error, clearError } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      clearError();
      await loginProvider(email, password);
    } catch (err) {
      // Error is already set in context
    }
  };

  const handleCreateAccount = () => {
    navigation.navigate("ProviderRegistration");
  };

  const handleForgotPassword = () => {
    navigation.navigate("ForgotPassword", { role: "provider" });
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
          colors={COLORS.PRIMARY_GRADIENT}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <Text style={styles.logo}>GetEasy</Text>
            <Text style={styles.providerBadge}>🏢 Provider Portal</Text>
            <Text style={styles.headerTitle}>Welcome Back!</Text>
            <Text style={styles.headerSubtitle}>Access your dashboard</Text>
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

          {/* Email Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Business Email</Text>
            <View style={[
              styles.inputContainer,
              emailFocused && styles.inputContainerFocused
            ]}>
              <Text style={styles.inputIcon}>📧</Text>
              <TextInput
                style={styles.input}
                placeholder="business@email.com"
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
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor={COLORS.TEXT_TERTIARY}
                editable={!isLoading}
              />
            </View>
          </View>

          {/* Forgot Password */}
          <TouchableOpacity 
            onPress={handleForgotPassword} 
            disabled={isLoading}
            style={styles.forgotButton}
          >
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity 
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]} 
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={isLoading ? [COLORS.GRAY_300, COLORS.GRAY_400] : COLORS.PRIMARY_GRADIENT}
              style={styles.loginButtonGradient}
            >
              {isLoading ? (
                <ActivityIndicator color={COLORS.WHITE} />
              ) : (
                <Text style={styles.loginButtonText}>Login to Dashboard</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Create Account */}
          <TouchableOpacity 
            onPress={handleCreateAccount} 
            disabled={isLoading}
            style={styles.createAccountButton}
          >
            <Text style={styles.createAccountText}>
              New provider? <Text style={styles.createAccountLink}>Register Your Business</Text>
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
  
  logo: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.WHITE,
    marginBottom: SPACING.sm,
    letterSpacing: 1,
  },
  
  providerBadge: {
    fontSize: FONT_SIZE.md,
    color: COLORS.WHITE,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    marginBottom: SPACING.lg,
    fontWeight: FONT_WEIGHT.semibold,
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
    borderColor: COLORS.PRIMARY,
    backgroundColor: COLORS.WHITE,
    ...SHADOWS.colored,
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
  
  // Forgot Password
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.xl,
  },
  
  forgotText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.PRIMARY,
    fontWeight: FONT_WEIGHT.semibold,
  },
  
  // Login Button
  loginButton: {
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  
  loginButtonDisabled: {
    opacity: 0.6,
  },
  
  loginButtonGradient: {
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  
  loginButtonText: {
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
  
  // Create Account
  createAccountButton: {
    alignItems: 'center',
  },
  
  createAccountText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: FONT_WEIGHT.medium,
  },
  
  createAccountLink: {
    color: COLORS.PRIMARY,
    fontWeight: FONT_WEIGHT.bold,
  },
};