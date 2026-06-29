import React, { useState, useEffect, useMemo } from "react";
import "./Dashboard_for_host.css";

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
const getToken = () => localStorage.getItem("token");

const getInitials = (name = "") =>
  name.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");

const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
      })
    : "—";

/* ─────────────────────────────────────────
   SKELETON ROW
───────────────────────────────────────── */
const SkeletonRow = () => (
  <tr>
    {[140, 180, 90, 100, 70].map((w, i) => (
      <td key={i}>
        <div className="hd-skeleton-block" style={{ width: w, height: 14, borderRadius: 4 }} />
      </td>
    ))}
  </tr>
);

/* ─────────────────────────────────────────
   ATTENDEES PAGE
───────────────────────────────────────── */
const Attendees = () => {
  const token = getToken();

  // All events + their attendees loaded in one shot from /host
  const [hostData,    setHostData]    = useState([]);   // array of { eventId, eventName, attendees, ... }
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);

  // Which event pill is selected
  const [selectedId,  setSelectedId]  = useState(null);

  // Per-event attendee fetch when switching (lazy — only if not already loaded)
  const [switching,   setSwitching]   = useState(false);

  const [search, setSearch] = useState("");

  /* ── 1. On mount: load all host events + their attendees ── */
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("http://localhost:5000/api/registrations/host", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const data = await res.json();
        const events = data.events ?? [];
        setHostData(events);
        if (events.length > 0) setSelectedId(events[0].eventId.toString());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchAll();
    else {
      setLoading(false);
      setError("Not logged in. Please log in to view attendees.");
    }
  }, [token]);

  /* ── 2. On pill switch: fetch fresh attendees for that event ── */
  const handleEventSwitch = async (eventId) => {
    setSelectedId(eventId);
    setSearch("");
    setSwitching(true);
    try {
      const res = await fetch(`http://localhost:5000/api/registrations/event/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();

      // Update just this event's attendees in hostData
      setHostData((prev) =>
        prev.map((e) =>
          e.eventId.toString() === eventId
            ? { ...e, attendees: data.attendees ?? [] }
            : e
        )
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setSwitching(false);
    }
  };

  /* ── Derived: selected event object ── */
  const selectedEvent = useMemo(
    () => hostData.find((e) => e.eventId.toString() === selectedId) ?? null,
    [hostData, selectedId]
  );

  /* ── Derived: filtered attendee list ── */
  const filtered = useMemo(() => {
    if (!selectedEvent) return [];
    return selectedEvent.attendees.filter(
      (a) =>
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [selectedEvent, search]);

  /* ── Render ── */
  return (
    <div className="myEvents-container">
      <div className="hd-section-header">
        <h2 className="hd-section-title">Attendees</h2>
        <p className="hd-section-sub">Browse registered participants by event.</p>
      </div>

      {/* ── Loading state ── */}
      {loading && (
        <div className="hd-analytics-selector">
          {[1, 2, 3].map((n) => (
            <div key={n} className="hd-skeleton-block"
              style={{ width: 110, height: 32, borderRadius: 20 }} />
          ))}
        </div>
      )}

      {/* ── Error state ── */}
      {!loading && error && (
        <div className="hd-state-box hd-state-box--error">
          <span className="hd-state-icon">⚠️</span>
          <p>{error}</p>
        </div>
      )}

      {/* ── Empty state ── */}
      {!loading && !error && hostData.length === 0 && (
        <div className="hd-state-box">
          <span className="hd-state-icon">📭</span>
          <p>You haven't created any events yet.</p>
        </div>
      )}

      {/* ── Main content ── */}
      {!loading && !error && hostData.length > 0 && (
        <>
          {/* Event selector pills */}
          <div className="hd-analytics-selector">
            {hostData.map((e) => (
              <button
                key={e.eventId}
                className={`hd-anal-pill ${
                  selectedId === e.eventId.toString() ? "hd-anal-pill--active" : ""
                }`}
                onClick={() => handleEventSwitch(e.eventId.toString())}
              >
                {e.eventName.split(" ").slice(0, 3).join(" ")}
                <span className="hd-filter-count">{e.attendees.length}</span>
              </button>
            ))}
          </div>

          {/* Attendees card */}
          <div className="hd-card" style={{ marginTop: 14 }}>
            <div className="hd-attendees-header">
              <div>
                <h3 className="hd-card-title">{selectedEvent?.eventName}</h3>
                <p className="hd-card-sub">
                  {switching
                    ? "Refreshing…"
                    : `${selectedEvent?.attendees.length ?? 0} registered`}
                </p>
              </div>
              <div className="hd-search">
                <span className="hd-search-icon">🔍</span>
                <input
                  className="hd-search-input"
                  placeholder="Search by name or email…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <table className="hd-table hd-attendees-table">
              <thead>
                <tr>
                  <th>Attendee</th>
                  <th>Email</th>
                  <th>Team</th>
                  <th>Registered On</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {switching
                  ? [1, 2, 3].map((n) => <SkeletonRow key={n} />)
                  : filtered.length > 0
                  ? filtered.map((a) => (
                      <tr key={a.registrationId}>
                        <td>
                          <div className="hd-att-name-cell">
                            <div className="hd-reg-avatar hd-reg-avatar--sm">
                              {getInitials(a.name)}
                            </div>
                            {a.name}
                          </div>
                        </td>
                        <td className="hd-muted-cell">{a.email}</td>
                        <td className="hd-muted-cell">
                          {a.teamName ? (
                            <span title={a.teamMembers?.join(", ")}>
                              {a.teamName}
                              {a.teamMembers?.length > 0 && (
                                <span className="hd-team-count">
                                  &nbsp;+{a.teamMembers.length}
                                </span>
                              )}
                            </span>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="hd-muted-cell">{formatDate(a.registeredAt)}</td>
                        <td>
                          <a href={`mailto:${a.email}`} className="hd-action-btn">
                            Message
                          </a>
                        </td>
                      </tr>
                    ))
                  : (
                    <tr>
                      <td colSpan={5} className="hd-empty-row">
                        {search
                          ? "No attendees match your search."
                          : "No registrations yet for this event."}
                      </td>
                    </tr>
                  )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Attendees;