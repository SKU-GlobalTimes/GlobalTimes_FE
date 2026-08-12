import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styles from "./NewsModal.module.css";
import { IoClose } from "react-icons/io5";
import { getSummary } from "../../api/landingPageAPI";
import { ClipLoader } from "react-spinners";

// 번역 컴포넌트
import TranslatedText from "../../api/TranslatedText";
import { getApiErrorMessage } from "../../api/apiClient";

const NewsModal = ({ news, onClose }) => {
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (news?.url) {
      setIsLoading(true); // 요청 시작
      getSummary(news.url)
        .then((data) => setSummary(data))
        .catch((error) =>
          setSummary(getApiErrorMessage(error, "요약 정보를 불러오지 못했습니다.")),
        )
        .finally(() => setIsLoading(false)); // 요청 완료
    }
  }, [news?.url]);

  if (!news) return null;

  return (
    <div className={styles.newsModal} role="dialog" aria-label={news.title}>
      <div className={styles.titleContainer}>
        <p><TranslatedText text={news.sourceName}/></p>
        <button
          type="button"
          className={styles.closeButton}
          aria-label="기사 닫기"
          onClick={onClose}
        >
          <IoClose className={styles.closeIcon} aria-hidden />
        </button>
      </div>
      <h3>
        <a
          href={news.url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.newsTitle}
        >
          <TranslatedText text={news.title}/>
        </a>
      </h3>
      <div className={styles.contentContainer}>
        {news.urlToImage && (
          <img
            src={news.urlToImage}
            alt={news.title}
            className={styles.image}
          />
        )}
        {/* 로딩 중이면 스피너 표시, 로딩 끝나면 요약 표시 */}
        <div className={styles.summary}>
          {isLoading ? (
            <div className={styles.loader}>
              <ClipLoader color="#000" size={30} />
            </div>
          ) : (
            <p><TranslatedText text={summary}/></p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsModal;

NewsModal.propTypes = {
  news: PropTypes.shape({
    url: PropTypes.string,
    sourceName: PropTypes.string,
    title: PropTypes.string,
    urlToImage: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};
