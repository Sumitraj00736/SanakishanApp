// src/components/common/BottomBar.js
import React, { useState, useRef, useEffect } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Animated, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

const tabs = [
  { name: "Categories", icon: "grid-outline" },
  { name: "Search", icon: "search-outline" },
  { name: "Home", icon: "home-outline" }, // center
  { name: "ProductBar", icon: "cube-outline" },
  { name: "Support", icon: "headset-outline" },
];

export default function BottomBar() {
  const navigation = useNavigation();
  const route = useRoute();
  const [activeTab, setActiveTab] = useState(route.name);

  // Animated scales for icons
  const scaleRefs = useRef(tabs.map(() => new Animated.Value(1))).current;

  useEffect(() => {
    tabs.forEach((tab, index) => {
      Animated.spring(scaleRefs[index], {
        toValue: activeTab === tab.name ? (tab.name === "Home" ? 1.5 : 1.3) : 1,
        useNativeDriver: true,
      }).start();
    });
  }, [activeTab]);

  const handlePress = (tabName) => {
    setActiveTab(tabName);
    navigation.navigate(tabName);
  };

  return (
    <View style={styles.container}>
      {tabs.map((tab, index) => {
        const isActive = activeTab === tab.name;

        // Special container for Home with cutout
        if (tab.name === "Home") {
          return (
            <View key={index} style={styles.homeWrapper}>
              <TouchableOpacity
                style={styles.homeTab}
                onPress={() => handlePress(tab.name)}
                activeOpacity={0.8}
              >
                <Animated.View style={{ transform: [{ scale: scaleRefs[index] }] }}>
                  <Ionicons name={tab.icon} size={32} color={isActive ? "green" : "#777"} />
                </Animated.View>
              </TouchableOpacity>
            </View>
          );
        }

        // Normal tabs
        return (
          <TouchableOpacity
            key={index}
            style={styles.tab}
            onPress={() => handlePress(tab.name)}
            activeOpacity={0.8}
          >
            <Animated.View style={{ transform: [{ scale: scaleRefs[index] }] }}>
              <Ionicons name={tab.icon} size={22} color={isActive ? "green" : "#777"} />
            </Animated.View>
            <Text style={[styles.label, isActive && { color: "green" }]}>{tab.name}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 70,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    elevation: 10,
    paddingHorizontal: 10,
    overflow: "visible", // allow cutout
  },
  tab: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  homeWrapper: {
    width: 70,
    height: 70,
    alignItems: "center",
    marginTop: -25,
  },
  homeTab: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  label: {
    fontSize: 12,
    color: "#777",
    marginTop: 3,
  },
});
