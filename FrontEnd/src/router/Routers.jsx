import { Routes as ReactRouters, Route } from 'react-router-dom';

// pages
import LandingPage from '../pages/LandingPage';
import MainPage from '../pages/MainPage';
import DetailsPage from '../pages/DetailsPage';
import ScrapPage from '../pages/ScrapPage';

// layouts
import MainLayout from '../layouts/MainLayout';


export default function Routes() {
    return(
        <ReactRouters>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<LandingPage />} />
                <Route path='main' element={<MainPage />} />
                <Route path='detail' element={<DetailsPage />} />
                <Route path='scrap' element={<ScrapPage />} />
            </Route>
        </ReactRouters>
    )
}


