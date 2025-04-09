import styled from './NewsCard.module.css';
import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';

//번역 함수 (text변환)
import { fetchTranslatedText } from '../../api/fetchTranslatedText';
//전역 현재 사용자 언어
import { useLanguage } from '../../util/LanguageContext';

export default function SearchNewsCard({ id, press, title, summary, image, year, month, day, originalText, translatedText }) {
    const navigate = useNavigate();
    
    function handleClickNewsCard(){
        navigate(`/detail/${id}`);
    }

    // 전역 현재 사용자 언어
    const { language } = useLanguage();

    // 번역할 변수
    const [translatedTitle, setTranslatedTitle] = useState("");
    const [translatedContent, setTranslatedContent] = useState("");
    const [translatedKeyword, setTranslatedKeyword] = useState("");
    
    useEffect(() => {
        const getTranslation = async () => {
            // console.log("번역전 키워드: " + translatedText);
            const translatedText1 = await fetchTranslatedText(title, language);
            const translatedText2 = await fetchTranslatedText(summary, language);
            const translatedKeyword_ = await fetchTranslatedText(translatedText, language);
            
            // console.log("번역후 키워드: " + translatedKeyword_);
            // console.log("원래!! 키워드: " + originalText)
            setTranslatedTitle(translatedText1);
            setTranslatedContent(translatedText2);
            setTranslatedKeyword(translatedKeyword_);
        }
        getTranslation();
    }, [language, id])

    function highlightText(text, keyword, originalKeyword) {
        // console.log("keyword"+keyword);
        // console.log("keyword"+keyword);
        // console.log("ookeyword"+originalKeyword);

        const target = keyword || originalKeyword;
        if (!target) return text;
    
        const parts = text.split(new RegExp(`(${target})`, 'gi'));
    
        return parts.map((part, index) =>
            part.toLowerCase() === target.toLowerCase()
                ? <span className={styled.highlight} key={index}>{part}</span>
                : part
        );
    }
    

    return(
        <div className={styled['searchNewsCard--container']} onClick={handleClickNewsCard}>
            <div className={styled['searchNewsCard--contents']}>
                <div className={styled['searchNewsCard--contents__topContainer']}>
                    <p className={styled['searchNewsCard--contents__press']}>{press}</p>
                    <p className={styled['searchNewsCard--contents__title']}>
                        {highlightText(translatedTitle, translatedKeyword, originalText)}
                    </p>
                    <p className={styled['searchNewsCard--contents__preview']}>
                        {highlightText(translatedContent, translatedKeyword, originalText)}
                    </p>
                </div>
                <p className={styled['searchNewsCard--contents__date']}>{year}.{month}.{day}</p>
            </div>
            <div className={styled['searchNewsCard--imageContainer']}>
                <div 
                    className={styled['searchNewsCard--image']}
                    style={{ backgroundImage: `url(${image})` }} 
                ></div>
            </div>
        </div>
    )
}

SearchNewsCard.propTypes = {
    id: PropTypes.number.isRequired,
    press: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    summary: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    year: PropTypes.string.isRequired,
    month: PropTypes.string.isRequired,
    day: PropTypes.string.isRequired,
    translatedText: PropTypes.string.isRequired,
};


