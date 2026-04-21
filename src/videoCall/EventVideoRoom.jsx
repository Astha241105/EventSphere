// EventVideoRoom.jsx
// Place in: EVENTSPHERE/src/videoCall/EventVideoRoom.jsx
// This is the entry component - it checks if the event is live before showing the call

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import VideoCall from "./VideoCall";
import "./VideoCall.css";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export default function EventVideoRoom({ eventId, eventTitle }) {
  const navigate = useNavigate();

  // Get user info from localStorage (adjust keys to match your auth setup)
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName") || "Guest";

  const [status, setStatus] = useState(null); // null | { isActive, isUpcoming, isEnded, ... }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inCall, setInCall] = useState(false);
  const [countdown, setCountdown] = useState(null);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/video/room/${eventId}/status`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch room status");
      const data = await res.json();
      setStatus(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [eventId, token]);

  // Poll every 30s to keep status fresh
  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30_000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  // Countdown timer when upcoming
  useEffect(() => {
    if (!status?.isUpcoming || !status.minutesUntilStart) return;
    setCountdown(status.minutesUntilStart);
    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { fetchStatus(); return 0; }
        return c - 1;
      });
    }, 60_000);
    return () => clearInterval(interval);
  }, [status?.isUpcoming, status?.minutesUntilStart, fetchStatus]);

  const handleLeave = () => {
    setInCall(false);
    navigate(-1);
  };

  if (!token) {
    return (
      <div className="evc-gate">
        <div className="evc-card">
          <div className="evc-icon">🔒</div>
          <h2>Login Required</h2>
          <p>You need to be logged in to join this seminar.</p>
          <button className="evc-btn evc-btn--primary" onClick={() => navigate("/login")}>
            Log In
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="evc-gate">
        <div className="evc-card">
          <div className="evc-spinner" />
          <p>Checking room availability…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="evc-gate">
        <div className="evc-card">
          <div className="evc-icon">⚠️</div>
          <h2>Connection Error</h2>
          <p>{error}</p>
          <button className="evc-btn evc-btn--primary" onClick={fetchStatus}>Retry</button>
          <button className="evc-btn evc-btn--ghost" onClick={() => navigate(-1)}>Go Back</button>
        </div>
      </div>
    );
  }

  if (inCall) {
    return (
      <VideoCall
        eventId={eventId}
        eventTitle={eventTitle || status?.eventTitle || "Seminar"}
        userId={userId}
        userName={userName}
        token={token}
        onLeave={handleLeave}
      />
    );
  }

  // ── Lobby / Gate ──────────────────────────────────────────────────────────
  return (
    <div className="evc-gate">
      <div className="evc-card">
        <div className="evc-event-header">
          <span className="evc-event-tag">📡 Live Seminar</span>
          <h1 className="evc-event-title">{eventTitle || status?.eventTitle}</h1>
        </div>

        {status?.isActive && (
          <>
            <div className="evc-status evc-status--live">
              <span className="evc-live-dot" />
              Session is LIVE
            </div>
            <p className="evc-hint">Click below to join the seminar room with video & audio.</p>
            <button className="evc-btn evc-btn--join" onClick={() => setInCall(true)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
              </svg>
              Join Seminar Now
            </button>
          </>
        )}

        {status?.isUpcoming && (
          <>
            <div className="evc-status evc-status--upcoming">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/>
              </svg>
              Starts in {countdown ?? status.minutesUntilStart} min
            </div>
            <p className="evc-hint">
              The join button will activate automatically.
              Session starts at {new Date(status.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}.
            </p>
            <div className="evc-time-display">
              {new Date(status.startTime).toLocaleDateString(undefined, {
                weekday: "long", month: "long", day: "numeric"
              })}
              <br />
              <strong>{new Date(status.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</strong>
            </div>
          </>
        )}

        {status?.isEnded && (
          <>
            <div className="evc-status evc-status--ended">Session Ended</div>
            <p className="evc-hint">This seminar has concluded. Thank you for participating!</p>
            <button className="evc-btn evc-btn--ghost" onClick={() => navigate(-1)}>
              Back to Events
            </button>
          </>
        )}

        <div className="evc-prereqs">
          <span>📷 Camera</span>
          <span>🎙️ Microphone</span>
          <span>🌐 Stable internet</span>
        </div>
      </div>
    </div>
  );
}