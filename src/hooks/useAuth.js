// useAuth hook

"use client";

import { useEffect, useState, useCallback } from "react";
import { apiURL } from "@/constants/index";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${apiURL}/api/auth/me`, {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();

        if (response.ok) {
          setIsAuthenticated(true);
          setUser(data.user);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signup = async (email, password, name) => {
    try {
      const response = await fetch(`${apiURL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
        credentials: "include",
      });

      return await response.json();
    } catch (error) {
      return { success: false, message: "Signup failed." };
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch(`${apiURL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        setIsAuthenticated(true);
        setUser(data.user);
      }

      return data;
    } catch (error) {
      return { success: false, message: "Login Failed" };
    }
  };

  const logout = async () => {
    try {
      const response = await fetch(`${apiURL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        setIsAuthenticated(false);
        setUser(null);
      }

      return data;
    } catch (error) {
      return { success: false, message: "Logout Failed" };
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

  const googleLogin = async (token) => {
    try {
      const response = await fetch(`${apiURL}/api/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (data.success) {
        setIsAuthenticated(true);
        setUser(data.user);
      }

      return data;
    } catch (error) {
      return { success: false, message: "Google Login failed" };
    }
  };

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
    user,
    isAuthenticated,
    signup,
    googleLogin,
    login,
    logout,
  };
};
