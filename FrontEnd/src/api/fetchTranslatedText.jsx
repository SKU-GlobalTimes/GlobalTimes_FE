import axios from "axios";

export const fetchTranslatedText = async (text, language) => {
    const cleanedText = text
      .replace(/’/g, "'")
      .replace(/…/g, "...")
      .replace(/[“”]/g, '"');
  
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
  
      return response.data.data.translations[0].translatedText;
    } catch (error) {
      console.error("Placeholder 번역 실패:", error);
      return text;
    }
  };