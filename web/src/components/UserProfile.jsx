import React, { useEffect, useState } from "react";
import "../css/UserProfile.css";
import { useNavigate } from "react-router-dom";

export default function UserProfile() {

  const [user, setUser] = useState(null);

 useEffect(() => {
  const storedUser = localStorage.getItem("user");

  if (!storedUser) {
    navigate("/login");
    return;
  }

  setUser(JSON.parse(storedUser));
}, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="profile-page">

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
          <p className="bio">
            Event lover • Tech enthusiast • Organizer
          </p>

          <div className="stats">
            <div>
              <h4>12</h4>
              <span>Events</span>
            </div>

            <div>
              <h4>340</h4>
              <span>Followers</span>
            </div>

            <div>
              <h4>120</h4>
              <span>Following</span>
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="profile-tabs">
        <button className="active">Events</button>
        <button>About</button>
        <button>Followers</button>
      </div>


    </div>
  );
}