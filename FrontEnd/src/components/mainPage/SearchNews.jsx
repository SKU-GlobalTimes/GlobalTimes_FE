import styled from './News.module.css';
import SearchNewsCard from '../newsCard/SearchNewsCard';

export default function SearchNews() {

    return(
        <div className={styled['SearchNews--container']}>
            <h1 className={styled['SearchNews--hotIssues--title']}>검색 결과</h1>
            <div className={styled['SearchNews--resultList']}>
                <SearchNewsCard />
                <SearchNewsCard />
                <SearchNewsCard />
                <SearchNewsCard />
                <SearchNewsCard />
                <SearchNewsCard />
                <SearchNewsCard />
                <SearchNewsCard />
                <SearchNewsCard />
                <SearchNewsCard />
                <SearchNewsCard />
                <SearchNewsCard />
                <SearchNewsCard />
                <SearchNewsCard />
                <SearchNewsCard />
                <SearchNewsCard />
            </div>
        </div>
    )
}

