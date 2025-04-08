import styled from './MainPage.module.css';
import SearchContainer from '../components/mainPage/SearchContainer';
import MainNews from '../components/mainPage/MainNews';

export default function MainPage() {

    return(
        <div className={styled['mainPage--container']}>
            <SearchContainer />
            <MainNews />             
        </div>
    )
}

