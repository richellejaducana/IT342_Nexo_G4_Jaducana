import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUpPage from './components/SignUpPage'
import LogIn from './components/LogIn'
function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUpPage />} />
        <Route path="/login" element={<LogIn />} />
       </Routes>
       </Router>
  )
  
}

export default App
