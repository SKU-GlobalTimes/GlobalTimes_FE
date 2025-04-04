import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getNewsDetails, getNewsDetailsSummary } from "../api/detailsAPI";
import styles from "./DetailsPage.module.css";
import ArticleDetail from "../components/detailsPage/ArticleDetail";
import Sidebar from "../components/detailsPage/Sidebar";
import Chatbot from "../components/detailsPage/Chatbot";
import { CirclesWithBar } from "react-loader-spinner";

export default function DetailsPage() {
  const { id } = useParams(); // URL에서 기사 ID 가져오기
  const [newsDetail, setNewsDetail] = useState(null);
  const [recentNewsList, setRecentNewsList] = useState([]);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [detailRes, summaryRes] = await Promise.all([
          getNewsDetails(id),
          getNewsDetailsSummary(id),
        ]);

        if (detailRes?.isSuccess) {
          setNewsDetail(detailRes.data.newsDetail);
          setRecentNewsList(detailRes.data.recentNewsList);
        }

        if (summaryRes?.isSuccess && typeof summaryRes.data === "string") {
          setContent(summaryRes.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  return (
    <div className={styles.detailsPage}>
      <div className={styles.content}>
        <div className={styles.article}>
          {isLoading ? (
            <div className={styles.loadingWrapper}>
              <CirclesWithBar
                height="100"
                width="100"
                color="#000"
                outerCircleColor="#000"
                innerCircleColor="#000"
                barColor="#000"
                ariaLabel="circles-with-bar-loading"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
              />
            </div>
          ) : (
            <ArticleDetail newsDetail={newsDetail} content={content} />
          )}
          <Chatbot articleId={id} />
        </div>
        <div className={styles.sidebar}>
          <Sidebar recentNewsList={recentNewsList} />
        </div>
      </div>
    </div>
  );
}
