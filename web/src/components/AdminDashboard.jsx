import React from "react";

const AdminDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div style={{ padding: "30px" }}>
      <h1>Admin Dashboard</h1>

      <hr />

      <h3>Welcome, {user?.firstname} {user?.lastname}</h3>
      <p>Email: {user?.email}</p>
      <p style={{ color: "red", fontWeight: "bold" }}>
        Role: {user?.role}
      </p>

      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => {
            localStorage.removeItem("user");
            window.location.href = "/login";
          }}
          style={{
            padding: "10px 20px",
            backgroundColor: "#ff4d4f",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;