import styled from './NewsCard.module.css';
import PropTypes from 'prop-types';


export default function BasicNewsCard({ title, summary, image }) {

    return(
        <div className={styled['basicNewsCard--container']}>
            <div className={styled['basicNewsCard--contents']}>
                <p className={styled['basicNewsCard--contents__title']}>{title}</p>
                <p className={styled['basicNewsCard--contents__preview']}>
                    {summary}
                </p>
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
    title: PropTypes.string.isRequired,
    summary: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired
};
