import React, { useState, useEffect } from "react";
import "./Dashboard_for_host.css";
import logo from "../assets/logo.svg";

/* ─────────────────────────────────────────
   MOCK DATA
───────────────────────────────────────── */
const ALL_EVENTS = [
  {
    id: 1,
    name: "Global SaaS Summit 2024",
    status: "active",
    date: "Oct 24, 2024",
    location: "San Francisco, CA",
    capacity: 8000,
    registered: 7360,
    detailViews: 18900,
    siteVisits: 42000,
    ticketPrice: 120,
    revenue: 68200,
    category: "Tech",
    attendees: [
      { name: "Marcus Chen",    email: "m.chen@email.com",    ticket: "VIP",      joined: "2M AGO",  avatar: "MC" },
      { name: "Sarah Jenkins",  email: "s.jenkins@email.com", ticket: "Standard", joined: "15M AGO", avatar: "SJ" },
      { name: "David Vark",     email: "d.vark@email.com",    ticket: "Standard", joined: "1H AGO",  avatar: "DV" },
      { name: "Elena Rodriguez",email: "e.rod@email.com",     ticket: "VIP",      joined: "3H AGO",  avatar: "ER" },
      { name: "Tom Nguyen",     email: "t.ng@email.com",      ticket: "Standard", joined: "5H AGO",  avatar: "TN" },
    ],
  },
  {
    id: 2,
    name: "DevConf Europe",
    status: "active",
    date: "Nov 10, 2024",
    location: "Berlin, Germany",
    capacity: 5000,
    registered: 3800,
    detailViews: 11200,
    siteVisits: 28000,
    ticketPrice: 80,
    revenue: 34100,
    category: "Dev",
    attendees: [
      { name: "Anna Schmidt",   email: "a.schmidt@email.com", ticket: "Standard", joined: "2H AGO",  avatar: "AS" },
      { name: "Luca Rossi",     email: "l.rossi@email.com",   ticket: "VIP",      joined: "4H AGO",  avatar: "LR" },
      { name: "Yuki Tanaka",    email: "y.tan@email.com",     ticket: "Standard", joined: "6H AGO",  avatar: "YT" },
    ],
  },
  {
    id: 3,
    name: "AI Expo Tokyo",
    status: "upcoming",
    date: "Dec 5, 2024",
    location: "Tokyo, Japan",
    capacity: 4000,
    registered: 2440,
    detailViews: 8700,
    siteVisits: 21000,
    ticketPrice: 95,
    revenue: 26130,
    category: "AI",
    attendees: [
      { name: "Kenji Watanabe", email: "k.wata@email.com",    ticket: "VIP",      joined: "1D AGO",  avatar: "KW" },
      { name: "Priya Patel",    email: "p.patel@email.com",   ticket: "Standard", joined: "2D AGO",  avatar: "PP" },
    ],
  },
  {
    id: 4,
    name: "Web3 Builder Conf",
    status: "upcoming",
    date: "Jan 15, 2025",
    location: "Dubai, UAE",
    capacity: 3000,
    registered: 870,
    detailViews: 5400,
    siteVisits: 16000,
    ticketPrice: 110,
    revenue: 9570,
    category: "Web3",
    attendees: [
      { name: "Omar Al-Farsi",  email: "o.farsi@email.com",   ticket: "Standard", joined: "3D AGO",  avatar: "OA" },
    ],
  },
  {
    id: 5,
    name: "ProductCon 2023",
    status: "past",
    date: "Aug 12, 2023",
    location: "New York, USA",
    capacity: 6000,
    registered: 5940,
    detailViews: 22000,
    siteVisits: 38000,
    ticketPrice: 75,
    revenue: 44550,
    category: "Product",
    attendees: [
      { name: "Chris Evans",    email: "c.ev@email.com",      ticket: "VIP",      joined: "—",       avatar: "CE" },
      { name: "Mia Thompson",   email: "m.th@email.com",      ticket: "Standard", joined: "—",       avatar: "MT" },
      { name: "James Park",     email: "j.park@email.com",    ticket: "Standard", joined: "—",       avatar: "JP" },
      { name: "Lisa Wang",      email: "l.wang@email.com",    ticket: "VIP",      joined: "—",       avatar: "LW" },
    ],
  },
  {
    id: 6,
    name: "Design Systems Summit",
    status: "past",
    date: "Jun 3, 2023",
    location: "London, UK",
    capacity: 2500,
    registered: 2380,
    detailViews: 9800,
    siteVisits: 19500,
    ticketPrice: 60,
    revenue: 14280,
    category: "Design",
    attendees: [
      { name: "Sophie Turner",  email: "s.tur@email.com",     ticket: "Standard", joined: "—",       avatar: "ST" },
      { name: "Ben Carter",     email: "b.car@email.com",     ticket: "Standard", joined: "—",       avatar: "BC" },
    ],
  },
];

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
const convRate = (e) => ((e.registered / e.detailViews) * 100).toFixed(1);
const engRate  = (e) => ((e.detailViews / e.siteVisits) * 100).toFixed(1);
const fillPct  = (e) => Math.round((e.registered / e.capacity) * 100);

function useCountUp(target, duration = 900) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const t = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(t); }
      else setVal(Math.floor(start));
    }, 16);
    return () => clearInterval(t);
  }, [target]);
  return val;
}

/* ─────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────── */

/* Metric Card */
const MetricCard = ({ label, value, change, positive, icon, color, small }) => (
  <div className={`hd-metric-card${small ? " hd-metric-card--sm" : ""}`} style={{ "--card-accent": color }}>
    <div className="hd-metric-top">
      <span className="hd-metric-label">{label}</span>
      <span className="hd-metric-icon">{icon}</span>
    </div>
    <div className={`hd-metric-value${small ? " hd-metric-value--sm" : ""}`}>{value}</div>
    {change && (
      <span className={`hd-metric-change ${positive ? "hd-positive" : "hd-negative"}`}>{change}</span>
    )}
  </div>
);

/* Analytics Panel — reused for both overall and per-event */
const AnalyticsPanel = ({ events, title, sub }) => {
  const totalRevenue   = events.reduce((s, e) => s + e.revenue, 0);
  const totalAttendees = events.reduce((s, e) => s + e.registered, 0);
  const totalViews     = events.reduce((s, e) => s + e.detailViews, 0);
  const totalVisits    = events.reduce((s, e) => s + e.siteVisits, 0);
  const totalCapacity  = events.reduce((s, e) => s + e.capacity, 0);
  const overallConv    = totalViews  ? ((totalAttendees / totalViews)  * 100).toFixed(1) : "0.0";
  const overallEng     = totalVisits ? ((totalViews     / totalVisits) * 100).toFixed(1) : "0.0";
  const avgTicket      = events.length ? Math.round(events.reduce((s, e) => s + e.ticketPrice, 0) / events.length) : 0;
  const activeCount    = events.filter(e => e.status === "active").length;

  // repeat attendees: names appearing in 2+ events
  const nameCounts = {};
  events.forEach(e => e.attendees.forEach(a => { nameCounts[a.name] = (nameCounts[a.name] || 0) + 1; }));
  const repeatCount  = Object.values(nameCounts).filter(c => c > 1).length;
  const totalUnique  = Object.keys(nameCounts).length;
  const repeatPct    = totalUnique ? ((repeatCount / totalUnique) * 100).toFixed(1) : "0.0";

  // bar chart: registered vs capacity per event (last 8)
  const barEvents = events.slice(-8);

  const animRev = useCountUp(totalRevenue);
  const animAtt = useCountUp(totalAttendees);

  return (
    <div className="hd-analytics-panel">
      {title && <div className="hd-section-header"><h2 className="hd-section-title">{title}</h2><p className="hd-section-sub">{sub}</p></div>}

      {/* Primary KPIs */}
      <div className="hd-metrics-grid">
        <MetricCard label="Total Revenue"     value={`$${animRev.toLocaleString()}`}  change="+14.2%" positive icon="💰" color="var(--accent)" />
        <MetricCard label="Total Attendees"   value={animAtt.toLocaleString()}         change="+8.7%"  positive icon="👥" color="#3b82f6" />
        <MetricCard label="Conversion Rate"   value={`${overallConv}%`}               change="-1.2%"  positive={false} icon="📈" color="#f97316" />
        <MetricCard label="Avg. Engagement"   value={`${overallEng}%`}                change="+2.4%"  positive icon="⚡" color="#a855f7" />
      </div>

      {/* Secondary KPIs */}
      <div className="hd-metrics-grid hd-metrics-grid--4" style={{ marginTop: 14 }}>
        <MetricCard label="Active Events"     value={String(activeCount)}             icon="🎯" color="#10b981" small />
        <MetricCard label="Repeat Attendees"  value={`${repeatPct}%`}                icon="🔁" color="#f59e0b" small />
        <MetricCard label="Avg Ticket Price"  value={`$${avgTicket}`}                icon="🎟️" color="#ec4899" small />
        <MetricCard label="Capacity Fill"     value={`${totalCapacity ? Math.round((totalAttendees/totalCapacity)*100) : 0}%`} icon="📊" color="#6366f1" small />
      </div>

      {/* Charts Row */}
      <div className="hd-charts-row" style={{ marginTop: 14 }}>
        {/* Registration Trends */}
        <div className="hd-card hd-chart-card">
          <div className="hd-chart-header">
            <div>
              <h3 className="hd-card-title">Registration vs Capacity</h3>
              <p className="hd-card-sub">Registered out of total openings per event</p>
            </div>
            <span className="hd-badge">Per Event</span>
          </div>
          <div className="hd-bar-chart">
            {barEvents.map((e, i) => (
              <div className="hd-bar-wrap" key={i} title={e.name}>
                {/* capacity bar (background) */}
                <div className="hd-bar hd-bar--bg" style={{ height: "100%" }} />
                {/* registered bar (foreground) */}
                <div className={`hd-bar hd-bar--fg ${fillPct(e) >= 90 ? "hd-bar--active" : ""}`}
                  style={{ height: `${fillPct(e)}%` }} />
              </div>
            ))}
          </div>
          <div className="hd-chart-labels">
            {barEvents.map((e, i) => (
              <span key={i} className="hd-chart-label" title={e.name}>{e.name.split(" ")[0]}</span>
            ))}
          </div>
          <div className="hd-chart-legend">
            <span className="hd-legend-dot hd-legend-dot--active" /> Registered
            <span className="hd-legend-dot" style={{ marginLeft: 14 }} /> Capacity
          </div>
        </div>

        {/* Recent Registrations */}
        <div className="hd-card hd-registrations-card">
          <h3 className="hd-card-title">Recent Registrations</h3>
          <div className="hd-reg-list">
            {events.flatMap(e => e.attendees.map(a => ({ ...a, event: e.name }))).slice(0, 5).map((r, i) => (
              <div className="hd-reg-item" key={i}>
                <div className="hd-reg-avatar">{r.avatar}</div>
                <div className="hd-reg-info">
                  <span className="hd-reg-name">{r.name}</span>
                  <span className="hd-reg-event">{r.event}</span>
                </div>
                <span className="hd-reg-time">{r.joined}</span>
              </div>
            ))}
          </div>
          <button className="hd-link-btn">View all registrations →</button>
        </div>
      </div>

      {/* Top Events Table */}
      <div className="hd-card hd-table-card" style={{ marginTop: 14 }}>
        <h3 className="hd-card-title">Top Performing Events <span className="hd-card-sub-inline">by conversion rate</span></h3>
        <table className="hd-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Status</th>
              <th>Fill Rate</th>
              <th>Conv. Rate</th>
              <th>Revenue</th>
              <th>Attendees</th>
            </tr>
          </thead>
          <tbody>
            {[...events].sort((a, b) => convRate(b) - convRate(a)).map((e, i) => (
              <tr key={i}>
                <td className="hd-td-name">{e.name}</td>
                <td><span className={`hd-status-pill hd-status-pill--${e.status}`}>{e.status}</span></td>
                <td>
                  <div className="hd-progress-wrap">
                    <div className="hd-progress-bar">
                      <div className="hd-progress-fill" style={{ width: `${fillPct(e)}%` }} />
                    </div>
                    <span className="hd-progress-label">{fillPct(e)}%</span>
                  </div>
                </td>
                <td className="hd-conv-cell">{convRate(e)}%</td>
                <td className="hd-revenue-cell">${e.revenue.toLocaleString()}</td>
                <td>{e.registered.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* Event Card */
const EventCard = ({ event }) => (
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
      </div>
      <div className="hd-event-progress-row">
        <div className="hd-progress-bar hd-progress-bar--thin">
          <div className="hd-progress-fill" style={{ width: `${fillPct(event)}%` }} />
        </div>
        <span className="hd-event-fill-lbl">{event.registered.toLocaleString()} / {event.capacity.toLocaleString()} registered</span>
      </div>
    </div>
    <div className="hd-event-right">
      <div className="hd-event-revenue">${event.revenue.toLocaleString()}</div>
      <div className="hd-event-rev-label">revenue</div>
      <span className={`hd-status-pill hd-status-pill--${event.status}`}>{event.status}</span>
    </div>
  </div>
);

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
const HostDashboard = () => {
  const [activeNav, setActiveNav]         = useState("Dashboard");
  const [eventFilter, setEventFilter]     = useState("all");
  const [analyticsEvent, setAnalyticsEvent] = useState(null);
  const [attendeeEvent, setAttendeeEvent] = useState(ALL_EVENTS[0]);
  const [attendeeSearch, setAttendeeSearch] = useState("");

  const navItems = [
    { label: "Dashboard", icon: "⊞" },
    { label: "My Events", icon: "📅" },
    { label: "Analytics", icon: "📊" },
    { label: "Attendees", icon: "👥" },
    { label: "Profile",   icon: "👤" },
  ];

  /* ── Dashboard Tab ── */
  const renderDashboard = () => (
    <AnalyticsPanel
      events={ALL_EVENTS}
      title="Overview"
      sub="Real-time performance metrics aggregated across all your events."
    />
  );

  /* ── My Events Tab ── */
  const renderMyEvents = () => {
    const tabs = ["all", "active", "upcoming", "past"];
    const filtered = eventFilter === "all" ? ALL_EVENTS : ALL_EVENTS.filter(e => e.status === eventFilter);
    return (
      <div>
        <div className="hd-section-header">
          <h2 className="hd-section-title">My Events</h2>
          <p className="hd-section-sub">Manage all your events across every stage.</p>
        </div>
        <div className="hd-filter-tabs">
          {tabs.map(t => (
            <button key={t} className={`hd-filter-tab ${eventFilter === t ? "hd-filter-tab--active" : ""}`}
              onClick={() => setEventFilter(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
              <span className="hd-filter-count">{t === "all" ? ALL_EVENTS.length : ALL_EVENTS.filter(e => e.status === t).length}</span>
            </button>
          ))}
        </div>
        <div className="hd-event-list">
          {filtered.map(e => <EventCard key={e.id} event={e} />)}
        </div>
      </div>
    );
  };

  /* ── Analytics Tab ── */
  const renderAnalytics = () => {
    const selected = analyticsEvent;
    return (
      <div>
        <div className="hd-section-header">
          <h2 className="hd-section-title">Analytics</h2>
          <p className="hd-section-sub">Select an event for detailed breakdown, or view overall stats.</p>
        </div>
        {/* Event Selector */}
        <div className="hd-analytics-selector">
          <button className={`hd-anal-pill ${!selected ? "hd-anal-pill--active" : ""}`}
            onClick={() => setAnalyticsEvent(null)}>Overall</button>
          {ALL_EVENTS.map(e => (
            <button key={e.id}
              className={`hd-anal-pill ${selected?.id === e.id ? "hd-anal-pill--active" : ""}`}
              onClick={() => setAnalyticsEvent(e)}>
              {e.name.split(" ").slice(0, 2).join(" ")}
            </button>
          ))}
        </div>
        <AnalyticsPanel
          key={selected?.id ?? "all"}
          events={selected ? [selected] : ALL_EVENTS}
          title={selected ? selected.name : null}
          sub={selected ? `${selected.date} · ${selected.location}` : null}
        />
      </div>
    );
  };

  /* ── Attendees Tab ── */
  const renderAttendees = () => {
    const list = attendeeEvent.attendees.filter(a =>
      a.name.toLowerCase().includes(attendeeSearch.toLowerCase()) ||
      a.email.toLowerCase().includes(attendeeSearch.toLowerCase())
    );
    return (
      <div>
        <div className="hd-section-header">
          <h2 className="hd-section-title">Attendees</h2>
          <p className="hd-section-sub">Browse attendee lists by event.</p>
        </div>
        {/* Event Selector */}
        <div className="hd-analytics-selector">
          {ALL_EVENTS.map(e => (
            <button key={e.id}
              className={`hd-anal-pill ${attendeeEvent.id === e.id ? "hd-anal-pill--active" : ""}`}
              onClick={() => setAttendeeEvent(e)}>
              {e.name.split(" ").slice(0, 2).join(" ")}
            </button>
          ))}
        </div>
        <div className="hd-card" style={{ marginTop: 14 }}>
          <div className="hd-attendees-header">
            <div>
              <h3 className="hd-card-title">{attendeeEvent.name}</h3>
              <p className="hd-card-sub">{attendeeEvent.attendees.length} attendees</p>
            </div>
            <div className="hd-search">
              <span className="hd-search-icon">🔍</span>
              <input className="hd-search-input" placeholder="Search attendees..."
                value={attendeeSearch} onChange={e => setAttendeeSearch(e.target.value)} />
            </div>
          </div>
          <table className="hd-table hd-attendees-table">
            <thead>
              <tr><th>Attendee</th><th>Email</th><th>Ticket Type</th><th>Joined</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {list.map((a, i) => (
                <tr key={i}>
                  <td>
                    <div className="hd-att-name-cell">
                      <div className="hd-reg-avatar hd-reg-avatar--sm">{a.avatar}</div>
                      {a.name}
                    </div>
                  </td>
                  <td className="hd-muted-cell">{a.email}</td>
                  <td><span className={`hd-ticket-pill hd-ticket-pill--${a.ticket.toLowerCase()}`}>{a.ticket}</span></td>
                  <td className="hd-muted-cell">{a.joined}</td>
                  <td>
                    <button className="hd-action-btn">Message</button>
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr><td colSpan={5} className="hd-empty-row">No attendees found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  /* ── Profile Tab ── */
  const renderProfile = () => (
    <div>
      <div className="hd-section-header">
        <h2 className="hd-section-title">Host Profile</h2>
        <p className="hd-section-sub">Manage your public profile and account settings.</p>
      </div>
      <div className="hd-profile-layout">
        {/* Profile Card */}
        <div className="hd-card hd-profile-card">
          <div className="hd-profile-avatar-wrap">
            <div className="hd-profile-avatar">AR</div>
            <button className="hd-profile-avatar-edit">✏️</button>
          </div>
          <div className="hd-profile-name">Alex Rivers</div>
          <div className="hd-profile-role">Premium Host</div>
          <div className="hd-profile-stats">
            <div className="hd-profile-stat"><span className="hd-profile-stat-val">{ALL_EVENTS.length}</span><span className="hd-profile-stat-lbl">Events</span></div>
            <div className="hd-profile-stat"><span className="hd-profile-stat-val">{ALL_EVENTS.reduce((s,e)=>s+e.registered,0).toLocaleString()}</span><span className="hd-profile-stat-lbl">Attendees</span></div>
            <div className="hd-profile-stat"><span className="hd-profile-stat-val">${ALL_EVENTS.reduce((s,e)=>s+e.revenue,0).toLocaleString()}</span><span className="hd-profile-stat-lbl">Revenue</span></div>
          </div>
          <div className="hd-profile-badges">
            <span className="hd-badge-pill">⭐ Premium</span>
            <span className="hd-badge-pill">🔥 Top Host</span>
            <span className="hd-badge-pill">🌍 Global</span>
          </div>
        </div>

        {/* Edit Form */}
        <div className="hd-profile-form-wrap">
          <div className="hd-card hd-profile-form-card">
            <h3 className="hd-card-title">Personal Information</h3>
            <div className="hd-form-grid">
              {[
                { label: "Full Name", val: "Alex Rivers" },
                { label: "Email Address", val: "alex.rivers@email.com" },
                { label: "Phone", val: "+1 (555) 000-0000" },
                { label: "Organization", val: "TechSphere Events Inc." },
                { label: "Website", val: "www.alexrivers.io" },
                { label: "Location", val: "San Francisco, CA" },
              ].map((f, i) => (
                <div className="hd-form-field" key={i}>
                  <label className="hd-form-label">{f.label}</label>
                  <input className="hd-form-input" defaultValue={f.val} />
                </div>
              ))}
            </div>
            <div className="hd-form-field hd-form-field--full">
              <label className="hd-form-label">Bio</label>
              <textarea className="hd-form-textarea" defaultValue="Passionate event organizer and tech community builder. Hosted 6+ global summits with 14,000+ combined attendees." />
            </div>
            <div className="hd-profile-actions">
              <button className="hd-btn-outline">Cancel</button>
              <button className="hd-btn-primary">Save Changes</button>
            </div>
          </div>

          {/* Membership */}
          <div className="hd-card hd-membership-card">
            <h3 className="hd-card-title">Membership Plan</h3>
            <div className="hd-membership-tiers">
              {[
                { name: "Bronze", active: false, perks: "Up to 2 events/mo" },
                { name: "Silver", active: false, perks: "Up to 5 events/mo" },
                { name: "Premium", active: true,  perks: "Unlimited events + analytics" },
              ].map((t, i) => (
                <div key={i} className={`hd-tier-card ${t.active ? "hd-tier-card--active" : ""}`}>
                  <div className="hd-tier-name">{t.name}</div>
                  <div className="hd-tier-perks">{t.perks}</div>
                  {t.active && <span className="hd-tier-badge">Current Plan</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeNav) {
      case "Dashboard": return renderDashboard();
      case "My Events": return renderMyEvents();
      case "Analytics": return renderAnalytics();
      case "Attendees": return renderAttendees();
      case "Profile":   return renderProfile();
      default: return renderDashboard();
    }
  };

  return (
    <div className="hd-root">
      {/* Sidebar */}
      <aside className="hd-sidebar">
        <div className="hd-logo">
          <span className="hd-logo-icon">
            <img src={logo} alt="logo" style={{ width: "50px", height: "50px" }} />
          </span>
          <span className="hd-logo-text">EventSphere</span>
        </div>

        <nav className="hd-nav">
          {navItems.map((item) => (
            <button key={item.label}
              className={`hd-nav-item ${activeNav === item.label ? "hd-nav-item--active" : ""}`}
              onClick={() => setActiveNav(item.label)}>
              <span className="hd-nav-icon">{item.icon}</span>
              <span className="hd-nav-label">{item.label}</span>
              {activeNav === item.label && <span className="hd-nav-indicator" />}
            </button>
          ))}
        </nav>

        <div className="hd-sidebar-footer">
          <div className="hd-user" onClick={() => setActiveNav("Profile")} style={{ cursor: "pointer" }}>
            <div className="hd-user-avatar">AR</div>
            <div className="hd-user-info">
              <span className="hd-user-name">Alex Rivers</span>
              <span className="hd-user-role">Premium Host</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="hd-main">
        <header className="hd-topbar">
          <h1 className="hd-page-title">{activeNav === "Dashboard" ? "Host Dashboard" : activeNav}</h1>
          <div className="hd-topbar-right">
            <div className="hd-search">
              <span className="hd-search-icon">🔍</span>
              <input className="hd-search-input" placeholder="Search events..." />
            </div>
            <button className="hd-btn-primary">+ Create Event</button>
          </div>
        </header>

        <div className="hd-content">{renderContent()}</div>
      </main>
    </div>
  );
};

export default HostDashboard;