// src/components/homeScreen/SearchBar.js
import React, { useRef, useState, useEffect } from "react";
import { View, TextInput, StyleSheet, Animated, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

export default function SearchBar({ search, setSearch }) {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const isSmall = width < 380;
  const [isFocused, setIsFocused] = useState(false);
  const widthAnim = useRef(new Animated.Value(0)).current; // animation for border & shadow

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: isFocused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused]);

  const borderColor = widthAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#86efac", "#15803d"],
  });

  const shadowOpacity = widthAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.2],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          borderRadius: isSmall ? 10 : 12,
          marginTop: isSmall ? 6 : 8,
          marginBottom: isSmall ? 10 : 14,
        },
        {
          borderColor,
          shadowOpacity,
          shadowRadius: isFocused ? 4 : 2,
          shadowOffset: { width: 0, height: isFocused ? 3 : 1 },
        },
      ]}
    >
      <Ionicons name="search-outline" size={20} color="#166534" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={t("search.placeholder")}
        value={search}
        onChangeText={setSearch}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        returnKeyType="search"
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0fdf4",
    borderWidth: 1,
    paddingHorizontal: 10,
    shadowColor: "#14532d",
    shadowOpacity: 0,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 38,
    color: "#14532d",
  },
});
