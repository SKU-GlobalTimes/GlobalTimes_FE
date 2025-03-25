import styled from './NewsCard.module.css';

export default function SearchNewsCard() {

    return(
        <div className={styled['searchNewsCard--container']}>
            <div className={styled['searchNewsCard--contents']}>
                <p className={styled['searchNewsCard--contents__title']}>기사 제목</p>
                <p className={styled['searchNewsCard--contents__preview']}>
                    짧은 내용
                </p>
            </div>
            <div className={styled['searchNewsCard--imageContainer']}>
                <div className={styled['searchNewsCard--image']}></div>
            </div>
        </div>
    )
}