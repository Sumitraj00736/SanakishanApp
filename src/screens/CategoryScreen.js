import React, { useState, useContext, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import Heading from "../components/homeScreen/Heading";
import SearchBar from "../components/homeScreen/SearchBar";
import BottomBar from "../components/navigation/BottomBar";
import { ProductContext } from "../context/ProductProvider";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

const { width } = Dimensions.get("window");

export default function CategoriesScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { categories, fetchCategories, fetchProductsByCategory } = useContext(ProductContext);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      await fetchCategories();
      setLoading(false);
    };
    loadCategories();
  }, []);

  // Fetch products for a category
  const selectCategory = async (catId) => {
    setSelectedCategory(catId);
    setLoading(true);
    try {
      const data = await fetchProductsByCategory(catId);
      setCategoryProducts(data); // store in local state
    } catch (err) {
      console.error("Failed to fetch category products", err);
      setCategoryProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = categoryProducts.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const numColumns = 2;
  const cardWidth = (width - 16 * 2 - 10 * (numColumns - 1)) / numColumns;
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
  const renderStickyHeader = () => (
    <View style={styles.headerSection}>
      <Heading />
      <SearchBar search={search} setSearch={setSearch} />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#15803d" />
        <Text style={{ marginTop: 10 }}>{t("common.loading")}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!selectedCategory ? (
        <FlatList
          data={categories}
          keyExtractor={(item) => item._id}
          ListHeaderComponent={renderStickyHeader}
          stickyHeaderIndices={[0]}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 110 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.categoryItem}
              onPress={() => selectCategory(item._id)}
            >
              <View style={styles.categoryIconWrap}>
                <MaterialCommunityIcons name={getCategoryIcon(item.name)} size={18} color="#166534" />
              </View>
              <Text style={styles.categoryText}>{item.name}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text>{t("common.noCategories")}</Text>
            </View>
          }
        />
      ) : (
        <>
          {filteredProducts.length === 0 ? (
            <View style={styles.center}>
                  <Text>{t("common.noProducts")}</Text>
            </View>
          ) : (
            <FlatList
              data={filteredProducts}
              ListHeaderComponent={
                <View>
                  {renderStickyHeader()}
                  <TouchableOpacity style={styles.backButton} onPress={() => setSelectedCategory(null)}>
                    <Text style={{ color: "#fff" }}> {t("common.backToCategories")}</Text>
                  </TouchableOpacity>
                </View>
              }
              stickyHeaderIndices={[0]}
              numColumns={numColumns}
              keyExtractor={(item) => item._id}
              contentContainerStyle={{ paddingBottom: 110 }}
              columnWrapperStyle={{
                justifyContent: "space-between",
                paddingHorizontal: 16,
                marginBottom: 16,
              }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.card, { width: cardWidth }]}
                  onPress={() =>
                    navigation.navigate("ProductScreen", { productId: item._id })
                  }
                  activeOpacity={0.8}
                >
                  <Image source={{ uri: item.images[0] }} style={styles.image} />
                  <Text style={styles.name} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <View style={styles.priceTag}>
                    <MaterialCommunityIcons name="currency-usd" size={12} color="#fff" style={{ marginRight: 3 }} />
                    <Text style={styles.priceText}>NPR {item.basePrice}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          )}
        </>
      )}

      <BottomBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#052e16" },
  headerSection: { backgroundColor: "#052e16", paddingHorizontal: 16, paddingBottom: 12, paddingTop: 18 },
  categoryItem: {
    padding: 16,
    backgroundColor: "#dcfce7",
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#86efac",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  categoryIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#bbf7d0",
    alignItems: "center",
    justifyContent: "center",
  },
  categoryText: { fontSize: 18, fontWeight: "600", color: "#14532d" },
  backButton: {
    backgroundColor: "#15803d",
    padding: 10,
    borderRadius: 10,
    margin: 16,
    alignItems: "center",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    alignItems: "center",
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: "#f1f1f1",
  },
  name: { fontSize: 13, fontWeight: "600", textAlign: "center", marginBottom: 6, color: "#14532d" },
  priceTag: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: "#15803d",
    borderRadius: 20,
    marginTop: 4,
  },
  priceText: { color: "#fff", fontSize: 12, fontWeight: "bold" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", marginTop: 50 },
});
