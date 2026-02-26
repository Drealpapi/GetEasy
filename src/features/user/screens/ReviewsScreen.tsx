import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { MOCK_REVIEWS } from "../../../core/services/mock/mockData";
import { Review } from "../../../core/types/review";
import { COLORS, FONT_SIZE, SPACING } from "../../../shared/constants/constants";
import { formatDate } from "../../../shared/utils/helpers";
import { useAuth } from "../../auth/hooks/useAuth";

export default function ReviewsScreen() {
  const { currentUser } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    if (!currentUser) return;
    // Simulate loading
    setTimeout(() => {
      const userReviews = MOCK_REVIEWS.filter((r) => r.userId === currentUser.id);
      setReviews(userReviews);
      setLoading(false);
    }, 500);
  };

  const renderStars = (rating: number) => {
    return "⭐".repeat(rating);
  };

  const renderReview = ({ item }: { item: Review }) => (
    <View style={styles.reviewCard}>
      <View style={styles.header}>
        <Text style={styles.stars}>{renderStars(item.rating)}</Text>
        <Text style={styles.date}>{formatDate(new Date(item.createdAt))}</Text>
      </View>
      <Text style={styles.comment}>{item.comment}</Text>
      <Text style={styles.bookingId}>Booking #{item.bookingId.slice(-4)}</Text>
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
      <FlatList
        data={reviews}
        renderItem={renderReview}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No reviews yet</Text>
            <Text style={styles.emptySubtext}>
              Complete a booking to leave a review
            </Text>
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
  reviewCard: {
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  stars: {
    fontSize: FONT_SIZE.lg,
  },
  date: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.TEXT_SECONDARY,
  },
  comment: {
    fontSize: FONT_SIZE.md,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.sm,
  },
  bookingId: {
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
    marginBottom: SPACING.sm,
  },
  emptySubtext: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.TEXT_SECONDARY,
  },
});
