import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Modal,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import { Booking } from "../../../types/booking";
import { getBookingsForProvider, updateBookingStatus, rescheduleBooking } from "../../../services/mock/mockData";
import { useDemoAuth } from "../../../context/DemoAuthContext";
import { COLORS, SPACING, FONT_SIZE } from "../../../utils/constants";
import { formatPrice } from "../../../utils/helpers";

type FilterType = "all" | "pending" | "accepted" | "upcoming" | "completed" | "past";

export default function AppointmentsScreen() {
  const { currentUser } = useDemoAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [bookings, filter]);

  const loadBookings = async () => {
    if (!currentUser?.id) return;
    setLoading(true);
    try {
      const data = await getBookingsForProvider(currentUser.id);
      setBookings(data);
    } catch (error) {
      console.error("Error loading bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBookings();
    setRefreshing(false);
  };

  const applyFilter = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let filtered = [...bookings];

    switch (filter) {
      case "pending":
        filtered = bookings.filter((b) => b.status === "Pending");
        break;
      case "accepted":
        filtered = bookings.filter((b) => b.status === "Accepted");
        break;
      case "upcoming":
        filtered = bookings.filter((b) => {
          const bookingDate = new Date(b.date);
          return bookingDate >= today && (b.status === "Accepted" || b.status === "Pending");
        });
        break;
      case "completed":
        filtered = bookings.filter((b) => b.status === "Completed");
        break;
      case "past":
        filtered = bookings.filter((b) => {
          const bookingDate = new Date(b.date);
          return bookingDate < today;
        });
        break;
      default:
        filtered = bookings;
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setFilteredBookings(filtered);
  };

  const handleAccept = async (bookingId: string) => {
    try {
      await updateBookingStatus(bookingId, "Accepted");
      await loadBookings();
      setShowActionModal(false);
      Alert.alert("Success", "Booking accepted successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to accept booking");
    }
  };

  const handleDecline = async (bookingId: string) => {
    Alert.alert(
      "Decline Booking",
      "Are you sure you want to decline this booking?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Decline",
          style: "destructive",
          onPress: async () => {
            try {
              await updateBookingStatus(bookingId, "Declined");
              await loadBookings();
              setShowActionModal(false);
              Alert.alert("Success", "Booking declined");
            } catch (error) {
              Alert.alert("Error", "Failed to decline booking");
            }
          },
        },
      ]
    );
  };

  const handleComplete = async (bookingId: string) => {
    try {
      await updateBookingStatus(bookingId, "Completed");
      await loadBookings();
      setShowActionModal(false);
      Alert.alert("Success", "Booking marked as completed!");
    } catch (error) {
      Alert.alert("Error", "Failed to complete booking");
    }
  };

  const handleReschedule = async () => {
    if (!selectedBooking || !newDate || !newTime) {
      Alert.alert("Error", "Please enter both date and time");
      return;
    }

    try {
      await rescheduleBooking(selectedBooking.id, newDate, newTime);
      await loadBookings();
      setShowRescheduleModal(false);
      setShowActionModal(false);
      setNewDate("");
      setNewTime("");
      Alert.alert("Success", "Booking rescheduled successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to reschedule booking");
    }
  };

  const scheduleReminder = (booking: Booking) => {
    Alert.alert(
      "Schedule Reminder",
      "Choose reminder method:",
      [
        {
          text: "Push Notification",
          onPress: () => {
            Alert.alert("Success", "Push notification reminder scheduled!");
          },
        },
        {
          text: "SMS",
          onPress: () => {
            Alert.alert("Success", "SMS reminder scheduled!");
          },
        },
        {
          text: "Email",
          onPress: () => {
            Alert.alert("Success", "Email reminder scheduled!");
          },
        },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  const syncToCalendar = (booking: Booking) => {
    Alert.alert(
      "Sync to Calendar",
      "Choose calendar provider:",
      [
        {
          text: "Google Calendar",
          onPress: () => {
            Alert.alert("Success", "Synced to Google Calendar!");
          },
        },
        {
          text: "Outlook",
          onPress: () => {
            Alert.alert("Success", "Synced to Outlook!");
          },
        },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return COLORS.WARNING;
      case "Accepted":
        return COLORS.SUCCESS;
      case "Completed":
        return COLORS.EMERALD_GREEN;
      case "Declined":
        return COLORS.ERROR;
      case "Rescheduled":
        return "#3b82f6";
      default:
        return COLORS.GRAY;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending":
        return "⏳";
      case "Accepted":
        return "✅";
      case "Completed":
        return "🎉";
      case "Declined":
        return "❌";
      case "Rescheduled":
        return "📅";
      default:
        return "📋";
    }
  };

  const renderBookingCard = ({ item }: { item: Booking }) => {
    const bookingDate = new Date(item.date);
    const isUpcoming = bookingDate >= new Date();

    return (
      <TouchableOpacity
        style={styles.bookingCard}
        onPress={() => {
          setSelectedBooking(item);
          setShowActionModal(true);
        }}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <View style={styles.statusBadge} style={{ backgroundColor: getStatusColor(item.status) }}>
            <Text style={styles.statusText}>
              {getStatusIcon(item.status)} {item.status}
            </Text>
          </View>
          {isUpcoming && (
            <View style={styles.upcomingBadge}>
              <Text style={styles.upcomingText}>Upcoming</Text>
            </View>
          )}
        </View>

        <Text style={styles.serviceTitle}>{item.serviceTitle}</Text>
        <Text style={styles.customerName}>👤 {item.userName}</Text>

        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailIcon}>📅</Text>
            <Text style={styles.detailText}>{item.date}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailIcon}>⏰</Text>
            <Text style={styles.detailText}>{item.time}</Text>
          </View>
        </View>

        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailIcon}>📍</Text>
            <Text style={styles.detailText} numberOfLines={1}>
              {item.address}
            </Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.price}>{formatPrice(item.servicePrice || 0)}</Text>
          <Text style={styles.phone}>📞 {item.userPhone}</Text>
        </View>

        {item.notes && (
          <View style={styles.notesContainer}>
            <Text style={styles.notesLabel}>Notes:</Text>
            <Text style={styles.notesText}>{item.notes}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderFilterButton = (filterType: FilterType, label: string, count: number) => (
    <TouchableOpacity
      style={[styles.filterButton, filter === filterType && styles.filterButtonActive]}
      onPress={() => setFilter(filterType)}
    >
      <Text style={[styles.filterText, filter === filterType && styles.filterTextActive]}>
        {label}
      </Text>
      <View style={[styles.countBadge, filter === filterType && styles.countBadgeActive]}>
        <Text style={[styles.countText, filter === filterType && styles.countTextActive]}>
          {count}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const pendingCount = bookings.filter((b) => b.status === "Pending").length;
  const acceptedCount = bookings.filter((b) => b.status === "Accepted").length;
  const upcomingCount = bookings.filter((b) => {
    const bookingDate = new Date(b.date);
    return bookingDate >= new Date() && (b.status === "Accepted" || b.status === "Pending");
  }).length;
  const completedCount = bookings.filter((b) => b.status === "Completed").length;
  const pastCount = bookings.filter((b) => new Date(b.date) < new Date()).length;

  return (
    <View style={styles.container}>
      {/* Header Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{bookings.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: COLORS.WARNING }]}>{pendingCount}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: COLORS.SUCCESS }]}>{upcomingCount}</Text>
          <Text style={styles.statLabel}>Upcoming</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: COLORS.EMERALD_GREEN }]}>{completedCount}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
      </View>

      {/* Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        {renderFilterButton("all", "All", bookings.length)}
        {renderFilterButton("pending", "Pending", pendingCount)}
        {renderFilterButton("accepted", "Accepted", acceptedCount)}
        {renderFilterButton("upcoming", "Upcoming", upcomingCount)}
        {renderFilterButton("completed", "Completed", completedCount)}
        {renderFilterButton("past", "Past", pastCount)}
      </ScrollView>

      {/* Bookings List */}
      <FlatList
        data={filteredBookings}
        renderItem={renderBookingCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📅</Text>
            <Text style={styles.emptyText}>No appointments found</Text>
            <Text style={styles.emptySubtext}>
              {filter !== "all" ? "Try changing the filter" : "New bookings will appear here"}
            </Text>
          </View>
        }
      />

      {/* Action Modal */}
      <Modal
        visible={showActionModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowActionModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Appointment Actions</Text>
              <TouchableOpacity onPress={() => setShowActionModal(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            {selectedBooking && (
              <ScrollView style={styles.modalBody}>
                <View style={styles.modalSection}>
                  <Text style={styles.modalServiceTitle}>{selectedBooking.serviceTitle}</Text>
                  <Text style={styles.modalCustomer}>Customer: {selectedBooking.userName}</Text>
                  <Text style={styles.modalDetail}>📅 {selectedBooking.date} at {selectedBooking.time}</Text>
                  <Text style={styles.modalDetail}>📍 {selectedBooking.address}</Text>
                  <Text style={styles.modalDetail}>📞 {selectedBooking.userPhone}</Text>
                  <Text style={styles.modalPrice}>{formatPrice(selectedBooking.servicePrice || 0)}</Text>
                </View>

                {selectedBooking.notes && (
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Notes:</Text>
                    <Text style={styles.modalNotes}>{selectedBooking.notes}</Text>
                  </View>
                )}

                <View style={styles.modalActions}>
                  {selectedBooking.status === "Pending" && (
                    <>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.acceptButton]}
                        onPress={() => handleAccept(selectedBooking.id)}
                      >
                        <Text style={styles.actionButtonText}>✅ Accept</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.declineButton]}
                        onPress={() => handleDecline(selectedBooking.id)}
                      >
                        <Text style={styles.actionButtonText}>❌ Decline</Text>
                      </TouchableOpacity>
                    </>
                  )}

                  {(selectedBooking.status === "Accepted" || selectedBooking.status === "Pending") && (
                    <>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.rescheduleButton]}
                        onPress={() => {
                          setShowRescheduleModal(true);
                          setNewDate(selectedBooking.date);
                          setNewTime(selectedBooking.time);
                        }}
                      >
                        <Text style={styles.actionButtonText}>📅 Reschedule</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.completeButton]}
                        onPress={() => handleComplete(selectedBooking.id)}
                      >
                        <Text style={styles.actionButtonText}>✓ Mark Complete</Text>
                      </TouchableOpacity>
                    </>
                  )}

                  <TouchableOpacity
                    style={[styles.actionButton, styles.reminderButton]}
                    onPress={() => scheduleReminder(selectedBooking)}
                  >
                    <Text style={styles.actionButtonText}>🔔 Send Reminder</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionButton, styles.calendarButton]}
                    onPress={() => syncToCalendar(selectedBooking)}
                  >
                    <Text style={styles.actionButtonText}>📆 Sync Calendar</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Reschedule Modal */}
      <Modal
        visible={showRescheduleModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowRescheduleModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.rescheduleModal}>
            <Text style={styles.modalTitle}>Reschedule Appointment</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>New Date (YYYY-MM-DD)</Text>
              <TextInput
                style={styles.input}
                value={newDate}
                onChangeText={setNewDate}
                placeholder="2024-12-25"
                placeholderTextColor={COLORS.GRAY}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>New Time</Text>
              <TextInput
                style={styles.input}
                value={newTime}
                onChangeText={setNewTime}
                placeholder="2:00 PM"
                placeholderTextColor={COLORS.GRAY}
              />
            </View>

            <View style={styles.rescheduleActions}>
              <TouchableOpacity
                style={[styles.rescheduleButton, styles.cancelReschedule]}
                onPress={() => {
                  setShowRescheduleModal(false);
                  setNewDate("");
                  setNewTime("");
                }}
              >
                <Text style={styles.cancelRescheduleText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.rescheduleButton, styles.confirmReschedule]}
                onPress={handleReschedule}
              >
                <Text style={styles.confirmRescheduleText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.LIGHT_GRAY,
  },
  statsContainer: {
    flexDirection: "row",
    padding: SPACING.md,
    gap: SPACING.sm,
    backgroundColor: COLORS.WHITE,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.LIGHT_GRAY,
    borderRadius: 12,
    padding: SPACING.md,
    alignItems: "center",
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
  },
  filtersContainer: {
    backgroundColor: COLORS.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GRAY,
  },
  filtersContent: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    backgroundColor: COLORS.LIGHT_GRAY,
    gap: SPACING.sm,
  },
  filterButtonActive: {
    backgroundColor: COLORS.EMERALD_GREEN,
  },
  filterText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.GRAY,
    fontWeight: "600",
  },
  filterTextActive: {
    color: COLORS.WHITE,
  },
  countBadge: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: "center",
  },
  countBadgeActive: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  countText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.BLACK,
    fontWeight: "bold",
  },
  countTextActive: {
    color: COLORS.WHITE,
  },
  listContent: {
    padding: SPACING.md,
  },
  bookingCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  statusBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 16,
  },
  statusText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZE.xs,
    fontWeight: "bold",
  },
  upcomingBadge: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  upcomingText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZE.xs,
    fontWeight: "600",
  },
  serviceTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "bold",
    color: COLORS.BLACK,
    marginBottom: SPACING.sm,
  },
  customerName: {
    fontSize: FONT_SIZE.md,
    color: COLORS.GRAY,
    marginBottom: SPACING.sm,
  },
  detailsRow: {
    flexDirection: "row",
    marginBottom: SPACING.sm,
    gap: SPACING.md,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  detailIcon: {
    fontSize: 16,
    marginRight: SPACING.sm,
  },
  detailText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.GRAY,
    flex: 1,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.LIGHT_GRAY,
  },
  price: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "bold",
    color: COLORS.EMERALD_GREEN,
  },
  phone: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.GRAY,
  },
  notesContainer: {
    marginTop: SPACING.sm,
    padding: SPACING.sm,
    backgroundColor: COLORS.LIGHT_GRAY,
    borderRadius: 8,
  },
  notesLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.GRAY,
    fontWeight: "600",
    marginBottom: 4,
  },
  notesText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.BLACK,
    fontStyle: "italic",
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: SPACING.xxl,
    padding: SPACING.xl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  emptyText: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.GRAY,
    fontWeight: "600",
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.GRAY,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: COLORS.WHITE,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GRAY,
  },
  modalTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: "bold",
    color: COLORS.BLACK,
  },
  closeButton: {
    fontSize: FONT_SIZE.xl,
    color: COLORS.GRAY,
    fontWeight: "bold",
  },
  modalBody: {
    padding: SPACING.lg,
  },
  modalSection: {
    marginBottom: SPACING.lg,
  },
  modalServiceTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "bold",
    color: COLORS.BLACK,
    marginBottom: SPACING.sm,
  },
  modalCustomer: {
    fontSize: FONT_SIZE.md,
    color: COLORS.GRAY,
    marginBottom: SPACING.sm,
  },
  modalDetail: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.GRAY,
    marginBottom: 4,
  },
  modalPrice: {
    fontSize: FONT_SIZE.xl,
    fontWeight: "bold",
    color: COLORS.EMERALD_GREEN,
    marginTop: SPACING.sm,
  },
  modalSectionTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
    color: COLORS.BLACK,
    marginBottom: SPACING.sm,
  },
  modalNotes: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.GRAY,
    fontStyle: "italic",
    padding: SPACING.sm,
    backgroundColor: COLORS.LIGHT_GRAY,
    borderRadius: 8,
  },
  modalActions: {
    gap: SPACING.sm,
  },
  actionButton: {
    paddingVertical: SPACING.md,
    borderRadius: 12,
    alignItems: "center",
  },
  acceptButton: {
    backgroundColor: COLORS.SUCCESS,
  },
  declineButton: {
    backgroundColor: COLORS.ERROR,
  },
  rescheduleButton: {
    backgroundColor: "#3b82f6",
  },
  completeButton: {
    backgroundColor: COLORS.EMERALD_GREEN,
  },
  reminderButton: {
    backgroundColor: "#f59e0b",
  },
  calendarButton: {
    backgroundColor: "#8b5cf6",
  },
  actionButtonText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZE.md,
    fontWeight: "bold",
  },
  rescheduleModal: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    padding: SPACING.xl,
    margin: SPACING.xl,
  },
  inputGroup: {
    marginBottom: SPACING.md,
  },
  inputLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.GRAY,
    marginBottom: SPACING.sm,
    fontWeight: "600",
  },
  input: {
    backgroundColor: COLORS.LIGHT_GRAY,
    borderRadius: 8,
    padding: SPACING.md,
    fontSize: FONT_SIZE.md,
    color: COLORS.BLACK,
  },
  rescheduleActions: {
    flexDirection: "row",
    gap: SPACING.md,
    marginTop: SPACING.md,
  },
  cancelReschedule: {
    flex: 1,
    backgroundColor: COLORS.LIGHT_GRAY,
  },
  confirmReschedule: {
    flex: 1,
    backgroundColor: COLORS.EMERALD_GREEN,
  },
  cancelRescheduleText: {
    color: COLORS.GRAY,
    fontSize: FONT_SIZE.md,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: SPACING.md,
  },
  confirmRescheduleText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZE.md,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: SPACING.md,
  },
});
