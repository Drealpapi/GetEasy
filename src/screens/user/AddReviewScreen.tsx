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
import { useAuth } from "../../context/AuthContext";

import { addReview } from "../../services/mock/mockData";
import { SPACING, FONT_SIZE } from "../../utils/constants";

export default function AddReviewScreen({ route, navigation }: any) {
  const { booking } = route.params;
  const { currentUser } = useAuth();
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
    <ScrollView style={[styles.container, { backgroundColor: COLORS.BACKGROUND }]}>
      <View style={styles.content}>
        {/* Booking Info */}
        <View style={[styles.bookingCard, { backgroundColor: COLORS.PRIMARY }]}>
          <Text style={[styles.bookingTitle, { color: COLORS.BACKGROUND }]}>Booking #{booking.id.slice(-8)}</Text>
          <Text style={[styles.bookingDate, { color: COLORS.BACKGROUND }]}>{ booking.date} at {booking.time}</Text>
        </View>

        {/* Rating */}
        <View style={[styles.section, { backgroundColor: COLORS.CARD }]}>
          <Text style={[styles.sectionTitle, { color: COLORS.TEXT_PRIMARY }]}>How was your experience?</Text>
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
          <Text style={[styles.ratingText, { color: COLORS.TEXT_SECONDARY }]}>
            {rating === 0 && "Tap to rate"}
            {rating === 1 && "Poor"}
            {rating === 2 && "Fair"}
            {rating === 3 && "Good"}
            {rating === 4 && "Very Good"}
            {rating === 5 && "Excellent"}
          </Text>
        </View>

        {/* Comment */}
        <View style={[styles.section, { backgroundColor: COLORS.CARD }]}>
          <Text style={[styles.sectionTitle, { color: COLORS.TEXT_PRIMARY }]}>Share your feedback</Text>
          <TextInput
            style={[styles.textArea, { 
              borderColor: COLORS.BORDER, 
              color: COLORS.TEXT_PRIMARY,
              backgroundColor: COLORS.INPUT_BACKGROUND 
            }]}
            placeholder="Tell us about your experience..."
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={6}
            placeholderTextColor={COLORS.TEXT_TERTIARY}
            textAlignVertical="top"
          />
          <Text style={[styles.charCount, { color: COLORS.TEXT_SECONDARY }]}>{comment.length}/500</Text>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, { backgroundColor: COLORS.PRIMARY }, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={[styles.submitButtonText, { color: COLORS.BACKGROUND }]}>
            {loading ? "Submitting..." : "Submit Review"}
          </Text>
        </TouchableOpacity>

        {/* Tips */}
        <View style={[styles.tipsCard, { backgroundColor: COLORS.CARD }]}>
          <Text style={[styles.tipsTitle, { color: COLORS.TEXT_PRIMARY }]}>💡 Review Tips</Text>
          <Text style={[styles.tipText, { color: COLORS.TEXT_SECONDARY }]}>• Be honest and specific</Text>
          <Text style={[styles.tipText, { color: COLORS.TEXT_SECONDARY }]}>• Mention what you liked or didn't like</Text>
          <Text style={[styles.tipText, { color: COLORS.TEXT_SECONDARY }]}>• Help others make informed decisions</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: SPACING.lg,
  },
  bookingCard: {
    padding: SPACING.lg,
    borderRadius: 12,
    marginBottom: SPACING.lg,
  },
  bookingTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "bold",
    marginBottom: 4,
  },
  bookingDate: {
    fontSize: FONT_SIZE.md,
  },
  section: {
    padding: SPACING.lg,
    borderRadius: 12,
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "bold",
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
    textAlign: "center",
    fontWeight: "600",
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: SPACING.md,
    fontSize: FONT_SIZE.md,
    minHeight: 120,
  },
  charCount: {
    fontSize: FONT_SIZE.sm,
    textAlign: "right",
    marginTop: SPACING.sm,
  },
  submitButton: {
    paddingVertical: SPACING.md,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "bold",
  },
  tipsCard: {
    padding: SPACING.lg,
    borderRadius: 12,
  },
  tipsTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
    marginBottom: SPACING.sm,
  },
  tipText: {
    fontSize: FONT_SIZE.sm,
    marginBottom: 4,
    lineHeight: 20,
  },
});
