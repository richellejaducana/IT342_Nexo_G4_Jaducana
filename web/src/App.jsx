import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUpPage from './components/SignUpPage'
import LogIn from './components/LogIn'
import HomePage from './components/HomePage'
import UserDashboard from './components/UserDashboard'
import UserProfile from './components/UserProfile'
import AdminDashboard from './components/AdminDashboard'
import AdminProfile from './components/AdminProfile'
import CreateEvent from './components/CreateEvent'
import OAuthSuccess from './components/OAuthSuccess'
import EventDetails from "./components/EventDetails";
import ManageEvent from "./components/ManageEvent";
import EditEvent from "./components/EditEvent";
import RegisterEvent from "./components/RegisterEvent";
import PaymentPage from "./components/PaymentPage";
function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/userDashboard" element={<UserDashboard />} />
         <Route path="/userProfile" element={<UserProfile />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />}/>
        
        
        <Route path="/admin-profile" element={<AdminProfile />}/>
          
        <Route path="/register-event/:id" element={<RegisterEvent />} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />
        <Route path="/event/:id" element={<EventDetails />} />
        <Route path="/manage-events" element={<ManageEvent />} />
<Route path="/edit-event/:id" element={<EditEvent />} />
<Route path="/payment" element={<PaymentPage />} />
       </Routes>
       </Router>
  )
  
}

export default App
