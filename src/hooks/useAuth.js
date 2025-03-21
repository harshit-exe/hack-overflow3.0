// useAuth hook

"use client";

import { useEffect, useState, useCallback } from "react";
import { apiURL } from "@/constants/index";

export const useAuth = () => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    loading: true,
    error: null,
  });

  const checkAuth = async () => {
    try {
      const response = await fetch(`${apiURL}/api/auth/me`, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (response.status === 401) {
        // Automatic logout on invalid token
        await logout();
        return;
      }

      if (!response.ok)
        throw new Error(data.message || "Authentication failed");

      setAuthState({
        isAuthenticated: true,
        user: data.user,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("Auth check failed:", error);
      setAuthState((prev) => ({
        ...prev,
        isAuthenticated: false,
        user: null,
        loading: false,
        error: error.message,
      }));
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${apiURL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      await checkAuth(); // Re-validate after login
      return data;
    } catch (error) {
      setAuthState((prev) => ({ ...prev, error: error.message }));
      return { success: false, message: error.message };
    }
  };

  const logout = async () => {
    try {
      await fetch(`${apiURL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const signup = async (name, email, password) => {
    try {
      const response = await fetch(`${apiURL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.status === 409)
        return { success: response.success, message: response.message };

      const data = await response.json();

      return data;
    } catch (error) {
      return { success: false, message: "Signup failed." };
    }
  };

  // const login = async (email, password) => {
  //   try {
  //     const response = await fetch(`${apiURL}/api/auth/login`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ email, password }),
  //     });

  //     const data = await response.json();

  //     if (data.success) {
  //       setIsAuthenticated(true);
  //       setUser(data.user);
  //       document.cookie = `token=${data.token}; path=/;`;
  //     }

  //     return data;
  //   } catch (error) {
  //     return { success: false, message: "Login failed" };
  //   }
  // };

  // const googleLogin = async (token) => {
  //   try {
  //     const response = await fetch(`${apiURL}/api/auth/google`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ token }),
  //     });

  //     const data = await response.json();

  //     if (data.success) {
  //       setIsAuthenticated(true);
  //       setUser(data.user);
  //       document.cookie = `token=${data.token}; path=/;`;
  //     }

  //     return data;
  //   } catch (error) {
  //     return { success: false, message: "Google Login failed" };
  //   }
  // };

  const googleLogin = useCallback(async (credential) => {
    try {
      const response = await fetch(`${apiURL}/api/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: credential }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Google login failed");
      }

      setAuthState({
        isAuthenticated: true,
        user: data.user,
        loading: false,
        error: null,
      });

      return data;
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        error: error.message,
        loading: false,
      }));
      return { success: false, message: error.message };
    }
  }, []);

  // const logout = async () => {
  //   try {
  //     const response = await fetch(`${apiURL}/api/auth/logout`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       credentials: "include",
  //     });

  //     const data = await response.json();

  //     if (data.success) {
  //       setIsAuthenticated(false);
  //       setUser(null);
  //       document.cookie =
  //         "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
  //     }

  //     return data;
  //   } catch (error) {
  //     return { success: false, message: "Logout failed" };
  //   }
  // };

  return {
    ...authState,
    signup,
    googleLogin,
    login,
    logout,
    checkAuth,
  };
};
