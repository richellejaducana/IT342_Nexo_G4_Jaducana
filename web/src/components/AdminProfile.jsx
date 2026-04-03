
import React from "react";
import { useNavigate } from "react-router-dom";

const AdminProfile = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    if (!path) return;
    navigate(path);
  };

  return (
    <div className="admin-dashboard create-event-page">
      <aside className="sidebar">
        <div className="sidebar-top">
          <h2 className="app-title">Nexo Admin</h2>
        </div>

        <nav className="admin-nav">
          <button className={`nav-item`} onClick={() => handleNavigate('/admin-dashboard')}>Dashboard</button>
          <button className={`nav-item active`} onClick={() => handleNavigate('/admin-profile')}>Admin Profile</button>
          <button className={`nav-item`} onClick={() => handleNavigate('/create-event')}>Create Event</button>
          <button className={`nav-item`} onClick={() => handleNavigate('/manage-events')}>Manage Events</button>
          <button className={`nav-item`} onClick={() => handleNavigate('/users')}>Users</button>
        </nav>

        <div className="sidebar-bottom">
          <button className="logout-btn" onClick={() => { localStorage.clear(); handleNavigate('/login'); }}>Logout</button>
        </div>
      </aside>

      <main className="main-content">
        <header className="main-header">
          <h1 className="welcome">Welcome, {user?.firstname || "Admin"} {user?.lastname || ""}</h1>
          
        </header>

        <section className="cards-grid">
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
        </section>
      </main>
    </div>
  );
};

export default AdminProfile;