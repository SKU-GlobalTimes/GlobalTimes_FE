import styled from './NewsCard.module.css';
import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";

export default function BasicNewsCard({id, press, title, summary, image, year, month, day }) {
    const navigate = useNavigate();
    
    function handleClickNewsCard(){
        console.log(id + '클릭됨.');
        navigate('/detail');
    }

    return(
        <div className={styled['basicNewsCard--container']} onClick={handleClickNewsCard}>
            <div className={styled['basicNewsCard--contents']}>
                <div className={styled['basicNewsCard--contents__letterContainer']}>
                    <p className={styled['basicNewsCard--contents__press']}>{press}</p>
                    <p className={styled['basicNewsCard--contents__title']}>{title}</p>
                    <p className={styled['basicNewsCard--contents__preview']}>
                        {summary}
                    </p>
                </div>
                
                <div className={styled['basicNewsCard--contents__dateContainer']}>
                    <p className={styled['basicNewsCard--contents__date']}>{year}.{month}.{day}</p>
                </div>
            </div>
            <div className={styled['basicNewsCard--imageContainer']}>
                <div className={styled['basicNewsCard--imageBorder']}>
                    <div 
                        className={styled['basicNewsCard--image']}
                        style={{ backgroundImage: `url(${image})` }} 
                    ></div>
                </div>
                
            </div>
        </div>
    )
}

BasicNewsCard.propTypes = {
    id: PropTypes.number.isRequired,
    press: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    summary: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    year: PropTypes.string.isRequired,
    month: PropTypes.string.isRequired,
    day: PropTypes.string.isRequired
};
