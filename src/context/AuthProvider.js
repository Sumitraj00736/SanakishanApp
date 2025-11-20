import React, { createContext, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);  // <-- ADD THIS
  
  const [loading, setLoading] = useState(false);

  const login = async (memberId) => {
    try {
      setLoading(true);

      const response = await axios.post(
        "https://shanakishan-backend.onrender.com/api/members/login",
        { memberId }
      );

      setUser(response.data.member); // save user data globally
      // console.log("Login successful:", response.data);
      setToken(response.data.token); // save token globally
      // console.log("Token received:", response.data.token);

      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null); // clear user
    setToken(null); // clear token
  };

  return (
    <AuthContext.Provider value={{ user, login, token ,logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
