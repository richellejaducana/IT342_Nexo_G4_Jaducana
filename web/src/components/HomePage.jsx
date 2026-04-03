import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/HomePage.css";
import HomeHeader from "./header/HomeHeader.jsx";

function HomePage() {
  const navigate = useNavigate();
  return (
    <div className="main-container">
      <HomeHeader />

      <div className="airplane-hero">
  <img
    src="https://i.pinimg.com/1200x/33/af/c2/33afc28f3f95140295a67622f9020d40.jpg"
    alt="Nexo Airplane"
    className="airplane-img"
  />

  <div className="hero-text-overlay">
    <h1>
      Discover events.<br />
      Connect with experiences.<br />
      Join with Nexo.
    </h1>
    <p>Find what excites you and be part of experiences that matter.</p>
    <button className="get-started-btn" onClick={() => navigate('/signup')}>Get Started</button>
  </div>

  {/* STACKED IMAGES */}
 <div className="image-stack">
 
  <img src="https://i.pinimg.com/1200x/0d/9b/1d/0d9b1d1e94852acbe29c3a9094e17c39.jpg" alt="event" className="stack-img img2" />
  <img src="https://i.pinimg.com/1200x/0d/9b/1d/0d9b1d1e94852acbe29c3a9094e17c39.jpg" alt="event" className="stack-img img3" />
  <img src="https://i.pinimg.com/1200x/0d/9b/1d/0d9b1d1e94852acbe29c3a9094e17c39.jpg" alt="event" className="stack-img img4" />
  
</div>
</div>
      
    </div>
  );
}

export default HomePage;