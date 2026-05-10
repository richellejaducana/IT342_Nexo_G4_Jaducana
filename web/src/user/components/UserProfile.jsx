import React, { useEffect, useState } from "react";
import "../css/UserProfile.css";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "./DashboardHeader";
import EventRegistered from "../../events/components/EventRegistered";
import { supabase } from "../../utils/supabaseClient";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("events");
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    const userData = JSON.parse(storedUser);
    console.log("=== STORED USER DATA ===");
    console.log("Full user object:", userData);
    console.log("user.id:", userData.id);
    console.log("user.user_id:", userData.user_id);
    console.log("user.firstname:", userData.firstname);
    console.log("user.email:", userData.email);
    
    setUser(userData);
    const userIdToUse = userData.user_id || userData.id;
    console.log("User ID to use for fetching events:", userIdToUse);
    fetchRegisteredEvents(userIdToUse);
  }, [navigate]);

  const fetchRegisteredEvents = async (userId) => {
    try {
      setLoading(true);
      console.log("\n=== FETCH EVENTS DEBUG ===");
      console.log("Fetching for user ID:", userId);
      console.log("Type of userId:", typeof userId);
      
      if (!userId) {
        console.error("❌ No user ID provided!");
        setRegisteredEvents([]);
        return;
      }

      // Try to fetch from "registrations" (plural) table first - this is what you have in Supabase
      console.log("📡 Attempting to fetch from 'registrations' table...");
      let { data, error } = await supabase
        .from("registrations")
        .select("*")
        .eq("user_id", userId);

      console.log("Response from 'registrations':", { data, error });

      if (error) {
        console.warn("❌ Error with 'registrations' table:", error.message);
        console.log("📡 Trying 'registration' (singular) table as fallback...");
        
        // Try "registration" (singular) as fallback
        const result = await supabase
          .from("registration")
          .select("*")
          .eq("user_id", userId);
        
        console.log("Response from 'registration':", result);
        data = result.data;
        error = result.error;

        if (error) {
          console.error("❌ Error with both tables:", error);
          setRegisteredEvents([]);
          return;
        }
      }

      console.log("✅ Raw registration records:", data);
      console.log("Total registrations found:", data?.length || 0);

      if (!data || data.length === 0) {
        console.warn("⚠️ No registrations found for user ID:", userId);
        setRegisteredEvents([]);
        return;
      }

      // Display all registration data
      data.forEach((reg, idx) => {
        console.log(`Registration ${idx}:`, reg);
      });

      // Now fetch the event details for each registration
      const eventIds = data.map((reg) => reg.event_id).filter(Boolean);
      console.log("Event IDs to fetch:", eventIds);

      if (eventIds.length === 0) {
        console.warn("⚠️ No event IDs found in registrations");
        setRegisteredEvents([]);
        return;
      }

      // Fetch events from the events table - use wildcard to get all columns
      const { data: eventsData, error: eventsError } = await supabase
        .from("events")
        .select("*")
        .in("id", eventIds);

      if (eventsError) {
        console.error("❌ Error fetching events:", eventsError);
        setRegisteredEvents([]);
        return;
      }

      console.log("✅ Events data retrieved:", eventsData);
      console.log("Total events:", eventsData?.length || 0);
      
      // Log the structure of the first event to see what columns exist
      if (eventsData && eventsData.length > 0) {
        console.log("Event structure (first event):", Object.keys(eventsData[0]));
      }

      const eventsMap = (eventsData || []).reduce((acc, event) => {
        acc[event.id] = event;
        return acc;
      }, {});

      const mergedEvents = data
        .map((reg) => {
          const event = eventsMap[reg.event_id];
          if (!event) return null;
//edited to merge all available event details into the registration object for easier access in the UI, and to handle different possible column names for event details
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
      console.error("❌ Unexpected error:", error);
      setRegisteredEvents([]);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="profile-page">
      <DashboardHeader />

      <div className="profile-cover"></div>

      <div className="profile-info">
        <img
          className="profile-avatar"
          src="https://i.pravatar.cc/150"
          alt="profile"
        />

        <div className="profile-details">
          <h2>{user.firstname} {user.lastname}</h2>
          <p className="username">@{user.firstname?.toLowerCase()}</p>
          <p className="bio">Event lover • Tech enthusiast • Organizer</p>

          <div className="stats">
            <div>
              <h4>{registeredEvents.length}</h4>
              <span>Events</span>
            </div>

  
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="profile-tabs">
        <button
          className={`tab-btn ${activeTab === "events" ? "active" : ""}`}
          onClick={() => setActiveTab("events")}
        >
          Events
        </button>
        <button
          className={`tab-btn ${activeTab === "about" ? "active" : ""}`}
          onClick={() => setActiveTab("about")}
        >
          About
        </button>
        
      </div>

      {/* TAB CONTENT */}
      <div className="tab-content">
        {activeTab === "events" && (
          <div className="events-section">
            {loading ? (
              <p className="loading-text">Loading your events...</p>
            ) : registeredEvents.length > 0 ? (
              <div className="events-grid">
                {registeredEvents.map((event) => (
                  <div
                    key={event.id}
                    className="event-card"
                    onClick={() => setSelectedEvent(event)}
                  >
                    {(event.image || event.imageUrl || event.image_url) && (
                      <img src={event.image || event.imageUrl || event.image_url} alt={event.title || event.eventName || event.eventName} />
                    )}
                    <div className="event-info">
                      <h4>{event.title || event.eventName || event.name}</h4>
                      <p className="event-description">
                        {(event.description || event.eventDescription)?.substring(0, 70) || "No description"}...
                      </p>
                      <div className="event-meta">
                        <span className="event-date">📅 {event.date || event.startDate || event.eventDate}</span>
                        <span className="event-location">📍 {event.location || event.locationName || event.address}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>You haven't registered for any events yet</p>
                <button
                  className="explore-btn"
                  onClick={() => navigate("/")}
                >
                  Explore Events
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "about" && (
          <div className="about-section">
            <div className="about-card">
              <h3>About</h3>
              <p>This is your profile information and activity details.</p>
              <div className="about-details">
                <div className="detail-item">
                  <span className="label">Email:</span>
                  <span className="value">{user.email}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Member Since:</span>
                  <span className="value">
                    {new Date(user.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "followers" && (
          <div className="followers-section">
            <div className="followers-card">
              <h3>Followers</h3>
              <p>Your followers will appear here</p>
            </div>
          </div>
        )}
      </div>

      {selectedEvent && (
        <div className="event-modal-backdrop" onClick={() => setSelectedEvent(null)}>
          <div className="event-modal" onClick={(e) => e.stopPropagation()}>
            <EventRegistered event={selectedEvent} onClose={() => setSelectedEvent(null)} />
          </div>
        </div>
      )}
    </div>
  );
}