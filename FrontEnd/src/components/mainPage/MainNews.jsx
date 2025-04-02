import styled from './News.module.css';
import HotNewsCard from '../newsCard/HotNewsCard';
import BasicNewsCard from '../newsCard/BasicNewsCard';
import Pagenation from './Pagenation';
import { useState, useEffect } from 'react';

export default function MainNews(){
    const [hotNews, setHotNews] = useState([]);
    const [basicNews, setBasicNews] = useState([]);
    const [hotPage, setHotPage] = useState(1);
    const [basicPage, setBasicPage] = useState(1);

    useEffect(() => {
        setHotNews([
            { press: "BBC", title: "러시아와 우크라이나, 흑해에서의 해상 휴전 합의", summary: "러시아와 우크라이나는 사우디아라비아에서 열린 평화 회담 후 해상 휴전을 합의했습니다.", image: "/image_37.png", year: "2025", month: "3", day: "29" },
            { press: "CNN", title: "Hot News 2", summary: "이것은 두 번째 핫 뉴스 요약입니다.", image: "/economy.png", year: "2025", month: "3", day: "29" },
            { press: "Reuters", title: "Hot News 3", summary: "세 번째 핫 뉴스 요약입니다.", image: "/economy.png", year: "2025", month: "3", day: "29" },
            { press: "The Guardian", title: "Hot News 4", summary: "네 번째 핫 뉴스 요약입니다.", image: "/economy.png", year: "2025", month: "3", day: "29" },
            { press: "NY Times", title: "Hot News 5", summary: "다섯 번째 핫 뉴스 요약입니다.", image: "/economy.png", year: "2025", month: "3", day: "29" },
            { press: "Washington Post", title: "Hot News 6", summary: "여섯 번째 핫 뉴스 요약입니다.", image: "/economy.png", year: "2025", month: "3", day: "29" },
            { press: "Al Jazeera", title: "Hot News 7", summary: "일곱 번째 핫 뉴스 요약입니다.", image: "/economy.png", year: "2025", month: "3", day: "29" },
            { press: "Le Monde", title: "Hot News 8", summary: "여덟 번째 핫 뉴스 요약입니다.", image: "/economy.png", year: "2025", month: "3", day: "29" },
            { press: "The Times", title: "Hot News 9", summary: "아홉 번째 핫 뉴스 요약입니다.", image: "/economy.png", year: "2025", month: "3", day: "29" },
            { press: "NHK", title: "Hot News 10", summary: "열 번째 핫 뉴스 요약입니다.", image: "/economy.png", year: "2025", month: "3", day: "29" },
        ]);
        
        setBasicNews([
            { press: "KBS", title: "Basic News 1", summary: "이것은 일반 뉴스 요약입니다. 이것은 일반 뉴스 요약입니다.이것은 일반 뉴스 요약입니다.이것은 일반 뉴스 요약입니다.이것은 일반 뉴스 요약입니다.", image: "/food.png", year: "2025", month: "3", day: "29" },
            { press: "MBC", title: "Basic News 2", summary: "이것은 두 번째 일반 뉴스 요약입니다.", image: "/food.png", year: "2025", month: "3", day: "29" },
            { press: "SBS", title: "Basic News 3", summary: "세 번째 일반 뉴스 요약입니다.", image: "/food.png", year: "2025", month: "3", day: "29" },
            { press: "조선일보", title: "Basic News 4", summary: "네 번째 일반 뉴스 요약입니다.", image: "/food.png", year: "2025", month: "3", day: "29" },
            { press: "중앙일보", title: "Basic News 5", summary: "다섯 번째 일반 뉴스 요약입니다.", image: "/food.png", year: "2025", month: "3", day: "29" },
            { press: "동아일보", title: "Basic News 6", summary: "여섯 번째 일반 뉴스 요약입니다.", image: "/food.png", year: "2025", month: "3", day: "29" },
            { press: "한겨레", title: "Basic News 7", summary: "일곱 번째 일반 뉴스 요약입니다.", image: "/food.png", year: "2025", month: "3", day: "29" },
            { press: "경향신문", title: "Basic News 8", summary: "여덟 번째 일반 뉴스 요약입니다.", image: "/food.png", year: "2025", month: "3", day: "29" },
            { press: "매일경제", title: "Basic News 9", summary: "아홉 번째 일반 뉴스 요약입니다.", image: "/food.png", year: "2025", month: "3", day: "29" },
            { press: "한국경제", title: "Basic News 10", summary: "열 번째 일반 뉴스 요약입니다.", image: "/food.png", year: "2025", month: "3", day: "29" },
            { press: "서울경제", title: "Basic News 11", summary: "이것은 열한 번째 일반 뉴스 요약입니다.", image: "/food.png", year: "2025", month: "3", day: "29" },
            { press: "연합뉴스", title: "Basic News 12", summary: "이것은 열두 번째 일반 뉴스 요약입니다.", image: "/food.png", year: "2025", month: "3", day: "29" },
            { press: "YTN", title: "Basic News 13", summary: "이것은 열세 번째 일반 뉴스 요약입니다.", image: "/food.png", year: "2025", month: "3", day: "29" },
            { press: "JTBC", title: "Basic News 14", summary: "이것은 열네 번째 일반 뉴스 요약입니다.", image: "/food.png", year: "2025", month: "3", day: "29" },
            { press: "TV조선", title: "Basic News 15", summary: "이것은 열다섯 번째 일반 뉴스 요약입니다.", image: "/food.png", year: "2025", month: "3", day: "29" },
            { press: "채널A", title: "Basic News 16", summary: "이것은 열여섯 번째 일반 뉴스 요약입니다.", image: "/food.png", year: "2025", month: "3", day: "29" },
            { press: "MBN", title: "Basic News 17", summary: "이것은 열일곱 번째 일반 뉴스 요약입니다.", image: "/food.png", year: "2025", month: "3", day: "29" },
            { press: "헤럴드경제", title: "Basic News 18", summary: "이것은 열여덟 번째 일반 뉴스 요약입니다.", image: "/food.png", year: "2025", month: "3", day: "29" },
            { press: "코리아타임스", title: "Basic News 19", summary: "이것은 열아홉 번째 일반 뉴스 요약입니다.", image: "/food.png", year: "2025", month: "3", day: "29" },
            { press: "아시아경제", title: "Basic News 20", summary: "이것은 스무 번째 일반 뉴스 요약입니다.", image: "/food.png", year: "2025", month: "3", day: "29" },
            { press: "이데일리", title: "Basic News 21", summary: "이것은 스물한 번째 일반 뉴스 요약입니다.", image: "/food.png", year: "2025", month: "3", day: "29" },
            // 31개 채우기!
        ]);
    }, []);



    const hotPerPage = 6;
    const basicPerPage = 8;
    const hotTotalPages = Math.ceil(hotNews.length / hotPerPage);
    const basicTotalPages = Math.ceil(basicNews.length / basicPerPage);

    const hotNewsToShow = hotNews.slice((hotPage - 1) * hotPerPage, hotPage * hotPerPage);
    const basicNewsToShow = basicNews.slice((basicPage - 1) * basicPerPage, basicPage * basicPerPage);

    return(
        <div className={styled['MainNews--container']}>
            <div className={styled['MainNews--Newscontainer']}>
                <div className={styled['MainNews--titleContainer']}>
                    <h1 className={styled['MainNews--title']}>Hot News</h1>
                </div>

                <div className={styled['MainNews--News']}>
                    {hotNewsToShow.map((news, index) => (
                        <HotNewsCard key={index}  press={news.press}  title={news.title} summary={news.summary} image={news.image} year={news.year} month={news.month} day={news.day} />
                    ))}
                </div>
                
                <div className={styled['MainNews--pages']}>
                        <Pagenation
                            currentPage={hotPage}
                            totalPages={hotTotalPages}
                            onPageChange={setHotPage}
                        />
                </div>
            </div>

            <div className={styled['MainNews--Newscontainer']}>
                <div className={styled['MainNews--titleContainer']}>
                    <h1 className={styled['MainNews--title']}>Latest News</h1>
                </div>

                <div className={styled['MainNews--News__latest']}>
                    {basicNewsToShow.map((news, index) => (
                        <BasicNewsCard key={index} press={news.press} title={news.title} summary={news.summary} image={news.image} year={news.year} month={news.month} day={news.day} />
                    ))}
                </div>

                <div className={styled['MainNews--pages']}>
                        <Pagenation
                            currentPage={basicPage}
                            totalPages={basicTotalPages}
                            onPageChange={setBasicPage}
                        />
                </div>
            </div>
            
            
            

        </div>
    )
}

