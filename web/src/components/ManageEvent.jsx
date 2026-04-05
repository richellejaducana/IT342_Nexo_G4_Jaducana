import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/UserDashboard.css"; // reuse your existing styles
import { supabase } from "../utils/supabaseClient";
const ManageEvent = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/api/events")
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(err => console.error(err));
  }, []);

  const handleDelete = async (event) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this event?");
  if (!confirmDelete) return;

  try {
    // 1. DELETE IMAGE FROM SUPABASE
    if (event.imageUrl) {
      const fileName = event.imageUrl.split("/").pop();

      const { error } = await supabase.storage
        .from("event-images")
        .remove([fileName]);

      if (error) {
        console.warn("Image delete failed:", error.message);
      }
    }

    // 2. DELETE FROM BACKEND
    const res = await fetch(`http://localhost:8080/api/events/${event.id}`, {
      method: "DELETE"
    });

    if (!res.ok) throw new Error("Delete failed");

    // 3. UPDATE UI
    setEvents((prev) => prev.filter((e) => e.id !== event.id));

  } catch (err) {
    console.error(err);
    alert("Failed to delete event");
  }
};

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="events-section">

      <div className="section-header">
        <h2>Manage Events</h2>
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

              <button
                className="view-btn"
                onClick={() => navigate(`/edit-event/${event.id}`)}
              >
                Edit Event
              </button>

              <button
    className="view-btn"
    style={{ background: "#ff4d4f" }}
    onClick={() => handleDelete(event)}
  >
    Delete
  </button>

            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageEvent;