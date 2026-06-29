import { useState, useRef } from "react";
import "./create.css";
import "./room.css";
import "./quiz.css";
import logo from "../assets/logo.svg";

const BASE_STEPS = [
  { id: 1, key: "details",     label: "Event Details", icon: "◈" },
  { id: 2, key: "timeline",    label: "Timeline",      icon: "◷" },
  { id: 3, key: "eligibility", label: "Eligibility",   icon: "◉" },
  { id: 4, key: "venue",       label: "Venue Setup",   icon: "🪑" },
  { id: 5, key: "review",      label: "Review",        icon: "◎" },
];

const STEPS_NO_VENUE = [
  { id: 1, key: "details",     label: "Event Details", icon: "◈" },
  { id: 2, key: "timeline",    label: "Timeline",      icon: "◷" },
  { id: 3, key: "eligibility", label: "Eligibility",   icon: "◉" },
  { id: 4, key: "review",      label: "Review",        icon: "◎" },
];

const STEPS_QUIZ = [
  { id: 1, key: "details",     label: "Event Details", icon: "◈" },
  { id: 2, key: "timeline",    label: "Timeline",      icon: "◷" },
  { id: 3, key: "eligibility", label: "Eligibility",   icon: "◉" },
  { id: 4, key: "questions",   label: "Quiz Questions",icon: "❓" },
  { id: 5, key: "review",      label: "Review",        icon: "◎" },
];

const CATEGORIES = ["Hackathon", "Webinar", "Seminar", "Quiz"];

const ROOM_TYPES = ["Auditorium", "Theatre", "Conference", "Workshop", "Seminar Hall"];

const defaultForm = {
  eventName: "", category: "Hackathon", description: "", tagline: "", coverImage: null,
  registrationOpen: "", registrationClose: "", eventStart: "", eventEnd: "",
  submissionDeadline: "", resultsDate: "",
  mode: "hybrid", venueName: "", venueAddress: "", city: "", onlineLink: "",
  minTeamSize: 1, maxTeamSize: 4, eligibleFor: [], ageMin: "", ageMax: "",
  skills: "", openTo: "everyone",
  firstPrize: "", secondPrize: "", thirdPrize: "", totalPool: "",
  rooms: [],
  questions: [], // quiz questions
};

const defaultRoom = {
  id: null, name: "", type: "Auditorium", rows: 8, cols: 12, vipRows: 1,
};

const defaultQuestion = () => ({
  id: Date.now(),
  questionText: "",
  options: ["", "", "", ""],
  correctOptionIndex: 0,
  points: 10,
  timeLimit: 30,
});

// ─── Room preview grid (unchanged) ────────────────────────────────────────────
function RoomPreviewGrid({ rows, cols, vipRows }) {
  const r = Math.min(rows, 12);
  const c = Math.min(cols, 16);
  return (
    <div className="ec-room-preview">
      <div className="ec-room-stage">◀ STAGE / FRONT ▶</div>
      <div className="ec-room-grid">
        {Array.from({ length: r }).map((_, ri) => (
          <div key={ri} className="ec-room-row">
            <span className="ec-room-row-label">{"ABCDEFGHIJKLMNOPQRST"[ri]}</span>
            {Array.from({ length: c }).map((_, ci) => (
              <div
                key={ci}
                className={`ec-room-seat${ri < vipRows ? " ec-room-seat--vip" : ""}`}
              />
            ))}
          </div>
        ))}
      </div>
      {rows > 12 || cols > 16 ? (
        <p className="ec-room-preview-note">Preview shows first {Math.min(rows,12)} rows × {Math.min(cols,16)} cols</p>
      ) : null}
      <div className="ec-room-legend">
        <span className="ec-room-legend-item"><span className="ec-room-seat-sm" /> Regular</span>
        {vipRows > 0 && <span className="ec-room-legend-item"><span className="ec-room-seat-sm ec-room-seat-sm--vip" /> VIP</span>}
      </div>
    </div>
  );
}

// ─── Single question card ──────────────────────────────────────────────────────
function QuestionCard({ q, index, onChange, onRemove }) {
  const updateOption = (optIdx, val) => {
    const newOpts = [...q.options];
    newOpts[optIdx] = val;
    onChange({ ...q, options: newOpts });
  };

  const OPTION_LABELS = ["A", "B", "C", "D"];

  return (
    <div className="ec-question-card">
      <div className="ec-question-card-header">
        <span className="ec-question-number">Q{index + 1}</span>
        <div className="ec-question-meta">
          <label className="ec-question-meta-label">Points</label>
          <input
            type="number" min={1} max={100}
            className="ec-input ec-input-sm"
            value={q.points}
            onChange={(e) => onChange({ ...q, points: Number(e.target.value) })}
          />
          <label className="ec-question-meta-label">Time (s)</label>
          <input
            type="number" min={5} max={300}
            className="ec-input ec-input-sm"
            value={q.timeLimit}
            onChange={(e) => onChange({ ...q, timeLimit: Number(e.target.value) })}
          />
        </div>
        <button className="ec-question-remove" onClick={onRemove} title="Remove question">✕</button>
      </div>

      <div className="ec-field">
        <label>QUESTION</label>
        <textarea
          className="ec-input ec-textarea-sm"
          placeholder={`e.g. What does HTTP stand for?`}
          rows={2}
          value={q.questionText}
          onChange={(e) => onChange({ ...q, questionText: e.target.value })}
        />
      </div>

      <div className="ec-options-grid">
        {q.options.map((opt, optIdx) => (
          <div
            key={optIdx}
            className={`ec-option-row${q.correctOptionIndex === optIdx ? " ec-option-row--correct" : ""}`}
          >
            <button
              className={`ec-option-correct-btn${q.correctOptionIndex === optIdx ? " active" : ""}`}
              onClick={() => onChange({ ...q, correctOptionIndex: optIdx })}
              title="Mark as correct answer"
            >
              {q.correctOptionIndex === optIdx ? "✓" : OPTION_LABELS[optIdx]}
            </button>
            <input
              className="ec-input ec-option-input"
              placeholder={`Option ${OPTION_LABELS[optIdx]}`}
              value={opt}
              onChange={(e) => updateOption(optIdx, e.target.value)}
            />
          </div>
        ))}
      </div>
      <p className="ec-hint">Click the letter button to mark the correct answer — it turns green ✓</p>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
function EventCreation() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(defaultForm);
  const [coverPreview, setCoverPreview] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState(null);
  const [roomDraft, setRoomDraft] = useState({ ...defaultRoom, id: Date.now() });
  const [roomErrors, setRoomErrors] = useState({});
  const fileRef = useRef();

  const isSeminar = form.category === "Seminar";
  const isQuiz    = form.category === "Quiz";

  const STEPS = isSeminar ? BASE_STEPS : isQuiz ? STEPS_QUIZ : STEPS_NO_VENUE;
  const totalSteps = STEPS.length;

  const update = (key, val) => setForm((f) => ({ ...f, [key]: val }));
  const updateRoom = (key, val) => setRoomDraft((r) => ({ ...r, [key]: val }));

  // ── Question helpers ──
  const addQuestion = () => {
    update("questions", [...form.questions, defaultQuestion()]);
  };

  const updateQuestion = (idx, updated) => {
    const qs = [...form.questions];
    qs[idx] = updated;
    update("questions", qs);
  };

  const removeQuestion = (idx) => {
    update("questions", form.questions.filter((_, i) => i !== idx));
  };

  // ── Cover image ──
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

  // ── Room helpers ──
  const validateRoom = () => {
    const e = {};
    if (!roomDraft.name.trim()) e.name = "Room name is required";
    if (roomDraft.rows < 1 || roomDraft.rows > 20) e.rows = "Rows: 1–20";
    if (roomDraft.cols < 1 || roomDraft.cols > 20) e.cols = "Seats/row: 1–20";
    if (roomDraft.vipRows < 0 || roomDraft.vipRows > roomDraft.rows) e.vipRows = `0–${roomDraft.rows}`;
    return e;
  };

  const addRoom = () => {
    const errs = validateRoom();
    if (Object.keys(errs).length) { setRoomErrors(errs); return; }
    update("rooms", [...form.rooms, { ...roomDraft, id: Date.now() }]);
    setRoomDraft({ ...defaultRoom, id: Date.now() + 1 });
    setRoomErrors({});
  };

  const removeRoom = (id) => update("rooms", form.rooms.filter((r) => r.id !== id));

  // ── Publish ──
  const handlePublish = async () => {
    setIsPublishing(true);
    setPublishError(null);

    try {
      const formData = new FormData();

      if (form.coverImage) formData.append("coverImage", form.coverImage);

      const SCALAR_FIELDS = [
        "eventName", "category", "description", "tagline",
        "registrationOpen", "registrationClose", "eventStart", "eventEnd",
        "submissionDeadline", "resultsDate",
        "mode", "venueName", "venueAddress", "city", "onlineLink",
        "minTeamSize", "maxTeamSize", "skills", "openTo",
        "firstPrize", "secondPrize", "thirdPrize", "totalPool",
      ];
      SCALAR_FIELDS.forEach((key) => {
        if (form[key] !== null && form[key] !== undefined) formData.append(key, form[key]);
      });

      formData.append("eligibleFor", JSON.stringify(form.eligibleFor));

      if (isSeminar) {
        formData.append("rooms", JSON.stringify(form.rooms.map(({ id, ...rest }) => rest)));
      } else {
        formData.append("rooms", JSON.stringify([]));
      }

      const token = localStorage.getItem("token");

      // 1. Create the event
      const res = await fetch("http://localhost:5000/api/events", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to create event");
      }

      const { event } = await res.json(); // backend must return { event: { _id, ... } }

      // 2. If Quiz, save questions to /api/quiz
      if (isQuiz && form.questions.length > 0) {
        const questionsPayload = form.questions.map(({ id, ...rest }) => rest);
        console.log(questionsPayload); // drop local id
        console.log(event._id); // drop local id
        const quizRes = await fetch("http://localhost:5000/api/quiz", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ eventId: event._id, questions: questionsPayload }),
        });

        if (!quizRes.ok) {
          const err = await quizRes.json();
          throw new Error(err.message || "Event created but quiz questions failed to save");
        }
      }

      setSubmitted(true);
    } catch (err) {
      setPublishError(err.message);
    } finally {
      setIsPublishing(false);
    }
  };

  const progress = ((step - 1) / (totalSteps - 1)) * 100;
  const currentStepKey = STEPS[step - 1]?.key;

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
    <div className="create-event">
      <div className="ec-root">
        <header className="ec-header">
          <div className="ec-header-left">
            <span className="ec-logo-icon">
              <img src={logo} alt="logo" style={{ width: "50px", height: "50px" }} />
            </span>
            <span className="ec-logo-text">Event Sphere</span>
          </div>
          <div className="ec-step-badge">Step {step} of {totalSteps}</div>
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
              STEP {step}: {STEPS[step - 1]?.label?.toUpperCase()}
            </div>

            {/* ── STEP 1: Event Details ── */}
            {currentStepKey === "details" && (
              <div className="ec-section">
                <h1 className="ec-title">Event Details</h1>
                <p className="ec-subtitle">Lay the foundation for your event. Be clear, concise, and compelling to attract the right participants.</p>
                <div className="ec-two-col">
                  <div className="ec-col-main">
                    <div className="ec-field">
                      <label>EVENT NAME</label>
                      <input className="ec-input" placeholder="e.g. Global Tech Summit 2025" maxLength={80} value={form.eventName} onChange={(e) => update("eventName", e.target.value)} />
                      <span className="ec-hint">{form.eventName.length}/80 characters</span>
                    </div>
                    <div className="ec-field">
                      <label>FULL DESCRIPTION</label>
                      <div className="ec-editor">
                        <textarea className="ec-textarea" placeholder="Tell your audience what makes this event unique..." value={form.description} onChange={(e) => update("description", e.target.value)} rows={6} />
                      </div>
                    </div>
                    <div className="ec-field">
                      <label>TAGLINE</label>
                      <input className="ec-input" placeholder="A short, punchy line that captures your event's spirit" maxLength={120} value={form.tagline} onChange={(e) => update("tagline", e.target.value)} />
                    </div>
                  </div>
                  <div className="ec-col-side">
                    <div className="ec-field">
                      <label>EVENT CATEGORY</label>
                      <div className="ec-category-list">
                        {CATEGORIES.map((cat) => (
                          <button key={cat} className={`ec-category-btn ${form.category === cat ? "selected" : ""}`} onClick={() => update("category", cat)}>
                            {cat}
                            {form.category === cat && <span className="ec-check">✓</span>}
                          </button>
                        ))}
                      </div>
                      {isSeminar && <p className="ec-seminar-hint">🪑 Seminar events include a room & seat setup step.</p>}
                      {isQuiz    && <p className="ec-seminar-hint">❓ Quiz events include a question builder step.</p>}
                    </div>
                    <div className="ec-field">
                      <label>COVER IMAGE</label>
                      <div className="ec-upload-zone" onClick={() => fileRef.current.click()}
                        style={coverPreview ? { backgroundImage: `url(${coverPreview})`, backgroundSize: "cover", backgroundPosition: "center" } : {}}>
                        {!coverPreview && (<><span className="ec-upload-icon">⊞</span><p>Upload Cover Image</p><span className="ec-upload-hint">Drag and drop or click to browse.<br />Recommendation: 1920×1080px.</span></>)}
                        {coverPreview && <div className="ec-upload-overlay">Change Image</div>}
                      </div>
                      <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleCover} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 2: Timeline ── */}
            {currentStepKey === "timeline" && (
              <div className="ec-section">
                <h1 className="ec-title">Timeline & Venue</h1>
                <p className="ec-subtitle">Define your event's schedule and location to help participants plan ahead.</p>
                <div className="ec-two-col">
                  <div className="ec-col-main">
                    <div className="ec-card1">
                      <div className="ec-card-header1"><span className="ec-card-icon1">◷</span> Key Dates & Deadlines</div>
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
                            <input type="datetime-local" className="ec-input ec-date-input" value={form[key]} onChange={(e) => update(key, e.target.value)} />
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
                          ].filter((item) => form[item.key]).map((item) => (
                            <div key={item.key} className="ec-tl-node" style={{ "--node-color": item.color }}>
                              <div className="ec-tl-dot" />
                              <div className="ec-tl-node-label">{item.label}</div>
                              <div className="ec-tl-date">{new Date(form[item.key]).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</div>
                            </div>
                          ))}
                          <div className="ec-tl-line" />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="ec-col-side">
                    <div className="ec-card1">
                      <div className="ec-card-header1"><span className="ec-card-icon1">📍</span> Venue</div>
                      <div className="ec-mode-tabs">
                        {["in-person", "online"].map((m) => (
                          <button key={m} className={`ec-mode-tab ${form.mode === m ? "active" : ""}`} onClick={() => update("mode", m)}>
                            {m === "in-person" ? "🏢 In-Person" : "💻 Online"}
                          </button>
                        ))}
                      </div>
                      {(form.mode === "in-person" || form.mode === "hybrid") && (
                        <>
                          <div className="ec-field ec-field-sm"><label>VENUE NAME</label><input className="ec-input" placeholder="e.g. IIT Delhi Auditorium" value={form.venueName} onChange={(e) => update("venueName", e.target.value)} /></div>
                          <div className="ec-field ec-field-sm"><label>FULL ADDRESS</label><input className="ec-input" placeholder="Street address..." value={form.venueAddress} onChange={(e) => update("venueAddress", e.target.value)} /></div>
                          <div className="ec-field ec-field-sm"><label>CITY</label><input className="ec-input" placeholder="e.g. New Delhi" value={form.city} onChange={(e) => update("city", e.target.value)} /></div>
                        </>
                      )}
                      {(form.mode === "online" || form.mode === "hybrid") && (
                        <div className="ec-field ec-field-sm"><label>ONLINE LINK / PLATFORM</label><input className="ec-input" placeholder="https://meet.google.com/..." value={form.onlineLink} onChange={(e) => update("onlineLink", e.target.value)} /></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 3: Eligibility ── */}
            {currentStepKey === "eligibility" && (
              <div className="ec-section">
                <h1 className="ec-title">Eligibility & Prizes</h1>
                <p className="ec-subtitle">Define who can participate and what they stand to win.</p>
                <div className="ec-two-col">
                  <div className="ec-col-main">
                    <div className="ec-card1">
                      <div className="ec-card-header1"><span className="ec-card-icon1">👥</span> Team Settings</div>
                      <div className="ec-field">
                        <label>OPEN TO</label>
                        <div className="ec-radio-group">
                          {["everyone", "students", "professionals"].map((opt) => (
                            <label key={opt} className={`ec-radio-btn ${form.openTo === opt ? "selected" : ""}`}>
                              <input type="radio" name="openTo" value={opt} checked={form.openTo === opt} onChange={() => update("openTo", opt)} />
                              {opt.charAt(0).toUpperCase() + opt.slice(1)}
                            </label>
                          ))}
                        </div>
                      </div>
                      <div className="ec-row-two">
                        <div className="ec-field"><label>MIN TEAM SIZE</label><input type="number" className="ec-input" min={1} max={10} value={form.minTeamSize} onChange={(e) => update("minTeamSize", e.target.value)} /></div>
                        <div className="ec-field"><label>MAX TEAM SIZE</label><input type="number" className="ec-input" min={1} max={10} value={form.maxTeamSize} onChange={(e) => update("maxTeamSize", e.target.value)} /></div>
                      </div>
                      <div className="ec-field">
                        <label>ELIGIBLE BACKGROUNDS</label>
                        <div className="ec-tag-group">
                          {["B.Tech/BE", "MCA/MSc", "MBA", "High School", "Working Professional", "Any"].map((opt) => (
                            <button key={opt} className={`ec-tag-btn ${form.eligibleFor.includes(opt) ? "selected" : ""}`} onClick={() => toggleEligible(opt)}>{opt}</button>
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
                    <div className="ec-card1">
                      <div className="ec-card-header1"><span className="ec-card-icon1">🏆</span> Prize Pool</div>
                      <div className="ec-prize-total">
                        <label className="ec-prize-pool-label">TOTAL PRIZE POOL (₹ or $)</label>
                        <input className="ec-input ec-prize-total-input" placeholder="e.g. ₹1,00,000" value={form.totalPool} onChange={(e) => update("totalPool", e.target.value)} />
                      </div>
                      {[{ rank: "🥇 1st Place", key: "firstPrize", colorClass: "prize-gold" }, { rank: "🥈 2nd Place", key: "secondPrize", colorClass: "prize-silver" }, { rank: "🥉 3rd Place", key: "thirdPrize", colorClass: "prize-bronze" }].map(({ rank, key, colorClass }) => (
                        <div className={`ec-prize-row ${colorClass}`} key={key}>
                          <span className="ec-prize-rank">{rank}</span>
                          <input className="ec-input ec-prize-input" placeholder="Amount / Benefit" value={form[key]} onChange={(e) => update(key, e.target.value)} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 4 (Seminar only): Room Setup ── */}
            {currentStepKey === "venue" && isSeminar && (
              <div className="ec-section">
                <h1 className="ec-title">Room & Seat Setup</h1>
                <p className="ec-subtitle">Configure seating rooms for your seminar. Participants will be able to pick their seat during registration.</p>
                <div className="ec-two-col">
                  <div className="ec-col-main">
                    <div className="ec-card1">
                      <div className="ec-card-header1"><span className="ec-card-icon1">🪑</span> Add a Room</div>
                      <div className="ec-two-col-inner">
                        <div className="ec-field">
                          <label>ROOM NAME</label>
                          <input className={`ec-input${roomErrors.name ? " ec-input--error" : ""}`} placeholder="e.g. Hall A" value={roomDraft.name} onChange={(e) => updateRoom("name", e.target.value)} />
                          {roomErrors.name && <span className="ec-field-error">{roomErrors.name}</span>}
                        </div>
                        <div className="ec-field">
                          <label>ROOM TYPE</label>
                          <select className="ec-input" value={roomDraft.type} onChange={(e) => updateRoom("type", e.target.value)}>
                            {ROOM_TYPES.map((t) => <option key={t}>{t}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className="ec-row-three">
                        <div className="ec-field">
                          <label>ROWS</label>
                          <input type="number" min={1} max={20} className={`ec-input${roomErrors.rows ? " ec-input--error" : ""}`} value={roomDraft.rows} onChange={(e) => updateRoom("rows", Number(e.target.value))} />
                          {roomErrors.rows && <span className="ec-field-error">{roomErrors.rows}</span>}
                        </div>
                        <div className="ec-field">
                          <label>SEATS / ROW</label>
                          <input type="number" min={1} max={20} className={`ec-input${roomErrors.cols ? " ec-input--error" : ""}`} value={roomDraft.cols} onChange={(e) => updateRoom("cols", Number(e.target.value))} />
                          {roomErrors.cols && <span className="ec-field-error">{roomErrors.cols}</span>}
                        </div>
                        <div className="ec-field">
                          <label>VIP ROWS (front)</label>
                          <input type="number" min={0} max={roomDraft.rows} className={`ec-input${roomErrors.vipRows ? " ec-input--error" : ""}`} value={roomDraft.vipRows} onChange={(e) => updateRoom("vipRows", Number(e.target.value))} />
                          {roomErrors.vipRows && <span className="ec-field-error">{roomErrors.vipRows}</span>}
                        </div>
                      </div>
                      <div className="ec-room-capacity-bar">
                        <span className="ec-room-capacity-label">
                          Total capacity: <strong>{roomDraft.rows * roomDraft.cols} seats</strong>
                          {roomDraft.vipRows > 0 && <> · <span className="ec-vip-count">{roomDraft.vipRows * roomDraft.cols} VIP</span></>}
                        </span>
                      </div>
                      <button className="ec-btn-add-room" onClick={addRoom}>+ Add Room</button>
                    </div>
                    {form.rooms.length > 0 && (
                      <div className="ec-added-rooms">
                        <div className="ec-added-rooms-title">Added Rooms ({form.rooms.length})</div>
                        {form.rooms.map((r) => (
                          <div key={r.id} className="ec-added-room-item">
                            <div className="ec-added-room-left">
                              <span className="ec-added-room-name">{r.name}</span>
                              <span className="ec-added-room-badge">{r.type}</span>
                            </div>
                            <div className="ec-added-room-stats">
                              <span>{r.rows} rows × {r.cols} cols</span>
                              <span className="ec-added-room-total">{r.rows * r.cols} seats</span>
                              {r.vipRows > 0 && <span className="ec-added-room-vip">{r.vipRows * r.cols} VIP</span>}
                            </div>
                            <button className="ec-added-room-remove" onClick={() => removeRoom(r.id)}>✕</button>
                          </div>
                        ))}
                        <div className="ec-total-capacity">
                          Total event capacity: <strong>{form.rooms.reduce((a, r) => a + r.rows * r.cols, 0)} seats</strong>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="ec-col-side">
                    <div className="ec-card1">
                      <div className="ec-card-header1"><span className="ec-card-icon1">👁</span> Seat Preview</div>
                      <RoomPreviewGrid rows={roomDraft.rows} cols={roomDraft.cols} vipRows={roomDraft.vipRows} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 4 (Quiz only): Quiz Questions ── */}
            {currentStepKey === "questions" && isQuiz && (
              <div className="ec-section">
                <h1 className="ec-title">Quiz Questions</h1>
                <p className="ec-subtitle">
                  Add MCQ questions for your quiz. Set points and per-question time limits. Mark the correct answer for each.
                </p>

                <div className="ec-quiz-stats-bar">
                  <span className="ec-quiz-stat">
                    <strong>{form.questions.length}</strong> question{form.questions.length !== 1 ? "s" : ""}
                  </span>
                  <span className="ec-quiz-stat">
                    <strong>{form.questions.reduce((s, q) => s + q.points, 0)}</strong> total points
                  </span>
                  <span className="ec-quiz-stat">
                    <strong>{form.questions.reduce((s, q) => s + q.timeLimit, 0)}s</strong> estimated duration
                  </span>
                </div>

                {form.questions.length === 0 && (
                  <div className="ec-quiz-empty">
                    <span className="ec-quiz-empty-icon">❓</span>
                    <p>No questions yet. Add your first question below.</p>
                  </div>
                )}

                <div className="ec-questions-list">
                  {form.questions.map((q, idx) => (
                    <QuestionCard
                      key={q.id}
                      q={q}
                      index={idx}
                      onChange={(updated) => updateQuestion(idx, updated)}
                      onRemove={() => removeQuestion(idx)}
                    />
                  ))}
                </div>

                <button className="ec-btn-add-question" onClick={addQuestion}>
                  + Add Question
                </button>
              </div>
            )}

            {/* ── REVIEW STEP ── */}
            {currentStepKey === "review" && (
              <div className="ec-section">
                <h1 className="ec-title">Review & Publish</h1>
                <p className="ec-subtitle">Confirm all details before your event goes live.</p>
                <div className="ec-review-grid">
                  <div className="ec-review-card">
                    <div className="ec-review-header">◈ Event Details</div>
                    <div className="ec-review-row"><span>Name</span><strong>{form.eventName || "—"}</strong></div>
                    <div className="ec-review-row"><span>Category</span><strong>{form.category}</strong></div>
                    <div className="ec-review-row"><span>Tagline</span><strong>{form.tagline || "—"}</strong></div>
                    {form.description && <div className="ec-review-desc">{form.description.slice(0, 120)}{form.description.length > 120 ? "..." : ""}</div>}
                  </div>
                  <div className="ec-review-card">
                    <div className="ec-review-header">◷ Timeline</div>
                    {[["Reg. Opens", form.registrationOpen], ["Reg. Closes", form.registrationClose], ["Event Start", form.eventStart], ["Event End", form.eventEnd], ["Submission", form.submissionDeadline], ["Results", form.resultsDate]].map(([label, val]) => (
                      <div className="ec-review-row" key={label}><span>{label}</span><strong>{val ? new Date(val).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "—"}</strong></div>
                    ))}
                  </div>
                  <div className="ec-review-card">
                    <div className="ec-review-header">📍 Venue</div>
                    <div className="ec-review-row"><span>Mode</span><strong>{form.mode}</strong></div>
                    <div className="ec-review-row"><span>Venue</span><strong>{form.venueName || "—"}</strong></div>
                    <div className="ec-review-row"><span>City</span><strong>{form.city || "—"}</strong></div>
                    {form.onlineLink && <div className="ec-review-row"><span>Link</span><strong>{form.onlineLink}</strong></div>}
                  </div>
                  <div className="ec-review-card">
                    <div className="ec-review-header">◉ Eligibility & Prizes</div>
                    <div className="ec-review-row"><span>Open To</span><strong>{form.openTo}</strong></div>
                    <div className="ec-review-row"><span>Team Size</span><strong>{form.minTeamSize}–{form.maxTeamSize} members</strong></div>
                    <div className="ec-review-row"><span>Backgrounds</span><strong>{form.eligibleFor.length ? form.eligibleFor.join(", ") : "All"}</strong></div>
                    <div className="ec-review-row"><span>Prize Pool</span><strong>{form.totalPool || "—"}</strong></div>
                    <div className="ec-review-row"><span>1st Place</span><strong>{form.firstPrize || "—"}</strong></div>
                    <div className="ec-review-row"><span>2nd Place</span><strong>{form.secondPrize || "—"}</strong></div>
                  </div>

                  {/* Seminar rooms */}
                  {isSeminar && (
                    <div className="ec-review-card ec-review-card--full">
                      <div className="ec-review-header">🪑 Room Setup</div>
                      {form.rooms.length === 0 ? (
                        <div className="ec-review-row"><span>Rooms</span><strong>None added</strong></div>
                      ) : (
                        <>
                          {form.rooms.map((r) => (
                            <div className="ec-review-row" key={r.id}>
                              <span>{r.name} <em style={{ color: "#888", fontWeight: 400 }}>({r.type})</em></span>
                              <strong>{r.rows} × {r.cols} = {r.rows * r.cols} seats{r.vipRows > 0 ? ` · ${r.vipRows * r.cols} VIP` : ""}</strong>
                            </div>
                          ))}
                          <div className="ec-review-row">
                            <span>Total Capacity</span>
                            <strong>{form.rooms.reduce((a, r) => a + r.rows * r.cols, 0)} seats</strong>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* Quiz questions summary */}
                  {isQuiz && (
                    <div className="ec-review-card ec-review-card--full">
                      <div className="ec-review-header">❓ Quiz Questions</div>
                      {form.questions.length === 0 ? (
                        <div className="ec-review-row"><span>Questions</span><strong>None added</strong></div>
                      ) : (
                        <>
                          <div className="ec-review-row">
                            <span>Total Questions</span><strong>{form.questions.length}</strong>
                          </div>
                          <div className="ec-review-row">
                            <span>Total Points</span>
                            <strong>{form.questions.reduce((s, q) => s + q.points, 0)}</strong>
                          </div>
                          <div className="ec-review-row">
                            <span>Est. Duration</span>
                            <strong>{form.questions.reduce((s, q) => s + q.timeLimit, 0)}s</strong>
                          </div>
                          <div className="ec-review-questions-list">
                            {form.questions.map((q, idx) => (
                              <div key={q.id} className="ec-review-question-item">
                                <span className="ec-review-q-num">Q{idx + 1}</span>
                                <span className="ec-review-q-text">{q.questionText || <em style={{color:"#888"}}>No question text</em>}</span>
                                <span className="ec-review-q-answer">
                                  ✓ {q.options[q.correctOptionIndex] || <em style={{color:"#888"}}>No answer set</em>}
                                </span>
                                <span className="ec-review-q-pts">{q.points}pt</span>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}
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
                {step < totalSteps ? (
                  <button className="ec-btn-primary" onClick={() => setStep(step + 1)}>
                    CONTINUE TO {STEPS[step]?.label?.toUpperCase()} →
                  </button>
                ) : (
                  <div className="ec-publish-wrapper">
                    {publishError && <p className="ec-error-msg">⚠ {publishError}</p>}
                    <button className="ec-btn-publish" onClick={handlePublish} disabled={isPublishing}>
                      {isPublishing ? "⏳ Publishing..." : "🚀 PUBLISH EVENT"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default EventCreation;