import styled from './SearchContainer.module.css';
import { Search } from "lucide-react";

export default function SearchContainer() {

    return(
        <div className={styled['searchContainer--container']}>
            <div className={styled['searchContainer--searchBar']}>
                <div className={styled['searchContainer--searchInputContainer']}>
                    <Search className={styled['input-icon']} size={20} />
                    <input className={styled['searchContainer--Input']}></input>
                </div>
                <button className={styled['searchContainer--searchButton']}>검색</button>
            </div>
            <div className={styled['searchContainer--categoryContainer']}>
                <button className={styled['searchContainer--categoryButton']}>전체</button>
                <button className={styled['searchContainer--categoryButton']}>시사</button>
                <button className={styled['searchContainer--categoryButton']}>정치</button>
                <button className={styled['searchContainer--categoryButton']}>경제</button>
                <button className={styled['searchContainer--categoryButton']}>사회</button>
                <button className={styled['searchContainer--categoryButton']}>문화</button>
                <button className={styled['searchContainer--categoryButton']}>지역</button>
                <button className={styled['searchContainer--categoryButton']}>스포츠</button>
                <button className={styled['searchContainer--categoryButton']}>IT</button>
                <button className={styled['searchContainer--categoryButton']}>국제</button>
                <button className={styled['searchContainer--categoryButton']}>범죄</button>
                <button className={styled['searchContainer--categoryButton']}>사고</button>
                <button className={styled['searchContainer--categoryButton']}>재해</button>
                <button className={styled['searchContainer--categoryButton']}>연예</button>
            </div>
        </div>
    )
}


