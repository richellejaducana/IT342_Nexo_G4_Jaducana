import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/PaymentPage.css";
import DashboardHeader from "./header/DashboardHeader.jsx";

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ data passed from RegisterEvent
  const { event, slots, total } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState("GCash");

  const handlePayment = () => {
    console.log({
      eventId: event?.id,
      slots,
      total,
      paymentMethod,
    });

    alert("Payment Successful!");
    navigate("/userDashboard");
  };

  if (!event) return <p className="payment-error">No payment data</p>;

  return (
    <div className="payment-container">
      <DashboardHeader />

      {/* HERO */}
      <div className="payment-hero">
        <img
          src={
            event.imageUrl ||
            "https://images.unsplash.com/photo-1511578314322-379afb476865"
          }
          alt={event.eventName}
          className="payment-hero-image"
        />
      </div>

      <div className="payment-wrapper">
        <button
          className="payment-back-link"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        {/* HEADER */}
        <div className="payment-header">
          <h1>Payment</h1>
          <p>Complete your payment below</p>
        </div>

        {/* EVENT DETAILS */}
        <div className="payment-card">
          <h2 className="payment-section-title">Event Details</h2>

          <div className="payment-info-grid">
            <div>
              <label>Event</label>
              <p>{event.eventName}</p>
            </div>

            <div>
              <label>Date</label>
              <p>{event.date || event.startDate}</p>
            </div>

            <div>
              <label>Slots</label>
              <p>{slots}</p>
            </div>

            <div>
              <label>Total</label>
              <p>₱{total}</p>
            </div>
          </div>
        </div>

        {/* PAYMENT METHOD */}
        <div className="payment-card">
          <h2 className="payment-section-title">Payment Method</h2>

          <div className="payment-form-group">
            <label>Select Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="GCash">GCash</option>
              <option value="Cash">Cash</option>
            </select>
          </div>

          {/* PAYMENT SUMMARY */}
          <div className="payment-payment-box">
            <h3>Payment Summary</h3>
            <p>Total: ₱{total}</p>
          </div>

          {/* ACTION BUTTONS */}
          <div className="payment-actions">
            <button
              className="payment-back-btn"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>

            <button
              className="payment-submit-btn"
              onClick={handlePayment}
            >
              Pay Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;