import styled from './News.module.css';
import HotNewsCard from '../newsCard/HotNewsCard';
import BasicNewsCard from '../newsCard/BasicNewsCard';

export default function MainNews(){
    return(
        <div className={styled['MainNews--container']}>
            <h1 className={styled['MainNews--hotIssues--title']}>Hot News</h1>
            <div className={styled['MainNews--hotIssues']}>
                <HotNewsCard />
                <HotNewsCard />
                <HotNewsCard />
                <HotNewsCard />
                <HotNewsCard />
                <HotNewsCard />
            </div>
            <div className={styled['MainNews--Issues']}>
                <BasicNewsCard />
                <BasicNewsCard />
                <BasicNewsCard />
                <BasicNewsCard />
                <BasicNewsCard />
                <BasicNewsCard />
                <BasicNewsCard />
                <BasicNewsCard />
            </div>

        </div>
    )
}

