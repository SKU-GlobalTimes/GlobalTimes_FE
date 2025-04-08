import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getNewsDetails, getNewsDetailsSummary } from "../api/detailsAPI";
import styles from "./DetailsPage.module.css";
import ArticleDetail from "../components/detailsPage/ArticleDetail";
import Sidebar from "../components/detailsPage/Sidebar";
import Chatbot from "../components/detailsPage/Chatbot";

export default function DetailsPage() {
  const { id } = useParams(); // URL에서 기사 ID 가져오기
  const [newsDetail, setNewsDetail] = useState("");
  const [recentNewsList, setRecentNewsList] = useState([]);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        // 먼저 뉴스 상세 요청
        const detailRes = await getNewsDetails(id);
        if (detailRes?.isSuccess) {
          setNewsDetail(detailRes.data.newsDetail);
          setRecentNewsList(detailRes.data.recentNewsList);
        }

        // 뉴스 요약 요청
        const summaryRes = await getNewsDetailsSummary(id);
        if (summaryRes && typeof summaryRes.data === "string") {
          setContent(summaryRes.data);
        }
        setIsLoading(false);

      } catch (error) {
        console.error("Error fetching data:", error);
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
          <ArticleDetail 
            id={id} 
            newsDetail={newsDetail} 
            content={content} 
            isLoading={isLoading}
            />
          <Chatbot articleId={id} />
        </div>
        <div className={styles.sidebar}>
          <Sidebar recentNewsList={recentNewsList} />
        </div>
      </div>
    </div>
  );
}
