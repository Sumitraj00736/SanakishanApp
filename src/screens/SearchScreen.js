import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import Heading from "../components/homeScreen/Heading";
import SearchBar from "../components/homeScreen/SearchBar";
import BottomBar from "../components/navigation/BottomBar";

// Sample product list (you can later replace this with real data)
const products = [
  { id: 1, name: "Tractor" },
  { id: 2, name: "Plough" },
  { id: 3, name: "Harvester" },
  { id: 4, name: "Water Pump" },
  { id: 5, name: "Fertilizer Mixer" },
  { id: 6, name: "Seed Drill Machine" },
  { id: 7, name: "Sprayer" },
  { id: 8, name: "Irrigation Motor" },
  { id: 9, name: "Mini Tractor" },
  { id: 10, name: "Rotavator" },
];

export default function SearchScreen() {
  const [search, setSearch] = useState("");

  // Filter products based on search input
  const filteredProducts = products.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <Heading />
        <SearchBar search={search} setSearch={setSearch} />
      </View>

      {/* Product List */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <Text style={styles.item}>{item.name}</Text>}
        ListEmptyComponent={
          <Text style={styles.noResult}>No products found</Text>
        }
        contentContainerStyle={{ paddingBottom: 80 }}
      />

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
