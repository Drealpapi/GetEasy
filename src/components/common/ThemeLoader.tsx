import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";

export default function ThemeLoader() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0a8a60" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});