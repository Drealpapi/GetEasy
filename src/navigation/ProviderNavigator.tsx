import React from "react";
import { Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DashboardScreen from "../screens/provider/Dashboard/DashboardScreen";
import AppointmentsScreen from "../screens/provider/Appointments/AppointmentsScreen";
import ManageServicesScreen from "../screens/provider/ManageServices/ManageServicesScreen";
import EarningsScreen from "../screens/provider/Earnings/EarningsScreen";
import ProviderProfileScreen from "../screens/provider/ProviderProfileScreen";
import { COLORS } from "../utils/constants";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function DashboardStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.CARD,
        },
        headerTintColor: COLORS.TEXT_PRIMARY,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="DashboardMain"
        component={DashboardScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Appointments"
        component={AppointmentsScreen}
        options={{ title: "Appointments & Bookings" }}
      />
    </Stack.Navigator>
  );
}

export default function ProviderNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.PRIMARY,
        tabBarInactiveTintColor: COLORS.TEXT_SECONDARY,
        tabBarStyle: {
          backgroundColor: COLORS.CARD,
          borderTopColor: COLORS.BORDER,
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardStack}
        options={{
          tabBarLabel: "Dashboard",
          tabBarIcon: () => <Text>📊</Text>,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Bookings"
        component={AppointmentsScreen}
        options={{
          tabBarLabel: "Bookings",
          tabBarIcon: () => <Text>📅</Text>,
          title: "Appointments",
          headerStyle: {
            backgroundColor: COLORS.CARD,
          },
          headerTintColor: COLORS.TEXT_PRIMARY,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Tab.Screen
        name="Services"
        component={ManageServicesScreen}
        options={{
          tabBarLabel: "Services",
          tabBarIcon: () => <Text>🛠️</Text>,
          headerStyle: {
            backgroundColor: COLORS.CARD,
          },
          headerTintColor: COLORS.TEXT_PRIMARY,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Tab.Screen
        name="Earnings"
        component={EarningsScreen}
        options={{
          tabBarLabel: "Earnings",
          tabBarIcon: () => <Text>💰</Text>,
          headerStyle: {
            backgroundColor: COLORS.CARD,
          },
          headerTintColor: COLORS.TEXT_PRIMARY,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProviderProfileScreen}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: () => <Text>👤</Text>,
          headerStyle: {
            backgroundColor: COLORS.CARD,
          },
          headerTintColor: COLORS.TEXT_PRIMARY,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Tab.Navigator>
  );
}
