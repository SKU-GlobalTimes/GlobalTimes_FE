import styled from "./Pagenation.module.css";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useLanguage } from "../../util/LanguageContext.jsx";
import { fetchTranslatedText } from "../../api/fetchTranslatedText.jsx";

const PAGE_UI_KO = {
  first: "첫 페이지",
  prev: "이전 페이지",
  pagePrefix: "페이지",
  next: "다음 페이지",
  last: "마지막 페이지",
};

function Pagenation({ currentPage, totalPages, onPageChange }) {
  const { language } = useLanguage();
  const [ui, setUi] = useState(() => ({ ...PAGE_UI_KO }));

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const entries = Object.entries(PAGE_UI_KO);
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

  function firstClick() {
    if (currentPage !== 1) {
      onPageChange(1);
    }
  }

  function lastClick() {
    if (currentPage !== totalPages) {
      onPageChange(totalPages);
    }
  }

  function getPageNumbers() {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  }

  function prevClick() {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  }
  function nextClick() {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  }

  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  return (
    <div className={styled.pagenationContainer}>
      <button
        type="button"
        className={styled.pagenationButton}
        onClick={firstClick}
        disabled={!canPrev}
        aria-label={ui.first}
        title={ui.first}
      >
        ≪
      </button>
      <button
        type="button"
        className={styled.pagenationButton}
        onClick={prevClick}
        disabled={!canPrev}
        aria-label={ui.prev}
        title={ui.prev}
      >
        &lt;
      </button>

      {getPageNumbers().map((pageNumber, index) =>
        pageNumber === "..." ? (
          <span key={`ellipsis-${index}`} className={styled.ellipsis}>
            ...
          </span>
        ) : (
          <button
            type="button"
            key={pageNumber}
            className={`${styled.pagenationButton} ${pageNumber === currentPage ? styled.activePage : ""}`}
            onClick={() => onPageChange(pageNumber)}
            aria-label={`${ui.pagePrefix} ${pageNumber}`}
            aria-current={pageNumber === currentPage ? "page" : undefined}
          >
            {pageNumber}
          </button>
        ),
      )}

      <button
        type="button"
        className={styled.pagenationButton}
        onClick={nextClick}
        disabled={!canNext}
        aria-label={ui.next}
        title={ui.next}
      >
        &gt;
      </button>
      <button
        type="button"
        className={styled.pagenationButton}
        onClick={lastClick}
        disabled={!canNext}
        aria-label={ui.last}
        title={ui.last}
      >
        ≫
      </button>
    </div>
  );
}

export default Pagenation;

Pagenation.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};
