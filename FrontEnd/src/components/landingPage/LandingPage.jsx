import styled from './LandingPage.module.css';
import { Search } from "lucide-react";

export default function LandingPage() {

    return(
        <div className={styled['landingPage--container']}>
            <p className={styled['landingPage--title']}>GLOBAL TIMES</p>
            <div className={styled['landingPage--searchContainer']}>
                <div className={styled['landingPage--searchInputContainer']}>
                    <Search className={styled['input-icon']} size={20} />
                    <input 
                        className={styled['landingPage--input']} 
                        placeholder='해외 뉴스 기사를 검색해보세요'
                    />
                </div>
                
                
                <button className={styled['landingPage--button']} >검색</button>
            </div>
        </div>
    )
}