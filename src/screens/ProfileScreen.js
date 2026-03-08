import React, { useContext, useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import BottomBar from "../components/navigation/BottomBar";
import LanguageModal from "../components/common/LanguageModal";
import { AuthContext } from "../context/AuthProvider";

function InfoRow({ icon, label, value }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIconWrap}>
        <MaterialCommunityIcons name={icon} size={18} color="#166534" />
      </View>
      <View style={styles.infoTextWrap}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value || "-"}</Text>
      </View>
    </View>
  );
}

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { user, logout, language, setLanguage } = useContext(AuthContext);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const handleLanguage = async (nextLanguage) => {
    await setLanguage(nextLanguage);
    setShowLanguageModal(false);
  };

  const validityText = useMemo(() => {
    if (!user?.validUntil) return "-";
    try {
      return new Date(user.validUntil).toLocaleDateString();
    } catch {
      return "-";
    }
  }, [user?.validUntil]);

  const profileInitial = useMemo(() => {
    const seed = user?.name || user?.memberId || "G";
    return String(seed).trim().charAt(0).toUpperCase();
  }, [user?.name, user?.memberId]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{profileInitial}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.heading}>{t("profile.title")}</Text>
              <Text style={styles.subHeading}>{t("profile.subtitle")}</Text>
            </View>
            <MaterialCommunityIcons name="shield-check-outline" size={26} color="#dcfce7" />
          </View>

          <View style={styles.heroMetaRow}>
            <View style={styles.heroMetaPill}>
              <MaterialCommunityIcons name="account-check-outline" size={15} color="#14532d" />
              <Text style={styles.heroMetaText}>{user ? "Member" : "Guest"}</Text>
            </View>
            <View style={styles.heroMetaPill}>
              <MaterialCommunityIcons name="translate" size={15} color="#14532d" />
              <Text style={styles.heroMetaText}>{language === "ne" ? "नेपाली" : "English"}</Text>
            </View>
          </View>
        </View>

        <View style={styles.detailCard}>
          {user ? (
            <>
              <InfoRow icon="card-account-details-outline" label={t("profile.memberId")} value={user.memberId} />
              <InfoRow icon="account-outline" label={t("profile.name")} value={user.name} />
              <InfoRow icon="phone-outline" label={t("profile.phone")} value={user.phone} />
              <InfoRow icon="email-outline" label={t("profile.email")} value={user.email} />
              <InfoRow icon="brightness-percent" label={t("profile.discount")} value={`${user.discountPercent || 0}%`} />
              <InfoRow icon="calendar-check-outline" label={t("profile.validUntil")} value={validityText} />
            </>
          ) : (
            <View style={styles.guestWrap}>
              <MaterialCommunityIcons name="account-question-outline" size={26} color="#166534" />
              <Text style={styles.guestText}>{t("profile.notLoggedIn")}</Text>
            </View>
          )}
        </View>

        <View style={styles.actionsCard}>
          <TouchableOpacity style={styles.secondaryBtn} onPress={() => setShowLanguageModal(true)}>
            <View style={styles.actionIconWrap}>
              <MaterialCommunityIcons name="translate" size={18} color="#166534" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.actionTitle}>{t("profile.language")}</Text>
              <Text style={styles.actionSub}>{language === "ne" ? "नेपाली" : "English"}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={22} color="#15803d" />
          </TouchableOpacity>

          {user && (
            <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
              <MaterialCommunityIcons name="logout" size={18} color="#fff" />
              <Text style={styles.logoutText}>{t("profile.logout")}</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <LanguageModal visible={showLanguageModal} onSelect={handleLanguage} />
      <BottomBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#052e16" },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 28,
    paddingBottom: 120,
    gap: 14,
  },
  heroCard: {
    backgroundColor: "#14532d",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#166534",
    padding: 16,
  },
  heroTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  avatarCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#dcfce7",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#86efac",
  },
  avatarText: {
    color: "#14532d",
    fontWeight: "800",
    fontSize: 22,
    fontFamily: "Poppins",
  },
  heading: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "800",
    fontFamily: "Poppins",
  },
  subHeading: {
    color: "#dcfce7",
    fontSize: 13,
    marginTop: 4,
    fontFamily: "Poppins",
  },
  heroMetaRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  heroMetaPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#bbf7d0",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  heroMetaText: {
    color: "#14532d",
    fontWeight: "700",
    fontSize: 12,
    fontFamily: "Poppins",
  },
  detailCard: {
    backgroundColor: "#f0fdf4",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#86efac",
    padding: 14,
    gap: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#dcfce7",
  },
  infoIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#dcfce7",
    alignItems: "center",
    justifyContent: "center",
  },
  infoTextWrap: { flex: 1 },
  infoLabel: {
    color: "#166534",
    fontWeight: "600",
    fontSize: 12,
    fontFamily: "Poppins",
  },
  infoValue: {
    color: "#14532d",
    fontWeight: "800",
    fontSize: 14,
    marginTop: 1,
    fontFamily: "Poppins",
  },
  guestWrap: {
    paddingVertical: 14,
    alignItems: "center",
    gap: 8,
  },
  guestText: {
    color: "#166534",
    fontWeight: "700",
    textAlign: "center",
    fontFamily: "Poppins",
  },
  actionsCard: {
    backgroundColor: "#f0fdf4",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#86efac",
    padding: 12,
    gap: 10,
  },
  secondaryBtn: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#bbf7d0",
    paddingVertical: 12,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  actionIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#dcfce7",
    alignItems: "center",
    justifyContent: "center",
  },
  actionTitle: {
    color: "#14532d",
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "Poppins",
  },
  actionSub: {
    color: "#166534",
    fontSize: 12,
    marginTop: 2,
    fontFamily: "Poppins",
  },
  logoutBtn: {
    backgroundColor: "#15803d",
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  logoutText: {
    color: "white",
    fontWeight: "800",
    fontSize: 15,
    fontFamily: "Poppins",
  },
});
