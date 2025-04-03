import PropTypes from 'prop-types';
import styled from './News.module.css';
import SearchNewsCard from '../newsCard/SearchNewsCard';


export default function SearchNews({ searchResults = [] }) {

    /*
    const searchResults = [
        { press: "The Times", title: "검색 뉴스 1", summary: "이것은 검색된 뉴스 요약입니다. 이것은 검색된 뉴스 요약입니다.이것은 검색된 뉴스 요약입니다.이것은 검색된 뉴스 요약입니다.이것은 검색된 뉴스 요약입니다.이것은 검색된 뉴스 요약입니다.이것은 검색된 뉴스 요약입니다.", image: "/america.png", year: "2025", month: "3", day: "30" },
        { press: "The Times", title: "검색 뉴스 2", summary: "이것은 두 번째 검색 뉴스 요약입니다.", image: "/america.png", year: "2025", month: "3", day: "30" },
        { press: "The Times", title: "검색 뉴스 3", summary: "세 번째 검색 뉴스 요약입니다.", image: "/america.png", year: "2025", month: "3", day: "30" },
        { press: "The Times", title: "검색 뉴스 4", summary: "네 번째 검색 뉴스 요약입니다.", image: "/america.png", year: "2025", month: "3", day: "30" },
        { press: "The Times", title: "검색 뉴스 5", summary: "다섯 번째 검색 뉴스 요약입니다.", image: "/america.png", year: "2025", month: "3", day: "30" },
        { press: "The Times", title: "검색 뉴스 6", summary: "여섯 번째 검색 뉴스 요약입니다.", image: "/america.png", year: "2025", month: "3", day: "30" },
        { press: "The Times", title: "검색 뉴스 7", summary: "일곱 번째 검색 뉴스 요약입니다.", image: "/america.png", year: "2025", month: "3", day: "30" },
        { press: "The Times", title: "검색 뉴스 8", summary: "여덟 번째 검색 뉴스 요약입니다.", image: "/america.png", year: "2025", month: "3", day: "30" },
        { press: "The Times", title: "검색 뉴스 9", summary: "아홉 번째 검색 뉴스 요약입니다.", image: "/america.png", year: "2025", month: "3", day: "30" },
        { press: "The Times", title: "검색 뉴스 10", summary: "열 번째 검색 뉴스 요약입니다.", image: "/america.png", year: "2025", month: "3", day: "30" },
        { press: "The Times", title: "검색 뉴스 11", summary: "열한 번째 검색 뉴스 요약입니다.", image: "/america.png", year: "2025", month: "3", day: "30" },
        { press: "The Times", title: "검색 뉴스 12", summary: "열두 번째 검색 뉴스 요약입니다.", image: "/america.png", year: "2025", month: "3", day: "30" },
        { press: "The Times", title: "검색 뉴스 13", summary: "열세 번째 검색 뉴스 요약입니다.", image: "/america.png", year: "2025", month: "3", day: "30" },
        { press: "The Times", title: "검색 뉴스 14", summary: "열네 번째 검색 뉴스 요약입니다.", image: "/america.png", year: "2025", month: "3", day: "30" },
        { press: "The Times", title: "검색 뉴스 15", summary: "열다섯 번째 검색 뉴스 요약입니다.", image: "/america.png", year: "2025", month: "3", day: "30" },
        { press: "The Times", title: "검색 뉴스 16", summary: "열여섯 번째 검색 뉴스 요약입니다.", image: "/america.png", year: "2025", month: "3", day: "30" },
        { press: "The Times", title: "검색 뉴스 17", summary: "열일곱 번째 검색 뉴스 요약입니다.", image: "/america.png", year: "2025", month: "3", day: "30" },
        { press: "The Times", title: "검색 뉴스 18", summary: "열여덟 번째 검색 뉴스 요약입니다.", image: "/america.png", year: "2025", month: "3", day: "30" },
        { press: "The Times", title: "검색 뉴스 19", summary: "열아홉 번째 검색 뉴스 요약입니다.", image: "/america.png", year: "2025", month: "3", day: "30" },
        { press: "The Times", title: "검색 뉴스 20", summary: "스무 번째 검색 뉴스 요약입니다.", image: "/america.png", year: "2025", month: "3", day: "30" },
        { press: "The Times", title: "검색 뉴스 21", summary: "스물한 번째 검색 뉴스 요약입니다.", image: "/america.png", year: "2025", month: "3", day: "30" },
        { press: "The Times", title: "검색 뉴스 22", summary: "스물두 번째 검색 뉴스 요약입니다.", image: "/america.png", year: "2025", month: "3", day: "30" },
        { press: "The Times", title: "검색 뉴스 23", summary: "스물세 번째 검색 뉴스 요약입니다.", image: "/america.png", year: "2025", month: "3", day: "30" },
        { press: "The Times", title: "검색 뉴스 24", summary: "스물네 번째 검색 뉴스 요약입니다.", image: "/america.png", year: "2025", month: "3", day: "30" },
        { press: "The Times", title: "검색 뉴스 25", summary: "스물다섯 번째 검색 뉴스 요약입니다.", image: "/america.png", year: "2025", month: "3", day: "30" },
        { press: "The Times", title: "검색 뉴스 26", summary: "스물여섯 번째 검색 뉴스 요약입니다.", image: "/america.png", year: "2025", month: "3", day: "30" },
        { press: "The Times", title: "검색 뉴스 27", summary: "스물일곱 번째 검색 뉴스 요약입니다.", image: "/america.png", year: "2025", month: "3", day: "30" },
        { press: "The Times", title: "검색 뉴스 28", summary: "스물여덟 번째 검색 뉴스 요약입니다.", image: "/america.png", year: "2025", month: "3", day: "30" },
        { press: "The Times", title: "검색 뉴스 29", summary: "스물아홉 번째 검색 뉴스 요약입니다.", image: "/america.png", year: "2025", month: "3", day: "30" },
        { press: "The Times", title: "검색 뉴스 30", summary: "서른 번째 검색 뉴스 요약입니다.", image: "/america.png", year: "2025", month: "3", day: "30" },
        { press: "The Times", title: "검색 뉴스 31", summary: "서른 번째 검색 뉴스 요약입니다.", image: "/america.png", year: "2025", month: "3", day: "30" }
    ];
    */
    

    return(
        <div className={styled['SearchNews--container']}>
            <div className={styled['SearchNews--Newscontainer']}>
                <div className={styled['SearchNews--titleContainer']}>
                    <h1 className={styled['SearchNews--title']}>검색 결과</h1>
                </div>

                <div className={styled['SearchNews--News']}>
                    {searchResults.map((news, index) => (
                        <SearchNewsCard key={index} press={news.sourceName} title={news.title} summary={news.description} image={news.urlToImage} year={news.year} month={news.month} day={news.day}  />
                    ))}
                </div>
            </div>
        </div>
    )
}



SearchNews.propTypes = {
    searchResults: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            sourceName: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            description: PropTypes.string,
            urlToImage: PropTypes.string,
            publishedAt: PropTypes.string.isRequired, // 원래 날짜 형태
            year: PropTypes.string.isRequired,
            month: PropTypes.string.isRequired,
            day: PropTypes.string.isRequired,
        })
    ).isRequired
};


