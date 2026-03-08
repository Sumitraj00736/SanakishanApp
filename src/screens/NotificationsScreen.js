import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, FlatList, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ProductContext } from "../context/ProductProvider";
import BottomBar from "../components/navigation/BottomBar";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function NotificationsScreen() {
  const { notifications, unreadNotifications, markNotificationRead, markAllNotificationsRead } =
    useContext(ProductContext);
  const [selected, setSelected] = useState(null);
  const modalTranslateY = useRef(new Animated.Value(40)).current;
  const modalOpacity = useRef(new Animated.Value(0)).current;

  const sortedNotifications = useMemo(
    () =>
      [...notifications].sort((a, b) => {
        const aTime = new Date(a.createdAt || 0).getTime();
        const bTime = new Date(b.createdAt || 0).getTime();
        return bTime - aTime;
      }),
    [notifications]
  );

  useEffect(() => {
    if (selected) {
      modalTranslateY.setValue(40);
      modalOpacity.setValue(0);
      Animated.parallel([
        Animated.timing(modalTranslateY, {
          toValue: 0,
          duration: 260,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(modalOpacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [selected, modalOpacity, modalTranslateY]);

  const getFieldIcon = (label) => {
    const key = String(label).toLowerCase();
    if (key.includes("status")) return "check-decagram-outline";
    if (key.includes("type")) return "shape-outline";
    if (key.includes("id")) return "identifier";
    if (key.includes("name")) return "account-outline";
    if (key.includes("phone")) return "phone-outline";
    if (key.includes("email")) return "email-outline";
    if (key.includes("product")) return "package-variant-closed";
    if (key.includes("quantity")) return "counter";
    if (key.includes("rent") || key.includes("total")) return "cash-multiple";
    if (key.includes("start")) return "calendar-start";
    if (key.includes("end")) return "calendar-end";
    if (key.includes("message")) return "message-text-outline";
    if (key.includes("reply")) return "message-reply-text-outline";
    return "information-outline";
  };

  const renderDetailValue = (label, value) => (
    <View style={styles.detailRow}>
      <View style={styles.detailIconWrap}>
        <MaterialCommunityIcons name={getFieldIcon(label)} size={16} color="#166534" />
      </View>
      <View style={styles.detailTextWrap}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value || "-"}</Text>
      </View>
    </View>
  );

  const openDetails = async (item) => {
    setSelected(item);
    if (!item?.read && item?._id) {
      await markNotificationRead(item._id);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
        <TouchableOpacity style={styles.markAllBtn} onPress={markAllNotificationsRead}>
          <Text style={styles.markAllText}>Mark all as read</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.unreadText}>Unread: {unreadNotifications}</Text>
      <FlatList
        data={sortedNotifications}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, !item.read && styles.cardUnread]}
            onPress={() => openDetails(item)}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              {!item.read && <View style={styles.unreadDot} />}
            </View>
            <Text style={styles.cardMsg}>{item.message}</Text>
            <Text style={styles.cardMeta}>
              {new Date(item.createdAt || Date.now()).toLocaleString()}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No notifications yet.</Text>}
      />

      <Modal visible={Boolean(selected)} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.modalCard, { transform: [{ translateY: modalTranslateY }], opacity: modalOpacity }]}>
            <View style={styles.modalHandle} />
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
            <Text style={styles.modalTitle}>{selected?.title}</Text>
            <Text style={styles.modalMsg}>{selected?.message}</Text>
            {renderDetailValue("Status", selected?.status)}
            {renderDetailValue("Type", selected?.type)}

            {!!selected?.data?.booking && (
              <>
                <Text style={styles.sectionTitle}>Booking Details</Text>
                <View style={styles.sectionCard}>
                {renderDetailValue("Booking ID", selected?.data?.booking?._id)}
                {renderDetailValue("Name", selected?.data?.booking?.userName)}
                {renderDetailValue("Phone", selected?.data?.booking?.userPhone)}
                {renderDetailValue("Email", selected?.data?.booking?.userEmail)}
                {renderDetailValue("Product", selected?.data?.product?.name)}
                {renderDetailValue("Quantity", String(selected?.data?.booking?.quantity || ""))}
                {renderDetailValue("Total Rent", String(selected?.data?.booking?.totalRent || ""))}
                {renderDetailValue(
                  "Start",
                  selected?.data?.booking?.startDateTime
                    ? new Date(selected.data.booking.startDateTime).toLocaleString()
                    : ""
                )}
                {renderDetailValue(
                  "End",
                  selected?.data?.booking?.endDateTime
                    ? new Date(selected.data.booking.endDateTime).toLocaleString()
                    : ""
                )}
                </View>
              </>
            )}

            {!!selected?.data?.ticket && (
              <>
                <Text style={styles.sectionTitle}>Support Details</Text>
                <View style={styles.sectionCard}>
                {renderDetailValue("Ticket ID", selected?.data?.ticket?._id)}
                {renderDetailValue("Name", selected?.data?.ticket?.name)}
                {renderDetailValue("Phone", selected?.data?.ticket?.phone)}
                {renderDetailValue("Message", selected?.data?.ticket?.message)}
                {renderDetailValue("Admin Reply", selected?.data?.ticket?.adminMessage)}
                </View>
              </>
            )}

            <TouchableOpacity style={styles.closeBtn} onPress={() => setSelected(null)}>
              <Text style={styles.closeBtnText}>Close</Text>
            </TouchableOpacity>
            </ScrollView>
          </Animated.View>
        </View>
      </Modal>
      <BottomBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#052e16", padding: 16, paddingTop: 44 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  title: { fontSize: 24, fontWeight: "800", color: "#ffffff" },
  markAllBtn: { backgroundColor: "#15803d", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  markAllText: { color: "white", fontWeight: "700", fontSize: 12 },
  unreadText: { marginBottom: 10, color: "#dcfce7", fontWeight: "600" },
  card: { backgroundColor: "white", borderRadius: 12, padding: 12, marginBottom: 10, elevation: 2 },
  cardUnread: { borderWidth: 1, borderColor: "#86efac", backgroundColor: "#dcfce7" },
  cardHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  cardTitle: { fontWeight: "700", color: "#0f172a", marginBottom: 4 },
  cardMsg: { color: "#334155" },
  cardMeta: { color: "#94a3b8", fontSize: 11, marginTop: 6 },
  unreadDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#15803d" },
  empty: { textAlign: "center", marginTop: 30, color: "#bbf7d0" },
  modalOverlay: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(15, 23, 42, 0.45)" },
  modalCard: {
    backgroundColor: "white",
    padding: 16,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    maxHeight: "85%",
  },
  modalHandle: {
    width: 48,
    height: 5,
    borderRadius: 6,
    backgroundColor: "#bbf7d0",
    alignSelf: "center",
    marginBottom: 12,
  },
  modalTitle: { fontSize: 20, fontWeight: "800", color: "#0f172a" },
  modalMsg: { color: "#334155", marginTop: 8, marginBottom: 12 },
  sectionTitle: { marginTop: 10, marginBottom: 8, color: "#166534", fontWeight: "800" },
  sectionCard: {
    backgroundColor: "#f0fdf4",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#bbf7d0",
    padding: 10,
    marginBottom: 6,
  },
  detailRow: { marginBottom: 8, flexDirection: "row", alignItems: "flex-start", gap: 10 },
  detailIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#dcfce7",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  detailTextWrap: { flex: 1 },
  detailLabel: { color: "#64748b", fontSize: 12, fontWeight: "600" },
  detailValue: { color: "#0f172a", fontSize: 14, fontWeight: "500" },
  closeBtn: {
    marginTop: 12,
    backgroundColor: "#15803d",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  closeBtnText: { color: "white", fontWeight: "800" },
});
