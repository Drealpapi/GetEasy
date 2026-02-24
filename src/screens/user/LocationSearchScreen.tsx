import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { getAllUSStates, getCitiesByState, searchStatesAndCities, getPopularLocations } from "../../utils/usStatesData";
import { SERVICE_CATEGORIES, COLORS, SPACING, FONT_SIZE } from "../../utils/constants";
import { getAllServices } from "../../services/mock/mockData";
import { Service } from "../../types/service";
import { formatPrice } from "../../utils/helpers";

export default function LocationSearchScreen({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<Service[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showAllStates, setShowAllStates] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<{ states: string[]; cities: { state: string; city: string }[] }>({ states: [], cities: [] });

  const allStates = getAllUSStates();
  const cities = selectedState ? getCitiesByState(selectedState) : [];
  const popularLocations = getPopularLocations();

  const handleSearchQueryChange = (text: string) => {
    setSearchQuery(text);
    if (text.length > 1) {
      const suggestions = searchStatesAndCities(text);
      setSearchSuggestions(suggestions);
    } else {
      setSearchSuggestions({ states: [], cities: [] });
    }
  };

  const handleSearch = async () => {
    if (!selectedState && !selectedCategory) {
      return;
    }

    setShowResults(true);
    let results = await getAllServices();

    // Filter by state
    if (selectedState) {
      results = results.filter((s) => s.state === selectedState);
    }

    // Filter by city (if selected)
    if (selectedCity) {
      results = results.filter((s) => s.city === selectedCity);
    }

    // Filter by category
    if (selectedCategory) {
      results = results.filter((s) => s.category === selectedCategory);
    }

    setSearchResults(results);
    setSearchQuery("");
    setSearchSuggestions({ states: [], cities: [] });
  };

  const handleReset = () => {
    setSelectedState(null);
    setSelectedCity(null);
    setSelectedCategory(null);
    setSearchQuery("");
    setShowResults(false);
    setSearchResults([]);
    setSearchSuggestions({ states: [], cities: [] });
    setShowAllStates(false);
  };

  const renderService = ({ item }: { item: Service }) => (
    <TouchableOpacity
      style={styles.serviceCard}
      onPress={() => navigation.navigate("Home", {
        screen: "ServiceDetail",
        params: { service: item },
      })}
    >
      <View style={styles.serviceHeader}>
        <Text style={styles.serviceTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.servicePrice}>{formatPrice(item.price)}</Text>
      </View>
      <Text style={styles.serviceCategory}>{item.category}</Text>
      <View style={styles.serviceFooter}>
        <Text style={styles.serviceLocation}>📍 {item.state}</Text>
        <Text style={styles.serviceRating}>⭐ {item.rating?.toFixed(1)}</Text>
      </View>
    </TouchableOpacity>
  );

  if (showResults) {
    return (
      <View style={styles.container}>
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsTitle}>
            {searchResults.length} Services Found
          </Text>
          <TouchableOpacity onPress={handleReset}>
            <Text style={styles.resetText}>New Search</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.activeFilters}>
          {selectedState && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>📍 {selectedState}</Text>
            </View>
          )}
          {selectedCategory && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>🔧 {selectedCategory}</Text>
            </View>
          )}
        </View>
        <FlatList
          data={searchResults}
          renderItem={renderService}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.resultsList}
          ListEmptyComponent={
            <View style={styles.emptyResults}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={styles.emptyText}>No services found</Text>
              <Text style={styles.emptySubtext}>Try different filters</Text>
            </View>
          }
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Find Services Near You</Text>
          <Text style={styles.subtitle}>Search by location and category</Text>
        </View>

        {/* Quick Search */}
        <View style={styles.searchSection}>
          <Text style={styles.sectionTitle}>🔍 Quick Search</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search state or city..."
            value={searchQuery}
            onChangeText={handleSearchQueryChange}
            placeholderTextColor={COLORS.TEXT_SECONDARY}
          />
          {(searchSuggestions.states.length > 0 || searchSuggestions.cities.length > 0) && (
            <View style={styles.suggestionsContainer}>
              {searchSuggestions.states.slice(0, 3).map((state) => (
                <TouchableOpacity
                  key={state}
                  style={styles.suggestionItem}
                  onPress={() => {
                    setSelectedState(state);
                    setSearchQuery("");
                    setSearchSuggestions({ states: [], cities: [] });
                  }}
                >
                  <Text style={styles.suggestionIcon}>📍</Text>
                  <Text style={styles.suggestionText}>{state}</Text>
                </TouchableOpacity>
              ))}
              {searchSuggestions.cities.slice(0, 5).map((item, index) => (
                <TouchableOpacity
                  key={`${item.state}-${item.city}-${index}`}
                  style={styles.suggestionItem}
                  onPress={() => {
                    setSelectedState(item.state);
                    setSelectedCity(item.city);
                    setSearchQuery("");
                    setSearchSuggestions({ states: [], cities: [] });
                  }}
                >
                  <Text style={styles.suggestionIcon}>🏙️</Text>
                  <Text style={styles.suggestionText}>{item.city}, {item.state}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Select State */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📍 Select State</Text>
            <TouchableOpacity onPress={() => setShowAllStates(!showAllStates)}>
              <Text style={styles.viewAllText}>
                {showAllStates ? "Show Less" : `View All (${allStates.length})`}
              </Text>
            </TouchableOpacity>
          </View>
          {showAllStates ? (
            <View style={styles.statesGrid}>
              {allStates.map((state) => (
                <TouchableOpacity
                  key={state}
                  style={[
                    styles.stateGridItem,
                    selectedState === state && styles.stateGridItemActive,
                  ]}
                  onPress={() => {
                    setSelectedState(state);
                    setSelectedCity(null);
                    setShowAllStates(false);
                  }}
                >
                  <Text
                    style={[
                      styles.stateGridText,
                      selectedState === state && styles.stateGridTextActive,
                    ]}
                  >
                    {state}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipsContainer}
            >
              {allStates.slice(0, 10).map((state) => (
                <TouchableOpacity
                  key={state}
                  style={[
                    styles.chip,
                    selectedState === state && styles.chipActive,
                  ]}
                  onPress={() => {
                    setSelectedState(state);
                    setSelectedCity(null);
                  }}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selectedState === state && styles.chipTextActive,
                    ]}
                  >
                    {state}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Select City */}
        {selectedState && cities.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🏙️ Select City (Optional)</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipsContainer}
            >
              {cities.map((city) => (
                <TouchableOpacity
                  key={city}
                  style={[
                    styles.chip,
                    selectedCity === city && styles.chipActive,
                  ]}
                  onPress={() => setSelectedCity(city)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selectedCity === city && styles.chipTextActive,
                    ]}
                  >
                    {city}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Select Category */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔧 Select Service Category</Text>
          <View style={styles.categoriesGrid}>
            {SERVICE_CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryCard,
                  selectedCategory === category && styles.categoryCardActive,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={styles.categoryIcon}>
                  {category === "Electricians" && "⚡"}
                  {category === "Plumbers" && "🔧"}
                  {category === "Cleaners" && "🧹"}
                  {category === "Tutors" && "📚"}
                  {category === "Mechanics" && "🔩"}
                </Text>
                <Text
                  style={[
                    styles.categoryName,
                    selectedCategory === category && styles.categoryNameActive,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Search Button */}
        <TouchableOpacity
          style={[
            styles.searchButton,
            (!selectedState && !selectedCategory) && styles.searchButtonDisabled,
          ]}
          onPress={handleSearch}
          disabled={!selectedState && !selectedCategory}
        >
          <Text style={styles.searchButtonText}>🔍 Search Services</Text>
        </TouchableOpacity>

        {/* Popular Locations */}
        <View style={styles.popularSection}>
          <Text style={styles.popularTitle}>🔥 Popular Locations</Text>
          {popularLocations.map((location, index) => (
            <TouchableOpacity
              key={`${location.state}-${location.city}-${index}`}
              style={styles.popularCard}
              onPress={() => {
                setSelectedState(location.state);
                setSelectedCity(location.city);
              }}
            >
              <View style={styles.popularLeft}>
                <Text style={styles.popularLocation}>
                  📍 {location.city}, {location.state}
                </Text>
                <Text style={styles.popularCount}>{location.count}+ services</Text>
              </View>
              <Text style={styles.popularArrow}>→</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.SURFACE,
  },
  content: {
    paddingBottom: SPACING.xl,
  },
  header: {
    backgroundColor: COLORS.PRIMARY,
    padding: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: "bold",
    color: COLORS.CARD,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.CARD,
  },
  searchSection: {
    backgroundColor: COLORS.CARD,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  section: {
    backgroundColor: COLORS.CARD,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "bold",
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.md,
  },
  searchInput: {
    backgroundColor: COLORS.SURFACE,
    borderRadius: 8,
    padding: SPACING.md,
    fontSize: FONT_SIZE.md,
    color: COLORS.TEXT_PRIMARY,
  },
  suggestionsContainer: {
    marginTop: SPACING.sm,
    backgroundColor: COLORS.CARD,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.SURFACE,
    maxHeight: 250,
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.SURFACE,
  },
  suggestionIcon: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },
  suggestionText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.TEXT_PRIMARY,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  statesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
  },
  stateGridItem: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
    backgroundColor: COLORS.SURFACE,
    borderWidth: 2,
    borderColor: COLORS.SURFACE,
    minWidth: "30%",
    alignItems: "center",
  },
  stateGridItemActive: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
  },
  stateGridText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: "600",
  },
  stateGridTextActive: {
    color: COLORS.CARD,
  },
  chipsContainer: {
    flexDirection: "row",
    gap: SPACING.sm,
  },
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    backgroundColor: COLORS.SURFACE,
    borderWidth: 2,
    borderColor: COLORS.SURFACE,
  },
  chipActive: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
  },
  chipText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: "600",
  },
  chipTextActive: {
    color: COLORS.CARD,
  },
  viewAllButton: {
    marginTop: SPACING.md,
    alignItems: "center",
  },
  viewAllText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.PRIMARY,
    fontWeight: "600",
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.md,
  },
  categoryCard: {
    width: "47%",
    backgroundColor: COLORS.SURFACE,
    borderRadius: 12,
    padding: SPACING.lg,
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.SURFACE,
  },
  categoryCardActive: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
  },
  categoryIcon: {
    fontSize: 40,
    marginBottom: SPACING.sm,
  },
  categoryName: {
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
    color: COLORS.TEXT_PRIMARY,
  },
  categoryNameActive: {
    color: COLORS.CARD,
  },
  searchButton: {
    backgroundColor: COLORS.PRIMARY,
    marginHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  searchButtonDisabled: {
    backgroundColor: COLORS.TEXT_SECONDARY,
    opacity: 0.5,
  },
  searchButtonText: {
    color: COLORS.CARD,
    fontSize: FONT_SIZE.lg,
    fontWeight: "bold",
  },
  popularSection: {
    padding: SPACING.lg,
  },
  popularTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "bold",
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.md,
  },
  popularCard: {
    backgroundColor: COLORS.CARD,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  popularLeft: {
    flex: 1,
  },
  popularLocation: {
    fontSize: FONT_SIZE.md,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: "600",
    marginBottom: 4,
  },
  popularCount: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.TEXT_SECONDARY,
  },
  popularArrow: {
    fontSize: FONT_SIZE.xl,
    color: COLORS.PRIMARY,
    fontWeight: "bold",
  },
  resultsHeader: {
    backgroundColor: COLORS.CARD,
    padding: SPACING.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.SURFACE,
  },
  resultsTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "bold",
    color: COLORS.TEXT_PRIMARY,
  },
  resetText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.PRIMARY,
    fontWeight: "600",
  },
  activeFilters: {
    backgroundColor: COLORS.CARD,
    padding: SPACING.md,
    flexDirection: "row",
    gap: SPACING.sm,
    flexWrap: "wrap",
  },
  filterBadge: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 16,
  },
  filterBadgeText: {
    color: COLORS.CARD,
    fontSize: FONT_SIZE.sm,
    fontWeight: "600",
  },
  resultsList: {
    padding: SPACING.md,
  },
  serviceCard: {
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
  serviceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  serviceTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "bold",
    color: COLORS.TEXT_PRIMARY,
    flex: 1,
    marginRight: SPACING.sm,
  },
  servicePrice: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "bold",
    color: COLORS.PRIMARY,
  },
  serviceCategory: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.sm,
  },
  serviceFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  serviceLocation: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.TEXT_SECONDARY,
  },
  serviceRating: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.TEXT_SECONDARY,
  },
  emptyResults: {
    alignItems: "center",
    marginTop: SPACING.xxl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  emptyText: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: "600",
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.TEXT_SECONDARY,
  },
});
