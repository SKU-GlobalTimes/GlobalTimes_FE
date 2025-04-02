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
            { title: "러시아와 우크라이나, 흑해에서의 해상 휴전 합의", summary: "러시아와 우크라이나는 사우디아라비아에서 3일간의 평화 회담을 마친 후 미국과 별도로 협상으로 흑해에서의 해상 휴전을 합의했습니다. ", image: "/image_37.png", year: "2025", month:"3", day:"29" },
            { title: "Hot News 2", summary: "이것은 두 번째 핫 뉴스 요약입니다.", image: "/economy.png", year: "2025", month:"3", day:"29" },
            { title: "Hot News 3", summary: "세 번째 핫 뉴스 요약입니다.", image: "/economy.png" , year: "2025", month:"3", day:"29" },
            { title: "Hot News 4", summary: "네 번째 핫 뉴스 요약입니다.", image: "/economy.png" , year: "2025", month:"3", day:"29" },
            { title: "Hot News 5", summary: "다섯 번째 핫 뉴스 요약입니다.", image: "/economy.png" , year: "2025", month:"3", day:"29" },
            { title: "Hot News 6", summary: "다섯 번째 핫 뉴스 요약입니다.", image: "/economy.png" , year: "2025", month:"3", day:"29" },
            { title: "Hot News 7", summary: "다섯 번째 핫 뉴스 요약입니다.", image: "/economy.png" , year: "2025", month:"3", day:"29" },
            { title: "Hot News 8", summary: "다섯 번째 핫 뉴스 요약입니다.", image: "/economy.png", year: "2025", month:"3", day:"29" },
            { title: "Hot News 9", summary: "다섯 번째 핫 뉴스 요약입니다.", image: "/economy.png" , year: "2025", month:"3", day:"29" },
            { title: "Hot News 10", summary: "다섯 번째 핫 뉴스 요약입니다.", image: "/economy.png" , year: "2025", month:"3", day:"29" },
            { title: "러시아와 우크라이나, 흑해에서의 해상 휴전 합의", summary: "러시아와 우크라이나는 평화 회담을 마친 후 해상 휴전을 합의했습니다.", image: "/image_37.png" , year: "2025", month:"3", day:"29" },
            { title: "Hot News 2", summary: "이것은 두 번째 핫 뉴스 요약입니다.", image: "/economy.png" , year: "2025", month:"3", day:"29" },
            { title: "Hot News 3", summary: "세 번째 핫 뉴스 요약입니다.", image: "/economy.png" , year: "2025", month:"3", day:"29" },
            { title: "Hot News 4", summary: "네 번째 핫 뉴스 요약입니다.", image: "/economy.png", year: "2025", month:"3", day:"29" },
            { title: "Hot News 5", summary: "다섯 번째 핫 뉴스 요약입니다.", image: "/economy.png" , year: "2025", month:"3", day:"29" },
            { title: "Hot News 6", summary: "다섯 번째 핫 뉴스 요약입니다.", image: "/economy.png" , year: "2025", month:"3", day:"29" },
            { title: "Hot News 7", summary: "다섯 번째 핫 뉴스 요약입니다.", image: "/economy.png" , year: "2025", month:"3", day:"29" },
            { title: "Hot News 8", summary: "다섯 번째 핫 뉴스 요약입니다.", image: "/economy.png" , year: "2025", month:"3", day:"29" },
            { title: "Hot News 9", summary: "다섯 번째 핫 뉴스 요약입니다.", image: "/economy.png" , year: "2025", month:"3", day:"29" },
            { title: "Hot News 10", summary: "다섯 번째 핫 뉴스 요약입니다.", image: "/economy.png" , year: "2025", month:"3", day:"29" },
            { title: "러시아와 우크라이나, 흑해에서의 해상 휴전 합의", summary: "러시아와 우크라이나는 평화 회담을 마친 후 해상 휴전을 합의했습니다.", image: "/image_37.png" , year: "2025", month:"3", day:"29" },
            { title: "Hot News 2", summary: "이것은 두 번째 핫 뉴스 요약입니다.", image: "/economy.png" , year: "2025", month:"3", day:"29" },
            { title: "Hot News 3", summary: "세 번째 핫 뉴스 요약입니다.", image: "/economy.png" , year: "2025", month:"3", day:"29" },
            { title: "Hot News 4", summary: "네 번째 핫 뉴스 요약입니다.", image: "/economy.png", year: "2025", month:"3", day:"29" },
            { title: "Hot News 5", summary: "다섯 번째 핫 뉴스 요약입니다.", image: "/economy.png" , year: "2025", month:"3", day:"29" },
            { title: "Hot News 6", summary: "다섯 번째 핫 뉴스 요약입니다.", image: "/economy.png" , year: "2025", month:"3", day:"29" },
            { title: "Hot News 7", summary: "다섯 번째 핫 뉴스 요약입니다.", image: "/economy.png" , year: "2025", month:"3", day:"29" },
            { title: "Hot News 8", summary: "다섯 번째 핫 뉴스 요약입니다.", image: "/economy.png" , year: "2025", month:"3", day:"29" },
            { title: "Hot News 9", summary: "다섯 번째 핫 뉴스 요약입니다.", image: "/economy.png" , year: "2025", month:"3", day:"29" },
            { title: "Hot News 10", summary: "다섯 번째 핫 뉴스 요약입니다.", image: "/economy.png" , year: "2025", month:"3", day:"29" },
            { title: "Hot News 6", summary: "다섯 번째 핫 뉴스 요약입니다.", image: "/economy.png", year: "2025", month:"3", day:"29" },
            { title: "Hot News 7", summary: "다섯 번째 핫 뉴스 요약입니다.", image: "/economy.png" , year: "2025", month:"3", day:"29" },
            { title: "Hot News 8", summary: "다섯 번째 핫 뉴스 요약입니다.", image: "/economy.png" , year: "2025", month:"3", day:"29" },
            { title: "Hot News 9", summary: "다섯 번째 핫 뉴스 요약입니다.", image: "/economy.png" , year: "2025", month:"3", day:"29" },
            { title: "Hot News 10", summary: "다섯 번째 핫 뉴스 요약입니다.", image: "/economy.png" , year: "2025", month:"3", day:"29" },
        ]);

        setBasicNews([
            { title: "Basic News 1", summary: "이것은 일반 뉴스 요약입니다.", image: "/food.png", year: "2025", month:"3", day:"29" },
            { title: "Basic News 2", summary: "이것은 두 번째 일반 뉴스 요약입니다.", image: "/food.png" , year: "2025", month:"3", day:"29" },
            { title: "Basic News 3", summary: "세 번째 일반 뉴스 요약입니다.", image: "/food.png" , year: "2025", month:"3", day:"29" },
            { title: "Basic News 4", summary: "네 번째 일반 뉴스 요약입니다.", image: "/food.png", year: "2025", month:"3", day:"29" },
            { title: "Basic News 5", summary: "다섯 번째 일반 뉴스 요약입니다.", image: "/food.png" , year: "2025", month:"3", day:"29" },
            { title: "Basic News 6", summary: "여섯 번째 일반 뉴스 요약입니다.", image: "/food.png", year: "2025", month:"3", day:"29" },
            { title: "Basic News 7", summary: "일곱 번째 일반 뉴스 요약입니다.", image: "/food.png" , year: "2025", month:"3", day:"29" },
            { title: "Basic News 8", summary: "여덟 번째 일반 뉴스 요약입니다.", image: "/food.png" , year: "2025", month:"3", day:"29" },
            { title: "Basic News 9", summary: "아홉 번째 일반 뉴스 요약입니다.", image: "/food.png" , year: "2025", month:"3", day:"29" },
            { title: "Basic News 10", summary: "열 번째 일반 뉴스 요약입니다.", image: "/food.png" , year: "2025", month:"3", day:"29" },
            { title: "Basic News 11", summary: "열한 번째 일반 뉴스 요약입니다.", image: "/food.png" , year: "2025", month:"3", day:"29" },
            { title: "Basic News 12", summary: "열두 번째 일반 뉴스 요약입니다.", image: "/food.png" , year: "2025", month:"3", day:"29" },
            { title: "Basic News 1", summary: "이것은 일반 뉴스 요약입니다.", image: "/food.png" , year: "2025", month:"3", day:"29" },
            { title: "Basic News 2", summary: "이것은 두 번째 일반 뉴스 요약입니다.", image: "/food.png" , year: "2025", month:"3", day:"29" },
            { title: "Basic News 3", summary: "세 번째 일반 뉴스 요약입니다.", image: "/food.png" , year: "2025", month:"3", day:"29" },
            { title: "Basic News 4", summary: "네 번째 일반 뉴스 요약입니다.", image: "/food.png" , year: "2025", month:"3", day:"29" },
            { title: "Basic News 5", summary: "다섯 번째 일반 뉴스 요약입니다.", image: "/food.png" , year: "2025", month:"3", day:"29" },
            { title: "Basic News 6", summary: "여섯 번째 일반 뉴스 요약입니다.", image: "/food.png" , year: "2025", month:"3", day:"29" },
            { title: "Basic News 7", summary: "일곱 번째 일반 뉴스 요약입니다.", image: "/food.png" , year: "2025", month:"3", day:"29" },
            { title: "Basic News 8", summary: "여덟 번째 일반 뉴스 요약입니다.", image: "/food.png" , year: "2025", month:"3", day:"29" },
            { title: "Basic News 9", summary: "아홉 번째 일반 뉴스 요약입니다.", image: "/food.png" , year: "2025", month:"3", day:"29" },
            { title: "Basic News 10", summary: "열 번째 일반 뉴스 요약입니다.", image: "/food.png" , year: "2025", month:"3", day:"29" },
            { title: "Basic News 11", summary: "열한 번째 일반 뉴스 요약입니다.", image: "/food.png" , year: "2025", month:"3", day:"29" },
            { title: "Basic News 12", summary: "열두 번째 일반 뉴스 요약입니다.", image: "/food.png" , year: "2025", month:"3", day:"29" },
            { title: "Basic News 1", summary: "이것은 일반 뉴스 요약입니다.", image: "/food.png" , year: "2025", month:"3", day:"29" },
            { title: "Basic News 2", summary: "이것은 두 번째 일반 뉴스 요약입니다.", image: "/food.png", year: "2025", month:"3", day:"29" },
            { title: "Basic News 3", summary: "세 번째 일반 뉴스 요약입니다.", image: "/food.png" , year: "2025", month:"3", day:"29" },
            { title: "Basic News 4", summary: "네 번째 일반 뉴스 요약입니다.", image: "/food.png" , year: "2025", month:"3", day:"29" },
            { title: "Basic News 5", summary: "다섯 번째 일반 뉴스 요약입니다.", image: "/food.png" , year: "2025", month:"3", day:"29" },
            { title: "Basic News 6", summary: "여섯 번째 일반 뉴스 요약입니다.", image: "/food.png" , year: "2025", month:"3", day:"29" },
            { title: "Basic News 7", summary: "일곱 번째 일반 뉴스 요약입니다.", image: "/food.png" , year: "2025", month:"3", day:"29" },
            { title: "Basic News 8", summary: "여덟 번째 일반 뉴스 요약입니다.", image: "/food.png" , year: "2025", month:"3", day:"29" },
            { title: "Basic News 9", summary: "아홉 번째 일반 뉴스 요약입니다.", image: "/food.png" , year: "2025", month:"3", day:"29" },
            { title: "Basic News 10", summary: "열 번째 일반 뉴스 요약입니다.", image: "/food.png" , year: "2025", month:"3", day:"29" },
            { title: "Basic News 11", summary: "열한 번째 일반 뉴스 요약입니다.", image: "/food.png" , year: "2025", month:"3", day:"29" },
            { title: "Basic News 12", summary: "열두 번째 일반 뉴스 요약입니다.", image: "/food.png" , year: "2025", month:"3", day:"29" },
            { title: "Basic News 1", summary: "이것은 일반 뉴스 요약입니다.", image: "/food.png" , year: "2025", month:"3", day:"29" },
            { title: "Basic News 2", summary: "이것은 두 번째 일반 뉴스 요약입니다.", image: "/food.png" , year: "2025", month:"3", day:"29" },
            { title: "Basic News 3", summary: "세 번째 일반 뉴스 요약입니다.", image: "/food.png" , year: "2025", month:"3", day:"29" },
            { title: "Basic News 4", summary: "네 번째 일반 뉴스 요약입니다.", image: "/food.png" , year: "2025", month:"3", day:"29" },
            { title: "Basic News 5", summary: "다섯 번째 일반 뉴스 요약입니다.", image: "/food.png" , year: "2025", month:"3", day:"29" },
            { title: "Basic News 6", summary: "여섯 번째 일반 뉴스 요약입니다.", image: "/food.png" , year: "2025", month:"3", day:"29" },
            { title: "Basic News 7", summary: "일곱 번째 일반 뉴스 요약입니다.", image: "/food.png" , year: "2025", month:"3", day:"29" },
            { title: "Basic News 8", summary: "여덟 번째 일반 뉴스 요약입니다.", image: "/food.png" , year: "2025", month:"3", day:"29" },
            { title: "Basic News 9", summary: "아홉 번째 일반 뉴스 요약입니다.", image: "/food.png" , year: "2025", month:"3", day:"29" },
            { title: "Basic News 10", summary: "열 번째 일반 뉴스 요약입니다.", image: "/food.png" , year: "2025", month:"3", day:"29" },
            { title: "Basic News 11", summary: "열한 번째 일반 뉴스 요약입니다.", image: "/food.png" , year: "2025", month:"3", day:"29" },
            { title: "Basic News 12", summary: "열두 번째 일반 뉴스 요약입니다.", image: "/food.png" , year: "2025", month:"3", day:"29" },
            { title: "Basic News 11", summary: "열한 번째 일반 뉴스 요약입니다.", image: "/food.png" , year: "2025", month:"3", day:"29" },
            { title: "Basic News 12", summary: "열두 번째 일반 뉴스 요약입니다.", image: "/food.png" , year: "2025", month:"3", day:"29" },
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
                        <HotNewsCard key={index} title={news.title} summary={news.summary} image={news.image} year={news.year} month={news.month} day={news.day} />
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
                        <BasicNewsCard key={index} title={news.title} summary={news.summary} image={news.image} year={news.year} month={news.month} day={news.day} />
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

