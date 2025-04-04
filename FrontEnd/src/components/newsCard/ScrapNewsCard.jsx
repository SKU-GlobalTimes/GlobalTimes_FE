import PropTypes from 'prop-types';
import styled from "./NewsCard.module.css";
import { useNavigate } from "react-router-dom";

import StarFilled from "../../assets/icons/star_filled.svg";
import StarBlank from "../../assets/icons/star_blank.svg";

export default function ScrapNewsCard({ id, press, title, summary, image, year, month, day, isScrapped, setIsScrapped }) {
    const articleId = id;
    
    const navigate = useNavigate();

    function handleClickNewsCard(){
        navigate(`/detail/${id}`);
    }


    const toggleScrap = (e) => {
        e.stopPropagation();  // 부모 div 클릭 이벤트 방지
        setIsScrapped(!isScrapped);

        const storedScrapIds = JSON.parse(localStorage.getItem('scrapIds')) || [];

        // articleId가 배열에 있는 경우 제거
        const updatedScrapIds = storedScrapIds.filter(id => id !== articleId);

        localStorage.setItem('scrapIds', JSON.stringify(updatedScrapIds));
        console.log("Updated scrapIds =", localStorage.getItem("scrapIds"));

    };

    return(
        <div className={styled['ScrapNewsCard--container']} onClick={handleClickNewsCard}>
            <div 
                className={styled['ScrapNewsCard--image']}
                style={{ backgroundImage: `url(${image})` }} 
            ></div>
            <div className={styled['ScrapNewsCard--contents']}>
                <div className={styled['ScrapNewsCard--contents__letterContainer']}>
                    <p className={styled['ScrapNewsCard--contents__press']}>{press}</p>
                    <p className={styled['ScrapNewsCard--contents__title']}>{title}</p>
                    <p className={styled['ScrapNewsCard--contents__preview']}>
                        {summary}
                    </p>
                </div>
                
                <div className={styled['ScrapNewsCard--contents__dateContainer']}>
                    <p className={styled['ScrapNewsCard--contents__date']}>{year}.{month}.{day}</p>
                    <p className={styled['ScrapNewsCard--contents__date']}> ({id}) </p>
                </div>
            </div>
            
            <img 
                src={isScrapped ? StarFilled : StarBlank} 
                alt="스크랩 버튼"
                className={styled['ScrapNewsCard--star']}
                onClick={toggleScrap}
            />
        </div>
    )




}





ScrapNewsCard.propTypes = {
    id: PropTypes.number.isRequired,
    press: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    summary: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    year: PropTypes.string.isRequired,
    month: PropTypes.string.isRequired,
    day: PropTypes.string.isRequired,
    isScrapped: PropTypes.bool.isRequired,
    setIsScrapped: PropTypes.func.isRequired,
};

