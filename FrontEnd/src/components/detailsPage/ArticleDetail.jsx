import styles from "./ArticleDetail.module.css";
import { FaBookmark } from "react-icons/fa";
import { useState, useEffect } from "react";
import { MutatingDots } from "react-loader-spinner";
import ReactMarkdown from "react-markdown";

import TranslatedText from "../../api/TranslatedText.jsx";
import { useAuth } from "../../util/AuthContext.jsx";
import { useLanguage } from "../../util/LanguageContext.jsx";
import { useTranslatedLabel } from "../../hooks/useTranslatedLabel.js";
import { toggleScrap, getScrapStatus } from "../../api/scrapAPI.js";

export default function ArticleDetail({ id, newsDetail, content, isLoading, isSummaryLoading }) {
  const articleId = Number(id);
  const { title, author, sourceName, publishedAt, viewCount, urlToImage } = newsDetail;
  const { token } = useAuth();
  const { language } = useLanguage();
  const imageAlt = useTranslatedLabel("기사 이미지");

  const [isScrapped, setIsScrapped] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const initScrapStatus = async () => {
      if (token) {
        const status = await getScrapStatus(articleId);
        setIsScrapped(status);
      } else {
        const storedScrapIds = JSON.parse(localStorage.getItem("scrapIds")) || [];
        setIsScrapped(storedScrapIds.includes(articleId));
      }
    };
    initScrapStatus();
  }, [articleId, token]);

  // 버튼 클릭 → 모달 열기
  function clickScrapBTN() {
    setShowModal(true);
  }

  // 모달에서 확인 → 실제 스크랩 토글
  async function handleConfirmScrap() {
    setShowModal(false);
    if (token) {
      const result = await toggleScrap(articleId);
      if (result !== null) setIsScrapped(result);
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

  return (
    <div className={styles.articleDetail}>

      {/* 스크랩 확인 모달 */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalIcon}>
              <FaBookmark className={isScrapped ? styles.modalIconActive : styles.modalIconDefault} />
            </div>
            <p className={styles.modalMessage}>
              <span className={styles.modalPress}>{sourceName}</span>
              <br />
              <span className={styles.modalTitle}>
                「<TranslatedText text={title} />」
              </span>
              <br />
              <TranslatedText text={isScrapped ? "스크랩을 취소하시겠습니까?" : "기사를 스크랩하시겠습니까?"} />
            </p>
            <div className={styles.modalButtons}>
              <button className={styles.modalCancel} onClick={() => setShowModal(false)}>
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

      <h1><TranslatedText text={title}/></h1>
      <div className={styles.infoContainer}>
        <p className={styles.timeText}>
          {new Date(publishedAt).toLocaleString(dateLocale)}
        </p>
        <div className={styles.stats}>
          <span><TranslatedText text="조회수"/>{viewCount}</span>
          <button
            className={`${styles.scrap} ${isScrapped ? styles.scrapActive : ""}`}
            onClick={clickScrapBTN}
          >
            <FaBookmark className={`${styles.icon} ${isScrapped ? styles.active : ""}`} />
            <span className={styles.scrapLabel}>
              <TranslatedText text={isScrapped ? "스크랩됨" : "스크랩"} />
            </span>
          </button>
        </div>
      </div>
      <p className={styles.meta}>
        {sourceName} - {author}
      </p>
      <img src={urlToImage} alt={imageAlt} className={styles.image} />
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
         ) : content ? (
           <div className={styles.content}>
             <ReactMarkdown>{content}</ReactMarkdown>
           </div>
         ) : (
           <p className={styles.content}>
             <TranslatedText text="요약 정보를 불러올 수 없습니다." />
           </p>
         )
       }
    </div>
  );
}
