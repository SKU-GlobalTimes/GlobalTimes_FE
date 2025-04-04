


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







/*

export async function getTranslate(page, size) {
    try {
        const baseUrl = `${import.meta.env.VITE_APP_API}/api/articles/latest?page=${page}&size=${size}`;
        const response = await axios.get(baseUrl);
        
        if (response.data.isSuccess === true) {
            // 날짜를 분리해서 새로운 객체 생성
            const formattedResults = response.data.data.content.map(article => {
                const date = new Date(article.publishedAt); // 문자열을 Date 객체로 변환
                return {
                    ...article,
                    year: date.getFullYear().toString(),
                    month: (date.getMonth() + 1).toString().padStart(2, '0'), // 두 자리로 맞춤
                    day: date.getDate().toString().padStart(2, '0'), // 두 자리로 맞춤
                };
            });

            return formattedResults;
        }
        else {
            return [];
        }
    } catch (error) {
        console.error("최근 뉴스 데이터를 불러오는 데 실패했습니다:", error);
        return [];
    }
}

*/







