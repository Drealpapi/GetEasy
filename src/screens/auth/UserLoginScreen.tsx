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

interface UserLoginScreenProps {
  navigation: any;
}

export default function UserLoginScreen({ navigation }: UserLoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loginUser, isLoading, error, clearError } = useAuth();
  const { colors } = useTheme();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      clearError();
      await loginUser(email, password);
      // Navigation to user home will be handled by the main app navigator
      // based on authentication state
    } catch (err) {
      // Error is already set in context
    }
  };

  const handleCreateAccount = () => {
    navigation.navigate("UserRegistration");
  };

  const handleForgotPassword = () => {
    navigation.navigate("ForgotPassword", { role: "user" });
  };

  const styles = createAuthStyles(colors);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Login to your account</Text>

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

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor={colors.TEXT_TERTIARY}
          editable={!isLoading}
        />

        <TouchableOpacity 
          style={[styles.button, isLoading && styles.buttonDisabled]} 
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.BACKGROUND} />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={handleForgotPassword} disabled={isLoading}>
          <Text style={styles.linkText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleCreateAccount} disabled={isLoading}>
          <Text style={styles.linkText}>Don't have an account? Create Account</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}