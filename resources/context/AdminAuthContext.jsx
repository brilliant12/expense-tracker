
import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("admin_token") || null);
  const [admin, setAdmin] = useState(
    JSON.parse(localStorage.getItem("admin_data")) || null
  );

  
  useEffect(() => {
    if (token) {
      localStorage.setItem("admin_token", token);
    } else {
      localStorage.removeItem("admin_token");
    }
  }, [token]);

  useEffect(() => {
    if (admin) {
      localStorage.setItem("admin_data", JSON.stringify(admin));
    } else {
      localStorage.removeItem("admin_data");
    }
  }, [admin]);

  return (
    <AuthContext.Provider value={{ token, setToken, admin, setAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
