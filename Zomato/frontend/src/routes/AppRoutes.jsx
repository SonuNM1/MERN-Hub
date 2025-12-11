import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import NotFound from '../pages/NotFound'
import FoodPartnerRegister from '../pages/auth/FoodPartnerRegister'
import FoodPartnerLogin from '../pages/auth/FoodPartnerLogin'
import UserLogin from '../pages/auth/UserLogin'
import UserRegister from '../pages/auth/UserRegister'
import Home from '../pages/general/Home'

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/user/register' element={<UserRegister/>} />
        <Route path='/user/login' element={<UserLogin/>} />
        <Route path='/food-partner/register' element={<FoodPartnerRegister/>} />
        <Route path='/food-partner/login' element={<FoodPartnerLogin/>} />

        {/* Catch-all route for wrong/unknown URL */}
    
        <Route
            path='*'
            element={<NotFound/>}
        />
      </Routes>
    </Router>
  )
}

export default AppRoutes
