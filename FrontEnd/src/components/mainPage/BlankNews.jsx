import styled from './News.module.css';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

export default function BlankNews({ message }) {
    const navigate = useNavigate();

    return(
        <div className={styled['BlankNews--Container']}>
            {message && <p className={styled["BlankNews--Message"]}>{message}</p>}
            <button 
                className={styled["BlankNews--Button"]}
                onClick={() => navigate('/main')}
            >
                메인 페이지로 이동하기
            </button>
        </div>
    )
}

BlankNews.propTypes = {
    message: PropTypes.string.isRequired,
};

