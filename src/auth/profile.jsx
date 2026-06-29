import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./profile.css";

const BASE = "http://localhost:5000/api/profile";

const headers = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmtMonth = (iso) =>
  iso ? new Date(iso).toLocaleString("default", { month: "short" }) : "—";
const fmtDay   = (iso) => (iso ? new Date(iso).getDate() : "—");
const fmtDate  = (iso) =>
  iso ? new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";
const fmtTime  = (iso) =>
  iso ? new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) : "";
const fmtLocation = (event) => {
  if (event.mode === "online") return event.onlineLink ? "Online" : "Online";
  if (event.venueName && event.city) return `${event.venueName}, ${event.city}`;
  if (event.venueName) return event.venueName;
  if (event.city) return event.city;
  return "—";
};

// Time remaining until eventEnd (for ongoing events)
const timeLeft = (endIso) => {
  if (!endIso) return "";
  const diff = new Date(endIso) - Date.now();
  if (diff <= 0) return "Ending…";
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  return h > 0 ? `${h}h ${m}m left` : `${m}m left`;
};

const CATEGORY_COLORS = {
  Seminar:   { bg: "#e6f1fb", color: "#185fa5" },
  Hackathon: { bg: "#fff3e6", color: "#b05a00" },
  Webinar:   { bg: "#eaf9f3", color: "#0f6e56" },
  Quiz:      { bg: "#eeedfe", color: "#534ab7" },
};

const CategoryBadge = ({ category }) => {
  const c = CATEGORY_COLORS[category] || { bg: "#f0f0f0", color: "#555" };
  return (
    <span
      className="prof-badge"
      style={{ background: c.bg, color: c.color }}
    >
      {category}
    </span>
  );
};

// ── Profile page ──────────────────────────────────────────────────────────────
const Profile = () => {
  const navigate = useNavigate();
  const [profile,  setProfile]  = useState(null);
  const [upcoming, setUpcoming] = useState([]);
  const [past,     setPast]     = useState([]);
  const [ongoing,  setOngoing]  = useState([]);
  const [loading,  setLoading]  = useState(true);
   const isHost = localStorage.getItem("role") === "host";
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [profRes, upRes, pastRes, onRes] = await Promise.all([
          fetch(`${BASE}`,         { headers: headers() }),
          fetch(`${BASE}/upcoming`,{ headers: headers() }),
          fetch(`${BASE}/past`,    { headers: headers() }),
          fetch(`${BASE}/ongoing`, { headers: headers() }),
        ]);
        const [profData, upData, pastData, onData] = await Promise.all([
          profRes.json(), upRes.json(), pastRes.json(), onRes.json(),
        ]);
        setProfile(profData);
        setUpcoming(Array.isArray(upData)   ? upData   : []);
        setPast(    Array.isArray(pastData) ? pastData : []);
        setOngoing( Array.isArray(onData)   ? onData   : []);
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="profile-page">
        <div className="prof-loading">
          <div className="prof-spinner" />
          <p>Loading profile…</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-page">
        <div className="prof-loading">
          <p>Could not load profile. Please log in again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="dashboard-container">

        {/* ── Topbar ── */}
        <div className="topbar">
          <button className="back" onClick={() => navigate(-1)}>← Profile</button>
        </div>

        {/* ── Banner ── */}
        <div className="profile-banner">
          <div className="profile-left">
            <img
              src={
                profile.avatar
                  ? `http://localhost:5000${profile.avatar}`
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=185fa5&color=fff&size=150`
              }
              alt="avatar"
              className="avatar"
            />
            <div>
              <h2>{profile.name}</h2>
              <p className="role">{profile.role}</p>
              <p className="location">{profile.email}</p>
              {profile.organization && (
                <p className="location">🏢 {profile.organization}</p>
              )}
            </div>
          </div>
        </div>

        {/* ── Stats row ── */}
        <div className="stats-row">
          <div className="stat-box">
            <h3>{past.length}</h3>
            <p>{isHost ? "Events Organized" : "Events Attended"}</p>
          </div>
          <div className="stat-box">
            <h3>{upcoming.length}</h3>
            <p>Upcoming</p>
          </div>
          <div className="stat-box">
            <h3>{ongoing.length}</h3>
            <p>Live Now</p>
          </div>
        </div>

        {/* ── Three sections ── */}
        <div className="grid-section">

          {/* Upcoming */}
          <div className="section-card">
            <div className="section-header">
              <h3>Upcoming Events</h3>
              <span className="section-count">{upcoming.length}</span>
            </div>

            {upcoming.length === 0 ? (
              <div className="prof-empty">
                <span>📅</span>
                <p>No upcoming events</p>
              </div>
            ) : (
              upcoming.map((event) => (
                <div
                  className="event-card"
                  key={event._id}
                  onClick={() => navigate(`/event/${event._id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="date-box">
                    <p>{fmtMonth(event.eventStart)}</p>
<h4>{fmtDay(event.eventStart)}</h4>
                  </div>
                  <div className="event-card-body">
                    <h4>{event.eventName}</h4>
<p className="event-meta-line">📍 {fmtLocation(event)}</p>
<p className="event-meta-line">🕐 {fmtTime(event.eventStart)}</p>
<CategoryBadge category={event.category} />
{event.ticketId && (
  <p className="event-ticket">🎟 {event.ticketId}</p>
)}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Past */}
          <div className="section-card">
            <div className="section-header">
              <h3>Past Events</h3>
              <span className="section-count">{past.length}</span>
            </div>

            {past.length === 0 ? (
              <div className="prof-empty">
                <span>🕰</span>
                <p>No past events</p>
              </div>
            ) : (
              past.map((event) => (
                <div
                  className="list-item"
                  key={event._id}
                  onClick={() => navigate(`/event/${event._id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <span className={`dot${event.status === "cancelled" ? " dot--cancelled" : ""}`} />
                  <div className="list-item-body">
                    <h4>{event.eventName}</h4>
<p>{fmtDate(event.eventStart)}</p>
                    <CategoryBadge category={event.category} />
                    {event.status === "cancelled" && (
                      <span className="prof-cancelled-tag">Cancelled</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Ongoing */}
          <div className="section-card">
            <div className="section-header">
              <h3>Ongoing Events</h3>
              <span className="section-count section-count--live">{ongoing.length}</span>
            </div>

            {ongoing.length === 0 ? (
              <div className="prof-empty">
                <span>🎯</span>
                <p>No live events right now</p>
              </div>
            ) : (
              ongoing.map((event) => (
  <div
    className="fav-card fav-card--live"
    key={event._id}
    onClick={() => navigate(`/event/${event._id}`)}
    style={{ cursor: "pointer" }}
  >
    <div className="live-dot-wrap">
      <span className="live-dot" />
      <span className="live-label">LIVE</span>
    </div>
    <h4>{event.eventName}</h4>
    <p>{fmtLocation(event)}</p>
    <CategoryBadge category={event.category} />
    <p className="time-left">{timeLeft(event.eventEnd)}</p>

    {(event.category === "Webinar" || event.mode === "online") && (
      <button
        className="join-link"
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/event/${event._id}/room`);
        }}
      >
        {isHost ? "Start Video Call →" : "Join Now →"}
      </button>
    )}
  </div>
))
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;