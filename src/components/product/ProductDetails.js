// src/components/product/ProductDetail.js
import React, { useContext, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useRoute } from "@react-navigation/native";
// import BookingForm from "./BookingForm";
import { ProductContext } from "../../context/ProductProvider";
import { AuthContext } from "../../context/AuthProvider";

const { width } = Dimensions.get("window");

export default function ProductDetail() {
  const route = useRoute();
  const { productId } = route.params;
  // console.log("id:"+ productId);

  const { productDetail, fetchProductById } = useContext(ProductContext);
    const { user } = useContext(AuthContext);


  useEffect(() => {
    fetchProductById(productId);
  }, [productId]);

  if (!productDetail) {
    return (
      <View style={styles.container}>
        <Text>Product not found</Text>
      </View>
    );
  }

  // ✅ Enable images array
  const images = productDetail.images?.length
    ? productDetail.images
    : ["https://via.placeholder.com/400x300"];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.name}>{productDetail.name}</Text>
      <Text style={styles.description}>{productDetail.description}</Text>

      {/* ✅ Horizontal image slider */}
<ScrollView
  horizontal
  pagingEnabled
  showsHorizontalScrollIndicator={false}
  style={styles.sliderContainer}
>
  {productDetail?.images?.length > 0 ? (
    productDetail.images.map((img, index) => (
      <Image
        key={index}
        source={{ uri: img }}
        style={styles.image}
      />
    ))
  ) : (
    <Image
      source={{ uri: "https://via.placeholder.com/400x300" }}
      style={styles.image}
    />
  )}
</ScrollView>


<Text style={styles.price}>
  Price: ₹{user ? productDetail.memberPrice : productDetail.basePrice}
</Text>
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
