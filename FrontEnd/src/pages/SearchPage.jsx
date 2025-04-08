import styled from './MainPage.module.css';
import SearchContainer from '../components/mainPage/SearchContainer';
import SearchNews from '../components/mainPage/SearchNews';
import BlankNews from '../components/mainPage/BlankNews';

import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { getSearch } from '../api/getNewsCardAPI';

export default function SearchPage() {
    const { keyword } = useParams();
    const [searchTerm, setSearchTerm] = useState(keyword);
    //const [isSearch, setIsSearch] = useState(false);
    
    const [searchResults, setSearchResults] = useState(null);
    const [translatedWord, setTranslatedWord] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = async () => {
        if (!searchTerm.trim()) return; // 빈 값이면 검색 안 함
        setIsLoading(true); // 로딩 시작

        const { results, translatedText } = await getSearch(searchTerm);
        setSearchResults(results || []);
        setTranslatedWord(translatedText || "");

        setIsLoading(false); // 로딩 끝
    };

    useEffect(() => {
        if (keyword) {
            setSearchTerm(keyword);
            handleSearch();
        }
    }, [keyword]);


    return(
        <div className={styled['mainPage--container']}>
            <SearchContainer 
                searchTerm={searchTerm} setSearchTerm={setSearchTerm}
                onSearch={handleSearch} 
            />
            {isLoading ? ( 
                <BlankNews message="검색 중입니다..." />  
            ) : searchResults?.length > 0 ? (
                <SearchNews 
                    searchTerm={searchTerm} 
                    searchResults={searchResults} 
                    translatedText={translatedWord}
                />
            ) : (
                <BlankNews message="검색 결과가 없습니다." />
            )}                 
        </div>
    )
}





