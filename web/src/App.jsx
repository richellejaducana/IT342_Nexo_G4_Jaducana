import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUpPage from './auth/components/SignUpPage'
import LogIn from './auth/components/LogIn'
import HomePage from './home/components/HomePage'
import UserDashboard from './user/components/UserDashboard'
import UserProfile from './user/components/UserProfile'
import AdminDashboard from './admin/components/AdminDashboard'
import AdminProfile from './admin/components/AdminProfile'
import CreateEvent from './events/components/CreateEvent'
import OAuthSuccess from './auth/components/OAuthSuccess'
import EventDetails from "./events/components/EventDetails";
import ManageEvent from "./events/components/ManageEvent";
import EditEvent from "./events/components/EditEvent";
import RegisterEvent from "./events/components/RegisterEvent";
import PaymentPage from "./payment/components/PaymentPage";
import Users from "./admin/components/Users";
import PaymentManagement from "./admin/components/PaymentManagement";
import UserPaymentStatus from "./user/components/UserPaymentStatus";
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
<Route path="/users" element={<Users />} />
<Route path="/payment-management" element={<PaymentManagement />} />
<Route path="/payment-status" element={<UserPaymentStatus />} />
       </Routes>
       </Router>
  )
  
}

export default App
