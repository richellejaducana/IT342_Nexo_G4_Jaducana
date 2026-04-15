import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../css/EventDetails.css";
import DashboardHeader from "./header/DashboardHeader.jsx";
import { supabase } from "../utils/supabaseClient";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Format date from YYYY-MM-DD to MMM DD, YYYY
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString + 'T00:00:00');
      return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  // Fetch event details from Supabase
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
       const response = await fetch(`http://localhost:8080/api/events/${id}`);

if (!response.ok) {
  throw new Error("Event not found");
}

const data = await response.json();
setEvent(data);

        if (error) {
          setError('Event not found');
          console.error('Error fetching event:', error);
        } else {
          setEvent(data);
        }
      } catch (error) {
        setError('Failed to load event details');
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEvent();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="event-details-container">
        <DashboardHeader />
        <div className="event-loading">
          <p>Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="event-details-container">
        <DashboardHeader />
        <div className="event-error">
          <h2>{error || 'Event not found'}</h2>
          <button onClick={() => navigate('/userDashboard')} className="back-btn">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="event-details-container">
      <DashboardHeader />

      <div className="event-hero">
        <img
        src={event.imageUrl || 'https://images.unsplash.com/photo-1511578314322-379afb476865'}
          alt={event.eventName}
          className="event-hero-image"
        />
      </div>

      <div className="event-content">
        <button onClick={() => navigate('/userDashboard')} className="back-btn">
          ← Back to Dashboard
        </button>

        <div className="event-card-wrapper">
          <div className="event-header">
            <div>
              <h1>{event.eventName}</h1>
              <span className="event-badge">{event.category || 'Event'}</span>
            </div>
          </div>

          <div className="event-info-grid">
            {/* ✅ SINGLE EVENT VIEW */}
{event.eventType === "single" && (
  <div className="info-item">
    <label>Date</label>
    <p>{event.date ? formatDate(event.date) : 'Not specified'}</p>
  </div>
)}

{/* ✅ RECURRING EVENT VIEW */}
{event.eventType === "recurring" && (
  <>
    <div className="info-item">
      <label>Start Date</label>
      <p>{event.startDate ? formatDate(event.startDate) : 'Not specified'}</p>
    </div>

    <div className="info-item">
      <label>End Date</label>
      <p>{event.endDate ? formatDate(event.endDate) : 'Not specified'}</p>
    </div>

    <div className="info-item">
      <label>Recurrence Days</label>
      <p>{event.recurrenceDays || 'Not specified'}</p>
    </div>
  </>
)}

            <div className="info-item">
              <label>Time</label>
              <p>
                {event.startTime && event.endTime
                  ? `${event.startTime} - ${event.endTime}`
                  : 'Time not specified'}
              </p>
            </div>

            <div className="info-item">
              <label>Timezone</label>
              <p>{event.timeZone || 'Not specified'}</p>
            </div>

            <div className="info-item">
              <label>Venue</label>
              <p>{event.locationName || 'Location not specified'}</p>
            </div>
              
              <div className="info-item">
  <label>Event Type</label>
  <p>{event.eventType || 'Not specified'}</p>
</div>

<div className="info-item">
  <label>Payment</label>
  <p>
    {event.paymentType === "PAID"
      ? `Fee - ₱${event.eventPrice ?? 0}`
      : "Free"}
  </p>
</div>

<div className="info-item">
  <label>Slots</label>
  <p>
    {event.slotType === "limited"
      ? `Limited - ${event.slotLimit ?? 0} slots`
      : "Unlimited"}
  </p>
</div>
          </div>

          <div className="event-address-section">
            <label>Address</label>
            <p className="address-text">
              {event.address || 'Address not provided'}
            </p>
            {event.city && <p className="city-text">{event.city}</p>}
          </div>

          <div className="event-description-section">
            <label>Description</label>
            <p className="description-text">
              {event.description || 'No description available'}
            </p>
          </div>

          <div className="event-actions">
          <button
  className="register-btn"
  onClick={() =>
    navigate(`/register-event/${event.id}`, {
      state: { event }
    })
  }
>
  Register for Event
</button>
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
