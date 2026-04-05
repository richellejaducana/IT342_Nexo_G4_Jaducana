import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/CreateEvent.css";
import "../css/AdminDashboard.css";
import { supabase } from "../utils/supabaseClient";
const timeZones = [
  "UTC",
  "GMT",
  "GMT+1",
  "GMT+2",
  "GMT+3",
  "GMT+8",
  "EST (GMT-5)",
  "PST (GMT-8)",
  "Asia/Manila",
  "Asia/Shanghai"
];

const CreateEvent = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    if (!path) return;
    navigate(path);
  };
  const [form, setForm] = useState({
    eventName: "",
    locationName: "",
    address: "",
    city: "",
    date: "",
    startTime: "",
    endTime: "",
    timeZone: "UTC",
    description: ""
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [imageFile, setImageFile] = useState(null);
const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };
  const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }
};

  const validate = () => {
    const newErrors = {};
    if (!form.eventName.trim()) newErrors.eventName = "Event name is required";
    if (!form.locationName.trim()) newErrors.locationName = "Location name is required";
    if (!form.address.trim()) newErrors.address = "Address is required";
    if (!form.city.trim()) newErrors.city = "City is required";
    if (!form.date) newErrors.date = "Date is required";
    if (!form.startTime) newErrors.startTime = "Start time is required";
    if (!form.endTime) newErrors.endTime = "End time is required";
    if (!form.timeZone) newErrors.timeZone = "Time zone is required";
    return newErrors;
  };

  const uploadImageToSupabase = async () => {
  if (!imageFile) return null;

  const fileName = `${Date.now()}-${imageFile.name}`;

  const { data, error } = await supabase.storage
    .from("event-images") // your bucket name
    .upload(fileName, imageFile);

  if (error) {
    console.error("Upload error:", error);
    throw new Error("Image upload failed");
  }

  const { data: publicUrlData } = supabase.storage
    .from("event-images")
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
};
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    const validation = validate();
    if (Object.keys(validation).length) {
      setErrors(validation);
      return;
    }

    setLoading(true);
    try {
     // Upload image FIRST
const imageUrl = await uploadImageToSupabase();

const payload = {
  ...form,
  imageUrl: imageUrl
};
console.log("SENDING DATA:", payload); // 👈 ADD THIS
const response = await fetch("http://localhost:8080/api/events", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload)
});
     

      if (!response.ok) {
  const text = await response.text();
  console.log("Backend error:", text);
  throw new Error(text || "Failed to create event");
}

      const data = await response.json();
      console.log("EVENT CREATED RESPONSE:", data);
      setSuccessMsg("Event created successfully.");
      setForm({
        eventName: "",
        locationName: "",
        address: "",
        city: "",
        date: "",
        startTime: "",
        endTime: "",
        timeZone: "UTC",
        description: ""
      });
    } catch (err) {
  console.error("FULL ERROR:", err);
  setErrors({ submit: err.message || "Submission failed" });
} finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard create-event-page">
      <aside className="sidebar">
        <div className="sidebar-top">
          <h2 className="app-title">Nexo Admin</h2>
        </div>

        <nav className="admin-nav">
          <button className={`nav-item`} onClick={() => handleNavigate('/admin-dashboard')}>Dashboard</button>
          <button className={`nav-item`} onClick={() => handleNavigate('/admin-profile')}>Admin Profile</button>
          <button className={`nav-item active`} onClick={() => handleNavigate('/create-event')}>Create Event</button>
          <button className={`nav-item`} onClick={() => handleNavigate('/manage-events')}>Manage Events</button>
          <button className={`nav-item`} onClick={() => handleNavigate('/users')}>Users</button>
        </nav>

        <div className="sidebar-bottom">
          <button className="logout-btn" onClick={() => { localStorage.clear(); handleNavigate('/login'); }}>Logout</button>
        </div>
      </aside>

      <main className="main-content">
        <header className="main-header">
          <h1 className="welcome">Create Event</h1>
        </header>

        <section className="cards-grid">
          <div className="profile-card">
            <div className="profile-card-header">
              <div className="avatar">E</div>
              <div>
                <h3 className="name">Event Creator</h3>
                <p className="role">Administrator Tools</p>
              </div>
            </div>

            <div className="profile-card-body">
              <div className="info-row">
                <span className="label">Tip</span>
                <span className="value">Fill required fields marked with errors</span>
              </div>
              <div className="info-row">
                <span className="label">Reminder</span>
                <span className="value">Events should have clear descriptions</span>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="create-event-card">
              <h2>Create Event</h2>
              <form onSubmit={handleSubmit} className="create-event-form">

          <label>Event Name</label>
          <input
            name="eventName"
            value={form.eventName}
            onChange={handleChange}
            placeholder="Event title"
          />
          {errors.eventName && <div className="error">{errors.eventName}</div>}

          <label>Location Name</label>
          <input
            name="locationName"
            value={form.locationName}
            onChange={handleChange}
            placeholder="Venue name"
          />
          {errors.locationName && <div className="error">{errors.locationName}</div>}

          <label>Address</label>
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="123 Main St"
          />
          {errors.address && <div className="error">{errors.address}</div>}

          <label>City</label>
          <input
            name="city"
            value={form.city}
            onChange={handleChange}
            placeholder="City name"
          />
          {errors.city && <div className="error">{errors.city}</div>}

          <div className="row">
            <div className="col">
              <label>Date</label>
              <input type="date" name="date" value={form.date} onChange={handleChange} />
              {errors.date && <div className="error">{errors.date}</div>}
            </div>

            <div className="col">
              <label>Start Time</label>
              <input type="time" name="startTime" value={form.startTime} onChange={handleChange} />
              {errors.startTime && <div className="error">{errors.startTime}</div>}
            </div>

            <div className="col">
              <label>End Time</label>
              <input type="time" name="endTime" value={form.endTime} onChange={handleChange} />
              {errors.endTime && <div className="error">{errors.endTime}</div>}
            </div>
          </div>

          <label>Time Zone</label>
          <select name="timeZone" value={form.timeZone} onChange={handleChange}>
            {timeZones.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </select>
          {errors.timeZone && <div className="error">{errors.timeZone}</div>}

          <label>Event Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            placeholder="Describe the event"
          />

          {errors.submit && <div className="error">{errors.submit}</div>}
          {successMsg && <div className="success">{successMsg}</div>}

   <label>Event Image</label>
<input type="file" accept="image/*" onChange={handleImageChange} />

{imagePreview && (
  <img
    src={imagePreview}
    alt="Preview"
    style={{ width: "200px", marginTop: "10px", borderRadius: "10px" }}
  />
)}
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Creating..." : "Create Event"}
          </button>
                        </form>
      </div>
    </div>
  </section>
</main>
</div>
  );
};

export default CreateEvent;
