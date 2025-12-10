import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme, SPACING, FONT_SIZE } from "../../context/ThemeContext";
import ThemeToggle from "../../components/common/ThemeToggle";

interface RoleSelectionScreenProps {
  navigation: any;
}

export default function RoleSelectionScreen({ navigation }: RoleSelectionScreenProps) {
  const { colors } = useTheme();

  const handleUserLogin = () => {
    navigation.navigate("UserLogin");
  };

  const handleProviderLogin = () => {
    navigation.navigate("ProviderLogin");
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.BACKGROUND,
      padding: SPACING.lg,
    },
    themeToggleContainer: {
      position: "absolute",
      top: 60,
      right: SPACING.lg,
    },
    title: {
      fontSize: FONT_SIZE.xxl,
      fontWeight: "bold",
      color: colors.PRIMARY,
      marginBottom: SPACING.sm,
    },
    subtitle: {
      fontSize: FONT_SIZE.md,
      color: colors.TEXT_SECONDARY,
      marginBottom: SPACING.xl,
    },
    button: {
      backgroundColor: colors.PRIMARY,
      paddingVertical: SPACING.md,
      paddingHorizontal: SPACING.xl,
      borderRadius: 8,
      marginVertical: SPACING.sm,
      width: "100%",
      alignItems: "center",
      shadowColor: colors.SHADOW,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    providerButton: {
      backgroundColor: colors.SECONDARY,
    },
    buttonText: {
      color: colors.BACKGROUND,
      fontSize: FONT_SIZE.md,
      fontWeight: "600",
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.themeToggleContainer}>
        <ThemeToggle showLabel={false} size="small" />
      </View>
      
      <Text style={styles.title}>GetEasy</Text>
      <Text style={styles.subtitle}>Login</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={handleUserLogin}
      >
        <Text style={styles.buttonText}>Login as User</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.providerButton]}
        onPress={handleProviderLogin}
      >
        <Text style={styles.buttonText}>Login as Provider</Text>
      </TouchableOpacity>
    </View>
  );
}