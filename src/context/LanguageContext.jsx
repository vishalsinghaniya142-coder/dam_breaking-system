import React, { createContext, useContext, useState, useEffect } from "react";
import { SUPPORTED_LANGUAGES, TRANSLATIONS } from "../utils/translations";

export const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    try {
      return localStorage.getItem("pravah_lang") || "en";
    } catch {
      return "en";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("pravah_lang", currentLanguage);
    } catch (e) {
      console.warn(e);
    }
  }, [currentLanguage]);

  const activeLangObj =
    SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage) ||
    SUPPORTED_LANGUAGES[0];

  const t = (key) => {
    const dict = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
    if (dict && dict[key]) {
      return dict[key];
    }
    return TRANSLATIONS.en[key] || key;
  };

  const setLanguage = (langCode) => {
    if (SUPPORTED_LANGUAGES.some((l) => l.code === langCode)) {
      setCurrentLanguage(langCode);
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        activeLangObj,
        languages: SUPPORTED_LANGUAGES,
        setLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
