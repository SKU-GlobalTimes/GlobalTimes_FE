import styled from './ScrapPage.module.css';
import { useState,useEffect } from 'react';
import ScrapNewsCard from '../components/newsCard/ScrapNewsCard';
import Pagenation from '../components/mainPage/Pagenation';
import BlankNews from '../components/mainPage/BlankNews';
import { getScrap } from '../api/getNewsCardAPI';

export default function ScrapPage() {
    const [scrapNews, setScrapNews] = useState([]);
    const [scrapPage, setScrapPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const newsPerPage = 12;

    useEffect(() => {
        async function fetchScrapNews() {
            
            const storedScrapIds = JSON.parse(localStorage.getItem("ids") || "[]");
    
            // 전체 페이지 수 계산
            const newTotalPages = Math.ceil(storedScrapIds.length / newsPerPage);
    
            // 현재 페이지가 전체 페이지보다 크면 1로 리셋
            if (scrapPage > newTotalPages) {
                setScrapPage(1);
            }
    
            setTotalPages(newTotalPages);
    
            // 현재 페이지에 해당하는 ID들 가져오기
            const startIdx = (scrapPage - 1) * newsPerPage;
            const currentPageIds = storedScrapIds.slice(startIdx, startIdx + newsPerPage);
    
            if (currentPageIds.length > 0) {
                const data = await getScrap(currentPageIds);
                setScrapNews(data);
            } else {
                setScrapNews([]);
            }
        }
    
        fetchScrapNews();
    }, [scrapPage]);


    return(
        <div className={styled['ScrapNews--container']}>
            <div className={styled['ScrapNews--Newscontainer']}>
                <div className={styled['ScrapNews--titleContainer']}>
                    <h1 className={styled['ScrapNews--title']}>My Scrap</h1>
                </div>

                <div className={styled['ScrapNews--News']}>
                    {scrapNews.length > 0 ? (
                        scrapNews.map((news) => (
                            <ScrapNewsCard
                                key={news.id}
                                id={news.id}
                                press={news.sourceName}
                                title={news.title}
                                summary={news.description}
                                image={news.urlToImage}
                                year={news.year}
                                month={news.month}
                                day={news.day}
                            />
                        ))
                    ) : (
                        <BlankNews message="스크랩한 뉴스가 없습니다" /> // 👈 추가!
                    )}
                </div>
                
                <div className={styled['ScrapNews--pages']}>
                        <Pagenation
                            currentPage={scrapPage}
                            totalPages={totalPages}
                            onPageChange={setScrapPage}
                        />
                </div>
            </div>
        </div>
    )
}



