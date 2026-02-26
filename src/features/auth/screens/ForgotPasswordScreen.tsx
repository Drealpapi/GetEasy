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
import { COLORS } from "../../../shared/constants/constants";
import { authStyles } from "../../../shared/utils/authStyles";
import { useAuth } from "../context/AuthContext";

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

  if (isSuccess) {
    return (
      <View style={authStyles.container}>
        <View style={authStyles.content}>
          <Text style={authStyles.title}>Check Your Email</Text>
          <Text style={authStyles.subtitle}>
            We've sent password reset instructions to {email}
          </Text>

          <View style={authStyles.successContainer}>
            <Text style={authStyles.successText}>
              Please check your email and follow the instructions to reset your password.
            </Text>
          </View>

          <TouchableOpacity style={authStyles.button} onPress={handleBackToLogin}>
            <Text style={authStyles.buttonText}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={authStyles.container}>
      <View style={authStyles.content}>
        <Text style={authStyles.title}>Reset Password</Text>
        <Text style={authStyles.subtitle}>
          {role === 'provider'
            ? "Enter your provider email to reset your password"
            : "Enter your email to reset your password"
          }
        </Text>

        {error && (
          <View style={authStyles.errorContainer}>
            <Text style={authStyles.errorText}>{error}</Text>
          </View>
        )}

        <TextInput
          style={authStyles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor={COLORS.TEXT_TERTIARY}
          editable={!isLoading}
        />

        <TouchableOpacity
          style={[authStyles.button, isLoading && authStyles.buttonDisabled]}
          onPress={handleResetPassword}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS.BACKGROUND} />
          ) : (
            <Text style={authStyles.buttonText}>Send Reset Instructions</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={handleBackToLogin} disabled={isLoading}>
          <Text style={authStyles.linkText}>Remember your password? Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}