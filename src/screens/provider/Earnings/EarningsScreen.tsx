import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../../../context/AuthContext";
import { getPaymentsForProvider } from "../../../services/mock/mockData";
import { Payment } from "../../../types/payment";
import { COLORS, SPACING, FONT_SIZE } from "../../../utils/constants";
import { formatPrice, formatDate } from "../../../utils/helpers";

export default function EarningsScreen() {
  const { currentUser } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEarnings();
  }, []);

  const loadEarnings = async () => {
    if (!currentUser) return;
    setLoading(true);
    const data = await getPaymentsForProvider(currentUser.id);
    setPayments(data);
    setLoading(false);
  };

  const totalEarnings = payments.reduce((sum, p) => sum + p.providerEarnings, 0);
  const totalCommission = payments.reduce((sum, p) => sum + p.commission, 0);

  const renderPayment = ({ item }: { item: Payment }) => (
    <View style={styles.paymentCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.amount}>{formatPrice(item.providerEarnings)}</Text>
        <Text style={styles.date}>{formatDate(new Date(item.createdAt))}</Text>
      </View>
      <Text style={styles.bookingId}>Booking #{item.bookingId.slice(-4)}</Text>
      <View style={styles.breakdown}>
        <Text style={styles.breakdownText}>
          Total: {formatPrice(item.amount)}
        </Text>
        <Text style={styles.breakdownText}>
          Commission: {formatPrice(item.commission)}
        </Text>
      </View>
    </View>
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
      <View style={styles.summary}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Earnings</Text>
          <Text style={styles.summaryValue}>{formatPrice(totalEarnings)}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Commission</Text>
          <Text style={styles.summaryValue}>{formatPrice(totalCommission)}</Text>
        </View>
      </View>

      <FlatList
        data={payments}
        renderItem={renderPayment}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No earnings yet</Text>
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
  summary: {
    flexDirection: "row",
    padding: SPACING.md,
    gap: SPACING.md,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 12,
    padding: SPACING.md,
  },
  summaryLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.CARD,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: FONT_SIZE.xl,
    fontWeight: "bold",
    color: COLORS.CARD,
  },
  list: {
    padding: SPACING.md,
  },
  paymentCard: {
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
  amount: {
    fontSize: FONT_SIZE.xl,
    fontWeight: "bold",
    color: COLORS.PRIMARY,
  },
  date: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.TEXT_SECONDARY,
  },
  bookingId: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.sm,
  },
  breakdown: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  breakdownText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.TEXT_SECONDARY,
  },
  empty: {
    alignItems: "center",
    marginTop: SPACING.xxl,
  },
  emptyText: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.TEXT_SECONDARY,
  },
});
