import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/UserPaymentStatus.css";
import DashboardHeader from "./DashboardHeader.jsx";

const UserPaymentStatus = () => {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useMemo(() => JSON.parse(localStorage.getItem("user")) || {}, []);
  const userId = user.id || user.user_id;

  useEffect(() => {
    if (userId) {
      fetchUserRegistrations();
    } else {
      setLoading(false);
    }
  }, [userId]);

  const fetchUserRegistrations = async () => {
    setLoading(true);
    try {
      const userId = user.id || user.user_id;
      const res = await fetch(`http://localhost:8080/api/registrations/user/${userId}`);
      if (!res.ok) {
        throw new Error(`Failed to load registrations: ${res.statusText}`);
      }
      const data = await res.json();
      setRegistrations(data);
    } catch (err) {
      console.error("Failed to fetch registrations:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING": return "#ffc107";
      case "APPROVED": return "#28a745";
      case "REJECTED": return "#dc3545";
      default: return "#6c757d";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "PENDING": return "Payment Under Review";
      case "APPROVED": return "Payment Approved";
      case "REJECTED": return "Payment Rejected";
      default: return "Unknown Status";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="payment-status">
        <DashboardHeader />
        <div className="loading">Loading your registrations...</div>
      </div>
    );
  }

  return (
    <div className="payment-status">
      <DashboardHeader />

      <main className="main-content">
        <div className="main-header">
          <div>
            <h1 className="welcome">My Payment Status</h1>
            <p className="subtitle">Track the status of your event registrations and payments</p>
          </div>
          <button className="refresh-btn" onClick={fetchUserRegistrations}>
            Refresh
          </button>
        </div>

        {registrations.length === 0 ? (
          <div className="no-registrations">
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h2>No Registrations Yet</h2>
              <p>You haven't registered for any events yet.</p>
              <a href="/userDashboard" className="browse-events-btn">
                Browse Events
              </a>
            </div>
          </div>
        ) : (
          <div className="registrations-grid">
            {registrations.map((registration) => (
              <div key={registration.id} className="registration-card">
                <div className="card-header">
                  <div className="event-image">
                    <img
                      src={registration.imageUrl || "https://via.placeholder.com/300"}
                      alt={registration.eventName}
                    />
                  </div>
                  <div className="status-indicator" style={{ backgroundColor: getStatusColor(registration.paymentStatus) }}>
                    <span className="status-text">{registration.paymentStatus}</span>
                  </div>
                </div>

                <div className="card-content">
                  <h3 className="event-title">{registration.eventName}</h3>

                  <div className="event-details">
                    <div className="detail-item">
                      <span className="label">Date:</span>
                      <span className="value">{formatDate(registration.eventDate || registration.startDate)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Time:</span>
                      <span className="value">{registration.eventTime}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Location:</span>
                      <span className="value">{registration.locationName}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Slots:</span>
                      <span className="value">{registration.slots}</span>
                    </div>
                    {registration.paymentType?.toUpperCase() === "PAID" && (
                      <div className="detail-item">
                        <span className="label">Amount:</span>
                        <span className="value">₱{registration.eventPrice * registration.slots}</span>
                      </div>
                    )}
                  </div>

                  <div className="payment-info">
                    <div className="status-message" style={{ color: getStatusColor(registration.paymentStatus) }}>
                      <strong>{getStatusText(registration.paymentStatus)}</strong>
                    </div>

                    {registration.paymentStatus === "PENDING" && (
                      <div className="pending-notice">
                        <p>Your payment is being reviewed by our administrators. You will receive a confirmation once it's approved.</p>
                      </div>
                    )}

                    {registration.paymentStatus === "APPROVED" && (
                      <div className="approved-notice">
                        <p>✅ Your payment has been approved! You are officially registered for this event.</p>
                      </div>
                    )}

                    {registration.paymentStatus === "REJECTED" && registration.payment?.remarks && (
                      <div className="rejected-notice">
                        <p>❌ Your payment was rejected.</p>
                        <p><strong>Reason:</strong> {registration.payment.remarks}</p>
                        <button
                          className="resubmit-btn"
                          onClick={() => {
                            navigate("/payment", {
                              state: {
                                event: {
                                  id: registration.event?.id || registration.eventId,
                                  eventName: registration.eventName,
                                  locationName: registration.locationName,
                                  city: registration.city,
                                  date: registration.eventDate,
                                  startTime: registration.eventTime?.split(" - ")[0],
                                  eventPrice: registration.eventPrice,
                                },
                                slots: registration.slots,
                                total: registration.eventPrice * registration.slots,
                                registrationId: registration.id,
                                isResubmission: true,
                              },
                            });
                          }}
                        >
                          Resubmit Payment
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default UserPaymentStatus;