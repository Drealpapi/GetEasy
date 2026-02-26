import React from "react";
import { useAuth } from "../../features/auth/hooks/useAuth";
import AuthNavigator from "./AuthNavigator";
import ProviderNavigator from "./ProviderNavigator";
import UserNavigator from "./UserNavigator";

export default function AppNavigator() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <AuthNavigator />;
  }

  if (currentUser.role === "provider") {
    return <ProviderNavigator />;
  }

  return <UserNavigator />;
}
