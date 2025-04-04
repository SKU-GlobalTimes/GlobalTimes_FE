import styled from './News.module.css';
import HotNewsCard from '../newsCard/HotNewsCard';
import BasicNewsCard from '../newsCard/BasicNewsCard';
import Pagenation from './Pagenation';
import { useState, useEffect } from 'react';

import { getHot, getLatest } from '../../api/getNewsCardAPI';

export default function MainNews(){
    const [hotNews, setHotNews] = useState([]);
    const [basicNews, setBasicNews] = useState([]);
    const [hotPage, setHotPage] = useState(1);
    const [basicPage, setBasicPage] = useState(1);
    const hotTotalPages = 5;
    const basicTotalPages = 10;


    useEffect(() => {
        async function fetchHotNews() {
            const data = await getHot(hotPage - 1, 6);
            
            if (data && typeof data === "object") {
                setHotNews(Object.values(data));  
            } else {
                console.error("🚨 예상과 다른 데이터 구조:", data);
            }
        }
        fetchHotNews();
    }, [hotPage]);


    useEffect(() => {
        async function fetchBasicNews() {
            const data = await getLatest(basicPage - 1, 8);
            
            if (data && typeof data === "object") {
                setBasicNews(Object.values(data));  
            } else {
                console.error("🚨 예상과 다른 데이터 구조:", data);
            }
        }
        fetchBasicNews();
    }, [basicPage]);



    return(
        <div className={styled['MainNews--container']}>
            <div className={styled['MainNews--Newscontainer']}>
                <div className={styled['MainNews--titleContainer']}>
                    <h1 className={styled['MainNews--title']}>Hot News</h1>
                </div>

                <div className={styled['MainNews--News']}>
                    {hotNews.map((news) => (
                        <HotNewsCard key={news.id} id={news.id} press={news.sourceName}  title={news.title} summary={news.description} image={news.urlToImage} year={news.year} month={news.month} day={news.day} />
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
                    {basicNews.map((news) => (
                        <BasicNewsCard key={news.id} id={news.id} press={news.sourceName}  title={news.title} summary={news.description} image={news.urlToImage} year={news.year} month={news.month} day={news.day} />
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



