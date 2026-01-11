import React, { createContext, useState, useEffect, ReactNode } from "react";
import authService from "../services/auth.service";
import type { UserRole } from "../Types/types";
import { tokenManager } from "../utils/tokenManager";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  phone?: string;
  nin?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: any) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is already logged in
    const initAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const userData = authService.getUserData();
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Auth init error:", error);
        authService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.login({ email, password });

      tokenManager.setAccessToken(response.access);
      tokenManager.setRefreshToken(response.refresh);
      tokenManager.setUserData(response.user); // ✅ Store user data

      setUser(response.user);
      setIsAuthenticated(true);

      // ✅ Navigate based on role (matching UserRole type)
      let targetPath = "/applicant-dashboard";

      if (response.user.role === "superAdmin") {
        targetPath = "/super-admin-dashboard";
      } else if (response.user.role === "admin") {
        targetPath = "/lg-admin-dashboard";
      }

      navigate(targetPath);
    } catch (err: any) {
      console.error("❌ Login error:", err);
      const errorMessage =
        err.response?.data?.message || "Invalid email or password";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      tokenManager.clearTokens();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  const register = async (data: any) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.register(data);

      if (response.access && response.refresh) {
        tokenManager.setAccessToken(response.access);
        tokenManager.setRefreshToken(response.refresh);
        setUser(response.user);
        setIsAuthenticated(true);
        navigate("/applicant-dashboard");
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      const errorMessage = err.response?.data?.message || "Registration failed";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
