import styled from './News.module.css';
import HotNewsCard from '../newsCard/HotNewsCard';
import BasicNewsCard from '../newsCard/BasicNewsCard';

export default function MainNews(){

    const hotNews = [
        { title: "Hot News 1", summary: "이것은 핫 뉴스 요약입니다.", image: "/economy.png" },
        { title: "Hot News 2", summary: "이것은 두 번째 핫 뉴스 요약입니다.", image: "/economy.png" },
        { title: "Hot News 3", summary: "세 번째 핫 뉴스 요약입니다.", image: "/economy.png" },
        { title: "Hot News 4", summary: "네 번째 핫 뉴스 요약입니다.", image: "/economy.png" },
        { title: "Hot News 5", summary: "다섯 번째 핫 뉴스 요약입니다.", image: "/economy.png" },
        { title: "Hot News 6", summary: "여섯 번째 핫 뉴스 요약입니다.", image: "/economy.png" }
    ];

    // 일반 뉴스 데이터
    const basicNews = [
        { title: "Basic News 1", summary: "이것은 일반 뉴스 요약입니다.", image: "/food.png" },
        { title: "Basic News 2", summary: "이것은 두 번째 일반 뉴스 요약입니다.", image: "/food.png" },
        { title: "Basic News 3", summary: "세 번째 일반 뉴스 요약입니다.", image: "/food.png" },
        { title: "Basic News 4", summary: "네 번째 일반 뉴스 요약입니다.", image: "/food.png" },
        { title: "Basic News 5", summary: "다섯 번째 일반 뉴스 요약입니다.", image: "/food.png" },
        { title: "Basic News 6", summary: "여섯 번째 일반 뉴스 요약입니다.", image: "/food.png" },
        { title: "Basic News 7", summary: "일곱 번째 일반 뉴스 요약입니다.", image: "/food.png" },
        { title: "Basic News 8", summary: "여덟 번째 일반 뉴스 요약입니다.", image: "/food.png" }
    ];

    return(
        <div className={styled['MainNews--container']}>
            <div className={styled['MainNews--hotIssues--titleContainer']}>
                <h1 className={styled['MainNews--hotIssues--title']}>Hot News</h1>
            </div>
            <div className={styled['MainNews--hotIssues']}>
                {hotNews.map((news, index) => (
                    <HotNewsCard key={index} title={news.title} summary={news.summary} image={news.image} />
                ))}
            </div>
            <div className={styled['MainNews--Issues']}>
                {basicNews.map((news, index) => (
                    <BasicNewsCard key={index} title={news.title} summary={news.summary} image={news.image} />
                ))}
            </div>

        </div>
    )
}

