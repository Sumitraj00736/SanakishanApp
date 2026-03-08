// src/components/homeScreen/Heading.js
import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, useWindowDimensions } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { AuthContext } from "../../context/AuthProvider";
import { useTranslation } from "react-i18next";

// Import your logo
import SanaKisanLogo from "../../../assets/icon.png"; 
export default function Heading({ onMemberPress, onProfilePress }) {
    const { t } = useTranslation();
    const { user } = useContext(AuthContext);
    const { width } = useWindowDimensions();
    const isSmall = width < 380;

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Image source={SanaKisanLogo} style={styles.logo} />
                <Text style={[styles.title, { fontSize: isSmall ? 18 : 22 }]} numberOfLines={1}>
                  {t("appTitle")}
                </Text>
            </View>

            <View style={styles.actions}>
                <TouchableOpacity style={[styles.memberButton, { paddingHorizontal: isSmall ? 9 : 12 }]} onPress={onMemberPress}>
                    {user ? (
                        <MaterialIcons name="check" size={20} color="white" />
                    ) : (
                        <Text style={{ color: "white", fontWeight: "bold" }}>+</Text>
                    )}
                </TouchableOpacity>
                <TouchableOpacity style={[styles.profileButton, { paddingHorizontal: isSmall ? 8 : 10 }]} onPress={onProfilePress}>
                    <MaterialIcons name="person" size={20} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flexDirection: "row", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginTop: 0,
        marginBottom: 8,
        paddingHorizontal: 2,
    },
    titleContainer: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    logo: {
        width: 44,
        height: 44,
        resizeMode: "contain",
        marginRight: 8,
        borderRadius: 10,
      
    },
    title: { 
        fontWeight: "bold", 
        color: "white", 
        flexShrink: 1,
    },
    memberButton: {
        backgroundColor: "#15803d",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    profileButton: {
        backgroundColor: "#166534",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    actions: {
        flexDirection: "row",
        gap: 8,
    },
});
