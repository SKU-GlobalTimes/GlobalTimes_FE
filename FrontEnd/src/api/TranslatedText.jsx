import { useEffect, useState } from "react";
import { useLanguage } from "../util/LanguageContext";
import axios from "axios";

// HTML 엔티티 디코딩 함수
const decodeHTMLEntities = (text) => {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = text;
    return textarea.value;
  };

const TranslatedText = ({ text }) => {
    const { language } = useLanguage(); // 토글에 설정한 언어에 따라 언어 바뀜
    const [translated, setTranslated] = useState("");
  
    useEffect(() => {
      const translate = async () => {
        if (!text) return;

        // 특수문자 대체
        const cleanedText = text
          .replace(/’/g, "'")   // 스마트 따옴표 → 일반 따옴표
          .replace(/…/g, "...") // 줄임표 기호 → ...
          .replace(/[“”]/g, '"'); // 쌍따옴표도 처리

        try {
            const response = await axios.post(
                "https://translation.googleapis.com/language/translate/v2",
                {
                  q: cleanedText,
                  target: language,
                },
                {
                  params: {
                    key: import.meta.env.VITE_GOOGLE_API_KEY,
                  },
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );

            const rawTranslated = response.data.data.translations[0].translatedText;
            const decodedTranslated = decodeHTMLEntities(rawTranslated); // 👉 디코딩 적용
            setTranslated(decodedTranslated);
        } catch (error) {
          console.error("Translation Error:", error);
          setTranslated("(번역 실패)");
        }
      };
  
      translate();
    }, [language, text]);
    
    return <>{translated}</>;
  };
  
  export default TranslatedText;