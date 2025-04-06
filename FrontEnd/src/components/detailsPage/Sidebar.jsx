import styles from "./Sidebar.module.css";
import { useNavigate } from "react-router-dom";
import { Bars } from "react-loader-spinner";

export default function Sidebar({ recentNewsList }) {
  const navigate = useNavigate();

  if (!recentNewsList || recentNewsList.length === 0)
    return (
      <div className={styles.loadingContainer}>
        <Bars
          height="60"
          width="60"
          color="#000"
          ariaLabel="bars-loading"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      </div>
    );

  return (
    <div className={styles.sidebar}>
      <h2>최근기사</h2>
      <ul>
        {recentNewsList.map((article) => (
          <li
            key={article.id}
            className={styles.articleItem}
            onClick={() => navigate(`/detail/${article.id}`)}
          >
            <img
              src={article.urlToImage}
              alt="썸네일"
              className={styles.thumbnail}
            />
            <div>
              <p className={styles.articleSource}>{article.sourceName}</p>
              <p className={styles.articleTitle}>{article.title}</p>
              <p className={styles.articleTime}>
                {new Date(article.publishedAt).toLocaleString("ko-KR")}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
