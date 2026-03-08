import { daysInMonth, toBik, toGreg } from "@samirkoirala/bs-calendar-react";
import { NE_DIGITS } from "./constants";

export const hasBsIntlSupport = () => true;

export const getBsParts = (date) => {
  try {
    const bs = toBik(date);
    return { year: bs.year, month: bs.month, day: bs.day };
  } catch {
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    };
  }
};

export const getBsMonthCalendarData = (bsYear, bsMonth) => {
  try {
    const totalDays = daysInMonth(bsYear, bsMonth);
    const firstAd = toGreg(bsYear, bsMonth, 1);
    const firstWeekday = new Date(firstAd.year, firstAd.month - 1, firstAd.day).getDay();

    return {
      totalDays,
      firstWeekday,
    };
  } catch {
    return {
      totalDays: 30,
      firstWeekday: 0,
    };
  }
};

export const findAdFromBs = (bsDate) => {
  try {
    const g = toGreg(bsDate.year, bsDate.month, bsDate.day);
    return new Date(g.year, g.month - 1, g.day);
  } catch {
    return null;
  }
};

export const findNearestAdFromBs = (bsDate) => {
  let day = bsDate.day;

  while (day >= 1) {
    const found = findAdFromBs({ ...bsDate, day });
    if (found) return { adDate: found, adjustedDay: day };
    day -= 1;
  }

  return { adDate: null, adjustedDay: null };
};

export const format12HourTime = (timeObj) =>
  `${String(timeObj.hour).padStart(2, "0")}:${String(timeObj.minute).padStart(2, "0")} ${timeObj.period}`;

export const toLocalizedDigits = (value, isNepali) => {
  const text = String(value ?? "");
  if (!isNepali) return text;
  return text.replace(/\d/g, (d) => NE_DIGITS[d] || d);
};

export const normalizeTimeInput = (value) => {
  const digits = String(value || "")
    .replace(/[^\d]/g, "")
    .slice(0, 4);

  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}:${digits.slice(2)}`;
};

export const parseManualTime = (timeInput, period) => {
  const clean = String(timeInput || "").replace(/[^\d]/g, "");
  const normalized = clean.length === 3 ? `0${clean}` : clean;

  if (normalized.length !== 4) return null;

  const hh = Number(normalized.slice(0, 2));
  const mm = Number(normalized.slice(2, 4));

  if (!hh || hh > 12 || mm > 59) return null;

  let hour24 = hh % 12;
  if (period === "PM") hour24 += 12;

  return { hour: hh, minute: mm, period, hour24 };
};
