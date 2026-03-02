import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import BottomBar from "../components/navigation/BottomBar";
import LanguageModal from "../components/common/LanguageModal";
import { AuthContext } from "../context/AuthProvider";

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { user, logout, language, setLanguage } = useContext(AuthContext);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const handleLanguage = async (nextLanguage) => {
    await setLanguage(nextLanguage);
    setShowLanguageModal(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>{t("profile.title")}</Text>
        <Text style={styles.subHeading}>{t("profile.subtitle")}</Text>
      </View>

      {user ? (
        <View style={styles.card}>
          <Text style={styles.item}>
            {t("profile.memberId")}: <Text style={styles.value}>{user.memberId}</Text>
          </Text>
          <Text style={styles.item}>
            {t("profile.name")}: <Text style={styles.value}>{user.name}</Text>
          </Text>
          <Text style={styles.item}>
            {t("profile.phone")}: <Text style={styles.value}>{user.phone || "-"}</Text>
          </Text>
          <Text style={styles.item}>
            {t("profile.email")}: <Text style={styles.value}>{user.email || "-"}</Text>
          </Text>
          <Text style={styles.item}>
            {t("profile.discount")}: <Text style={styles.value}>{user.discountPercent || 0}%</Text>
          </Text>
          <Text style={styles.item}>
            {t("profile.validUntil")}: <Text style={styles.value}>{user.validUntil ? new Date(user.validUntil).toLocaleDateString() : "-"}</Text>
          </Text>
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.item}>{t("profile.notLoggedIn")}</Text>
        </View>
      )}

      <View style={styles.actions}>
        <TouchableOpacity style={styles.secondaryBtn} onPress={() => setShowLanguageModal(true)}>
          <Text style={styles.secondaryText}>{t("profile.language")}: {language === "ne" ? "नेपाली" : "English"}</Text>
        </TouchableOpacity>
        {user && (
          <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
            <Text style={styles.logoutText}>{t("profile.logout")}</Text>
          </TouchableOpacity>
        )}
      </View>

      <LanguageModal visible={showLanguageModal} onSelect={handleLanguage} />
      <BottomBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc", padding: 16 },
  header: {
    backgroundColor: "#0f766e",
    borderRadius: 16,
    padding: 20,
    marginTop: 30,
    marginBottom: 16,
  },
  heading: { color: "white", fontSize: 24, fontWeight: "700" },
  subHeading: { color: "#ccfbf1", fontSize: 14, marginTop: 6 },
  card: { backgroundColor: "white", borderRadius: 12, padding: 16, elevation: 2 },
  item: { color: "#334155", marginBottom: 10, fontSize: 15 },
  value: { fontWeight: "700", color: "#0f172a" },
  actions: { marginTop: 16, gap: 10 },
  secondaryBtn: {
    backgroundColor: "#e2e8f0",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  secondaryText: { color: "#0f172a", fontWeight: "600" },
  logoutBtn: { backgroundColor: "#dc2626", borderRadius: 10, paddingVertical: 12, alignItems: "center" },
  logoutText: { color: "white", fontWeight: "700" },
});
