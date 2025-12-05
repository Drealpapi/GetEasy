import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { COLORS, SPACING, FONT_SIZE } from "../../utils/constants";

export default function SignupScreen({ navigation }: any) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<"user" | "provider">("user");

  const handleSignup = () => {
    if (!name || !email || !phone) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    Alert.alert("Success", "Account created! Please login.");
    navigation.navigate("Login");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join GetEasy today</Text>

        <View style={styles.roleSelector}>
          <TouchableOpacity
            style={[styles.roleButton, role === "user" && styles.roleButtonActive]}
            onPress={() => setRole("user")}
          >
            <Text style={[styles.roleText, role === "user" && styles.roleTextActive]}>
              User
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleButton, role === "provider" && styles.roleButtonActive]}
            onPress={() => setRole("provider")}
          >
            <Text style={[styles.roleText, role === "provider" && styles.roleTextActive]}>
              Provider
            </Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
          placeholderTextColor={COLORS.GRAY}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor={COLORS.GRAY}
        />

        <TextInput
          style={styles.input}
          placeholder="Phone"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          placeholderTextColor={COLORS.GRAY}
        />

        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.linkText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  content: {
    padding: SPACING.lg,
    paddingTop: SPACING.xxl,
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: "bold",
    color: COLORS.EMERALD_GREEN,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.GRAY,
    marginBottom: SPACING.xl,
  },
  roleSelector: {
    flexDirection: "row",
    marginBottom: SPACING.lg,
    gap: SPACING.md,
  },
  roleButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.LIGHT_GRAY,
    alignItems: "center",
  },
  roleButtonActive: {
    borderColor: COLORS.EMERALD_GREEN,
    backgroundColor: COLORS.EMERALD_GREEN,
  },
  roleText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.GRAY,
    fontWeight: "600",
  },
  roleTextActive: {
    color: COLORS.WHITE,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GRAY,
    borderRadius: 8,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    fontSize: FONT_SIZE.md,
    color: COLORS.BLACK,
  },
  button: {
    backgroundColor: COLORS.EMERALD_GREEN,
    paddingVertical: SPACING.md,
    borderRadius: 8,
    alignItems: "center",
    marginTop: SPACING.md,
  },
  buttonText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
  },
  linkText: {
    color: COLORS.EMERALD_GREEN,
    fontSize: FONT_SIZE.sm,
    textAlign: "center",
    marginTop: SPACING.lg,
  },
});
