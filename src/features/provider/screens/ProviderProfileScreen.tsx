import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import LocationSelectorAdvanced from "../../../shared/components/LocationSelectorAdvanced";
import { COLORS, FONT_SIZE, SERVICE_CATEGORIES, SPACING } from "../../../shared/constants/constants";
import { useAuth } from "../../auth/hooks/useAuth";

export default function ProviderProfileScreen() {
  const { currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  // Profile data
  const [businessName, setBusinessName] = useState("Pro Services LLC");
  const [description, setDescription] = useState("Professional service provider with 10+ years of experience");
  const [phone, setPhone] = useState("+234-555-1234");
  const [email, setEmail] = useState(currentUser?.email || "provider@example.com");
  const [selectedState, setSelectedState] = useState("Lagos");
  const [selectedCity, setSelectedCity] = useState("Ikeja");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["Electricians", "Plumbers"]);
  const [yearsExperience, setYearsExperience] = useState("10");
  const [hourlyRate, setHourlyRate] = useState("75");
  const [showLocationSelector, setShowLocationSelector] = useState(false);

  const handleLocationSelect = (state: string, city: string) => {
    setSelectedState(state);
    setSelectedCity(city);
    setShowLocationSelector(false);
  };

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleSave = () => {
    Alert.alert("Success", "Profile updated successfully!");
    setIsEditing(false);
  };

  const stats = [
    { label: "Completed Jobs", value: "247", icon: "✅" },
    { label: "Rating", value: "4.8", icon: "⭐" },
    { label: "Response Time", value: "< 2hrs", icon: "⚡" },
    { label: "Active Services", value: "12", icon: "🛠️" },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.SURFACE,
    },
    headerCard: {
      backgroundColor: COLORS.CARD,
      padding: SPACING.xl,
      alignItems: "center",
      borderBottomWidth: 1,
      borderBottomColor: COLORS.BORDER,
    },
    avatarContainer: {
      position: "relative",
      marginBottom: SPACING.md,
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: COLORS.PRIMARY,
      justifyContent: "center",
      alignItems: "center",
    },
    avatarText: {
      fontSize: 40,
      fontWeight: "bold",
      color: COLORS.BACKGROUND,
    },
    editAvatarButton: {
      position: "absolute",
      bottom: 0,
      right: 0,
      backgroundColor: COLORS.CARD,
      borderRadius: 15,
      width: 30,
      height: 30,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 2,
      borderColor: COLORS.PRIMARY,
    },
    editAvatarText: {
      fontSize: 14,
    },
    businessName: {
      fontSize: FONT_SIZE.xxl,
      fontWeight: "bold",
      color: COLORS.TEXT_PRIMARY,
      marginBottom: SPACING.sm,
    },
    businessNameInput: {
      fontSize: FONT_SIZE.xxl,
      fontWeight: "bold",
      color: COLORS.TEXT_PRIMARY,
      marginBottom: SPACING.sm,
      borderBottomWidth: 2,
      borderBottomColor: COLORS.PRIMARY,
      paddingVertical: 4,
      textAlign: "center",
    },
    locationBadge: {
      backgroundColor: COLORS.PRIMARY,
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.sm,
      borderRadius: 20,
    },
    locationText: {
      color: COLORS.BACKGROUND,
      fontSize: FONT_SIZE.sm,
      fontWeight: "600",
    },
    statsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      padding: SPACING.md,
      gap: SPACING.md,
    },
    statCard: {
      backgroundColor: COLORS.CARD,
      borderRadius: 12,
      padding: SPACING.md,
      width: "47%",
      alignItems: "center",
      shadowColor: COLORS.SHADOW,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    statIcon: {
      fontSize: 32,
      marginBottom: SPACING.sm,
    },
    statValue: {
      fontSize: FONT_SIZE.xl,
      fontWeight: "bold",
      color: COLORS.TEXT_PRIMARY,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: FONT_SIZE.xs,
      color: COLORS.TEXT_SECONDARY,
      textAlign: "center",
    },
    editButton: {
      backgroundColor: COLORS.PRIMARY,
      marginHorizontal: SPACING.md,
      paddingVertical: SPACING.md,
      borderRadius: 12,
      alignItems: "center",
      marginBottom: SPACING.md,
    },
    editButtonText: {
      color: COLORS.BACKGROUND,
      fontSize: FONT_SIZE.lg,
      fontWeight: "bold",
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
    description: {
      fontSize: FONT_SIZE.md,
      color: COLORS.TEXT_SECONDARY,
      lineHeight: 22,
    },
    descriptionInput: {
      backgroundColor: COLORS.INPUT_BACKGROUND,
      borderRadius: 8,
      padding: SPACING.md,
      fontSize: FONT_SIZE.md,
      color: COLORS.TEXT_PRIMARY,
      minHeight: 100,
      textAlignVertical: "top",
      borderWidth: 1,
      borderColor: COLORS.BORDER,
    },
    categoriesGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: SPACING.sm,
    },
    categoryChip: {
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.sm,
      borderRadius: 20,
      backgroundColor: COLORS.SURFACE,
      borderWidth: 2,
      borderColor: COLORS.BORDER,
    },
    categoryChipActive: {
      backgroundColor: COLORS.PRIMARY,
      borderColor: COLORS.PRIMARY,
    },
    categoryChipDisabled: {
      opacity: 0.7,
    },
    categoryChipText: {
      fontSize: FONT_SIZE.sm,
      color: COLORS.TEXT_SECONDARY,
      fontWeight: "600",
    },
    categoryChipTextActive: {
      color: COLORS.BACKGROUND,
    },
    inputGroup: {
      marginBottom: SPACING.md,
    },
    inputLabel: {
      fontSize: FONT_SIZE.sm,
      color: COLORS.TEXT_SECONDARY,
      marginBottom: SPACING.sm,
      fontWeight: "600",
    },
    input: {
      backgroundColor: COLORS.INPUT_BACKGROUND,
      borderRadius: 8,
      padding: SPACING.md,
      fontSize: FONT_SIZE.md,
      color: COLORS.TEXT_PRIMARY,
      borderWidth: 1,
      borderColor: COLORS.BORDER,
    },
    inputValue: {
      fontSize: FONT_SIZE.md,
      color: COLORS.TEXT_PRIMARY,
      paddingVertical: SPACING.sm,
    },
    selectButton: {
      backgroundColor: COLORS.INPUT_BACKGROUND,
      borderRadius: 8,
      padding: SPACING.md,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderWidth: 1,
      borderColor: COLORS.BORDER,
    },
    selectButtonText: {
      fontSize: FONT_SIZE.md,
      color: COLORS.TEXT_PRIMARY,
    },
    selectButtonArrow: {
      fontSize: FONT_SIZE.sm,
      color: COLORS.TEXT_SECONDARY,
    },
    dropdown: {
      backgroundColor: COLORS.CARD,
      borderRadius: 8,
      marginTop: SPACING.sm,
      maxHeight: 200,
      borderWidth: 1,
      borderColor: COLORS.BORDER,
    },
    dropdownItem: {
      padding: SPACING.md,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.BORDER,
    },
    dropdownItemText: {
      fontSize: FONT_SIZE.md,
      color: COLORS.TEXT_PRIMARY,
    },
    rateInputContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: COLORS.INPUT_BACKGROUND,
      borderRadius: 8,
      paddingHorizontal: SPACING.md,
      borderWidth: 1,
      borderColor: COLORS.BORDER,
    },
    dollarSign: {
      fontSize: FONT_SIZE.lg,
      color: COLORS.TEXT_PRIMARY,
      fontWeight: "bold",
      marginRight: SPACING.sm,
    },
    rateInput: {
      flex: 1,
      padding: SPACING.md,
      fontSize: FONT_SIZE.md,
      color: COLORS.TEXT_PRIMARY,
    },
    perHour: {
      fontSize: FONT_SIZE.md,
      color: COLORS.TEXT_SECONDARY,
      marginLeft: SPACING.sm,
    },
    actionButtons: {
      flexDirection: "row",
      padding: SPACING.md,
      gap: SPACING.md,
    },
    cancelButton: {
      flex: 1,
      backgroundColor: COLORS.SURFACE,
      paddingVertical: SPACING.md,
      borderRadius: 12,
      alignItems: "center",
      borderWidth: 1,
      borderColor: COLORS.BORDER,
    },
    cancelButtonText: {
      color: COLORS.TEXT_SECONDARY,
      fontSize: FONT_SIZE.lg,
      fontWeight: "bold",
    },
    saveButton: {
      flex: 1,
      backgroundColor: COLORS.PRIMARY,
      paddingVertical: SPACING.md,
      borderRadius: 12,
      alignItems: "center",
    },
    saveButtonText: {
      color: COLORS.BACKGROUND,
      fontSize: FONT_SIZE.lg,
      fontWeight: "bold",
    },
    bottomSpacer: {
      height: SPACING.xl,
    },
  });

  return (
    <ScrollView style={styles.container}>
      {/* Header Card */}
      <View style={styles.headerCard}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {businessName.charAt(0).toUpperCase()}
            </Text>
          </View>
          {isEditing && (
            <TouchableOpacity style={styles.editAvatarButton}>
              <Text style={styles.editAvatarText}>📷</Text>
            </TouchableOpacity>
          )}
        </View>

        {isEditing ? (
          <TextInput
            style={styles.businessNameInput}
            value={businessName}
            onChangeText={setBusinessName}
            placeholder="Business Name"
          />
        ) : (
          <Text style={styles.businessName}>{businessName}</Text>
        )}

        <View style={styles.locationBadge}>
          <Text style={styles.locationText}>
            📍 {selectedCity}, {selectedState}
          </Text>
        </View>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <Text style={styles.statIcon}>{stat.icon}</Text>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Edit Button */}
      {!isEditing && (
        <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
          <Text style={styles.editButtonText}>✏️ Edit Profile</Text>
        </TouchableOpacity>
      )}

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📋 About</Text>
        {isEditing ? (
          <TextInput
            style={styles.descriptionInput}
            value={description}
            onChangeText={setDescription}
            placeholder="Describe your business..."
            multiline
            numberOfLines={4}
          />
        ) : (
          <Text style={styles.description}>{description}</Text>
        )}
      </View>

      {/* Service Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔧 Service Categories</Text>
        <View style={styles.categoriesGrid}>
          {SERVICE_CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryChip,
                selectedCategories.includes(category) && styles.categoryChipActive,
                !isEditing && styles.categoryChipDisabled,
              ]}
              onPress={() => isEditing && toggleCategory(category)}
              disabled={!isEditing}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  selectedCategories.includes(category) && styles.categoryChipTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Location */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📍 Service Location</Text>

        {isEditing ? (
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Select Location</Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => setShowLocationSelector(true)}
            >
              <Text style={styles.selectButtonText}>
                {selectedCity}, {selectedState}
              </Text>
              <Text style={styles.selectButtonArrow}>▼</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>State</Text>
              <Text style={styles.inputValue}>{selectedState}</Text>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>City</Text>
              <Text style={styles.inputValue}>{selectedCity}</Text>
            </View>
          </>
        )}
      </View>

      {/* Contact Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📞 Contact Information</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Phone</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Phone number"
              keyboardType="phone-pad"
            />
          ) : (
            <Text style={styles.inputValue}>{phone}</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Email</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Email address"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          ) : (
            <Text style={styles.inputValue}>{email}</Text>
          )}
        </View>
      </View>

      {/* Professional Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💼 Professional Details</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Years of Experience</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={yearsExperience}
              onChangeText={setYearsExperience}
              placeholder="Years"
              keyboardType="numeric"
            />
          ) : (
            <Text style={styles.inputValue}>{yearsExperience} years</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Hourly Rate</Text>
          {isEditing ? (
            <View style={styles.rateInputContainer}>
              <Text style={styles.dollarSign}>$</Text>
              <TextInput
                style={styles.rateInput}
                value={hourlyRate}
                onChangeText={setHourlyRate}
                placeholder="0"
                keyboardType="numeric"
              />
              <Text style={styles.perHour}>/hr</Text>
            </View>
          ) : (
            <Text style={styles.inputValue}>${hourlyRate}/hr</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
        </View>
      </View>

      {/* Save/Cancel Buttons */}
      {isEditing && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setIsEditing(false)}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>💾 Save Changes</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.bottomSpacer} />

      {/* Location Selector Modal */}
      <LocationSelectorAdvanced
        isVisible={showLocationSelector}
        onClose={() => setShowLocationSelector(false)}
        onLocationSelect={handleLocationSelect}
        selectedState={selectedState}
        selectedCity={selectedCity}
        mode="provider"
      />
    </ScrollView>
  );
}
