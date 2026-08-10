import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import styles from "./Chatbot.module.css";
import { Send } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { getNewsDetailsAsk } from "../../api/detailsAPI.js";
import {
  getAnonymousChatsByArticle,
  getChatsByArticle,
} from "../../api/chatAPI.js";

import TranslatedText from "../../api/TranslatedText.jsx";
import { fetchTranslatedText } from "../../api/fetchTranslatedText.jsx";
import { useLanguage } from "../../util/LanguageContext.jsx";
import { useAuth } from "../../util/AuthContext.jsx";
import { getOrCreateAnonymousSessionId } from "../../util/anonymousSession.js";
import { getApiErrorMessage } from "../../api/apiClient.js";
import ApiErrorMessage from "../commons/apiState/ApiErrorMessage.jsx";

export default function Chatbot({ articleId }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [historyError, setHistoryError] = useState("");
  const chatRef = useRef(null);
  const closeEventSourceRef = useRef(null);

  const { language } = useLanguage();
  const { token } = useAuth();

  const [placeholder, setPlaceholder] = useState("질문을 입력하세요...");

  // 인사말 번역 + 로그인·비로그인 이전 대화 내역 (비로그인: Redis + anonymousSession)
  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      const translatedGreeting = await fetchTranslatedText(
        "안녕하세요! 무엇을 도와드릴까요?",
        language,
      );
      const translatedPlaceholder = await fetchTranslatedText(
        "질문을 입력하세요...",
        language,
      );
      if (cancelled) return;
      setPlaceholder(translatedPlaceholder);
      setHistoryError("");

      const buildFromHistory = (history, greeting) => {
        if (!history?.length) {
          return [{ type: "bot", text: greeting }];
        }
        const historyMessages = [];
        history.forEach((chat) => {
          const q = chat?.question ?? "";
          const a = chat?.answer ?? "";
          if (!q && !a) return;
          historyMessages.push({ type: "user", text: q });
          historyMessages.push({ type: "bot", text: a });
        });
        if (historyMessages.length === 0) {
          return [{ type: "bot", text: greeting }];
        }
        return [
          { type: "bot", text: greeting },
          { type: "divider", kind: "history" },
          ...historyMessages,
          { type: "divider", kind: "new" },
        ];
      };

      try {
        if (token && articleId) {
          const history = await getChatsByArticle(articleId);
          if (cancelled) return;
          setMessages(buildFromHistory(history, translatedGreeting));
        } else if (articleId) {
          const sessionId = getOrCreateAnonymousSessionId();
          const history = sessionId
            ? await getAnonymousChatsByArticle(articleId, sessionId)
            : [];
          if (cancelled) return;
          setMessages(buildFromHistory(history, translatedGreeting));
        } else {
          if (cancelled) return;
          setMessages([{ type: "bot", text: translatedGreeting }]);
        }
      } catch (error) {
        if (cancelled) return;
        setMessages([{ type: "bot", text: translatedGreeting }]);
        setHistoryError(getApiErrorMessage(error, "이전 대화를 불러오지 못했습니다."));
      }
    };

    init();
    return () => {
      cancelled = true;
    };
  }, [articleId, language, token]);

  useEffect(() => {
    return () => {
      if (closeEventSourceRef.current) closeEventSourceRef.current();
    };
  }, []);

  const handleSend = () => {
    if (!input.trim() || isStreaming) return;

    const userText = input;
    const newMessages = [...messages, { type: "user", text: userText }];
    setMessages([...newMessages, { type: "bot", text: "" }]);
    setInput("");
    setIsStreaming(true);

    const anonymousSessionId = token ? null : getOrCreateAnonymousSessionId();

    const close = getNewsDetailsAsk(
      articleId,
      userText,
      (chunk) => {
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            text: updated[updated.length - 1].text + chunk,
          };
          return updated;
        });
      },
      () => {
        setIsStreaming(false);
      },
      (error) => {
        console.error("스트리밍 에러:", error);
        setIsStreaming(false);
        setMessages((prev) => {
          const updated = [...prev];
          if (updated[updated.length - 1].text === "") {
            updated[updated.length - 1] = {
              type: "bot",
              text: "",
              fetchError: true,
            };
          }
          return updated;
        });
      },
      token,
      anonymousSessionId,
    );

    closeEventSourceRef.current = close;
  };

  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className={styles.chatbot}>
      <div className={styles.chatHeader}>Global AI</div>
      {!token && (
        <div className={styles.loginNotice}>
          <span aria-hidden>💡 </span>
          <TranslatedText text="비로그인 상태에서는 대화가 짧은 기간(7일) 동안만 일시적으로 유지되며, 로그인하면 계정에 영구 저장됩니다." />
        </div>
      )}
      <ApiErrorMessage message={historyError} />
      <div className={styles.chatBody} ref={chatRef}>
        {messages.map((msg, index) => {
          if (msg.type === "divider") {
            return (
              <div key={index} className={styles.divider}>
                <TranslatedText
                  text={
                    msg.kind === "history"
                      ? "── 이전 대화 내역 ──"
                      : "── 새 대화 ──"
                  }
                />
              </div>
            );
          }
          if (msg.type === "bot" && msg.fetchError) {
            return (
              <div key={index} className={styles.botMessage}>
                <TranslatedText text="응답을 가져오는 데 실패했습니다." />
              </div>
            );
          }
          return (
            <div
              key={index}
              className={
                msg.type === "bot" ? styles.botMessage : styles.userMessage
              }
            >
              {msg.type === "bot" ? (
                <div className={styles.markdown}>
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              ) : (
                msg.text
              )}
            </div>
          );
        })}
        {isStreaming &&
          messages[messages.length - 1]?.text === "" &&
          !messages[messages.length - 1]?.fetchError && (
            <div className={styles.botMessage}>
              <span className={styles.typingIndicator}>
                <span />
                <span />
                <span />
              </span>
            </div>
          )}
      </div>
      <div className={styles.chatInput}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          disabled={isStreaming}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend} disabled={isStreaming}>
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}

Chatbot.propTypes = {
  articleId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};
