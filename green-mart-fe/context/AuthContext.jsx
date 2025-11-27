"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import axiosInstance from "@/lib/axios/axiosInstance";
import { API_PATHS } from "@/utils/apiPaths";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    // Only run on client side
    if (typeof window === 'undefined') {
      setLoading(false);
      return;
    }
    
    try {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await axiosInstance.get(API_PATHS.CUSTOMER.PROFILE);
          const data = response.data;
          setUser(data.user || data);
          localStorage.setItem("user", JSON.stringify(data.user || data));
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Error fetching profile:", error);
          const userStr = localStorage.getItem("user");
          if (userStr) {
            const userData = JSON.parse(userStr);
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            logout();
          }
        }
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };
  const login = (userData, token) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("store");
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = "/";
  };
  const updateUser = (updatedUserData) => {
    if (typeof window === 'undefined') return;
    const newUserData = { ...user, ...updatedUserData };
    localStorage.setItem("user", JSON.stringify(newUserData));
    setUser(newUserData);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      loading,
      login,
      logout,
      updateUser,
      checkAuthStatus,
    }),
    [user, isAuthenticated, loading]
  );
  
  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return children;
  }
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
