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
import { useAuth, ProviderRegistrationData } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { createAuthStyles } from "../../utils/authStyles";

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
  const { registerProvider, isLoading, error, clearError } = useAuth();
  const { colors } = useTheme();

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

  const styles = createAuthStyles(colors);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Create Provider Account</Text>
        <Text style={styles.subtitle}>Join GetEasy as a Service Provider</Text>

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

        <TextInput
          style={styles.input}
          placeholder="Business Name"
          value={businessName}
          onChangeText={setBusinessName}
          placeholderTextColor={colors.TEXT_TERTIARY}
          editable={!isLoading}
        />

        <TextInput
          style={styles.input}
          placeholder="Service Category (e.g., Plumbing, Cleaning)"
          value={serviceCategory}
          onChangeText={setServiceCategory}
          placeholderTextColor={colors.TEXT_TERTIARY}
          editable={!isLoading}
        />

        <TextInput
          style={styles.input}
          placeholder="State"
          value={state}
          onChangeText={setState}
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
          style={styles.checkboxContainer}
          onPress={() => setAcceptedProviderTerms(!acceptedProviderTerms)}
          disabled={isLoading}
        >
          <View style={[styles.checkbox, acceptedProviderTerms && styles.checkboxChecked]}>
            {acceptedProviderTerms && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.checkboxText}>
            I accept the Provider Terms and Conditions
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
            <Text style={styles.buttonText}>Create Provider Account</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={handleBackToLogin} disabled={isLoading}>
          <Text style={styles.linkText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}