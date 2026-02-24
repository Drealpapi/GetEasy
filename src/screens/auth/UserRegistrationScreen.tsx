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
import { authStyles } from "../../utils/authStyles";
import { COLORS } from "../../utils/constants";

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

  return (
    <ScrollView style={authStyles.container}>
      <View style={authStyles.content}>
        <Text style={authStyles.title}>Create Account</Text>
        <Text style={authStyles.subtitle}>Join GetEasy as a User</Text>

        {error && (
          <View style={authStyles.errorContainer}>
            <Text style={authStyles.errorText}>{error}</Text>
          </View>
        )}

        <TextInput
          style={authStyles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
          placeholderTextColor={COLORS.TEXT_TERTIARY}
          editable={!isLoading}
        />

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
          placeholder="Password (min 6 characters)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor={COLORS.TEXT_TERTIARY}
          editable={!isLoading}
        />

        <TextInput
          style={authStyles.input}
          placeholder="Phone Number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          placeholderTextColor={COLORS.TEXT_TERTIARY}
          editable={!isLoading}
        />

        <TouchableOpacity 
          style={authStyles.checkboxContainer}
          onPress={() => setAcceptedTerms(!acceptedTerms)}
          disabled={isLoading}
        >
          <View style={[authStyles.checkbox, acceptedTerms && authStyles.checkboxChecked]}>
            {acceptedTerms && <Text style={authStyles.checkmark}>✓</Text>}
          </View>
          <Text style={authStyles.checkboxText}>
            I accept the Terms and Conditions
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[authStyles.button, isLoading && authStyles.buttonDisabled]} 
          onPress={handleRegistration}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS.BACKGROUND} />
          ) : (
            <Text style={authStyles.buttonText}>Create Account</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={handleBackToLogin} disabled={isLoading}>
          <Text style={authStyles.linkText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}