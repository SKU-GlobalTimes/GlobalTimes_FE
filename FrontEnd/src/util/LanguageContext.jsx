import { createContext, useContext, useState } from "react";
import { DEFAULT_UI_LANGUAGE } from "../constants/uiLanguage.js";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(DEFAULT_UI_LANGUAGE);
  // console.log(language);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage() {
  return useContext(LanguageContext);
}