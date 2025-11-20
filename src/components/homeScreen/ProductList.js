// src/components/homeScreen/ProductGrid.js
import React, { useContext, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  FlatList,
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { ProductContext } from "../../context/ProductProvider";
import { MaterialCommunityIcons } from "@expo/vector-icons"; // for currency icon

const { width } = Dimensions.get("window");

export default function ProductList({ search }) {
  const navigation = useNavigation();
  const { products, fetchProducts } = useContext(ProductContext);

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const numColumns = 3;
  const itemWidth = (width - 16 * 2 - 10 * (numColumns - 1)) / numColumns;

  return (
    <FlatList
      data={filteredProducts}
      keyExtractor={(item) => item?._id}
      numColumns={numColumns}
      contentContainerStyle={{
        padding: 16,
        paddingBottom: 16,
      }}
      columnWrapperStyle={{
        justifyContent: "space-between",
        marginBottom: 16,
      }}
      ListFooterComponent={<View style={{ height: 60 }} />}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("ProductScreen", { productId: item._id })
          }
          style={[styles.card, { width: itemWidth }]}
          activeOpacity={0.8}
        >
          <Image
            source={{ uri: item.images?.[0] }}
            style={styles.image}
          />
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>

          {/* Highlighted Price Section with Icon */}
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
  );
}

const styles = StyleSheet.create({
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

  name: {
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 6,
    color: "#333",
  },

  priceTag: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: "#27ae60", // Green highlight
    borderRadius: 20,
    marginTop: 4,
  },

  priceText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});
