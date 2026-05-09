import React, { useEffect, useState } from "react";
import "../css/PaymentManagement.css";
import AdminHeader from "./header/AdminHeader.jsx";

const PaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    fetchPayments();
  }, [filter]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const url = filter === "ALL"
        ? "http://localhost:8080/api/payments"
        : `http://localhost:8080/api/payments/status/${filter}`;

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Failed to load payments: ${res.statusText}`);
      }
      const data = await res.json();
      setPayments(data);
    } catch (err) {
      console.error("Failed to fetch payments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (paymentId, status, remarks) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        alert("Admin not logged in");
        return;
      }

      const res = await fetch(`http://localhost:8080/api/payments/${paymentId}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: status,
          remarks: remarks,
          adminId: user.id || user.user_id,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update payment status");
      }

      alert(`Payment ${status.toLowerCase()} successfully`);
      setSelectedPayment(null);
      fetchPayments();
    } catch (err) {
      console.error("Failed to review payment:", err);
      alert("Failed to update payment: " + err.message);
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString() + " " +
           new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="payment-management">
        <AdminHeader />
        <div className="loading">Loading payments...</div>
      </div>
    );
  }

  return (
    <div className="payment-management">
      <AdminHeader />

      <main className="main-content">
        <div className="main-header">
          <h1 className="welcome">Payment Management</h1>
          <p className="subtitle">Review and manage payment submissions</p>
        </div>

        <div className="filters">
          <button
            className={filter === "ALL" ? "active" : ""}
            onClick={() => setFilter("ALL")}
          >
            All Payments ({payments.length})
          </button>
          <button
            className={filter === "PENDING" ? "active" : ""}
            onClick={() => setFilter("PENDING")}
          >
            Pending ({payments.filter(p => p.status === "PENDING").length})
          </button>
          <button
            className={filter === "APPROVED" ? "active" : ""}
            onClick={() => setFilter("APPROVED")}
          >
            Approved ({payments.filter(p => p.status === "APPROVED").length})
          </button>
          <button
            className={filter === "REJECTED" ? "active" : ""}
            onClick={() => setFilter("REJECTED")}
          >
            Rejected ({payments.filter(p => p.status === "REJECTED").length})
          </button>
        </div>

        <div className="payments-actions-row">
          <button className="refresh-btn" onClick={fetchPayments}>Refresh</button>
        </div>
        <div className="payments-grid">
          {payments.map((payment) => (
            <div key={payment.id} className="payment-card">
              <div className="payment-header">
                <div className="event-info">
                  <h3>{payment.registration?.eventName}</h3>
                  <p>{payment.registration?.locationName}</p>
                </div>
                <div className="status-badge" style={{ backgroundColor: getStatusColor(payment.status) }}>
                  {payment.status}
                </div>
              </div>

              <div className="payment-details">
                <div className="detail-row">
                  <span className="label">User:</span>
                  <span className="value">{payment.registration?.user?.firstname} {payment.registration?.user?.lastname}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Payment Method:</span>
                  <span className="value">{payment.paymentMethod}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Reference:</span>
                  <span className="value">{payment.referenceNumber}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Amount:</span>
                  <span className="value">₱{payment.registration?.eventPrice * payment.registration?.slots || 0}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Submitted:</span>
                  <span className="value">{formatDate(payment.submittedAt)}</span>
                </div>
              </div>

              <div className="payment-actions">
                <button
                  className="view-proof-btn"
                  onClick={() => setSelectedPayment(payment)}
                >
                  View Proof
                </button>
                {payment.status === "PENDING" && (
                  <>
                    <button
                      className="approve-btn"
                      onClick={() => handleReview(payment.id, "APPROVED", "")}
                    >
                      Approve
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() => {
                        const remarks = prompt("Enter rejection reason:");
                        if (remarks !== null) {
                          handleReview(payment.id, "REJECTED", remarks);
                        }
                      }}
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {payments.length === 0 && (
          <div className="no-payments">
            <p>No payments found for the selected filter.</p>
          </div>
        )}
      </main>

      {/* Payment Proof Modal */}
      {selectedPayment && (
        <div className="modal-overlay" onClick={() => setSelectedPayment(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Payment Proof</h2>
              <button className="close-btn" onClick={() => setSelectedPayment(null)}>×</button>
            </div>

            <div className="proof-details">
              <div className="proof-image">
                <img
                  src={selectedPayment.paymentProofUrl}
                  alt="Payment proof"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/400x300?text=Image+Not+Available";
                  }}
                />
              </div>

              <div className="proof-info">
                <div className="info-row">
                  <span className="label">Event:</span>
                  <span className="value">{selectedPayment.registration?.eventName}</span>
                </div>
                <div className="info-row">
                  <span className="label">User:</span>
                  <span className="value">
                    {selectedPayment.registration?.user?.firstname} {selectedPayment.registration?.user?.lastname}
                  </span>
                </div>
                <div className="info-row">
                  <span className="label">Payment Method:</span>
                  <span className="value">{selectedPayment.paymentMethod}</span>
                </div>
                <div className="info-row">
                  <span className="label">Reference Number:</span>
                  <span className="value">{selectedPayment.referenceNumber}</span>
                </div>
                <div className="info-row">
                  <span className="label">Amount:</span>
                  <span className="value">₱{selectedPayment.registration?.eventPrice * selectedPayment.registration?.slots || 0}</span>
                </div>
                <div className="info-row">
                  <span className="label">Status:</span>
                  <span className="status" style={{ color: getStatusColor(selectedPayment.status) }}>
                    {selectedPayment.status}
                  </span>
                </div>
                {selectedPayment.remarks && (
                  <div className="info-row">
                    <span className="label">Remarks:</span>
                    <span className="value remarks">{selectedPayment.remarks}</span>
                  </div>
                )}
              </div>
            </div>

            {selectedPayment.status === "PENDING" && (
              <div className="modal-actions">
                <button
                  className="approve-btn"
                  onClick={() => handleReview(selectedPayment.id, "APPROVED", "")}
                >
                  Approve Payment
                </button>
                <button
                  className="reject-btn"
                  onClick={() => {
                    const remarks = prompt("Enter rejection reason:");
                    if (remarks !== null) {
                      handleReview(selectedPayment.id, "REJECTED", remarks);
                    }
                  }}
                >
                  Reject Payment
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentManagement;