import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    eventName: "",
    locationName: "",
    address: "",
    city: "",
    date: "",
    startTime: "",
    endTime: "",
    timeZone: "",
    description: "",
    imageUrl: ""
  });

  useEffect(() => {
    fetch(`http://localhost:8080/api/events/${id}`)
      .then(res => res.json())
      .then(data => setForm(data))
      .catch(err => console.error(err));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const response = await fetch(`http://localhost:8080/api/events/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    if (response.ok) {
      alert("Event updated!");
      navigate("/manage-events");
    } else {
      alert("Update failed");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Edit Event</h2>

      <form onSubmit={handleUpdate}>

        <input name="eventName" value={form.eventName} onChange={handleChange} placeholder="Event Name" />
        <input name="locationName" value={form.locationName} onChange={handleChange} placeholder="Location" />
        <input name="address" value={form.address} onChange={handleChange} placeholder="Address" />
        <input name="city" value={form.city} onChange={handleChange} placeholder="City" />

        <input type="date" name="date" value={form.date} onChange={handleChange} />
        <input type="time" name="startTime" value={form.startTime} onChange={handleChange} />
        <input type="time" name="endTime" value={form.endTime} onChange={handleChange} />

        <input name="timeZone" value={form.timeZone} onChange={handleChange} placeholder="Timezone" />

        <textarea name="description" value={form.description} onChange={handleChange} />

        <button type="submit">Update Event</button>
      </form>
    </div>
  );
};

export default EditEvent;