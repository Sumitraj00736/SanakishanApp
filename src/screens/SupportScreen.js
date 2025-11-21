import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";

import BottomBar from "../components/navigation/BottomBar";
import { ProductContext } from "../context/ProductProvider";

export default function SupportScreen() {
  const { createSupportTicket } = useContext(ProductContext);

  const [form, setForm] = useState({
    bookingId: "",
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async () => {
    const { bookingId, name, phone, email, message } = form;

    // ✅ Validation
    if (!bookingId || !name || !phone || !email || !message) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    if (phone.length < 10) {
      Alert.alert("Error", "Enter a valid phone number");
      return;
    }

    if (!email.includes("@")) {
      Alert.alert("Error", "Enter a valid email");
      return;
    }

    setLoading(true);

    const payload = {
      bookingId,
      name,
      phone,
      email,
      adminMessage: "",
      message,
    };

    const response = await createSupportTicket(payload);

    setLoading(false);

    if (!response.success) {
      Alert.alert("Error", response.message);
      return;
    }

    Alert.alert("Success", "Support ticket created successfully ✅");

    // ✅ Clear form
    setForm({
      bookingId: "",
      name: "",
      phone: "",
      email: "",
      message: "",
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.heading}>Customer Support</Text>
        <Text style={styles.subHeading}>
          Fill out the form below, and our team will contact you shortly.
        </Text>
      </View>

      {/* Form Section */}
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Booking ID"
          placeholderTextColor="#888"
          value={form.bookingId}
          onChangeText={(text) => handleChange("bookingId", text)}
        />

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#888"
          value={form.name}
          onChangeText={(text) => handleChange("name", text)}
        />

        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          placeholderTextColor="#888"
          keyboardType="phone-pad"
          value={form.phone}
          onChangeText={(text) => handleChange("phone", text)}
        />

        <TextInput
          style={styles.input}
          placeholder="Email Address"
          placeholderTextColor="#888"
          keyboardType="email-address"
          autoCapitalize="none"
          value={form.email}
          onChangeText={(text) => handleChange("email", text)}
        />

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe your issue..."
          placeholderTextColor="#888"
          multiline
          numberOfLines={4}
          value={form.message}
          onChangeText={(text) => handleChange("message", text)}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Submit Request</Text>
          )}
        </TouchableOpacity>
      </View>

      <BottomBar />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  header: {
    backgroundColor: "green",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
    textAlign: "center",
  },
  subHeading: {
    color: "#e0e0e0",
    textAlign: "center",
    fontSize: 14,
  },
  form: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  input: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "green",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
