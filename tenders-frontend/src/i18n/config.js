import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import enTranslation from "../locales/en.json";
import ruTranslation from "../locales/ru.json";
import kkTranslation from "../locales/kk.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    resources: {
      en: {
        translation: enTranslation,
      },
      ru: {
        translation: ruTranslation,
      },
      kk: {
        translation: kkTranslation,
      },
    },
    interpolation: {
      escapeValue: false, // not needed for React
    },
  });

export default i18n;
