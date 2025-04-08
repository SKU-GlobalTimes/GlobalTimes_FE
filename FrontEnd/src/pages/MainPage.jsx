import styled from './MainPage.module.css';
import SearchContainer from '../components/mainPage/SearchContainer';
import MainNews from '../components/mainPage/MainNews';

import { useState } from 'react';

export default function MainPage() {

    const [searchTerm, setSearchTerm] = useState("");


    return(
        <div className={styled['mainPage--container']}>
            <SearchContainer 
                searchTerm={searchTerm} setSearchTerm={setSearchTerm}
            />
            <MainNews />             
        </div>
    )
}

