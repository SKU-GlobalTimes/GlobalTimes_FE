import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import styles from "./Chatbot.module.css";
import { RotateCcw, Send } from "lucide-react";
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
  const [activeResponseId, setActiveResponseId] = useState(null);
  const [historyError, setHistoryError] = useState("");
  const chatRef = useRef(null);
  const closeEventSourceRef = useRef(null);
  const requestSequenceRef = useRef(0);
  const responseSequenceRef = useRef(0);
  const conversationRevisionRef = useRef(0);

  const { language } = useLanguage();
  const { token } = useAuth();

  const [placeholder, setPlaceholder] = useState("질문을 입력하세요...");

  // 인사말 번역 + 로그인·비로그인 이전 대화 내역 (비로그인: Redis + anonymousSession)
  useEffect(() => {
    let cancelled = false;
    const initialConversationRevision = conversationRevisionRef.current;

    setMessages([]);
    setHistoryError("");

    const init = async () => {
      const translatedGreeting = await fetchTranslatedText(
        "안녕하세요! 무엇을 도와드릴까요?",
        language,
      );
      const translatedPlaceholder = await fetchTranslatedText(
        "질문을 입력하세요...",
        language,
      );
      if (
        cancelled ||
        conversationRevisionRef.current !== initialConversationRevision
      ) return;
      setPlaceholder(translatedPlaceholder);

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
          if (
            cancelled ||
            conversationRevisionRef.current !== initialConversationRevision
          ) return;
          setMessages(buildFromHistory(history, translatedGreeting));
        } else if (articleId) {
          const sessionId = getOrCreateAnonymousSessionId();
          const history = sessionId
            ? await getAnonymousChatsByArticle(articleId, sessionId)
            : [];
          if (
            cancelled ||
            conversationRevisionRef.current !== initialConversationRevision
          ) return;
          setMessages(buildFromHistory(history, translatedGreeting));
        } else {
          if (
            cancelled ||
            conversationRevisionRef.current !== initialConversationRevision
          ) return;
          setMessages([{ type: "bot", text: translatedGreeting }]);
        }
      } catch (error) {
        if (
          cancelled ||
          conversationRevisionRef.current !== initialConversationRevision
        ) return;
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
    setIsStreaming(false);
    setActiveResponseId(null);
    return () => {
      requestSequenceRef.current += 1;
      if (closeEventSourceRef.current) {
        closeEventSourceRef.current();
        closeEventSourceRef.current = null;
      }
    };
  }, [articleId]);

  const closeCurrentStream = () => {
    if (!closeEventSourceRef.current) return;
    closeEventSourceRef.current();
    closeEventSourceRef.current = null;
  };

  const updateResponse = (responseId, updater) => {
    setMessages((prev) =>
      prev.map((message) =>
        message.id === responseId ? updater(message) : message,
      ),
    );
  };

  const startRequest = (question, responseId) => {
    closeCurrentStream();
    const requestSequence = requestSequenceRef.current + 1;
    requestSequenceRef.current = requestSequence;
    setIsStreaming(true);
    setActiveResponseId(responseId);

    const finishRequest = () => {
      if (requestSequenceRef.current !== requestSequence) return false;
      closeEventSourceRef.current = null;
      setIsStreaming(false);
      setActiveResponseId(null);
      return true;
    };

    const failRequest = () => {
      if (!finishRequest()) return;
      updateResponse(responseId, (message) => ({
        ...message,
        fetchError: true,
        retryQuestion: question,
      }));
    };

    const anonymousSessionId = token ? null : getOrCreateAnonymousSessionId();

    try {
      const close = getNewsDetailsAsk(
        articleId,
        question,
        (chunk) => {
          if (requestSequenceRef.current !== requestSequence) return;
          updateResponse(responseId, (message) => ({
            ...message,
            text: message.text + chunk,
          }));
        },
        finishRequest,
        (error) => {
          console.error("스트리밍 에러:", error);
          failRequest();
        },
        token,
        anonymousSessionId,
      );

      closeEventSourceRef.current = close;
    } catch (error) {
      console.error("SSE 연결 생성 오류:", error);
      failRequest();
    }
  };

  const handleSend = () => {
    const question = input.trim();
    if (!question || isStreaming) return;

    const responseId = `stream-${responseSequenceRef.current + 1}`;
    responseSequenceRef.current += 1;
    conversationRevisionRef.current += 1;
    setMessages((prev) => [
      ...prev,
      { type: "user", text: question },
      {
        id: responseId,
        type: "bot",
        text: "",
        fetchError: false,
        retryQuestion: question,
      },
    ]);
    setInput("");
    startRequest(question, responseId);
  };

  const handleRetry = (message) => {
    if (isStreaming || !message.id || !message.retryQuestion) return;
    updateResponse(message.id, (current) => ({
      ...current,
      text: "",
      fetchError: false,
    }));
    startRequest(message.retryQuestion, message.id);
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
          return (
            <div
              key={msg.id ?? index}
              className={
                msg.type === "bot" ? styles.botMessage : styles.userMessage
              }
            >
              {msg.type === "bot" ? (
                <>
                  {msg.text && (
                    <div className={styles.markdown}>
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  )}
                  {msg.id === activeResponseId && !msg.text && !msg.fetchError && (
                    <span className={styles.typingIndicator}>
                      <span />
                      <span />
                      <span />
                    </span>
                  )}
                  {msg.fetchError && (
                    <div className={styles.streamError} role="alert">
                      <TranslatedText text="응답 연결이 중단되었습니다." />
                      <button
                        type="button"
                        onClick={() => handleRetry(msg)}
                        disabled={isStreaming}
                        title="같은 질문 다시 시도"
                      >
                        <RotateCcw size={15} aria-hidden />
                        <TranslatedText text="다시 시도" />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                msg.text
              )}
            </div>
          );
        })}
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
        <button
          type="button"
          onClick={handleSend}
          disabled={isStreaming}
          title="질문 보내기"
          aria-label="질문 보내기"
        >
          <Send size={20} aria-hidden />
        </button>
      </div>
    </div>
  );
}

Chatbot.propTypes = {
  articleId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};
