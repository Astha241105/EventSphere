import { useState ,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../eventDetails/details.css";
import { toast } from "react-toastify";
import "../createevent/create.css";
import "./home.css";
import logo from "../assets/logo.svg";

function Home() {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching:", query);
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false);
const [role, setRole] = useState("");
const navigate = useNavigate();

useEffect(() => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (token) {
    setIsLoggedIn(true);
    setRole(userRole);
  }
}, []);

const handleCreateEvent = () => {
  // User not logged in
    const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  if (!token) {
    toast.warning("Please login to host an event");
    return;
  }

  // Logged in but participant
  if (role === "participant") {
    toast.warning("Please login as a host to create an event");
    return;
  }

  // Host can create events
  if (role === "host") {
    navigate("/create");
  }
};
  return (
    <div className="home">

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-logo">
          <span className="logo-icon">
            <img src={logo} alt="logo" id="logo" />
          </span>
          <span className="logo-text">EventSphere</span>
        </div>
        <ul className="nav-links">
  {role === "host" ? (
    <>
      <li>
        <a onClick={() => navigate("/create")}>
          Create Event
        </a>
      </li>

      <li>
        <a onClick={() => navigate("/my-events")}>
          My Events
        </a>
      </li>

      <li>
        <a onClick={() => navigate("/attendees")}>
          Attendees
        </a>
      </li>

      {/* <li>
        <a onClick={() => navigate("/analytics")}>
          Analytics
        </a>
      </li> */}
    </>
  ) : (
    <>
     <li><a onClick={() => navigate("/discover-events?category=Seminars")} style={{cursor:"pointer"}}>Seminar</a></li>
<li><a onClick={() => navigate("/discover-events?category=Webinars")} style={{cursor:"pointer"}}>Webinar</a></li>
<li><a onClick={() => navigate("/discover-events?category=Hackathons")} style={{cursor:"pointer"}}>Hackathon</a></li>
<li><a onClick={() => navigate("/discover-events?category=Quizzes")} style={{cursor:"pointer"}}>Quiz</a></li>
    </>
  )}
</ul>
        <div className="nav-actions">
  {!isLoggedIn ? (
    <>
      <a
        className="login-link"
        onClick={() => navigate("/login")}
      >
        Log In
      </a>

      <a
        className="get-started-btn"
        onClick={() => navigate("/signup")}
      >
        Get Started
      </a>
    </>
  ) : (
  <div className="profile-menu">
  <button className="profile-btn">👤 My Account</button>
  <div className="dropdown">
    <button onClick={() => navigate("/profile")}>
      Profile
    </button>

    <button
      onClick={() => {
        localStorage.clear();
        navigate("/");
        window.location.reload();
      }}
    >
      Logout
    </button>
  </div>
</div>
  )}
</div>
      </nav>

      {/* HERO */}
      <section className="hero">

        <h1 className="hero-title">
          Discover and Host<br />
          <span className="hero-accent">Amazing Tech Events</span>
        </h1>

        <p className="hero-subtitle">
          The all-in-one platform to find, join, and host the world's most<br />
          innovative tech gatherings. Connect with 50k+ developers worldwide.
        </p>

        <div className="hero-cta">
          <button className="btn-primary" onClick={() => navigate("/discover-events")}>
            <span className="btn-icon">◎</span> Explore Events
          </button>
          <button className="btn-secondary" onClick={handleCreateEvent}>
  <span className="btn-icon">⊕</span> Host an Event
</button>
        </div>

        {/* SEARCH BAR */}
        <form className="search-bar" onSubmit={handleSearch}>
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by name , category or mode"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="search-btn">Search</button>
        </form>

      </section>

      {/* STATS */}
      <section className="stats">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">GLOBAL EVENTS</span>
            <span className="stat-globe">🌐</span>
          </div>
          <div className="stat-number">10k+</div>
          <p className="stat-desc">Active events spanning 45 countries and 120+ tech stacks.</p>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">ACTIVE PARTICIPANTS</span>
            <span className="stat-people">👥</span>
          </div>
          <div className="stat-number">50k+</div>
          <p className="stat-desc">Verified developers, designers, and tech leaders engaged daily.</p>
        </div>
      </section>

    </div>
  );
}

export default Home;