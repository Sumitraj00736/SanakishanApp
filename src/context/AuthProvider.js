import React, { createContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import i18n from "../components/i18n";
import { API_BASE_URL } from "../config/env";

export const AuthContext = createContext();

const STORAGE_KEYS = {
  session: "memberSession",
  language: "appLanguage",
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hydrating, setHydrating] = useState(true);
  const [language, setLanguageState] = useState("en");

  useEffect(() => {
    const hydrate = async () => {
      try {
        const [session, savedLanguage] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.session),
          AsyncStorage.getItem(STORAGE_KEYS.language),
        ]);

        if (session) {
          const parsed = JSON.parse(session);
          if (parsed?.user) setUser(parsed.user);
          if (parsed?.token) setToken(parsed.token);
        }

        if (savedLanguage) {
          setLanguageState(savedLanguage);
          await i18n.changeLanguage(savedLanguage);
        }
      } catch (err) {
        console.error("Failed to hydrate auth state", err);
      } finally {
        setHydrating(false);
      }
    };

    hydrate();
  }, []);

  const saveSession = async (nextUser, nextToken) => {
    await AsyncStorage.setItem(
      STORAGE_KEYS.session,
      JSON.stringify({
        user: nextUser,
        token: nextToken,
      })
    );
  };

  const login = async (memberId) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/members/login`, {
        memberId,
      });

      const nextUser = response.data.member;
      const nextToken = response.data.token;
      setUser(nextUser);
      setToken(nextToken);
      await saveSession(nextUser, nextToken);

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

  const logout = async () => {
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem(STORAGE_KEYS.session);
  };

  const setLanguage = async (nextLanguage) => {
    setLanguageState(nextLanguage);
    await i18n.changeLanguage(nextLanguage);
    await AsyncStorage.setItem(STORAGE_KEYS.language, nextLanguage);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      hydrating,
      language,
      login,
      logout,
      setLanguage,
    }),
    [user, token, loading, hydrating, language]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
