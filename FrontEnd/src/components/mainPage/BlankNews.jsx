import styled from './News.module.css';
import PropTypes from 'prop-types';

export default function BlankNews({ message }) {
    return(
        <div className={styled['BlankNews--Container']}>
            {message ? (
                <p className={styled["BlankNews--Message"]}>{message}</p>
            ) : null}
        </div>
    )
}

BlankNews.propTypes = {
    message: PropTypes.string.isRequired,
};

