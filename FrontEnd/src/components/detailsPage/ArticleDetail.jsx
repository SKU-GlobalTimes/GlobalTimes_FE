import styles from "./ArticleDetail.module.css";
import { FaBookmark } from "react-icons/fa";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { MutatingDots } from "react-loader-spinner";
import ReactMarkdown from "react-markdown";

import TranslatedText from "../../api/TranslatedText.jsx";
import { fetchTranslatedText } from "../../api/fetchTranslatedText.jsx";
import { useAuth } from "../../util/AuthContext.jsx";
import { useLanguage } from "../../util/LanguageContext.jsx";
import { useTranslatedLabel } from "../../hooks/useTranslatedLabel.js";
import { toggleScrap, getScrapStatus } from "../../api/scrapAPI.js";
import { getApiErrorMessage } from "../../api/apiClient.js";
import ApiErrorMessage from "../commons/apiState/ApiErrorMessage.jsx";

/** RSS/DB에 url이 없거나 문자열 "null" 등인 경우 — img 렌더 생략 */
function hasArticleImageUrl(url) {
  if (url == null || typeof url !== "string") return false;
  const u = url.trim();
  if (!u || u === "null" || u === "undefined") return false;
  return /^https?:\/\//i.test(u);
}

export default function ArticleDetail({
  id,
  newsDetail,
  content,
  isLoading,
  isSummaryLoading,
  summaryError,
}) {
  const articleId = Number(id);
  const { title, author, sourceName, publishedAt, viewCount, urlToImage } =
    newsDetail;
  const { token } = useAuth();
  const { language } = useLanguage();
  const imageAlt = useTranslatedLabel("기사 이미지");

  const [isScrapped, setIsScrapped] = useState(false);
  const [showModal, setShowModal] = useState(false);
  /** 유효 URL이어도 404·만료 시 깨진 아이콘 방지 */
  const [imageLoadFailed, setImageLoadFailed] = useState(false);
  /** 요약 마크다운: 전역 UI 언어로 번역된 문자열 (제목과 동일하게 Google 번역) */
  const [translatedMarkdown, setTranslatedMarkdown] = useState("");
  const [scrapError, setScrapError] = useState("");

  useEffect(() => {
    const initScrapStatus = async () => {
      if (token) {
        try {
          const status = await getScrapStatus(articleId);
          setIsScrapped(status);
        } catch (error) {
          setScrapError(getApiErrorMessage(error, "스크랩 상태를 확인하지 못했습니다."));
        }
      } else {
        const storedScrapIds =
          JSON.parse(localStorage.getItem("scrapIds")) || [];
        setIsScrapped(storedScrapIds.includes(articleId));
      }
    };
    initScrapStatus();
  }, [articleId, token]);

  useEffect(() => {
    setImageLoadFailed(false);
  }, [urlToImage]);

  useEffect(() => {
    if (!content) {
      setTranslatedMarkdown("");
      return;
    }
    setTranslatedMarkdown(content);
    let cancelled = false;
    (async () => {
      const next = await fetchTranslatedText(content, language);
      if (!cancelled) setTranslatedMarkdown(next);
    })();
    return () => {
      cancelled = true;
    };
  }, [content, language]);

  // 버튼 클릭 → 모달 열기
  function clickScrapBTN() {
    setShowModal(true);
  }

  // 모달에서 확인 → 실제 스크랩 토글
  async function handleConfirmScrap() {
    setShowModal(false);
    if (token) {
      try {
        setScrapError("");
        const result = await toggleScrap(articleId);
        setIsScrapped(result);
      } catch (error) {
        setScrapError(getApiErrorMessage(error, "스크랩을 변경하지 못했습니다."));
      }
    } else {
      const storedScrapIds = JSON.parse(localStorage.getItem("scrapIds")) || [];
      if (!storedScrapIds.includes(articleId)) {
        storedScrapIds.push(articleId);
        localStorage.setItem("scrapIds", JSON.stringify(storedScrapIds));
        setIsScrapped(true);
      } else {
        const updatedScrapIds = storedScrapIds.filter((id) => id !== articleId);
        localStorage.setItem("scrapIds", JSON.stringify(updatedScrapIds));
        setIsScrapped(false);
      }
    }
  }

  const dateLocale =
    language === "ja" ? "ja-JP" : language === "ko" ? "ko-KR" : "en-US";

  if (isLoading) {
    return (
      <div className={styles.articleDetail} aria-busy="true">
        <MutatingDots
          height={100}
          width={100}
          color="#4fa94d"
          secondaryColor="#ccc"
          radius={12.5}
          ariaLabel="article-detail-loading"
          visible
        />
      </div>
    );
  }

  return (
    <div className={styles.articleDetail}>
      {/* 스크랩 확인 모달 */}
      {showModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowModal(false)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalIcon}>
              <FaBookmark
                className={
                  isScrapped ? styles.modalIconActive : styles.modalIconDefault
                }
              />
            </div>
            <p className={styles.modalMessage}>
              <span className={styles.modalPress}>{sourceName}</span>
              <br />
              <span className={styles.modalTitle}>
                「<TranslatedText text={title} />」
              </span>
              <br />
              <TranslatedText
                text={
                  isScrapped
                    ? "스크랩을 취소하시겠습니까?"
                    : "기사를 스크랩하시겠습니까?"
                }
              />
            </p>
            <div className={styles.modalButtons}>
              <button
                className={styles.modalCancel}
                onClick={() => setShowModal(false)}
              >
                <TranslatedText text="아니오" />
              </button>
              <button
                className={`${styles.modalConfirm} ${isScrapped ? styles.modalConfirmRemove : ""}`}
                onClick={handleConfirmScrap}
              >
                <TranslatedText text={isScrapped ? "취소하기" : "스크랩"} />
              </button>
            </div>
          </div>
        </div>
      )}

      <h1>
        <TranslatedText text={title} />
      </h1>
      <div className={styles.infoContainer}>
        <p className={styles.timeText}>
          {(() => {
            try {
              if (!publishedAt) return "";
              const iso = publishedAt.includes("T")
                ? publishedAt
                : publishedAt.replace(" ", "T").split(".")[0];
              const d = new Date(iso);
              return isNaN(d.getTime()) ? "" : d.toLocaleString(dateLocale);
            } catch (e) {
              return "";
            }
          })()}
        </p>
        <div className={styles.stats}>
          <span>
            <TranslatedText text="조회수" />
            {viewCount}
          </span>
          <button
            className={`${styles.scrap} ${isScrapped ? styles.scrapActive : ""}`}
            onClick={clickScrapBTN}
          >
            <FaBookmark
              className={`${styles.icon} ${isScrapped ? styles.active : ""}`}
            />
            <span className={styles.scrapLabel}>
              <TranslatedText text={isScrapped ? "스크랩됨" : "스크랩"} />
            </span>
          </button>
        </div>
      </div>
      <p className={styles.meta}>
        {sourceName} - {author}
      </p>
      <ApiErrorMessage message={scrapError} />
      {hasArticleImageUrl(urlToImage) && !imageLoadFailed ? (
        <img
          src={urlToImage.trim()}
          alt={imageAlt}
          className={styles.image}
          onError={() => setImageLoadFailed(true)}
        />
      ) : null}
      {/* 기사 요약내용 - 상세 정보와 독립적으로 로딩 */}
      {isSummaryLoading ? (
        <MutatingDots
          height={100}
          width={100}
          color="#4fa94d"
          secondaryColor="#ccc"
          radius={12.5}
          ariaLabel="mutating-dots-loading"
          visible={true}
        />
      ) : summaryError ? (
        <ApiErrorMessage message={summaryError} />
      ) : content ? (
        <div className={styles.content}>
          <ReactMarkdown>{translatedMarkdown}</ReactMarkdown>
        </div>
      ) : (
        <p className={styles.content}>
          <TranslatedText text="요약 정보를 불러올 수 없습니다." />
        </p>
      )}
    </div>
  );
}

ArticleDetail.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  newsDetail: PropTypes.shape({
    title: PropTypes.string,
    author: PropTypes.string,
    sourceName: PropTypes.string,
    publishedAt: PropTypes.string,
    viewCount: PropTypes.number,
    urlToImage: PropTypes.string,
  }).isRequired,
  content: PropTypes.string,
  isLoading: PropTypes.bool.isRequired,
  isSummaryLoading: PropTypes.bool.isRequired,
  summaryError: PropTypes.string,
};
