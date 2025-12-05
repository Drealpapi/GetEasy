import React from "react";
import { useDemoAuth } from "../context/DemoAuthContext";
import AuthNavigator from "./AuthNavigator";
import UserNavigator from "./UserNavigator";
import ProviderNavigator from "./ProviderNavigator";

export default function AppNavigator() {
  const { currentUser } = useDemoAuth();

  if (!currentUser) {
    return <AuthNavigator />;
  }

  if (currentUser.role === "provider") {
    return <ProviderNavigator />;
  }

  return <UserNavigator />;
}
