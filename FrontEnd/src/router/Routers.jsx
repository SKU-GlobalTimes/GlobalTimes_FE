import { Routes as ReactRouters, Route } from 'react-router-dom';

// pages
import LandingPage from '../components/landingPage/LandingPage';


// layouts
import MainLayout from '../layouts/MainLayout';


export default function Routes() {
    return(
        <ReactRouters>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<LandingPage />} />
            
            </Route>
        </ReactRouters>
    )
}


