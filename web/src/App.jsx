import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUpPage from './components/SignUpPage'
import LogIn from './components/LogIn'
import HomePage from './components/HomePage'
import UserDashboard from './components/UserDashboard'
function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUpPage />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/userDashboard" element={<UserDashboard />} />
       </Routes>
       </Router>
  )
  
}

export default App
