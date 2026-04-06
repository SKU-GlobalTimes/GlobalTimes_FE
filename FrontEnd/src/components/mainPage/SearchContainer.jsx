import styled from "./SearchContainer.module.css";
import PropTypes from "prop-types";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchTranslatedText } from "../../api/fetchTranslatedText.jsx";
import { useLanguage } from "../../util/LanguageContext.jsx";

export default function SearchContainer({ searchTerm }) {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [inputSearchTerm, setInputSearchTerm] = useState(searchTerm);
  const [value, setValue] = useState(searchTerm || "");
  const [placeholder, setPlaceholder] = useState("검색어를 입력해주세요 ");
  const [searchLabel, setSearchLabel] = useState("Search");
  const [isFocused, setIsFocused] = useState(false);

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
    </div>
  );
}

SearchContainer.propTypes = {
  searchTerm: PropTypes.string.isRequired, // searchTerm은 string이어야 함
};
