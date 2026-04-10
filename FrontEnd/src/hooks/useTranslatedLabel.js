import { useState, useEffect } from "react";
import { useLanguage } from "../util/LanguageContext.jsx";
import { fetchTranslatedText } from "../api/fetchTranslatedText.jsx";

/**
 * 속성 aria-label / title / img alt 등 단일 문자열용.
 * 기본 언어(ko)는 fetchTranslatedText 내부에서 API 미호출.
 */
export function useTranslatedLabel(koreanText) {
  const { language } = useLanguage();
  const [label, setLabel] = useState(koreanText);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const t = await fetchTranslatedText(koreanText, language);
      if (!cancelled) setLabel(t);
    })();
    return () => {
      cancelled = true;
    };
  }, [koreanText, language]);

  return label;
}
