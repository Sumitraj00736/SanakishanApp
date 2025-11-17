import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "./src/screens/HomeScreen";
import ProductDetail from "./src/components/product/ProductDetails";
import ProductScreen from "./src/screens/ProductScreen"; 

import CategoriesScreen from "./src/screens/CategoryScreen"; 
import SearchScreen from "./src/screens/SearchScreen";
import ProductBar from "./src/screens/ProductBar";
import SupportScreen from "./src/screens/SupportScreen";

const Stack = createStackNavigator();

// Custom Header with Name + Search
function HeaderWithSearch({ title, search, setSearch }) {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>{title}</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Search equipment..."
        value={search}
        onChangeText={setSearch}
      />
    </View>
  );
}

export default function App() {
  const [search, setSearch] = useState("");

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* Home Screen - no fixed search bar */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />

        {/* Other screens - fixed header with search */}
        <Stack.Screen
          name="ProductDetail"
          component={ProductDetail}
          options={{
            header: () => (
              <HeaderWithSearch title="Product Detail" search={search} setSearch={setSearch} />
            ),
          }}
        />
        <Stack.Screen
          name="ProductScreen"
          component={ProductScreen}
          options={{ title: "Product Details" }}
        />
        <Stack.Screen name="Categories" component={CategoriesScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="ProductBar" component={ProductBar} />
        <Stack.Screen name="Support" component={SupportScreen} />
        

      </Stack.Navigator>

    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "green",
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },
  searchBar: {
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});
