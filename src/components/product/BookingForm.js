import React, { useContext, useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { ProductContext } from "../../context/ProductProvider";
import { AuthContext } from "../../context/AuthProvider";
import BsDateTimeCalendarModal from "../calendar/BsDateTimeCalendarModal";
import {
  findNearestAdFromBs,
  format12HourTime,
  getBsParts,
  normalizeTimeInput,
  parseManualTime,
  toLocalizedDigits,
} from "../calendar/utils";

export default function BookingForm() {
  const navigation = useNavigation();
  const { height } = useWindowDimensions();
  const { t, i18n } = useTranslation();
  const { productDetail, bookProduct, setGuestPhone } = useContext(ProductContext);
  const { user } = useContext(AuthContext);

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [email, setEmail] = useState(user?.email || "");
  const [quantity, setQuantity] = useState("1");

  const [startDateTime, setStartDateTime] = useState(new Date());
  const [endDateTime, setEndDateTime] = useState(new Date(Date.now() + 60 * 60 * 1000));

  const [startBs, setStartBs] = useState(() => getBsParts(new Date()));
  const [endBs, setEndBs] = useState(() => getBsParts(new Date(Date.now() + 60 * 60 * 1000)));

  const [startTime, setStartTime] = useState(() => {
    const now = new Date();
    return {
      hour: now.getHours() % 12 || 12,
      minute: now.getMinutes(),
      period: now.getHours() >= 12 ? "PM" : "AM",
    };
  });
  const [endTime, setEndTime] = useState(() => {
    const next = new Date(Date.now() + 60 * 60 * 1000);
    return {
      hour: next.getHours() % 12 || 12,
      minute: next.getMinutes(),
      period: next.getHours() >= 12 ? "PM" : "AM",
    };
  });

  const [startTimeInput, setStartTimeInput] = useState(
    `${String(startTime.hour).padStart(2, "0")}:${String(startTime.minute).padStart(2, "0")}`
  );
  const [endTimeInput, setEndTimeInput] = useState(
    `${String(endTime.hour).padStart(2, "0")}:${String(endTime.minute).padStart(2, "0")}`
  );

  const [calendarVisible, setCalendarVisible] = useState(false);
  const [calendarMode, setCalendarMode] = useState("start");
  const [viewMonthYear, setViewMonthYear] = useState(() => getBsParts(new Date()));

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const isUnavailable =
    productDetail?.status === "booked" || Number(productDetail?.reservedUnits || 0) <= 0;
  const isNepali = i18n.language === "ne";

  const formatDateTimeLabel = (bs, timeObj) =>
    `${toLocalizedDigits(bs.year, isNepali)}/${toLocalizedDigits(String(bs.month).padStart(2, "0"), isNepali)}/${toLocalizedDigits(
      String(bs.day).padStart(2, "0"),
      isNepali
    )} ${t("bookingCalendar.bsSuffix")}  ${toLocalizedDigits(format12HourTime(timeObj), isNepali)}`;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const openCalendar = (mode) => {
    setCalendarMode(mode);
    setViewMonthYear(mode === "start" ? startBs : endBs);
    setCalendarVisible(true);
  };

  const onSelectDay = (day) => {
    const next = { year: viewMonthYear.year, month: viewMonthYear.month, day };
    if (calendarMode === "start") setStartBs(next);
    else setEndBs(next);
  };

  const applyDateTime = () => {
    const parsedStart = parseManualTime(startTimeInput, startTime.period);
    const parsedEnd = parseManualTime(endTimeInput, endTime.period);

    if (!parsedStart || !parsedEnd) {
      Toast.show({
        type: "error",
        text1: t("common.error"),
        text2: t("bookingCalendar.timeFormatHint"),
      });
      return;
    }

    const startFound = findNearestAdFromBs(startBs, startDateTime);
    const endFound = findNearestAdFromBs(endBs, endDateTime);

    if (!startFound.adDate || !endFound.adDate) {
      Toast.show({
        type: "error",
        text1: t("common.error"),
        text2: t("bookingCalendar.convertError"),
      });
      return;
    }

    startFound.adDate.setHours(parsedStart.hour24, parsedStart.minute, 0, 0);
    endFound.adDate.setHours(parsedEnd.hour24, parsedEnd.minute, 0, 0);

    if (endFound.adDate <= startFound.adDate) {
      Toast.show({
        type: "error",
        text1: t("common.error"),
        text2: t("bookingCalendar.endAfterStart"),
      });
      return;
    }

    setStartBs({ ...startBs, day: startFound.adjustedDay });
    setEndBs({ ...endBs, day: endFound.adjustedDay });
    setStartTime({ hour: parsedStart.hour, minute: parsedStart.minute, period: parsedStart.period });
    setEndTime({ hour: parsedEnd.hour, minute: parsedEnd.minute, period: parsedEnd.period });
    setStartDateTime(startFound.adDate);
    setEndDateTime(endFound.adDate);
    setCalendarVisible(false);
  };

  const handleBooking = async () => {
    if (!name || !phone || !quantity) {
      Toast.show({ type: "error", text1: t("common.error"), text2: t("booking.requiredFields") });
      return;
    }

    if (!productDetail) {
      Toast.show({ type: "error", text1: t("common.error"), text2: t("booking.productNotLoaded") });
      return;
    }

    const bookingData = {
      productId: productDetail._id,
      quantity: Number(quantity),
      startDateTime: startDateTime.toISOString(),
      endDateTime: endDateTime.toISOString(),
      userName: name,
      userPhone: phone,
      userEmail: email,
    };

    await setGuestPhone(phone);
    const res = await bookProduct(bookingData);

    if (res.success) {
      Toast.show({ type: "success", text1: t("booking.confirmed"), text2: `${productDetail.name} | Qty ${quantity}` });
      navigation.navigate("Home");
    } else {
      Toast.show({ type: "error", text1: t("booking.failed"), text2: res.message });
    }
  };

  return (
    <Animated.View style={[styles.formContainer, { opacity: fadeAnim }]}> 
      <View style={styles.formHeader}>
        <MaterialCommunityIcons name="calendar-check-outline" size={20} color="#14532d" />
        <Text style={styles.formHeaderText}>{t("booking.bookNow")}</Text>
      </View>

      <Text style={styles.formLabel}>{t("booking.name")}</Text>
      <View style={styles.inputCard}>
        <View style={styles.inputIconWrap}>
          <MaterialCommunityIcons name="account-outline" size={17} color="#166534" />
        </View>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder={t("booking.namePlaceholder")} />
      </View>

      <Text style={styles.formLabel}>{t("booking.phone")}</Text>
      <View style={styles.inputCard}>
        <View style={styles.inputIconWrap}>
          <MaterialCommunityIcons name="phone-outline" size={17} color="#166534" />
        </View>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder={t("booking.phonePlaceholder")}
          keyboardType="phone-pad"
        />
      </View>

      <Text style={styles.formLabel}>{t("booking.email")}</Text>
      <View style={styles.inputCard}>
        <View style={styles.inputIconWrap}>
          <MaterialCommunityIcons name="email-outline" size={17} color="#166534" />
        </View>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder={t("booking.emailPlaceholder")}
          keyboardType="email-address"
        />
      </View>

      <Text style={styles.formLabel}>{t("booking.quantity")}</Text>
      <View style={styles.inputCard}>
        <View style={styles.inputIconWrap}>
          <MaterialCommunityIcons name="counter" size={17} color="#166534" />
        </View>
        <TextInput style={styles.input} value={quantity} onChangeText={setQuantity} placeholder={t("booking.quantity")} keyboardType="numeric" />
      </View>

      <Text style={styles.formLabel}>{t("booking.startDate")}</Text>
      <TouchableOpacity style={styles.dateButton} onPress={() => openCalendar("start")}>
        <MaterialCommunityIcons name="calendar-start" size={18} color="#166534" />
        <Text style={styles.dateValue}>{formatDateTimeLabel(startBs, startTime)}</Text>
      </TouchableOpacity>

      <Text style={styles.formLabel}>{t("booking.endDate")}</Text>
      <TouchableOpacity style={styles.dateButton} onPress={() => openCalendar("end")}>
        <MaterialCommunityIcons name="calendar-end" size={18} color="#166534" />
        <Text style={styles.dateValue}>{formatDateTimeLabel(endBs, endTime)}</Text>
      </TouchableOpacity>

      {isUnavailable && <Text style={styles.unavailableText}>{t("booking.unavailable")}</Text>}

      <TouchableOpacity style={[styles.bookButton, isUnavailable && styles.bookButtonDisabled]} onPress={handleBooking} disabled={isUnavailable}>
        <Text style={styles.bookButtonText}>{isUnavailable ? t("booking.booked") : t("booking.bookNow")}</Text>
      </TouchableOpacity>

      <BsDateTimeCalendarModal
        visible={calendarVisible}
        maxHeight={height}
        t={t}
        isNepali={isNepali}
        calendarMode={calendarMode}
        setCalendarMode={(mode) => {
          setCalendarMode(mode);
          setViewMonthYear(mode === "start" ? startBs : endBs);
        }}
        viewMonthYear={viewMonthYear}
        setViewMonthYear={setViewMonthYear}
        startBs={startBs}
        endBs={endBs}
        startTime={startTime}
        endTime={endTime}
        startTimeInput={startTimeInput}
        endTimeInput={endTimeInput}
        onStartTimeInputChange={(v) => setStartTimeInput(normalizeTimeInput(v))}
        onEndTimeInputChange={(v) => setEndTimeInput(normalizeTimeInput(v))}
        onToggleStartPeriod={() => setStartTime((prev) => ({ ...prev, period: prev.period === "AM" ? "PM" : "AM" }))}
        onToggleEndPeriod={() => setEndTime((prev) => ({ ...prev, period: prev.period === "AM" ? "PM" : "AM" }))}
        onSelectDay={onSelectDay}
        onApply={applyDateTime}
        onClose={() => setCalendarVisible(false)}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    marginTop: 16,
    backgroundColor: "#f0fdf4",
    padding: 16,
    borderRadius: 16,
    margin: 16,
    borderWidth: 1,
    borderColor: "#86efac",
  },
  formHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  formHeaderText: { fontSize: 18, fontWeight: "800", color: "#14532d", fontFamily: "Poppins" },
  formLabel: { fontSize: 14, fontWeight: "700", marginBottom: 5, color: "#166534", fontFamily: "Poppins" },
  inputCard: {
    borderWidth: 1,
    borderColor: "#86efac",
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  inputIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#dcfce7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingHorizontal: 4,
    paddingVertical: 10,
    color: "#14532d",
    fontWeight: "700",
  },
  dateButton: {
    borderWidth: 1,
    borderColor: "#16a34a",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#f0fdf4",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dateValue: { color: "#166534", fontWeight: "700" },
  bookButton: {
    backgroundColor: "#15803d",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 30,
  },
  bookButtonDisabled: { backgroundColor: "#94a3b8" },
  bookButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  unavailableText: { marginBottom: 10, color: "#dc2626", fontWeight: "700", textAlign: "center" },
});
