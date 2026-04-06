import { useState, useRef, useEffect } from "react";
import styles from "./LanguageSelect.module.css";

const LANGUAGES = [
  { value: "ko", label: "한국어" },
  { value: "en", label: "English" },
  { value: "ja", label: "日本語" },
  { value: "zh-CN", label: "中文 (简体)" },
  { value: "zh-TW", label: "繁體中文" },
  { value: "vi", label: "Tiếng Việt" },
  { value: "th", label: "ไทย" },
  { value: "id", label: "Bahasa Indonesia" },
  { value: "ms", label: "Bahasa Melayu" },
  { value: "hi", label: "हिन्दी" },
  { value: "bn", label: "বাংলা" },
  { value: "ta", label: "தமிழ்" },
  { value: "te", label: "తెలుగు" },
  { value: "ur", label: "اردو" },
  { value: "km", label: "ភាសាខ្មែរ" },
  { value: "my", label: "မြန်မာဘာသာ" },
  { value: "ne", label: "नेपाली" },
  { value: "si", label: "සිංහල" },
  { value: "lo", label: "ລາວ" },
  { value: "ru", label: "Русский" },
  { value: "pa", label: "ਪੰਜਾਬੀ" },
  { value: "gu", label: "ગુજરાતી" },
  { value: "ml", label: "മലയാളം" },
  { value: "kn", label: "ಕನ್ನಡ" },
  { value: "mr", label: "मराठी" },
  { value: "fr", label: "Français" },
  { value: "es", label: "Español" },
  { value: "de", label: "Deutsch" },
];

export default function LanguageSelect({ value, onChange, isHome, isMobile = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = LANGUAGES.find((l) => l.value === value);

  const themeClass = isHome ? styles.dark : styles.light;
  const mobileClass = isMobile ? styles.mobile : "";

  return (
    <div ref={ref} className={`${styles.container} ${themeClass} ${mobileClass}`}>
      <button
        className={styles.trigger}
        onClick={() => setIsOpen((prev) => !prev)}
        type="button"
      >
        <span>{selected?.label}</span>
        <span className={`${styles.arrow} ${isOpen ? styles.arrowOpen : ""}`}>▾</span>
      </button>

      {isOpen && (
        <ul className={styles.dropdown}>
          {LANGUAGES.map((lang) => (
            <li
              key={lang.value}
              className={`${styles.option} ${lang.value === value ? styles.selected : ""}`}
              onClick={() => {
                onChange(lang.value);
                setIsOpen(false);
              }}
            >
              {lang.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
