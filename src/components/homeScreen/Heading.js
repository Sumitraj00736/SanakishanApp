// src/components/homeScreen/Heading.js
import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { AuthContext } from "../../context/AuthProvider";

// Import your logo
import SanaKisanLogo from "../../../assets/icon.png"; 
export default function Heading({ onMemberPress }) {
    const { user } = useContext(AuthContext);

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Image source={SanaKisanLogo} style={styles.logo} />
                <Text style={styles.title}>Mahila SanaKisan</Text>
            </View>

            <TouchableOpacity style={styles.memberButton} onPress={onMemberPress}>
                {user ? (
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
        marginTop: 40,
        marginBottom: 10,
        paddingHorizontal: 2,
    },
    titleContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    logo: {
        width: 50,
        height: 50,
        resizeMode: "contain",
        marginRight: 10,
        borderRadius: 10,
      
    },
    title: { 
        fontSize: 22, 
        fontWeight: "bold", 
        color: "white", 
    },
    memberButton: {
        backgroundColor: "#006400",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
    },
});
