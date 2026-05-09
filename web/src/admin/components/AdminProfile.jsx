import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/AdminDashboard.css";
import AdminHeader from "./AdminHeader.jsx";

const AdminProfile = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    if (!path) return;
    navigate(path);
  };

  return (
    <div className="admin-dashboard">
      <AdminHeader />

      <main className="main-content">
        <div className="main-header">
          <h1 className="welcome">Welcome, {user?.firstname || "Admin"} {user?.lastname || ""}</h1>
          <p className="subtitle">Your admin profile and quick actions.</p>
        </div>

        <div className="cards-grid">
          <div className="profile-card">
            <div className="profile-card-header">
              <div className="avatar">{(user?.firstname || "A").charAt(0)}</div>
              <div>
                <h3 className="name">{user?.firstname || "Admin"} {user?.lastname || ""}</h3>
                <p className="role">{user?.role || "Administrator"}</p>
              </div>
            </div>

            <div className="profile-card-body">
              <div className="info-row">
                <span className="label">Email</span>
                <span className="value">{user?.email || "not.provided@example.com"}</span>
              </div>
              <div className="info-row">
                <span className="label">Role</span>
                <span className="value">{user?.role || "Administrator"}</span>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <h4 className="stat-title">Quick Actions</h4>
            <ul className="actions-list">
              <li>Review pending events</li>
              <li>Manage users</li>
              <li className="action-link" onClick={() => navigate('/create-event')}>Create new event</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminProfile;