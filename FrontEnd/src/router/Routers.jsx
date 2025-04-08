import { Routes as ReactRouters, Route } from 'react-router-dom';

// pages
import LandingPage from '../pages/LandingPage';
import MainPage from '../pages/MainPage';
import SearchPage from "../pages/SearchPage"
import DetailsPage from '../pages/DetailsPage';
import ScrapPage from '../pages/ScrapPage';
import IntroPage from "../pages/IntroPage";

// layouts
import MainLayout from '../layouts/MainLayout';


export default function Routes() {
    return(
        <ReactRouters>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<LandingPage />} />
                <Route path='main' element={<MainPage />} />
                <Route path="/search/:keyword" element={<SearchPage />} />
                <Route path="/detail/:id" element={<DetailsPage />} />
                <Route path='scrap' element={<ScrapPage />} />
                <Route path='intro' element={<IntroPage />} />
            </Route>
        </ReactRouters>
    )
}


