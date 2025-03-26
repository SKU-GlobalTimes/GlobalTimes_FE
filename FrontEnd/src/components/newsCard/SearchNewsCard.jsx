import styled from './NewsCard.module.css';
import PropTypes from 'prop-types';

export default function SearchNewsCard({ title, summary, image }) {

    return(
        <div className={styled['searchNewsCard--container']}>
            <div className={styled['searchNewsCard--contents']}>
                <p className={styled['searchNewsCard--contents__title']}>{title}</p>
                <p className={styled['searchNewsCard--contents__preview']}>
                    {summary}
                </p>
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
    title: PropTypes.string.isRequired,
    summary: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired
};

