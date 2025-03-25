import styled from './MainPage.module.css';
import SearchContainer from './SearchContainer';
import MainNews from './MainNews';
import SearchNews from './SearchNews';

export default function MainPage() {

    return(
        <div className={styled['mainPage--container']}>
            <SearchContainer />
            <MainNews />
        </div>
    )
}

