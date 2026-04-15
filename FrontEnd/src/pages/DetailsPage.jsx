import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getNewsDetails, getNewsDetailsSummary } from "../api/detailsAPI";
import styles from "./DetailsPage.module.css";
import ArticleDetail from "../components/detailsPage/ArticleDetail";
import PerspectivesSection from "../components/detailsPage/PerspectivesSection";
import Sidebar from "../components/detailsPage/Sidebar";
import Chatbot from "../components/detailsPage/Chatbot";

export default function DetailsPage() {
  const { id } = useParams();
  const [newsDetail, setNewsDetail] = useState("");
  const [recentNewsList, setRecentNewsList] = useState([]);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSummaryLoading, setIsSummaryLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      setIsLoading(true);
      try {
        const detailRes = await getNewsDetails(id);
        if (detailRes?.isSuccess) {
          setNewsDetail(detailRes.data.newsDetail);
          setRecentNewsList(detailRes.data.recentNewsList);
        }
      } catch (error) {
        console.error("상세 정보 로딩 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchSummary = async () => {
      setIsSummaryLoading(true);
      try {
        const summaryRes = await getNewsDetailsSummary(id);
        if (summaryRes && typeof summaryRes.data === "string") {
          setContent(summaryRes.data);
        }
      } catch (error) {
        console.error("요약 로딩 실패:", error);
      } finally {
        setIsSummaryLoading(false);
      }
    };

    if (id) {
      fetchDetail();
      fetchSummary();
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
            isSummaryLoading={isSummaryLoading}
            />
          <PerspectivesSection articleId={id} />
          <Chatbot articleId={id} />
        </div>
        <div className={styles.sidebar}>
          <Sidebar recentNewsList={recentNewsList} />
        </div>
      </div>
    </div>
  );
}
