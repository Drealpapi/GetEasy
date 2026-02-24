import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { createBooking } from "../../services/mock/mockData";
import { COLORS, SPACING, FONT_SIZE } from "../../utils/constants";
import { formatPrice } from "../../utils/helpers";

export default function BookingFormScreen({ route, navigation }: any) {
  const { service } = route.params;
  const { currentUser } = useAuth();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [address, setAddress] = useState(currentUser?.state || "");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!date || !time || !address) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      await createBooking({
        userId: currentUser!.id,
        providerId: service.providerId,
        serviceId: service.id,
        date,
        time,
        address,
      });

      Alert.alert(
        "Success",
        "Booking created successfully!",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("Bookings"),
          },
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Service Summary */}
        <View style={styles.serviceCard}>
          <Text style={styles.serviceTitle}>{service.title}</Text>
          <Text style={styles.serviceCategory}>{service.category}</Text>
          <Text style={styles.servicePrice}>{formatPrice(service.price)}</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.sectionTitle}>Booking Details</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date *</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD (e.g., 2024-12-25)"
              value={date}
              onChangeText={setDate}
              placeholderTextColor={COLORS.TEXT_SECONDARY}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Time *</Text>
            <TextInput
              style={styles.input}
              placeholder="HH:MM AM/PM (e.g., 10:00 AM)"
              value={time}
              onChangeText={setTime}
              placeholderTextColor={COLORS.TEXT_SECONDARY}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Service Address *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter full address"
              value={address}
              onChangeText={setAddress}
              multiline
              numberOfLines={3}
              placeholderTextColor={COLORS.TEXT_SECONDARY}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Additional Notes (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Any special requirements or instructions"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
              placeholderTextColor={COLORS.TEXT_SECONDARY}
            />
          </View>

          {/* Price Summary */}
          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Service Fee</Text>
              <Text style={styles.summaryValue}>{formatPrice(service.price)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Platform Fee</Text>
              <Text style={styles.summaryValue}>$0.00</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{formatPrice(service.price)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Creating..." : "Confirm Booking"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.SURFACE,
  },
  content: {
    flex: 1,
  },
  serviceCard: {
    backgroundColor: COLORS.PRIMARY,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  serviceTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: "bold",
    color: COLORS.CARD,
    marginBottom: 4,
  },
  serviceCategory: {
    fontSize: FONT_SIZE.md,
    color: COLORS.CARD,
    marginBottom: SPACING.sm,
  },
  servicePrice: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: "bold",
    color: COLORS.CARD,
  },
  form: {
    backgroundColor: COLORS.CARD,
    padding: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "bold",
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.lg,
  },
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.SURFACE,
    borderRadius: 8,
    padding: SPACING.md,
    fontSize: FONT_SIZE.md,
    color: COLORS.TEXT_PRIMARY,
    backgroundColor: COLORS.CARD,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  summary: {
    marginTop: SPACING.lg,
    paddingTop: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.SURFACE,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.sm,
  },
  summaryLabel: {
    fontSize: FONT_SIZE.md,
    color: COLORS.TEXT_SECONDARY,
  },
  summaryValue: {
    fontSize: FONT_SIZE.md,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: "500",
  },
  totalRow: {
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 2,
    borderTopColor: COLORS.TEXT_PRIMARY,
  },
  totalLabel: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "bold",
    color: COLORS.TEXT_PRIMARY,
  },
  totalValue: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "bold",
    color: COLORS.PRIMARY,
  },
  bottomBar: {
    padding: SPACING.md,
    backgroundColor: COLORS.CARD,
    borderTopWidth: 1,
    borderTopColor: COLORS.SURFACE,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  button: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: SPACING.md,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: COLORS.CARD,
    fontSize: FONT_SIZE.lg,
    fontWeight: "bold",
  },
});
