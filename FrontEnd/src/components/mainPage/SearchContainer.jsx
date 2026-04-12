import styled from "./SearchContainer.module.css";
import PropTypes from "prop-types";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchTranslatedText } from "../../api/fetchTranslatedText.jsx";
import { useLanguage } from "../../util/LanguageContext.jsx";
import {
  EXPLORE_COUNTRY_OPTIONS,
  EXPLORE_CATEGORY_OPTIONS,
} from "./exploreOptions";
import ExploreSelect from "./ExploreSelect.jsx";
import ExploreDatePicker from "./ExploreDatePicker.jsx";

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
  chipsHint: "적용 중인 조건",
  removeChip: "제거",
  datePlaceholder: "날짜를 선택하세요",
  dateClear: "날짜 지우기",
  datePrevMonth: "이전 달",
  dateNextMonth: "다음 달",
};

export default function SearchContainer({
  searchTerm,
  enableExplore = false,
  onExploreApply,
}) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
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
    const params = new URLSearchParams();
    if (showExplore) {
      if (exCountry) params.set("country", exCountry);
      if (exCategory) params.set("category", exCategory);
      if (exDate) params.set("date", exDate);
    } else {
      ["country", "category", "date"].forEach((key) => {
        const v = searchParams.get(key);
        if (v) params.set(key, v);
      });
    }
    const qs = params.toString();
    navigate(
      `/search/${encodeURIComponent(keyword)}${qs ? `?${qs}` : ""}`,
    );
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

  const exploreChips = useMemo(() => {
    if (!showExplore || !hasExploreFilters) return [];
    const chips = [];
    if (exCountry) {
      const opt = countryOptions.find((o) => o.value === exCountry);
      chips.push({
        key: "country",
        text: opt?.label ?? exCountry,
      });
    }
    if (exCategory) {
      const opt = categoryOptions.find((o) => o.value === exCategory);
      chips.push({
        key: "category",
        text: opt?.label ?? exCategory,
      });
    }
    if (exDate) {
      chips.push({
        key: "date",
        text: exDate.replace(/-/g, "."),
      });
    }
    return chips;
  }, [
    showExplore,
    hasExploreFilters,
    exCountry,
    exCategory,
    exDate,
    countryOptions,
    categoryOptions,
  ]);

  function removeExploreChip(key) {
    if (key === "country") setExCountry("");
    else if (key === "category") setExCategory("");
    else if (key === "date") setExDate("");
  }

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

        {showExplore && exploreChips.length > 0 && (
          <div
            className={styled["searchExplore__chipsRow"]}
            aria-label={exUi.chipsHint}
          >
            <span className={styled["searchExplore__chipsHint"]}>
              {exUi.chipsHint}
            </span>
            <div className={styled["searchExplore__chips"]}>
              {exploreChips.map((chip) => (
                <span key={chip.key} className={styled["searchExplore__chip"]}>
                  <span className={styled["searchExplore__chipText"]}>
                    {chip.text}
                  </span>
                  <button
                    type="button"
                    className={styled["searchExplore__chipRemove"]}
                    onClick={() => removeExploreChip(chip.key)}
                    aria-label={`${chip.text} ${exUi.removeChip}`}
                  >
                    <X size={12} strokeWidth={2.5} aria-hidden />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

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
                <ExploreSelect
                  id="explore-country"
                  value={exCountry}
                  onChange={setExCountry}
                  options={countryOptions}
                  ariaLabel={exUi.labelCountry}
                />
              </div>
              <div className={styled["searchExplore__field"]}>
                <label htmlFor="explore-category">{exUi.labelCategory}</label>
                <ExploreSelect
                  id="explore-category"
                  value={exCategory}
                  onChange={setExCategory}
                  options={categoryOptions}
                  ariaLabel={exUi.labelCategory}
                />
              </div>
              <div className={styled["searchExplore__field"]}>
                <label htmlFor="explore-date">{exUi.labelDate}</label>
                <ExploreDatePicker
                  id="explore-date"
                  value={exDate}
                  onChange={setExDate}
                  placeholder={exUi.datePlaceholder}
                  clearLabel={exUi.dateClear}
                  ariaLabel={exUi.labelDate}
                  prevMonthAria={exUi.datePrevMonth}
                  nextMonthAria={exUi.dateNextMonth}
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
