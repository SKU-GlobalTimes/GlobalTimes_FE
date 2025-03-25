import styled from './MainPage.module.css';
import SearchContainer from './SearchContainer';
import MainNews from './MainNews';
import SearchNews from './SearchNews';
import { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";


export default function MainPage() {
    const location = useLocation();
    const receivedIsSearch = location.state?.isSearch || false;
    const receivedSearchTerm = location.state?.searchTerm || "";

    const [searchTerm, setSearchTerm] = useState(receivedSearchTerm);
    const [category, setCategory] = useState('전체');
    const [isSearch, setIsSearch] = useState(receivedIsSearch);

    useEffect(() => {
        setSearchTerm(receivedSearchTerm);
        setIsSearch(receivedIsSearch);
    }, [receivedSearchTerm, receivedIsSearch]);
    

    return(
        <div className={styled['mainPage--container']}>
            <SearchContainer 
                searchTerm={searchTerm} setSearchTerm={setSearchTerm}
                category={category} setCategory={setCategory}
                setIsSearch={setIsSearch}
            />
            {
                isSearch ?
                <SearchNews 
                />
                : <MainNews />
            }
        </div>
    )
}

