import styled from './MainPage.module.css';
import SearchContainer from '../components/mainPage/SearchContainer';
import SearchNews from '../components/mainPage/SearchNews';
import BlankNews from '../components/mainPage/BlankNews';
import ApiErrorMessage from '../components/commons/apiState/ApiErrorMessage';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation, useSearchParams } from "react-router-dom";
import { getSearch } from '../api/getNewsCardAPI';
import { getApiErrorMessage } from '../api/apiClient';

function exploreFiltersFromParams(searchParams) {
    const country = searchParams.get("country");
    const category = searchParams.get("category");
    const date = searchParams.get("date");
    return {
        ...(country ? { country } : {}),
        ...(category ? { category } : {}),
        ...(date ? { date } : {}),
    };
}

export default function SearchPage() {
    const { keyword } = useParams();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(keyword);
    
    const [searchResults, setSearchResults] = useState(null);
    const [translatedWord, setTranslatedWord] = useState("");
    const [originalWord, setOriginalWord] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [searchError, setSearchError] = useState("");

    const handleSearch = useCallback(async (term, exploreFilters = {}) => {
        if (!term.trim()) return;
        setIsLoading(true);
        setSearchError("");

        try {
            const { results, originalText, translatedText } = await getSearch(term, exploreFilters);
            setSearchResults(results || []);
            setOriginalWord(originalText || "");
            setTranslatedWord(translatedText || "");
        } catch (error) {
            setSearchResults(null);
            setSearchError(getApiErrorMessage(error, "검색 결과를 불러오지 못했습니다."));
        } finally {
            setIsLoading(false);
        }
    }, []);

    const exploreQueryKey = searchParams.toString();

    useEffect(() => {
        if (!keyword) return;
        setSearchTerm(keyword);
        const filters = exploreFiltersFromParams(new URLSearchParams(exploreQueryKey));
        handleSearch(keyword, filters);
    }, [location.key, keyword, exploreQueryKey, handleSearch]);


    return(
        <div className={styled['mainPage--container']}>
            <SearchContainer 
                searchTerm={searchTerm || ""}
            />
            {isLoading ? (
                <BlankNews message="검색 중입니다..." />
            ) : searchError ? (
                <ApiErrorMessage message={searchError} />
            ) : searchResults?.length > 0 ? (
                <SearchNews
                    searchResults={searchResults}
                    originalText={originalWord}
                    translatedText={translatedWord}
                />
            ) : (
                <BlankNews message="검색 결과가 없습니다." />
            )}                 
        </div>
    )
}





