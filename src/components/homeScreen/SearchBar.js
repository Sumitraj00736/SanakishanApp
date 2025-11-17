// src/components/homeScreen/SearchBar.js
import React from "react";
import { TextInput, StyleSheet } from "react-native";

export default function SearchBar({ search, setSearch }) {
  return (
    <TextInput
      style={styles.input}
      placeholder="Search equipment..."
      value={search}
      onChangeText={setSearch}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
    marginTop: 12,
  },
});
