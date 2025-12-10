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
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { createAuthStyles } from "../../utils/authStyles";

interface ForgotPasswordScreenProps {
  navigation: any;
  route: {
    params: {
      role: 'user' | 'provider';
    };
  };
}

export default function ForgotPasswordScreen({ navigation, route }: ForgotPasswordScreenProps) {
  const [email, setEmail] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const { resetPassword, isLoading, error, clearError } = useAuth();
  const { colors } = useTheme();
  const role = route.params?.role || 'user';

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    try {
      clearError();
      await resetPassword(email, role);
      setIsSuccess(true);
    } catch (err) {
      // Error is already set in context
    }
  };

  const handleBackToLogin = () => {
    if (role === 'provider') {
      navigation.navigate("ProviderLogin");
    } else {
      navigation.navigate("UserLogin");
    }
  };

  const styles = createAuthStyles(colors);

  if (isSuccess) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Check Your Email</Text>
          <Text style={styles.subtitle}>
            We've sent password reset instructions to {email}
          </Text>
          
          <View style={styles.successContainer}>
            <Text style={styles.successText}>
              Please check your email and follow the instructions to reset your password.
            </Text>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleBackToLogin}>
            <Text style={styles.buttonText}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>
          {role === 'provider' 
            ? "Enter your provider email to reset your password" 
            : "Enter your email to reset your password"
          }
        </Text>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor={colors.TEXT_TERTIARY}
          editable={!isLoading}
        />

        <TouchableOpacity 
          style={[styles.button, isLoading && styles.buttonDisabled]} 
          onPress={handleResetPassword}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.BACKGROUND} />
          ) : (
            <Text style={styles.buttonText}>Send Reset Instructions</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={handleBackToLogin} disabled={isLoading}>
          <Text style={styles.linkText}>Remember your password? Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}