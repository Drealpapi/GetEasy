import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme, SPACING, FONT_SIZE } from "../../context/ThemeContext";

export default function ThemeSettings() {
  const { colors, isDarkMode, isSystemTheme, setTheme, useSystemTheme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.CARD_BACKGROUND,
      borderRadius: 12,
      padding: SPACING.lg,
      marginVertical: SPACING.md,
    },
    title: {
      fontSize: FONT_SIZE.lg,
      fontWeight: 'bold',
      color: colors.TEXT_PRIMARY,
      marginBottom: SPACING.md,
    },
    option: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: SPACING.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.BORDER,
    },
    lastOption: {
      borderBottomWidth: 0,
    },
    optionText: {
      fontSize: FONT_SIZE.md,
      color: colors.TEXT_PRIMARY,
    },
    optionSubtext: {
      fontSize: FONT_SIZE.sm,
      color: colors.TEXT_SECONDARY,
      marginTop: 2,
    },
    radioButton: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: colors.PRIMARY,
      alignItems: 'center',
      justifyContent: 'center',
    },
    radioButtonSelected: {
      backgroundColor: colors.PRIMARY,
    },
    radioButtonInner: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.BACKGROUND,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎨 Theme Settings</Text>
      
      <TouchableOpacity 
        style={styles.option}
        onPress={useSystemTheme}
      >
        <View>
          <Text style={styles.optionText}>System Default</Text>
          <Text style={styles.optionSubtext}>
            Follow device theme ({isDarkMode ? 'Dark' : 'Light'})
          </Text>
        </View>
        <View style={[styles.radioButton, isSystemTheme && styles.radioButtonSelected]}>
          {isSystemTheme && <View style={styles.radioButtonInner} />}
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.option}
        onPress={() => setTheme(false)}
      >
        <View>
          <Text style={styles.optionText}>Light Mode</Text>
          <Text style={styles.optionSubtext}>Always use light theme</Text>
        </View>
        <View style={[styles.radioButton, !isSystemTheme && !isDarkMode && styles.radioButtonSelected]}>
          {!isSystemTheme && !isDarkMode && <View style={styles.radioButtonInner} />}
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.option, styles.lastOption]}
        onPress={() => setTheme(true)}
      >
        <View>
          <Text style={styles.optionText}>Dark Mode</Text>
          <Text style={styles.optionSubtext}>Always use dark theme</Text>
        </View>
        <View style={[styles.radioButton, !isSystemTheme && isDarkMode && styles.radioButtonSelected]}>
          {!isSystemTheme && isDarkMode && <View style={styles.radioButtonInner} />}
        </View>
      </TouchableOpacity>
    </View>
  );
}