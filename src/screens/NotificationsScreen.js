import React, { useContext, useMemo, useState } from "react";
import { FlatList, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ProductContext } from "../context/ProductProvider";
import BottomBar from "../components/navigation/BottomBar";

export default function NotificationsScreen() {
  const { notifications, unreadNotifications, markNotificationRead, markAllNotificationsRead } =
    useContext(ProductContext);
  const [selected, setSelected] = useState(null);

  const sortedNotifications = useMemo(
    () =>
      [...notifications].sort((a, b) => {
        const aTime = new Date(a.createdAt || 0).getTime();
        const bTime = new Date(b.createdAt || 0).getTime();
        return bTime - aTime;
      }),
    [notifications]
  );

  const renderDetailValue = (label, value) => (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value || "-"}</Text>
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
          <ScrollView style={styles.modalCard} contentContainerStyle={{ paddingBottom: 20 }}>
            <Text style={styles.modalTitle}>{selected?.title}</Text>
            <Text style={styles.modalMsg}>{selected?.message}</Text>
            {renderDetailValue("Status", selected?.status)}
            {renderDetailValue("Type", selected?.type)}

            {!!selected?.data?.booking && (
              <>
                <Text style={styles.sectionTitle}>Booking Details</Text>
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
              </>
            )}

            {!!selected?.data?.ticket && (
              <>
                <Text style={styles.sectionTitle}>Support Details</Text>
                {renderDetailValue("Ticket ID", selected?.data?.ticket?._id)}
                {renderDetailValue("Name", selected?.data?.ticket?.name)}
                {renderDetailValue("Phone", selected?.data?.ticket?.phone)}
                {renderDetailValue("Message", selected?.data?.ticket?.message)}
                {renderDetailValue("Admin Reply", selected?.data?.ticket?.adminMessage)}
              </>
            )}

            <TouchableOpacity style={styles.closeBtn} onPress={() => setSelected(null)}>
              <Text style={styles.closeBtnText}>Close</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
      <BottomBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc", padding: 16, paddingTop: 44 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  title: { fontSize: 24, fontWeight: "800", color: "#0f172a" },
  markAllBtn: { backgroundColor: "#0f766e", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  markAllText: { color: "white", fontWeight: "700", fontSize: 12 },
  unreadText: { marginBottom: 10, color: "#0f172a", fontWeight: "600" },
  card: { backgroundColor: "white", borderRadius: 12, padding: 12, marginBottom: 10, elevation: 2 },
  cardUnread: { borderWidth: 1, borderColor: "#38bdf8", backgroundColor: "#f0f9ff" },
  cardHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  cardTitle: { fontWeight: "700", color: "#0f172a", marginBottom: 4 },
  cardMsg: { color: "#334155" },
  cardMeta: { color: "#94a3b8", fontSize: 11, marginTop: 6 },
  unreadDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#0ea5e9" },
  empty: { textAlign: "center", marginTop: 30, color: "#64748b" },
  modalOverlay: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(15, 23, 42, 0.45)" },
  modalCard: {
    backgroundColor: "white",
    padding: 16,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    maxHeight: "85%",
  },
  modalTitle: { fontSize: 20, fontWeight: "800", color: "#0f172a" },
  modalMsg: { color: "#334155", marginTop: 8, marginBottom: 12 },
  sectionTitle: { marginTop: 10, marginBottom: 8, color: "#0369a1", fontWeight: "800" },
  detailRow: { marginBottom: 6 },
  detailLabel: { color: "#64748b", fontSize: 12, fontWeight: "600" },
  detailValue: { color: "#0f172a", fontSize: 14, fontWeight: "500" },
  closeBtn: {
    marginTop: 12,
    backgroundColor: "#0f766e",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  closeBtnText: { color: "white", fontWeight: "800" },
});
