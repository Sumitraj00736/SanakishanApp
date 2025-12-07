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

const { width } = Dimensions.get("window");

export default function CategoriesScreen() {
  const navigation = useNavigation();
  const { categories, fetchCategories } = useContext(ProductContext);

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
      const res = await fetch(
        `https://shanakishan-backend.onrender.com/api/categories/${catId}/products`
      );
      const data = await res.json();
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

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="green" />
        <Text style={{ marginTop: 10 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <Heading />
        <SearchBar search={search} setSearch={setSearch} />
      </View>

      {!selectedCategory ? (
        <FlatList
          data={categories}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.categoryItem}
              onPress={() => selectCategory(item._id)}
            >
              <Text style={styles.categoryText}>{item.name}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text>No categories found</Text>
            </View>
          }
        />
      ) : (
        <>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedCategory(null)}
          >
            <Text style={{ color: "#fff" }}> Back to Categories</Text>
          </TouchableOpacity>

          {filteredProducts.length === 0 ? (
            <View style={styles.center}>
              <Text>No products found</Text>
            </View>
          ) : (
            <FlatList
              data={filteredProducts}
              numColumns={numColumns}
              keyExtractor={(item) => item._id}
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
                    <MaterialCommunityIcons
                      name="currency-inr"
                      size={14}
                      color="#fff"
                      style={{ marginRight: 4 }}
                    />
                    <Text style={styles.priceText}>{item.basePrice}</Text>
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
  container: { flex: 1, backgroundColor: "#fff" },
  headerSection: { backgroundColor: "green", paddingHorizontal: 16, paddingBottom: 16 },
  categoryItem: {
    padding: 16,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    marginBottom: 12,
  },
  categoryText: { fontSize: 18, fontWeight: "600", color: "#333" },
  backButton: {
    backgroundColor: "#27ae60",
    padding: 10,
    borderRadius: 10,
    margin: 16,
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
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
  name: { fontSize: 13, fontWeight: "600", textAlign: "center", marginBottom: 6, color: "#333" },
  priceTag: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: "#27ae60",
    borderRadius: 20,
    marginTop: 4,
  },
  priceText: { color: "#fff", fontSize: 12, fontWeight: "bold" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", marginTop: 50 },
});
