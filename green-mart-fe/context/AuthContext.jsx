"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import Cookies from "js-cookie";

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

  // Load user từ localStorage khi mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const token = Cookies.get("token") || localStorage.getItem("token");
        const userData = localStorage.getItem("user");

        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error loading user:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // ✅ Hàm login - lưu vào storage VÀ cập nhật state
  const login = useCallback((userData, token) => {
    try {
      // Lưu vào Cookies và localStorage
      Cookies.set("token", token, { expires: 7, path: "/" });
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));

      // Cập nhật state NGAY LẬP TỨC
      setUser(userData);
      setIsAuthenticated(true);

      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  }, []);

  // Hàm logout
  const logout = useCallback(() => {
    Cookies.remove("token");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("store");

    setUser(null);
    setIsAuthenticated(false);
  }, []);

  // Hàm cập nhật user
  const updateUser = useCallback(
    (newUserData) => {
      try {
        const updatedUser = { ...user, ...newUserData };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
      } catch (error) {
        console.error("Update user error:", error);
      }
    },
    [user]
  );

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
