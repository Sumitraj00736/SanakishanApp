import React, { useContext, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { AuthContext } from "../context/AuthProvider";
import Toast from "react-native-toast-message";
import { useTranslation } from "react-i18next";

export default function AuthGateScreen({ onGuestContinue }) {
  const { height } = useWindowDimensions();
  const { login, language, setLanguage } = useContext(AuthContext);
  const { t } = useTranslation();
  const [memberId, setMemberId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleMemberLogin = async () => {
    if (!memberId.trim()) {
      Toast.show({ type: "error", text1: t("common.error"), text2: t("auth.enterMemberId") });
      return;
    }
    setLoading(true);
    const res = await login(memberId.trim());
    setLoading(false);
    if (!res?.success) {
      Toast.show({
        type: "error",
        text1: t("auth.loginFailed"),
        text2: res?.message || t("auth.invalidMemberId"),
      });
      return;
    }
    Toast.show({ type: "success", text1: t("common.success"), text2: t("authGate.memberLoginSuccess") });
  };

  return (
    <View style={styles.container}>
      <View style={[styles.heroTop, { paddingTop: height < 700 ? 66 : 100 }]}>
        <View style={styles.langToggleWrap}>
          <TouchableOpacity
            style={[styles.langBtn, language === "en" && styles.langBtnActive]}
            onPress={() => setLanguage("en")}
          >
            <Text style={[styles.langBtnText, language === "en" && styles.langBtnTextActive]}>EN</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.langBtn, language === "ne" && styles.langBtnActive]}
            onPress={() => setLanguage("ne")}
          >
            <Text style={[styles.langBtnText, language === "ne" && styles.langBtnTextActive]}>ने</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.heroTitle}>{t("authGate.title")}</Text>
        <Text style={styles.heroSub}>{t("authGate.subtitle")}</Text>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.sheet}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.sheetContent}>
        <View style={styles.tabWrap}>
          <View style={styles.tabActive}>
            <Text style={styles.tabActiveText}>{t("authGate.loginTab")}</Text>
          </View>
          <View style={styles.tabInactive}>
            <Text style={styles.tabInactiveText}>{t("authGate.guestTab")}</Text>
          </View>
        </View>

        <View style={styles.inputCard}>
          <Text style={styles.inputLabel}>{t("auth.memberId")}</Text>
          <TextInput
            value={memberId}
            onChangeText={setMemberId}
            placeholder={t("authGate.memberIdPlaceholder")}
            autoCapitalize="none"
            style={styles.input}
          />
        </View>

        <TouchableOpacity style={styles.primaryBtn} onPress={handleMemberLogin} disabled={loading}>
          <Text style={styles.primaryBtnText}>{loading ? t("authGate.wait") : t("authGate.loginTab")}</Text>
        </TouchableOpacity>

        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>{t("authGate.or")}</Text>
          <View style={styles.divider} />
        </View>

        <TouchableOpacity style={styles.guestBtn} onPress={onGuestContinue}>
          <Text style={styles.guestBtnText}>{t("authGate.continueAsGuest")}</Text>
        </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#052e16" },
  heroTop: { paddingTop: 100, paddingHorizontal: 24, paddingBottom: 26 },
  langToggleWrap: {
    flexDirection: "row",
    alignSelf: "flex-end",
    backgroundColor: "rgba(187,247,208,0.22)",
    borderRadius: 20,
    padding: 3,
    marginBottom: 18,
  },
  langBtn: {
    minWidth: 42,
    borderRadius: 16,
    paddingVertical: 6,
    alignItems: "center",
  },
  langBtnActive: {
    backgroundColor: "#16a34a",
  },
  langBtnText: {
    color: "#dcfce7",
    fontWeight: "700",
    fontFamily: "Poppins",
  },
  langBtnTextActive: {
    color: "white",
  },
  heroTitle: {
    color: "white",
    fontSize: 36,
    lineHeight: 42,
    fontWeight: "800",
    fontFamily: "Poppins",
    marginBottom: 10,
  },
  heroSub: { color: "#bbf7d0", fontSize: 18, fontFamily: "Poppins" },
  sheet: {
    flex: 1,
    backgroundColor: "white",
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
    paddingHorizontal: 20,
    paddingTop: 14,
  },
  sheetContent: {
    paddingBottom: 20,
  },
  tabWrap: { flexDirection: "row", backgroundColor: "#ecfdf5", borderRadius: 30, padding: 5, marginBottom: 18 },
  tabActive: { flex: 1, backgroundColor: "white", borderRadius: 24, paddingVertical: 11, alignItems: "center" },
  tabInactive: { flex: 1, paddingVertical: 11, alignItems: "center" },
  tabActiveText: { color: "#14532d", fontWeight: "700", fontFamily: "Poppins" },
  tabInactiveText: { color: "#16a34a", fontWeight: "700", fontFamily: "Poppins" },
  inputCard: {
    borderWidth: 1,
    borderColor: "#bbf7d0",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
    backgroundColor: "#f9fffb",
  },
  inputLabel: { color: "#16a34a", fontSize: 13, marginBottom: 6, fontFamily: "Poppins" },
  input: { fontSize: 18, color: "#14532d", fontWeight: "700", fontFamily: "Poppins" },
  primaryBtn: { backgroundColor: "#15803d", borderRadius: 30, paddingVertical: 14, alignItems: "center", marginTop: 4 },
  primaryBtnText: { color: "white", fontWeight: "800", fontSize: 17, fontFamily: "Poppins" },
  dividerRow: { flexDirection: "row", alignItems: "center", marginVertical: 18 },
  divider: { flex: 1, height: 1, backgroundColor: "#dcfce7" },
  dividerText: { marginHorizontal: 12, color: "#16a34a", fontFamily: "Poppins" },
  guestBtn: {
    borderWidth: 1,
    borderColor: "#86efac",
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "#f0fdf4",
  },
  guestBtnText: { color: "#14532d", fontWeight: "700", fontSize: 16, fontFamily: "Poppins" },
});
