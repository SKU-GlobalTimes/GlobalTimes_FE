import styled from "./MainPage.module.css";
import SearchContainer from "../components/mainPage/SearchContainer";
import MainNews from "../components/mainPage/MainNews";
import ExploreResultsSection from "../components/mainPage/ExploreResultsSection";
import { useState, useCallback } from "react";
import { getExploreArticles } from "../api/getNewsCardAPI";
import { getApiErrorMessage } from "../api/apiClient";

const EXPLORE_PAGE_SIZE = 12;

export default function MainPage() {
  const [exploreActive, setExploreActive] = useState(false);
  const [exploreLoading, setExploreLoading] = useState(false);
  const [exploreArticles, setExploreArticles] = useState([]);
  const [exploreNextCursor, setExploreNextCursor] = useState(null);
  const [exploreHasNext, setExploreHasNext] = useState(false);
  const [exploreFilters, setExploreFilters] = useState({});
  const [exploreStack, setExploreStack] = useState([]);
  const [exploreRequestCursor, setExploreRequestCursor] = useState(null);
  const [exploreError, setExploreError] = useState("");

  const applyExploreResponse = useCallback((res) => {
    setExploreArticles(res.articles);
    setExploreNextCursor(res.nextCursor);
    setExploreHasNext(res.hasNext);
  }, []);

  const requestExplore = useCallback(async (params) => {
    setExploreLoading(true);
    setExploreError("");
    try {
      const res = await getExploreArticles(params);
      applyExploreResponse(res);
      return true;
    } catch (error) {
      setExploreError(getApiErrorMessage(error, "탐색 결과를 불러오지 못했습니다."));
      return false;
    } finally {
      setExploreLoading(false);
    }
  }, [applyExploreResponse]);

  const handleExploreApply = useCallback(
    async (filters) => {
      setExploreActive(true);
      setExploreFilters(filters);
      const succeeded = await requestExplore({
        ...filters,
        cursor: null,
        size: EXPLORE_PAGE_SIZE,
      });
      if (succeeded) {
        setExploreStack([]);
        setExploreRequestCursor(null);
      }
    },
    [requestExplore],
  );

  const handleExploreFirst = useCallback(async () => {
    const succeeded = await requestExplore({
      ...exploreFilters,
      cursor: null,
      size: EXPLORE_PAGE_SIZE,
    });
    if (succeeded) {
      setExploreStack([]);
      setExploreRequestCursor(null);
    }
  }, [exploreFilters, requestExplore]);

  const handleExploreNext = useCallback(async () => {
    if (!exploreHasNext || exploreNextCursor == null) return;
    const succeeded = await requestExplore({
      ...exploreFilters,
      cursor: exploreNextCursor,
      size: EXPLORE_PAGE_SIZE,
    });
    if (succeeded) {
      setExploreStack((s) => [...s, exploreRequestCursor]);
      setExploreRequestCursor(exploreNextCursor);
    }
  }, [
    exploreHasNext,
    exploreNextCursor,
    exploreRequestCursor,
    exploreFilters,
    requestExplore,
  ]);

  const handleExplorePrev = useCallback(async () => {
    if (exploreStack.length === 0) return;
    const parentCursor = exploreStack[exploreStack.length - 1];
    const succeeded = await requestExplore({
      ...exploreFilters,
      cursor: parentCursor,
      size: EXPLORE_PAGE_SIZE,
    });
    if (succeeded) {
      setExploreStack((s) => s.slice(0, -1));
      setExploreRequestCursor(parentCursor);
    }
  }, [exploreStack, exploreFilters, requestExplore]);

  const handleExploreDismiss = useCallback(() => {
    setExploreActive(false);
    setExploreArticles([]);
    setExploreNextCursor(null);
    setExploreHasNext(false);
    setExploreFilters({});
    setExploreStack([]);
    setExploreRequestCursor(null);
    setExploreError("");
  }, []);

  const explorePageLabel = exploreStack.length + 1;
  const canExplorePrev = exploreStack.length > 0;

  return (
    <div className={styled["mainPage--container"]}>
      <SearchContainer
        searchTerm=""
        enableExplore
        onExploreApply={handleExploreApply}
      />
      {exploreActive && (
        <ExploreResultsSection
          loading={exploreLoading}
          error={exploreError}
          articles={exploreArticles}
          pageLabel={explorePageLabel}
          canPrev={canExplorePrev}
          hasNext={exploreHasNext}
          onFirst={handleExploreFirst}
          onPrev={handleExplorePrev}
          onNext={handleExploreNext}
          onDismiss={handleExploreDismiss}
        />
      )}
      <MainNews />
    </div>
  );
}
