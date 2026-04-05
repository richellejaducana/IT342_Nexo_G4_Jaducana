import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/DashboardHeader.css";
import NexoLogo from "../../assets/Nexo-logo.png";
import NotifEmoji from "../../assets/notif.png";
function DashboardHeader() {

  const [initials, setInitials] = useState("");
  const navigate = useNavigate();

useEffect(() => {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user) {
    navigate("/login"); // fallback if no user
    return;
  }

  const first = user.firstname?.charAt(0).toUpperCase() || "";
  const last = user.lastname?.charAt(0).toUpperCase() || "";

  setInitials(first + last);
}, [navigate]);

  return (
    <nav className="header">

      <div className="logo">
        <img src={NexoLogo} alt="Nexo Logo" />
      </div>

      <div className="nav-container">

        <nav className="navigation">
          <a href="#home">HOME</a>
           <a href="#program">PROGRAMS</a>
            <a href="#program">EVENTS</a>
         <img src={NotifEmoji} alt="Notifications" className="notif-icon" />
        </nav>

        {/* PROFILE CIRCLE */}
        <div
          className="profile-circle"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/userProfile")}
        >
          {initials}
        </div>

      </div>

    </nav>
  );
}

export default DashboardHeader;