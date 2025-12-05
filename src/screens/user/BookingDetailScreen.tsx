import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { updateBookingStatus } from "../../services/mock/mockData";
import { COLORS, SPACING, FONT_SIZE } from "../../utils/constants";
import { formatDate, formatPrice } from "../../utils/helpers";

export default function BookingDetailScreen({ route, navigation }: any) {
  const [booking, setBooking] = useState(route.params.booking);
  const [loading, setLoading] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return COLORS.SUCCESS;
      case "Accepted":
        return COLORS.EMERALD_GREEN;
      case "Pending":
        return COLORS.WARNING;
      case "Declined":
        return COLORS.ERROR;
      default:
        return COLORS.GRAY;
    }
  };

  const handleCancel = () => {
    Alert.alert(
      "Cancel Booking",
      "Are you sure you want to cancel this booking?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            await updateBookingStatus(booking.id, "Declined");
            setBooking({ ...booking, status: "Declined" });
            setLoading(false);
            Alert.alert("Success", "Booking cancelled");
          },
        },
      ]
    );
  };

  const handleAddReview = () => {
    navigation.navigate("AddReview", { booking });
  };

  const canCancel = booking.status === "Pending" || booking.status === "Accepted";
  const canReview = booking.status === "Completed" && !booking.reviewed;

  return (
    <ScrollView style={styles.container}>
      {/* Status Banner */}
      <View style={[styles.statusBanner, { backgroundColor: getStatusColor(booking.status) }]}>
        <Text style={styles.statusText}>{booking.status}</Text>
      </View>

      {/* Booking Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Booking Information</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Booking ID</Text>
            <Text style={styles.value}>#{booking.id.slice(-8)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Service</Text>
            <Text style={styles.value}>#{booking.serviceId.slice(-4)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Date</Text>
            <Text style={styles.value}>{formatDate(new Date(booking.date))}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Time</Text>
            <Text style={styles.value}>{booking.time}</Text>
          </View>
        </View>
      </View>

      {/* Address */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Service Address</Text>
        <View style={styles.addressCard}>
          <Text style={styles.addressIcon}>📍</Text>
          <Text style={styles.addressText}>{booking.address}</Text>
        </View>
      </View>

      {/* Provider Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Provider</Text>
        <View style={styles.providerCard}>
          <View style={styles.providerAvatar}>
            <Text style={styles.providerAvatarText}>👤</Text>
          </View>
          <View style={styles.providerInfo}>
            <Text style={styles.providerName}>Provider #{booking.providerId.slice(-4)}</Text>
            <Text style={styles.providerContact}>Contact via app</Text>
          </View>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        {canReview && (
          <TouchableOpacity style={styles.reviewButton} onPress={handleAddReview}>
            <Text style={styles.reviewButtonText}>⭐ Leave a Review</Text>
          </TouchableOpacity>
        )}

        {canCancel && (
          <TouchableOpacity
            style={[styles.cancelButton, loading && styles.buttonDisabled]}
            onPress={handleCancel}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>
              {loading ? "Cancelling..." : "Cancel Booking"}
            </Text>
          </TouchableOpacity>
        )}

        {booking.status === "Completed" && booking.reviewed && (
          <View style={styles.reviewedBadge}>
            <Text style={styles.reviewedText}>✓ Review Submitted</Text>
          </View>
        )}
      </View>

      {/* Help */}
      <View style={styles.helpSection}>
        <Text style={styles.helpTitle}>Need Help?</Text>
        <TouchableOpacity style={styles.helpButton}>
          <Text style={styles.helpButtonText}>Contact Support</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.LIGHT_GRAY,
  },
  statusBanner: {
    padding: SPACING.lg,
    alignItems: "center",
  },
  statusText: {
    fontSize: FONT_SIZE.xl,
    fontWeight: "bold",
    color: COLORS.WHITE,
  },
  section: {
    backgroundColor: COLORS.WHITE,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "bold",
    color: COLORS.BLACK,
    marginBottom: SPACING.md,
  },
  infoCard: {
    backgroundColor: COLORS.LIGHT_GRAY,
    borderRadius: 12,
    padding: SPACING.md,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: SPACING.sm,
  },
  label: {
    fontSize: FONT_SIZE.md,
    color: COLORS.GRAY,
  },
  value: {
    fontSize: FONT_SIZE.md,
    color: COLORS.BLACK,
    fontWeight: "600",
  },
  addressCard: {
    flexDirection: "row",
    backgroundColor: COLORS.LIGHT_GRAY,
    borderRadius: 12,
    padding: SPACING.md,
  },
  addressIcon: {
    fontSize: 24,
    marginRight: SPACING.md,
  },
  addressText: {
    flex: 1,
    fontSize: FONT_SIZE.md,
    color: COLORS.BLACK,
    lineHeight: 22,
  },
  providerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.LIGHT_GRAY,
    borderRadius: 12,
    padding: SPACING.md,
  },
  providerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.EMERALD_GREEN,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.md,
  },
  providerAvatarText: {
    fontSize: 24,
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
    color: COLORS.BLACK,
    marginBottom: 2,
  },
  providerContact: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.GRAY,
  },
  actions: {
    padding: SPACING.lg,
  },
  reviewButton: {
    backgroundColor: COLORS.EMERALD_GREEN,
    paddingVertical: SPACING.md,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  reviewButtonText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
  },
  cancelButton: {
    backgroundColor: COLORS.WHITE,
    borderWidth: 2,
    borderColor: COLORS.ERROR,
    paddingVertical: SPACING.md,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    color: COLORS.ERROR,
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  reviewedBadge: {
    backgroundColor: COLORS.SUCCESS,
    paddingVertical: SPACING.md,
    borderRadius: 12,
    alignItems: "center",
  },
  reviewedText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
  },
  helpSection: {
    backgroundColor: COLORS.WHITE,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  helpTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
    color: COLORS.BLACK,
    marginBottom: SPACING.md,
  },
  helpButton: {
    borderWidth: 1,
    borderColor: COLORS.EMERALD_GREEN,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
    alignItems: "center",
  },
  helpButtonText: {
    color: COLORS.EMERALD_GREEN,
    fontSize: FONT_SIZE.sm,
    fontWeight: "600",
  },
});
