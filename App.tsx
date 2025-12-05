import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { DemoAuthProvider } from "./src/context/DemoAuthContext";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  return (
    <DemoAuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </DemoAuthProvider>
  );
}
