import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT, BORDER_RADIUS, SHADOWS } from "../../utils/constants";

export default function SignupScreen({ navigation }: any) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<"user" | "provider">("user");
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);

  const handleSignup = () => {
    if (!name || !email || !phone) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    Alert.alert("Success", "Account created! Please login.");
    navigation.navigate("Login");
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
            <Text style={styles.headerTitle}>Join Us Today 🎉</Text>
            <Text style={styles.headerSubtitle}>Create your account</Text>
          </View>
        </LinearGradient>

        {/* Form Card */}
        <View style={styles.formCard}>
          {/* Role Selector */}
          <View style={styles.roleSelector}>
            <TouchableOpacity
              style={[styles.roleButton, role === "user" && styles.roleButtonActive]}
              onPress={() => setRole("user")}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={role === "user" ? COLORS.PRIMARY_GRADIENT : [COLORS.GRAY_100, COLORS.GRAY_100]}
                style={styles.roleButtonGradient}
              >
                <Text style={styles.roleIcon}>{role === "user" ? "👤" : "👤"}</Text>
                <Text style={[styles.roleText, role === "user" && styles.roleTextActive]}>
                  User
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.roleButton, role === "provider" && styles.roleButtonActive]}
              onPress={() => setRole("provider")}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={role === "provider" ? [COLORS.PURPLE_600, COLORS.PURPLE_700] : [COLORS.GRAY_100, COLORS.GRAY_100]}
                style={styles.roleButtonGradient}
              >
                <Text style={styles.roleIcon}>{role === "provider" ? "💼" : "💼"}</Text>
                <Text style={[styles.roleText, role === "provider" && styles.roleTextActive]}>
                  Provider
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

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
              />
            </View>
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity 
            style={styles.signupButton}
            onPress={handleSignup}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={role === "user" ? COLORS.PRIMARY_GRADIENT : [COLORS.PURPLE_600, COLORS.PURPLE_700]}
              style={styles.signupButtonGradient}
            >
              <Text style={styles.signupButtonText}>Sign Up</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Login Link */}
          <TouchableOpacity 
            onPress={() => navigation.navigate("Login")}
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
  
  // Role Selector
  roleSelector: {
    flexDirection: 'row',
    marginBottom: SPACING.xl,
    gap: SPACING.md,
  },
  
  roleButton: {
    flex: 1,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.small,
  },
  
  roleButtonActive: {
    ...SHADOWS.medium,
  },
  
  roleButtonGradient: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
  },
  
  roleIcon: {
    fontSize: 24,
  },
  
  roleText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: FONT_WEIGHT.semibold,
  },
  
  roleTextActive: {
    color: COLORS.WHITE,
    fontWeight: FONT_WEIGHT.bold,
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
  
  // Sign Up Button
  signupButton: {
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    marginTop: SPACING.md,
    ...SHADOWS.medium,
  },
  
  signupButtonGradient: {
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  
  signupButtonText: {
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
    color: COLORS.PRIMARY,
    fontWeight: FONT_WEIGHT.bold,
  },
};
