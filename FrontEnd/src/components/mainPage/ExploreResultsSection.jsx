import styled from "./News.module.css";
import BasicNewsCard from "../newsCard/BasicNewsCard";
import CursorPagination from "./CursorPagination";
import TranslatedText from "../../api/TranslatedText";
import PropTypes from "prop-types";

export default function ExploreResultsSection({
  loading,
  articles,
  pageLabel,
  canPrev,
  hasNext,
  onFirst,
  onPrev,
  onNext,
  onDismiss,
}) {
  return (
    <section className={styled["ExploreSection"]} aria-label="탐색 결과">
      <div className={styled["ExploreSection__head"]}>
        <div className={styled["ExploreSection__titles"]}>
          <h2 className={styled["ExploreSection__title"]}>
            <TranslatedText text="탐색 결과" />
          </h2>
          <p className={styled["ExploreSection__subtitle"]}>
            <TranslatedText text="국가·카테고리·날짜 조건으로 모은 기사입니다. 키워드는 상단 검색으로 이용해 주세요." />
          </p>
        </div>
        {onDismiss && (
          <button
            type="button"
            className={styled["ExploreSection__dismiss"]}
            onClick={onDismiss}
          >
            <TranslatedText text="닫기" />
          </button>
        )}
      </div>

      {loading ? (
        <p className={styled["ExploreSection__loading"]}>
          <TranslatedText text="불러오는 중…" />
        </p>
      ) : articles.length === 0 ? (
        <p className={styled["ExploreSection__empty"]}>
          <TranslatedText text="조건에 맞는 기사가 없습니다." />
        </p>
      ) : (
        <>
          <div className={styled["ExploreSection__grid"]}>
            {articles.map((news) => (
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
          <div className={styled["ExploreSection__pages"]}>
            <CursorPagination
              currentPageLabel={pageLabel}
              canGoPrev={canPrev}
              canGoNext={hasNext}
              onFirst={onFirst}
              onPrev={onPrev}
              onNext={onNext}
            />
          </div>
        </>
      )}
    </section>
  );
}

ExploreResultsSection.propTypes = {
  loading: PropTypes.bool.isRequired,
  articles: PropTypes.arrayOf(PropTypes.object).isRequired,
  pageLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  canPrev: PropTypes.bool.isRequired,
  hasNext: PropTypes.bool.isRequired,
  onFirst: PropTypes.func.isRequired,
  onPrev: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onDismiss: PropTypes.func,
};
