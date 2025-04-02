import styled from './NewsCard.module.css';
import PropTypes from 'prop-types';

export default function SearchNewsCard({ press, title, summary, image, year, month, day }) {

    return(
        <div className={styled['searchNewsCard--container']}>
            <div className={styled['searchNewsCard--contents']}>
                <div className={styled['searchNewsCard--contents__topContainer']}>
                    <p className={styled['searchNewsCard--contents__press']}>{press}</p>
                    <p className={styled['searchNewsCard--contents__title']}>{title}</p>
                    <p className={styled['searchNewsCard--contents__preview']}>
                        {summary}
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
    press: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    summary: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    year: PropTypes.string.isRequired,
    month: PropTypes.string.isRequired,
    day: PropTypes.string.isRequired
};


