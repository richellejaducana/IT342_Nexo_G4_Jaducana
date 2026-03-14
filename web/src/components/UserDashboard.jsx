import React from "react";
import "../css/UserDashboard.css";
import DashboardHeader from "./header/DashboardHeader.jsx";
const events = [
  {
    id: 1,
    title: "Tech Innovators Meetup",
    date: "MAR 20",
    location: "Cebu IT Park",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865"
  },
  {
    id: 2,
    title: "Startup Networking Night",
    date: "APR 02",
    location: "Ayala Center Cebu",
    category: "Business",
    image: "https://images.unsplash.com/photo-1551818255-e6e10975bc17"
  },
  {
    id: 3,
    title: "Cebu Music Festival",
    date: "MAY 15",
    location: "SM Seaside Arena",
    category: "Music",
    image: "https://images.unsplash.com/photo-1506157786151-b8491531f063"
  },
  {
    id: 4,
    title: "React Development Workshop",
    date: "JUN 10",
    location: "CIT University",
    category: "Workshop",
    image: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f"
  },
  {
    id: 5,
    title: "Photography Masterclass",
    date: "JUL 05",
    location: "Cebu Business Park",
    category: "Art",
    image: "https://i.pinimg.com/736x/5f/88/af/5f88affad8bb9a947ac9f66fb5334c3f.jpg"
  },
  {
    id: 6,
    title: "Fitness Bootcamp",
    date: "AUG 12",
    location: "Cebu City Sports Center",
    category: "Sports",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438"
  }
];

const Dashboard = () => {
  return (
    <div className="dashboard">
        <DashboardHeader />
      


      {/* HERO SEARCH SECTION */}
      <section className="hero">
        <h1>Discover Events in Cebu</h1>
        <p>Find workshops, music festivals, tech events and more.</p>

        <div className="hero-search">
          <input placeholder="Search events..." />
          <button>Search</button>
        </div>
      </section>


      {/* CATEGORY FILTER */}
      <section className="categories">
        <button>All</button>
        <button>Business</button>
        <button>Technology</button>
        <button>Music</button>
        <button>Workshop</button>
        <button>Sports</button>
        <button>Art</button>
      </section>


      {/* EVENTS */}
      <section className="events-section">

        <div className="section-header">
          <h2>Upcoming Events</h2>
          <span>View All</span>
        </div>

        <div className="events-grid">

          {events.map((event) => (
            <div key={event.id} className="event-card">

              <div className="event-image">
                <img src={event.image} alt={event.title}/>
                <span className="event-date">{event.date}</span>
              </div>

              <div className="event-details">

                <span className="event-category">{event.category}</span>

                <h3>{event.title}</h3>

                <p className="event-location">{event.location}</p>

                <button className="view-btn">View Event</button>

              </div>

            </div>
          ))}

        </div>

      </section>

    </div>
  );
};

export default Dashboard;