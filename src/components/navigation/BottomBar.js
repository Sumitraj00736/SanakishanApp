import React, { useContext, useMemo } from "react";
import { View, TouchableOpacity, Text, StyleSheet, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { ProductContext } from "../../context/ProductProvider";

export default function BottomBar() {
  const { width } = useWindowDimensions();
  const navigation = useNavigation();
  const route = useRoute();
  const { t } = useTranslation();
  const { unreadNotifications } = useContext(ProductContext);
  const isSmall = width < 380;

  const tabs = useMemo(
    () => [
      { name: "Categories", icon: "grid-outline", activeIcon: "grid", label: t("nav.categories") },
      { name: "Search", icon: "search-outline", activeIcon: "search", label: t("nav.search") },
      { name: "Home", icon: "home-outline", activeIcon: "home", label: t("nav.home") },
      { name: "Notifications", icon: "notifications-outline", activeIcon: "notifications", label: "Alerts" },
      { name: "Support", icon: "headset-outline", activeIcon: "headset", label: t("nav.support") },
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
            style={[styles.tab, !isHome && isActive && styles.activeTab, isHome && styles.homeTab]}
            onPress={() => navigation.navigate(tab.name)}
            activeOpacity={0.85}
          >
            {tab.name === "Notifications" && unreadNotifications > 0 && (
              <View style={styles.badgeWrap}>
                <Text style={styles.badgeText}>
                  {unreadNotifications > 99 ? "99+" : unreadNotifications}
                </Text>
              </View>
            )}
            <Ionicons
              name={isActive ? tab.activeIcon : tab.icon}
              size={isHome ? (isSmall ? 26 : 30) : isSmall ? 20 : 22}
              color={isActive ? (isHome ? "white" : "#15803d") : isHome ? "white" : "#64748b"}
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
    bottom: 8,
    left: 12,
    right: 12,
    height: 78,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#dcfce7",
    borderRadius: 24,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 10,
    shadowColor: "#052e16",
    shadowOpacity: 0.16,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 14,
    elevation: 12,
  },
  tab: {
    minWidth: 54,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  activeTab: {
    backgroundColor: "#ecfdf3",
    borderWidth: 1,
    borderColor: "#86efac",
  },
  badgeWrap: {
    position: "absolute",
    top: -8,
    right: 2,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 5,
    backgroundColor: "#15803d",
    borderWidth: 1.5,
    borderColor: "#dcfce7",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 20,
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "800",
    lineHeight: 12,
  },
  homeTab: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#15803d",
    marginTop: -30,
    borderWidth: 3,
    borderColor: "#dcfce7",
    shadowColor: "#0f172a",
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 10,
  },
  label: {
    fontSize: 10,
    marginTop: 2,
    color: "#64748b",
    textAlign: "center",
  },
  activeLabel: {
    color: "#15803d",
    fontWeight: "800",
  },
  homeLabel: {
    color: "white",
    fontWeight: "700",
  },
});
