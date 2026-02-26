import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import ForgotPasswordScreen from "../../features/auth/screens/ForgotPasswordScreen";
import LoginScreen from "../../features/auth/screens/LoginScreen";
import ProviderLoginScreen from "../../features/auth/screens/ProviderLoginScreen";
import ProviderRegistrationScreen from "../../features/auth/screens/ProviderRegistrationScreen";
import UserLoginScreen from "../../features/auth/screens/UserLoginScreen";
import UserRegistrationScreen from "../../features/auth/screens/UserRegistrationScreen";

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Login"
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="UserLogin" component={UserLoginScreen} />
      <Stack.Screen name="ProviderLogin" component={ProviderLoginScreen} />
      <Stack.Screen name="UserRegistration" component={UserRegistrationScreen} />
      <Stack.Screen name="ProviderRegistration" component={ProviderRegistrationScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
}
