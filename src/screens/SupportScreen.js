import React, { useState, useContext, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
  Image,
} from "react-native";

import BottomBar from "../components/navigation/BottomBar";
import { ProductContext } from "../context/ProductProvider";
import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const KISHAN_HELP_POSTER =
  "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1200&q=80";

export default function SupportScreen() {
  const { height } = useWindowDimensions();
  const { t } = useTranslation();
  const { createSupportTicket, setGuestPhone } = useContext(ProductContext);
  const slideAnim = useRef(new Animated.Value(520)).current;
  const fieldAnims = useRef(Array.from({ length: 5 }, () => new Animated.Value(0))).current;

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 320,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    Animated.stagger(
      80,
      fieldAnims.map((anim) =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 250,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        })
      )
    ).start();
  }, [fieldAnims, slideAnim]);

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async () => {
    const {name, phone, email, message } = form;

    // ✅ Validation
   switch (true) {
    case !name:
      Toast.show({ type: "error", text1: t("common.error"), text2: t("support.nameRequired") });
      return;
    case !phone:
      Toast.show({ type: "error", text1: t("common.error"), text2: t("support.phoneRequired") });
      return;
    case phone.length < 10:
      Toast.show({ type: "error", text1: t("common.error"), text2: t("support.phoneInvalid") });
      return;
    default:
      break;
   }
  //  (!name ) {
  //     Alert.alert("Error", "All fields are required");
  //     return;
  //   }


    setLoading(true);

    const payload = {
      // bookingId,
      name,
      phone,
      email,
      adminMessage: "",
      message,
    };

    await setGuestPhone(phone);
    const response = await createSupportTicket(payload);

    setLoading(false);

    if (!response.success) {
      Toast.show({ type: "error", text1: t("common.error"), text2: response.message });
      return;
    }

    Toast.show({ type: "success", text1: t("common.success"), text2: t("support.success") });

    // ✅ Clear form
    setForm({
      // bookingId: "",
      name: "",
      phone: "",
      email: "",
      message: "",
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.topArea}>
        <View style={styles.helpGifOutline}>
          <Image source={{ uri: KISHAN_HELP_POSTER }} style={styles.helpGif} resizeMode="cover" />
          <View style={styles.helpGifOverlay}>
            <MaterialCommunityIcons name="leaf-circle-outline" size={18} color="#16a34a" />
            <Text style={styles.helpGifText}>We are here to support you</Text>
          </View>
        </View>
        <Text style={[styles.topTitle, { fontSize: height < 700 ? 20 : 24 }]}>{t("support.title")}</Text>
        <Text style={styles.topSubTitle}>{t("support.subtitle")}</Text>
      </View>

      <Animated.View style={[styles.sheetWrap, { transform: [{ translateY: slideAnim }], marginTop: height < 700 ? 4 : 8 }]}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.sheetInner}>
          <View style={styles.dragHandle} />
          <View style={styles.iconCircle}>
            <Text style={styles.iconGlyph}>?</Text>
          </View>
          <Text style={[styles.sheetTitle, { fontSize: height < 700 ? 24 : 30 }]}>{t("support.title")}</Text>
          <Text style={styles.sheetSubTitle}>{t("support.subtitle")}</Text>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.form}>
            <Animated.View style={[styles.inputCard, { opacity: fieldAnims[0], transform: [{ translateY: fieldAnims[0].interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }] }]}>
              <View style={styles.inputIconWrap}>
                <MaterialCommunityIcons name="account-outline" size={18} color="#166534" />
              </View>
              <TextInput
                style={styles.input}
                placeholder={t("support.fullName")}
                placeholderTextColor="#6b7280"
                value={form.name}
                onChangeText={(text) => handleChange("name", text)}
              />
            </Animated.View>

            <Animated.View style={[styles.inputCard, { opacity: fieldAnims[1], transform: [{ translateY: fieldAnims[1].interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }] }]}>
              <View style={styles.inputIconWrap}>
                <MaterialCommunityIcons name="phone-outline" size={18} color="#166534" />
              </View>
              <TextInput
                style={styles.input}
                placeholder={t("support.phone")}
                placeholderTextColor="#6b7280"
                keyboardType="phone-pad"
                value={form.phone}
                onChangeText={(text) => handleChange("phone", text)}
              />
            </Animated.View>

            <Animated.View style={[styles.inputCard, { opacity: fieldAnims[2], transform: [{ translateY: fieldAnims[2].interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }] }]}>
              <View style={styles.inputIconWrap}>
                <MaterialCommunityIcons name="email-outline" size={18} color="#166534" />
              </View>
              <TextInput
                style={styles.input}
                placeholder={t("support.email")}
                placeholderTextColor="#6b7280"
                keyboardType="email-address"
                autoCapitalize="none"
                value={form.email}
                onChangeText={(text) => handleChange("email", text)}
              />
            </Animated.View>

            <Animated.View style={[styles.inputCard, styles.messageCard, { opacity: fieldAnims[3], transform: [{ translateY: fieldAnims[3].interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }] }]}>
              <View style={styles.inputIconWrap}>
                <MaterialCommunityIcons name="message-text-outline" size={18} color="#166534" />
              </View>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder={t("support.message")}
                placeholderTextColor="#6b7280"
                multiline
                numberOfLines={4}
                value={form.message}
                onChangeText={(text) => handleChange("message", text)}
              />
            </Animated.View>

            <Animated.View style={{ opacity: fieldAnims[4], transform: [{ translateY: fieldAnims[4].interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }] }}>
              <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <View style={styles.buttonInner}>
                    <MaterialCommunityIcons name="send-outline" size={18} color="#fff" />
                    <Text style={styles.buttonText}>{t("support.submit")}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Animated.View>

      <BottomBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#052e16",
  },
  topArea: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: "#052e16",
  },
  helpGifOutline: {
    width: "100%",
    height: 120,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#22c55e",
    overflow: "hidden",
    marginBottom: 12,
    backgroundColor: "#14532d",
  },
  helpGif: {
    width: "100%",
    height: "100%",
    opacity: 0.82,
  },
  helpGifOverlay: {
    position: "absolute",
    bottom: 8,
    left: 8,
    right: 8,
    borderRadius: 12,
    backgroundColor: "rgba(5,46,22,0.75)",
    borderWidth: 1,
    borderColor: "#22c55e",
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  helpGifText: {
    color: "#dcfce7",
    fontWeight: "700",
    fontFamily: "Poppins",
    fontSize: 13,
  },
  topTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
    fontFamily: "Poppins",
  },
  topSubTitle: {
    marginTop: 8,
    color: "#bbf7d0",
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Poppins",
  },
  sheetWrap: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "hidden",
  },
  sheetInner: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 86,
  },
  dragHandle: {
    width: 56,
    height: 5,
    borderRadius: 10,
    backgroundColor: "#d1d5db",
    alignSelf: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  iconCircle: {
    alignSelf: "center",
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: "#dcfce7",
    alignItems: "center",
    justifyContent: "center",
  },
  iconGlyph: {
    color: "#16a34a",
    fontWeight: "900",
    fontSize: 34,
  },
  sheetTitle: {
    marginTop: 14,
    textAlign: "center",
    color: "#111827",
    fontSize: 30,
    fontWeight: "800",
    fontFamily: "Poppins",
  },
  sheetSubTitle: {
    marginTop: 8,
    textAlign: "center",
    color: "#4b5563",
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Poppins",
    paddingHorizontal: 8,
  },
  form: {
    paddingTop: 18,
    paddingBottom: 20,
  },
  inputCard: {
    borderWidth: 1,
    borderColor: "#d1fae5",
    borderRadius: 14,
    backgroundColor: "#f9fafb",
    paddingHorizontal: 10,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  messageCard: {
    alignItems: "flex-start",
    paddingTop: 10,
  },
  inputIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#dcfce7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    marginTop: 2,
  },
  input: {
    flex: 1,
    backgroundColor: "transparent",
    paddingVertical: 13,
    fontSize: 16,
    fontFamily: "Poppins",
    color: "#14532d",
  },
  textArea: {
    height: 108,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#15803d",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 6,
  },
  buttonInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    fontFamily: "Poppins",
  },
});
