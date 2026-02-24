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
import { authStyles } from "../../utils/authStyles";
import { COLORS } from "../../utils/constants";

interface UserLoginScreenProps {
  navigation: any;
}

export default function UserLoginScreen({ navigation }: UserLoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loginUser, isLoading, error, clearError } = useAuth();

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

  return (
    <ScrollView style={authStyles.container}>
      <View style={authStyles.content}>
        <Text style={authStyles.title}>Welcome Back</Text>
        <Text style={authStyles.subtitle}>Login to your account</Text>

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

        <TextInput
          style={authStyles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor={COLORS.TEXT_TERTIARY}
          editable={!isLoading}
        />

        <TouchableOpacity 
          style={[authStyles.button, isLoading && authStyles.buttonDisabled]} 
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS.BACKGROUND} />
          ) : (
            <Text style={authStyles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={handleForgotPassword} disabled={isLoading}>
          <Text style={authStyles.linkText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleCreateAccount} disabled={isLoading}>
          <Text style={authStyles.linkText}>Don't have an account? Create Account</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

