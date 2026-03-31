import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUpPage from './components/SignUpPage'
import LogIn from './components/LogIn'
import HomePage from './components/HomePage'
import UserDashboard from './components/UserDashboard'
import UserProfile from './components/UserProfile'
import AdminDashboard from './components/AdminDashboard'
import OAuthSuccess from './components/OAuthSuccess'
function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUpPage />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/userDashboard" element={<UserDashboard />} />
         <Route path="/userProfile" element={<UserProfile />} />
        <Route path="/adminDashboard" element={<AdminDashboard />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />
       </Routes>
       </Router>
  )
  
}

export default App
