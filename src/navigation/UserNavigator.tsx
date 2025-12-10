import React from "react";
import { Text } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/user/Home/HomeScreen";
import ServiceDetailScreen from "../screens/user/ServiceDetailScreen";
import BookingFormScreen from "../screens/user/BookingFormScreen";
import BookingScreen from "../screens/user/Booking/BookingScreen";
import BookingDetailScreen from "../screens/user/BookingDetailScreen";
import AddReviewScreen from "../screens/user/AddReviewScreen";
import ProfileScreen from "../screens/user/Profile/ProfileScreen";
import LocationSearchScreen from "../screens/user/LocationSearchScreen";
import { useTheme } from "../context/ThemeContext";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ServiceDetail"
        component={ServiceDetailScreen}
        options={{ title: "Service Details" }}
      />
      <Stack.Screen
        name="BookingForm"
        component={BookingFormScreen}
        options={{ title: "Book Service" }}
      />
    </Stack.Navigator>
  );
}

function BookingsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="BookingsList"
        component={BookingScreen}
        options={{ title: "My Bookings" }}
      />
      <Stack.Screen
        name="BookingDetail"
        component={BookingDetailScreen}
        options={{ title: "Booking Details" }}
      />
      <Stack.Screen
        name="AddReview"
        component={AddReviewScreen}
        options={{ title: "Leave a Review" }}
      />
    </Stack.Navigator>
  );
}

export default function UserNavigator() {
  const { colors } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.PRIMARY,
        tabBarInactiveTintColor: colors.TEXT_SECONDARY,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.CARD_BACKGROUND,
          borderTopColor: colors.BORDER,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: () => <Text>🏠</Text>,
        }}
      />
      <Tab.Screen
        name="Bookings"
        component={BookingsStack}
        options={{
          tabBarLabel: "Bookings",
          tabBarIcon: () => <Text>📅</Text>,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Search"
        component={LocationSearchScreen}
        options={{
          tabBarLabel: "Search",
          tabBarIcon: () => <Text>🔍</Text>,
          headerShown: true,
          title: "Find Services",
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: () => <Text>👤</Text>,
          headerShown: true,
          title: "Profile",
        }}
      />
    </Tab.Navigator>
  );
}
