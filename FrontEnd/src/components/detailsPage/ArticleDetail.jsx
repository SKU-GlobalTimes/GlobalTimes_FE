import styles from "./ArticleDetail.module.css";
import { FaBookmark } from "react-icons/fa";

export default function ArticleDetail({ id, newsDetail, content }) {
  const articleId = Number(id);
  const { title, author, sourceName, publishedAt, viewCount, urlToImage } =
    newsDetail;

  function clickScrapBTN() {
    const storedScrapIds = JSON.parse(localStorage.getItem('scrapIds')) || [];

    if (!storedScrapIds.includes(articleId)) {
        storedScrapIds.push(articleId);
        localStorage.setItem('scrapIds', JSON.stringify(storedScrapIds)); // 키 수정
    }

    console.log("scrapIds = ", localStorage.getItem("scrapIds"));
  }

  return (
    <div className={styles.articleDetail}>
      <h1>{title}</h1>
      <div className={styles.infoContainer}>
        <p className={styles.timeText}>
          {new Date(publishedAt).toLocaleString()}
        </p>
        <div className={styles.stats}>
          <span>조회수 {viewCount}</span>
          <button 
            className={styles.scrap}
            onClick={clickScrapBTN}
            >
            스크랩 <FaBookmark className={styles.icon} />
          </button>
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
