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
  Dimensions,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Booking } from "../../../types/booking";
import { getBookingsForProvider, updateBookingStatus, rescheduleBooking } from "../../../services/mock/mockData";
import { useAuth } from "../../../context/AuthContext";
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT, BORDER_RADIUS, SHADOWS } from "../../../utils/constants";
import { formatPrice } from "../../../utils/helpers";

type FilterType = "all" | "pending" | "accepted" | "upcoming" | "completed" | "past";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function AppointmentsScreen() {
  const { currentUser } = useAuth();
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
        return COLORS.PRIMARY;
      case "Declined":
        return COLORS.ERROR;
      case "Rescheduled":
        return COLORS.INFO;
      default:
        return COLORS.TEXT_SECONDARY;
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
    const statusColor = getStatusColor(item.status);

    return (
      <TouchableOpacity
        style={styles.bookingCard}
        onPress={() => {
          setSelectedBooking(item);
          setShowActionModal(true);
        }}
        activeOpacity={0.9}
      >
        {/* Glassmorphism overlay */}
        <View style={styles.cardGlassOverlay} />
        
        <View style={styles.cardHeader}>
          <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>
              {getStatusIcon(item.status)} {item.status}
            </Text>
          </View>
          {isUpcoming && (
            <LinearGradient
              colors={[COLORS.INFO, COLORS.INFO + '80']}
              style={styles.upcomingBadge}
            >
              <Text style={styles.upcomingText}>Upcoming</Text>
            </LinearGradient>
          )}
        </View>

        <Text style={styles.serviceTitle}>{item.serviceTitle}</Text>
        <Text style={styles.customerName}>👤 {item.userName}</Text>

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <View style={styles.detailIconContainer}>
                <Text style={styles.detailIcon}>📅</Text>
              </View>
              <Text style={styles.detailText}>{item.date}</Text>
            </View>
            <View style={styles.detailItem}>
              <View style={styles.detailIconContainer}>
                <Text style={styles.detailIcon}>⏰</Text>
              </View>
              <Text style={styles.detailText}>{item.time}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={[styles.detailItem, { flex: 1 }]}>
              <View style={styles.detailIconContainer}>
                <Text style={styles.detailIcon}>📍</Text>
              </View>
              <Text style={styles.detailText} numberOfLines={1}>
                {item.address}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{formatPrice(item.servicePrice || 0)}</Text>
          </View>
          <TouchableOpacity style={styles.phoneButton} activeOpacity={0.8}>
            <Text style={styles.phoneIcon}>📞</Text>
            <Text style={styles.phoneText}>{item.userPhone}</Text>
          </TouchableOpacity>
        </View>

        {item.notes && (
          <View style={styles.notesContainer}>
            <Text style={styles.notesLabel}>💬 Notes</Text>
            <Text style={styles.notesText}>{item.notes}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderFilterButton = (filterType: FilterType, label: string, count: number) => {
    const isActive = filter === filterType;
    
    return (
      <TouchableOpacity
        style={[styles.filterButton, isActive && styles.filterButtonActive]}
        onPress={() => setFilter(filterType)}
        activeOpacity={0.8}
      >
        {isActive ? (
          <LinearGradient
            colors={COLORS.PRIMARY_GRADIENT}
            style={styles.filterButtonGradient}
          >
            <Text style={[styles.filterText, styles.filterTextActive]}>
              {label}
            </Text>
            <View style={styles.countBadgeActive}>
              <Text style={styles.countTextActive}>{count}</Text>
            </View>
          </LinearGradient>
        ) : (
          <View style={styles.filterButtonContent}>
            <Text style={styles.filterText}>{label}</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{count}</Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  // Calculate counts
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
      {/* Header with gradient background */}
      <LinearGradient
        colors={COLORS.PRIMARY_GRADIENT}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Appointments</Text>
          <Text style={styles.headerSubtitle}>Manage your bookings</Text>
        </View>
        
        {/* Stats Cards with glassmorphism */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statGlass} />
            <Text style={styles.statValue}>{bookings.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statGlass} />
            <Text style={[styles.statValue, { color: COLORS.WARNING }]}>{pendingCount}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statGlass} />
            <Text style={[styles.statValue, { color: COLORS.SUCCESS }]}>{upcomingCount}</Text>
            <Text style={styles.statLabel}>Upcoming</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statGlass} />
            <Text style={[styles.statValue, { color: COLORS.WHITE }]}>{completedCount}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Filters with improved spacing */}
      <View style={styles.filtersSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
        >
          {renderFilterButton("all", "All", bookings.length)}
          {renderFilterButton("pending", "Pending", pendingCount)}
          {renderFilterButton("accepted", "Accepted", acceptedCount)}
          {renderFilterButton("upcoming", "Upcoming", upcomingCount)}
          {renderFilterButton("completed", "Completed", completedCount)}
          {renderFilterButton("past", "Past", pastCount)}
        </ScrollView>
      </View>

      {/* Bookings List */}
      <FlatList
        data={filteredBookings}
        renderItem={renderBookingCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <LinearGradient
              colors={['rgba(99, 102, 241, 0.1)', 'rgba(139, 92, 246, 0.05)']}
              style={styles.emptyGradient}
            >
              <Text style={styles.emptyIcon}>📅</Text>
              <Text style={styles.emptyText}>No appointments found</Text>
              <Text style={styles.emptySubtext}>
                {filter !== "all" ? "Try changing the filter" : "New bookings will appear here"}
              </Text>
            </LinearGradient>
          </View>
        }
      />

      {/* Rest of the modals remain the same but with updated styling */}
      {/* Action Modal */}
      <Modal
        visible={showActionModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowActionModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalGlass} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Appointment Actions</Text>
              <TouchableOpacity 
                style={styles.closeButtonContainer}
                onPress={() => setShowActionModal(false)}
              >
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
            <View style={styles.modalGlass} />
            <Text style={styles.modalTitle}>Reschedule Appointment</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>New Date (YYYY-MM-DD)</Text>
              <TextInput
                style={styles.input}
                value={newDate}
                onChangeText={setNewDate}
                placeholder="2024-12-25"
                placeholderTextColor={COLORS.TEXT_SECONDARY}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>New Time</Text>
              <TextInput
                style={styles.input}
                value={newTime}
                onChangeText={setNewTime}
                placeholder="2:00 PM"
                placeholderTextColor={COLORS.TEXT_SECONDARY}
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
                <LinearGradient
                  colors={COLORS.PRIMARY_GRADIENT}
                  style={styles.confirmRescheduleGradient}
                >
                  <Text style={styles.confirmRescheduleText}>Confirm</Text>
                </LinearGradient>
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
    backgroundColor: COLORS.BACKGROUND,
  },
  
  // Header with gradient
  headerGradient: {
    paddingTop: SPACING.xxxl,
    paddingBottom: SPACING.xl,
  },
  
  headerContent: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  
  headerTitle: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.WHITE,
    marginBottom: SPACING.xs,
  },
  
  headerSubtitle: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.WHITE,
    opacity: 0.9,
  },
  
  // Stats with glassmorphism
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },
  
  statCard: {
    flex: 1,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    alignItems: "center",
    position: 'relative',
    overflow: 'hidden',
  },
  
  statGlass: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  
  statValue: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.WHITE,
    marginBottom: 4,
    zIndex: 1,
  },
  
  statLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.WHITE,
    opacity: 0.8,
    fontWeight: FONT_WEIGHT.medium,
    zIndex: 1,
  },
  
  // Filters section
  filtersSection: {
    backgroundColor: COLORS.WHITE,
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  
  filtersContainer: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },
  
  filterButton: {
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden',
    marginRight: SPACING.sm,
  },
  
  filterButtonActive: {
    ...SHADOWS.medium,
  },
  
  filterButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
  },
  
  filterButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.GRAY_100,
    gap: SPACING.sm,
  },
  
  filterText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: FONT_WEIGHT.semibold,
  },
  
  filterTextActive: {
    color: COLORS.WHITE,
  },
  
  countBadge: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    minWidth: 24,
    alignItems: "center",
  },
  
  countBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  
  countText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: FONT_WEIGHT.bold,
  },
  
  countTextActive: {
    color: COLORS.WHITE,
  },
  
  // List content
  listContent: {
    padding: SPACING.lg,
  },
  
  // Modern booking cards with glassmorphism
  bookingCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.xxl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    position: 'relative',
    overflow: 'hidden',
    ...SHADOWS.large,
  },
  
  cardGlassOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: 'rgba(99, 102, 241, 0.05)',
    borderTopLeftRadius: BORDER_RADIUS.xxl,
    borderTopRightRadius: BORDER_RADIUS.xxl,
  },
  
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
    zIndex: 1,
  },
  
  statusBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  
  statusText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.bold,
  },
  
  upcomingBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
  },
  
  upcomingText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.bold,
  },
  
  serviceTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.sm,
  },
  
  customerName: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.md,
    fontWeight: FONT_WEIGHT.medium,
  },
  
  // Modern details container
  detailsContainer: {
    backgroundColor: COLORS.GRAY_50,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  
  detailRow: {
    flexDirection: "row",
    marginBottom: SPACING.sm,
    gap: SPACING.lg,
  },
  
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  
  detailIconContainer: {
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
    ...SHADOWS.small,
  },
  
  detailIcon: {
    fontSize: 16,
  },
  
  detailText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: FONT_WEIGHT.medium,
    flex: 1,
  },
  
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
  },
  
  priceContainer: {
    backgroundColor: COLORS.PRIMARY + '15',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.lg,
  },
  
  price: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.PRIMARY,
  },
  
  phoneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.GRAY_100,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.lg,
    gap: SPACING.sm,
  },
  
  phoneIcon: {
    fontSize: 16,
  },
  
  phoneText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: FONT_WEIGHT.medium,
  },
  
  notesContainer: {
    marginTop: SPACING.md,
    padding: SPACING.md,
    backgroundColor: COLORS.INFO + '10',
    borderRadius: BORDER_RADIUS.lg,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.INFO,
  },
  
  notesLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.INFO,
    fontWeight: FONT_WEIGHT.bold,
    marginBottom: SPACING.xs,
  },
  
  notesText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.TEXT_PRIMARY,
    fontStyle: "italic",
    lineHeight: 20,
  },
  
  // Empty state with gradient
  emptyContainer: {
    alignItems: "center",
    marginTop: SPACING.xxxl,
    padding: SPACING.xl,
  },
  
  emptyGradient: {
    alignItems: "center",
    padding: SPACING.xxxl,
    borderRadius: BORDER_RADIUS.xxl,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY + '20',
  },
  
  emptyIcon: {
    fontSize: 64,
    marginBottom: SPACING.lg,
  },
  
  emptyText: {
    fontSize: FONT_SIZE.xl,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: FONT_WEIGHT.semibold,
    marginBottom: SPACING.sm,
  },
  
  emptySubtext: {
    fontSize: FONT_SIZE.md,
    color: COLORS.TEXT_SECONDARY,
    textAlign: "center",
    lineHeight: 22,
  },
  
  // Modal styles with glassmorphism
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.BACKDROP,
    justifyContent: "flex-end",
  },
  
  modalContent: {
    backgroundColor: COLORS.WHITE,
    borderTopLeftRadius: BORDER_RADIUS.xxl,
    borderTopRightRadius: BORDER_RADIUS.xxl,
    maxHeight: "85%",
    position: 'relative',
    overflow: 'hidden',
  },
  
  modalGlass: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: 'rgba(99, 102, 241, 0.05)',
    borderTopLeftRadius: BORDER_RADIUS.xxl,
    borderTopRightRadius: BORDER_RADIUS.xxl,
  },
  
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: SPACING.xl,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
    zIndex: 1,
  },
  
  modalTitle: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.TEXT_PRIMARY,
  },
  
  closeButtonContainer: {
    width: 36,
    height: 36,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.GRAY_100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  closeButton: {
    fontSize: 18,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: FONT_WEIGHT.bold,
  },
  
  modalBody: {
    padding: SPACING.xl,
  },
  
  modalSection: {
    marginBottom: SPACING.xl,
  },
  
  modalServiceTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.sm,
  },
  
  modalCustomer: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.sm,
    fontWeight: FONT_WEIGHT.medium,
  },
  
  modalDetail: {
    fontSize: FONT_SIZE.md,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.xs,
    lineHeight: 22,
  },
  
  modalPrice: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.PRIMARY,
    marginTop: SPACING.md,
  },
  
  modalSectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.md,
  },
  
  modalNotes: {
    fontSize: FONT_SIZE.md,
    color: COLORS.TEXT_SECONDARY,
    fontStyle: "italic",
    padding: SPACING.md,
    backgroundColor: COLORS.GRAY_50,
    borderRadius: BORDER_RADIUS.lg,
    lineHeight: 20,
  },
  
  modalActions: {
    gap: SPACING.md,
  },
  
  actionButton: {
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: "center",
    ...SHADOWS.medium,
  },
  
  acceptButton: {
    backgroundColor: COLORS.SUCCESS,
  },
  
  declineButton: {
    backgroundColor: COLORS.ERROR,
  },
  
  rescheduleButton: {
    backgroundColor: COLORS.INFO,
  },
  
  completeButton: {
    backgroundColor: COLORS.PRIMARY,
  },
  
  reminderButton: {
    backgroundColor: COLORS.WARNING,
  },
  
  calendarButton: {
    backgroundColor: '#8b5cf6',
  },
  
  actionButtonText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
  },
  
  // Reschedule modal
  rescheduleModal: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.xxl,
    padding: SPACING.xl,
    margin: SPACING.xl,
    position: 'relative',
    overflow: 'hidden',
    ...SHADOWS.large,
  },
  
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  
  inputLabel: {
    fontSize: FONT_SIZE.md,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.sm,
    fontWeight: FONT_WEIGHT.semibold,
  },
  
  input: {
    backgroundColor: COLORS.GRAY_50,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    fontSize: FONT_SIZE.md,
    color: COLORS.TEXT_PRIMARY,
    borderWidth: 2,
    borderColor: COLORS.BORDER,
  },
  
  rescheduleActions: {
    flexDirection: "row",
    gap: SPACING.md,
    marginTop: SPACING.lg,
  },
  
  rescheduleButton: {
    flex: 1,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
  },
  
  cancelReschedule: {
    backgroundColor: COLORS.GRAY_100,
  },
  
  confirmReschedule: {
    // Gradient will be applied
  },
  
  confirmRescheduleGradient: {
    paddingVertical: SPACING.lg,
    alignItems: 'center',
  },
  
  cancelRescheduleText: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    textAlign: "center",
    paddingVertical: SPACING.lg,
  },
  
  confirmRescheduleText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
  },
});
