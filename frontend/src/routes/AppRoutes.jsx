import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import authentication pages
import UserLogin from '../pages/auth/UserLogin';
import UserRegister from '../pages/auth/UserRegister';
import FoodPartnerLogin from '../pages/auth/FoodPartnerLogin';
import FoodPartnerRegister from '../pages/auth/FoodPartnerRegister';
import Home from '../pages/general/Home';
import CreateFood from '../pages/food-partner/CreateFood';
import Profile from '../pages/food-partner/Profile';
import Saved from '../pages/general/Saved';

// Import your other page components here
// import Home from '../pages/Home';
// import Video from '../pages/Video';
// import Profile from '../pages/Profile';

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                {/* User Routes */}
                <Route path='/login' element={<UserLogin />} />
                <Route path='/register' element={<UserRegister />} />
                
                {/* Food Partner Routes */}
                <Route path='/foodpartner-login' element={<FoodPartnerLogin />} />
                <Route path='/foodpartner-register' element={<FoodPartnerRegister />} />
                
                {/* Alternative paths for compatibility */}
                <Route path='/user/login' element={<UserLogin />} />
                <Route path='/user/register' element={<UserRegister />} />
                <Route path='/food-partner/login' element={<FoodPartnerLogin />} />
                <Route path='/food-partner/register' element={<FoodPartnerRegister />} />
                <Route path="/" element={<Home/>} />
                <Route path="/create-food" element={<CreateFood/>}/>
                <Route path="/saved" element={<Saved/>} />
                <Route path="/food-partner/:id" element={<Profile />} />
                {/* Add more routes as needed */}
            </Routes>
        </Router>
    );
};

export default AppRoutes;