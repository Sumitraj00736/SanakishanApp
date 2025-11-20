// src/components/homeScreen/SearchBar.js
import React, { useRef, useState, useEffect } from "react";
import { View, TextInput, StyleSheet, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function SearchBar({ search, setSearch }) {
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
    outputRange: ["#ccc", "green"],
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
          borderColor,
          shadowOpacity,
          shadowRadius: isFocused ? 4 : 2,
          shadowOffset: { width: 0, height: isFocused ? 3 : 1 },
        },
      ]}
    >
      <Ionicons name="search-outline" size={20} color="#777" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder="Search equipment..."
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
    backgroundColor: "white",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
    marginTop: 12,
    shadowColor: "#000",
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
    height: 40,
  },
});
