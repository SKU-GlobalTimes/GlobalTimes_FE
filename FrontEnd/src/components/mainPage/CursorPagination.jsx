import styled from "./Pagenation.module.css";
import PropTypes from "prop-types";

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
  return (
    <div className={styled.pagenationContainer}>
      <button
        type="button"
        className={styled.pagenationButton}
        onClick={onFirst}
        disabled={!canGoPrev}
        aria-label="첫 페이지"
        title="첫 페이지"
      >
        ≪
      </button>
      <button
        type="button"
        className={styled.pagenationButton}
        onClick={onPrev}
        disabled={!canGoPrev}
        aria-label="이전 페이지"
        title="이전 페이지"
      >
        &lt;
      </button>
      <div
        className={styled.cursorPageIndicator}
        aria-current="page"
        role="status"
      >
        <span className={styled.cursorPagePrefix}>페이지</span>
        <span className={styled.cursorPageNumber}>{currentPageLabel}</span>
      </div>
      <button
        type="button"
        className={styled.pagenationButton}
        onClick={onNext}
        disabled={!canGoNext}
        aria-label="다음 페이지"
        title="다음 페이지"
      >
        &gt;
      </button>
      <button
        type="button"
        className={styled.pagenationButton}
        disabled
        aria-label="마지막 페이지"
        title="마지막 페이지로 바로 이동할 수 없습니다_cursor 기반"
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
