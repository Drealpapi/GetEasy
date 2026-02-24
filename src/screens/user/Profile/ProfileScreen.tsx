import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useAuth } from "../../../context/AuthContext";
import { COLORS, SPACING, FONT_SIZE } from "../../../utils/constants";

export default function ProfileScreen() {
  const { currentUser, logout } = useAuth();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.SURFACE,
    },
    header: {
      backgroundColor: COLORS.CARD,
      alignItems: "center",
      paddingVertical: SPACING.xl,
      marginBottom: SPACING.md,
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: COLORS.PRIMARY,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: SPACING.md,
    },
    avatarText: {
      fontSize: FONT_SIZE.xxl,
      color: COLORS.BACKGROUND,
      fontWeight: "bold",
    },
    name: {
      fontSize: FONT_SIZE.xl,
      fontWeight: "bold",
      color: COLORS.TEXT_PRIMARY,
      marginBottom: 4,
    },
    email: {
      fontSize: FONT_SIZE.md,
      color: COLORS.TEXT_SECONDARY,
    },
    section: {
      backgroundColor: COLORS.CARD,
      marginBottom: SPACING.md,
      paddingVertical: SPACING.sm,
    },
    sectionTitle: {
      fontSize: FONT_SIZE.md,
      fontWeight: "600",
      color: COLORS.TEXT_SECONDARY,
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.sm,
    },
    infoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.md,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.BORDER,
    },
    label: {
      fontSize: FONT_SIZE.md,
      color: COLORS.TEXT_SECONDARY,
    },
    value: {
      fontSize: FONT_SIZE.md,
      color: COLORS.TEXT_PRIMARY,
      fontWeight: "500",
    },
    menuItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.md,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.BORDER,
    },
    menuText: {
      fontSize: FONT_SIZE.md,
      color: COLORS.TEXT_PRIMARY,
    },
    arrow: {
      fontSize: FONT_SIZE.xl,
      color: COLORS.TEXT_SECONDARY,
    },
    logoutButton: {
      backgroundColor: COLORS.CARD,
      marginHorizontal: SPACING.md,
      marginVertical: SPACING.lg,
      paddingVertical: SPACING.md,
      borderRadius: 8,
      alignItems: "center",
      borderWidth: 1,
      borderColor: COLORS.ERROR,
    },
    logoutText: {
      color: COLORS.ERROR,
      fontSize: FONT_SIZE.md,
      fontWeight: "600",
    },
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {currentUser?.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.name}>{currentUser?.name}</Text>
        <Text style={styles.email}>{currentUser?.email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Information</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>Phone</Text>
          <Text style={styles.value}>{currentUser?.phone || "Not set"}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>State</Text>
          <Text style={styles.value}>{currentUser?.state || "Not set"}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Role</Text>
          <Text style={styles.value}>{currentUser?.role}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Edit Profile</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Payment Methods</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Notifications</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Help & Support</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
