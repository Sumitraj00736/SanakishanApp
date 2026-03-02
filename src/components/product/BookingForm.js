import React, { useState, useRef, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { ProductContext } from "../../context/ProductProvider";
import { AuthContext } from "../../context/AuthProvider";
import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message";


export default function BookingForm() {
  const { t } = useTranslation();
  const { productDetail, bookProduct, setGuestPhone } = useContext(ProductContext);
  const { user } = useContext(AuthContext);
  

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [email, setEmail] = useState(user?.email || "");
  const [quantity, setQuantity] = useState("1");
  const [startDateTime, setStartDateTime] = useState(new Date());
  const [endDateTime, setEndDateTime] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const isUnavailable =
    productDetail?.status === "booked" || Number(productDetail?.reservedUnits || 0) <= 0;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleBooking = async () => {
    if (!name || !phone || !quantity) {
      Toast.show({ type: "error", text1: t("common.error"), text2: t("booking.requiredFields") });
      return;
    }

    if (!productDetail) {
      Toast.show({ type: "error", text1: t("common.error"), text2: t("booking.productNotLoaded") });
      return;
    }

    const bookingData = {
      productId: productDetail._id,
      quantity: Number(quantity),
      startDateTime: startDateTime.toISOString(),
      endDateTime: endDateTime.toISOString(),
      userName: name,
      userPhone: phone,
      userEmail: email,
    };

    await setGuestPhone(phone);
    const res = await bookProduct(bookingData);

    if (res.success) {
      Toast.show({
        type: "success",
        text1: t("booking.confirmed"),
        text2: `${productDetail.name} | Qty ${quantity}`,
      });
      setQuantity("1");
      setStartDateTime(new Date());
      setEndDateTime(new Date());
    } else {
      Toast.show({ type: "error", text1: t("booking.failed"), text2: res.message });
    }
  };

  return (
    <Animated.View style={[styles.formContainer, { opacity: fadeAnim }]}>
      <Text style={styles.formLabel}>{t("booking.name")}</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder={t("booking.namePlaceholder")}
      />

      <Text style={styles.formLabel}>{t("booking.phone")}</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        placeholder={t("booking.phonePlaceholder")}
        keyboardType="phone-pad"
      />

      <Text style={styles.formLabel}>{t("booking.email")}</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder={t("booking.emailPlaceholder")}
        keyboardType="email-address"
      />

      <Text style={styles.formLabel}>{t("booking.quantity")}</Text>
      <TextInput
        style={styles.input}
        value={quantity}
        onChangeText={setQuantity}
        placeholder={t("booking.quantity")}
        keyboardType="numeric"
      />

      {/* Start Date */}
      <Text style={styles.formLabel}>{t("booking.startDate")}</Text>
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowStartPicker(true)}
      >
        <Text>{startDateTime.toLocaleString()}</Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={showStartPicker}
        mode="datetime"
        date={startDateTime}
        onConfirm={(date) => {
          setStartDateTime(date);
          setShowStartPicker(false);
        }}
        onCancel={() => setShowStartPicker(false)}
      />

      {/* End Date */}
      <Text style={styles.formLabel}>{t("booking.endDate")}</Text>
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowEndPicker(true)}
      >
        <Text>{endDateTime.toLocaleString()}</Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={showEndPicker}
        mode="datetime"
        date={endDateTime}
        onConfirm={(date) => {
          setEndDateTime(date);
          setShowEndPicker(false);
        }}
        onCancel={() => setShowEndPicker(false)}
      />

      {isUnavailable && (
        <Text style={styles.unavailableText}>Currently not available</Text>
      )}
      <TouchableOpacity
        style={[styles.bookButton, isUnavailable && styles.bookButtonDisabled]}
        onPress={handleBooking}
        disabled={isUnavailable}
      >
        <Text style={styles.bookButtonText}>
          {isUnavailable ? "Booked" : t("booking.bookNow")}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    marginTop: 16,
    backgroundColor: "rgba(144, 238, 144, 0.2)",
    padding: 16,
    borderRadius: 12,
    margin: 16,
  },
  formLabel: { fontSize: 16, fontWeight: "bold", marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    backgroundColor: "#f9fff9",
  },
  dateButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: "#e0ffe0",
  },
  bookButton: {
    backgroundColor: "green",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 30,
  },
  bookButtonDisabled: {
    backgroundColor: "#94a3b8",
  },
  bookButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  unavailableText: { marginBottom: 10, color: "#dc2626", fontWeight: "700", textAlign: "center" },
});
