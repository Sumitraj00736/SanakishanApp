// src/components/homeScreen/Category.js
import React, { useEffect, useContext, useCallback } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import { ProductContext } from "../../context/ProductProvider";
import { useFocusEffect } from "@react-navigation/native";

export default function Category() {
  const {
    categories,
    fetchCategories,
    fetchProducts,
    fetchProductsByCategory,
    loading
  } = useContext(ProductContext);

  // Load categories when component mounts
 useFocusEffect(
  useCallback(() => {
    fetchCategories();
  }, [])
 );

  if (loading && categories.length === 0) {
    return <ActivityIndicator style={{ marginVertical: 20 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Categories</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {/* ALL PRODUCTS BUTTON */}
        <TouchableOpacity
          style={[styles.categoryItem, styles.allButton]}
          onPress={fetchProducts}
        >
          <Text style={styles.categoryText}>All</Text>
        </TouchableOpacity>

        {/* REAL CATEGORIES FROM BACKEND */}
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat._id}
            style={styles.categoryItem}
            onPress={() => fetchProductsByCategory(cat._id)}
          >
            <Text style={styles.categoryText}>{cat.name}</Text>
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
