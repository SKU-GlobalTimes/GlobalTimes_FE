import styled from "./ScrapPage.module.css";
import { useState, useEffect } from "react";
import ScrapNewsCard from "../components/newsCard/ScrapNewsCard";
import Pagenation from "../components/mainPage/Pagenation";
import BlankNews from "../components/mainPage/BlankNews";
import { getScrap } from "../api/getNewsCardAPI";
import { getMyScrapList } from "../api/scrapAPI";
import { useAuth } from "../util/AuthContext";
import { parseApiDate } from "../util/date";
import { getApiErrorMessage } from "../api/apiClient";
import ApiErrorMessage from "../components/commons/apiState/ApiErrorMessage";

export default function ScrapPage() {
  const [scrapNews, setScrapNews] = useState([]);
  const [scrapPage, setScrapPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isScrapped, setIsScrapped] = useState(true);
  const [scrapError, setScrapError] = useState("");
  const { token } = useAuth();
  const newsPerPage = 12;

  useEffect(() => {
    async function fetchScrapNews() {
      setScrapError("");
      try {
        if (token) {
        // 로그인: BE DB에서 스크랩 목록 조회
        const data = await getMyScrapList();
        const newTotalPages = Math.ceil(data.length / newsPerPage);
        setTotalPages(newTotalPages);

        const startIdx = (scrapPage - 1) * newsPerPage;
        const paginated = data.slice(startIdx, startIdx + newsPerPage);

        // ScrapListResDTO → ScrapNewsCard props에 맞게 변환
        const mapped = paginated.map((item) => {
          const date = item.publishedAt ? parseApiDate(item.publishedAt) : null;
          return {
            id: item.articleId,
            sourceName: item.sourceName,
            title: item.title,
            description: item.description,
            urlToImage: item.urlToImage,
            year: date ? String(date.getFullYear()) : "",
            month: date ? String(date.getMonth() + 1).padStart(2, "0") : "",
            day: date ? String(date.getDate()).padStart(2, "0") : "",
          };
        });
        setScrapNews(mapped);
        } else {
        // 비로그인: localStorage → BE /api/scrap
        const storedScrapIds = JSON.parse(
          localStorage.getItem("scrapIds") || "[]",
        );
        const newTotalPages = Math.ceil(storedScrapIds.length / newsPerPage);
        setTotalPages(newTotalPages);

        const startIdx = (scrapPage - 1) * newsPerPage;
        const currentPageIds = storedScrapIds.slice(
          startIdx,
          startIdx + newsPerPage,
        );

        if (currentPageIds.length > 0) {
          const data = await getScrap(currentPageIds);
          // Number() 캐스팅으로 타입 불일치 방지 (localStorage: number, API: Long → number)
          const pageIdSet = new Set(currentPageIds.map(Number));
          const filteredData = data.filter((news) =>
            pageIdSet.has(Number(news.id)),
          );
          setScrapNews(filteredData);
        } else {
          setScrapNews([]);
        }
        }
        setIsScrapped(true);
      } catch (error) {
        setScrapNews([]);
        setScrapError(getApiErrorMessage(error, "스크랩 목록을 불러오지 못했습니다."));
      }
    }

    fetchScrapNews();
  }, [scrapPage, isScrapped, token]);

  return (
    <div className={styled["ScrapNews--container"]}>
      <div className={styled["ScrapNews--Newscontainer"]}>
        <div className={styled["ScrapNews--News"]}>
          {scrapError ? (
            <ApiErrorMessage message={scrapError} />
          ) : scrapNews.length > 0 ? (
            <div className={styled["ScrapNews--News__container"]}>
              <div className={styled["ScrapNews--News__items"]}>
                {scrapNews.map((news) => (
                  <ScrapNewsCard
                    key={news.id}
                    id={news.id}
                    press={news.sourceName}
                    title={news.title}
                    summary={news.description}
                    image={news.urlToImage}
                    year={news.year}
                    month={news.month}
                    day={news.day}
                    isScrapped={isScrapped}
                    setIsScrapped={setIsScrapped}
                  />
                ))}
              </div>

              <div className={styled["ScrapNews--pages"]}>
                <Pagenation
                  currentPage={scrapPage}
                  totalPages={totalPages}
                  onPageChange={setScrapPage}
                />
              </div>
            </div>
          ) : (
            <BlankNews message="스크랩한 뉴스가 없습니다" />
          )}
        </div>
      </div>
    </div>
  );
}
