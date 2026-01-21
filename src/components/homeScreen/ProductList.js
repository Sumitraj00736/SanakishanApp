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
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ProductContext } from "../../context/ProductProvider";
import ProductSkeleton from "../common/ProductSkeleton";

const { width } = Dimensions.get("window");

export default function ProductList({ search = "" }) {
  const navigation = useNavigation();
  const { products, fetchProducts, loading } = useContext(ProductContext);

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const numColumns = 3;
  const ITEM_MARGIN = 10;
  const HORIZONTAL_PADDING = 16;

  const itemWidth =
    (width - HORIZONTAL_PADDING * 2 - ITEM_MARGIN * (numColumns - 1)) /
    numColumns;

  /* -------------------- SKELETON LOADER -------------------- */
  if (loading) {
    return (
      <FlatList
        scrollEnabled={false}
        data={Array.from({ length: 6 })}
        keyExtractor={(_, index) => index.toString()}
        numColumns={numColumns}
        contentContainerStyle={{ padding: 16 }}
        columnWrapperStyle={{ marginBottom: 16 }}
        renderItem={({ index }) => <ProductSkeleton index={index} />}
      />
    );
  }

  if (!filteredProducts.length) {
    return (
      <View style={styles.center}>
        <Text>No products found</Text>
      </View>
    );
  }

  /* -------------------- PRODUCT GRID -------------------- */
  return (
    <FlatList
      scrollEnabled={false}
      data={filteredProducts}
      keyExtractor={(item) => item._id}
      numColumns={numColumns}
      contentContainerStyle={{ padding: 16 }}
      columnWrapperStyle={{ marginBottom: 16 }}
      renderItem={({ item, index }) => (
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() =>
            navigation.navigate("ProductScreen", {
              productId: item._id,
            })
          }
          style={[
            styles.card,
            {
              width: itemWidth,
              marginRight:
                index % numColumns !== numColumns - 1 ? ITEM_MARGIN : 0,
            },
          ]}
        >
          <Image
            source={{ uri: item.images?.[0] }}
            style={styles.image}
          />

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
    backgroundColor: "#27ae60",
    borderRadius: 20,
    marginTop: 4,
  },

  priceText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
});
