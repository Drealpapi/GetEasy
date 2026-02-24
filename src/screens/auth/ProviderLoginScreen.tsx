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

interface ProviderLoginScreenProps {
  navigation: any;
}

export default function ProviderLoginScreen({ navigation }: ProviderLoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loginProvider, isLoading, error, clearError } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      clearError();
      await loginProvider(email, password);
      // Navigation to provider home will be handled by the main app navigator
      // based on authentication state
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
    <ScrollView style={authStyles.container}>
      <View style={authStyles.content}>
        <Text style={authStyles.title}>Provider Login</Text>
        <Text style={authStyles.subtitle}>Access your provider dashboard</Text>

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
          <Text style={authStyles.linkText}>Don't have an account? Create Provider Account</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}