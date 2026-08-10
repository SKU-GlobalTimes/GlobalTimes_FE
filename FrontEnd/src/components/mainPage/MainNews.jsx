import styled from "./News.module.css";
import HotNewsCard from "../newsCard/HotNewsCard";
import BasicNewsCard from "../newsCard/BasicNewsCard";
import Pagenation from "./Pagenation";
import CursorPagination from "./CursorPagination";
import { useState, useEffect, useCallback } from "react";

//번역 컴포넌트
import TranslatedText from "../../api/TranslatedText";

import { getHot, getLatestCursor } from "../../api/getNewsCardAPI";
import { getApiErrorMessage } from "../../api/apiClient";
import ApiErrorMessage from "../commons/apiState/ApiErrorMessage";

const LATEST_PAGE_SIZE = 8;

export default function MainNews() {
  const [hotNews, setHotNews] = useState([]);
  const [basicNews, setBasicNews] = useState([]);
  const [hotPage, setHotPage] = useState(1);
  const [hotError, setHotError] = useState("");
  const hotTotalPages = 7;

  const [latestNextCursor, setLatestNextCursor] = useState(null);
  const [latestHasNext, setLatestHasNext] = useState(false);
  /** 현재 목록을 불러올 때 API에 넘긴 cursor (첫 페이지는 null) */
  const [latestRequestCursor, setLatestRequestCursor] = useState(null);
  /** 다음으로 갈 때 push(latestRequestCursor) — 이전으로 갈 때 pop 한 값으로 재요청 */
  const [latestStack, setLatestStack] = useState([]);
  const [latestError, setLatestError] = useState("");

  useEffect(() => {
    async function fetchHotNews() {
      setHotError("");
      try {
        const data = await getHot(hotPage - 1, 6);
        setHotNews(Object.values(data));
      } catch (error) {
        setHotNews([]);
        setHotError(getApiErrorMessage(error, "인기 기사를 불러오지 못했습니다."));
      }
    }
    fetchHotNews();
  }, [hotPage]);

  const applyLatestResponse = useCallback((res) => {
    setBasicNews(res.articles);
    setLatestNextCursor(res.nextCursor);
    setLatestHasNext(res.hasNext);
  }, []);

  const requestLatest = useCallback(async (cursor) => {
    setLatestError("");
    try {
      const res = await getLatestCursor(cursor, LATEST_PAGE_SIZE);
      applyLatestResponse(res);
      return true;
    } catch (error) {
      setLatestError(getApiErrorMessage(error, "최신 기사를 불러오지 못했습니다."));
      return false;
    }
  }, [applyLatestResponse]);

  const loadLatestFirst = useCallback(async () => {
    const succeeded = await requestLatest(null);
    if (succeeded) {
      setLatestRequestCursor(null);
      setLatestStack([]);
    }
  }, [requestLatest]);

  useEffect(() => {
    loadLatestFirst();
  }, [loadLatestFirst]);

  const handleLatestNext = useCallback(async () => {
    if (!latestHasNext || latestNextCursor == null) return;
    const succeeded = await requestLatest(latestNextCursor);
    if (succeeded) {
      setLatestStack((s) => [...s, latestRequestCursor]);
      setLatestRequestCursor(latestNextCursor);
    }
  }, [
    latestHasNext,
    latestNextCursor,
    latestRequestCursor,
    requestLatest,
  ]);

  const handleLatestPrev = useCallback(async () => {
    if (latestStack.length === 0) return;
    const parentCursor = latestStack[latestStack.length - 1];
    const succeeded = await requestLatest(parentCursor);
    if (succeeded) {
      setLatestStack((s) => s.slice(0, -1));
      setLatestRequestCursor(parentCursor);
    }
  }, [latestStack, requestLatest]);

  const handleLatestFirst = useCallback(async () => {
    await loadLatestFirst();
  }, [loadLatestFirst]);

  const latestPageLabel = latestStack.length + 1;
  const canLatestPrev = latestStack.length > 0;

  return (
    <div className={styled["MainNews--container"]}>
      <div className={styled["MainNews--Newscontainer"]}>
        <div className={styled["MainNews--titleBlock"]}>
          <h1 className={styled["MainNews--title"]}>
            <TranslatedText text="인기 뉴스" />
          </h1>
          <p className={styled["MainNews--subtitle"]}>
            <TranslatedText text="최근 조회수 기준 정렬입니다." />
          </p>
        </div>

        <div className={styled["MainNews--News"]}>
          {hotError && <ApiErrorMessage message={hotError} />}
          {hotNews.map((news) => (
            <HotNewsCard
              key={news.id}
              id={news.id}
              press={news.sourceName}
              title={news.title}
              summary={news.description}
              image={news.urlToImage}
              year={news.year}
              month={news.month}
              day={news.day}
            />
          ))}
        </div>

        <div className={styled["MainNews--pages"]}>
          <Pagenation
            currentPage={hotPage}
            totalPages={hotTotalPages}
            onPageChange={setHotPage}
          />
        </div>
      </div>

      <div className={styled["MainNews--Newscontainer"]}>
        <div className={styled["MainNews--titleBlock"]}>
          <h1 className={styled["MainNews--title"]}>
            <TranslatedText text="최신 뉴스" />
          </h1>
          <p className={styled["MainNews--subtitle"]}>
            <TranslatedText text="발행일 기준 최신순 정렬입니다." />
          </p>
        </div>

        <div className={styled["MainNews--News__latest"]}>
          {latestError && (
            <ApiErrorMessage message={latestError} onRetry={handleLatestFirst} />
          )}
          {basicNews.map((news) => (
            <BasicNewsCard
              key={news.id}
              id={news.id}
              press={news.sourceName}
              title={news.title}
              summary={news.description}
              image={news.urlToImage}
              year={news.year}
              month={news.month}
              day={news.day}
            />
          ))}
        </div>

        <div className={styled["MainNews--pages"]}>
          <CursorPagination
            currentPageLabel={latestPageLabel}
            canGoPrev={canLatestPrev}
            canGoNext={latestHasNext}
            onFirst={handleLatestFirst}
            onPrev={handleLatestPrev}
            onNext={handleLatestNext}
          />
        </div>
      </div>
    </div>
  );
}
