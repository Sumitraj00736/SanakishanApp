import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import Heading from "../components/homeScreen/Heading";
import SearchBar from "../components/homeScreen/SearchBar";
import BottomBar from "../components/navigation/BottomBar";
import ProductList from "../components/homeScreen/ProductList";

export default function SearchScreen() {
  const [search, setSearch] = useState("");

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <Heading />
        <SearchBar search={search} setSearch={setSearch} />
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingTop: 204,
          paddingBottom: 100,
        }}
      >
        <ProductList search={search} />
      </ScrollView>

      <BottomBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#052e16",
  },
  headerSection: {
    position: "absolute",
    top: 10,
    left: 0,
    right: 0,
    backgroundColor: "#052e16",
    paddingHorizontal: 16,
    paddingBottom: 10,
    zIndex: 10,
  },
});
