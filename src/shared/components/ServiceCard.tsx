import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Service } from '../../core/types/service';
import { BORDER_RADIUS, COLORS, FONT_SIZE, FONT_WEIGHT, SHADOWS, SPACING } from '../constants/constants';
import { formatPrice } from '../utils/helpers';

interface ServiceCardProps {
  service: Service;
  onPress: () => void;
  variant?: 'default' | 'featured' | 'compact';
}

export default function ServiceCard({ service, onPress, variant = 'default' }: ServiceCardProps) {
  const renderRating = () => (
    <View style={styles.ratingContainer}>
      <View style={styles.ratingBadge}>
        <Text style={styles.ratingIcon}>⭐</Text>
        <Text style={styles.ratingText}>{service.rating?.toFixed(1) || '5.0'}</Text>
      </View>
    </View>
  );

  const renderPrice = () => (
    <View style={styles.priceContainer}>
      <Text style={styles.priceText}>{formatPrice(service.price)}</Text>
      <Text style={styles.priceLabel}>starting at</Text>
    </View>
  );

  const renderStats = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statItem}>
        <Text style={styles.statIcon}>📦</Text>
        <Text style={styles.statText}>{service.completedJobs || 0} jobs</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statIcon}>📍</Text>
        <Text style={styles.statText}>
          {service.city && service.lga
            ? `${service.city}, ${service.lga}`
            : service.state}
        </Text>
      </View>
    </View>
  );

  if (variant === 'featured') {
    return (
      <TouchableOpacity style={styles.featuredCard} onPress={onPress} activeOpacity={0.9}>
        <LinearGradient
          colors={['rgba(99, 102, 241, 0.1)', 'rgba(139, 92, 246, 0.05)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.featuredGradient}
        >
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredBadgeText}>FEATURED</Text>
          </View>

          <View style={styles.imageContainer}>
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imageIcon}>🔧</Text>
            </View>
            {renderRating()}
          </View>

          <View style={styles.cardContent}>
            <View style={styles.headerRow}>
              <Text style={styles.categoryText}>{service.category}</Text>
              {renderPrice()}
            </View>

            <Text style={styles.titleText} numberOfLines={2}>
              {service.title}
            </Text>

            <Text style={styles.descriptionText} numberOfLines={2}>
              {service.description}
            </Text>

            {renderStats()}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  if (variant === 'compact') {
    return (
      <TouchableOpacity style={styles.compactCard} onPress={onPress} activeOpacity={0.9}>
        <View style={styles.compactImageContainer}>
          <View style={styles.compactImagePlaceholder}>
            <Text style={styles.compactImageIcon}>🔧</Text>
          </View>
        </View>

        <View style={styles.compactContent}>
          <Text style={styles.compactTitle} numberOfLines={1}>
            {service.title}
          </Text>
          <Text style={styles.compactCategory}>{service.category}</Text>
          <View style={styles.compactFooter}>
            <Text style={styles.compactPrice}>{formatPrice(service.price)}</Text>
            <View style={styles.compactRating}>
              <Text style={styles.compactRatingText}>⭐ {service.rating?.toFixed(1) || '5.0'}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.defaultCard} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.imageContainer}>
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imageIcon}>🔧</Text>
        </View>
        {renderRating()}
      </View>

      <View style={styles.cardContent}>
        <View style={styles.headerRow}>
          <Text style={styles.categoryText}>{service.category}</Text>
          {renderPrice()}
        </View>

        <Text style={styles.titleText} numberOfLines={2}>
          {service.title}
        </Text>

        <Text style={styles.descriptionText} numberOfLines={2}>
          {service.description}
        </Text>

        {renderStats()}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Default card styles
  defaultCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.xl,
    marginBottom: SPACING.lg,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },

  // Featured card styles
  featuredCard: {
    borderRadius: BORDER_RADIUS.xl,
    marginBottom: SPACING.lg,
    overflow: 'hidden',
    ...SHADOWS.large,
  },

  featuredGradient: {
    borderWidth: 1,
    borderColor: COLORS.PRIMARY + '20',
    borderRadius: BORDER_RADIUS.xl,
  },

  featuredBadge: {
    position: 'absolute',
    top: SPACING.md,
    left: SPACING.md,
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
    zIndex: 2,
  },

  featuredBadgeText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.bold,
  },

  // Compact card styles
  compactCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },

  compactImageContainer: {
    marginRight: SPACING.md,
  },

  compactImagePlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: COLORS.GRAY_100,
    borderRadius: BORDER_RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },

  compactImageIcon: {
    fontSize: 24,
  },

  compactContent: {
    flex: 1,
    justifyContent: 'space-between',
  },

  compactTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 2,
  },

  compactCategory: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.sm,
  },

  compactFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  compactPrice: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.PRIMARY,
  },

  compactRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  compactRatingText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.TEXT_SECONDARY,
  },

  // Common styles
  imageContainer: {
    position: 'relative',
    height: 200,
  },

  imagePlaceholder: {
    flex: 1,
    backgroundColor: COLORS.GRAY_100,
    justifyContent: 'center',
    alignItems: 'center',
  },

  imageIcon: {
    fontSize: 48,
  },

  ratingContainer: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
  },

  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.full,
    ...SHADOWS.small,
  },

  ratingIcon: {
    fontSize: 14,
    marginRight: 4,
  },

  ratingText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.TEXT_PRIMARY,
  },

  cardContent: {
    padding: SPACING.lg,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },

  categoryText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.PRIMARY,
    backgroundColor: COLORS.PRIMARY + '15',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
  },

  priceContainer: {
    alignItems: 'flex-end',
  },

  priceText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.TEXT_PRIMARY,
  },

  priceLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.TEXT_TERTIARY,
  },

  titleText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.sm,
    lineHeight: 24,
  },

  descriptionText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 20,
    marginBottom: SPACING.md,
  },

  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  statIcon: {
    fontSize: 14,
    marginRight: 4,
  },

  statText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.TEXT_TERTIARY,
  },
});