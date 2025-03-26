import styled from './NewsCard.module.css';
import PropTypes from 'prop-types';

export default function HotNewsCard({ title, summary, image }) {

    return(
        <div className={styled['hotNewsCard--container']}>
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

