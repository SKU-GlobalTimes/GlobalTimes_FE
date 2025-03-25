import styled from './News.module.css';


export default function MainNews(){
    return(
        <div className={styled['MainNews--container']}>
            <h1>Hot News</h1>
            <div className={styled['MainNews--hotIssues']}>
                <div className={styled['news--sample01']}></div>
                <div className={styled['news--sample01']}></div>
                <div className={styled['news--sample01']}></div>
                <div className={styled['news--sample01']}></div>
                <div className={styled['news--sample01']}></div>
                <div className={styled['news--sample01']}></div>
            </div>
            <div className={styled['MainNews--Issues']}>
                <div className={styled['news--sample02']}></div>
                <div className={styled['news--sample02']}></div>
                <div className={styled['news--sample02']}></div>
                <div className={styled['news--sample02']}></div>
                <div className={styled['news--sample02']}></div>
                <div className={styled['news--sample02']}></div>
                <div className={styled['news--sample02']}></div>
                <div className={styled['news--sample02']}></div>
            </div>

        </div>
    )
}

