import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./teamPage.css";

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
const getToken  = ()  => localStorage.getItem("token");
const getUserId = ()  => {
  try {
    const payload = JSON.parse(atob(getToken().split(".")[1]));
    return payload._id || payload.id || payload.userId || null;
  } catch { return null; }
};
const initials = (name = "") =>
  name.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");

const authFetch = (url, opts = {}) =>
  fetch(url, {
    ...opts,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}`, ...opts.headers },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });

/* ─────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────── */

/* Team card shown in "Browse Teams" tab */
const TeamCard = ({ team, currentUserId, onRequest, onWithdraw, requesting }) => {
  const isFull      = team.memberCount >= team.maxSize;
  const isMyTeam    = team.isMyTeam;
  const hasRequested = team.hasRequested;
  const pct         = Math.round((team.memberCount / team.maxSize) * 100);

  let badge, btn;
  if (isMyTeam) {
    badge = <span className="tp-badge tp-badge--my">Your Team</span>;
    btn   = null;
  } else if (!team.isOpen || isFull) {
    badge = <span className={`tp-badge ${isFull ? "tp-badge--full" : "tp-badge--closed"}`}>{isFull ? "Full" : "Closed"}</span>;
    btn   = <button className="tp-btn tp-btn--ghost" disabled>{isFull ? "Full" : "Closed"}</button>;
  } else if (hasRequested) {
    badge = <span className="tp-badge tp-badge--open">Open</span>;
    btn   = <button className="tp-btn tp-btn--requested" onClick={() => onWithdraw(team._id)}>Requested ✓</button>;
  } else {
    badge = <span className="tp-badge tp-badge--open">Open</span>;
    btn   = <button className="tp-btn tp-btn--primary" onClick={() => onRequest(team._id)} disabled={requesting === team._id}>{requesting === team._id ? "Sending…" : "Request to Join"}</button>;
  }

  return (
    <div className="tp-card">
      <div className="tp-card-header">
        <div>
          <div className="tp-card-name">{team.name}</div>
          <div className="tp-card-meta">Led by {team.leader?.name}</div>
        </div>
        {badge}
      </div>

      <div className="tp-avatars">
        {team.members.map((m, i) => (
          <div
            key={m._id}
            className={`tp-avatar ${m._id === team.leader?._id ? "tp-avatar--leader" : ""}`}
            title={m.name}
          >
            {initials(m.name)}
          </div>
        ))}
      </div>

      <div className="tp-capacity-row">
        <div className="tp-capacity-bar">
          <div className={`tp-capacity-fill ${isFull ? "tp-capacity-fill--full" : ""}`} style={{ width: `${pct}%` }} />
        </div>
        <span className="tp-capacity-lbl">{team.memberCount} / {team.maxSize}</span>
      </div>

      {btn}
    </div>
  );
};

/* My team panel */
const MyTeamPanel = ({ team, requests, isLeader, onToggleOpen, onHandleRequest, onUpdateName }) => {
  const [editingName, setEditingName] = useState(false);
  const [nameVal,     setNameVal]     = useState(team.name);

  const saveName = async () => {
    if (nameVal.trim() && nameVal !== team.name) await onUpdateName(nameVal.trim());
    setEditingName(false);
  };

  const pendingReqs = requests.filter((r) => r.status === "pending");

  return (
    <div className="tp-my-team">
      <div className="tp-my-team-header">
        <div>
          {editingName ? (
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input className="tp-input" value={nameVal} onChange={(e) => setNameVal(e.target.value)} style={{ width: 200 }} />
              <button className="tp-btn tp-btn--primary" onClick={saveName}>Save</button>
              <button className="tp-btn tp-btn--ghost" onClick={() => setEditingName(false)}>Cancel</button>
            </div>
          ) : (
            <div className="tp-my-team-title">
              {team.name}
              {isLeader && (
                <button className="tp-btn tp-btn--ghost" style={{ marginLeft: 10, padding: "4px 10px", fontSize: 12 }} onClick={() => setEditingName(true)}>✏️ Rename</button>
              )}
            </div>
          )}
          <div className="tp-my-team-sub">{team.members.length} / {team.maxSize} members</div>
        </div>
        {isLeader && (
          <div className="tp-toggle-row" style={{ gap: 10 }}>
            <span className="tp-toggle-label">{team.isOpen ? "Accepting requests" : "Closed"}</span>
            <label className="tp-toggle">
              <input type="checkbox" checked={team.isOpen} onChange={(e) => onToggleOpen(e.target.checked)} />
              <span className="tp-toggle-slider" />
            </label>
          </div>
        )}
      </div>

      {/* Members */}
      <div className="tp-section-title">Members</div>
      {team.members.map((m) => (
        <div key={m._id} className="tp-member-row">
          <div className={`tp-avatar ${m._id === team.leader?._id ? "tp-avatar--leader" : ""}`}>{initials(m.name)}</div>
          <div style={{ flex: 1 }}>
            <div className="tp-member-name">{m.name} {m._id === team.leader?._id && "👑"}</div>
            <div className="tp-member-email">{m.email}</div>
          </div>
        </div>
      ))}

      {/* Requests — leader sees all, others see their own */}
      {requests.length > 0 && (
        <>
          <div className="tp-section-title" style={{ marginTop: 20 }}>
            Join Requests {isLeader && pendingReqs.length > 0 && `(${pendingReqs.length} pending)`}
          </div>
          {requests.map((r) => (
            <div key={r._id} className="tp-request-row">
              <div className="tp-avatar">{initials(r.from?.name)}</div>
              <div className="tp-request-info">
                <div className="tp-request-name">{r.from?.name}</div>
                <div className="tp-request-email">{r.from?.email}</div>
              </div>
              {isLeader && r.status === "pending" ? (
                <div className="tp-request-actions">
                  <button className="tp-btn tp-btn--accept" onClick={() => onHandleRequest(r._id, "accepted")}>Accept</button>
                  <button className="tp-btn tp-btn--reject" onClick={() => onHandleRequest(r._id, "rejected")}>Reject</button>
                </div>
              ) : (
                <span className={`tp-status-pill tp-status-pill--${r.status}`}>{r.status}</span>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
const TABS = ["My Team", "Browse Teams", "Looking for Team"];

const TeamPage = () => {
  const { eventId } = useParams();
  const navigate    = useNavigate();
  const currentUserId = getUserId();

  const [tab,         setTab]         = useState("Browse Teams");
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);

  // Data
  const [teams,       setTeams]       = useState([]);
  const [myTeam,      setMyTeam]      = useState(null);   // { team, requests, isLeader }
  const [pool,        setPool]        = useState([]);
  const [inPool,      setInPool]      = useState(false);
  const [eventName,   setEventName]   = useState("Hackathon Event");

  // UI state
  const [requesting,  setRequesting]  = useState(null);  // teamId being requested
  const [createName,  setCreateName]  = useState("");
  const [creating,    setCreating]    = useState(false);
  const [showCreate,  setShowCreate]  = useState(false);

  /* ── Loaders ── */
  const loadTeams = useCallback(async () => {
    const res  = await authFetch(`/api/teams/event/${eventId}`);
    const data = await res.json();
    setTeams(data.teams ?? []);
  }, [eventId]);

  const loadMyTeam = useCallback(async () => {
    // Find if user is in any team for this event
    const res  = await authFetch(`/api/teams/event/${eventId}`);
    const data = await res.json();
    const mine = (data.teams ?? []).find((t) => t.isMyTeam);
    if (mine) {
      const detailRes  = await authFetch(`/api/teams/${mine._id}`);
      const detailData = await detailRes.json();
      setMyTeam(detailData);
    } else {
      setMyTeam(null);
    }
  }, [eventId]);

  const loadPool = useCallback(async () => {
    const res  = await authFetch(`/api/teams/pool/${eventId}`);
    const data = await res.json();
    const members = data.pool ?? [];
    setPool(members);
    setInPool(members.some((p) => p.userId?.toString() === currentUserId));
  }, [eventId, currentUserId]);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch event name
      const evRes  = await fetch(`/api/events/${eventId}`);
      const evData = await evRes.json();
      setEventName(evData.event?.eventName || evData.eventName || "Hackathon Event");

      await Promise.all([loadTeams(), loadMyTeam(), loadPool()]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [eventId, loadTeams, loadMyTeam, loadPool]);

  useEffect(() => { loadAll(); }, [loadAll]);

  // Auto-switch to My Team tab if user is in a team
  useEffect(() => {
    if (myTeam) setTab("My Team");
  }, [myTeam]);

  /* ── Actions ── */
  const handleCreateTeam = async () => {
    if (!createName.trim()) return;
    setCreating(true);
    try {
      const res  = await authFetch("/api/teams", { method: "POST", body: { eventId, name: createName.trim() } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      await loadAll();
      setShowCreate(false);
      setCreateName("");
      setTab("My Team");
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleRequest = async (teamId) => {
    setRequesting(teamId);
    try {
      const res  = await authFetch(`/api/teams/${teamId}/request`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      await loadTeams();
    } catch (err) {
      setError(err.message);
    } finally {
      setRequesting(null);
    }
  };

  const handleWithdraw = async (teamId) => {
    const team    = teams.find((t) => t._id === teamId);
    const request = await authFetch(`/api/teams/${teamId}`);
    const data    = await request.json();
    const myReq   = data.requests?.find((r) => r.from?._id === currentUserId || r.from === currentUserId);
    if (!myReq) return;
    await authFetch(`/api/teams/requests/${myReq._id}`, { method: "DELETE" });
    await loadTeams();
  };

  const handlePoolToggle = async () => {
    if (inPool) {
      await authFetch(`/api/teams/pool/${eventId}`, { method: "DELETE" });
    } else {
      await authFetch(`/api/teams/pool/${eventId}`, { method: "POST" });
    }
    await loadPool();
  };

  const handleToggleOpen = async (val) => {
    await authFetch(`/api/teams/${myTeam.team._id}`, { method: "PATCH", body: { isOpen: val } });
    await loadMyTeam();
  };

  const handleHandleRequest = async (requestId, action) => {
    await authFetch(`/api/teams/requests/${requestId}`, { method: "PATCH", body: { action } });
    await Promise.all([loadMyTeam(), loadTeams(), loadPool()]);
  };

  const handleUpdateName = async (name) => {
    await authFetch(`/api/teams/${myTeam.team._id}`, { method: "PATCH", body: { name } });
    await loadMyTeam();
  };

  /* ── Render ── */
  if (loading) {
    return (
      <div className="tp-wrapper">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[1, 2, 3].map((n) => (
            <div key={n} className="tp-skeleton" style={{ height: 120, borderRadius: 16 }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="tp-wrapper">
      {/* Header */}
      <div className="tp-header">
        <button className="tp-back-btn" onClick={() => navigate(`/event/${eventId}`)}>
          ← Back
        </button>
        <div className="tp-header-text">
          <h1>Teams — {eventName}</h1>
          <p>Create or join a team to participate in this hackathon.</p>
        </div>
      </div>

      {error && <div className="tp-error" style={{ marginBottom: 16 }}>⚠️ {error} <button className="tp-btn tp-btn--ghost" style={{ marginLeft: 10 }} onClick={() => setError(null)}>✕</button></div>}

      {/* Tabs */}
      <div className="tp-tabs">
        {TABS.map((t) => (
          <button key={t} className={`tp-tab ${tab === t ? "tp-tab--active" : ""}`} onClick={() => setTab(t)}>
            {t}
            {t === "Browse Teams"       && <span style={{ marginLeft: 6, opacity: 0.7 }}>({teams.length})</span>}
            {t === "Looking for Team"   && <span style={{ marginLeft: 6, opacity: 0.7 }}>({pool.length})</span>}
            {t === "My Team" && myTeam?.requests?.filter(r => r.status === "pending").length > 0 && (
              <span style={{ marginLeft: 6, background: "#ef4444", color: "#fff", borderRadius: "50%", padding: "1px 6px", fontSize: 10 }}>
                {myTeam.requests.filter(r => r.status === "pending").length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── MY TEAM ── */}
      {tab === "My Team" && (
        <>
          {myTeam ? (
            <MyTeamPanel
              team={myTeam.team}
              requests={myTeam.requests}
              isLeader={myTeam.isLeader}
              onToggleOpen={handleToggleOpen}
              onHandleRequest={handleHandleRequest}
              onUpdateName={handleUpdateName}
            />
          ) : (
            <div className="tp-empty">
              <span className="tp-empty-icon">👥</span>
              You're not in a team yet.
              <br /><br />
              <button className="tp-btn tp-btn--primary" onClick={() => { setTab("Browse Teams"); setShowCreate(true); }}>
                Create a Team
              </button>
              <span style={{ margin: "0 12px", color: "#ccc" }}>or</span>
              <button className="tp-btn tp-btn--outline" onClick={() => setTab("Browse Teams")}>
                Browse Teams
              </button>
            </div>
          )}
        </>
      )}

      {/* ── BROWSE TEAMS ── */}
      {tab === "Browse Teams" && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <div className="tp-section-title" style={{ margin: 0 }}>All Teams</div>
              <div className="tp-section-sub" style={{ margin: "4px 0 0" }}>Find a team and send a join request.</div>
            </div>
            {!myTeam && (
              <button className="tp-btn tp-btn--primary" onClick={() => setShowCreate(!showCreate)}>
                {showCreate ? "Cancel" : "+ Create Team"}
              </button>
            )}
          </div>

          {/* Create team form */}
          {showCreate && !myTeam && (
            <div className="tp-form-card" style={{ marginBottom: 20 }}>
              <h2>Create a New Team</h2>
              <p>You'll be the team leader and can accept or reject join requests.</p>
              <div className="tp-field">
                <label className="tp-label">Team Name</label>
                <input
                  className="tp-input"
                  placeholder="e.g. ByteBuilders"
                  value={createName}
                  onChange={(e) => setCreateName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreateTeam()}
                />
              </div>
              <button className="tp-btn tp-btn--primary" onClick={handleCreateTeam} disabled={creating || !createName.trim()}>
                {creating ? "Creating…" : "Create Team"}
              </button>
            </div>
          )}

          {teams.length === 0 ? (
            <div className="tp-empty">
              <span className="tp-empty-icon">🏗️</span>
              No teams yet. Be the first to create one!
            </div>
          ) : (
            <div className="tp-grid">
              {teams.map((t) => (
                <TeamCard
                  key={t._id}
                  team={t}
                  currentUserId={currentUserId}
                  onRequest={handleRequest}
                  onWithdraw={handleWithdraw}
                  requesting={requesting}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* ── LOOKING FOR TEAM (POOL) ── */}
      {tab === "Looking for Team" && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <div className="tp-section-title" style={{ margin: 0 }}>Looking for a Team</div>
              <div className="tp-section-sub" style={{ margin: "4px 0 0" }}>
                People in the pool can send join requests to any open team.
              </div>
            </div>
            {!myTeam && (
              <button
                className={`tp-btn ${inPool ? "tp-btn--danger" : "tp-btn--outline"}`}
                onClick={handlePoolToggle}
              >
                {inPool ? "Leave Pool" : "Join Pool"}
              </button>
            )}
          </div>

          {pool.length === 0 ? (
            <div className="tp-empty">
              <span className="tp-empty-icon">🔍</span>
              No one in the pool yet.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {pool.map((p) => (
                <div key={p.userId} className="tp-pool-card">
                  <div className="tp-avatar">{initials(p.name)}</div>
                  <div className="tp-pool-info">
                    <div className="tp-pool-name">{p.name} {p.userId === currentUserId && "(You)"}</div>
                    <div className="tp-pool-email">{p.email}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TeamPage;