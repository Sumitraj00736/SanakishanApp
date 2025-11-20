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

const { width } = Dimensions.get("window");

export default function ProductList({ search }) {
  const navigation = useNavigation();

const { products, fetchProducts } = useContext(ProductContext);

  useEffect(() => {
  fetchProducts();
}, []);
  
  const filteredProducts = products.filter((product) => {
  return product.name.toLowerCase().includes(search.toLowerCase());
});


  const numColumns = 3;
  const itemWidth = (width - 16 * 2 - 10 * (numColumns - 1)) / numColumns;

  return (
   <FlatList
  data={filteredProducts}
  keyExtractor={(item) => item?._id}
  numColumns={numColumns}
  contentContainerStyle={{
    padding: 16,
    paddingBottom: 16,   // Add some extra space
  }}
  contentInset={{ bottom: 40 }} 
  ListFooterComponent={<View style={{ height: 60 }} />} // Android fix
  columnWrapperStyle={{
    justifyContent: "space-between",
    marginBottom: 16,
  }}
  renderItem={({ item }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("ProductScreen", { productId: item._id })
      }
      style={[styles.card, { width: itemWidth }]}
    >
      <Image
        source={{ uri: item.images?.[0] }}
        style={styles.image}
      />
      <Text style={styles.name}>{item.name}</Text>
    </TouchableOpacity>
  )}
/>

  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    padding: 8,
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 10,
    marginBottom: 8,
    backgroundColor: "#eee",
  },
  name: { fontSize: 14, fontWeight: "bold", textAlign: "center" },
});
