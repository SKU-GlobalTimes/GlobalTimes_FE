import { useState } from "react";
import PropTypes from "prop-types";
import { DEFAULT_UI_LANGUAGE } from "../constants/uiLanguage.js";
import { LanguageContext } from "./LanguageContext.jsx";

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(DEFAULT_UI_LANGUAGE);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

LanguageProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
