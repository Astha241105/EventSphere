import React, { useState, useEffect } from "react";
import "./Dashboard_for_host.css";

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
export const fillPct  = (e) => Math.round((e.registered / e.capacity) * 100);
export const convRate = (e) => ((e.registered / e.detailViews) * 100).toFixed(1);

const deriveStatus = (event) => {
  const now = new Date();
  if (event.eventEnd && new Date(event.eventEnd) < now) return "past";
  if (event.eventStart && new Date(event.eventStart) <= now) return "active";
  return "upcoming";
};

const normalise = (raw) => ({
  id:          raw._id,
  name:        raw.eventName,
  status:      deriveStatus(raw),
  apiStatus:   raw.status,
  date:        raw.eventStart
    ? new Date(raw.eventStart).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
      })
    : "TBD",
  location:    raw.city || raw.venueName || raw.venueAddress || (raw.mode === "online" ? "Online" : "TBD"),
  category:    raw.category,
  mode:        raw.mode,
  capacity:    raw.rooms?.reduce((acc, r) => acc + r.rows * r.cols, 0) || 0,
  registered:  0,
  detailViews: 0,
  revenue:     0,
  createdBy:   typeof raw.createdBy === "object" ? raw.createdBy?._id : raw.createdBy,
});

/* Read the current user's _id directly from the JWT in localStorage */
const getCurrentUserId = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload._id || payload.id || payload.userId || null;
  } catch {
    return null;
  }
};

/* ─────────────────────────────────────────
   EVENT CARD
───────────────────────────────────────── */
const EventCard = ({ event }) => {
  const fill = event.capacity > 0 ? fillPct(event) : 0;

  return (
    <div className="hd-event-card">
      <div className="hd-event-thumb">
        <span className={`hd-event-status-dot hd-event-status-dot--${event.status}`} />
        <div className="hd-event-thumb-inner">{event.category}</div>
      </div>

      <div className="hd-event-info">
        <div className="hd-event-name">{event.name}</div>
        <div className="hd-event-meta">
          <span>📅 {event.date}</span>
          <span>📍 {event.location}</span>
          <span className={`hd-api-status-badge hd-api-status-badge--${event.apiStatus}`}>
            {event.apiStatus}
          </span>
        </div>

        {event.capacity > 0 ? (
          <div className="hd-event-progress-row">
            <div className="hd-progress-bar hd-progress-bar--thin">
              <div className="hd-progress-fill" style={{ width: `${fill}%` }} />
            </div>
            <span className="hd-event-fill-lbl">
              {event.registered.toLocaleString()} / {event.capacity.toLocaleString()} seats
            </span>
          </div>
        ) : (
          <div className="hd-event-fill-lbl hd-no-seats">No seating configured</div>
        )}
      </div>

      <div className="hd-event-right">
        <div className="hd-event-revenue">
          {event.revenue > 0 ? `$${event.revenue.toLocaleString()}` : "—"}
        </div>
        <div className="hd-event-rev-label">revenue</div>
        <span className={`hd-status-pill hd-status-pill--${event.status}`}>{event.status}</span>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   SKELETON LOADER
───────────────────────────────────────── */
const SkeletonCard = () => (
  <div className="hd-event-card hd-skeleton-card">
    <div className="hd-event-thumb hd-skeleton-block" />
    <div className="hd-event-info" style={{ gap: 10 }}>
      <div className="hd-skeleton-block" style={{ width: "60%", height: 16 }} />
      <div className="hd-skeleton-block" style={{ width: "40%", height: 12 }} />
      <div className="hd-skeleton-block" style={{ width: "80%", height: 8 }} />
    </div>
    <div className="hd-event-right" style={{ gap: 8 }}>
      <div className="hd-skeleton-block" style={{ width: 60, height: 20 }} />
      <div className="hd-skeleton-block" style={{ width: 50, height: 12 }} />
    </div>
  </div>
);

/* ─────────────────────────────────────────
   MY EVENTS PAGE
───────────────────────────────────────── */
const TABS = ["all", "active", "upcoming", "past"];

const MyEvents = () => {
  const currentUserId = getCurrentUserId();

  const [allEvents,   setAllEvents]   = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [eventFilter, setEventFilter] = useState("all");

  useEffect(() => {
    const fetchHostEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("https://eventsphere-backend-he6w.onrender.com/api/events");
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const data = await res.json();

        const raw = Array.isArray(data) ? data : data.events ?? [];

        const hostEvents = raw
          .filter((e) => {
            const createdById =
              typeof e.createdBy === "object" ? e.createdBy?._id : e.createdBy;
            return createdById === currentUserId;
          })
          .map(normalise);

        setAllEvents(hostEvents);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (currentUserId) {
      fetchHostEvents();
    } else {
      setLoading(false);
      setError("Not logged in. Please log in to view your events.");
    }
  }, [currentUserId]);

  const filtered =
    eventFilter === "all"
      ? allEvents
      : allEvents.filter((e) => e.status === eventFilter);

  const tabCount = (tab) =>
    tab === "all"
      ? allEvents.length
      : allEvents.filter((e) => e.status === tab).length;

  return (
    <div className="myEvents-container">
      <div className="hd-section-header">
        <h2 className="hd-section-title">My Events</h2>
        <p className="hd-section-sub">Manage all your events across every stage.</p>
      </div>

      <div className="hd-filter-tabs">
        {TABS.map((t) => (
          <button
            key={t}
            className={`hd-filter-tab ${eventFilter === t ? "hd-filter-tab--active" : ""}`}
            onClick={() => setEventFilter(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
            <span className="hd-filter-count">{tabCount(t)}</span>
          </button>
        ))}
      </div>

      {loading && (
        <div className="hd-event-list">
          {[1, 2, 3].map((n) => <SkeletonCard key={n} />)}
        </div>
      )}

      {!loading && error && (
        <div className="hd-state-box hd-state-box--error">
          <span className="hd-state-icon">⚠️</span>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="hd-state-box">
          <span className="hd-state-icon">📭</span>
          <p>
            {eventFilter === "all"
              ? "You haven't created any events yet."
              : `No ${eventFilter} events found.`}
          </p>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="hd-event-list">
          {filtered.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyEvents;