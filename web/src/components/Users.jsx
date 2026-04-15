import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";
import "../css/Users.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const currentUser = JSON.parse(localStorage.getItem("user")) || {};
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: supabaseError } = await supabase
        .from("users")
        .select("id, firstname, lastname, email")
        .order("id", { ascending: true });

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      setUsers(data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (path) => {
    if (!path) return;
    navigate(path);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.firstname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-dashboard">
      <aside className="sidebar">
        <div className="sidebar-top">
          <h2 className="app-title">Nexo Admin</h2>
        </div>

        <nav className="admin-nav">
          <button
            className={`nav-item`}
            onClick={() => handleNavigate("/admin-dashboard")}
          >
            Dashboard
          </button>
          <button
            className={`nav-item`}
            onClick={() => handleNavigate("/admin-profile")}
          >
            Admin Profile
          </button>
          <button
            className={`nav-item`}
            onClick={() => handleNavigate("/create-event")}
          >
            Create Event
          </button>
          <button
            className={`nav-item`}
            onClick={() => handleNavigate("/manage-events")}
          >
            Manage Events
          </button>
          <button className={`nav-item active`} onClick={() => handleNavigate("/users")}>
            Users
          </button>
        </nav>

        <div className="sidebar-bottom">
          <button
            className="logout-btn"
            onClick={() => {
              localStorage.clear();
              handleNavigate("/login");
            }}
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="main-header">
          <h1 className="welcome">
            Welcome, {currentUser?.firstname || "Admin"} {currentUser?.lastname || ""}
          </h1>
          <p className="subtitle">Manage all registered users</p>
        </header>

        <section className="users-section">
          <div className="users-card">
            <div className="users-card-header">
              <h2 className="users-title">All Users</h2>
              <p className="users-count">Total: {filteredUsers.length} users</p>
            </div>

            <div className="search-bar-container">
              <input
                type="text"
                placeholder="Search by name or email..."
                className="search-bar"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {loading ? (
              <div className="loading-state">
                <p>Loading users...</p>
              </div>
            ) : error ? (
              <div className="error-state">
                <p className="error-message">{error}</p>
                <button className="retry-btn" onClick={fetchUsers}>
                  Retry
                </button>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="empty-state">
                <p>No users found</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>First Name</th>
                      <th>Last Name</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="user-row">
                        <td className="cell-id">{user.id}</td>
                        <td className="cell-firstname">{user.firstname || "-"}</td>
                        <td className="cell-lastname">{user.lastname || "-"}</td>
                        <td className="cell-email">{user.email || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Users;
