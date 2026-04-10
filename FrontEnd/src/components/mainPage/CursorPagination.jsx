import styled from "./Pagenation.module.css";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useLanguage } from "../../util/LanguageContext.jsx";
import { fetchTranslatedText } from "../../api/fetchTranslatedText.jsx";

const CURSOR_PAGINATION_KO = {
  first: "첫 페이지",
  prev: "이전 페이지",
  pagePrefix: "페이지",
  next: "다음 페이지",
  last: "마지막 페이지",
  lastTitle: "마지막 페이지로 바로 이동할 수 없습니다 (커서 기반)",
};

/**
 * offset totalPages 없이 cursor 이전/다음만 지원 (임의 페이지 점프 없음).
 * 인기 뉴스 Pagenation과 동일하게 버튼 자리를 유지하고, 불가 시 disabled 처리.
 */
function CursorPagination({
  currentPageLabel,
  canGoPrev,
  canGoNext,
  onFirst,
  onPrev,
  onNext,
}) {
  const { language } = useLanguage();
  const [ui, setUi] = useState(() => ({ ...CURSOR_PAGINATION_KO }));

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const entries = Object.entries(CURSOR_PAGINATION_KO);
      const translated = await Promise.all(
        entries.map(([, ko]) => fetchTranslatedText(ko, language)),
      );
      if (cancelled) return;
      const next = {};
      entries.forEach(([key], i) => {
        next[key] = translated[i];
      });
      setUi(next);
    })();
    return () => {
      cancelled = true;
    };
  }, [language]);

  return (
    <div className={styled.pagenationContainer}>
      <button
        type="button"
        className={styled.pagenationButton}
        onClick={onFirst}
        disabled={!canGoPrev}
        aria-label={ui.first}
        title={ui.first}
      >
        ≪
      </button>
      <button
        type="button"
        className={styled.pagenationButton}
        onClick={onPrev}
        disabled={!canGoPrev}
        aria-label={ui.prev}
        title={ui.prev}
      >
        &lt;
      </button>
      <div
        className={styled.cursorPageIndicator}
        aria-current="page"
        role="status"
      >
        <span className={styled.cursorPagePrefix}>{ui.pagePrefix}</span>
        <span className={styled.cursorPageNumber}>{currentPageLabel}</span>
      </div>
      <button
        type="button"
        className={styled.pagenationButton}
        onClick={onNext}
        disabled={!canGoNext}
        aria-label={ui.next}
        title={ui.next}
      >
        &gt;
      </button>
      <button
        type="button"
        className={styled.pagenationButton}
        disabled
        aria-label={ui.last}
        title={ui.lastTitle}
        tabIndex={-1}
      >
        ≫
      </button>
    </div>
  );
}

CursorPagination.propTypes = {
  currentPageLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  canGoPrev: PropTypes.bool.isRequired,
  canGoNext: PropTypes.bool.isRequired,
  onFirst: PropTypes.func.isRequired,
  onPrev: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
};

export default CursorPagination;
