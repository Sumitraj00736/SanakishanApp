import React, { useRef, useEffect } from "react";
import { View, StyleSheet, Animated, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const numColumns = 3;
const ITEM_MARGIN = 10;
const HORIZONTAL_PADDING = 16;
const itemWidth =
  (width - HORIZONTAL_PADDING * 2 - ITEM_MARGIN * (numColumns - 1)) /
  numColumns;

export default function ProductSkeleton({ index }) {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-itemWidth, itemWidth],
  });

  return (
    <View
      style={[
        styles.card,
        {
          width: itemWidth,
          marginRight: index % numColumns !== numColumns - 1 ? ITEM_MARGIN : 0,
        },
      ]}
    >
      <View style={styles.image} />
      <View style={styles.name} />
      <View style={styles.price} />

      <Animated.View
        style={[
          styles.shimmer,
          {
            transform: [{ translateX }],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#e6e6e6",
    borderRadius: 12,
    padding: 10,
    overflow: "hidden",
  },

  image: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: "#d0d0d0",
    marginBottom: 10,
  },

  name: {
    height: 12,
    width: "70%",
    backgroundColor: "#d0d0d0",
    borderRadius: 6,
    alignSelf: "center",
    marginBottom: 8,
  },

  price: {
    height: 18,
    width: "40%",
    backgroundColor: "#d0d0d0",
    borderRadius: 10,
    alignSelf: "center",
  },

  shimmer: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "50%",
    backgroundColor: "rgba(255,255,255,0.45)",
  },
});
