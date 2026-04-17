import PropTypes from 'prop-types';
import { useState } from 'react';
import styled from "./NewsCard.module.css";
import { useNavigate } from "react-router-dom";
import TranslatedText from '../../api/TranslatedText';
import { useAuth } from '../../util/AuthContext';
import { useTranslatedLabel } from '../../hooks/useTranslatedLabel.js';
import { toggleScrap as toggleScrapAPI } from '../../api/scrapAPI';
import { FaBookmark, FaTimes } from 'react-icons/fa';

export default function ScrapNewsCard({ id, press, title, summary, image, year, month, day, isScrapped, setIsScrapped }) {
    const articleId = id;
    const { token } = useAuth();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const removeBtnTitle = useTranslatedLabel("스크랩 취소");

    function handleClickNewsCard(){
        navigate(`/detail/${id}`);
    }

    function handleRemoveClick(e) {
        e.stopPropagation();
        setShowModal(true);
    }

    async function handleConfirmRemove(e) {
        e.stopPropagation();
        setShowModal(false);
        if (token) {
            await toggleScrapAPI(articleId);
        } else {
            const storedScrapIds = JSON.parse(localStorage.getItem('scrapIds')) || [];
            const updatedScrapIds = storedScrapIds.filter((sid) => Number(sid) !== Number(articleId));
            localStorage.setItem('scrapIds', JSON.stringify(updatedScrapIds));
        }
        setIsScrapped(false);
    }

    function handleCancelModal(e) {
        e.stopPropagation();
        setShowModal(false);
    }

    return(
        <>
            {/* 스크랩 취소 확인 모달 */}
            {showModal && (
                <div className={styled['scrapModal--overlay']} onClick={handleCancelModal}>
                    <div className={styled['scrapModal']} onClick={(e) => e.stopPropagation()}>
                        <div className={styled['scrapModal--icon']}>
                            <FaBookmark className={styled['scrapModal--bookmark']} />
                        </div>
                        <p className={styled['scrapModal--message']}>
                            <span className={styled['scrapModal--press']}>{press}</span>
                            <br />
                            <span className={styled['scrapModal--title']}>
                                「<TranslatedText text={title} />」
                            </span>
                            <br />
                            <TranslatedText text="스크랩을 취소하시겠습니까?" />
                        </p>
                        <div className={styled['scrapModal--buttons']}>
                            <button className={styled['scrapModal--cancel']} onClick={handleCancelModal}>
                                <TranslatedText text="아니오" />
                            </button>
                            <button className={styled['scrapModal--confirm']} onClick={handleConfirmRemove}>
                                <TranslatedText text="취소하기" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className={styled['ScrapNewsCard--container']} onClick={handleClickNewsCard}>
                <div
                    className={styled['ScrapNewsCard--image']}
                    style={image ? { backgroundImage: `url(${image})` } : {}}
                />
                <div className={styled['ScrapNewsCard--contents']}>
                    <div className={styled['ScrapNewsCard--contents__letterContainer']}>
                        <p className={styled['ScrapNewsCard--contents__press']}>{press}</p>
                        <p className={styled['ScrapNewsCard--contents__title']}>
                            <TranslatedText text={title}/>
                        </p>
                        <p className={styled['ScrapNewsCard--contents__preview']}>
                            <TranslatedText text={summary}/>
                        </p>
                    </div>
                    <div className={styled['ScrapNewsCard--contents__dateContainer']}>
                        <p className={styled['ScrapNewsCard--contents__date']}>{year}.{month}.{day}</p>
                    </div>
                </div>

                {/* 삭제 버튼 (× 원형) */}
                <button
                    className={styled['ScrapNewsCard--removeBtn']}
                    onClick={handleRemoveClick}
                    title={removeBtnTitle}
                >
                    <FaTimes />
                </button>
            </div>
        </>
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
    isScrapped: PropTypes.bool,
    setIsScrapped: PropTypes.func.isRequired,
};

