import styled from './MainPage.module.css';
import SearchContainer from '../components/mainPage/SearchContainer';
import MainNews from '../components/mainPage/MainNews';
import SearchNews from '../components/mainPage/SearchNews';
import { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";

import { getSearch } from '../api/getNewsCardAPI';

export default function MainPage() {
    const location = useLocation();
    const receivedIsSearch = location.state?.isSearch || false;
    const receivedSearchTerm = location.state?.searchTerm || "";

    const [searchTerm, setSearchTerm] = useState(receivedSearchTerm);
    const [isSearch, setIsSearch] = useState(receivedIsSearch);
    
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        setSearchTerm(receivedSearchTerm);
        setIsSearch(receivedIsSearch);
    }, [receivedSearchTerm, receivedIsSearch]);

    // 검색 버튼 클릭 시, 
    useEffect(() => {
        if (isSearch) {
            const fetchSearchResults = async () => {
                const results = await getSearch(searchTerm);
                setSearchResults(results || []); // undefined 방지
            };
            fetchSearchResults();
        } else {
            setSearchResults([]); // 검색이 아닐 경우 빈 배열 유지
        }
    }, [isSearch]);
    

    return(
        <div className={styled['mainPage--container']}>
            <SearchContainer 
                searchTerm={searchTerm} setSearchTerm={setSearchTerm}
                setIsSearch={setIsSearch} 
            />
            {
                isSearch ?
                <SearchNews 
                    searchTerm={searchTerm}
                    searchResults={searchResults}
                />
                : <MainNews />
            }
        </div>
    )
}

