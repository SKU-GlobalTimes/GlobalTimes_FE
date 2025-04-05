import styled from './MainPage.module.css';
import SearchContainer from '../components/mainPage/SearchContainer';
import MainNews from '../components/mainPage/MainNews';
import SearchNews from '../components/mainPage/SearchNews';
import BlankNews from '../components/mainPage/BlankNews';

import { useState } from 'react';

import { getSearch } from '../api/getNewsCardAPI';

export default function MainPage() {

    const [searchTerm, setSearchTerm] = useState("");
    //const [isSearch, setIsSearch] = useState(false);
    
    const [searchResults, setSearchResults] = useState(null);
    const [isLoading, setIsLoading] = useState(false);


    /*
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
    */

    const handleSearch = async () => {
        if (!searchTerm.trim()) return; // 빈 값이면 검색 안 함
        setIsLoading(true); // 로딩 시작
        const results = await getSearch(searchTerm);
        setSearchResults(results || []);
        setIsLoading(false); // 로딩 끝
    };


    return(
        <div className={styled['mainPage--container']}>
            <SearchContainer 
                searchTerm={searchTerm} setSearchTerm={setSearchTerm}
                onSearch={handleSearch} 
            />
            {isLoading ? ( 
                <BlankNews message="검색 중입니다..." />  
            ) : searchResults === null ? ( 
                <MainNews /> 
            ) : searchResults.length > 0 ? (
                <SearchNews searchTerm={searchTerm} searchResults={searchResults} />
            ) : (
                <BlankNews message="검색 결과가 없습니다." />
            )}                 
        </div>
    )
}

