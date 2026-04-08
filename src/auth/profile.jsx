import React from "react";
import "./profile.css";

const Profile = () => {
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
            src="https://i.pravatar.cc/150?img=5"
            alt="profile"
            className="avatar"
          />

          <div>
            <p className="verified">VERIFIED PROFESSIONAL</p>
            <h2>Alex Rivera</h2>
            <p className="role">Full Stack Developer & Technical Architect</p>
            <p className="location">📍 San Francisco, CA</p>
          </div>
        </div>

        <button className="edit-btn">Edit Profile</button>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-box">
          <h3>24</h3>
          <p>Events Attended</p>
        </div>
        <div className="stat-box">
          <h3>12</h3>
          <p>Events Hosted</p>
        </div>
        <div className="stat-box">
          <h3>5</h3>
          <p>Years Active</p>
        </div>
      </div>

      {/* 🔥 THREE SECTIONS */}
      <div className="grid-section">

        {/* Upcoming Events */}
        <div className="section-card">
          <div className="section-header">
            <h3>Upcoming Events</h3>
            <span>See All</span>
          </div>

          <div className="event-card">
            <div className="date-box">
              <p>NOV</p>
              <h4>12</h4>
            </div>
            <div>
              <span className="badge">SPEAKER</span>
              <h4>Global AI Summit 2024</h4>
              <p>Moscone Center, SF</p>
            </div>
          </div>

          <div className="event-card">
            <div className="date-box">
              <p>DEC</p>
              <h4>05</h4>
            </div>
            <div>
              <span className="badge gray">ATTENDEE</span>
              <h4>Hack the Future III</h4>
              <p>Virtual Event</p>
            </div>
          </div>
        </div>

        {/* Past Events */}
        <div className="section-card">
          <div className="section-header">
            <h3>Past Events</h3>
            <span>Archive</span>
          </div>

          <div className="list-item">
            <span className="dot"></span>
            <div>
              <h4>React Universe 2023</h4>
              <p>Host • Oct 2023</p>
            </div>
          </div>

          <div className="list-item">
            <span className="dot"></span>
            <div>
              <h4>Web3 Builders Forum</h4>
              <p>Attendee • Sep 2023</p>
            </div>
          </div>

          <div className="list-item">
            <span className="dot"></span>
            <div>
              <h4>NodeConf 2023</h4>
              <p>Speaker • Aug 2023</p>
            </div>
          </div>
        </div>

        {/* ⭐ Favourite Events */}
        <div className="section-card">
          <div className="section-header">
            <h3>Favourite Events</h3>
            <span>View All</span>
          </div>

          <div className="fav-card">
            <h4>Design Systems Summit</h4>
            <p>UI/UX • 2024</p>
            <span className="fav">❤️</span>
          </div>

          <div className="fav-card">
            <h4>AI Innovation Expo</h4>
            <p>Artificial Intelligence</p>
            <span className="fav">❤️</span>
          </div>

          <div className="fav-card">
            <h4>Frontend Masters Meetup</h4>
            <p>React & JS</p>
            <span className="fav">❤️</span>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Profile;