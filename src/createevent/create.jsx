import { useState, useRef } from "react";
import "./create.css";
import logo from "../assets/logo.svg";

const STEPS = [
  { id: 1, key: "details", label: "Event Details", icon: "◈" },
  { id: 2, key: "timeline", label: "Timeline", icon: "◷" },
  { id: 3, key: "eligibility", label: "Eligibility", icon: "◉" },
  { id: 4, key: "review", label: "Review", icon: "◎" },
];

const CATEGORIES = ["Hackathon", "Webinar", "Seminar", "Quiz"];

const defaultForm = {
  eventName: "", category: "Hackathon", description: "", tagline: "", coverImage: null,
  registrationOpen: "", registrationClose: "", eventStart: "", eventEnd: "",
  submissionDeadline: "", resultsDate: "",
  mode: "hybrid", venueName: "", venueAddress: "", city: "", onlineLink: "",
  minTeamSize: 1, maxTeamSize: 4, eligibleFor: [], ageMin: "", ageMax: "",
  skills: "", openTo: "everyone",
  firstPrize: "", secondPrize: "", thirdPrize: "", totalPool: "",
};

function EventCreation() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(defaultForm);
  const [coverPreview, setCoverPreview] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState(null);
  const fileRef = useRef();

  const update = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleCover = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    update("coverImage", file);
    const reader = new FileReader();
    reader.onload = (ev) => setCoverPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const toggleEligible = (val) => {
    setForm((f) => ({
      ...f,
      eligibleFor: f.eligibleFor.includes(val)
        ? f.eligibleFor.filter((x) => x !== val)
        : [...f.eligibleFor, val],
    }));
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    setPublishError(null);

    try {
      const formData = new FormData();

      // Append cover image file separately
      if (form.coverImage) {
        formData.append("coverImage", form.coverImage);
      }

      // Append all other fields; stringify arrays for FormData
      const payload = { ...form };
      delete payload.coverImage;

      Object.entries(payload).forEach(([key, val]) => {
        formData.append(key, Array.isArray(val) ? JSON.stringify(val) : val);
      });
      console.log(formData);
     const token = localStorage.getItem("token");

const res = await fetch("http://localhost:5000/api/events", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`, 
  },
  body: formData,
});

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to create event");
      }

      setSubmitted(true);
    } catch (err) {
      setPublishError(err.message);
    } finally {
      setIsPublishing(false);
    }
  };

  const progress = ((step - 1) / 3) * 100;

  if (submitted) {
    return (
      <div className="ec-success">
        <div className="ec-success-inner">
          <div className="ec-success-icon">✦</div>
          <h2>Event Created!</h2>
          <p>Your event <strong>"{form.eventName || "Untitled Event"}"</strong> has been submitted for review.</p>
          <button
            className="ec-btn-primary"
            onClick={() => { setSubmitted(false); setStep(1); setForm(defaultForm); setCoverPreview(null); setPublishError(null); }}
          >
            Create Another Event
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ec-root">
      <header className="ec-header">
        <div className="ec-header-left">
          <span className="ec-logo-icon">
            <img src={logo} alt="logo" style={{ width: "50px", height: "50px" }} />
          </span>
          <span className="ec-logo-text">Event Sphere</span>
        </div>
        <div className="ec-step-badge">Step {step} of 4</div>
      </header>

      <div className="ec-layout">
        <aside className="ec-sidebar">
          <div className="ec-progress-label">CREATION PROGRESS</div>
          <div className="ec-progress-track">
            <div className="ec-progress-fill" style={{ height: `${progress}%` }} />
          </div>
          <nav className="ec-nav">
            {STEPS.map((s) => (
              <button
                key={s.id}
                className={`ec-nav-item ${step === s.id ? "active" : ""} ${step > s.id ? "done" : ""}`}
                onClick={() => step > s.id && setStep(s.id)}
              >
                <span className="ec-nav-icon">{step > s.id ? "✓" : s.icon}</span>
                <span>{s.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="ec-main">
          <div className="ec-step-tag">
            STEP {step}: {["CONFIGURATION", "TIMELINE & VENUE", "ELIGIBILITY", "REVIEW"][step - 1]}
          </div>

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <div className="ec-section">
              <h1 className="ec-title">Event Details</h1>
              <p className="ec-subtitle">Lay the foundation for your event. Be clear, concise, and compelling to attract the right participants.</p>
              <div className="ec-two-col">
                <div className="ec-col-main">
                  <div className="ec-field">
                    <label>EVENT NAME</label>
                    <input
                      className="ec-input"
                      placeholder="e.g. Global Tech Summit 2025"
                      maxLength={80}
                      value={form.eventName}
                      onChange={(e) => update("eventName", e.target.value)}
                    />
                    <span className="ec-hint">{form.eventName.length}/80 characters</span>
                  </div>
                  <div className="ec-field">
                    <label>FULL DESCRIPTION</label>
                    <div className="ec-editor">
                      <textarea
                        className="ec-textarea"
                        placeholder="Tell your audience what makes this event unique..."
                        value={form.description}
                        onChange={(e) => update("description", e.target.value)}
                        rows={6}
                      />
                    </div>
                  </div>
                  <div className="ec-field">
                    <label>TAGLINE</label>
                    <input
                      className="ec-input"
                      placeholder="A short, punchy line that captures your event's spirit"
                      maxLength={120}
                      value={form.tagline}
                      onChange={(e) => update("tagline", e.target.value)}
                    />
                  </div>
                </div>
                <div className="ec-col-side">
                  <div className="ec-field">
                    <label>EVENT CATEGORY</label>
                    <div className="ec-category-list">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          className={`ec-category-btn ${form.category === cat ? "selected" : ""}`}
                          onClick={() => update("category", cat)}
                        >
                          {cat}
                          {form.category === cat && <span className="ec-check">✓</span>}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="ec-field">
                    <label>COVER IMAGE</label>
                    <div
                      className="ec-upload-zone"
                      onClick={() => fileRef.current.click()}
                      style={
                        coverPreview
                          ? { backgroundImage: `url(${coverPreview})`, backgroundSize: "cover", backgroundPosition: "center" }
                          : {}
                      }
                    >
                      {!coverPreview && (
                        <>
                          <span className="ec-upload-icon">⊞</span>
                          <p>Upload Cover Image</p>
                          <span className="ec-upload-hint">Drag and drop or click to browse.<br />Recommendation: 1920×1080px.</span>
                        </>
                      )}
                      {coverPreview && <div className="ec-upload-overlay">Change Image</div>}
                    </div>
                    <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleCover} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <div className="ec-section">
              <h1 className="ec-title">Timeline & Venue</h1>
              <p className="ec-subtitle">Define your event's schedule and location to help participants plan ahead.</p>
              <div className="ec-two-col">
                <div className="ec-col-main">
                  <div className="ec-card">
                    <div className="ec-card-header"><span className="ec-card-icon">◷</span> Key Dates & Deadlines</div>
                    <div className="ec-dates-grid">
                      {[
                        { label: "Registration Opens", key: "registrationOpen", icon: "🟢" },
                        { label: "Registration Closes", key: "registrationClose", icon: "🔴" },
                        { label: "Event Start", key: "eventStart", icon: "🚀" },
                        { label: "Event End", key: "eventEnd", icon: "🏁" },
                        { label: "Submission Deadline", key: "submissionDeadline", icon: "📤" },
                        { label: "Results Announced", key: "resultsDate", icon: "🏆" },
                      ].map(({ label, key, icon }) => (
                        <div className="ec-date-row" key={key}>
                          <div className="ec-date-label"><span>{icon}</span> {label}</div>
                          <input
                            type="datetime-local"
                            className="ec-input ec-date-input"
                            value={form[key]}
                            onChange={(e) => update(key, e.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  {form.eventStart && (
                    <div className="ec-timeline-visual">
                      <div className="ec-tl-label">TIMELINE PREVIEW</div>
                      <div className="ec-tl-track">
                        {[
                          { label: "Reg. Opens", key: "registrationOpen", color: "#4ade80" },
                          { label: "Reg. Closes", key: "registrationClose", color: "#f87171" },
                          { label: "Start", key: "eventStart", color: "#60a5fa" },
                          { label: "Deadline", key: "submissionDeadline", color: "#fbbf24" },
                          { label: "End", key: "eventEnd", color: "#a78bfa" },
                          { label: "Results", key: "resultsDate", color: "#34d399" },
                        ]
                          .filter((item) => form[item.key])
                          .map((item) => (
                            <div key={item.key} className="ec-tl-node" style={{ "--node-color": item.color }}>
                              <div className="ec-tl-dot" />
                              <div className="ec-tl-node-label">{item.label}</div>
                              <div className="ec-tl-date">
                                {new Date(form[item.key]).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                              </div>
                            </div>
                          ))}
                        <div className="ec-tl-line" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="ec-col-side">
                  <div className="ec-card">
                    <div className="ec-card-header"><span className="ec-card-icon">📍</span> Venue</div>
                    <div className="ec-mode-tabs">
                      {["in-person", "online"].map((m) => (
                        <button
                          key={m}
                          className={`ec-mode-tab ${form.mode === m ? "active" : ""}`}
                          onClick={() => update("mode", m)}
                        >
                          {m === "in-person" ? "🏢 In-Person" : "💻 Online"}
                        </button>
                      ))}
                    </div>
                    {(form.mode === "in-person" || form.mode === "hybrid") && (
                      <>
                        <div className="ec-field ec-field-sm">
                          <label>VENUE NAME</label>
                          <input className="ec-input" placeholder="e.g. IIT Delhi Auditorium" value={form.venueName} onChange={(e) => update("venueName", e.target.value)} />
                        </div>
                        <div className="ec-field ec-field-sm">
                          <label>FULL ADDRESS</label>
                          <input className="ec-input" placeholder="Street address..." value={form.venueAddress} onChange={(e) => update("venueAddress", e.target.value)} />
                        </div>
                        <div className="ec-field ec-field-sm">
                          <label>CITY</label>
                          <input className="ec-input" placeholder="e.g. New Delhi" value={form.city} onChange={(e) => update("city", e.target.value)} />
                        </div>
                      </>
                    )}
                    {(form.mode === "online" || form.mode === "hybrid") && (
                      <div className="ec-field ec-field-sm">
                        <label>ONLINE LINK / PLATFORM</label>
                        <input className="ec-input" placeholder="https://meet.google.com/..." value={form.onlineLink} onChange={(e) => update("onlineLink", e.target.value)} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 3 ── */}
          {step === 3 && (
            <div className="ec-section">
              <h1 className="ec-title">Eligibility & Prizes</h1>
              <p className="ec-subtitle">Define who can participate and what they stand to win.</p>
              <div className="ec-two-col">
                <div className="ec-col-main">
                  <div className="ec-card">
                    <div className="ec-card-header"><span className="ec-card-icon">👥</span> Team Settings</div>
                    <div className="ec-field">
                      <label>OPEN TO</label>
                      <div className="ec-radio-group">
                        {["everyone", "students", "professionals"].map((opt) => (
                          <label key={opt} className={`ec-radio-btn ${form.openTo === opt ? "selected" : ""}`}>
                            <input type="radio" name="openTo" value={opt} checked={form.openTo === opt} onChange={() => update("openTo", opt)} />
                            {opt.charAt(0).toUpperCase() + opt.slice(1).replace("-", " ")}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="ec-row-two">
                      <div className="ec-field">
                        <label>MIN TEAM SIZE</label>
                        <input type="number" className="ec-input" min={1} max={10} value={form.minTeamSize} onChange={(e) => update("minTeamSize", e.target.value)} />
                      </div>
                      <div className="ec-field">
                        <label>MAX TEAM SIZE</label>
                        <input type="number" className="ec-input" min={1} max={10} value={form.maxTeamSize} onChange={(e) => update("maxTeamSize", e.target.value)} />
                      </div>
                    </div>
                    <div className="ec-field">
                      <label>ELIGIBLE BACKGROUNDS</label>
                      <div className="ec-tag-group">
                        {["B.Tech/BE", "MCA/MSc", "MBA", "High School", "Working Professional", "Any"].map((opt) => (
                          <button
                            key={opt}
                            className={`ec-tag-btn ${form.eligibleFor.includes(opt) ? "selected" : ""}`}
                            onClick={() => toggleEligible(opt)}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="ec-field">
                      <label>PREFERRED SKILLS (optional)</label>
                      <input className="ec-input" placeholder="e.g. React, ML, UI/UX, Blockchain" value={form.skills} onChange={(e) => update("skills", e.target.value)} />
                    </div>
                  </div>
                </div>
                <div className="ec-col-side">
                  <div className="ec-card">
                    <div className="ec-card-header"><span className="ec-card-icon">🏆</span> Prize Pool</div>
                    <div className="ec-prize-total">
                      <label className="ec-prize-pool-label">TOTAL PRIZE POOL (₹ or $)</label>
                      <input
                        className="ec-input ec-prize-total-input"
                        placeholder="e.g. ₹1,00,000"
                        value={form.totalPool}
                        onChange={(e) => update("totalPool", e.target.value)}
                      />
                    </div>
                    {[
                      { rank: "🥇 1st Place", key: "firstPrize", colorClass: "prize-gold" },
                      { rank: "🥈 2nd Place", key: "secondPrize", colorClass: "prize-silver" },
                      { rank: "🥉 3rd Place", key: "thirdPrize", colorClass: "prize-bronze" },
                    ].map(({ rank, key, colorClass }) => (
                      <div className={`ec-prize-row ${colorClass}`} key={key}>
                        <span className="ec-prize-rank">{rank}</span>
                        <input
                          className="ec-input ec-prize-input"
                          placeholder="Amount / Benefit"
                          value={form[key]}
                          onChange={(e) => update(key, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 4 ── */}
          {step === 4 && (
            <div className="ec-section">
              <h1 className="ec-title">Review & Publish</h1>
              <p className="ec-subtitle">Confirm all details before your event goes live.</p>
              <div className="ec-review-grid">
                <div className="ec-review-card">
                  <div className="ec-review-header">◈ Event Details</div>
                  <div className="ec-review-row"><span>Name</span><strong>{form.eventName || "—"}</strong></div>
                  <div className="ec-review-row"><span>Category</span><strong>{form.category}</strong></div>
                  <div className="ec-review-row"><span>Tagline</span><strong>{form.tagline || "—"}</strong></div>
                  {form.description && (
                    <div className="ec-review-desc">
                      {form.description.slice(0, 120)}{form.description.length > 120 ? "..." : ""}
                    </div>
                  )}
                </div>
                <div className="ec-review-card">
                  <div className="ec-review-header">◷ Timeline</div>
                  {[
                    ["Reg. Opens", form.registrationOpen],
                    ["Reg. Closes", form.registrationClose],
                    ["Event Start", form.eventStart],
                    ["Event End", form.eventEnd],
                    ["Submission", form.submissionDeadline],
                    ["Results", form.resultsDate],
                  ].map(([label, val]) => (
                    <div className="ec-review-row" key={label}>
                      <span>{label}</span>
                      <strong>{val ? new Date(val).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "—"}</strong>
                    </div>
                  ))}
                </div>
                <div className="ec-review-card">
                  <div className="ec-review-header">📍 Venue</div>
                  <div className="ec-review-row"><span>Mode</span><strong>{form.mode}</strong></div>
                  <div className="ec-review-row"><span>Venue</span><strong>{form.venueName || "—"}</strong></div>
                  <div className="ec-review-row"><span>Address</span><strong>{form.venueAddress || "—"}</strong></div>
                  <div className="ec-review-row"><span>City</span><strong>{form.city || "—"}</strong></div>
                  {form.onlineLink && <div className="ec-review-row"><span>Link</span><strong>{form.onlineLink}</strong></div>}
                </div>
                <div className="ec-review-card">
                  <div className="ec-review-header">◉ Eligibility & Prizes</div>
                  <div className="ec-review-row"><span>Open To</span><strong>{form.openTo}</strong></div>
                  <div className="ec-review-row"><span>Team Size</span><strong>{form.minTeamSize}–{form.maxTeamSize} members</strong></div>
                  <div className="ec-review-row"><span>Age</span><strong>{form.ageMin || "Any"}{form.ageMax ? `–${form.ageMax}` : "+"}</strong></div>
                  <div className="ec-review-row"><span>Backgrounds</span><strong>{form.eligibleFor.length ? form.eligibleFor.join(", ") : "All"}</strong></div>
                  <div className="ec-review-row"><span>Prize Pool</span><strong>{form.totalPool || "—"}</strong></div>
                  <div className="ec-review-row"><span>1st Place</span><strong>{form.firstPrize || "—"}</strong></div>
                  <div className="ec-review-row"><span>2nd Place</span><strong>{form.secondPrize || "—"}</strong></div>
                </div>
              </div>
              {coverPreview && (
                <div className="ec-review-cover">
                  <div className="ec-review-header">🖼 Cover Image</div>
                  <img src={coverPreview} alt="Cover preview" className="ec-cover-preview" />
                </div>
              )}
            </div>
          )}

          <div className="ec-footer">
            <div className="ec-footer-right">
              {step < 4 ? (
                <button className="ec-btn-primary" onClick={() => setStep(step + 1)}>
                  CONTINUE TO {["TIMELINE", "ELIGIBILITY", "REVIEW", ""][step - 1]} →
                </button>
              ) : (
                <div className="ec-publish-wrapper">
                  {publishError && (
                    <p className="ec-error-msg">⚠ {publishError}</p>
                  )}
                  <button
                    className="ec-btn-publish"
                    onClick={handlePublish}
                    disabled={isPublishing}
                  >
                    {isPublishing ? "⏳ Publishing..." : "🚀 PUBLISH EVENT"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default EventCreation;