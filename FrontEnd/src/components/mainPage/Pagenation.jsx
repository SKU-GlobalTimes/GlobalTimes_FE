import styles from './Pagenation.module.css';
import PropTypes from 'prop-types';

function Pagenation({ currentPage, totalPages, onPageChange }) {
  // 이전 페이지 버튼 핸들러
  function handlePrevClick() {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  }

  // 다음 페이지 버튼 핸들러
  function handleNextClick() {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  }

  // 페이지 번호 계산
  function getPageNumbers() {
    const maxVisiblePages = 3; // 화면에 보일 최대 페이지 숫자
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, currentPage - halfVisible); // 시작 페이지 계산
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1); // 끝 페이지 계산

    // 시작 페이지가 1이 아닌 경우, 끝 페이지 조정
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, idx) => startPage + idx);
  }

  return (
    <div className={styles.pagination}>
      {/* 이전 페이지 버튼 */}
      {currentPage > 1 ? (
        <button
          onClick={handlePrevClick}
          disabled={currentPage === 1}
          className={`${styles.paginationButton} ${currentPage === 1 ? styles.hidden : ''}`}
        >
          &lt;
        </button>
      ) : null}

      {/* 페이지 번호 버튼 */}
      {getPageNumbers().map((pageNumber) => (
        <button
          key={pageNumber}
          onClick={() => onPageChange(pageNumber)}
          className={`${styles.paginationButton} ${pageNumber === currentPage ? styles.activePage : ''}`}
        >
          {pageNumber}
        </button>
      ))}

      {/* 다음 페이지 버튼 */}
      {currentPage < totalPages ? (
        <button
          onClick={handleNextClick}
          disabled={currentPage === totalPages}
          className={`${styles.paginationButton} ${currentPage === totalPages ? styles.hidden : ''}`}
        >
          &gt;
        </button>
      ) : null}
    </div>
  );
}

export default Pagenation;




Pagenation.propTypes = {
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired
};

