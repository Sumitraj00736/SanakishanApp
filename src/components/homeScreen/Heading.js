// src/components/homeScreen/Heading.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from '@expo/vector-icons'; // make sure expo/vector-icons is installed

export default function Heading({ onMemberPress, hasMemberId }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>SanaKisan Equipment</Text>
      <TouchableOpacity style={styles.memberButton} onPress={onMemberPress}>
        {hasMemberId ? (
          <MaterialIcons name="check" size={20} color="white" />
        ) : (
          <Text style={{ color: "white", fontWeight: "bold" }}>+</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginTop: 40 
  },
  title: { 
    fontSize: 22, 
    fontWeight: "bold", 
    color: "white", 
    marginBottom: 10 
  },
  memberButton: {
    backgroundColor: "#006400",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
