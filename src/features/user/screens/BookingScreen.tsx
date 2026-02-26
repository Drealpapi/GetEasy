import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../auth/hooks/useAuth";

import { getBookingsForUser } from "../../../core/services/mock/mockData";
import { COLORS, FONT_SIZE, SPACING } from "../../../shared/constants/constants";
import { formatDate } from "../../../shared/utils/helpers";
import { Booking } from "../../booking/types/booking";

export default function BookingScreen({ navigation }: any) {
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    if (!currentUser) return;
    setLoading(true);
    const data = await getBookingsForUser(currentUser.id);
    setBookings(data);
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return COLORS.SUCCESS;
      case "Accepted":
        return COLORS.PRIMARY;
      case "Pending":
        return COLORS.WARNING;
      case "Declined":
        return COLORS.ERROR;
      default:
        return COLORS.TEXT_SECONDARY;
    }
  };

  const renderBooking = ({ item }: { item: Booking }) => (
    <TouchableOpacity
      style={styles.bookingCard}
      onPress={() => navigation.navigate("BookingDetail", { booking: item })}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.serviceTitle}>Service #{item.serviceId.slice(-4)}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.date}>{formatDate(new Date(item.date))} at {item.time}</Text>
      <Text style={styles.address}>{item.address}</Text>
      <Text style={styles.tapHint}>Tap for details →</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={bookings}
        renderItem={renderBooking}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No bookings yet</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("Home")}
            >
              <Text style={styles.buttonText}>Browse Services</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.SURFACE,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    padding: SPACING.md,
  },
  bookingCard: {
    backgroundColor: COLORS.CARD,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  serviceTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "bold",
    color: COLORS.TEXT_PRIMARY,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: COLORS.CARD,
    fontSize: FONT_SIZE.xs,
    fontWeight: "600",
  },
  date: {
    fontSize: FONT_SIZE.md,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 4,
  },
  address: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.sm,
  },
  tapHint: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.PRIMARY,
    fontWeight: "600",
  },
  empty: {
    alignItems: "center",
    marginTop: SPACING.xxl,
  },
  emptyText: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.lg,
  },
  button: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: 8,
  },
  buttonText: {
    color: COLORS.CARD,
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
  },
});
