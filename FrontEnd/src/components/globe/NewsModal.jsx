import { useEffect, useState } from "react";
import styles from "./NewsModal.module.css";
import { IoClose } from "react-icons/io5";
import { getSummary } from "../../api/landingPageAPI";
import { ClipLoader } from "react-spinners";

const NewsModal = ({ news, onClose }) => {
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (news?.url) {
      setIsLoading(true); // 요청 시작
      getSummary(news.url)
        .then((data) => setSummary(data))
        .catch(() => setSummary("해당 언론사는 요약 정보 제공이 불가능합니다."))
        .finally(() => setIsLoading(false)); // 요청 완료
    }
  }, [news?.url]);

  if (!news) return null;

  return (
    <div className={styles.newsModal}>
      <div className={styles.titleContainer}>
        <p>{news.sourceName}</p>
        <IoClose className={styles.closeIcon} onClick={onClose} />
      </div>
      <h3>
        <a
          href={news.url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.newsTitle}
        >
          {news.title}
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
            <p>{summary}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsModal;
