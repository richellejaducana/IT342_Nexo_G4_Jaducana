import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/HomePage.css";
import HomeHeader from "./header/HomeHeader.jsx";

function HomePage() {
  const navigate = useNavigate();
  return (
    <div className="main-container">
      <HomeHeader />

      <div className="airplane-hero" id="home">
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

      <div id="about" className="section about-section">
        <h2 className="section-title">About Nexo</h2>
        <div className="about-content">
          <p>Nexo is a modern event management platform designed to simplify the process of creating, organizing, and managing events. It provides a seamless experience for both event organizers and participants by combining intuitive design with powerful functionality.</p>
          <p>Whether it's a one-time event or a recurring activity, Nexo allows users to efficiently handle registrations, track attendees, and ensure smooth event execution. The platform is built to reduce manual work and improve overall event coordination through automation and user-friendly tools.</p>
        </div>
      </div>

      <div id="features" className="section features-section">
        <h2 className="section-title">Features</h2>
        <p className="section-subtitle">Nexo offers a range of features to support both organizers and users:</p>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Event Creation</h3>
            <p>Easily create single or recurring events with customizable details such as date, time, and location.</p>
          </div>
          <div className="feature-card">
            <h3>User Registration System</h3>
            <p>Participants can quickly register for events with a simple and secure process.</p>
          </div>
          <div className="feature-card">
            <h3>Event Management Dashboard</h3>
            <p>Organizers can monitor event details, manage participants, and update event information in real time.</p>
          </div>
          <div className="feature-card">
            <h3>Secure Authentication</h3>
            <p>Ensures that only authorized users can access protected pages and features.</p>
          </div>
          <div className="feature-card">
            <h3>Payment Integration</h3>
            <p>Supports both free and paid events with a smooth payment flow.</p>
          </div>
          <div className="feature-card">
            <h3>Responsive Design</h3>
            <p>Accessible across different devices including desktops, tablets, and mobile phones.</p>
          </div>
          <div className="feature-card">
            <h3>User Access Control</h3>
            <p>Prevents unauthorized users from accessing restricted pages such as dashboards.</p>
          </div>
        </div>
      </div>

      <div id="contact" className="section contact-section">
        <h2 className="section-title">Contact Us</h2>
        <div className="contact-content">
          <p>We'd love to hear from you! If you have questions, feedback, or need assistance, feel free to reach out:</p>
          <div className="contact-info">
            <p><strong>Email:</strong> support@nexo.com</p>
            <p><strong>Phone:</strong> +63 912 345 6789</p>
            <p><strong>Location:</strong> Cebu City, Philippines</p>
            <p>You can also follow us on our social media platforms for updates and announcements.</p>
          </div>
        </div>
      </div>
      
    </div>
  );
}

export default HomePage;