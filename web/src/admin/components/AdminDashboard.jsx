import React, { useEffect, useState } from "react";
import "../css/AdminDashboard.css";
import AdminHeader from "./AdminHeader.jsx";

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [showEventsList, setShowEventsList] = useState(false);
  const [eventRegistrations, setEventRegistrations] = useState({});
  const user = JSON.parse(localStorage.getItem("user")) || {};

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/events");
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error("Failed to fetch events:", err);
      }
    };

    fetchEvents();
  }, []);

  const fetchRegistrationsForEvent = async (eventId) => {
    try {
      const res = await fetch(`http://localhost:8080/api/registrations/event/${eventId}`);
      const data = await res.json();
      return data.length;
    } catch (err) {
      console.error("Failed to fetch registrations:", err);
      return 0;
    }
  };

  const handleEventsClick = async () => {
    if (!showEventsList) {
      // Fetch registration counts for all events
      const registrationCounts = {};
      for (const event of events) {
        const count = await fetchRegistrationsForEvent(event.id);
        registrationCounts[event.id] = count;
      }
      setEventRegistrations(registrationCounts);
    }
    setShowEventsList(!showEventsList);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="admin-dashboard">
      <AdminHeader />

      <main className="main-content">
        <div className="main-header">
          <h1 className="welcome">Welcome back, {user.firstname || "Admin"}</h1>
          <p className="subtitle">Manage events, users, and admin settings from one place.</p>
        </div>

        <div className="cards-grid">
         

          <div className="stat-card events-created-card" onClick={handleEventsClick} style={{ cursor: "pointer" }}>
            <h3 className="stat-title">Events Created</h3>
            <p className="stat-number">{events.length}</p>
            <p className="stat-description">Click to view all events and registrations</p>
          </div>

          <div className="stat-card">
            <h3 className="stat-title">Payment Management</h3>
            <p>Review and approve payment submissions</p>
            <ul className="actions-list">
              <li><a href="/payment-management" style={{ color: '#5b4dff', textDecoration: 'none' }}>Manage Payments →</a></li>
            </ul>
          </div>
        </div>

        {showEventsList && (
          <div className="events-list-section">
            <div className="section-header">
              <h2>My Created Events</h2>
              <button className="close-btn" onClick={() => setShowEventsList(false)}>×</button>
            </div>
            <div className="events-grid">
              {events.map((event) => (
                <div key={event.id} className="event-card">
                  <div className="event-image">
                    <img
                      src={event.imageUrl || "https://via.placeholder.com/300"}
                      alt={event.eventName}
                    />
                    <span className="event-date">
                      {formatDate(event.date)}
                    </span>
                  </div>
                  <div className="event-details">
                    <h3>{event.eventName}</h3>
                    <p className="event-location">
                      {event.locationName}, {event.city}
                    </p>
                    <div className="registration-count">
                      <span className="registration-number">
                        {eventRegistrations[event.id] || 0} registered
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
