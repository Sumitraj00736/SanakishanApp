export const BS_MONTHS_BY_LANG = {
  en: ["Baishakh", "Jestha", "Ashadh", "Shrawan", "Bhadra", "Ashwin", "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra"],
  ne: ["बैशाख", "जेठ", "असार", "श्रावण", "भदौ", "आश्विन", "कार्तिक", "मंसिर", "पौष", "माघ", "फाल्गुन", "चैत्र"],
};

export const WEEK_DAYS_BY_LANG = {
  en: ["SU", "MO", "TU", "WE", "TH", "FR", "SA"],
  ne: ["आइ", "सो", "मं", "बु", "बि", "शु", "श"],
};

export const DAYS_GRID = Array.from({ length: 32 }, (_, i) => i + 1);

export const NE_DIGITS = {
  0: "०",
  1: "१",
  2: "२",
  3: "३",
  4: "४",
  5: "५",
  6: "६",
  7: "७",
  8: "८",
  9: "९",
};

export const MIN_BS_YEAR = 2080;
export const MAX_BS_YEAR = 3000;

export const BS_YEAR_OPTIONS = Array.from(
  { length: MAX_BS_YEAR - MIN_BS_YEAR + 1 },
  (_, i) => MIN_BS_YEAR + i
);
