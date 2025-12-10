import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/auth/LoginScreen";
import UserLoginScreen from "../screens/auth/UserLoginScreen";
import ProviderLoginScreen from "../screens/auth/ProviderLoginScreen";
import UserRegistrationScreen from "../screens/auth/UserRegistrationScreen";
import ProviderRegistrationScreen from "../screens/auth/ProviderRegistrationScreen";
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen";

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
