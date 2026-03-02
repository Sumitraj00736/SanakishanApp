import React, { useMemo } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

export default function BottomBar() {
  const navigation = useNavigation();
  const route = useRoute();
  const { t } = useTranslation();

  const tabs = useMemo(
    () => [
      { name: "Categories", icon: "grid-outline", label: t("nav.categories") },
      { name: "Search", icon: "search-outline", label: t("nav.search") },
      { name: "Home", icon: "home-outline", label: t("nav.home") },
      { name: "Notifications", icon: "notifications-outline", label: "Alerts" },
      { name: "Support", icon: "headset-outline", label: t("nav.support") },
    ],
    [t]
  );

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = route.name === tab.name;
        const isHome = tab.name === "Home";
        return (
          <TouchableOpacity
            key={tab.name}
            style={[styles.tab, isHome && styles.homeTab]}
            onPress={() => navigation.navigate(tab.name)}
            activeOpacity={0.85}
          >
            <Ionicons
              name={tab.icon}
              size={isHome ? 30 : 22}
              color={isActive ? (isHome ? "white" : "#0f766e") : isHome ? "white" : "#64748b"}
            />
            <Text style={[styles.label, isActive && styles.activeLabel, isHome && styles.homeLabel]}>
              {tab.label}
            </Text>
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
    height: 78,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  tab: {
    minWidth: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  homeTab: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#0f766e",
    marginTop: -28,
    shadowColor: "#0f172a",
    shadowOpacity: 0.28,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 8,
    elevation: 8,
  },
  label: {
    fontSize: 10,
    marginTop: 2,
    color: "#64748b",
    textAlign: "center",
  },
  activeLabel: {
    color: "#0f766e",
    fontWeight: "700",
  },
  homeLabel: {
    color: "white",
    fontWeight: "700",
  },
});
