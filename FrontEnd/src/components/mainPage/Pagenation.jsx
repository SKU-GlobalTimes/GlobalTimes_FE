import styled from './Pagenation.module.css';
import PropTypes from 'prop-types';

function Pagenation({ currentPage, totalPages, onPageChange}) {

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
      // 전체 페이지가 5 이하라면 그냥 다 보여줘
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1); // 첫 페이지는 무조건
  
      if (currentPage > 3) {
        pages.push('...'); // 왼쪽 점
      }
  
      // 현재 페이지 기준 앞뒤로 보여줄 페이지
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
  
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
  
      if (currentPage < totalPages - 2) {
        pages.push('...'); // 오른쪽 점
      }
  
      pages.push(totalPages); // 마지막 페이지는 무조건
    }
  
    return pages;
  }



  // 페이지 화살표
  function prevClick() {
    if(currentPage > 1) {
      onPageChange(currentPage-1);
    }
  }
  function nextClick() {
    if (currentPage<totalPages){
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
        aria-label="첫 페이지"
        title="첫 페이지"
      >
        ≪
      </button>
      <button
        type="button"
        className={styled.pagenationButton}
        onClick={prevClick}
        disabled={!canPrev}
        aria-label="이전 페이지"
        title="이전 페이지"
      >
        &lt;
      </button>

      {getPageNumbers().map((pageNumber, index) =>
        pageNumber === '...' ? (
          <span key={`ellipsis-${index}`} className={styled.ellipsis}>
            ...
          </span>
        ) : (
          <button
            type="button"
            key={pageNumber}
            className={`${styled.pagenationButton} ${pageNumber === currentPage ? styled.activePage : ''}`}
            onClick={() => onPageChange(pageNumber)}
            aria-label={`페이지 ${pageNumber}`}
            aria-current={pageNumber === currentPage ? 'page' : undefined}
          >
            {pageNumber}
          </button>
        )
      )}

      <button
        type="button"
        className={styled.pagenationButton}
        onClick={nextClick}
        disabled={!canNext}
        aria-label="다음 페이지"
        title="다음 페이지"
      >
        &gt;
      </button>
      <button
        type="button"
        className={styled.pagenationButton}
        onClick={lastClick}
        disabled={!canNext}
        aria-label="마지막 페이지"
        title="마지막 페이지"
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
    onPageChange: PropTypes.func.isRequired
};

