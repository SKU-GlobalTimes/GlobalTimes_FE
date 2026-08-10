import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getNewsDetails, getNewsDetailsSummary } from "../api/detailsAPI";
import styles from "./DetailsPage.module.css";
import ArticleDetail from "../components/detailsPage/ArticleDetail";
import PerspectivesSection from "../components/detailsPage/PerspectivesSection";
import Sidebar from "../components/detailsPage/Sidebar";
import Chatbot from "../components/detailsPage/Chatbot";
import ApiErrorMessage from "../components/commons/apiState/ApiErrorMessage";
import { getApiErrorMessage } from "../api/apiClient";

export default function DetailsPage() {
  const { id } = useParams();
  const [newsDetail, setNewsDetail] = useState({});
  const [recentNewsList, setRecentNewsList] = useState([]);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSummaryLoading, setIsSummaryLoading] = useState(true);
  const [detailError, setDetailError] = useState("");
  const [summaryError, setSummaryError] = useState("");

  useEffect(() => {
    const fetchDetail = async () => {
      setIsLoading(true);
      setDetailError("");
      try {
        const detailRes = await getNewsDetails(id);
        if (detailRes?.isSuccess) {
          setNewsDetail(detailRes.data.newsDetail);
          setRecentNewsList(detailRes.data.recentNewsList);
        }
      } catch (error) {
        setDetailError(getApiErrorMessage(error, "기사 정보를 불러오지 못했습니다."));
      } finally {
        setIsLoading(false);
      }
    };

    const fetchSummary = async () => {
      setIsSummaryLoading(true);
      setSummaryError("");
      try {
        const summaryRes = await getNewsDetailsSummary(id);
        if (summaryRes && typeof summaryRes.data === "string") {
          setContent(summaryRes.data);
        }
      } catch (error) {
        setSummaryError(getApiErrorMessage(error, "기사 요약을 불러오지 못했습니다."));
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
          {detailError ? (
            <ApiErrorMessage message={detailError} />
          ) : (
            <>
              <ArticleDetail
                id={id}
                newsDetail={newsDetail}
                content={content}
                isLoading={isLoading}
                isSummaryLoading={isSummaryLoading}
                summaryError={summaryError}
              />
              <PerspectivesSection articleId={id} />
              <Chatbot articleId={id} />
            </>
          )}
        </div>
        <div className={styles.sidebar}>
          <Sidebar recentNewsList={recentNewsList} />
        </div>
      </div>
    </div>
  );
}
