import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationEn from "./en.json";
import translationVi from "./vi.json";
//eslint-disable-next-line
export var currentLanguage = () => {
  const language = localStorage.getItem("LANGUAGE");
  if (language) {
    return language;
  } else {
    localStorage.setItem("LANGUAGE", "vi");
    return "vi";
  }
};
//eslint-disable-next-line
var current = currentLanguage();

export const resources = {
  en: {
    translation: translationEn,
  },
  vi: {
    translation: translationVi,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: current,
  interpolation: {
    escapeValue: false,
  },
});

export const setLanguage = (lang) => {
  i18n.changeLanguage(lang);
  return lang;
};
