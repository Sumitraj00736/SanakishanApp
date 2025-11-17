import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";

import ProductDetail from "../components/product/ProductDetails";
import BookingForm from "../components/product/BookingForm";

export default function ProductScreen() {
  const route = useRoute();
  const productId = route.params?.productId;

  return (
    <ScrollView style={styles.container}>
      <ProductDetail productId={productId} />
      <BookingForm productId={productId} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
});
