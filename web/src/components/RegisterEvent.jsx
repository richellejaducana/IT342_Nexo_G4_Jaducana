import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../css/RegisterEvent.css";
import DashboardHeader from "./header/DashboardHeader.jsx";
import { useLocation } from "react-router-dom";
const RegisterEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
const location = useLocation();
const passedEvent = location.state?.event;
  const [event, setEvent] = useState(passedEvent || null);
  const [loading, setLoading] = useState(true);
  const [slots, setSlots] = useState(1);
  

  useEffect(() => {
  // ✅ If event already passed from EventDetails, skip fetching
  if (passedEvent) {
    setLoading(false);
    return;
  }

  // ✅ Otherwise fetch from backend (for refresh case)
  const fetchEvent = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/events/${id}`);
      const data = await res.json();
      setEvent(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  fetchEvent();
}, [id, passedEvent]);

 const handleSubmit = async () => {
  try {
     console.log("PAYMENT TYPE:", event.paymentType); // ✅ ADD HERE
    if (event.paymentType?.toUpperCase() === "FREE") {

      const user = JSON.parse(localStorage.getItem("user"));

console.log("USER FROM LOCALSTORAGE:", user);

if (!user || !user.id) {
  alert("User not logged in or missing ID");
  return;
} // 👈 IMPORTANT

      const res = await fetch("http://localhost:8080/api/registrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: event.id,
          userId: user.id, // 👈 FOREIGN KEY
          slots: Number(slots),
        }),
      });

     if (!res.ok) {
  const errorText = await res.text();
  console.error("BACKEND ERROR:", errorText);
  throw new Error(errorText);
}

      alert("Successfully registered!");
      navigate("/userDashboard");

    } else {
      navigate("/payment", {
        state: {
          event,
          slots,
          total: event.eventPrice * slots,
        },
      });
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

  if (loading) return <p className="register-loading">Loading...</p>;

  if (!event) return <p className="register-error">Event not found</p>;

  return (
    <div className="register-container">
      <DashboardHeader />

      <div className="register-hero">
  <img
    src={
      event.imageUrl ||
      "https://images.unsplash.com/photo-1511578314322-379afb476865"
    }
    alt={event.eventName}
    className="register-hero-image"
  />
</div>

      <div className="register-wrapper">
        <button
  className="register-back-link"
  onClick={() => navigate(`/event/${event.id}`)}
>
  ← Back to Event Details
</button>
        {/* HEADER */}
        <div className="register-header">
          <h1>Register for Event</h1>
          <p>Complete your registration below</p>
        </div>

        {/* EVENT SUMMARY */}
        <div className="register-card">
          <h2 className="register-section-title">Event Details</h2>

          <div className="register-info-grid">
            <div>
              <label>Event</label>
              <p>{event.eventName}</p>
            </div>

            <div>
              <label>Date</label>
              <p>{event.date || event.startDate}</p>
            </div>

            <div>
              <label>Time</label>
              <p>{event.startTime} - {event.endTime}</p>
            </div>

            <div>
              <label>Venue</label>
              <p>{event.locationName}</p>
            </div>

            <div>
              <label>Payment</label>
              <p>
               {event.paymentType?.toUpperCase() === "PAID"
                  ? `Fee - ₱${event.eventPrice ?? 0}`
                  : "Free"}
              </p>
            </div>

            <div>
              <label>Slots</label>
              <p>
                {event.slotType === "limited"
                  ? `Limited - ${event.slotLimit}`
                  : "Unlimited"}
              </p>
            </div>
          </div>
        </div>

        {/* REGISTRATION FORM */}
        <div className="register-card">
          <h2 className="register-section-title">Registration Info</h2>

          <div className="register-form-group">
            <label>Number of Slots</label>
            <input
              type="number"
              min="1"
              value={slots}
              onChange={(e) => setSlots(Number(e.target.value))}
            />
          </div>


          {/* PAYMENT */}
          {event.paymentType === "PAID" && (
            <div className="register-payment-box">
              <h3>Payment Summary</h3>
              <p>Total: ₱{event.eventPrice * slots}</p>
            </div>
          )}



          {/* ACTION BUTTONS */}
          <div className="register-actions">
            <button
              className="register-back-btn"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>

            <button
              className="register-submit-btn"
              onClick={handleSubmit}
            >
              Confirm Registration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterEvent;