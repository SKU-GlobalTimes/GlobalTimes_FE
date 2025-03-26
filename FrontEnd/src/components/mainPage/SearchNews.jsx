import styled from './News.module.css';
import SearchNewsCard from '../newsCard/SearchNewsCard';

export default function SearchNews() {

    const searchResults = [
        { title: "검색 뉴스 1", summary: "이것은 검색된 뉴스 요약입니다.", image: "/america.png" },
        { title: "검색 뉴스 2", summary: "이것은 두 번째 검색 뉴스 요약입니다.", image: "/america.png" },
        { title: "검색 뉴스 3", summary: "세 번째 검색 뉴스 요약입니다.", image: "/america.png" },
        { title: "검색 뉴스 4", summary: "네 번째 검색 뉴스 요약입니다.", image: "/america.png" },
        { title: "검색 뉴스 5", summary: "다섯 번째 검색 뉴스 요약입니다.", image: "/america.png" },
        { title: "검색 뉴스 6", summary: "여섯 번째 검색 뉴스 요약입니다.", image: "/america.png" },
        { title: "검색 뉴스 7", summary: "일곱 번째 검색 뉴스 요약입니다.", image: "/america.png" },
        { title: "검색 뉴스 8", summary: "여덟 번째 검색 뉴스 요약입니다.", image: "/america.png" },
        { title: "검색 뉴스 9", summary: "아홉 번째 검색 뉴스 요약입니다.", image: "/america.png" },
        { title: "검색 뉴스 10", summary: "열 번째 검색 뉴스 요약입니다.", image: "/america.png" },
        { title: "검색 뉴스 11", summary: "열한 번째 검색 뉴스 요약입니다.", image: "/america.png" },
        { title: "검색 뉴스 12", summary: "열두 번째 검색 뉴스 요약입니다.", image: "/america.png" },
        { title: "검색 뉴스 13", summary: "열세 번째 검색 뉴스 요약입니다.", image: "/america.png" },
        { title: "검색 뉴스 14", summary: "열네 번째 검색 뉴스 요약입니다.", image: "/america.png" },
        { title: "검색 뉴스 15", summary: "열다섯 번째 검색 뉴스 요약입니다.", image: "/america.png" },
        { title: "검색 뉴스 16", summary: "열여섯 번째 검색 뉴스 요약입니다.", image: "/america.png" },
        { title: "검색 뉴스 17", summary: "열일곱 번째 검색 뉴스 요약입니다.", image: "/america.png" },
        { title: "검색 뉴스 18", summary: "열여덟 번째 검색 뉴스 요약입니다.", image: "/america.png" },
        { title: "검색 뉴스 19", summary: "열아홉 번째 검색 뉴스 요약입니다.", image: "/america.png" },
        { title: "검색 뉴스 20", summary: "스무 번째 검색 뉴스 요약입니다.", image: "/america.png" },
        { title: "검색 뉴스 21", summary: "스물한 번째 검색 뉴스 요약입니다.", image: "/america.png" },
        { title: "검색 뉴스 22", summary: "스물두 번째 검색 뉴스 요약입니다.", image: "/america.png" },
        { title: "검색 뉴스 23", summary: "스물세 번째 검색 뉴스 요약입니다.", image: "/america.png" },
        { title: "검색 뉴스 24", summary: "스물네 번째 검색 뉴스 요약입니다.", image: "/america.png" },
        { title: "검색 뉴스 25", summary: "스물다섯 번째 검색 뉴스 요약입니다.", image: "/america.png" },
        { title: "검색 뉴스 26", summary: "스물여섯 번째 검색 뉴스 요약입니다.", image: "/america.png" },
        { title: "검색 뉴스 27", summary: "스물일곱 번째 검색 뉴스 요약입니다.", image: "/america.png" },
        { title: "검색 뉴스 28", summary: "스물여덟 번째 검색 뉴스 요약입니다.", image: "/america.png" },
        { title: "검색 뉴스 29", summary: "스물아홉 번째 검색 뉴스 요약입니다.", image: "/america.png" },
        { title: "검색 뉴스 30", summary: "서른 번째 검색 뉴스 요약입니다.", image: "/america.png" }
    ];
    

    return(
        <div className={styled['SearchNews--container']}>
            <div className={styled['SearchNews--hotIssues--titleContainer']}>
                <h1 className={styled['SearchNews--hotIssues--title']}>검색 결과</h1>
            </div>
            <div className={styled['SearchNews--resultList']}>
                {searchResults.map((news, index) => (
                    <SearchNewsCard key={index} title={news.title} summary={news.summary} image={news.image} />
                ))}
            </div>
        </div>
    )
}

