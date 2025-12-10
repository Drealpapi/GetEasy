import React from "react";
import { useAuth } from "../context/AuthContext";
import AuthNavigator from "./AuthNavigator";
import UserNavigator from "./UserNavigator";
import ProviderNavigator from "./ProviderNavigator";

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
