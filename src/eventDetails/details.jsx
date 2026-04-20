import { useState } from "react";
import "./details.css";

const requirements = [
  "Active professional developer or graduate student in CS/AI",
  "Laptop required with Python 3.10+ and Docker pre-installed",
  "LinkedIn profile verification required during registration",
  "Portfolio or GitHub link with at least one AI project",
];

const scheduleItems = [
  { time: "09:00", title: "Opening Keynote: The Agentic Era", track: "Main Stage", tag: "keynote", label: "Keynote" },
  { time: "10:30", title: "Building Production RAG Pipelines", track: "Workshop Hall A", tag: "workshop", label: "Workshop" },
  { time: "13:00", title: "LLM Safety in Prod Systems", track: "Track B", tag: "panel", label: "Panel" },
  { time: "15:00", title: "Fine-tuning vs Prompting at Scale", track: "Workshop Hall A", tag: "workshop", label: "Workshop" },
  { time: "17:30", title: "Networking & Demo Showcase", track: "Expo Floor", tag: "social", label: "Social" },
];

const speakers = [
  { initials: "AK", name: "Aisha Kim", role: "Head of AI, Stripe", color: "blue" },
  { initials: "MR", name: "Marco Ruiz", role: "Researcher, OpenAI", color: "green" },
  { initials: "SL", name: "Sara Lin", role: "CTO, Cohere", color: "amber" },
  { initials: "JP", name: "James Park", role: "ML Eng, Google", color: "pink" },
  { initials: "NB", name: "Nina Bell", role: "Founder, Replicate", color: "purple" },
  { initials: "OT", name: "Omar Tahir", role: "VP Eng, Hugging Face", color: "teal" },
];

const TABS = ["Overview", "Schedule", "Speakers"];

function CheckIcon() {
  return (
    <svg viewBox="0 0 10 10" fill="none" width="10" height="10">
      <path d="M2 5l2 2 4-4" stroke="#0057ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M9 15.5s-7-4.5-7-9a4 4 0 018 0 4 4 0 018 0c0 4.5-7 9-7 9z" stroke="#888" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg className="meta-icon" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="3" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5 2v2M11 2v2M2 7h12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg className="meta-icon" viewBox="0 0 16 16" fill="none">
      <path d="M8 1.5C5.79 1.5 4 3.29 4 5.5c0 3.25 4 9 4 9s4-5.75 4-9c0-2.21-1.79-4-4-4z" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="8" cy="5.5" r="1.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function CardIcon() {
  return (
    <svg className="meta-icon" viewBox="0 0 16 16" fill="none">
      <rect x="1.5" y="3.5" width="13" height="9" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <path d="M1.5 6.5h13" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function Overview() {
  return (
    <>
      <div className="section">
        <h2 className="section-title">About the event</h2>
        <div className="about-card">
          <p className="about-text">
            The Global AI Builders Summit is a premier gathering designed for developers, architects, and engineers at
            the forefront of the generative AI revolution. This year, we focus on the transition from experimental
            prototypes to production-ready autonomous systems.
          </p>
        </div>
      </div>

      <div className="section section-gap">
        <h2 className="section-title">Requirements</h2>
        <div className="req-card">
          {requirements.map((req, i) => (
            <div className="req-item" key={i}>
              <div className="req-check">
                <CheckIcon />
              </div>
              <p className="req-text" dangerouslySetInnerHTML={{ __html: req.replace(/Python 3\.10\+|Docker|LinkedIn profile verification|GitHub link|at least one AI project|Active professional developer|graduate student in CS\/AI/g, (m) => `<strong>${m}</strong>`) }} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function Schedule() {
  return (
    <div className="section">
      <h2 className="section-title">Day 1 — Oct 14</h2>
      <div className="schedule-list">
        {scheduleItems.map((item, i) => (
          <div className="sched-item" key={i}>
            <div className="sched-time">{item.time}</div>
            <div className="sched-info">
              <div className="sched-title">{item.title}</div>
              <div className="sched-track">{item.track}</div>
            </div>
            <span className={`sched-tag tag-${item.tag}`}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Speakers() {
  return (
    <div className="section">
      <h2 className="section-title">Featured speakers</h2>
      <div className="speakers-grid">
        {speakers.map((s, i) => (
          <div className="speaker-card" key={i}>
            <div className={`speaker-avatar avatar-${s.color}`}>{s.initials}</div>
            <div className="speaker-name">{s.name}</div>
            <div className="speaker-role">{s.role}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function EventDetails() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [saved, setSaved] = useState(false);

  return (
    <div className="page">
      {/* Hero */}
      <div className="hero2">
        <div className="hero-grid" />
        <svg className="hero-blobs" viewBox="0 0 600 220" preserveAspectRatio="xMidYMid slice">
          <circle cx="500" cy="60" r="120" fill="#0057ff" opacity="0.35" />
          <circle cx="80" cy="180" r="80" fill="#00c6ff" opacity="0.2" />
        </svg>
        <div className="hero-overlay" />
        <span className="hero-badge">Upcoming Event</span>
        <button className="back-btn">← Back</button>
        <div className="hero-content">
          <h1 className="hero-title">Global AI Builders Summit 2024</h1>
          <div className="hero-meta">
            <div className="meta-item"><CalendarIcon /> Oct 14–18, 2024</div>
            <div className="meta-item"><PinIcon /> San Francisco, CA</div>
            <div className="meta-item"><CardIcon /> Free Entrance</div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-cell">
          <div className="stat-label">Start time</div>
          <div className="stat-value">09:00 AM</div>
          <div className="stat-sub">PST</div>
        </div>
        <div className="stat-cell">
          <div className="stat-label">Attendance</div>
          <div className="stat-value">500+</div>
          <div className="stat-sub">Confirmed</div>
        </div>
        <div className="stat-cell">
          <div className="stat-label">Availability</div>
          <div className="stat-value stat-limited">Limited</div>
          <div className="stat-sub">Slots left</div>
        </div>
      </div>

      {/* Capacity Bar */}
      <div className="capacity-bar">
        <div className="cap-row">
          <span>Registrations</span>
          <span className="cap-count">362 / 500</span>
        </div>
        <div className="cap-track">
          <div className="cap-fill" style={{ width: "72%" }} />
        </div>
      </div>

      {/* Tabs */}
      <div className="nav-tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`nav-tab${activeTab === tab ? " active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "Overview" && <Overview />}
      {activeTab === "Schedule" && <Schedule />}
      {activeTab === "Speakers" && <Speakers />}

      <div className="bottom-spacer" />

      {/* Bottom Bar */}
      <div className="bottom-bar">
        <button
          className={`save-btn${saved ? " saved" : ""}`}
          onClick={() => setSaved(!saved)}
          aria-label="Save event"
        >
          <HeartIcon />
        </button>
        <button className="register-btn">Register now →</button>
      </div>
    </div>
  );
}