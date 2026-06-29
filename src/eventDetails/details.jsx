import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./details.css";

const TABS = ["Overview", "Details"];

function CheckIcon() {
  return (
    <svg viewBox="0 0 10 10" fill="none" width="10" height="10">
      <path
        d="M2 5l2 2 4-4"
        stroke="#0057ff"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M9 15.5s-7-4.5-7-9a4 4 0 018 0 4 4 0 018 0c0 4.5-7 9-7 9z"
        stroke="#888"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg className="meta-icon" viewBox="0 0 16 16" fill="none">
      <rect
        x="2"
        y="3"
        width="12"
        height="11"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M5 2v2M11 2v2M2 7h12"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg className="meta-icon" viewBox="0 0 16 16" fill="none">
      <path
        d="M8 1.5C5.79 1.5 4 3.29 4 5.5c0 3.25 4 9 4 9s4-5.75 4-9c0-2.21-1.79-4-4-4z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <circle
        cx="8"
        cy="5.5"
        r="1.5"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );
}

function CardIcon() {
  return (
    <svg className="meta-icon" viewBox="0 0 16 16" fill="none">
      <rect
        x="1.5"
        y="3.5"
        width="13"
        height="9"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M1.5 6.5h13"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );
}

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/events/${id}`
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setEvent(data.event);
      }
    } catch (error) {
      console.error("Error fetching event:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "To Be Announced";

    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const handleRegister = () => {
    if (event.category === "Seminar") {
      navigate(`/seat-allocation/${event._id}`);
    } else if (event.category === "Hackathon") {
      navigate(`/event/${event._id}/team`);
    } else {
      navigate(`/register/${event._id}`);
    }
  };

  if (loading) {
    return <div className="page">Loading...</div>;
  }

  if (!event) {
    return <div className="page">Event not found.</div>;
  }

  return (
    <div className="page">
      {/* HERO */}
      <div
        className="hero2"
        style={{
          backgroundImage: `url(http://localhost:5000${event.coverImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="hero-overlay" />

        <span className="hero-badge">
          {event.category}
        </span>

        <button
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        <div className="hero-content">
          <h1 className="hero-title">
            {event.eventName}
          </h1>

          <p className="hero-subtitle">
            {event.tagline}
          </p>

          <div className="hero-meta">
            <div className="meta-item">
              <CalendarIcon />
              {formatDate(event.eventStart)}
            </div>

            <div className="meta-item">
              <PinIcon />
              {event.mode === "online"
                ? "Online"
                : event.mode === "hybrid"
                ? "Hybrid"
                : `${event.venueName || ""} ${
                    event.city || ""
                  }`}
            </div>

            <div className="meta-item">
              <CardIcon />
              {event.mode}
            </div>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="stats-row">
        <div className="stat-cell">
          <div className="stat-label">
            Team Size
          </div>

          <div className="stat-value">
            {event.minTeamSize} - {event.maxTeamSize}
          </div>
        </div>

        <div className="stat-cell">
          <div className="stat-label">
            Registration Opens
          </div>

          <div className="stat-value">
            {formatDate(event.registrationOpen)}
          </div>
        </div>

        <div className="stat-cell">
          <div className="stat-label">
            Status
          </div>

          <div className="stat-value">
            {event.status}
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="nav-tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`nav-tab ${
              activeTab === tab ? "active" : ""
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === "Overview" && (
        <>
          <div className="section">
            <h2 className="section-title">
              About Event
            </h2>

            <div className="about-card">
              <p className="about-text">
                {event.description}
              </p>
            </div>
          </div>

          <div className="section section-gap">
            <h2 className="section-title">
              Eligibility
            </h2>

            <div className="req-card">
              {event.eligibleFor?.length > 0 ? (
                event.eligibleFor.map((item, index) => (
                  <div
                    className="req-item"
                    key={index}
                  >
                    <div className="req-check">
                      <CheckIcon />
                    </div>

                    <p className="req-text">
                      {item}
                    </p>
                  </div>
                ))
              ) : (
                <p className="req-text">
                  Open for everyone
                </p>
              )}
            </div>
          </div>
        </>
      )}

      {/* DETAILS TAB */}
      {activeTab === "Details" && (
        <div className="section">
          <h2 className="section-title">
            Event Details
          </h2>

          <div className="about-card">
            <p>
              <strong>Category:</strong>{" "}
              {event.category}
            </p>

            <p>
              <strong>Mode:</strong> {event.mode}
            </p>

            <p>
              <strong>Open To:</strong>{" "}
              {event.openTo}
            </p>

            <p>
              <strong>Skills:</strong>{" "}
              {event.skills || "Not specified"}
            </p>

            <p>
              <strong>Prize Pool:</strong>{" "}
              {event.totalPool || "N/A"}
            </p>

            <p>
              <strong>Venue:</strong>{" "}
              {event.venueName || "N/A"}
            </p>

            <p>
              <strong>Address:</strong>{" "}
              {event.venueAddress || "N/A"}
            </p>

            <p>
              <strong>Registration Closes:</strong>{" "}
              {formatDate(event.registrationClose)}
            </p>
          </div>
        </div>
      )}

      <div className="bottom-spacer" />

      {/* BOTTOM BAR */}
      <div className="bottom-bar">
        <button
          className={`save-btn ${
            saved ? "saved" : ""
          }`}
          onClick={() => setSaved(!saved)}
        >
          <HeartIcon />
        </button>

        <button
          className="register-btn"
          onClick={handleRegister}
        >
          Register Now →
        </button>
      </div>
    </div>
  );
}