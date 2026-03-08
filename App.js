import React, { useContext } from "react";
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import "./src/components/i18n";

import HomeScreen from "./src/screens/HomeScreen";
import ProductDetail from "./src/components/product/ProductDetails";
import ProductScreen from "./src/screens/ProductScreen";
import CategoriesScreen from "./src/screens/CategoryScreen";
import SearchScreen from "./src/screens/SearchScreen";
import ProductBar from "./src/screens/ProductBar";
import SupportScreen from "./src/screens/SupportScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import NotificationsScreen from "./src/screens/NotificationsScreen";
import AuthGateScreen from "./src/screens/AuthGateScreen";
import { ProductProvider } from "./src/context/ProductProvider";
import { AuthProvider, AuthContext } from "./src/context/AuthProvider";
import Toast from "react-native-toast-message";

const Stack = createStackNavigator();

function AppNavigator() {
  const { hydrating, user } = useContext(AuthContext);
  const [guestAllowed, setGuestAllowed] = React.useState(false);

  if (hydrating) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#0f766e" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!user && !guestAllowed && (
          <Stack.Screen name="AuthGate" options={{ headerShown: false }}>
            {() => <AuthGateScreen onGuestContinue={() => setGuestAllowed(true)} />}
          </Stack.Screen>
        )}
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ProductDetail" component={ProductDetail} options={{ title: "Product Detail" }} />
        <Stack.Screen name="ProductScreen" component={ProductScreen} options={{ title: "Product Details" }} />
        <Stack.Screen name="Categories" component={CategoriesScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="ProductBar" component={ProductBar} />
        <Stack.Screen name="Support" component={SupportScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <AppNavigator />
        <Toast />
      </ProductProvider>
    </AuthProvider>
  );
}
