// src/components/homeScreen/Category.js
import React, { useEffect, useContext, useCallback, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { ProductContext } from "../../context/ProductProvider";
import { useFocusEffect } from "@react-navigation/native";
import CategorySkeleton from "../common/CategorySkeleton";
import { useTranslation } from "react-i18next";

export default function Category({ containerStyle }) {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const isSmall = width < 380;
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

  const getCategoryIcon = (name = "") => {
    const key = String(name).toLowerCase();
    if (key.includes("tractor")) return "tractor";
    if (key.includes("water") || key.includes("pump")) return "water-pump";
    if (key.includes("seed")) return "seed";
    if (key.includes("spray")) return "spray";
    if (key.includes("harvest")) return "combine-harvester";
    if (key.includes("tool")) return "tools";
    return "shape-outline";
  };

if (loading && categories.length === 0) {
  return <CategorySkeleton />;
}

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.label, { fontSize: isSmall ? 16 : 18, marginBottom: isSmall ? 6 : 8 }]}>{t("common.categories")}</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {/* ALL PRODUCTS BUTTON */}
        <TouchableOpacity
          style={[
            styles.categoryItem,
            { paddingHorizontal: isSmall ? 12 : 15, paddingVertical: isSmall ? 8 : 9 },
            selectedCategory === "all" && styles.selectedCategoryItem,
          ]}
          onPress={() => handleCategoryPress("all")}
        >
          <MaterialCommunityIcons
            name="view-grid-outline"
            size={15}
            color={selectedCategory === "all" ? "#fff" : "#14532d"}
            style={styles.categoryIcon}
          />
          <Text
            style={[
              styles.categoryText,
              { fontSize: isSmall ? 13 : 14 },
              selectedCategory === "all" && styles.selectedCategoryText,
            ]}
          >
            {t("common.all")}
          </Text>
        </TouchableOpacity>

        {/* REAL CATEGORIES FROM BACKEND */}
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat._id}
            style={[
                styles.categoryItem,
                { paddingHorizontal: isSmall ? 12 : 15, paddingVertical: isSmall ? 8 : 9 },
                selectedCategory === cat._id && styles.selectedCategoryItem,
              ]}
            onPress={() => handleCategoryPress(cat._id)}
          >
            <MaterialCommunityIcons
              name={getCategoryIcon(cat.name)}
              size={15}
              color={selectedCategory === cat._id ? "#fff" : "#14532d"}
              style={styles.categoryIcon}
            />
            <Text
              style={[
                styles.categoryText,
                { fontSize: isSmall ? 13 : 14 },
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
    backgroundColor: "#dcfce7",
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#86efac",
    flexDirection: "row",
    alignItems: "center",
  },
  categoryIcon: { marginRight: 6 },
  categoryText: { fontSize: 14, color: "#14532d" },
  selectedCategoryItem: {
    backgroundColor: "#15803d",
  },
  selectedCategoryText: {
    color: "#fff", // white text for selected
    fontWeight: "bold",
  },
});
