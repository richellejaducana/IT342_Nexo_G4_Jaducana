import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/DashboardHeader.css";
import "../../css/AdminHeader.css";
import NexoLogo from "../../assets/Nexo-logo.png";

function AdminHeader() {
  const [initials, setInitials] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!user) {
      navigate("/login");
      return;
    }

    const first = user.firstname?.charAt(0).toUpperCase() || "";
    const last = user.lastname?.charAt(0).toUpperCase() || "";
    setInitials(first + last);
  }, [navigate]);

  return (
    <nav className="header admin-header">
      <div className="logo">
        <img src={NexoLogo} alt="Nexo Logo" onClick={() => navigate("/admin-dashboard")} />
      </div>

      <div className="nav-container">
        <nav className="navigation">
          <a href="#dashboard" onClick={(e) => { e.preventDefault(); navigate("/admin-dashboard"); }}>DASHBOARD</a>
          <a href="#create" onClick={(e) => { e.preventDefault(); navigate("/create-event"); }}>CREATE EVENT</a>
          <a href="#manage" onClick={(e) => { e.preventDefault(); navigate("/manage-events"); }}>MANAGE EVENTS</a>
          <a href="#payments" onClick={(e) => { e.preventDefault(); navigate("/payment-management"); }}>PAYMENTS</a>
          <a href="#users" onClick={(e) => { e.preventDefault(); navigate("/users"); }}>USERS</a>
        
          <a href="#logout" className="logout-link" onClick={(e) => { e.preventDefault(); handleLogout(); }}>LOGOUT</a>
        </nav>

        <div
          className="profile-circle"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/admin-profile")}
        >
          {initials}
        </div>
      </div>
    </nav>
  );
}

export default AdminHeader;
