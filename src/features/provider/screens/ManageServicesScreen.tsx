import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MOCK_SERVICES, deleteService } from "../../../core/services/mock/mockData";
import { Service } from "../../../core/types/service";
import { COLORS, FONT_SIZE, SPACING } from "../../../shared/constants/constants";
import { formatPrice } from "../../../shared/utils/helpers";
import { useAuth } from "../../auth/hooks/useAuth";

export default function ManageServicesScreen() {
  const { currentUser } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    if (!currentUser) return;
    setTimeout(() => {
      const providerServices = MOCK_SERVICES.filter(
        (s) => s.providerId === currentUser.id
      );
      setServices(providerServices);
      setLoading(false);
    }, 500);
  };

  const handleDelete = async (serviceId: string) => {
    Alert.alert(
      "Delete Service",
      "Are you sure you want to delete this service?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteService(serviceId);
              await loadServices();
              Alert.alert("Success", "Service deleted successfully!");
            } catch (error) {
              Alert.alert("Error", "Failed to delete service");
            }
          },
        },
      ]
    );
  };

  const handleEdit = (service: Service) => {
    Alert.alert(
      "Edit Service",
      `Edit ${service.title}`,
      [
        {
          text: "Edit Details",
          onPress: () => {
            Alert.alert("Coming Soon", "Service editing feature will be available soon!");
          },
        },
        {
          text: "Update Price",
          onPress: () => {
            Alert.alert("Coming Soon", "Price update feature will be available soon!");
          },
        },
        {
          text: "Change Location",
          onPress: () => {
            Alert.alert("Coming Soon", "Location update feature will be available soon!");
          },
        },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  const renderService = ({ item }: { item: Service }) => (
    <View style={styles.serviceCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.price}>{formatPrice(item.price)}</Text>
      </View>
      <Text style={styles.category}>{item.category}</Text>
      <Text style={styles.location}>
        📍 {item.city}, {item.state}
      </Text>
      <Text style={styles.description} numberOfLines={2}>
        {item.description}
      </Text>
      <View style={styles.stats}>
        <Text style={styles.stat}>⭐ {item.rating?.toFixed(1) || "N/A"}</Text>
        <Text style={styles.stat}>📦 {item.completedJobs || 0} jobs</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleEdit(item)}
        >
          <Text style={styles.editText}>✏️ Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item.id)}
        >
          <Text style={styles.deleteText}>🗑️ Delete</Text>
        </TouchableOpacity>
      </View>
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
        data={services}
        renderItem={renderService}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No services yet</Text>
          </View>
        }
      />
      <TouchableOpacity style={styles.fab}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
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
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "bold",
    color: COLORS.TEXT_PRIMARY,
    flex: 1,
  },
  price: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "bold",
    color: COLORS.PRIMARY,
  },
  category: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 4,
  },
  location: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.PRIMARY,
    marginBottom: SPACING.sm,
    fontWeight: "500",
  },
  description: {
    fontSize: FONT_SIZE.md,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.sm,
  },
  stats: {
    flexDirection: "row",
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  stat: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.TEXT_SECONDARY,
  },
  actions: {
    flexDirection: "row",
    gap: SPACING.sm,
  },
  editButton: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
    alignItems: "center",
  },
  editText: {
    color: COLORS.CARD,
    fontSize: FONT_SIZE.sm,
    fontWeight: "600",
  },
  deleteButton: {
    flex: 1,
    backgroundColor: COLORS.ERROR,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
    alignItems: "center",
  },
  deleteText: {
    color: COLORS.CARD,
    fontSize: FONT_SIZE.sm,
    fontWeight: "600",
  },
  empty: {
    alignItems: "center",
    marginTop: SPACING.xxl,
  },
  emptyText: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.TEXT_SECONDARY,
  },
  fab: {
    position: "absolute",
    right: SPACING.lg,
    bottom: SPACING.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  fabText: {
    fontSize: 32,
    color: COLORS.CARD,
    fontWeight: "300",
  },
});
