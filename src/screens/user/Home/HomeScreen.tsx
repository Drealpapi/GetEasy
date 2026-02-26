import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from "../../../context/AuthContext";
import { getAllServices } from "../../../services/mock/mockData";
import { Service } from "../../../types/service";
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT, BORDER_RADIUS, SHADOWS, SERVICE_CATEGORIES } from "../../../utils/constants";
import { formatPrice } from "../../../utils/helpers";
import ModernHeader from "../../../components/common/ModernHeader";
import ModernInput from "../../../components/common/ModernInput";
import GradientButton from "../../../components/common/GradientButton";
import ServiceCard from "../../../components/common/ServiceCard";
import LocationSelector from "../../../components/common/LocationSelector";

export default function HomeScreen({ navigation }: any) {
  const { currentUser } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [showLocationSelector, setShowLocationSelector] = useState(false);
  
  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    let filtered = services;

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(
        (s) =>
          s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((s) => s.category === selectedCategory);
    }

    // Filter by location
    if (selectedLocation && selectedLocation !== 'Current Location') {
      filtered = filtered.filter((s) => s.state === selectedLocation);
    }

    setFilteredServices(filtered);
  }, [searchQuery, selectedCategory, services, selectedLocation]);

  const loadServices = async () => {
    setLoading(true);
    try {
      const data = await getAllServices();
      setServices(data);
      setFilteredServices(data);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadServices();
    setRefreshing(false);
  };

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
  };

  const renderWelcomeSection = () => (
    <LinearGradient
      colors={COLORS.PRIMARY_GRADIENT}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.welcomeSection}
    >
      <View style={styles.welcomeContent}>
        <Text style={styles.welcomeTitle}>
          Hello, {currentUser?.name?.split(' ')[0] || 'User'}! 👋
        </Text>
        <Text style={styles.welcomeSubtitle}>
          Find trusted local services in your area
        </Text>
        {selectedLocation && (
          <View style={styles.locationBadge}>
            <Text style={styles.locationBadgeText}>
              📍 {selectedLocation}
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{filteredServices.length}</Text>
          <Text style={styles.statLabel}>Services</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>4.8</Text>
          <Text style={styles.statLabel}>Avg Rating</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>24/7</Text>
          <Text style={styles.statLabel}>Support</Text>
        </View>
      </View>
    </LinearGradient>
  );

  const renderSearchSection = () => (
    <View style={styles.searchSection}>
      <ModernInput
        placeholder="Search services, providers..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        leftIcon={<Text style={styles.searchIcon}>🔍</Text>}
        variant="filled"
        containerStyle={styles.searchInput}
      />
      
      <TouchableOpacity
        style={styles.locationButton}
        onPress={() => setShowLocationSelector(true)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['rgba(99, 102, 241, 0.1)', 'rgba(139, 92, 246, 0.05)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.locationButtonGradient}
        >
          <Text style={styles.locationButtonIcon}>📍</Text>
          <Text style={styles.locationButtonText}>
            {selectedLocation || 'Select Location'}
          </Text>
          <Text style={styles.locationButtonArrow}>▼</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const renderCategoryChip = (category: string, isSelected: boolean) => (
    <TouchableOpacity
      key={category}
      style={[
        styles.categoryChip,
        isSelected && styles.categoryChipActive,
      ]}
      onPress={() => setSelectedCategory(isSelected ? null : category)}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={isSelected ? COLORS.PRIMARY_GRADIENT : [COLORS.GRAY_100, COLORS.GRAY_100]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.categoryChipGradient}
      >
        <Text style={[
          styles.categoryChipText,
          isSelected && styles.categoryChipTextActive,
        ]}>
          {category}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderCategoriesSection = () => (
    <View style={styles.categoriesSection}>
      <Text style={styles.sectionTitle}>Categories</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {renderCategoryChip("All", !selectedCategory)}
        {SERVICE_CATEGORIES.map((category) =>
          renderCategoryChip(category, selectedCategory === category)
        )}
      </ScrollView>
    </View>
  );

  const renderFeaturedServices = () => {
    const featuredServices = filteredServices.slice(0, 2);
    if (featuredServices.length === 0) return null;

    return (
      <View style={styles.featuredSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Services</Text>
          <TouchableOpacity onPress={() => {}}>
            <Text style={styles.seeAllText}>See All →</Text>
          </TouchableOpacity>
        </View>
        {featuredServices.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            onPress={() => navigation.navigate("ServiceDetail", { service })}
            variant="featured"
          />
        ))}
      </View>
    );
  };

  const renderServiceItem = ({ item }: { item: Service }) => (
    <ServiceCard
      service={item}
      onPress={() => navigation.navigate("ServiceDetail", { service: item })}
      variant="default"
    />
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient
          colors={COLORS.PRIMARY_GRADIENT}
          style={styles.loadingGradient}
        >
          <ActivityIndicator size="large" color={COLORS.WHITE} />
          <Text style={styles.loadingText}>Loading services...</Text>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {renderWelcomeSection()}
        {renderSearchSection()}
        {renderCategoriesSection()}
        {renderFeaturedServices()}
        
        <View style={styles.servicesSection}>
          <Text style={styles.sectionTitle}>All Services</Text>
          <FlatList
            data={filteredServices.slice(2)} // Skip featured services
            renderItem={renderServiceItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>🔍</Text>
                <Text style={styles.emptyTitle}>No services found</Text>
                <Text style={styles.emptyText}>
                  Try adjusting your search, category, or location filter
                </Text>
              </View>
            }
          />
        </View>
        
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Location Selector Modal */}
      <LocationSelector
        isVisible={showLocationSelector}
        onClose={() => setShowLocationSelector(false)}
        onSelectLocation={handleLocationSelect}
        selectedLocation={selectedLocation}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  
  scrollView: {
    flex: 1,
  },
  
  loadingContainer: {
    flex: 1,
  },
  
  loadingGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  loadingText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.medium,
    marginTop: SPACING.md,
  },
  
  // Welcome section
  welcomeSection: {
    paddingTop: SPACING.xxxl,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  
  welcomeContent: {
    marginBottom: SPACING.xl,
  },
  
  welcomeTitle: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.WHITE,
    marginBottom: SPACING.sm,
  },
  
  welcomeSubtitle: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.WHITE,
    opacity: 0.9,
  },
  
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: SPACING.xs,
  },
  
  statNumber: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.WHITE,
  },
  
  statLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.WHITE,
    opacity: 0.8,
    marginTop: 2,
  },
  
  // Search section
  searchSection: {
    padding: SPACING.lg,
    backgroundColor: COLORS.WHITE,
    marginTop: -SPACING.lg,
    borderTopLeftRadius: BORDER_RADIUS.xxl,
    borderTopRightRadius: BORDER_RADIUS.xxl,
    ...SHADOWS.medium,
  },
  
  searchInput: {
    marginBottom: SPACING.md,
  },
  
  searchIcon: {
    fontSize: 20,
  },
  
  locationButton: {
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.PRIMARY + '30',
    ...SHADOWS.small,
  },
  
  locationButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  
  locationButtonIcon: {
    fontSize: 18,
    marginRight: SPACING.sm,
  },
  
  locationButtonText: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.PRIMARY,
    flex: 1,
    textAlign: 'center',
  },
  
  locationButtonArrow: {
    fontSize: 12,
    color: COLORS.PRIMARY,
    marginLeft: SPACING.sm,
  },
  
  locationBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    marginTop: SPACING.md,
    alignSelf: 'flex-start',
  },
  
  locationBadgeText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
  },
  
  // Categories section
  categoriesSection: {
    paddingVertical: SPACING.lg,
    backgroundColor: COLORS.WHITE,
  },
  
  sectionTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  
  seeAllText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.PRIMARY,
    fontWeight: FONT_WEIGHT.semibold,
  },
  
  categoriesContainer: {
    paddingHorizontal: SPACING.lg,
  },
  
  categoryChip: {
    marginRight: SPACING.md,
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden',
  },
  
  categoryChipGradient: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  
  categoryChipActive: {
    ...SHADOWS.small,
  },
  
  categoryChipText: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.TEXT_SECONDARY,
  },
  
  categoryChipTextActive: {
    color: COLORS.WHITE,
  },
  
  // Featured section
  featuredSection: {
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.GRAY_50,
  },
  
  // Services section
  servicesSection: {
    padding: SPACING.lg,
    backgroundColor: COLORS.WHITE,
  },
  
  // Empty state
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xxxl,
  },
  
  emptyIcon: {
    fontSize: 64,
    marginBottom: SPACING.lg,
  },
  
  emptyTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.sm,
  },
  
  emptyText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 22,
  },
  
  bottomSpacer: {
    height: SPACING.xxxl,
  },
});
