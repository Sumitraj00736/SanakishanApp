// src/components/homeScreen/Category.js
import React from "react";
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function Category() {
  const categories = ["Tractor", "Ploughing", "Harvesting", "Seed Drill", "Transport", "Misc"];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Categories</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categories.map((category, index) => (
          <TouchableOpacity key={index} style={styles.categoryItem}>
            <Text style={styles.categoryText}>{category}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 8 },
  label: { fontSize: 18, fontWeight: "bold", color: "white", marginBottom: 8 },
  categoryItem: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  categoryText: { fontSize: 14, color: "#333" },
});
