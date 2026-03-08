import React, { useState, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import Heading from "../components/homeScreen/Heading";
import SearchBar from "../components/homeScreen/SearchBar";
import BottomBar from "../components/navigation/BottomBar";
import ProductGrid from "../components/homeScreen/ProductList";

export default function ProductBar() {
  const [search, setSearch] = useState("");
  const scrollY = useRef(new Animated.Value(0)).current;

  // Header animation (slide up)
  const headerTranslate = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -100],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.container}>
      {/* Animated Header */}
      <Animated.View
        style={[
          styles.headerSection,
          { transform: [{ translateY: headerTranslate }] },
        ]}
      >
        <Heading />
        <SearchBar search={search} setSearch={setSearch} />
      </Animated.View>

      {/* Animated Scroll */}
      <Animated.ScrollView
        contentContainerStyle={{
          paddingTop: 200,   // header space
          paddingBottom: 100 // BottomBar space
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        <ProductGrid search={search} />
      </Animated.ScrollView>

      {/* Bottom Navigation Bar */}
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
    position: "absolute", // REQUIRED
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#052e16",
    paddingHorizontal: 16,
    paddingBottom: 16,
    zIndex: 10,
  },
});
