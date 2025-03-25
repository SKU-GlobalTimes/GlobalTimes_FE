import styled from './NewsCard.module.css';

export default function HotNewsCard() {

    return(
        <div className={styled['hotNewsCard--container']}>
            <div className={styled['hotNewsCard--contents']}>
                <p className={styled['hotNewsCard--contents__title']}>기사 제목</p>
                <p className={styled['hotNewsCard--contents__preview']}>
                    짧은 내용
                </p>
            </div>
            <div className={styled['hotNewsCard--image']}></div>
        </div>
    )
}



