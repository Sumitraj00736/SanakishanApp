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
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { ProductContext } from "../../context/ProductProvider";
import { AuthContext } from "../../context/AuthProvider";
import { useTranslation } from "react-i18next";

const { width } = Dimensions.get("window");

export default function ProductDetail() {
  const { t } = useTranslation();
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
        <Text>{t("common.noProducts")}</Text>
      </View>
    );
  }

  // ✅ Enable images array
  const images = productDetail.images?.length
    ? productDetail.images
    : ["https://via.placeholder.com/400x300"];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.heroCard}>
        <Text style={styles.name}>{productDetail.name}</Text>
        <Text style={styles.description}>{productDetail.description || "-"}</Text>
        <View style={styles.pricePill}>
          <MaterialCommunityIcons name="cash-multiple" size={16} color="#dcfce7" />
          <Text style={styles.pricePillText}>
            {t("product.price")}: NPR {user ? productDetail.memberPrice : productDetail.basePrice}
          </Text>
        </View>
      </View>

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

      <View style={styles.metaRow}>
        <View style={styles.metaChip}>
          <MaterialCommunityIcons name="cube-outline" size={16} color="#166534" />
          <Text style={styles.metaText}>Total {productDetail.totalUnits || 0}</Text>
        </View>
        <View style={styles.metaChip}>
          <MaterialCommunityIcons name="archive-clock-outline" size={16} color="#166534" />
          <Text style={styles.metaText}>Reserved {productDetail.reservedUnits || 0}</Text>
        </View>
        <View style={styles.metaChip}>
          <MaterialCommunityIcons
            name={productDetail.status === "booked" ? "close-circle-outline" : "check-circle-outline"}
            size={16}
            color="#166534"
          />
          <Text style={styles.metaText}>{productDetail.status || "available"}</Text>
        </View>
      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#052e16" },
  heroCard: {
    backgroundColor: "#14532d",
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#166534",
  },
  name: { fontSize: 24, fontWeight: "800", marginBottom: 8, color: "#ffffff", fontFamily: "Poppins" },
  description: { fontSize: 14, color: "#dcfce7", marginBottom: 12, lineHeight: 20, fontFamily: "Poppins" },
  pricePill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    backgroundColor: "#15803d",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  pricePillText: { color: "#ffffff", fontWeight: "800", fontFamily: "Poppins" },
  sliderContainer: { marginBottom: 12 },
  image: {
    width: width - 32,
    height: 300,
    borderRadius: 14,
    marginRight: 10,
    backgroundColor: "#dcfce7",
    borderWidth: 1,
    borderColor: "#86efac",
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  metaChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#dcfce7",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  metaText: { color: "#14532d", fontWeight: "700", fontSize: 12, fontFamily: "Poppins" },
});
