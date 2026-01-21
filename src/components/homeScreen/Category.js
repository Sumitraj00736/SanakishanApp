// src/components/homeScreen/Category.js
import React, { useEffect, useContext, useCallback, useState } from "react";
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
import CategorySkeleton from "../common/CategorySkeleton";

export default function Category() {
  const {
    categories,
    fetchCategories,
    fetchProducts,
    fetchProductsByCategory,
    loading,
  } = useContext(ProductContext);

  const [selectedCategory, setSelectedCategory] = useState("all"); // default selection

  // Load categories when component mounts
  useFocusEffect(
    useCallback(() => {
      fetchCategories();
    }, [])
  );

  const handleCategoryPress = (catId) => {
    setSelectedCategory(catId);
    if (catId === "all") {
      fetchProducts();
    } else {
      fetchProductsByCategory(catId);
    }
  };

if (loading && categories.length === 0) {
  return <CategorySkeleton />;
}

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Categories</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {/* ALL PRODUCTS BUTTON */}
        <TouchableOpacity
          style={[
            styles.categoryItem,
            selectedCategory === "all" && styles.selectedCategoryItem,
          ]}
          onPress={() => handleCategoryPress("all")}
        >
          <Text
            style={[
              styles.categoryText,
              selectedCategory === "all" && styles.selectedCategoryText,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>

        {/* REAL CATEGORIES FROM BACKEND */}
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat._id}
            style={[
              styles.categoryItem,
              selectedCategory === cat._id && styles.selectedCategoryItem,
            ]}
            onPress={() => handleCategoryPress(cat._id)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === cat._id && styles.selectedCategoryText,
              ]}
            >
              {cat.name}
            </Text>
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
  selectedCategoryItem: {
    backgroundColor: "#27ae60", // dark gray for selected
  },
  selectedCategoryText: {
    color: "#fff", // white text for selected
    fontWeight: "bold",
  },
});
