import styles from "./ArticleDetail.module.css";
import { FaBookmark } from "react-icons/fa";

export default function ArticleDetail({ newsDetail, content }) {
  const { title, author, sourceName, publishedAt, viewCount, urlToImage } =
    newsDetail;

  return (
    <div className={styles.articleDetail}>
      <h1>{title}</h1>
      <div className={styles.infoContainer}>
        <p className={styles.timeText}>
          {new Date(publishedAt).toLocaleString()}
        </p>
        <div className={styles.stats}>
          <span>조회수 {viewCount}</span>
          <span className={styles.scrap}>
            스크랩 <FaBookmark className={styles.icon} />
          </span>
        </div>
      </div>
      <p className={styles.meta}>
        {sourceName} - {author}
      </p>
      <img src={urlToImage} alt="기사 이미지" className={styles.image} />
      <p className={styles.content}>{content}</p>
    </div>
  );
}
