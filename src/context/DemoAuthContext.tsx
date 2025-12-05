import React, { createContext, useContext, useState, ReactNode } from "react";
import { User } from "../types/user";
import { MOCK_USERS, MOCK_PROVIDERS } from "../services/mock/mockData";

interface DemoAuthValue {
  currentUser: User | null;
  loginAsUser: (userId: string) => void;
  loginAsProvider: (providerId: string) => void;
  logout: () => void;
}

const DemoAuthContext = createContext<DemoAuthValue | null>(null);

export const useDemoAuth = (): DemoAuthValue => {
  const context = useContext(DemoAuthContext);
  if (!context) {
    throw new Error("useDemoAuth must be used within DemoAuthProvider");
  }
  return context;
};

interface DemoAuthProviderProps {
  children: ReactNode;
}

export const DemoAuthProvider: React.FC<DemoAuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const loginAsUser = (userId: string) => {
    const user = MOCK_USERS.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
    }
  };

  const loginAsProvider = (providerId: string) => {
    const provider = MOCK_PROVIDERS.find((p) => p.id === providerId);
    if (provider) {
      setCurrentUser(provider);
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const value: DemoAuthValue = {
    currentUser,
    loginAsUser,
    loginAsProvider,
    logout,
  };

  return (
    <DemoAuthContext.Provider value={value}>
      {children}
    </DemoAuthContext.Provider>
  );
};
