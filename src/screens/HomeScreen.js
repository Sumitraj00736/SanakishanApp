import React, { useState, useContext, useRef } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from "react-native";

import Heading from "../components/homeScreen/Heading";
import Slider from "../components/homeScreen/Slider";
import SearchBar from "../components/homeScreen/SearchBar";
import Category from "../components/homeScreen/Category";
import ProductGrid from "../components/homeScreen/ProductList";
import BottomBar from "../components/navigation/BottomBar";
import { AuthContext } from "../context/AuthProvider";
import { MaterialIcons } from "@expo/vector-icons";


const SLIDER_HEIGHT = 200;
const CATEGORY_HEIGHT = 150;

export default function HomeScreen() {
  const [search, setSearch] = useState("");
  const [memberModalVisible, setMemberModalVisible] = useState(false);
  const [memberId, setMemberId] = useState("");

  const { login } = useContext(AuthContext);

  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollClamped = Animated.diffClamp(scrollY, 0, SLIDER_HEIGHT);

  const sliderTranslateY = scrollClamped.interpolate({
    inputRange: [0, SLIDER_HEIGHT],
    outputRange: [0, -SLIDER_HEIGHT],
  });

  const stickyCategoryOpacity = scrollClamped.interpolate({
    inputRange: [SLIDER_HEIGHT - 20, SLIDER_HEIGHT],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const handleMemberSave = async () => {
    if (!memberId) return alert("Please enter Member ID");

    const res = await login(memberId);
    if (res?.success) {
      alert("Login successful!");
      setMemberModalVisible(false);
    } else {
      alert(res?.message || "Login failed");
    }
  };

  return (
    <View style={styles.container}>
      {/* FIXED HEADER */}
      <View style={styles.fixedHeader}>
        <Heading onMemberPress={() => setMemberModalVisible(true)} />
        <SearchBar search={search} setSearch={setSearch} />
      </View>

      {/* STICKY CATEGORY (appears after slider collapses) */}
      <Animated.View
        style={[styles.stickyCategory, { opacity: stickyCategoryOpacity }]}
        pointerEvents="box-none"
      >
        <Category />
      </Animated.View>

      {/* SCROLL CONTENT */}
      <Animated.ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: SLIDER_HEIGHT + CATEGORY_HEIGHT, 
          paddingBottom: 120,
          backgroundColor: "green",
        }}
        scrollEventThrottle={30}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      >
        {/* SLIDER + SCROLLABLE CATEGORY */}
        <Animated.View
          style={[
            styles.sliderWrapper,
            { transform: [{ translateY: sliderTranslateY }] },
          ]}
        >
          <Slider />
          <Category />
        </Animated.View>

        {/* PRODUCTS */}
        <View style={{ zIndex: 0 }}>
          <Text style={styles.productsLabel}>Products</Text>
          <ProductGrid search={search} />
        </View>
      </Animated.ScrollView>

      {/* MODAL */}
      <Modal visible={memberModalVisible} transparent animationType="fade">
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.modalContainer}>
            {/* Close (Cross) Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setMemberModalVisible(false)}
            >
              <MaterialIcons name="close" size={22} color="#333" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Enter Member ID</Text>

            <TextInput
              style={styles.memberInput}
              value={memberId}
              onChangeText={setMemberId}
              placeholder="Member ID"
            />

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleMemberSave}
            >
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
  container: { flex: 1 },

  fixedHeader: {
    backgroundColor: "green",
    paddingTop: 16,
    paddingHorizontal: 16,
    zIndex: 100,
  },

  sliderWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "green",
    zIndex: 1,
    paddingHorizontal: 16,
  },

  stickyCategory: {
    position: "absolute",
    top: 80, // below header
    left: 0,
    right: 0,
    height: CATEGORY_HEIGHT,
    backgroundColor: "green",
    zIndex: 2,
    paddingHorizontal: 16,
  },

  productsLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 16,
    marginTop: 16,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  modalContainer: {
    backgroundColor: "#fff",
    margin: 20,
    padding: 16,
    borderRadius: 10,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },

  memberInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },

  saveButton: {
    backgroundColor: "green",
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
