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
import { useAuth, UserRegistrationData } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { createAuthStyles } from "../../utils/authStyles";

interface UserRegistrationScreenProps {
  navigation: any;
}

export default function UserRegistrationScreen({ navigation }: UserRegistrationScreenProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const { registerUser, isLoading, error, clearError } = useAuth();
  const { colors } = useTheme();

  const handleRegistration = async () => {
    if (!name || !email || !password || !phone) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    if (!acceptedTerms) {
      Alert.alert("Error", "Please accept the terms and conditions");
      return;
    }

    const userData: UserRegistrationData = {
      name,
      email,
      password,
      phone,
      acceptedTerms,
    };

    try {
      clearError();
      await registerUser(userData);
      Alert.alert(
        "Success", 
        "Account created successfully! Please login with your credentials.",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("UserLogin")
          }
        ]
      );
    } catch (err) {
      // Error is already set in context
    }
  };

  const handleBackToLogin = () => {
    navigation.navigate("UserLogin");
  };

  const styles = createAuthStyles(colors);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join GetEasy as a User</Text>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
          placeholderTextColor={colors.TEXT_TERTIARY}
          editable={!isLoading}
        />

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
          placeholder="Password (min 6 characters)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor={colors.TEXT_TERTIARY}
          editable={!isLoading}
        />

        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          placeholderTextColor={colors.TEXT_TERTIARY}
          editable={!isLoading}
        />

        <TouchableOpacity 
          style={styles.checkboxContainer}
          onPress={() => setAcceptedTerms(!acceptedTerms)}
          disabled={isLoading}
        >
          <View style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
            {acceptedTerms && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.checkboxText}>
            I accept the Terms and Conditions
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, isLoading && styles.buttonDisabled]} 
          onPress={handleRegistration}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.BACKGROUND} />
          ) : (
            <Text style={styles.buttonText}>Create Account</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={handleBackToLogin} disabled={isLoading}>
          <Text style={styles.linkText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}