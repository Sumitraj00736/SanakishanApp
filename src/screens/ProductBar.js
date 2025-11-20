import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import Heading from "../components/homeScreen/Heading";
import SearchBar from "../components/homeScreen/SearchBar";
import BottomBar from "../components/navigation/BottomBar";
import ProductGrid from "../components/homeScreen/ProductList"

// Sample product list (you can later replace this with real data)

export default function ProductBar() {
  const [search, setSearch] = useState("");

  return (
    <View style={styles.container}>

      {/* Header Section */}
      <View style={styles.headerSection}>
        <Heading />
        <SearchBar search={search} setSearch={setSearch} />
      </View>

      {/* Product List */}
      <ProductGrid search={search} />
      

      {/* Bottom Navigation Bar */}
      <BottomBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  headerSection: {
    backgroundColor: "green",
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  item: {
    fontSize: 18,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  noResult: {
    textAlign: "center",
    color: "gray",
    marginTop: 20,
    fontSize: 16,
  },
});
