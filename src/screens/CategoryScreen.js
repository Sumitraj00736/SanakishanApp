import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import BottomBar from "../components/navigation/BottomBar";
import Heading from "../components/homeScreen/Heading";
import SearchBar from "../components/homeScreen/SearchBar";

const categories = [
  "Electronics",
  "Furniture",
  "Clothing",
  "Books",
  "Appliances",
  "Agriculture",
  "Construction",
  "Medical Equipment",
  "Sports Gear",
  "Beauty Products",
];

export default function CategoriesScreen() {
  const [search, setSearch] = useState("");

  // Filter categories based on search text
  const filteredCategories = categories.filter((item) =>
    item.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Green Header Section */}
      <View style={styles.headerSection}>
        <Heading />
        <SearchBar search={search} setSearch={setSearch} />
      </View>

      {/* Category List */}
      <FlatList
        data={filteredCategories}
        keyExtractor={(item) => item}
        renderItem={({ item }) => <Text style={styles.item}>{item}</Text>}
        contentContainerStyle={{ paddingBottom: 80 }}
        ListEmptyComponent={
          <Text style={styles.noResult}>No categories found</Text>
        }
      />
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
