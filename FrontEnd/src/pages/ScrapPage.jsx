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
    const [isScrapped, setIsScrapped] = useState(true);
    const newsPerPage = 12;

    useEffect(() => {
        async function fetchScrapNews() {
            const storedScrapIds = JSON.parse(localStorage.getItem("scrapIds") || "[]");
            const newTotalPages = Math.ceil(storedScrapIds.length / newsPerPage);
            setTotalPages(newTotalPages);
    
            const startIdx = (scrapPage - 1) * newsPerPage;
            const currentPageIds = storedScrapIds.slice(startIdx, startIdx + newsPerPage);
    
            if (currentPageIds.length > 0) {
                const data = await getScrap(currentPageIds);

                const filteredData = data.filter(news => currentPageIds.includes(news.id));
                setScrapNews(filteredData);
            } else {
                setScrapNews([]);
            }

            setIsScrapped(true);
        }
    
        fetchScrapNews();
    }, [scrapPage, isScrapped]);


    return(
        <div className={styled['ScrapNews--container']}>
            <div className={styled['ScrapNews--Newscontainer']}>
                <div className={styled['ScrapNews--titleContainer']}>
                    <h1 className={styled['ScrapNews--title']}>My Scrap</h1>
                </div>

                <div className={styled['ScrapNews--News']}>
                    {scrapNews.length > 0 ? (
                        <div className={styled['ScrapNews--News__container']}>
                            <div className={styled['ScrapNews--News__items']}>
                            {scrapNews.map((news) => (
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
                                    isScrapped={isScrapped}
                                    setIsScrapped={setIsScrapped}
                                />
                            ))}
                            </div>
                            
                            <div className={styled['ScrapNews--pages']}>
                                <Pagenation
                                    currentPage={scrapPage}
                                    totalPages={totalPages}
                                    onPageChange={setScrapPage}
                                />
                            </div>
                        </div>
                    ) : (
                        <BlankNews message="스크랩한 뉴스가 없습니다" /> 
                    )}
                </div>
            </div>
        </div>
    )
}



