import styles from "./Sidebar.module.css";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { Bars } from "react-loader-spinner";

//번역 컴포넌트
import TranslatedText from "../../api/TranslatedText";

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
      <h2>
        <TranslatedText text="최근기사" />
      </h2>
      <ul>
        {recentNewsList.map((article) => (
          <li
            key={article.id}
            className={styles.articleItem}
            onClick={() => navigate(`/detail/${article.id}`)}
          >
            <div
              className={styles.thumbnail}
              style={{
                backgroundImage: article.urlToImage
                  ? `url(${article.urlToImage})`
                  : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div>
              <p className={styles.articleSource}>
                <TranslatedText text={article.sourceName} />
              </p>
              <p className={styles.articleTitle}>
                <TranslatedText text={article.title} />
              </p>
              <p className={styles.articleTime}>
                {(() => {
                  try {
                    if (!article.publishedAt) return "";
                    const iso = article.publishedAt.includes("T")
                      ? article.publishedAt
                      : article.publishedAt.replace(" ", "T").split(".")[0];
                    const d = new Date(iso);
                    return isNaN(d.getTime()) ? "" : d.toLocaleString("ko-KR");
                  } catch (e) {
                    return "";
                  }
                })()}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

Sidebar.propTypes = {
  recentNewsList: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      sourceName: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      urlToImage: PropTypes.string,
      publishedAt: PropTypes.string,
    }),
  ),
};
