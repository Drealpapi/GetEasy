import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useDemoAuth } from "../../../context/DemoAuthContext";
import { getReviewsForProvider, calculateProviderRating } from "../../../services/mock/mockData";
import { Review } from "../../../types/review";
import { COLORS, SPACING, FONT_SIZE } from "../../../utils/constants";
import { formatDate } from "../../../utils/helpers";

export default function ReviewsScreen() {
  const { currentUser } = useDemoAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    if (!currentUser) return;
    setLoading(true);
    const data = await getReviewsForProvider(currentUser.id);
    const rating = await calculateProviderRating(currentUser.id);
    setReviews(data);
    setAverageRating(rating);
    setLoading(false);
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
        <ActivityIndicator size="large" color={COLORS.EMERALD_GREEN} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.ratingCard}>
        <Text style={styles.ratingValue}>{averageRating.toFixed(1)}</Text>
        <Text style={styles.ratingLabel}>Average Rating</Text>
        <Text style={styles.reviewCount}>{reviews.length} reviews</Text>
      </View>

      <FlatList
        data={reviews}
        renderItem={renderReview}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No reviews yet</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.LIGHT_GRAY,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  ratingCard: {
    backgroundColor: COLORS.EMERALD_GREEN,
    padding: SPACING.xl,
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  ratingValue: {
    fontSize: 48,
    fontWeight: "bold",
    color: COLORS.WHITE,
  },
  ratingLabel: {
    fontSize: FONT_SIZE.md,
    color: COLORS.WHITE,
    marginTop: SPACING.sm,
  },
  reviewCount: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.WHITE,
    marginTop: 4,
  },
  list: {
    padding: SPACING.md,
  },
  reviewCard: {
    backgroundColor: COLORS.WHITE,
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
    color: COLORS.GRAY,
  },
  comment: {
    fontSize: FONT_SIZE.md,
    color: COLORS.BLACK,
    marginBottom: SPACING.sm,
  },
  bookingId: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.GRAY,
  },
  empty: {
    alignItems: "center",
    marginTop: SPACING.xxl,
  },
  emptyText: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.GRAY,
  },
});
