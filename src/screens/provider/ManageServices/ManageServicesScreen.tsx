import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useDemoAuth } from "../../../context/DemoAuthContext";
import { MOCK_SERVICES, deleteService } from "../../../services/mock/mockData";
import { Service } from "../../../types/service";
import { COLORS, SPACING, FONT_SIZE } from "../../../utils/constants";
import { formatPrice } from "../../../utils/helpers";

export default function ManageServicesScreen() {
  const { currentUser } = useDemoAuth();
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
            await deleteService(serviceId);
            loadServices();
          },
        },
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
      <Text style={styles.description} numberOfLines={2}>
        {item.description}
      </Text>
      <View style={styles.stats}>
        <Text style={styles.stat}>⭐ {item.rating?.toFixed(1) || "N/A"}</Text>
        <Text style={styles.stat}>📦 {item.completedJobs || 0} jobs</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item.id)}
        >
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
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
    backgroundColor: COLORS.LIGHT_GRAY,
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
  stats: {
    flexDirection: "row",
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  stat: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.GRAY,
  },
  actions: {
    flexDirection: "row",
    gap: SPACING.sm,
  },
  editButton: {
    flex: 1,
    backgroundColor: COLORS.EMERALD_GREEN,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
    alignItems: "center",
  },
  editText: {
    color: COLORS.WHITE,
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
    color: COLORS.WHITE,
    fontSize: FONT_SIZE.sm,
    fontWeight: "600",
  },
  empty: {
    alignItems: "center",
    marginTop: SPACING.xxl,
  },
  emptyText: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.GRAY,
  },
  fab: {
    position: "absolute",
    right: SPACING.lg,
    bottom: SPACING.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.EMERALD_GREEN,
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
    color: COLORS.WHITE,
    fontWeight: "300",
  },
});
