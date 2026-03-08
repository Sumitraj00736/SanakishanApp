import React, { useContext, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  FlatList,
  View,
  Text,
  Image,
  StyleSheet,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import { ProductContext } from "../../context/ProductProvider";
import ProductSkeleton from "../common/ProductSkeleton";
import { useTranslation } from "react-i18next";

export default function ProductList({ search = "", topPadding = 16 }) {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { products, fetchProducts, loading } = useContext(ProductContext);
  const { width } = useWindowDimensions();

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const numColumns = width < 380 ? 2 : 3;
  const ITEM_MARGIN = 10;
  const HORIZONTAL_PADDING = 16;

  const itemWidth =
    (width - HORIZONTAL_PADDING * 2 - ITEM_MARGIN * (numColumns - 1)) /
    numColumns;

  /* -------------------- SKELETON LOADER -------------------- */
  if (loading) {
    return (
      <FlatList
        scrollEnabled={false}
        data={Array.from({ length: 6 })}
        keyExtractor={(_, index) => index.toString()}
        numColumns={numColumns}
        key={numColumns}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: topPadding, paddingBottom: 16 }}
        columnWrapperStyle={{ marginBottom: 12 }}
        renderItem={({ index }) => <ProductSkeleton index={index} numColumns={numColumns} />}
      />
    );
  }

  if (!filteredProducts.length) {
    return (
      <View style={styles.center}>
        <Text>{t("common.noProducts")}</Text>
      </View>
    );
  }

  /* -------------------- PRODUCT GRID -------------------- */
  return (
    <FlatList
      scrollEnabled={false}
      data={filteredProducts}
      keyExtractor={(item) => item._id}
      numColumns={numColumns}
      key={numColumns}
      contentContainerStyle={{ paddingHorizontal: 16, paddingTop: topPadding, paddingBottom: 16 }}
      columnWrapperStyle={{ marginBottom: 12 }}
      renderItem={({ item, index }) => (
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() =>
            navigation.navigate("ProductScreen", {
              productId: item._id,
            })
          }
          style={[
            styles.card,
            {
              width: itemWidth,
              marginRight:
                index % numColumns !== numColumns - 1 ? ITEM_MARGIN : 0,
            },
          ]}
        >
          <View style={styles.imageWrap}>
            <Image
              source={{ uri: item.images?.[0] || "https://via.placeholder.com/400x400" }}
              style={styles.image}
            />
            <TouchableOpacity style={styles.favoriteBtn} activeOpacity={0.8}>
              <Text style={styles.favoriteText}>♡</Text>
            </TouchableOpacity>
            <View style={styles.dotRow}>
              <View style={[styles.dot, styles.dotActive]} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.priceText}>Rs. {item.basePrice}</Text>
            </View>
            <View style={styles.arrowBtn}>
              <Text style={styles.arrowText}>↗</Text>
            </View>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 6,
    borderWidth: 1,
    borderColor: "#bbf7d0",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  imageWrap: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f1f5f9",
    position: "relative",
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#e5e7eb",
  },
  favoriteBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(20, 83, 45, 0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  favoriteText: {
    color: "#fff",
    fontSize: 14,
    lineHeight: 16,
  },
  dotRow: {
    position: "absolute",
    bottom: 8,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.55)",
  },
  dotActive: {
    backgroundColor: "#ffffff",
  },
  infoRow: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    paddingBottom: 2,
    gap: 6,
  },
  name: {
    fontSize: 12,
    fontWeight: "700",
    color: "#14532d",
    marginBottom: 1,
  },
  priceText: {
    color: "#16a34a",
    fontSize: 14,
    fontWeight: "800",
  },
  arrowBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#f0fdf4",
    borderWidth: 1,
    borderColor: "#bbf7d0",
    alignItems: "center",
    justifyContent: "center",
  },
  arrowText: {
    color: "#14532d",
    fontSize: 15,
    fontWeight: "800",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
});
