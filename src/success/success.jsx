import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./success.css";

const CATEGORY_CONFIG = {
  Webinar: {
    icon: "💻",
    color: "#185fa5",
    lightBg: "#e6f1fb",
    border: "#b5d4f4",
    what: "You'll receive a joining link on your registered email before the event starts.",
    nextLabel: "Browse More Webinars",
    nextFilter: "Webinars",
  },
  Quiz: {
    icon: "❓",
    color: "#534ab7",
    lightBg: "#eeedfe",
    border: "#afa9ec",
    what: "Questions will be revealed when the quiz goes live. Stay tuned!",
    nextLabel: "Browse More Quizzes",
    nextFilter: "Quizzes",
  },
};

const RegistrationSuccess = () => {
  const { eventId }  = useParams();
  const navigate     = useNavigate();
  const [event, setEvent]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied]   = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const token = localStorage.getItem("token");
        const res   = await fetch(`https://eventsphere-backend-he6w.onrender.com/api/events/${eventId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();
        setEvent(data.event || data);
      } catch {
        // silently fail — we still show a generic success
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  const config  = CATEGORY_CONFIG[event?.category] || CATEGORY_CONFIG["Webinar"];
  const eventName = event?.eventName || "the event";
  const eventDate = event?.eventStart
    ? new Date(event.eventStart).toLocaleDateString("en-US", {
        weekday: "long", month: "long", day: "numeric", year: "numeric",
      })
    : null;
  const eventTime = event?.eventStart
    ? new Date(event.eventStart).toLocaleTimeString("en-US", {
        hour: "numeric", minute: "2-digit",
      })
    : null;

  const shareText = `I just registered for "${eventName}" on EventSphere! 🎉`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="rs-page">
        <div className="rs-spinner" />
      </div>
    );
  }

  return (
    <div className="rs-page">
      <div className="rs-card">

        {/* Animated checkmark */}
        <div className="rs-icon-wrap" style={{ background: config.lightBg, borderColor: config.border }}>
          <svg className="rs-check-svg" viewBox="0 0 52 52" aria-hidden="true">
            <circle
              className="rs-check-circle"
              cx="26" cy="26" r="25"
              fill="none"
              stroke={config.color}
              strokeWidth="2"
            />
            <path
              className="rs-check-tick"
              fill="none"
              stroke={config.color}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14 27l8 8 16-16"
            />
          </svg>
        </div>

        <p className="rs-eyebrow" style={{ color: config.color }}>
          {config.icon} Registration Confirmed
        </p>
        <h1 className="rs-title">You're all set!</h1>
        <p className="rs-subtitle">
          You have successfully registered for <strong>{eventName}</strong>.
        </p>

        {/* Event details pill row */}
        {event && (
          <div className="rs-details">
            {eventDate && (
              <div className="rs-detail-chip">
                <span className="rs-detail-icon">📅</span>
                <span>{eventDate}{eventTime && ` · ${eventTime}`}</span>
              </div>
            )}
            {event.category && (
              <div className="rs-detail-chip">
                <span className="rs-detail-icon">{config.icon}</span>
                <span>{event.category}</span>
              </div>
            )}
            {(event.venueName || event.city) && (
              <div className="rs-detail-chip">
                <span className="rs-detail-icon">📍</span>
                <span>{[event.venueName, event.city].filter(Boolean).join(", ")}</span>
              </div>
            )}
            {event.mode === "online" || event.mode === "hybrid" ? (
              <div className="rs-detail-chip">
                <span className="rs-detail-icon">🌐</span>
                <span>{event.mode === "hybrid" ? "Hybrid" : "Virtual Event"}</span>
              </div>
            ) : null}
          </div>
        )}

        {/* What happens next */}
        <div className="rs-next-box" style={{ background: config.lightBg, borderColor: config.border }}>
          <p className="rs-next-label">What happens next?</p>
          <p className="rs-next-text">{config.what}</p>
        </div>

        {/* CTA buttons */}
        <div className="rs-actions">
          <button
            className="rs-btn rs-btn--primary"
            style={{ background: config.color }}
            onClick={() => navigate(`/event/${eventId}`)}
          >
            View Event Details
          </button>
          <button
            className="rs-btn rs-btn--outline"
            style={{ color: config.color, borderColor: config.border }}
            onClick={() => navigate(`/events?filter=${config.nextFilter}`)}
          >
            {config.nextLabel}
          </button>
        </div>

        {/* Share strip */}
        <div className="rs-share">
          <p className="rs-share-label">Share with friends</p>
          <div className="rs-share-row">
            <span className="rs-share-text">"{eventName}"</span>
            <button
              className="rs-copy-btn"
              onClick={handleCopy}
              style={{ color: config.color, borderColor: config.border }}
            >
              {copied ? "✓ Copied!" : "Copy"}
            </button>
          </div>
        </div>

        {/* Back to home */}
        <button className="rs-home-link" onClick={() => navigate("/")}>
          ← Back to Home
        </button>
      </div>
    </div>
  );
};

export default RegistrationSuccess;