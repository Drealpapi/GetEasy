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
import { authStyles } from "../../utils/authStyles";
import { COLORS } from "../../utils/constants";

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

  return (
    <ScrollView style={authStyles.container}>
      <View style={authStyles.content}>
        <Text style={authStyles.title}>Create Provider Account</Text>
        <Text style={authStyles.subtitle}>Join GetEasy as a Service Provider</Text>

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

        <TextInput
          style={authStyles.input}
          placeholder="Business Name"
          value={businessName}
          onChangeText={setBusinessName}
          placeholderTextColor={COLORS.TEXT_TERTIARY}
          editable={!isLoading}
        />

        <TextInput
          style={authStyles.input}
          placeholder="Service Category (e.g., Plumbing, Cleaning)"
          value={serviceCategory}
          onChangeText={setServiceCategory}
          placeholderTextColor={COLORS.TEXT_TERTIARY}
          editable={!isLoading}
        />

        <TextInput
          style={authStyles.input}
          placeholder="State"
          value={state}
          onChangeText={setState}
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
          style={authStyles.checkboxContainer}
          onPress={() => setAcceptedProviderTerms(!acceptedProviderTerms)}
          disabled={isLoading}
        >
          <View style={[authStyles.checkbox, acceptedProviderTerms && authStyles.checkboxChecked]}>
            {acceptedProviderTerms && <Text style={authStyles.checkmark}>✓</Text>}
          </View>
          <Text style={authStyles.checkboxText}>
            I accept the Provider Terms and Conditions
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
            <Text style={authStyles.buttonText}>Create Provider Account</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={handleBackToLogin} disabled={isLoading}>
          <Text style={authStyles.linkText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}