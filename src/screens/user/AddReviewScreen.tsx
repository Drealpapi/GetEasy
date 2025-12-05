import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useDemoAuth } from "../../context/DemoAuthContext";
import { addReview } from "../../services/mock/mockData";
import { COLORS, SPACING, FONT_SIZE } from "../../utils/constants";

export default function AddReviewScreen({ route, navigation }: any) {
  const { booking } = route.params;
  const { currentUser } = useDemoAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert("Error", "Please select a rating");
      return;
    }

    if (!comment.trim()) {
      Alert.alert("Error", "Please write a comment");
      return;
    }

    setLoading(true);
    try {
      await addReview({
        bookingId: booking.id,
        userId: currentUser!.id,
        providerId: booking.providerId,
        rating,
        comment: comment.trim(),
      });

      Alert.alert("Success", "Review submitted successfully!", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Booking Info */}
        <View style={styles.bookingCard}>
          <Text style={styles.bookingTitle}>Booking #{booking.id.slice(-8)}</Text>
          <Text style={styles.bookingDate}>{booking.date} at {booking.time}</Text>
        </View>

        {/* Rating */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How was your experience?</Text>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}
                style={styles.starButton}
              >
                <Text style={styles.star}>
                  {star <= rating ? "⭐" : "☆"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.ratingText}>
            {rating === 0 && "Tap to rate"}
            {rating === 1 && "Poor"}
            {rating === 2 && "Fair"}
            {rating === 3 && "Good"}
            {rating === 4 && "Very Good"}
            {rating === 5 && "Excellent"}
          </Text>
        </View>

        {/* Comment */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Share your feedback</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Tell us about your experience..."
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={6}
            placeholderTextColor={COLORS.GRAY}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{comment.length}/500</Text>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? "Submitting..." : "Submit Review"}
          </Text>
        </TouchableOpacity>

        {/* Tips */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>💡 Review Tips</Text>
          <Text style={styles.tipText}>• Be honest and specific</Text>
          <Text style={styles.tipText}>• Mention what you liked or didn't like</Text>
          <Text style={styles.tipText}>• Help others make informed decisions</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.LIGHT_GRAY,
  },
  content: {
    padding: SPACING.lg,
  },
  bookingCard: {
    backgroundColor: COLORS.EMERALD_GREEN,
    padding: SPACING.lg,
    borderRadius: 12,
    marginBottom: SPACING.lg,
  },
  bookingTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "bold",
    color: COLORS.WHITE,
    marginBottom: 4,
  },
  bookingDate: {
    fontSize: FONT_SIZE.md,
    color: COLORS.WHITE,
  },
  section: {
    backgroundColor: COLORS.WHITE,
    padding: SPACING.lg,
    borderRadius: 12,
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "bold",
    color: COLORS.BLACK,
    marginBottom: SPACING.md,
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: SPACING.md,
  },
  starButton: {
    padding: SPACING.sm,
  },
  star: {
    fontSize: 40,
  },
  ratingText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.GRAY,
    textAlign: "center",
    fontWeight: "600",
  },
  textArea: {
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GRAY,
    borderRadius: 8,
    padding: SPACING.md,
    fontSize: FONT_SIZE.md,
    color: COLORS.BLACK,
    minHeight: 120,
    backgroundColor: COLORS.LIGHT_GRAY,
  },
  charCount: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.GRAY,
    textAlign: "right",
    marginTop: SPACING.sm,
  },
  submitButton: {
    backgroundColor: COLORS.EMERALD_GREEN,
    paddingVertical: SPACING.md,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZE.lg,
    fontWeight: "bold",
  },
  tipsCard: {
    backgroundColor: COLORS.WHITE,
    padding: SPACING.lg,
    borderRadius: 12,
  },
  tipsTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
    color: COLORS.BLACK,
    marginBottom: SPACING.sm,
  },
  tipText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.GRAY,
    marginBottom: 4,
    lineHeight: 20,
  },
});
