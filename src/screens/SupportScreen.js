import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import BottomBar from "../components/navigation/BottomBar";

export default function SupportScreen() {
  const [form, setForm] = useState({
    name: "",
    number: "",
    memberId: "",
    description: "",
  });

  const handleChange = (key, value) => setForm({ ...form, [key]: value });

  const handleSubmit = () => {
    if (!form.name || !form.number || !form.memberId || !form.description) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    Alert.alert("Success", "Your support request has been submitted!");
    setForm({ name: "", number: "", memberId: "", description: "" });
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
          value={form.number}
          onChangeText={(text) => handleChange("number", text)}
        />

        <TextInput
          style={styles.input}
          placeholder="Member ID"
          placeholderTextColor="#888"
          value={form.memberId}
          onChangeText={(text) => handleChange("memberId", text)}
        />

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe your issue..."
          placeholderTextColor="#888"
          multiline
          numberOfLines={4}
          value={form.description}
          onChangeText={(text) => handleChange("description", text)}
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit Request</Text>
        </TouchableOpacity>
      </View>
      <BottomBar/>

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
