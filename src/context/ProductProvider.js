import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { Vibration } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { io } from "socket.io-client";
import Toast from "react-native-toast-message";
import { AuthContext } from "./AuthProvider";
import { API_BASE_URL, SOCKET_URL } from "../config/env";

export const ProductContext = createContext();

const PRODUCTS_URL = `${API_BASE_URL}/products`;
const BOOKINGS_URL = `${API_BASE_URL}/bookings`;
const SUPPORT_URL = `${API_BASE_URL}/support`;
const CATEGORIES_URL = `${API_BASE_URL}/categories`;
const GUEST_PHONE_KEY = "guestPhone";
const NOTIFICATIONS_URL = `${API_BASE_URL}/notifications`;

export const ProductProvider = ({ children }) => {
  const { token, user } = React.useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productDetail, setProductDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [guestPhone, setGuestPhoneState] = useState("");
  const lastAlertAtRef = React.useRef(0);

  useEffect(() => {
    (async () => {
      const storedGuestPhone = await AsyncStorage.getItem(GUEST_PHONE_KEY);
      if (storedGuestPhone) setGuestPhoneState(storedGuestPhone);
    })();
  }, []);

  const setGuestPhone = useCallback(async (phone) => {
    const normalized = String(phone || "").trim();
    setGuestPhoneState(normalized);
    if (normalized) {
      await AsyncStorage.setItem(GUEST_PHONE_KEY, normalized);
    } else {
      await AsyncStorage.removeItem(GUEST_PHONE_KEY);
    }
  }, []);

  const triggerDeviceAlert = useCallback(() => {
    const now = Date.now();
    // Avoid duplicate vibration bursts from multiple socket handlers firing at once.
    if (now - lastAlertAtRef.current < 400) return;
    lastAlertAtRef.current = now;
    Vibration.vibrate(220);
  }, []);

  const pushNotification = useCallback(async (item) => {
    setNotifications((prev) => {
      const next = [{ ...item, _id: item?._id || `${Date.now()}-${Math.random()}` }, ...prev].slice(0, 100);
      return next;
    });
    setUnreadNotifications((prev) => prev + 1);
    triggerDeviceAlert();
    Toast.show({
      type: "success",
      text1: item.title,
      text2: item.message,
      visibilityTime: 3000,
    });
  }, [triggerDeviceAlert]);

  const fetchNotifications = useCallback(async () => {
    try {
      const headers = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      const query = new URLSearchParams();
      if (guestPhone) query.set("phone", guestPhone);

      const res = await fetch(`${NOTIFICATIONS_URL}?${query.toString()}`, { headers });
      const data = await res.json();
      if (!res.ok) return { success: false, message: data?.message || "Failed to load notifications" };
      setNotifications(data?.notifications || []);
      setUnreadNotifications(Number(data?.unreadCount || 0));
      return { success: true, data };
    } catch {
      return { success: false, message: "Failed to load notifications" };
    }
  }, [guestPhone, token]);

  const markNotificationRead = useCallback(
    async (id) => {
      try {
        const headers = { "Content-Type": "application/json" };
        if (token) headers.Authorization = `Bearer ${token}`;

        const query = new URLSearchParams();
        if (guestPhone) query.set("phone", guestPhone);
        const res = await fetch(`${NOTIFICATIONS_URL}/${id}/read?${query.toString()}`, {
          method: "PATCH",
          headers,
          body: JSON.stringify(guestPhone ? { phone: guestPhone } : {}),
        });
        const data = await res.json();
        if (!res.ok) return { success: false, message: data?.message || "Failed to mark read" };
        setNotifications((prev) =>
          prev.map((item) => (item._id === id ? { ...item, read: true, readAt: new Date().toISOString() } : item))
        );
        setUnreadNotifications((prev) => Math.max(prev - 1, 0));
        return { success: true, data };
      } catch {
        return { success: false, message: "Failed to mark read" };
      }
    },
    [guestPhone, token]
  );

  const markAllNotificationsRead = useCallback(async () => {
    try {
      const headers = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;

      const query = new URLSearchParams();
      if (guestPhone) query.set("phone", guestPhone);
      const res = await fetch(`${NOTIFICATIONS_URL}/read-all?${query.toString()}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(guestPhone ? { phone: guestPhone } : {}),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, message: data?.message || "Failed to mark all read" };
      setNotifications((prev) =>
        prev.map((item) => ({ ...item, read: true, readAt: item.readAt || new Date().toISOString() }))
      );
      setUnreadNotifications(0);
      return { success: true, data };
    } catch {
      return { success: false, message: "Failed to mark all read" };
    }
  }, [guestPhone, token]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ["polling", "websocket"],
      auth: { memberId: user?.memberId || null, guestPhone: guestPhone || null },
    });

    socket.on("member:booking-confirmed", ({ booking }) => {
      pushNotification({
        type: "booking-confirmed",
        title: "Booking Confirmed",
        message: `${booking?.userName || "Booking"} confirmed.`,
        payload: booking,
      });
    });

    socket.on("user:booking-notification", (payload) => {
      if (payload?.notification) {
        setNotifications((prev) => [payload.notification, ...prev].slice(0, 100));
        setUnreadNotifications((prev) => prev + 1);
        triggerDeviceAlert();
        Toast.show({
          type: "success",
          text1: payload?.status === "confirmed" ? "Booking Confirmed" : "Booking Update",
          text2: payload?.message || "Booking notification",
          visibilityTime: 3000,
        });
        return;
      }
      pushNotification({
        type: "booking",
        title: payload?.status === "confirmed" ? "Booking Confirmed" : "Booking Update",
        message: payload?.message || "Booking notification",
        payload: payload?.notification?.data || payload?.booking || payload,
      });
    });

    socket.on("user:support-notification", (payload) => {
      if (payload?.notification) {
        setNotifications((prev) => [payload.notification, ...prev].slice(0, 100));
        setUnreadNotifications((prev) => prev + 1);
        triggerDeviceAlert();
        Toast.show({
          type: "success",
          text1: "Support Notification",
          text2: payload?.message || `Ticket status: ${payload?.status || "updated"}`,
          visibilityTime: 3000,
        });
        return;
      }
      pushNotification({
        type: "support",
        title: "Support Notification",
        message: payload?.message || `Ticket status: ${payload?.status || "updated"}`,
        payload: payload?.notification?.data || payload?.ticket || payload,
      });
    });

    return () => socket.disconnect();
  }, [guestPhone, pushNotification, triggerDeviceAlert, user?.memberId]);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(PRODUCTS_URL);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
      return data;
    } catch {
      setError("Failed to load products");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProductById = useCallback(async (id) => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${PRODUCTS_URL}/${id}`);
      const data = await res.json();
      setProductDetail(data);
      return data;
    } catch {
      setError("Failed to load product details");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProductsByCategory = useCallback(async (categoryId) => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${CATEGORIES_URL}/${categoryId}/products`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
      return Array.isArray(data) ? data : [];
    } catch {
      setError("Failed to load category products");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(CATEGORIES_URL);
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
      return data;
    } catch {
      setError("Failed to load categories");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const bookProduct = useCallback(
    async (bookingData) => {
      try {
        const headers = { "Content-Type": "application/json" };
        if (token) headers.Authorization = `Bearer ${token}`;

        const res = await fetch(BOOKINGS_URL, {
          method: "POST",
          headers,
          body: JSON.stringify(bookingData),
        });
        const data = await res.json();
        if (!res.ok) return { success: false, message: data.message || "Booking failed" };
        return { success: true, data };
      } catch {
        return { success: false, message: "Something went wrong" };
      }
    },
    [token]
  );

  const createSupportTicket = useCallback(
    async (supportData) => {
      try {
        const headers = { "Content-Type": "application/json" };
        if (token) headers.Authorization = `Bearer ${token}`;

        const res = await fetch(SUPPORT_URL, {
          method: "POST",
          headers,
          body: JSON.stringify(supportData),
        });
        const data = await res.json();
        if (!res.ok) return { success: false, message: data?.message || "Support request failed" };
        return { success: true, data };
      } catch {
        return { success: false, message: "Something went wrong" };
      }
    },
    [token]
  );

  const value = useMemo(
    () => ({
      products,
      categories,
      productDetail,
      loading,
      error,
      notifications,
      unreadNotifications,
      guestPhone,
      fetchProducts,
      fetchCategories,
      fetchProductsByCategory,
      fetchProductById,
      bookProduct,
      createSupportTicket,
      fetchNotifications,
      markNotificationRead,
      markAllNotificationsRead,
      setGuestPhone,
    }),
    [
      products,
      categories,
      productDetail,
      loading,
      error,
      notifications,
      unreadNotifications,
      guestPhone,
      fetchProducts,
      fetchCategories,
      fetchProductsByCategory,
      fetchProductById,
      bookProduct,
      createSupportTicket,
      fetchNotifications,
      markNotificationRead,
      markAllNotificationsRead,
      setGuestPhone,
    ]
  );

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};
