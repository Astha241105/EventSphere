import { useState, useRef } from "react";

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #f0f2f8;
  --surface: #ffffff;
  --surface-2: #f7f8fc;
  --border: #e2e5f0;
  --border-hover: #c5cadf;
  --primary: #2a3cff;
  --primary-light: #eef0ff;
  --primary-hover: #1b2be0;
  --text: #0f1535;
  --text-2: #4a5178;
  --text-3: #8b91b5;
  --accent: #ff4c6a;
  --success: #22c87a;
  --warning: #f59e0b;
  --sidebar-w: 220px;
  --radius: 14px;
  --radius-sm: 8px;
  --shadow: 0 2px 16px rgba(42,60,255,0.07);
  --shadow-md: 0 6px 32px rgba(42,60,255,0.12);
}

body { font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--text); }

.ec-root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg);
  font-family: 'DM Sans', sans-serif;
}

.ec-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  height: 60px;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 8px rgba(0,0,0,0.05);
}

.ec-header-left { display: flex; align-items: center; gap: 10px; }
.ec-logo-icon { font-size: 22px; color: var(--primary); line-height: 1; }
.ec-logo-text {
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: 18px;
  color: var(--primary);
  letter-spacing: -0.3px;
}

.ec-step-badge {
  font-family: 'Syne', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-2);
  background: var(--primary-light);
  padding: 4px 14px;
  border-radius: 999px;
  letter-spacing: 0.3px;
}

.ec-layout { display: flex; flex: 1; min-height: calc(100vh - 60px); }

.ec-sidebar {
  width: var(--sidebar-w);
  background: var(--surface);
  border-right: 1px solid var(--border);
  padding: 28px 0 28px 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: sticky;
  top: 60px;
  height: calc(100vh - 60px);
  overflow-y: auto;
}

.ec-progress-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.2px;
  color: var(--text-3);
  padding-right: 24px;
}

.ec-progress-track {
  width: 3px;
  height: 100px;
  background: var(--border);
  border-radius: 99px;
  position: relative;
  overflow: hidden;
}

.ec-progress-fill {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  background: linear-gradient(to bottom, var(--primary), #6c7fff);
  border-radius: 99px;
  transition: height 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.ec-nav { display: flex; flex-direction: column; gap: 4px; }

.ec-nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 16px 9px 0;
  background: none;
  border: none;
  border-radius: var(--radius-sm) 0 0 var(--radius-sm);
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: var(--text-3);
  text-align: left;
  transition: all 0.18s ease;
  position: relative;
}
.ec-nav-item:hover { color: var(--text-2); background: var(--surface-2); }
.ec-nav-item.active { color: var(--primary); font-weight: 600; background: var(--primary-light); }
.ec-nav-item.active::after {
  content: '';
  position: absolute;
  right: 0;
  top: 0; bottom: 0;
  width: 3px;
  background: var(--primary);
  border-radius: 2px 0 0 2px;
}
.ec-nav-item.done { color: var(--success); }
.ec-nav-icon { font-size: 15px; width: 20px; text-align: center; flex-shrink: 0; }

.ec-pro-tip {
  margin-top: auto;
  display: flex;
  gap: 10px;
  padding: 14px 20px 14px 0;
  background: var(--surface-2);
  border-radius: var(--radius-sm) 0 0 var(--radius-sm);
  font-size: 12px;
  color: var(--text-2);
  line-height: 1.5;
}
.ec-tip-icon { font-size: 16px; flex-shrink: 0; }
.ec-pro-tip strong { display: block; font-size: 10px; letter-spacing: 1px; color: var(--text-3); margin-bottom: 3px; }

.ec-main {
  flex: 1;
  padding: 36px 48px 120px;
  max-width: 900px;
  overflow-y: auto;
}

.ec-step-tag {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.5px;
  color: var(--primary);
  background: var(--primary-light);
  display: inline-block;
  padding: 4px 12px;
  border-radius: 999px;
  margin-bottom: 14px;
}

.ec-title {
  font-family: 'Syne', sans-serif;
  font-size: 30px;
  font-weight: 800;
  color: var(--text);
  letter-spacing: -0.7px;
  margin-bottom: 8px;
}
.ec-subtitle {
  font-size: 14px;
  color: var(--text-2);
  line-height: 1.6;
  margin-bottom: 32px;
}

.ec-two-col { display: grid; grid-template-columns: 1fr 300px; gap: 24px; align-items: start; }

.ec-field { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
.ec-field label { font-size: 11px; font-weight: 700; letter-spacing: 1.2px; color: var(--text-3); }

.ec-input {
  width: 100%;
  padding: 11px 14px;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-sm);
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  color: var(--text);
  background: var(--surface);
  transition: border-color 0.15s, box-shadow 0.15s;
  outline: none;
}
.ec-input::placeholder { color: var(--text-3); }
.ec-input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(42,60,255,0.1); }
.ec-hint { font-size: 11px; color: var(--text-3); }

.ec-editor { border: 1.5px solid var(--border); border-radius: var(--radius-sm); overflow: hidden; background: var(--surface); transition: border-color 0.15s; }
.ec-editor:focus-within { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(42,60,255,0.1); }
.ec-toolbar { display: flex; gap: 4px; padding: 8px 12px; border-bottom: 1px solid var(--border); background: var(--surface-2); }
.ec-toolbar button { background: none; border: none; cursor: pointer; padding: 4px 8px; border-radius: 4px; font-size: 13px; color: var(--text-2); transition: background 0.12s; }
.ec-toolbar button:hover { background: var(--border); color: var(--text); }
.ec-textarea { width: 100%; padding: 14px; border: none; font-family: 'DM Sans', sans-serif; font-size: 14px; color: var(--text); background: transparent; resize: vertical; outline: none; min-height: 130px; line-height: 1.6; }
.ec-textarea::placeholder { color: var(--text-3); }

.ec-category-list { display: flex; flex-direction: column; gap: 6px; }
.ec-category-btn {
  display: flex; align-items: center; justify-content: space-between;
  padding: 9px 14px;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--surface);
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  color: var(--text-2);
  cursor: pointer;
  transition: all 0.15s;
  text-align: left;
}
.ec-category-btn:hover { border-color: var(--primary); color: var(--primary); background: var(--primary-light); }
.ec-category-btn.selected { border-color: var(--primary); background: var(--primary-light); color: var(--primary); font-weight: 600; }
.ec-check { display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; background: var(--primary); color: white; border-radius: 50%; font-size: 11px; flex-shrink: 0; }

.ec-upload-zone {
  border: 2px dashed var(--border);
  border-radius: var(--radius);
  padding: 28px 20px;
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  cursor: pointer;
  background: var(--surface-2);
  transition: all 0.18s;
  min-height: 140px;
  justify-content: center;
  text-align: center;
  position: relative;
  overflow: hidden;
}
.ec-upload-zone:hover { border-color: var(--primary); background: var(--primary-light); }
.ec-upload-icon { font-size: 28px; color: var(--text-3); }
.ec-upload-zone p { font-weight: 600; font-size: 14px; color: var(--text-2); }
.ec-upload-hint { font-size: 12px; color: var(--text-3); line-height: 1.5; }
.ec-upload-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.45); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; opacity: 0; transition: opacity 0.18s; }
.ec-upload-zone:hover .ec-upload-overlay { opacity: 1; }

.ec-card { background: var(--surface); border: 1.5px solid var(--border); border-radius: var(--radius); padding: 20px; margin-bottom: 20px; box-shadow: var(--shadow); }
.ec-card-header { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; color: var(--text); letter-spacing: 0.2px; margin-bottom: 18px; display: flex; align-items: center; gap: 8px; }
.ec-card-icon { font-size: 18px; }

.ec-dates-grid { display: flex; flex-direction: column; gap: 12px; }
.ec-date-row { display: flex; align-items: center; gap: 12px; }
.ec-date-label { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--text-2); min-width: 160px; flex-shrink: 0; }
.ec-date-input { flex: 1; font-size: 13px; }

.ec-timeline-visual { background: var(--text); border-radius: var(--radius); padding: 20px 24px; margin-top: 8px; }
.ec-tl-label { font-size: 10px; font-weight: 700; letter-spacing: 1.5px; color: rgba(255,255,255,0.4); margin-bottom: 20px; }
.ec-tl-track { position: relative; display: flex; align-items: flex-start; padding-bottom: 40px; }
.ec-tl-line { position: absolute; top: 10px; left: 10px; right: 10px; height: 2px; background: rgba(255,255,255,0.15); z-index: 0; }
.ec-tl-node { flex: 1; display: flex; flex-direction: column; align-items: center; position: relative; z-index: 1; }
.ec-tl-dot { width: 12px; height: 12px; border-radius: 50%; background: var(--node-color, #fff); border: 2px solid rgba(0,0,0,0.3); margin-bottom: 8px; box-shadow: 0 0 0 3px rgba(255,255,255,0.1); }
.ec-tl-node-label { font-size: 10px; font-weight: 600; color: rgba(255,255,255,0.7); text-align: center; }
.ec-tl-date { font-size: 10px; color: var(--node-color, #fff); margin-top: 2px; font-weight: 500; }

.ec-mode-tabs { display: flex; gap: 6px; margin-bottom: 18px; }
.ec-mode-tab { flex: 1; padding: 8px 6px; border: 1.5px solid var(--border); border-radius: var(--radius-sm); background: var(--surface-2); font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500; color: var(--text-2); cursor: pointer; transition: all 0.15s; text-align: center; }
.ec-mode-tab:hover { border-color: var(--primary); color: var(--primary); }
.ec-mode-tab.active { background: var(--primary); color: white; border-color: var(--primary); font-weight: 600; }
.ec-field-sm { margin-bottom: 12px; }

.ec-radio-group, .ec-tag-group { display: flex; flex-wrap: wrap; gap: 8px; }
.ec-radio-btn, .ec-tag-btn { padding: 7px 14px; border: 1.5px solid var(--border); border-radius: 999px; background: var(--surface); font-family: 'DM Sans', sans-serif; font-size: 13px; color: var(--text-2); cursor: pointer; transition: all 0.15s; font-weight: 500; }
.ec-radio-btn input { display: none; }
.ec-radio-btn:hover, .ec-tag-btn:hover { border-color: var(--primary); color: var(--primary); }
.ec-radio-btn.selected, .ec-tag-btn.selected { background: var(--primary); color: white; border-color: var(--primary); }

.ec-row-two { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

.ec-prize-total { margin-bottom: 18px; }
.ec-prize-total-input { font-size: 20px; font-weight: 700; color: var(--primary); }
.ec-prize-row { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; padding: 10px 12px; border-left: 3px solid var(--prize-color); border-radius: 0 var(--radius-sm) var(--radius-sm) 0; background: var(--surface-2); }
.ec-prize-rank { font-size: 14px; font-weight: 600; min-width: 100px; color: var(--text); }
.ec-prize-input { flex: 1; }

.ec-review-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }
.ec-review-card { background: var(--surface); border: 1.5px solid var(--border); border-radius: var(--radius); padding: 20px; box-shadow: var(--shadow); }
.ec-review-header { font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; color: var(--primary); letter-spacing: 0.5px; margin-bottom: 14px; padding-bottom: 10px; border-bottom: 1px solid var(--border); }
.ec-review-row { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; padding: 5px 0; font-size: 13px; }
.ec-review-row span { color: var(--text-3); flex-shrink: 0; }
.ec-review-row strong { color: var(--text); text-align: right; word-break: break-word; font-weight: 500; }
.ec-review-desc { font-size: 13px; color: var(--text-2); margin-top: 10px; line-height: 1.6; font-style: italic; }
.ec-review-cover { margin-top: 4px; }
.ec-cover-preview { width: 100%; max-height: 200px; object-fit: cover; border-radius: var(--radius); border: 1.5px solid var(--border); margin-top: 8px; }

.ec-footer {
  display: flex; align-items: center; justify-content: space-between;
  padding: 18px 48px;
  background: var(--surface);
  border-top: 1px solid var(--border);
  position: sticky;
  bottom: 0;
  z-index: 50;
  box-shadow: 0 -2px 16px rgba(0,0,0,0.06);
}
.ec-footer-right { display: flex; align-items: center; gap: 12px; }

.ec-btn-ghost, .ec-btn-secondary, .ec-btn-primary, .ec-btn-publish {
  padding: 11px 22px;
  border-radius: var(--radius-sm);
  font-family: 'Syne', sans-serif;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.8px;
  cursor: pointer;
  transition: all 0.18s;
  border: none;
  outline: none;
}
.ec-btn-ghost { background: none; color: var(--text-2); }
.ec-btn-ghost:hover { color: var(--text); background: var(--surface-2); }
.ec-btn-secondary { background: none; color: var(--primary); border: 1.5px solid var(--primary); }
.ec-btn-secondary:hover { background: var(--primary-light); }
.ec-btn-primary { background: var(--primary); color: white; box-shadow: 0 4px 14px rgba(42,60,255,0.3); }
.ec-btn-primary:hover { background: var(--primary-hover); transform: translateY(-1px); box-shadow: 0 6px 20px rgba(42,60,255,0.35); }
.ec-btn-publish { background: linear-gradient(135deg, #22c87a, #0ea560); color: white; box-shadow: 0 4px 14px rgba(34,200,122,0.3); }
.ec-btn-publish:hover { transform: translateY(-1px); box-shadow: 0 6px 22px rgba(34,200,122,0.4); }

.ec-success { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--bg); }
.ec-success-inner { background: var(--surface); border: 1.5px solid var(--border); border-radius: 20px; padding: 56px 64px; text-align: center; box-shadow: var(--shadow-md); max-width: 420px; }
.ec-success-icon { font-size: 52px; color: var(--primary); margin-bottom: 20px; animation: pulse 1.5s ease infinite; }
@keyframes pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.12); opacity: 0.8; } }
.ec-success-inner h2 { font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 800; color: var(--text); margin-bottom: 10px; }
.ec-success-inner p { font-size: 14px; color: var(--text-2); line-height: 1.6; margin-bottom: 28px; }

.ec-section { animation: slideUp 0.32s cubic-bezier(0.22, 1, 0.36, 1) both; }
@keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
`;

const STEPS = [
  { id: 1, key: "details", label: "Event Details", icon: "◈" },
  { id: 2, key: "timeline", label: "Timeline", icon: "◷" },
  { id: 3, key: "eligibility", label: "Eligibility", icon: "◉" },
  { id: 4, key: "review", label: "Review", icon: "◎" },
];

const CATEGORIES = ["Hackathon", "Workshop", "Conference", "Meetup", "Webinar", "Competition"];

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

  const progress = ((step - 1) / 3) * 100;

  if (submitted) {
    return (
      <>
        <style>{styles}</style>
        <div className="ec-success">
          <div className="ec-success-inner">
            <div className="ec-success-icon">✦</div>
            <h2>Event Created!</h2>
            <p>Your event <strong>"{form.eventName || "Untitled Event"}"</strong> has been submitted for review.</p>
            <button className="ec-btn-primary" onClick={() => { setSubmitted(false); setStep(1); setForm(defaultForm); setCoverPreview(null); }}>
              Create Another Event
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="ec-root">
        <header className="ec-header">
          <div className="ec-header-left">
            <span className="ec-logo-icon">⬡</span>
            <span className="ec-logo-text">Event Architect</span>
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
            <div className="ec-pro-tip">
              <span className="ec-tip-icon">💡</span>
              <div>
                <strong>PRO TIP</strong>
                <p>
                  {step === 1 && "High quality covers increase event engagement by up to 40%."}
                  {step === 2 && "Clear deadlines reduce last-minute drop-offs by 60%."}
                  {step === 3 && "Specific eligibility criteria improve team quality."}
                  {step === 4 && "Review all details before publishing your event."}
                </p>
              </div>
            </div>
          </aside>

          <main className="ec-main">
            <div className="ec-step-tag">STEP {step}: {["CONFIGURATION", "TIMELINE & VENUE", "ELIGIBILITY", "REVIEW"][step - 1]}</div>

            {step === 1 && (
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
                        <div className="ec-toolbar">
                          <button title="Bold"><b>B</b></button>
                          <button title="Italic"><i>I</i></button>
                          <button title="List">≡</button>
                          <button title="Link">⊞</button>
                          <button title="Image">⊡</button>
                        </div>
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
                    </div>
                    <div className="ec-field">
                      <label>COVER IMAGE</label>
                      <div className="ec-upload-zone" onClick={() => fileRef.current.click()}
                        style={coverPreview ? { backgroundImage: `url(${coverPreview})`, backgroundSize: "cover", backgroundPosition: "center" } : {}}>
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
                          ].filter(item => form[item.key]).map((item, i, arr) => (
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
                    <div className="ec-card">
                      <div className="ec-card-header"><span className="ec-card-icon">📍</span> Venue</div>
                      <div className="ec-mode-tabs">
                        {["in-person", "online", "hybrid"].map((m) => (
                          <button key={m} className={`ec-mode-tab ${form.mode === m ? "active" : ""}`} onClick={() => update("mode", m)}>
                            {m === "in-person" ? "🏢 In-Person" : m === "online" ? "💻 Online" : "🌐 Hybrid"}
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
                          {["everyone", "students", "professionals", "invite-only"].map((opt) => (
                            <label key={opt} className={`ec-radio-btn ${form.openTo === opt ? "selected" : ""}`}>
                              <input type="radio" name="openTo" value={opt} checked={form.openTo === opt} onChange={() => update("openTo", opt)} />
                              {opt.charAt(0).toUpperCase() + opt.slice(1).replace("-", " ")}
                            </label>
                          ))}
                        </div>
                      </div>
                      <div className="ec-row-two">
                        <div className="ec-field"><label>MIN TEAM SIZE</label><input type="number" className="ec-input" min={1} max={10} value={form.minTeamSize} onChange={(e) => update("minTeamSize", e.target.value)} /></div>
                        <div className="ec-field"><label>MAX TEAM SIZE</label><input type="number" className="ec-input" min={1} max={10} value={form.maxTeamSize} onChange={(e) => update("maxTeamSize", e.target.value)} /></div>
                      </div>
                      <div className="ec-row-two">
                        <div className="ec-field"><label>MIN AGE</label><input type="number" className="ec-input" placeholder="e.g. 16" value={form.ageMin} onChange={(e) => update("ageMin", e.target.value)} /></div>
                        <div className="ec-field"><label>MAX AGE</label><input type="number" className="ec-input" placeholder="No limit" value={form.ageMax} onChange={(e) => update("ageMax", e.target.value)} /></div>
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
                    <div className="ec-card">
                      <div className="ec-card-header"><span className="ec-card-icon">🏆</span> Prize Pool</div>
                      <div className="ec-prize-total">
                        <label style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "1.2px", color: "var(--text-3)", display: "block", marginBottom: "8px" }}>TOTAL PRIZE POOL (₹ or $)</label>
                        <input className="ec-input ec-prize-total-input" placeholder="e.g. ₹1,00,000" value={form.totalPool} onChange={(e) => update("totalPool", e.target.value)} />
                      </div>
                      {[
                        { rank: "🥇 1st Place", key: "firstPrize", color: "#fbbf24" },
                        { rank: "🥈 2nd Place", key: "secondPrize", color: "#94a3b8" },
                        { rank: "🥉 3rd Place", key: "thirdPrize", color: "#cd7c4b" },
                      ].map(({ rank, key, color }) => (
                        <div className="ec-prize-row" key={key} style={{ "--prize-color": color }}>
                          <span className="ec-prize-rank">{rank}</span>
                          <input className="ec-input ec-prize-input" placeholder="Amount / Benefit" value={form[key]} onChange={(e) => update(key, e.target.value)} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

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
                    {form.description && <div className="ec-review-desc">{form.description.slice(0, 120)}{form.description.length > 120 ? "..." : ""}</div>}
                  </div>
                  <div className="ec-review-card">
                    <div className="ec-review-header">◷ Timeline</div>
                    {[
                      ["Reg. Opens", form.registrationOpen], ["Reg. Closes", form.registrationClose],
                      ["Event Start", form.eventStart], ["Event End", form.eventEnd],
                      ["Submission", form.submissionDeadline], ["Results", form.resultsDate],
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
              <button className="ec-btn-ghost" onClick={() => step > 1 && setStep(step - 1)}>
                {step === 1 ? "Save Draft" : "← Back"}
              </button>
              <div className="ec-footer-right">
                <button className="ec-btn-secondary">SAVE DRAFT</button>
                {step < 4 ? (
                  <button className="ec-btn-primary" onClick={() => setStep(step + 1)}>
                    CONTINUE TO {["TIMELINE", "ELIGIBILITY", "REVIEW", ""][step - 1]} →
                  </button>
                ) : (
                  <button className="ec-btn-publish" onClick={() => setSubmitted(true)}>🚀 PUBLISH EVENT</button>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

export default EventCreation;