import React, { useEffect, useMemo, useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { BS_MONTHS_BY_LANG, BS_YEAR_OPTIONS, WEEK_DAYS_BY_LANG } from "./constants";
import { getBsMonthCalendarData, toLocalizedDigits } from "./utils";

export default function BsDateTimeCalendarModal({
  visible,
  maxHeight,
  t,
  isNepali,
  calendarMode,
  setCalendarMode,
  viewMonthYear,
  setViewMonthYear,
  startBs,
  endBs,
  startTime,
  endTime,
  startTimeInput,
  endTimeInput,
  onStartTimeInputChange,
  onEndTimeInputChange,
  onToggleStartPeriod,
  onToggleEndPeriod,
  onSelectDay,
  onApply,
  onClose,
}) {
  const [monthDropdownVisible, setMonthDropdownVisible] = useState(false);
  const [yearDropdownVisible, setYearDropdownVisible] = useState(false);

  useEffect(() => {
    if (!visible) return;
    setMonthDropdownVisible(false);
    setYearDropdownVisible(false);
  }, [visible]);

  const bsMonths = useMemo(() => (isNepali ? BS_MONTHS_BY_LANG.ne : BS_MONTHS_BY_LANG.en), [isNepali]);
  const weekDays = useMemo(() => (isNepali ? WEEK_DAYS_BY_LANG.ne : WEEK_DAYS_BY_LANG.en), [isNepali]);
  const monthData = useMemo(
    () => getBsMonthCalendarData(viewMonthYear.year, viewMonthYear.month),
    [viewMonthYear.year, viewMonthYear.month]
  );

  const shiftMonth = (delta) => {
    setMonthDropdownVisible(false);
    setYearDropdownVisible(false);

    setViewMonthYear((prev) => {
      let month = prev.month + delta;
      let year = prev.year;

      if (month < 1) {
        month = 12;
        year -= 1;
      } else if (month > 12) {
        month = 1;
        year += 1;
      }

      return { ...prev, month, year };
    });
  };

  const onSelectMonth = (month) => {
    setViewMonthYear((prev) => ({ ...prev, month }));
    setMonthDropdownVisible(false);
  };

  const onSelectYear = (year) => {
    setViewMonthYear((prev) => ({ ...prev, year }));
    setYearDropdownVisible(false);
  };

  const activeDay = calendarMode === "start" ? startBs.day : endBs.day;
  const leadingBlanks = Array.from({ length: monthData.firstWeekday }, (_, i) => `blank-${i}`);
  const validDays = Array.from({ length: monthData.totalDays }, (_, i) => i + 1);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={[styles.modalCard, { maxHeight: Math.max(420, maxHeight - 80) }] }>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalScroll}>
            <Text style={styles.modalTitle}>{t("bookingCalendar.title")}</Text>

            <View style={styles.modeSwitchRow}>
              <TouchableOpacity style={[styles.modeChip, calendarMode === "start" && styles.modeChipActive]} onPress={() => setCalendarMode("start")}>
                <Text style={[styles.modeChipText, calendarMode === "start" && styles.modeChipTextActive]}>{t("bookingCalendar.startDate")}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modeChip, calendarMode === "end" && styles.modeChipActive]} onPress={() => setCalendarMode("end")}>
                <Text style={[styles.modeChipText, calendarMode === "end" && styles.modeChipTextActive]}>{t("bookingCalendar.endDate")}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.calendarHeader}>
              <TouchableOpacity style={styles.calendarNav} onPress={() => shiftMonth(-1)}>
                <Text style={styles.calendarNavText}>{"<"}</Text>
              </TouchableOpacity>

              <View style={styles.headerPickerGroup}>
                <TouchableOpacity
                  style={styles.headerPicker}
                  onPress={() => {
                    setMonthDropdownVisible((v) => !v);
                    setYearDropdownVisible(false);
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.headerPickerText}>{bsMonths[viewMonthYear.month - 1]}</Text>
                  <Text style={styles.headerPickerArrow}>▾</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.headerPicker}
                  onPress={() => {
                    setYearDropdownVisible((v) => !v);
                    setMonthDropdownVisible(false);
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.headerPickerText}>{toLocalizedDigits(viewMonthYear.year, isNepali)}</Text>
                  <Text style={styles.headerPickerArrow}>▾</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.calendarNav} onPress={() => shiftMonth(1)}>
                <Text style={styles.calendarNavText}>{">"}</Text>
              </TouchableOpacity>
            </View>

            {monthDropdownVisible && (
              <View style={styles.dropdownPanel}>
                <ScrollView nestedScrollEnabled style={{ maxHeight: 190 }} showsVerticalScrollIndicator={false}>
                  {bsMonths.map((monthLabel, idx) => (
                    <TouchableOpacity
                      key={monthLabel}
                      style={[styles.dropdownItem, viewMonthYear.month === idx + 1 && styles.dropdownItemActive]}
                      onPress={() => onSelectMonth(idx + 1)}
                    >
                      <Text style={[styles.dropdownItemText, viewMonthYear.month === idx + 1 && styles.dropdownItemTextActive]}>{monthLabel}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {yearDropdownVisible && (
              <View style={styles.dropdownPanel}>
                <ScrollView nestedScrollEnabled style={{ maxHeight: 190 }} showsVerticalScrollIndicator={false}>
                  {BS_YEAR_OPTIONS.map((yearVal) => (
                    <TouchableOpacity
                      key={yearVal}
                      style={[styles.dropdownItem, viewMonthYear.year === yearVal && styles.dropdownItemActive]}
                      onPress={() => onSelectYear(yearVal)}
                    >
                      <Text style={[styles.dropdownItemText, viewMonthYear.year === yearVal && styles.dropdownItemTextActive]}>
                        {toLocalizedDigits(yearVal, isNepali)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            <View style={styles.weekHeader}>
              {weekDays.map((d) => (
                <Text key={d} style={styles.weekText}>{d}</Text>
              ))}
            </View>

            <View style={styles.daysGrid}>
              {leadingBlanks.map((id) => (
                <View key={id} style={styles.dayCellBlank} />
              ))}

              {validDays.map((day) => (
                <TouchableOpacity key={day} style={[styles.dayCell, activeDay === day && styles.dayCellActive]} onPress={() => onSelectDay(day)}>
                  <Text style={[styles.dayCellText, activeDay === day && styles.dayCellTextActive]}>
                    {toLocalizedDigits(day, isNepali)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.timeInputSection}>
              <View style={styles.timeFieldRow}>
                <Text style={styles.timeFieldLabel}>{t("bookingCalendar.startTime")}</Text>
                <TextInput
                  style={styles.timeInput}
                  value={startTimeInput}
                  onChangeText={onStartTimeInputChange}
                  placeholder={t("bookingCalendar.timePlaceholder")}
                  keyboardType="number-pad"
                  maxLength={5}
                />
                <TouchableOpacity style={styles.ampmBtn} onPress={onToggleStartPeriod}>
                  <Text style={styles.ampmText}>{startTime.period}</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.timeFieldRow}>
                <Text style={styles.timeFieldLabel}>{t("bookingCalendar.endTime")}</Text>
                <TextInput
                  style={styles.timeInput}
                  value={endTimeInput}
                  onChangeText={onEndTimeInputChange}
                  placeholder={t("bookingCalendar.timePlaceholder")}
                  keyboardType="number-pad"
                  maxLength={5}
                />
                <TouchableOpacity style={styles.ampmBtn} onPress={onToggleEndPeriod}>
                  <Text style={styles.ampmText}>{endTime.period}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.modalActionBtn, styles.modalCancel]} onPress={onClose}>
                <Text style={styles.modalCancelText}>{t("bookingCalendar.cancel")}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalActionBtn, styles.modalSave]} onPress={onApply}>
                <Text style={styles.modalSaveText}>{t("bookingCalendar.apply")}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(20,83,45,0.35)",
    justifyContent: "center",
    padding: 20,
  },
  modalCard: {
    backgroundColor: "#f0fdf4",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#16a34a",
  },
  modalScroll: { paddingBottom: 6 },
  modalTitle: { fontSize: 18, fontWeight: "800", marginBottom: 10, color: "#166534" },
  modeSwitchRow: { flexDirection: "row", gap: 8, marginBottom: 10 },
  modeChip: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#86efac",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: "center",
  },
  modeChipActive: { backgroundColor: "#16a34a", borderColor: "#166534" },
  modeChipText: { color: "#166534", fontWeight: "700" },
  modeChipTextActive: { color: "#fff" },
  calendarHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
  calendarNav: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#15803d",
    alignItems: "center",
    justifyContent: "center",
  },
  calendarNavText: { color: "#fff", fontSize: 16, fontWeight: "800" },
  headerPickerGroup: { flexDirection: "row", gap: 10 },
  headerPicker: {
    minWidth: 110,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#86efac",
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerPickerText: { color: "#166534", fontWeight: "700" },
  headerPickerArrow: { color: "#15803d", fontWeight: "900" },
  dropdownPanel: {
    borderWidth: 1,
    borderColor: "#86efac",
    borderRadius: 10,
    backgroundColor: "#ffffff",
    marginBottom: 10,
    overflow: "hidden",
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ecfdf5",
  },
  dropdownItemActive: { backgroundColor: "#dcfce7" },
  dropdownItemText: { color: "#14532d", fontWeight: "600" },
  dropdownItemTextActive: { color: "#166534", fontWeight: "800" },
  weekHeader: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 4, marginBottom: 8 },
  weekText: { width: "14.28%", textAlign: "center", color: "#166534", fontWeight: "700", fontSize: 12 },
  daysGrid: { flexDirection: "row", flexWrap: "wrap", rowGap: 8, marginBottom: 12 },
  dayCellBlank: {
    width: "14.28%",
    minWidth: 34,
    paddingVertical: 8,
  },
  dayCell: {
    width: "14.28%",
    minWidth: 34,
    paddingVertical: 8,
    borderRadius: 18,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  dayCellActive: { backgroundColor: "#16a34a" },
  dayCellText: { color: "#166534", fontWeight: "700" },
  dayCellTextActive: { color: "#fff" },
  timeInputSection: { gap: 8, marginBottom: 8 },
  timeFieldRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  timeFieldLabel: { width: 72, color: "#166534", fontWeight: "700" },
  timeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#86efac",
    borderRadius: 8,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: "#14532d",
    fontWeight: "700",
  },
  ampmBtn: {
    paddingHorizontal: 10,
    height: 38,
    borderRadius: 8,
    backgroundColor: "#166534",
    alignItems: "center",
    justifyContent: "center",
  },
  ampmText: { color: "#fff", fontWeight: "700" },
  modalActions: { flexDirection: "row", justifyContent: "flex-end", gap: 10, marginTop: 8 },
  modalActionBtn: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8 },
  modalCancel: { backgroundColor: "#bbf7d0" },
  modalSave: { backgroundColor: "#15803d" },
  modalCancelText: { color: "#14532d", fontWeight: "700" },
  modalSaveText: { color: "#fff", fontWeight: "700" },
});
