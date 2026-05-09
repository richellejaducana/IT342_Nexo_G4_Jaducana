import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/PaymentPage.css";
import DashboardHeader from "./header/DashboardHeader.jsx";

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { event, slots, total, registrationId, isResubmission } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [paymentProof, setPaymentProof] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  if (!event) {
    return <div className="payment-error">No event data found. Please go back and try again.</div>;
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPaymentProof(file);
      setPreviewUrl(URL.createObjectURL(file));
      setErrors(prev => ({ ...prev, paymentProof: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!paymentMethod) {
      newErrors.paymentMethod = "Please select a payment method";
    }

    if (!referenceNumber.trim()) {
      newErrors.referenceNumber = "Reference number is required";
    }

    if (!paymentProof) {
      newErrors.paymentProof = "Please upload payment proof";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        alert("User not logged in");
        navigate("/login");
        return;
      }

      let registration = { id: registrationId };
      if (!isResubmission) {
        const registrationRes = await fetch("http://localhost:8080/api/registrations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            eventId: event.id,
            userId: user.id || user.user_id,
            slots: slots,
          }),
        });

        if (!registrationRes.ok) {
          const errorText = await registrationRes.text();
          throw new Error(errorText);
        }

        registration = await registrationRes.json();
      }

      const formData = new FormData();
      formData.append("registrationId", registration.id);
      formData.append("paymentMethod", paymentMethod);
      formData.append("referenceNumber", referenceNumber);
      formData.append("paymentProof", paymentProof);
      formData.append("userId", user.id || user.user_id);

      const endpoint = isResubmission ? "http://localhost:8080/api/payments/resubmit" : "http://localhost:8080/api/payments/submit";
      const paymentRes = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      if (!paymentRes.ok) {
        const errorText = await paymentRes.text();
        throw new Error(errorText);
      }

      const successMessage = isResubmission
        ? "Payment resubmitted successfully! Your registration is pending approval."
        : "Payment submitted successfully! Your registration is pending approval.";

      alert(successMessage);
      navigate("/payment-status");

    } catch (err) {
      console.error("Payment submission error:", err);
      alert("Failed to submit payment: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const paymentMethods = [
    { value: "GCASH", label: "GCash", details: "Send to: 09123456789" },
    { value: "MAYA", label: "Maya", details: "Send to: 09123456789" },
    { value: "BANK_TRANSFER", label: "Bank Transfer", details: "BDO Account: 1234567890" },
  ];

  return (
    <div className="payment-container">
      <DashboardHeader />

      <div className="payment-wrapper">
        <div className="payment-header">
          <h1>Complete Payment</h1>
          <p>Please complete your payment to secure your registration</p>
        </div>

        {/* Event Summary */}
        <div className="payment-card">
          <h2>Event Summary</h2>
          <div className="event-summary">
            <div className="event-info">
              <h3>{event.eventName}</h3>
              <p>{event.locationName}, {event.city}</p>
              <p>{event.date || event.startDate} at {event.startTime}</p>
            </div>
            <div className="payment-info">
              <p><strong>Slots:</strong> {slots}</p>
              <p><strong>Total Amount:</strong> ₱{total}</p>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="payment-form">
          {/* Payment Method Selection */}
          <div className="payment-card">
            <h2>Select Payment Method</h2>
            <div className="payment-methods">
              {paymentMethods.map((method) => (
                <div
                  key={method.value}
                  className={`payment-method ${paymentMethod === method.value ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod(method.value)}
                >
                  <div className="method-header">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.value}
                      checked={paymentMethod === method.value}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <label>{method.label}</label>
                  </div>
                  <p className="method-details">{method.details}</p>
                </div>
              ))}
            </div>
            {errors.paymentMethod && <span className="error">{errors.paymentMethod}</span>}
          </div>

          {/* Reference Number */}
          <div className="payment-card">
            <h2>Payment Details</h2>
            <div className="form-group">
              <label htmlFor="referenceNumber">Reference Number *</label>
              <input
                type="text"
                id="referenceNumber"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                placeholder="Enter the reference/transaction number"
                className={errors.referenceNumber ? 'error' : ''}
              />
              {errors.referenceNumber && <span className="error">{errors.referenceNumber}</span>}
            </div>
          </div>

          {/* Payment Proof Upload */}
          <div className="payment-card">
            <h2>Upload Payment Proof</h2>
            <div className="upload-section">
              <input
                type="file"
                id="paymentProof"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <label htmlFor="paymentProof" className="upload-btn">
                {paymentProof ? 'Change Image' : 'Select Image'}
              </label>

              {previewUrl && (
                <div className="image-preview">
                  <img src={previewUrl} alt="Payment proof" />
                </div>
              )}

              {errors.paymentProof && <span className="error">{errors.paymentProof}</span>}
            </div>
          </div>

          {/* Submit Button */}
          <div className="payment-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? (isResubmission ? 'Resubmitting...' : 'Submitting...') : (isResubmission ? 'Resubmit Payment' : 'Submit Payment')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;