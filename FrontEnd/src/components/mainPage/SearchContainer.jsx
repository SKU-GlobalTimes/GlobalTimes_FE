import styled from "./SearchContainer.module.css";
import PropTypes from "prop-types";
import { Search, SlidersHorizontal } from "lucide-react";
import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { fetchTranslatedText } from "../../api/fetchTranslatedText.jsx";
import { useLanguage } from "../../util/LanguageContext.jsx";
import {
  EXPLORE_COUNTRY_OPTIONS,
  EXPLORE_CATEGORY_OPTIONS,
} from "./exploreOptions";

const EXPLORE_UI_KEYS = {
  hint: "키워드는 위 입력 후 검색 버튼을 누르세요. 여기서는 국가·카테고리·날짜로 목록만 좁힙니다.",
  labelCountry: "국가",
  labelCategory: "카테고리",
  labelDate: "날짜 (하루)",
  btnApply: "이 조건으로 보기",
  btnReset: "조건 초기화",
  all: "전체",
  triggerTitle: "조건으로 좁히기",
  triggerAria:
    "탐색 조건 열기. 국가, 카테고리, 날짜로 목록을 좁힐 수 있습니다.",
  dialogAria: "탐색 조건",
};

export default function SearchContainer({
  searchTerm,
  enableExplore = false,
  onExploreApply,
}) {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const exploreWrapRef = useRef(null);

  const [inputSearchTerm, setInputSearchTerm] = useState(searchTerm);
  const [value, setValue] = useState(searchTerm || "");
  const [placeholder, setPlaceholder] = useState("검색어를 입력해주세요 ");
  const [searchLabel, setSearchLabel] = useState("Search");
  const [isFocused, setIsFocused] = useState(false);

  const [exploreOpen, setExploreOpen] = useState(false);
  const [exCountry, setExCountry] = useState("");
  const [exCategory, setExCategory] = useState("");
  const [exDate, setExDate] = useState("");

  const [exUi, setExUi] = useState(() => ({ ...EXPLORE_UI_KEYS }));

  const hasExploreFilters = Boolean(exCountry || exCategory || exDate);

  const showExplore = enableExplore && onExploreApply;

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

  useEffect(() => {
    if (!showExplore) return;
    let cancelled = false;
    (async () => {
      const entries = Object.entries(EXPLORE_UI_KEYS);
      const translated = await Promise.all(
        entries.map(([, ko]) => fetchTranslatedText(ko, language)),
      );
      if (cancelled) return;
      const next = {};
      entries.forEach(([key], i) => {
        next[key] = translated[i];
      });
      setExUi(next);
    })();
    return () => {
      cancelled = true;
    };
  }, [language, showExplore]);

  useEffect(() => {
    if (!exploreOpen) return;
    function handlePointerDown(event) {
      if (
        exploreWrapRef.current &&
        !exploreWrapRef.current.contains(event.target)
      ) {
        setExploreOpen(false);
      }
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [exploreOpen]);

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
    setExploreOpen(false);
  }

  function handleExploreReset() {
    setExCountry("");
    setExCategory("");
    setExDate("");
  }

  const countryOptions = useMemo(
    () =>
      EXPLORE_COUNTRY_OPTIONS.map((o) =>
        o.value === ""
          ? { ...o, label: exUi.all }
          : o,
      ),
    [exUi.all],
  );

  const categoryOptions = useMemo(
    () =>
      EXPLORE_CATEGORY_OPTIONS.map((o) =>
        o.value === ""
          ? { ...o, label: exUi.all }
          : o,
      ),
    [exUi.all],
  );

  return (
    <div className={styled["searchContainer--container"]}>
      <div
        className={styled["searchExplore__wrap"]}
        ref={exploreWrapRef}
      >
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
            {showExplore && (
              <button
                type="button"
                className={`${styled["searchExplore__trigger"]} ${exploreOpen ? styled["searchExplore__trigger--open"] : ""} ${hasExploreFilters ? styled["searchExplore__trigger--active"] : ""}`}
                onClick={() => setExploreOpen((o) => !o)}
                aria-expanded={exploreOpen}
                aria-controls="explore-popover"
                aria-label={exUi.triggerAria}
                title={exUi.triggerTitle}
              >
                <SlidersHorizontal size={20} strokeWidth={2.25} aria-hidden />
                {hasExploreFilters && (
                  <span className={styled["searchExplore__triggerDot"]} aria-hidden />
                )}
              </button>
            )}
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

        {showExplore && exploreOpen && (
          <div
            className={styled["searchExplore__popover"]}
            id="explore-popover"
            role="dialog"
            aria-label={exUi.dialogAria}
          >
            <p className={styled["searchExplore__hint"]}>{exUi.hint}</p>
            <div className={styled["searchExplore__grid"]}>
              <div className={styled["searchExplore__field"]}>
                <label htmlFor="explore-country">{exUi.labelCountry}</label>
                <select
                  id="explore-country"
                  value={exCountry}
                  onChange={(e) => setExCountry(e.target.value)}
                >
                  {countryOptions.map((o) => (
                    <option key={o.value || "all"} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styled["searchExplore__field"]}>
                <label htmlFor="explore-category">{exUi.labelCategory}</label>
                <select
                  id="explore-category"
                  value={exCategory}
                  onChange={(e) => setExCategory(e.target.value)}
                >
                  {categoryOptions.map((o) => (
                    <option key={o.value || "all-c"} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styled["searchExplore__field"]}>
                <label htmlFor="explore-date">{exUi.labelDate}</label>
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
                {exUi.btnApply}
              </button>
              <button
                type="button"
                className={styled["searchExplore__reset"]}
                onClick={handleExploreReset}
              >
                {exUi.btnReset}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

SearchContainer.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  enableExplore: PropTypes.bool,
  onExploreApply: PropTypes.func,
};
