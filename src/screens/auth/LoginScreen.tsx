import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useDemoAuth } from "../../context/DemoAuthContext";
import { COLORS, SPACING, FONT_SIZE } from "../../utils/constants";

export default function LoginScreen() {
  const { loginAsUser, loginAsProvider } = useDemoAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GetEasy</Text>
      <Text style={styles.subtitle}>Demo Login</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => loginAsUser("user_001")}
      >
        <Text style={styles.buttonText}>Login as User</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.providerButton]}
        onPress={() => loginAsProvider("provider_001")}
      >
        <Text style={styles.buttonText}>Login as Provider</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.WHITE,
    padding: SPACING.lg,
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
  button: {
    backgroundColor: COLORS.EMERALD_GREEN,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: 8,
    marginVertical: SPACING.sm,
    width: "100%",
    alignItems: "center",
  },
  providerButton: {
    backgroundColor: COLORS.EMERALD_DARK,
  },
  buttonText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
  },
});
