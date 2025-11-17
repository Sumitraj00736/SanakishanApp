// src/components/product/ProductDetail.js
import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import BookingForm from "./BookingForm";

const { width } = Dimensions.get("window");

export default function ProductDetail() {
  const route = useRoute();
  const productId = route.params?.productId;

  // Product list inside this file
const products = [
  {
    id: "1",
    name: "Tractor",
    description: "Used for carrying various things on farms. Can pull heavy equipment. Suitable for both small and large fields.",
    images: [
      "https://via.placeholder.com/400x300",
      "https://via.placeholder.com/400x300/ff6347",
      "https://via.placeholder.com/400x300/4682b4",
    ],
    price: "1600 per hour",
  },
  {
    id: "2",
    name: "Rotavator",
    description: "Used to plough and prepare the soil. Efficient for medium-sized farms. Reduces labor and time for soil cultivation.",
    images: [
      "https://via.placeholder.com/400x300",
      "https://via.placeholder.com/400x300/32CD32",
      "https://via.placeholder.com/400x300/FFA500",
    ],
    price: "1600 per hour",
  },
  {
    id: "3",
    name: "Cultivator",
    description: "Used to plough the field and mix soil. Helps remove weeds efficiently. Ensures proper soil aeration and preparation.",
    images: [
      "https://via.placeholder.com/400x300",
      "https://via.placeholder.com/400x300/4682b4",
    ],
    price: "1100 per hour",
  },
  {
    id: "4",
    name: "Thresher",
    description: "Separates grain from stalks and husks after harvesting. Reduces manual labor significantly. Ensures clean and uniform grains.",
    images: ["https://via.placeholder.com/400x300"],
    price: "2000 per hour",
  },
  {
    id: "5",
    name: "Zero tillage seed drill",
    description: "Creates narrow furrow, places seed, and covers soil in a single pass. Saves time and labor. Ensures uniform seed distribution.",
    images: ["https://via.placeholder.com/400x300"],
    price: "1800 per hour",
  },
  {
    id: "6",
    name: "Power tiller",
    description: "Used for soil preparation and cultivation. Can work in small and medium plots. Helps in breaking clods and mixing fertilizer.",
    images: ["https://via.placeholder.com/400x300"],
    price: "800 per day",
  },
  {
    id: "7",
    name: "Land labeler",
    description: "Creates flat and even surface for planting. Essential for irrigation management. Reduces uneven crop growth issues.",
    images: ["https://via.placeholder.com/400x300"],
    price: "1000 per hour",
  },
  {
    id: "8",
    name: "Front ripper",
    description: "Cuts and loosens the soil in the paddy field. Helps in water management and drainage. Reduces manual labor significantly.",
    images: ["https://via.placeholder.com/400x300"],
    price: "1200 per hour",
  },
  {
    id: "9",
    name: "Dyang banaune machine",
    description: "Used for constructing dyangs in fields. Ensures even water distribution. Speeds up the preparation process for paddy fields.",
    images: ["https://via.placeholder.com/400x300"],
    price: "900 per hour",
  },
  {
    id: "10",
    name: "M.B plough",
    description: "Cuts, lifts, and inverts the soil efficiently. Helps in weed removal. Suitable for different soil types and terrains.",
    images: ["https://via.placeholder.com/400x300"],
    price: "1100 per hour",
  },
  {
    id: "11",
    name: "Hydraulic Tractor Trolley",
    description: "For transporting materials across the farm. Can carry heavy loads safely. Compatible with various tractors.",
    images: ["https://via.placeholder.com/400x300"],
    price: "1500 per hour",
  },
  {
    id: "12",
    name: "Tractor mounted chaff cutter",
    description: "Chops and cuts straw and chaff efficiently. Reduces manual labor. Useful for feeding livestock with chopped fodder.",
    images: ["https://via.placeholder.com/400x300"],
    price: "1200 per hour",
  },
  {
    id: "13",
    name: "Earth auger",
    description: "Uses rotating blades to dig holes quickly. Ideal for planting trees and poles. Saves time and effort compared to manual digging.",
    images: ["https://via.placeholder.com/400x300"],
    price: "1000 per hour",
  },
  {
    id: "14",
    name: "Ridger bed maker",
    description: "Creates raised beds or ridges for crops. Helps in proper irrigation and drainage. Ensures healthy crop growth.",
    images: ["https://via.placeholder.com/400x300"],
    price: "1300 per hour",
  },
  {
    id: "15",
    name: "Reaper",
    description: "Cuts and collects ripe crops efficiently. Reduces labor and time in harvesting. Suitable for paddy, wheat, and other crops.",
    images: ["https://via.placeholder.com/400x300"],
    price: "1400 per hour",
  },
  {
    id: "16",
    name: "Mechanical rice transplanter",
    description: "Automates transplanting rice seedlings. Ensures uniform planting and spacing. Reduces manual labor drastically.",
    images: ["https://via.placeholder.com/400x300"],
    price: "2000 per hour",
  },
  {
    id: "17",
    name: "Mini tiller",
    description: "Ploughs small area of field quickly. Ideal for small farms and gardens. Saves effort and time compared to manual ploughing.",
    images: ["https://via.placeholder.com/400x300"],
    price: "500 per day",
  },
  {
    id: "18",
    name: "E loader",
    description: "Used to carry goods and materials efficiently. Reduces manual lifting effort. Can operate on rough farm terrain easily.",
    images: ["https://via.placeholder.com/400x300"],
    price: "1000 per hour",
  },
];


  const product = products.find((p) => p.id === productId);

  if (!product) {
    return (
      <View style={styles.container}>
        <Text>Product not found</Text>
      </View>
    );
  }

  const images = product.images.length ? product.images : ["https://via.placeholder.com/400x300"];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.description}>{product.description}</Text>

      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.sliderContainer}
      >
        {images.map((img, index) => (
          <Image key={index} source={{ uri: img }} style={styles.image} />
        ))}
      </ScrollView>

      <Text style={styles.price}>Price: {product.price}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  name: { fontSize: 24, fontWeight: "bold", marginBottom: 8 },
  description: { fontSize: 16, color: "#555", marginBottom: 16 },
  sliderContainer: { marginBottom: 16 },
  image: {
    width: width - 32,
    height: 200,
    borderRadius: 10,
    marginRight: 10,
    backgroundColor: "#eee",
  },
  price: { fontSize: 18, fontWeight: "bold", marginBottom: 16, color: "green" },
});
