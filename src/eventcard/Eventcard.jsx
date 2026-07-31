import { useNavigate } from "react-router-dom";
import "./Eventcard.css";

const CATEGORY_CONFIG = {
  Seminar:  { label: "SEMINARS",  btnLabel: "Register", btnClass: "ec-card__btn--blue" },
  Hackathon:{ label: "HACKATHONS",btnLabel: "Register", btnClass: "ec-card__btn--blue" },
  Webinar:  { label: "WEBINARS",  btnLabel: "Register", btnClass: "ec-card__btn--blue" },
  Quiz:     { label: "QUIZZES",   btnLabel: "Register", btnClass: "ec-card__btn--blue" },
};

const formatDate = (iso) => {
  if (!iso) return "Date To Be Announced";
  const d = new Date(iso);
  return (
    d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) +
    " • " +
    d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
  );
};

const formatDateRange = (start, end) => {
  if (!start) return "Date To Be Announced";
  const s = new Date(start);
  if (!end) return s.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const e = new Date(end);
  return (
    s.toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
    " - " +
    e.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  );
};

const EventCard = ({ event, onClick }) => {
  const navigate = useNavigate();
  const config = CATEGORY_CONFIG[event.category] || CATEGORY_CONFIG["Seminar"];

  const isOnline   = event.mode === "online";
  const isHybrid   = event.mode === "hybrid";
  const isInPerson = event.mode === "in-person";
  const locationLine =
    isInPerson || isHybrid
      ? [event.venueName, event.city].filter(Boolean).join(", ")
      : null;

  // ── Card click → event detail page ──────────────────────────
  const handleClick = () => {
    if (onClick) { onClick(event); return; }
    navigate(`/event/${event._id}`);  // fixed: was "/events"
  };

  // ── Register button ──────────────────────────────────────────
  const handleBtn = async (e) => {
    e.stopPropagation();
    const isQuizLive = event.category === "Quiz" &&
  event.eventStart && new Date(event.eventStart) <= new Date() &&
  (!event.eventEnd || new Date(event.eventEnd) >= new Date());

// in handleBtn, replace the Webinar/Quiz branch:
if (event.category === "Quiz") {
  if (isQuizLive) {
    navigate(`/event/${event._id}/quiz`);
    return;
  }
  // fall through to existing registration POST logic for pre-start registration
}
    // Seminar → seat allocation
    if (event.category === "Seminar") {
      navigate(`/seat-allocation/${event._id}`);
      return;
    }

    // Hackathon → team page  (fixed: was /team/:id, now matches route /event/:eventId/team)
    if (event.category === "Hackathon") {
      navigate(`/event/${event._id}/team`);
      return;
    }

    // Webinar & Quiz → register directly then show success
    if (event.category === "Webinar" || event.category === "Quiz") {
      try {
        const response = await fetch("/api/registrations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ eventId: event._id }),
        });

        const data = await response.json();

        if (response.ok) {
          navigate(`/registration-success/${event._id}`);
        } else {
          alert(data.message || "Registration failed");
        }
      } catch (error) {
        console.error(error);
        alert("Something went wrong");
      }
    }
  };

  return (
    <div
      className="ec-card"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
    >
      {/* Thumbnail */}
      <div className="ec-card__thumb">
        {event.coverImage ? (
          <img src={`https://eventsphere-backend-he6w.onrender.com${event.coverImage}`} alt={event.eventName} />
        ) : (
          <div className="ec-card__thumb-placeholder" />
        )}
      </div>

      {/* Body */}
      <div className="ec-card__body">
        <h3 className="ec-card__title">{event.eventName}</h3>

        {event.tagline && <p className="ec-card__tagline">{event.tagline}</p>}

        <div className="ec-card__meta-row">
          <span className="ec-card__meta-icon">📅</span>
          <span className="ec-card__meta-text">
            {event.category === "Hackathon"
              ? formatDateRange(event.eventStart, event.eventEnd)
              : formatDate(event.eventStart)}
          </span>
        </div>

        {event.category === "Hackathon" && (
          <div className="ec-card__meta-row">
            <span className="ec-card__meta-icon">👥</span>
            <span className="ec-card__meta-text">
              Team Size: {event.minTeamSize} - {event.maxTeamSize}
            </span>
          </div>
        )}

        {locationLine && (
          <div className="ec-card__meta-row">
            <span className="ec-card__meta-icon">📍</span>
            <span className="ec-card__meta-text">{locationLine}</span>
          </div>
        )}

        <div className="ec-card__meta-row">
          <span className="ec-card__meta-icon">🌐</span>
          <span className="ec-card__meta-text">
            {isHybrid ? "Hybrid Event" : isOnline ? "Virtual Event" : "In-Person Event"}
          </span>
        </div>

        {event.registrationOpen && (
          <div className="ec-card__meta-row">
            <span className="ec-card__meta-icon">📝</span>
            <span className="ec-card__meta-text">
              Registration Opens: {new Date(event.registrationOpen).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>

      {/* Right */}
      <div className="ec-card__right">
        <span className="ec-card__badge">{config.label}</span>
        {event.status && (
          <span className={`ec-card__status status-${event.status}`}>
            {event.status.toUpperCase()}
          </span>
        )}
        <button className={`ec-card__btn ${config.btnClass}`} onClick={handleBtn}>
  {isQuizLive ? "Start Quiz" : config.btnLabel}
</button>
      </div>
    </div>
  );
};

export default EventCard;