// src/components/product/BookingForm.js
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  Animated,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function BookingForm({ product }) {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [address, setAddress] = useState("");
  const [membershipId, setMembershipId] = useState("");
  const [nagritaNumber, setNagritaNumber] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Animation
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleBooking = () => {
    if (!name || !number || !address || !membershipId || !nagritaNumber) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    Alert.alert(
      "Booking Confirmed",
      `Product: ${product.name}\nName: ${name}\nDate: ${date.toLocaleString()}`
    );

    // Reset form
    setName("");
    setNumber("");
    setAddress("");
    setMembershipId("");
    setNagritaNumber("");
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
        value={number}
        onChangeText={setNumber}
        placeholder="Enter your phone number"
        keyboardType="phone-pad"
      />

      <Text style={styles.formLabel}>Address</Text>
      <TextInput
        style={styles.input}
        value={address}
        onChangeText={setAddress}
        placeholder="Enter your address"
      />

      <Text style={styles.formLabel}>Membership ID</Text>
      <TextInput
        style={styles.input}
        value={membershipId}
        onChangeText={setMembershipId}
        placeholder="Enter your membership ID"
      />

      <Text style={styles.formLabel}>Nagrita Number</Text>
      <TextInput
        style={styles.input}
        value={nagritaNumber}
        onChangeText={setNagritaNumber}
        placeholder="Enter Nagrita Number"
      />

      <Text style={styles.formLabel}>Select Date & Time</Text>
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowDatePicker(true)}
      >
        <Text>{date.toLocaleString()}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="datetime"
          display="default"
          onChange={(event, selectedDate) => {
            if (Platform.OS === "android") setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      <TouchableOpacity style={styles.bookButton} onPress={handleBooking}>
        <Text style={styles.bookButtonText}>Book Now</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    marginTop: 16,
    backgroundColor: "rgba(144, 238, 144, 0.2)", // light green with low opacity
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
    backgroundColor: "#f9fff9", // subtle white-green background
  },
  dateButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: "#e0ffe0", // light green
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
