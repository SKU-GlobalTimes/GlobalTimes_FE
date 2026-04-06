import styled from './SearchContainer.module.css'
import PropTypes from 'prop-types';
import { Search } from "lucide-react";
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { fetchTranslatedText } from "../../api/fetchTranslatedText.jsx";
import { useLanguage } from "../../util/LanguageContext.jsx";

export default function SearchContainer({searchTerm} ) { 
    const navigate = useNavigate();
    const { language } = useLanguage();
    const [ inputSearchTerm, setInputSearchTerm ] = useState(searchTerm);
    const [value, setValue] = useState(searchTerm || '');
    const [placeholder, setPlaceholder] = useState("Search news");
    const [searchLabel, setSearchLabel] = useState("Search");

    useEffect(() => {
        setInputSearchTerm(searchTerm);
        setValue(searchTerm);
    }, [searchTerm]);

    useEffect(() => {
        const translate = async () => {
            const [p, s] = await Promise.all([
                fetchTranslatedText("뉴스 검색", language),
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

    function handleInputChange(event){
        setInputSearchTerm(event.target.value);
        setValue(event.target.value);
    }

    function handleKeyDown(event) {
        if (event.key === "Enter") {
            handleSearch();
        }
    }

    function handleClickSearch(){
        handleSearch();
    }


    return(
        <div className={styled['searchContainer--container']}>
            <div className={styled['searchContainer--searchBar']}>
                <div className={styled['searchContainer--searchInputContainer']}>
                    <Search className={styled['input-icon']} size={20} />
                    <input 
                        className={styled['searchContainer--Input']}
                        value={value}
                        placeholder={placeholder}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                    ></input>
                </div>
                <button 
                    id="searchButton"
                    className={styled['searchContainer--searchButton']}
                    onClick={handleClickSearch}
                    disabled={!value.trim()}
                >{searchLabel}</button>
            </div>
            
        </div>
    )
}

SearchContainer.propTypes = {
    searchTerm: PropTypes.string.isRequired,   // searchTerm은 string이어야 함
};


