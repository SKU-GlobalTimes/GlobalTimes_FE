import styled from "./SearchContainer.module.css";
import PropTypes from "prop-types";
import { Search, SlidersHorizontal } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchTranslatedText } from "../../api/fetchTranslatedText.jsx";
import { useLanguage } from "../../util/LanguageContext.jsx";
import {
  EXPLORE_COUNTRY_OPTIONS,
  EXPLORE_CATEGORY_OPTIONS,
} from "./exploreOptions";

export default function SearchContainer({
  searchTerm,
  enableExplore = false,
  onExploreApply,
}) {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [inputSearchTerm, setInputSearchTerm] = useState(searchTerm);
  const [value, setValue] = useState(searchTerm || "");
  const [placeholder, setPlaceholder] = useState("검색어를 입력해주세요 ");
  const [searchLabel, setSearchLabel] = useState("Search");
  const [isFocused, setIsFocused] = useState(false);

  const [exploreOpen, setExploreOpen] = useState(false);
  const [exCountry, setExCountry] = useState("");
  const [exCategory, setExCategory] = useState("");
  const [exDate, setExDate] = useState("");

  useEffect(() => {
    setInputSearchTerm(searchTerm);
    setValue(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    const translate = async () => {
      const [p, s] = await Promise.all([
        fetchTranslatedText("검색어를 입력해주세요 ", language),
        fetchTranslatedText("검색", language),
      ]);
      setPlaceholder(p);
      setSearchLabel(s);
    };
    translate();
  }, [language]);

  function handleSearch() {
    const keyword = inputSearchTerm.trim();
    if (!keyword) return;
    navigate(`/search/${keyword}`);
  }

  function handleInputChange(event) {
    setInputSearchTerm(event.target.value);
    setValue(event.target.value);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      handleSearch();
    }
  }

  function handleClickSearch() {
    handleSearch();
  }

  function buildExploreFilters() {
    return {
      ...(exCountry ? { country: exCountry } : {}),
      ...(exCategory ? { category: exCategory } : {}),
      ...(exDate ? { date: exDate } : {}),
    };
  }

  async function handleExploreApplyClick() {
    if (!onExploreApply) return;
    await onExploreApply(buildExploreFilters());
  }

  function handleExploreReset() {
    setExCountry("");
    setExCategory("");
    setExDate("");
  }

  return (
    <div className={styled["searchContainer--container"]}>
      <div className={styled["searchContainer--searchBar"]}>
        <div className={styled["searchContainer--searchInputContainer"]}>
          <Search className={styled["input-icon"]} size={20} />
          <div className={styled["input-wrapper"]}>
            <input
              className={styled["searchContainer--Input"]}
              value={value}
              placeholder=""
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            {!value && !isFocused && (
              <div className={styled["animated-placeholder"]}>
                <span className={styled["placeholder-text"]}>
                  {placeholder}
                </span>
                <span className={styled["emoji-sad"]}>😢</span>
                <span className={styled["emoji-happy"]}>🥰</span>
              </div>
            )}
          </div>
        </div>
        <button
          id="searchButton"
          type="button"
          className={styled["searchContainer--searchButton"]}
          onClick={handleClickSearch}
          disabled={!value.trim()}
        >
          <span>{searchLabel}</span>
          <span className={styled["btn-dots"]}>
            <span
              className={styled["btn-dot"]}
              style={{ animationDelay: "0ms" }}
            />
            <span
              className={styled["btn-dot"]}
              style={{ animationDelay: "200ms" }}
            />
            <span
              className={styled["btn-dot"]}
              style={{ animationDelay: "400ms" }}
            />
          </span>
        </button>
      </div>

      {enableExplore && onExploreApply && (
        <div className={styled["searchExplore__row"]}>
          <button
            type="button"
            className={styled["searchExplore__toggle"]}
            onClick={() => setExploreOpen((o) => !o)}
            aria-expanded={exploreOpen}
          >
            <SlidersHorizontal size={16} aria-hidden />
            탐색 조건
          </button>

          {exploreOpen && (
            <div className={styled["searchExplore__panel"]}>
              <p className={styled["searchExplore__hint"]}>
                키워드 검색은 위 입력창에서 실행됩니다. 여기서는 국가·카테고리·날짜로
                목록을 좁혀 볼 수 있습니다.
              </p>
              <div className={styled["searchExplore__grid"]}>
                <div className={styled["searchExplore__field"]}>
                  <label htmlFor="explore-country">국가</label>
                  <select
                    id="explore-country"
                    value={exCountry}
                    onChange={(e) => setExCountry(e.target.value)}
                  >
                    {EXPLORE_COUNTRY_OPTIONS.map((o) => (
                      <option key={o.value || "all"} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styled["searchExplore__field"]}>
                  <label htmlFor="explore-category">카테고리</label>
                  <select
                    id="explore-category"
                    value={exCategory}
                    onChange={(e) => setExCategory(e.target.value)}
                  >
                    {EXPLORE_CATEGORY_OPTIONS.map((o) => (
                      <option key={o.value || "all-c"} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styled["searchExplore__field"]}>
                  <label htmlFor="explore-date">날짜 (하루)</label>
                  <input
                    id="explore-date"
                    type="date"
                    value={exDate}
                    onChange={(e) => setExDate(e.target.value)}
                  />
                </div>
              </div>
              <div className={styled["searchExplore__actions"]}>
                <button
                  type="button"
                  className={styled["searchExplore__apply"]}
                  onClick={handleExploreApplyClick}
                >
                  이 조건으로 보기
                </button>
                <button
                  type="button"
                  className={styled["searchExplore__reset"]}
                  onClick={handleExploreReset}
                >
                  조건 초기화
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

SearchContainer.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  enableExplore: PropTypes.bool,
  onExploreApply: PropTypes.func,
};
