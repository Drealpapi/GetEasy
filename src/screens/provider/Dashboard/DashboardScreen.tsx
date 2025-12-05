import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useDemoAuth } from "../../../context/DemoAuthContext";
import { getBookingsForProvider } from "../../../services/mock/mockData";
import { Booking } from "../../../types/booking";
import { COLORS, SPACING, FONT_SIZE } from "../../../utils/constants";
import { formatPrice } from "../../../utils/helpers";

export default function DashboardScreen({ navigation }: any) {
  const { currentUser, logout } = useDemoAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    if (!currentUser?.id) return;
    setLoading(true);
    try {
      const data = await getBookingsForProvider(currentUser.id);
      setBookings(data);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const pendingBookings = bookings.filter((b) => b.status === "Pending");
  const upcomingBookings = bookings.filter((b) => {
    const bookingDate = new Date(b.date);
    return bookingDate >= new Date() && (b.status === "Accepted" || b.status === "Pending");
  });
  const completedBookings = bookings.filter((b) => b.status === "Completed");
  const totalEarnings = completedBookings.reduce((sum, b) => sum + (b.servicePrice || 0), 0);

  const todayBookings = bookings.filter((b) => {
    const today = new Date();
    const bookingDate = new Date(b.date);
    return (
      bookingDate.getDate() === today.getDate() &&
      bookingDate.getMonth() === today.getMonth() &&
      bookingDate.getFullYear() === today.getFullYear()
    );
  });

  return (
    <View style={styles.container}>
      {/* Header with Logout */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.name}>{currentUser?.name}!</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutIcon}>🚪</Text>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, styles.statCardLarge]}>
            <Text style={styles.statIcon}>💰</Text>
            <Text style={styles.statValue}>{formatPrice(totalEarnings)}</Text>
            <Text style={styles.statLabel}>Total Earnings</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>⏳</Text>
            <Text style={[styles.statValue, { color: COLORS.WARNING }]}>
              {pendingBookings.length}
            </Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>📅</Text>
            <Text style={[styles.statValue, { color: "#3b82f6" }]}>
              {upcomingBookings.length}
            </Text>
            <Text style={styles.statLabel}>Upcoming</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>✅</Text>
            <Text style={[styles.statValue, { color: COLORS.SUCCESS }]}>
              {completedBookings.length}
            </Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>📊</Text>
            <Text style={styles.statValue}>{bookings.length}</Text>
            <Text style={styles.statLabel}>Total Jobs</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate("Appointments")}
            >
              <Text style={styles.actionIcon}>📅</Text>
              <Text style={styles.actionText}>View Appointments</Text>
              {pendingBookings.length > 0 && (
                <View style={styles.actionBadge}>
                  <Text style={styles.actionBadgeText}>{pendingBookings.length}</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate("Services")}
            >
              <Text style={styles.actionIcon}>🛠️</Text>
              <Text style={styles.actionText}>Manage Services</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate("Earnings")}
            >
              <Text style={styles.actionIcon}>💵</Text>
              <Text style={styles.actionText}>View Earnings</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate("Profile")}
            >
              <Text style={styles.actionIcon}>👤</Text>
              <Text style={styles.actionText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Today's Appointments */}
        {todayBookings.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Today's Appointments</Text>
            {todayBookings.map((booking) => (
              <View key={booking.id} style={styles.todayCard}>
                <View style={styles.todayHeader}>
                  <Text style={styles.todayTime}>⏰ {booking.time}</Text>
                  <View
                    style={[
                      styles.todayStatus,
                      {
                        backgroundColor:
                          booking.status === "Accepted"
                            ? COLORS.SUCCESS
                            : COLORS.WARNING,
                      },
                    ]}
                  >
                    <Text style={styles.todayStatusText}>{booking.status}</Text>
                  </View>
                </View>
                <Text style={styles.todayService}>{booking.serviceTitle}</Text>
                <Text style={styles.todayCustomer}>👤 {booking.userName}</Text>
                <Text style={styles.todayAddress}>📍 {booking.address}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Recent Activity */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Appointments")}>
              <Text style={styles.seeAllText}>See All →</Text>
            </TouchableOpacity>
          </View>
          {bookings.slice(0, 3).map((booking) => (
            <View key={booking.id} style={styles.activityCard}>
              <View style={styles.activityLeft}>
                <Text style={styles.activityIcon}>
                  {booking.status === "Completed"
                    ? "✅"
                    : booking.status === "Pending"
                    ? "⏳"
                    : "📅"}
                </Text>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityTitle}>{booking.serviceTitle}</Text>
                  <Text style={styles.activityDetail}>
                    {booking.userName} • {booking.date}
                  </Text>
                </View>
              </View>
              <Text style={styles.activityPrice}>
                {formatPrice(booking.servicePrice || 0)}
              </Text>
            </View>
          ))}
        </View>

        {/* Performance Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance Insights</Text>
          <View style={styles.insightCard}>
            <View style={styles.insightRow}>
              <Text style={styles.insightLabel}>Completion Rate</Text>
              <Text style={styles.insightValue}>
                {bookings.length > 0
                  ? Math.round((completedBookings.length / bookings.length) * 100)
                  : 0}
                %
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${
                      bookings.length > 0
                        ? (completedBookings.length / bookings.length) * 100
                        : 0
                    }%`,
                  },
                ]}
              />
            </View>
          </View>

          <View style={styles.insightCard}>
            <View style={styles.insightRow}>
              <Text style={styles.insightLabel}>Average Job Value</Text>
              <Text style={styles.insightValue}>
                {formatPrice(
                  completedBookings.length > 0
                    ? totalEarnings / completedBookings.length
                    : 0
                )}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.LIGHT_GRAY,
  },
  header: {
    backgroundColor: COLORS.EMERALD_GREEN,
    padding: SPACING.lg,
    paddingTop: SPACING.xl,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: FONT_SIZE.md,
    color: COLORS.WHITE,
    opacity: 0.9,
  },
  name: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: "bold",
    color: COLORS.WHITE,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    gap: SPACING.sm,
  },
  logoutIcon: {
    fontSize: 16,
  },
  logoutText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZE.sm,
    fontWeight: "600",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: SPACING.md,
    gap: SPACING.md,
  },
  statCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    padding: SPACING.md,
    width: "47%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statCardLarge: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statIcon: {
    fontSize: 32,
    marginBottom: SPACING.sm,
  },
  statValue: {
    fontSize: FONT_SIZE.xl,
    fontWeight: "bold",
    color: COLORS.BLACK,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.GRAY,
    textAlign: "center",
  },
  section: {
    padding: SPACING.md,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "bold",
    color: COLORS.BLACK,
    marginBottom: SPACING.md,
  },
  seeAllText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.EMERALD_GREEN,
    fontWeight: "600",
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.md,
  },
  actionCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 12,
    padding: SPACING.md,
    width: "47%",
    alignItems: "center",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: {
    fontSize: 40,
    marginBottom: SPACING.sm,
  },
  actionText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.BLACK,
    fontWeight: "600",
    textAlign: "center",
  },
  actionBadge: {
    position: "absolute",
    top: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: COLORS.ERROR,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: "center",
  },
  actionBadgeText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZE.xs,
    fontWeight: "bold",
  },
  todayCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.EMERALD_GREEN,
  },
  todayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  todayTime: {
    fontSize: FONT_SIZE.md,
    fontWeight: "bold",
    color: COLORS.BLACK,
  },
  todayStatus: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  todayStatusText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZE.xs,
    fontWeight: "600",
  },
  todayService: {
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
    color: COLORS.BLACK,
    marginBottom: 4,
  },
  todayCustomer: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.GRAY,
    marginBottom: 4,
  },
  todayAddress: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.GRAY,
  },
  activityCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  activityLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  activityIcon: {
    fontSize: 24,
    marginRight: SPACING.md,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
    color: COLORS.BLACK,
    marginBottom: 4,
  },
  activityDetail: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.GRAY,
  },
  activityPrice: {
    fontSize: FONT_SIZE.md,
    fontWeight: "bold",
    color: COLORS.EMERALD_GREEN,
  },
  insightCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  insightRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  insightLabel: {
    fontSize: FONT_SIZE.md,
    color: COLORS.GRAY,
  },
  insightValue: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "bold",
    color: COLORS.BLACK,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.LIGHT_GRAY,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.EMERALD_GREEN,
    borderRadius: 4,
  },
  bottomSpacer: {
    height: SPACING.xl,
  },
});
