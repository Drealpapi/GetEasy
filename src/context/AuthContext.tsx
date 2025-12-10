import React, { createContext, useContext, useState, ReactNode } from "react";
import { User } from "../types/user";

interface AuthContextValue {
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
  
  // Authentication methods
  loginUser: (email: string, password: string) => Promise<void>;
  loginProvider: (email: string, password: string) => Promise<void>;
  registerUser: (userData: UserRegistrationData) => Promise<void>;
  registerProvider: (providerData: ProviderRegistrationData) => Promise<void>;
  resetPassword: (email: string, role: 'user' | 'provider') => Promise<void>;
  logout: () => void;
  
  // Utility methods
  clearError: () => void;
  validateEmail: (email: string) => boolean;
  validatePassword: (password: string) => boolean;
}

interface UserRegistrationData {
  name: string;
  email: string;
  password: string;
  phone: string;
  state?: string;
  acceptedTerms: boolean;
}

interface ProviderRegistrationData {
  name: string;
  email: string;
  password: string;
  phone: string;
  businessName: string;
  serviceCategory: string;
  state: string;
  acceptedTerms: boolean;
  acceptedProviderTerms: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  const clearError = () => {
    setError(null);
  };

  const loginUser = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!validateEmail(email)) {
        throw new Error("Invalid email format");
      }
      
      if (!validatePassword(password)) {
        throw new Error("Password must be at least 6 characters");
      }

      // Mock user login - in real app, this would call an API
      const mockUser: User = {
        id: "user_" + Date.now(),
        name: "Test User",
        email: email,
        role: "user",
        phone: "123-456-7890"
      };
      
      setCurrentUser(mockUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const loginProvider = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!validateEmail(email)) {
        throw new Error("Invalid email format");
      }
      
      if (!validatePassword(password)) {
        throw new Error("Password must be at least 6 characters");
      }

      // Mock provider login - in real app, this would call an API
      const mockProvider: User = {
        id: "provider_" + Date.now(),
        name: "Test Provider",
        email: email,
        role: "provider",
        phone: "123-456-7890",
        state: "CA"
      };
      
      setCurrentUser(mockProvider);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const registerUser = async (userData: UserRegistrationData): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (!validateEmail(userData.email)) {
        throw new Error("Invalid email format");
      }
      
      if (!validatePassword(userData.password)) {
        throw new Error("Password must be at least 6 characters");
      }

      if (!userData.acceptedTerms) {
        throw new Error("You must accept the terms and conditions");
      }

      // Mock user creation - in real app, this would call an API
      console.log("User registered successfully:", userData.email);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const registerProvider = async (providerData: ProviderRegistrationData): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (!validateEmail(providerData.email)) {
        throw new Error("Invalid email format");
      }
      
      if (!validatePassword(providerData.password)) {
        throw new Error("Password must be at least 6 characters");
      }

      if (!providerData.acceptedTerms || !providerData.acceptedProviderTerms) {
        throw new Error("You must accept all terms and conditions");
      }

      // Mock provider creation - in real app, this would call an API
      console.log("Provider registered successfully:", providerData.email);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string, role: 'user' | 'provider'): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!validateEmail(email)) {
        throw new Error("Invalid email format");
      }

      // Mock password reset - in real app, this would call an API
      console.log(`Password reset sent to ${email} for ${role}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Password reset failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setError(null);
  };

  const value: AuthContextValue = {
    currentUser,
    isLoading,
    error,
    loginUser,
    loginProvider,
    registerUser,
    registerProvider,
    resetPassword,
    logout,
    clearError,
    validateEmail,
    validatePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
export type { UserRegistrationData, ProviderRegistrationData };