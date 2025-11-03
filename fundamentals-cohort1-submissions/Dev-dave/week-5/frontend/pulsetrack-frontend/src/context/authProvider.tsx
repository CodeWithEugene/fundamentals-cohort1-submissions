import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "./authContext";
import type { User } from "./authContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Store currently logged-in user
  const [user, setUser] = useState<User | null>(null);

  // Store access token in memory (not in localStorage — safer against XSS)
  const [token, setToken] = useState<string | null>(null);

  //Restore user and token from sessionStorage on page refresh
  useEffect(() => {
    const savedUser = sessionStorage.getItem("user");
    const savedToken = sessionStorage.getItem("accessToken");

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
  }, []);

  //Handles user login, Updates user and token states. Saves both in memory + sessionStorage for persistence./
  const login = (userData: User, accessToken: string) => {
    setUser(userData);
    setToken(accessToken);
    sessionStorage.setItem("user", JSON.stringify(userData));
    sessionStorage.setItem("accessToken", accessToken);
  };

  //Handles user logout, Clears user and token from memory + sessionStorage.//
  const logout = () => {
    setUser(null);
    setToken(null);
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("accessToken");
  };

  // Provides the authentication context to child components//
  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
