import styled from './LandingPage.module.css';
import { Search } from "lucide-react";
import { useState } from 'react';

export default function LandingPage() {
    const [searchTerm, setSearchTerm] = useState("");

    function handleInputChange(event){
        setSearchTerm(event.target.value);
    }

    function handleKeyDown(event) {
        if (event.key === 'Enter') {
            document.getElementById('searchButton').click(); // 버튼 클릭 이벤트 실행
        }
    }

    return(
        <div className={styled['landingPage--container']}>
            <p className={styled['landingPage--title']}>GLOBAL TIMES</p>
            <div className={styled['landingPage--searchContainer']}>
                <div className={styled['landingPage--searchInputContainer']}>
                    <Search className={styled['input-icon']} size={20} />
                    <input 
                        className={styled['landingPage--input']} 
                        placeholder='해외 뉴스 기사를 검색해보세요'
                        value={searchTerm}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                    />
                </div>
                
                
                <button 
                    id="searchButton"
                    className={styled['landingPage--button']} 
                    onClick={()=>{console.log(searchTerm);}}
                >검색</button>
            </div>
        </div>
    )
}