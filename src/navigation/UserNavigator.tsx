import React from "react";
import { Text, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { LinearGradient } from 'expo-linear-gradient';
import HomeScreen from "../screens/user/Home/HomeScreen";
import ServiceDetailScreen from "../screens/user/ServiceDetailScreen";
import BookingFormScreen from "../screens/user/BookingFormScreen";
import BookingScreen from "../screens/user/Booking/BookingScreen";
import BookingDetailScreen from "../screens/user/BookingDetailScreen";
import AddReviewScreen from "../screens/user/AddReviewScreen";
import ProfileScreen from "../screens/user/Profile/ProfileScreen";
import LocationSearchScreen from "../screens/user/LocationSearchScreen";
import { COLORS, FONT_SIZE, FONT_WEIGHT, SPACING, SHADOWS } from "../utils/constants";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.WHITE,
        },
        headerTintColor: COLORS.TEXT_PRIMARY,
        headerTitleStyle: {
          fontWeight: FONT_WEIGHT.bold,
          fontSize: FONT_SIZE.lg,
        },
        headerShadowVisible: true,
      }}
    >
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ServiceDetail"
        component={ServiceDetailScreen}
        options={{ 
          title: "Service Details",
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="BookingForm"
        component={BookingFormScreen}
        options={{ 
          title: "Book Service",
          headerBackTitleVisible: false,
        }}
      />
    </Stack.Navigator>
  );
}

function BookingsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.WHITE,
        },
        headerTintColor: COLORS.TEXT_PRIMARY,
        headerTitleStyle: {
          fontWeight: FONT_WEIGHT.bold,
          fontSize: FONT_SIZE.lg,
        },
        headerShadowVisible: true,
      }}
    >
      <Stack.Screen
        name="BookingsList"
        component={BookingScreen}
        options={{ title: "My Bookings" }}
      />
      <Stack.Screen
        name="BookingDetail"
        component={BookingDetailScreen}
        options={{ 
          title: "Booking Details",
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="AddReview"
        component={AddReviewScreen}
        options={{ 
          title: "Leave a Review",
          headerBackTitleVisible: false,
        }}
      />
    </Stack.Navigator>
  );
}

const TabIcon = ({ icon, focused }: { icon: string; focused: boolean }) => (
  <View style={{
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: focused ? COLORS.PRIMARY + '20' : 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  }}>
    <Text style={{
      fontSize: 18,
      opacity: focused ? 1 : 0.6,
    }}>
      {icon}
    </Text>
  </View>
);

export default function UserNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.PRIMARY,
        tabBarInactiveTintColor: COLORS.TEXT_TERTIARY,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.WHITE,
          borderTopColor: COLORS.BORDER,
          borderTopWidth: 1,
          paddingTop: SPACING.sm,
          paddingBottom: SPACING.sm,
          height: 70,
          ...SHADOWS.medium,
        },
        tabBarLabelStyle: {
          fontSize: FONT_SIZE.xs,
          fontWeight: FONT_WEIGHT.semibold,
          marginTop: 4,
        },
        tabBarItemStyle: {
          paddingVertical: SPACING.xs,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ focused }) => <TabIcon icon="🏠" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Bookings"
        component={BookingsStack}
        options={{
          tabBarLabel: "Bookings",
          tabBarIcon: ({ focused }) => <TabIcon icon="📅" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Search"
        component={LocationSearchScreen}
        options={{
          tabBarLabel: "Search",
          tabBarIcon: ({ focused }) => <TabIcon icon="🔍" focused={focused} />,
          headerShown: true,
          title: "Find Services",
          headerStyle: {
            backgroundColor: COLORS.WHITE,
          },
          headerTintColor: COLORS.TEXT_PRIMARY,
          headerTitleStyle: {
            fontWeight: FONT_WEIGHT.bold,
            fontSize: FONT_SIZE.lg,
          },
          headerShadowVisible: true,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ focused }) => <TabIcon icon="👤" focused={focused} />,
          headerShown: true,
          title: "Profile",
          headerStyle: {
            backgroundColor: COLORS.WHITE,
          },
          headerTintColor: COLORS.TEXT_PRIMARY,
          headerTitleStyle: {
            fontWeight: FONT_WEIGHT.bold,
            fontSize: FONT_SIZE.lg,
          },
          headerShadowVisible: true,
        }}
      />
    </Tab.Navigator>
  );
}
