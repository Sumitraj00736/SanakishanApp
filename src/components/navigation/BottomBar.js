// src/components/common/BottomBar.js
import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function BottomBar() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.tab}
        onPress={() => navigation.navigate("Categories")}
      >
        <Ionicons name="grid-outline" size={22} color="green" />
        <Text style={styles.label}>Categories</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tab}
        onPress={() => navigation.navigate("Search")}
      >
        <Ionicons name="search-outline" size={22} color="green" />
        <Text style={styles.label}>Search</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tab}
        onPress={() => navigation.navigate("ProductBar")}
      >
        <Ionicons name="cube-outline" size={22} color="green" />
        <Text style={styles.label}>Products</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tab}
        onPress={() => navigation.navigate("Support")}
      >
        <Ionicons name="headset-outline" size={22} color="green" />
        <Text style={styles.label}>Support</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tab}
        onPress={() => navigation.navigate("Home")}
      >
        <Ionicons name="home-outline" size={22} color="green" />
        <Text style={styles.label}>Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    backgroundColor: "white",
    height: 65,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 10,
  },
  tab: {
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: 12,
    color: "green",
    marginTop: 3,
  },
});
