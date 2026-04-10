import styled from "./MainPage.module.css";
import SearchContainer from "../components/mainPage/SearchContainer";
import MainNews from "../components/mainPage/MainNews";
import ExploreResultsSection from "../components/mainPage/ExploreResultsSection";
import { useState, useCallback } from "react";
import { getExploreArticles } from "../api/getNewsCardAPI";

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

  const applyExploreResponse = useCallback((res) => {
    setExploreArticles(res.articles);
    setExploreNextCursor(res.nextCursor);
    setExploreHasNext(res.hasNext);
  }, []);

  const handleExploreApply = useCallback(
    async (filters) => {
      setExploreLoading(true);
      setExploreActive(true);
      setExploreFilters(filters);
      const res = await getExploreArticles({
        ...filters,
        cursor: null,
        size: EXPLORE_PAGE_SIZE,
      });
      applyExploreResponse(res);
      setExploreStack([]);
      setExploreRequestCursor(null);
      setExploreLoading(false);
    },
    [applyExploreResponse],
  );

  const handleExploreFirst = useCallback(async () => {
    setExploreLoading(true);
    const res = await getExploreArticles({
      ...exploreFilters,
      cursor: null,
      size: EXPLORE_PAGE_SIZE,
    });
    applyExploreResponse(res);
    setExploreStack([]);
    setExploreRequestCursor(null);
    setExploreLoading(false);
  }, [exploreFilters, applyExploreResponse]);

  const handleExploreNext = useCallback(async () => {
    if (!exploreHasNext || exploreNextCursor == null) return;
    setExploreStack((s) => [...s, exploreRequestCursor]);
    const res = await getExploreArticles({
      ...exploreFilters,
      cursor: exploreNextCursor,
      size: EXPLORE_PAGE_SIZE,
    });
    applyExploreResponse(res);
    setExploreRequestCursor(exploreNextCursor);
  }, [
    exploreHasNext,
    exploreNextCursor,
    exploreRequestCursor,
    exploreFilters,
    applyExploreResponse,
  ]);

  const handleExplorePrev = useCallback(async () => {
    if (exploreStack.length === 0) return;
    const parentCursor = exploreStack[exploreStack.length - 1];
    setExploreStack((s) => s.slice(0, -1));
    const res = await getExploreArticles({
      ...exploreFilters,
      cursor: parentCursor,
      size: EXPLORE_PAGE_SIZE,
    });
    applyExploreResponse(res);
    setExploreRequestCursor(parentCursor);
  }, [exploreStack, exploreFilters, applyExploreResponse]);

  const handleExploreDismiss = useCallback(() => {
    setExploreActive(false);
    setExploreArticles([]);
    setExploreNextCursor(null);
    setExploreHasNext(false);
    setExploreFilters({});
    setExploreStack([]);
    setExploreRequestCursor(null);
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
