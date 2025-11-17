// src/components/homeScreen/ProductGrid.js
import React from "react";
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

const { width } = Dimensions.get("window");

export default function ProductList({ search }) {
  const navigation = useNavigation();

  const products = [
    {
      id: "1",
      name: "Tractor",
      image: "https://via.placeholder.com/100",
      use: "Carrying various things",
      rent: "N/A",
    },
    {
      id: "2",
      name: "Rotavator",
      image: "https://via.placeholder.com/100",
      use: "To plough field",
      rent: "1600 per hour",
    },
    {
      id: "3",
      name: "Cultivator",
      image: "https://via.placeholder.com/100",
      use: "To plough field",
      rent: "1100 per hour",
    },
    {
      id: "4",
      name: "Thresher",
      image: "https://via.placeholder.com/100",
      use: "Separate grain from stalks and husks",
      rent: "N/A",
    },
    {
      id: "5",
      name: "Zero tillage seed drill",
      image: "https://via.placeholder.com/100",
      use: "Create narrow furrow, place seed, cover soil",
      rent: "N/A",
    },
    {
      id: "6",
      name: "Power tiller",
      image: "https://via.placeholder.com/100",
      use: "Soil preparation and cultivation",
      rent: "800 per day",
    },
    {
      id: "7",
      name: "Land labeler",
      image: "https://via.placeholder.com/100",
      use: "Create flat and even surface",
      rent: "N/A",
    },
    {
      id: "8",
      name: "Front ripper",
      image: "https://via.placeholder.com/100",
      use: "Cut the paddy in the field",
      rent: "N/A",
    },
    {
      id: "9",
      name: "Dyang banaune machine",
      image: "https://via.placeholder.com/100",
      use: "Dyang banaune",
      rent: "N/A",
    },
    {
      id: "10",
      name: "M.B plough",
      image: "https://via.placeholder.com/100",
      use: "Cut, lift, and invert the soil",
      rent: "N/A",
    },
    {
      id: "11",
      name: "Hydraulic Tractor Trolley",
      image: "https://via.placeholder.com/100",
      use: "Transporting materials",
      rent: "N/A",
    },
    {
      id: "12",
      name: "Tractor mounted chaff cutter",
      image: "https://via.placeholder.com/100",
      use: "Chop and cut straw and chaff",
      rent: "N/A",
    },
    {
      id: "13",
      name: "Earth auger",
      image: "https://via.placeholder.com/100",
      use: "Dig holes using rotating blades",
      rent: "N/A",
    },
    {
      id: "14",
      name: "Ridger bed maker",
      image: "https://via.placeholder.com/100",
      use: "Create raised beds or ridges",
      rent: "N/A",
    },
    {
      id: "15",
      name: "Reaper",
      image: "https://via.placeholder.com/100",
      use: "Cut and collect ripe crops",
      rent: "N/A",
    },
    {
      id: "16",
      name: "Mechanical rice transplanter",
      image: "https://via.placeholder.com/100",
      use: "Automates transplanting rice seedlings",
      rent: "N/A",
    },
    {
      id: "17",
      name: "Mini tiller",
      image: "https://via.placeholder.com/100",
      use: "Plough small area of field",
      rent: "500 per day",
    },
    {
      id: "18",
      name: "E loader",
      image: "https://via.placeholder.com/100",
      use: "Carry goods and things",
      rent: "N/A",
    },
  ];

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const numColumns = 3;
  const itemWidth = (width - 16 * 2 - 10 * (numColumns - 1)) / numColumns;

  return (
    <FlatList
      data={filteredProducts}
      keyExtractor={(item) => item.id}
      numColumns={numColumns}
      contentContainerStyle={{ padding: 16 }}
      columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 16 }}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={
            () => navigation.navigate("ProductScreen", { productId: item.id }) // updated screen
          }
          style={[styles.card, { width: itemWidth }]}
        >
          <Image source={{ uri: item.image }} style={styles.image} />
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
