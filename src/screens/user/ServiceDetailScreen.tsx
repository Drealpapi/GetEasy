import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { COLORS, SPACING, FONT_SIZE } from "../../utils/constants";
import { formatPrice } from "../../utils/helpers";

export default function ServiceDetailScreen({ route, navigation }: any) {
  const { service } = route.params;

  const handleBookNow = () => {
    navigation.navigate("BookingForm", { service });
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Service Image */}
        <View style={styles.imageContainer}>
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderText}>📸</Text>
          </View>
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>⭐ {service.rating?.toFixed(1)}</Text>
          </View>
        </View>

        {/* Service Info */}
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.title}>{service.title}</Text>
              <Text style={styles.category}>{service.category}</Text>
            </View>
            <Text style={styles.price}>{formatPrice(service.price)}</Text>
          </View>

          {/* Provider Info */}
          <View style={styles.providerCard}>
            <View style={styles.providerAvatar}>
              <Text style={styles.providerAvatarText}>👤</Text>
            </View>
            <View style={styles.providerInfo}>
              <Text style={styles.providerName}>Provider #{service.providerId.slice(-4)}</Text>
              <Text style={styles.providerStats}>
                {service.completedJobs || 0} jobs completed
              </Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About this service</Text>
            <Text style={styles.description}>{service.description}</Text>
          </View>

          {/* Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Service Details</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>📍 Location</Text>
              <Text style={styles.detailValue}>
                {service.city ? `${service.city}, ${service.state}` : service.state}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>⏱️ Duration</Text>
              <Text style={styles.detailValue}>~1-2 hours</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>💼 Category</Text>
              <Text style={styles.detailValue}>{service.category}</Text>
            </View>
          </View>

          {/* Reviews Preview */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Customer Reviews</Text>
            <View style={styles.reviewPreview}>
              <Text style={styles.reviewStars}>⭐⭐⭐⭐⭐</Text>
              <Text style={styles.reviewText}>
                "Excellent service! Very professional and quick."
              </Text>
              <Text style={styles.reviewAuthor}>- John D.</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.bottomBar}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Total Price</Text>
          <Text style={styles.priceValue}>{formatPrice(service.price)}</Text>
        </View>
        <TouchableOpacity style={styles.bookButton} onPress={handleBookNow}>
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  imageContainer: {
    position: "relative",
  },
  imagePlaceholder: {
    width: "100%",
    height: 250,
    backgroundColor: COLORS.SURFACE,
    justifyContent: "center",
    alignItems: "center",
  },
  imagePlaceholderText: {
    fontSize: 64,
  },
  ratingBadge: {
    position: "absolute",
    top: SPACING.md,
    right: SPACING.md,
    backgroundColor: COLORS.CARD,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  ratingText: {
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
  },
  content: {
    padding: SPACING.lg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: SPACING.lg,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: "bold",
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  category: {
    fontSize: FONT_SIZE.md,
    color: COLORS.TEXT_SECONDARY,
  },
  price: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: "bold",
    color: COLORS.PRIMARY,
  },
  providerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.SURFACE,
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.lg,
  },
  providerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.md,
  },
  providerAvatarText: {
    fontSize: 24,
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 2,
  },
  providerStats: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.TEXT_SECONDARY,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "bold",
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.md,
  },
  description: {
    fontSize: FONT_SIZE.md,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 22,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  detailLabel: {
    fontSize: FONT_SIZE.md,
    color: COLORS.TEXT_SECONDARY,
  },
  detailValue: {
    fontSize: FONT_SIZE.md,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: "500",
  },
  reviewPreview: {
    backgroundColor: COLORS.SURFACE,
    padding: SPACING.md,
    borderRadius: 12,
  },
  reviewStars: {
    fontSize: FONT_SIZE.md,
    marginBottom: SPACING.sm,
  },
  reviewText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.sm,
    fontStyle: "italic",
  },
  reviewAuthor: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.TEXT_SECONDARY,
  },
  bottomBar: {
    flexDirection: "row",
    padding: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
    backgroundColor: COLORS.CARD,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  priceContainer: {
    flex: 1,
    justifyContent: "center",
  },
  priceLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 2,
  },
  priceValue: {
    fontSize: FONT_SIZE.xl,
    fontWeight: "bold",
    color: COLORS.TEXT_PRIMARY,
  },
  bookButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  bookButtonText: {
    color: COLORS.TEXT_LIGHT,
    fontSize: FONT_SIZE.lg,
    fontWeight: "bold",
  },
});
