// src/screens/HomeScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import Heading from "../components/homeScreen/Heading";
import Slider from "../components/homeScreen/Slider";
import SearchBar from "../components/homeScreen/SearchBar";
import Category from "../components/homeScreen/Category";
import ProductGrid from "../components/homeScreen/ProductList";
import BottomBar from "../components/navigation/BottomBar";

export default function HomeScreen() {
  const [search, setSearch] = useState("");
  const [memberModalVisible, setMemberModalVisible] = useState(false);
  const [memberId, setMemberId] = useState("");

  const handleMemberSave = () => {
    if (!memberId) {
      alert("Please enter Member ID");
      return;
    }
    console.log("Member ID:", memberId);
    setMemberModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Top Section */}
      <View style={styles.topSection}>
        <Heading onMemberPress={() => setMemberModalVisible(true)} hasMemberId={!!memberId} />
        <Slider />
        <SearchBar search={search} setSearch={setSearch} />
        <Category />
      </View>

      {/* Products */}
      <Text style={styles.productsLabel}>Products</Text>
      <ProductGrid search={search} />

      {/* Member ID Modal */}
      <Modal
        visible={memberModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMemberModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Enter Member ID</Text>
              <TouchableOpacity onPress={() => setMemberModalVisible(false)}>
                <Text style={styles.closeButton}>X</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.memberInput}
              placeholder="Member ID"
              value={memberId}
              onChangeText={setMemberId}
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleMemberSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
      <BottomBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  topSection: { backgroundColor: "green", padding: 16, paddingBottom: 24 },
  productsLabel: { fontSize: 18, fontWeight: "bold", color: "black", marginLeft: 16, marginTop: 16 },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalContainer: { width: "80%", backgroundColor: "white", borderRadius: 10, padding: 16 },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  modalTitle: { fontSize: 18, fontWeight: "bold" },
  closeButton: { fontSize: 18, fontWeight: "bold", color: "red" },
  memberInput: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, marginBottom: 16 },

  saveButton: { backgroundColor: "green", paddingVertical: 12, borderRadius: 8, alignItems: "center" },
  saveButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
