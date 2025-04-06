import { useEffect, useState } from "react";
import styles from "./GoogleTranslate.module.css";

const GoogleTranslate = () => {
  const [language, setLanguage] = useState("ko");

  useEffect(() => {
    const loadGoogleTranslateScript = () => {
      if (!window.google) {
        const script = document.createElement("script");
        script.src =
          "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        script.async = true;
        document.body.appendChild(script);
      } else {
        window.googleTranslateElementInit();
      }
    };

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "ko",
          includedLanguages:
            "ko,en,ja,zh-CN,zh-TW,fr,de,es,ru,vi,th,id,hi,ar,ta,te,bn,ur,ml,km,my,ne,lo,mn,ps,si,tg,uz,kk",
          autoDisplay: true,
        },
        "google_translate_element"
      );
    };

    loadGoogleTranslateScript();
  }, []);

  useEffect(() => {
    const gtCombo = document.querySelector(".goog-te-combo");
    if (gtCombo) {
      gtCombo.value = language;
      gtCombo.dispatchEvent(new Event("change"));
    }
  }, [language]);

  const handleChange = (e) => {
    setLanguage(e.target.value);
  };

  return (
    <div className={styles.translateContainer}>
      <div id="google_translate_element" style={{ display: "none" }}></div>
      <select
        value={language}
        onChange={handleChange}
        className={styles.select}
      >
        <option value="ko">🇰🇷 한국어 (한국어)</option>
        <option value="en">🇺🇸 English (영어)</option>
        <option value="ja">🇯🇵 日本語 (일본어)</option>
        <option value="zh-CN">🇨🇳 中文(简体) (중국어 간체)</option>
        <option value="zh-TW">🇹🇼 中文(繁體) (중국어 번체)</option>
        <option value="fr">🇫🇷 Français (프랑스어)</option>
        <option value="de">🇩🇪 Deutsch (독일어)</option>
        <option value="es">🇪🇸 Español (스페인어)</option>
        <option value="ru">🇷🇺 Русский (러시아어)</option>
        <option value="vi">🇻🇳 Tiếng Việt (베트남어)</option>
        <option value="th">🇹🇭 ภาษาไทย (태국어)</option>
        <option value="id">🇮🇩 Bahasa Indonesia (인도네시아어)</option>
        <option value="hi">🇮🇳 हिन्दी (힌디어)</option>
        <option value="ar">🇸🇦 العربية (아랍어)</option>
        <option value="ta">🇮🇳 தமிழ் (타밀어)</option>
        <option value="te">🇮🇳 తెలుగు (텔루구어)</option>
        <option value="bn">🇧🇩 বাংলা (벵골어)</option>
        <option value="ur">🇵🇰 اردو (우르두어)</option>
        <option value="ml">🇮🇳 മലയാളം (말라얄람어)</option>
        <option value="km">🇰🇭 ភាសាខ្មែរ (크메르어)</option>
        <option value="my">🇲🇲 မြန်မာစာ (미얀마어)</option>
        <option value="ne">🇳🇵 नेपाली (네팔어)</option>
        <option value="lo">🇱🇦 ພາສາລາວ (라오어)</option>
        <option value="mn">🇲🇳 Монгол (몽골어)</option>
        <option value="ps">🇦🇫 پښتو (파슈토어)</option>
        <option value="si">🇱🇰 සිංහල (신할라어)</option>
        <option value="tg">🇹🇯 тоҷикӣ (타지크어)</option>
        <option value="uz">🇺🇿 O‘zbekcha (우즈벡어)</option>
        <option value="kk">🇰🇿 Қазақ тілі (카자흐어)</option>
      </select>
    </div>
  );
};

export default GoogleTranslate;
