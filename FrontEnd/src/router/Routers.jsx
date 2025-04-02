import { Routes as ReactRouters, Route } from 'react-router-dom';

// pages
import LandingPage from '../pages/LandingPage';
import MainPage from '../components/mainPage/MainPage';
import DetailsPage from '../pages/DetailsPage';

// layouts
import MainLayout from '../layouts/MainLayout';


export default function Routes() {
    return(
        <ReactRouters>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<LandingPage />} />
                <Route path='main' element={<MainPage />} />
                <Route path='detail' element={<DetailsPage />} />
            </Route>
        </ReactRouters>
    )
}


