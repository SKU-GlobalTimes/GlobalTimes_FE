import styled from './NewsCard.module.css';
import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";

export default function SearchNewsCard({ id, press, title, summary, image, year, month, day, translatedText }) {
    const navigate = useNavigate();
    
    function handleClickNewsCard(){
        navigate(`/detail/${id}`);
    }

    function highlightText(text, keyword) {
        if (!keyword) return text;
        const parts = text.split(new RegExp(`(${keyword})`, 'gi'));
        return parts.map((part, index) =>
            part.toLowerCase() === keyword.toLowerCase()
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
                        {highlightText(title, translatedText)}
                    </p>
                    <p className={styled['searchNewsCard--contents__preview']}>
                        {highlightText(summary, translatedText)}
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


