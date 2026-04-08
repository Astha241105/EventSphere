import React, { useEffect, useState } from "react";
import "./profile.css";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);
  const [favourites, setFavourites] = useState([]);

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    fetchProfile();
    fetchUpcoming();
    fetchPast();
    fetchFavourites();
  }, []);

  const fetchProfile = async () => {
    const res = await fetch("http://localhost:5000/api/profile", {
      headers,
    });
    const data = await res.json();
    setProfile(data);
  };

  const fetchUpcoming = async () => {
    const res = await fetch("http://localhost:5000/api/profile/upcoming", {
      headers,
    });
    const data = await res.json();
    setUpcoming(data);
  };

  const fetchPast = async () => {
    const res = await fetch("http://localhost:5000/api/profile/past", {
      headers,
    });
    const data = await res.json();
    setPast(data);
  };

  const fetchFavourites = async () => {
    const res = await fetch("http://localhost:5000/api/profile/favourites", {
      headers,
    });
    const data = await res.json();
    setFavourites(data);
  };

  if (!profile) return <h2>Loading...</h2>;

  return (
    <div className="dashboard-container">

      {/* Header */}
      <div className="topbar">
        <span className="back">← Profile</span>
        <span className="settings">⚙</span>
      </div>

      {/* Profile Banner */}
      <div className="profile-banner">
        <div className="profile-left">
          <img
            src="https://i.pravatar.cc/150"
            alt="profile"
            className="avatar"
          />

          <div>
            <p className="verified">VERIFIED PROFESSIONAL</p>
            <h2>{profile.name}</h2>
            <p className="role">{profile.role}</p>
            <p className="location">{profile.email}</p>
          </div>
        </div>

        <button className="edit-btn">Edit Profile</button>
      </div>

      {/* Stats (basic example) */}
      <div className="stats-row">
        <div className="stat-box">
          <h3>{past.length}</h3>
          <p>Events Attended</p>
        </div>
        <div className="stat-box">
          <h3>{upcoming.length}</h3>
          <p>Upcoming Events</p>
        </div>
        <div className="stat-box">
          <h3>{favourites.length}</h3>
          <p>Favourites</p>
        </div>
      </div>

      {/* 🔥 THREE SECTIONS */}
      <div className="grid-section">

        {/* Upcoming */}
        <div className="section-card">
          <div className="section-header">
            <h3>Upcoming Events</h3>
          </div>

          {upcoming.length === 0 ? (
            <p>No upcoming events</p>
          ) : (
            upcoming.map((event) => (
              <div className="event-card" key={event._id}>
                <div className="date-box">
                  <p>{new Date(event.date).toLocaleString("default", { month: "short" })}</p>
                  <h4>{new Date(event.date).getDate()}</h4>
                </div>
                <div>
                  <h4>{event.title}</h4>
                  <p>{event.location}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Past */}
        <div className="section-card">
          <div className="section-header">
            <h3>Past Events</h3>
          </div>

          {past.length === 0 ? (
            <p>No past events</p>
          ) : (
            past.map((event) => (
              <div className="list-item" key={event._id}>
                <span className="dot"></span>
                <div>
                  <h4>{event.title}</h4>
                  <p>{new Date(event.date).toDateString()}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Favourite */}
        <div className="section-card">
          <div className="section-header">
            <h3>Favourite Events</h3>
          </div>

          {favourites.length === 0 ? (
            <p>No favourites</p>
          ) : (
            favourites.map((event) => (
              <div className="fav-card" key={event._id}>
                <h4>{event.title}</h4>
                <p>{event.location}</p>
                <span className="fav">❤️</span>
              </div>
            ))
          )}
        </div>

      </div>

    </div>
  );
};

export default Profile;