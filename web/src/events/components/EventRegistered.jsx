import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/EventRegistered.css";
import DashboardHeader from "../../user/components/DashboardHeader.jsx";
import { supabase } from "../../utils/supabaseClient";

const EventRegistered = ({ event: eventProp, onClose }) => {
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const isModalView = Boolean(eventProp);

  const getEventName = (event) =>
    event.eventName || event.event_name || event.title || event.name || "Event";

  const getEventType = (event) =>
    event.eventType || event.event_type || event.type || event.category || "Not specified";

  const getEventDate = (event) =>
    event.eventDate || event.event_date || event.date || event.startDate || event.start_date || "TBD";

  const getEventTime = (event) => {
    if (event.eventTime || event.event_time) {
      return event.eventTime || event.event_time;
    }
    const start = event.startTime || event.start_time;
    const end = event.endTime || event.end_time;
    if (start && end) {
      return `${start} - ${end}`;
    }
    return "TBD";
  };

  const getLocationName = (event) =>
    event.locationName || event.location || event.location_name || "TBD";

  const getAddress = (event) => event.address || event.address || "Not specified";
  const getCity = (event) => event.city || event.city || "Not specified";
  const getImage = (event) => event.imageUrl || event.image || event.image_url;

  useEffect(() => {
    if (isModalView) {
      setLoading(false);
      return;
    }

    const fetchRegisteredEvents = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
          navigate("/login");
          return;
        }

        const userIdToUse = user.user_id || user.id;

        // Fetch registrations
        let { data: registrations, error } = await supabase
          .from("registrations")
          .select("*")
          .eq("user_id", userIdToUse);

        if (error) {
          console.error("Error fetching registrations:", error);
          setRegisteredEvents([]);
          return;
        }

        if (!registrations || registrations.length === 0) {
          setRegisteredEvents([]);
          return;
        }

        // Fetch event details
        const eventIds = registrations.map((reg) => reg.event_id);
        const { data: eventsData, error: eventsError } = await supabase
          .from("events")
          .select("*")
          .in("id", eventIds);

        if (eventsError) {
          console.error("Error fetching events:", eventsError);
          setRegisteredEvents([]);
          return;
        }

        const eventsMap = (eventsData || []).reduce((acc, event) => {
          acc[event.id] = event;
          return acc;
        }, {});

        const mergedEvents = registrations
          .map((reg) => {
            const event = eventsMap[reg.event_id];
            if (!event) return null;
            return {
              ...event,
              eventName: reg.eventName || event.eventName || event.title,
              date: reg.eventDate || event.date,
              startDate: reg.startDate || event.startDate,
              endDate: reg.endDate || event.endDate,
              eventTime:
                reg.eventTime ||
                (event.startTime && event.endTime
                  ? `${event.startTime} - ${event.endTime}`
                  : null),
              locationName: reg.locationName || event.locationName,
              address: reg.address || event.address,
              city: reg.city || event.city,
              eventPrice: reg.eventPrice || event.eventPrice,
              paymentType: reg.paymentType || event.paymentType,
              eventType: reg.eventType || event.eventType,
              recurrenceDays: reg.recurrenceDays || event.recurrenceDays,
              imageUrl: reg.imageUrl || event.imageUrl || event.image,
              registration: reg,
              registeredSlots: reg.slots ?? reg.slotsTaken ?? 1,
            };
          })
          .filter(Boolean);

        setRegisteredEvents(mergedEvents);
      } catch (error) {
        console.error("Unexpected error:", error);
        setRegisteredEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRegisteredEvents();
  }, [navigate]);

  if (loading && !isModalView) {
    return (
      <div className="register-container">
        <DashboardHeader />
        <div className="register-wrapper">
          <div className="register-loading">
            <p>Loading your registered events...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isModalView) {
    const event = eventProp;
    const eventName = getEventName(event);
    const eventDescription = event.description || event.eventDescription || event.details || "No description available.";
    const eventImage = getImage(event);
    const eventDate = getEventDate(event);
    const eventTime = getEventTime(event);
    const eventType = getEventType(event);
    const registeredSlots = event.registeredSlots ?? event.registration?.slots ?? event.slots ?? 1;

    return (
      <div className="register-card registered-event-detail-card">
        <h2 className="register-section-title">Registered Event Details</h2>

        {eventImage && (
          <div className="register-detail-image-wrap">
            <img src={eventImage} alt={eventName} className="register-detail-image" />
          </div>
        )}

        <div className="register-info-grid">
          <div>
            <label>Event</label>
            <p>{eventName}</p>
          </div>

          <div>
            <label>Event Type</label>
            <p>{eventType}</p>
          </div>

          <div>
            <label>Date</label>
            <p>{eventDate}</p>
          </div>

          <div>
            <label>Time</label>
            <p>{eventTime}</p>
          </div>

          <div>
            <label>Address</label>
            <p>{getAddress(event)}</p>
          </div>

          <div>
            <label>City</label>
            <p>{getCity(event)}</p>
          </div>

          <div>
            <label>Price</label>
            <p>
              {event.paymentType?.toUpperCase() === "PAID"
                ? `₱${event.eventPrice ?? 0}`
                : "Free"}
            </p>
          </div>

          <div>
            <label>Slot Taken</label>
            <p>{registeredSlots}</p>
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label>Description</label>
            <p>{eventDescription}</p>
          </div>
        </div>

        <div className="register-actions register-actions-bottom">
          <button className="register-back-btn" onClick={onClose || (() => {})}>
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="register-container">
      <DashboardHeader />

      <div className="register-wrapper">
        {/* HEADER */}
        <div className="register-header">
          <h1>Your Registered Events</h1>
          <p>View and manage your event registrations</p>
        </div>

        {/* REGISTERED EVENTS */}
        {registeredEvents.length > 0 ? (
          registeredEvents.map((event) => (
            <div key={event.id} className="register-card">
              <h2 className="register-section-title">Event Details</h2>

              <div className="register-info-grid">
                <div>
                  <label>Event</label>
                  <p>{getEventName(event)}</p>
                </div>

                <div>
                  <label>Event Type</label>
                  <p>{getEventType(event)}</p>
                </div>

                <div>
                  <label>Date</label>
                  <p>{getEventDate(event)}</p>
                </div>

                <div>
                  <label>Time</label>
                  <p>{getEventTime(event)}</p>
                </div>

                <div>
                  <label>Address</label>
                  <p>{getAddress(event)}</p>
                </div>

                <div>
                  <label>City</label>
                  <p>{getCity(event)}</p>
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
                  <label>Status</label>
                  <p>Registered</p>
                </div>
              </div>

              {/* ACTION BUTTON */}
              <div className="register-actions">
                <button
                  className="register-submit-btn"
                  onClick={() => navigate(`/event/${event.id}`)}
                >
                  View Event Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="register-card">
            <h2 className="register-section-title">No Registered Events</h2>
            <p>You haven't registered for any events yet.</p>
            <div className="register-actions">
              <button
                className="register-submit-btn"
                onClick={() => navigate("/")}
              >
                Explore Events
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventRegistered;