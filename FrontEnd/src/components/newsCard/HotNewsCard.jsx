import styled from './NewsCard.module.css';
import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";
import TranslatedText from '../../api/TranslatedText';

export default function HotNewsCard({ id, press, title, summary, image, year, month, day }) {
    const navigate = useNavigate();
    
    function handleClickNewsCard(){
        navigate(`/detail/${id}`);
    }

    return(
        <div className={styled['hotNewsCard--container']} onClick={handleClickNewsCard}>
            <div 
                className={styled['hotNewsCard--image']}
                style={{ backgroundImage: `url(${image})` }} 
            ></div>
            <div className={styled['hotNewsCard--contents']}>
                <div className={styled['hotNewsCard--contents__letterContainer']}>
                    <p className={styled['hotNewsCard--contents__press']}>{press}</p>
                    <p className={styled['hotNewsCard--contents__title']}>
                        <TranslatedText text={title} />
                    </p>
                    <p className={styled['hotNewsCard--contents__preview']}>
                        <TranslatedText text={summary} />
                    </p>
                </div>
                
                <div className={styled['hotNewsCard--contents__dateContainer']}>
                    <p className={styled['hotNewsCard--contents__date']}>{year}.{month}.{day}</p>
                </div>
            </div>
            
        </div>
    )
}


HotNewsCard.propTypes = {
    id: PropTypes.number.isRequired,
    press: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    summary: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    year: PropTypes.string.isRequired,
    month: PropTypes.string.isRequired,
    day: PropTypes.string.isRequired
};

