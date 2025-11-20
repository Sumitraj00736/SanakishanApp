import React, { useState, useRef, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { ProductContext } from "../../context/ProductProvider";
import { AuthContext } from "../../context/AuthProvider";


export default function BookingForm() {
  const { productDetail, bookProduct } = useContext(ProductContext);
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

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleBooking = async () => {
    if (!name || !phone || !email || !quantity) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    if (!productDetail) {
      Alert.alert("Error", "Product details not loaded yet");
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

    const res = await bookProduct(bookingData);

    if (res.success) {
      Alert.alert(
        "Booking Confirmed",
        `Product: ${productDetail.name}\nName: ${name}\nQuantity: ${quantity}\nStart: ${startDateTime.toLocaleString()}\nEnd: ${endDateTime.toLocaleString()}`
      );
      setQuantity("1");
      setStartDateTime(new Date());
      setEndDateTime(new Date());
    } else {
      Alert.alert("Booking Failed", res.message);
    }
  };

  return (
    <Animated.View style={[styles.formContainer, { opacity: fadeAnim }]}>
      <Text style={styles.formLabel}>Your Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter your name"
      />

      <Text style={styles.formLabel}>Phone Number</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        placeholder="Enter your phone number"
        keyboardType="phone-pad"
      />

      <Text style={styles.formLabel}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        keyboardType="email-address"
      />

      <Text style={styles.formLabel}>Quantity</Text>
      <TextInput
        style={styles.input}
        value={quantity}
        onChangeText={setQuantity}
        placeholder="Enter quantity"
        keyboardType="numeric"
      />

      {/* Start Date */}
      <Text style={styles.formLabel}>Start Date & Time</Text>
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
      <Text style={styles.formLabel}>End Date & Time</Text>
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

      <TouchableOpacity style={styles.bookButton} onPress={handleBooking}>
        <Text style={styles.bookButtonText}>Book Now</Text>
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
  bookButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
