import styled from './NewsCard.module.css';

export default function BasicNewsCard() {

    return(
        <div className={styled['basicNewsCard--container']}>
            <div className={styled['basicNewsCard--contents']}>
                <p className={styled['basicNewsCard--contents__title']}>기사 제목</p>
                <p className={styled['basicNewsCard--contents__preview']}>
                    짧은 내용
                </p>
            </div>
            <div className={styled['basicNewsCard--imageContainer']}>
                <div className={styled['basicNewsCard--image']}></div>
            </div>
        </div>
    )
}