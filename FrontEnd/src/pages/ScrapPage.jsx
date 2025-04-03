import styled from './ScrapPage.module.css';
import { useState,useEffect } from 'react';
import ScrapNewsCard from '../components/newsCard/ScrapNewsCard';
import Pagenation from '../components/mainPage/Pagenation';

export default function ScrapPage() {
    const [hotNews, setHotNews] = useState([]);
    const [hotPage, setHotPage] = useState(1);

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
        
    }, []);

    const hotPerPage = 6;
    const hotTotalPages = Math.ceil(hotNews.length / hotPerPage);
    const hotNewsToShow = hotNews.slice((hotPage - 1) * hotPerPage, hotPage * hotPerPage);


    return(
        <div className={styled['ScrapNews--container']}>
            <div className={styled['ScrapNews--Newscontainer']}>
                <div className={styled['ScrapNews--titleContainer']}>
                    <h1 className={styled['ScrapNews--title']}>My Scrap</h1>
                </div>

                <div className={styled['ScrapNews--News']}>
                    {hotNewsToShow.map((news, index) => (
                        <ScrapNewsCard key={index}  press={news.press}  title={news.title} summary={news.summary} image={news.image} year={news.year} month={news.month} day={news.day} />
                    ))}
                </div>
                
                <div className={styled['ScrapNews--pages']}>
                        <Pagenation
                            currentPage={hotPage}
                            totalPages={hotTotalPages}
                            onPageChange={setHotPage}
                        />
                </div>
            </div>
        </div>
    )
}



