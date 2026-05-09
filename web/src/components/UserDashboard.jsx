import React, { useState, useEffect } from "react";
import "../css/UserDashboard.css";
import DashboardHeader from "./header/DashboardHeader.jsx";
import { useNavigate } from "react-router-dom";
const heroImages = [
  "https://i.pinimg.com/1200x/7b/b7/47/7bb7471424350e75d03e6122f5033a5c.jpg",
  "https://i.pinimg.com/1200x/35/bf/b6/35bfb6e07653f0c688b2b9528489f520.jpg",
  "https://i.pinimg.com/1200x/18/be/1f/18be1f7af1db345172b4096613fef6a2.jpg"
];

const Dashboard = () => {

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const navigate = useNavigate();
 const formatEventDate = (event) => {
  // ✅ SINGLE EVENT
  if (event.eventType === "single" && event.date) {
    const cleanDate = event.date.split("T")[0];
    const date = new Date(cleanDate + "T00:00:00");

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
    }).toUpperCase();
  }

  // ✅ RECURRING EVENT → use startDate
  if (event.eventType === "recurring" && event.startDate) {
    const cleanDate = event.startDate.split("T")[0];
    const date = new Date(cleanDate + "T00:00:00");

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
    }).toUpperCase();
  }

  return "N/A";
};

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        console.log("Fetching events from http://localhost:8080/api/events");
        const res = await fetch("http://localhost:8080/api/events");
        console.log("Response status:", res.status);
        const data = await res.json();
        console.log("Events fetched:", data);
        setEvents(data);
      } catch (err) {
        console.error("Failed to fetch events:", err);
      } finally {
        setLoading(false);
      }
    };

  fetchEvents();
}, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard">
        <DashboardHeader />
      
      {/* HERO SEARCH SECTION */}
      <section
        className="hero"
        style={{ backgroundImage: `url(${heroImages[currentImage]})` }}
      >
        <h1>Discover Events in Cebu</h1>
        <p>Find workshops, music festivals, tech events and more.</p>

        <div className="hero-search">
          <input placeholder="Search events..." />
        </div>
      </section>


      {/* CATEGORY FILTER */}
      <section className="categories">
        <button>All</button>
        <button>Business</button>
        <button>Technology</button>
        <button>Music</button>
        <button>Workshop</button>
        <button>Sports</button>
        <button>Art</button>
      </section>


      {/* USER REGISTRATIONS STATUS */}
      <section className="user-status-section">
        <div className="status-card">
          <div className="status-content">
            <h2>My Registrations</h2>
            <p>Check the status of your event registrations and payments</p>
            <button
              className="status-btn"
              onClick={() => navigate('/payment-status')}
            >
              View Payment Status
            </button>
          </div>
          <div className="status-icon">📋</div>
        </div>
      </section>

      {/* EVENTS */}
      <section className="events-section">

        <div className="section-header">
          <h2>Upcoming Events</h2>
          <span>View All</span>
        </div>

        {loading ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <p>Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <p>No events found. Check the console for more details.</p>
          </div>
        ) : (
          <div className="events-grid">

            {events.map((event) => (
              <div key={event.id} className="event-card">

                <div className="event-image">
                 <img
    src={event.imageUrl || "https://via.placeholder.com/300"}
    alt={event.eventName}
  />
                 <span className="event-date">
   {formatEventDate(event)}
  </span>
                </div>

                <div className="event-details">

                  <span className="event-category">{event.category}</span>

                  <h3>{event.eventName}</h3>

  <p className="event-location">
    {event.locationName}, {event.city}
  </p>

                 <button
    className="view-btn"
    onClick={() => navigate(`/event/${event.id}`)}
  >
    View Event
  </button>

                </div>

              </div>
            ))}

          </div>
        )}

      </section>

    </div>
  );
};

export default Dashboard;