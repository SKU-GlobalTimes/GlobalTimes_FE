import styled from './MainPage.module.css';
import SearchContainer from '../components/mainPage/SearchContainer';
import MainNews from '../components/mainPage/MainNews';

import { useState } from 'react';

export default function MainPage() {

    const [searchTerm, setSearchTerm] = useState("");
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


    return(
        <div className={styled['mainPage--container']}>
            <SearchContainer 
                searchTerm={searchTerm} setSearchTerm={setSearchTerm}
            />
            <MainNews />             
        </div>
    )
}

