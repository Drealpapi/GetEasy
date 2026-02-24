import 'react-native-gesture-handler';
import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "./src/context/AuthContext";
import AppNavigator from "./src/navigation/AppNavigator";
import SplashScreenSimple from "./src/screens/SplashScreenSimple";

function AppContent() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return (
      <>
        <StatusBar style="dark" />
        <SplashScreenSimple onFinish={handleSplashFinish} />
      </>
    );
  }
  
  return (
    <>
      <StatusBar style="dark" />
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
