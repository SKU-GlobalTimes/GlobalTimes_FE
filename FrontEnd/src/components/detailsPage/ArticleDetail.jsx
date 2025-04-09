import styles from "./ArticleDetail.module.css";
import { FaBookmark } from "react-icons/fa";
import { useState, useEffect } from "react";
import { MutatingDots } from "react-loader-spinner";

//컴포넌트 변경
import TranslatedText from "../../api/TranslatedText.jsx";

export default function ArticleDetail({ id, newsDetail, content, isLoading }) {
  const articleId = Number(id);
  const { title, author, sourceName, publishedAt, viewCount, urlToImage } =
    newsDetail;

    const [isScrapped, setIsScrapped] = useState(false);

    useEffect(() => {
      const storedScrapIds = JSON.parse(localStorage.getItem("scrapIds")) || [];
      setIsScrapped(storedScrapIds.includes(articleId));
    }, [articleId]);

  function clickScrapBTN() {
    const storedScrapIds = JSON.parse(localStorage.getItem('scrapIds')) || [];

    if (!storedScrapIds.includes(articleId)) {
        storedScrapIds.push(articleId);
        localStorage.setItem('scrapIds', JSON.stringify(storedScrapIds)); // 키 수정
        setIsScrapped(true);
    }
    else{
        // articleId가 배열에 있는 경우 제거
        const updatedScrapIds = storedScrapIds.filter(id => id !== articleId);
        localStorage.setItem('scrapIds', JSON.stringify(updatedScrapIds));
        setIsScrapped(false);
    }
  }

  return (
    <div className={styles.articleDetail}>
      <h1><TranslatedText text={title}/></h1>
      <div className={styles.infoContainer}>
        <p className={styles.timeText}>
          <TranslatedText text={new Date(publishedAt).toLocaleString()}/>
        </p>
        <div className={styles.stats}>
          <span><TranslatedText text="조회수"/>{viewCount}</span>
          <button 
            className={styles.scrap}
            onClick={clickScrapBTN}
            >
            <TranslatedText text="스크랩"/>
            <FaBookmark 
                className={`${styles.icon} ${isScrapped ? styles.active : ""}`} 
              />
          </button>
        </div>
      </div>
      <p className={styles.meta}>
        {sourceName} - {author}
      </p>
      <img src={urlToImage} alt="기사 이미지" className={styles.image} />
      {/* 기사 요약내용 */}
      {isLoading ? (
         <MutatingDots 
           height={100} 
           width={100} 
           color="#4fa94d" 
           secondaryColor="#ccc"
           radius={12.5}
           ariaLabel="mutating-dots-loading"
           visible={true}
         />
         ) : (
           <p className={styles.content}><TranslatedText text={content}/></p>
         )
       }
    </div>
  );
}
