import React, { useEffect, useState } from "react";
import "../css/AdminDashboard.css";
import AdminHeader from "./header/AdminHeader.jsx";

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
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

  return (
    <div className="admin-dashboard">
      <AdminHeader />

      <main className="main-content">
        <div className="main-header">
          <h1 className="welcome">Welcome back, {user.firstname || "Admin"}</h1>
          <p className="subtitle">Manage events, users, and admin settings from one place.</p>
        </div>

        <div className="cards-grid">
          <div className="profile-card">
            <div className="profile-card-header">
              <div className="avatar">
                {`${user.firstname?.charAt(0) || ""}${user.lastname?.charAt(0) || ""}`.toUpperCase()}
              </div>
              <div>
                <h3 className="name">{user.firstname || "Admin"} {user.lastname || "User"}</h3>
                <p className="role">Administrator</p>
              </div>
            </div>

            <div className="profile-card-body">
              <div className="info-row">
                <span className="label">Email</span>
                <span className="value">{user.email || "Not available"}</span>
              </div>
              <div className="info-row">
                <span className="label">Status</span>
                <span className="value">Active</span>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <h3 className="stat-title">Events Loaded</h3>
            <p>{events.length} event{events.length === 1 ? "" : "s"} available</p>
            <ul className="actions-list">
              <li>Use the admin navigation to create or manage events.</li>
              <li>Open Users to review the registered accounts.</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
