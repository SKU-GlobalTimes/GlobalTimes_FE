import styles from './Pagenation.module.css';
import PropTypes from 'prop-types';

function Pagenation({ currentPage, totalPages, onPageChange }) {

  // 페이지 화살표
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


  function getPageNumbers() {
    const maxVisiblePages = 3; 
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, currentPage - halfVisible); 
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, idx) => startPage + idx);
  }



  return (
    <div className={styles.pagenationContainer}>
      
      {currentPage > 1 ? (
        <button
          className={`${styles.pagenationButton} ${currentPage === 1 ? styles.hidden : ''}`}
          onClick={prevClick}
          disabled={currentPage === 1}
        >
          &lt;
        </button>
      ) : null}

      {/* 페이지 숫자 */}
      {getPageNumbers().map((pageNumber) => (
        <button
          key={pageNumber}
          className={`${styles.pagenationButton} ${pageNumber === currentPage ? styles.activePage : ''}`}
          onClick={() => onPageChange(pageNumber)}
        >
          {pageNumber}
        </button>
      ))}

      {currentPage < totalPages ? (
        <button
          className={`${styles.pagenationButton} ${currentPage === totalPages ? styles.hidden : ''}`}
          onClick={nextClick}
          disabled={currentPage === totalPages}
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

