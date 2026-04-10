import { useEffect, useState } from "react";
import { useLanguage } from "../util/LanguageContext";
import axios from "axios";
import { DEFAULT_UI_LANGUAGE } from "../constants/uiLanguage.js";

// HTML 엔티티 디코딩 함수
const decodeHTMLEntities = (text) => {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = text;
    return textarea.value;
};

// sessionStorage 기반 번역 캐시 (세션 내 동일 텍스트+언어 재호출 방지)
const getCacheKey = (text, lang) => `translation::${lang}::${text}`;

const getCache = (text, lang) => {
    try {
        return sessionStorage.getItem(getCacheKey(text, lang));
    } catch {
        return null;
    }
};

const setCache = (text, lang, result) => {
    try {
        sessionStorage.setItem(getCacheKey(text, lang), result);
    } catch {
        // sessionStorage 용량 초과 시 무시
    }
};

const TranslatedText = ({ text }) => {
    const { language } = useLanguage();
    /* 첫 페인트부터 원문 표시 → 빈 칸 방지, 이후 번역으로 갱신 */
    const [translated, setTranslated] = useState(() => text ?? "");

    useEffect(() => {
        const translate = async () => {
            if (!text) return;

            // 특수문자 대체
            const cleanedText = text
                .replace(/\u2018/g, "'")
                .replace(/\u2026/g, "...")
                .replace(/[\u201C\u201D]/g, '"');

            if (language === DEFAULT_UI_LANGUAGE) {
                setTranslated(cleanedText);
                return;
            }

            // 캐시 히트 시 API 호출 없이 반환
            const cached = getCache(cleanedText, language);
            if (cached !== null) {
                setTranslated(cached);
                return;
            }

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
                const decodedTranslated = decodeHTMLEntities(rawTranslated);

                setCache(cleanedText, language, decodedTranslated);
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
