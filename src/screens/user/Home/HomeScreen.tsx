import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  ScrollView,
} from "react-native";
import { useDemoAuth } from "../../../context/DemoAuthContext";
import { getAllServices } from "../../../services/mock/mockData";
import { Service } from "../../../types/service";
import { COLORS, SPACING, FONT_SIZE, SERVICE_CATEGORIES } from "../../../utils/constants";
import { formatPrice } from "../../../utils/helpers";

export default function HomeScreen({ navigation }: any) {
  const { currentUser } = useDemoAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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

    setFilteredServices(filtered);
  }, [searchQuery, selectedCategory, services]);

  const loadServices = async () => {
    setLoading(true);
    const data = await getAllServices();
    setServices(data);
    setFilteredServices(data);
    setLoading(false);
  };

  const renderService = ({ item }: { item: Service }) => (
    <TouchableOpacity
      style={styles.serviceCard}
      onPress={() => navigation.navigate("ServiceDetail", { service: item })}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imageIcon}>📸</Text>
        </View>
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingBadgeText}>⭐ {item.rating?.toFixed(1)}</Text>
        </View>
      </View>
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.price}>{formatPrice(item.price)}</Text>
        </View>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.location}>
            📍 {item.city ? `${item.city}, ${item.state}` : item.state}
          </Text>
          <Text style={styles.jobs}>📦 {item.completedJobs || 0} jobs</Text>
        </View>
      </View>
    </TouchableOpacity>
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
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {currentUser?.name}!</Text>
        <Text style={styles.subtitle}>Find local services</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search services..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={COLORS.GRAY}
        />
        <TouchableOpacity
          style={styles.locationButton}
          onPress={() => navigation.navigate("Search")}
        >
          <Text style={styles.locationButtonText}>📍 Search by Location</Text>
        </TouchableOpacity>
      </View>

      {/* Category Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        <TouchableOpacity
          style={[styles.categoryChip, !selectedCategory && styles.categoryChipActive]}
          onPress={() => setSelectedCategory(null)}
        >
          <Text style={[styles.categoryText, !selectedCategory && styles.categoryTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        {SERVICE_CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryChip,
              selectedCategory === category && styles.categoryChipActive,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.categoryTextActive,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredServices}
        renderItem={renderService}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No services found</Text>
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
  header: {
    backgroundColor: COLORS.EMERALD_GREEN,
    padding: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  greeting: {
    fontSize: FONT_SIZE.xl,
    fontWeight: "bold",
    color: COLORS.WHITE,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.WHITE,
  },
  searchContainer: {
    padding: SPACING.md,
    backgroundColor: COLORS.WHITE,
  },
  searchInput: {
    backgroundColor: COLORS.LIGHT_GRAY,
    borderRadius: 8,
    padding: SPACING.md,
    fontSize: FONT_SIZE.md,
    color: COLORS.BLACK,
    marginBottom: SPACING.sm,
  },
  locationButton: {
    backgroundColor: COLORS.EMERALD_GREEN,
    borderRadius: 8,
    padding: SPACING.md,
    alignItems: "center",
  },
  locationButtonText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
  },
  categoriesContainer: {
    backgroundColor: COLORS.WHITE,
    paddingVertical: SPACING.md,
  },
  categoriesContent: {
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
  },
  categoryChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    backgroundColor: COLORS.LIGHT_GRAY,
    marginRight: SPACING.sm,
  },
  categoryChipActive: {
    backgroundColor: COLORS.EMERALD_GREEN,
  },
  categoryText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.GRAY,
    fontWeight: "600",
  },
  categoryTextActive: {
    color: COLORS.WHITE,
  },
  list: {
    padding: SPACING.md,
  },
  serviceCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    marginBottom: SPACING.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: "hidden",
  },
  imageContainer: {
    position: "relative",
  },
  imagePlaceholder: {
    width: "100%",
    height: 180,
    backgroundColor: COLORS.LIGHT_GRAY,
    justifyContent: "center",
    alignItems: "center",
  },
  imageIcon: {
    fontSize: 48,
  },
  ratingBadge: {
    position: "absolute",
    top: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  ratingBadgeText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "600",
  },
  cardContent: {
    padding: SPACING.md,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "bold",
    color: COLORS.BLACK,
    flex: 1,
    marginRight: SPACING.sm,
  },
  price: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "bold",
    color: COLORS.EMERALD_GREEN,
  },
  category: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.GRAY,
    marginBottom: SPACING.sm,
  },
  description: {
    fontSize: FONT_SIZE.md,
    color: COLORS.GRAY,
    marginBottom: SPACING.sm,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: SPACING.sm,
  },
  location: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.GRAY,
  },
  jobs: {
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
