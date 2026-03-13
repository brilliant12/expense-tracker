
import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("user_token") || null);
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user_data")) || null
  );

  
  useEffect(() => {
    if (token) {
      localStorage.setItem("user_token", token);
    } else {
      localStorage.removeItem("user_token");
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user_data", JSON.stringify(user));
    } else {
      localStorage.removeItem("user_data");
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ token, setToken, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
