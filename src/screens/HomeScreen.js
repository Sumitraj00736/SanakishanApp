import React, { useState, useContext } from "react";
import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Heading from "../components/homeScreen/Heading";
import Slider from "../components/homeScreen/Slider";
import SearchBar from "../components/homeScreen/SearchBar";
import Category from "../components/homeScreen/Category";
import ProductGrid from "../components/homeScreen/ProductList";
import BottomBar from "../components/navigation/BottomBar";
import { AuthContext } from "../context/AuthProvider";
import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";

export default function HomeScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [memberModalVisible, setMemberModalVisible] = useState(false);
  const [memberId, setMemberId] = useState("");

  const { login } = useContext(AuthContext);

  const horizontalPad = 16;
  const headerTopPad = 12;
  const categoryTopGap = 10;
  const productsTitleTop = 12;
  const productsTopPadding = 12;
  const contentMaxWidth = 760;

  const handleMemberSave = async () => {
    if (!memberId) {
      Toast.show({ type: "error", text1: t("common.error"), text2: t("auth.enterMemberId") });
      return;
    }

    const res = await login(memberId);
    if (res?.success) {
      Toast.show({ type: "success", text1: t("common.success"), text2: t("auth.loginSuccess") });
      setMemberModalVisible(false);
    } else {
      Toast.show({ type: "error", text1: t("common.error"), text2: res?.message || t("auth.loginFailed") });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* FIXED HEADER */}
      <View
        style={[
          styles.fixedHeader,
          {
            paddingTop: headerTopPad,
            paddingHorizontal: horizontalPad,
            maxWidth: contentMaxWidth,
            alignSelf: "center",
            width: "100%",
          },
        ]}
      >
        <Heading
          onMemberPress={() => setMemberModalVisible(true)}
          onProfilePress={() => navigation.navigate("Profile")}
        />
        <SearchBar search={search} setSearch={setSearch} />
      </View>

      <ScrollView
        style={styles.scrollRoot}
        contentContainerStyle={{
          paddingBottom: 118,
          backgroundColor: "#052e16",
        }}
      >
        <View
          style={[
            styles.sliderSection,
            { paddingHorizontal: horizontalPad, maxWidth: contentMaxWidth, alignSelf: "center", width: "100%" },
          ]}
        >
          <Slider />
          <Category containerStyle={{ marginTop: categoryTopGap }} />
        </View>

        {/* PRODUCTS */}
        <View style={{ marginTop: productsTitleTop, alignSelf: "center", width: "100%", maxWidth: contentMaxWidth }}>
          <View style={[styles.productsHeaderRow, { paddingHorizontal: horizontalPad }]}>
            <View style={styles.productsIconBubble}>
              <MaterialCommunityIcons name="package-variant-closed" size={15} color="#14532d" />
            </View>
            <Text style={[styles.productsLabel, { fontSize: 18 }]}>{t("common.products")}</Text>
          </View>
          <ProductGrid search={search} topPadding={productsTopPadding} />
        </View>
      </ScrollView>

      {/* MODAL */}
      <Modal visible={memberModalVisible} transparent animationType="fade">
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={[styles.modalContainer, { width: "90%", maxWidth: 420 }]}>
            {/* Close (Cross) Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setMemberModalVisible(false)}
            >
              <MaterialIcons name="close" size={22} color="#333" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>{t("auth.enterMemberId")}</Text>

            <TextInput
              style={styles.memberInput}
              value={memberId}
              onChangeText={setMemberId}
              placeholder={t("auth.memberId")}
            />

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleMemberSave}
            >
              <Text style={styles.saveButtonText}>{t("common.save")}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <BottomBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#052e16" },

  fixedHeader: {
    backgroundColor: "#052e16",
    zIndex: 100,
  },

  scrollRoot: {
    flex: 1,
  },
  sliderSection: {
    backgroundColor: "#052e16",
    paddingTop: 10,
  },
  productsHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  productsIconBubble: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#bbf7d0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },

  productsLabel: {
    fontWeight: "800",
    color: "#fff",
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  modalContainer: {
    backgroundColor: "#f0fdf4",
    alignSelf: "center",
    padding: 16,
    borderRadius: 10,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#14532d",
  },

  memberInput: {
    borderWidth: 1,
    borderColor: "#86efac",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    backgroundColor: "#ffffff",
  },

  saveButton: {
    backgroundColor: "#15803d",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  closeButton: {
  position: "absolute",
  top: 10,
  right: 10,
  zIndex: 10,
  padding: 4,
},

});
