import styled from './NewsCard.module.css';
import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";

export default function HotNewsCard({ title, summary, image }) {
    const navigate = useNavigate();
    
    function handleClickNewsCard(){
        console.log('클릭됨.');
        navigate('/detail');
    }

    return(
        <div className={styled['hotNewsCard--container']} onClick={handleClickNewsCard}>
            <div className={styled['hotNewsCard--contents']}>
                <p className={styled['hotNewsCard--contents__title']}>{title}</p>
                <p className={styled['hotNewsCard--contents__preview']}>
                    {summary}
                </p>
            </div>
            <div 
                className={styled['hotNewsCard--image']}
                style={{ backgroundImage: `url(${image})` }} 
            ></div>
        </div>
    )
}


HotNewsCard.propTypes = {
    title: PropTypes.string.isRequired,
    summary: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired
};

