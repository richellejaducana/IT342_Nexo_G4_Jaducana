import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/AdminDashboard.css";
import { useEffect } from "react";
const MENU_ITEMS = [
  "Dashboard",
  "Admin Profile",
  "Create Event",
  "Manage Events",
  "Users",
];

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [active, setActive] = useState("Dashboard");
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const navigate = useNavigate();

  const fetchEvents = async () => {
  try {
    const res = await fetch("http://localhost:8080/api/events");
    const data = await res.json();
    setEvents(data);
  } catch (err) {
    console.error("Failed to fetch events:", err);
  }
};

  const handleMenuClick = (item) => {
    setActive(item);
    switch (item) {
      case "Create Event":
        navigate("/create-event");
        break;
      case "Dashboard":
        navigate("/admin-dashboard");
        break;
      case "Admin Profile":
        navigate("/admin-profile");
        break;
      case "Manage Events":
        navigate("/manage-events");
        break;
      case "Users":
        navigate("/users");
        break;
      case "Create Program":
        navigate("/create-program");
        break;
      default:
        break;
    }
  };
useEffect(() => {
  fetchEvents();
}, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="admin-dashboard">
      <aside className="sidebar">
        <div className="sidebar-top">
          <h2 className="app-title">Nexo Admin</h2>
        </div>

        <nav className="admin-nav">
          {MENU_ITEMS.map((item) => (
            <button
              key={item}
              className={`nav-item ${active === item ? "active" : ""}`}
              onClick={() => handleMenuClick(item)}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      
    </div>
  );
};

export default AdminDashboard;