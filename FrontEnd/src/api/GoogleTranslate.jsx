import { useEffect } from "react";

const GoogleTranslate = () => {
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
          includedLanguages: "ko,en,ja,zh-CN",
          autoDisplay: true,
        },
        "google_translate_element"
      );
    };

    loadGoogleTranslateScript();
  }, []);

  const handleLanguageChange = (lang) => {
    const gtCombo = document.querySelector(".goog-te-combo");
    if (!gtCombo) {
      alert("Error: Could not find Google Translate dropdown.");
      return;
    }
    gtCombo.value = lang;
    gtCombo.dispatchEvent(new Event("change"));
  };

  return (
    <div>
      <div id="google_translate_element" style={{ display: "none" }}></div>
      <ul className="translation-links">
        <li>
          <button onClick={() => handleLanguageChange("ko")} title="Korean">
            🇰🇷 Korean
          </button>
        </li>
        <li>
          <button onClick={() => handleLanguageChange("en")} title="English">
            🇺🇸 English
          </button>
        </li>
        <li>
          <button onClick={() => handleLanguageChange("ja")} title="日本語">
            🇯🇵 日本語
          </button>
        </li>
        <li>
          <button onClick={() => handleLanguageChange("zh-CN")} title="中文(简体)">
            🇨🇳 中文(简体)
          </button>
        </li>
      </ul>
    </div>
  );
};

export default GoogleTranslate;
