import React, { useState, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import Heading from "../components/homeScreen/Heading";
import SearchBar from "../components/homeScreen/SearchBar";
import BottomBar from "../components/navigation/BottomBar";
import ProductList from "../components/homeScreen/ProductList";

export default function SearchScreen() {
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
          paddingTop: 200, // space for header
          paddingBottom: 100, // space for BottomBar
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        <ProductList search={search} />
      </Animated.ScrollView>

      {/* Bottom Bar */}
      <BottomBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerSection: {
    position: "absolute", // IMPORTANT
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "green",
    paddingHorizontal: 16,
    paddingBottom: 16,
    zIndex: 10,
  },
});
