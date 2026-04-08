import { useState } from "react";
import "./home.css";

function Home() {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching:", query);
  };

  return (
    <div className="home">

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-logo">
          <span className="logo-icon">⚡</span>
          <span className="logo-text">Evently</span>
        </div>
        <ul className="nav-links">
          <li><a href="#">Explore</a></li>
          <li><a href="#">Pricing</a></li>
          <li><a href="#">Resources</a></li>
        </ul>
        <div className="nav-actions">
          <a href="#" className="login-link">Log In</a>
          <a href="#" className="get-started-btn">Get Started</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-badge">
          <span className="badge-dot">✦</span>
          NEW: AI-POWERED EVENT MATCHING
        </div>

        <h1 className="hero-title">
          Discover and Host<br />
          <span className="hero-accent">Amazing Tech Events</span>
        </h1>

        <p className="hero-subtitle">
          The all-in-one platform to find, join, and host the world's most<br />
          innovative tech gatherings. Connect with 50k+ developers worldwide.
        </p>

        <div className="hero-cta">
          <a href="#" className="btn-primary">
            <span className="btn-icon">◎</span> Explore Events
          </a>
          <a href="#" className="btn-secondary">
            <span className="btn-icon">⊕</span> Host an Event
          </a>
        </div>

        {/* SEARCH BAR */}
        <form className="search-bar" onSubmit={handleSearch}>
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search for hackathons, workshops, or conferences..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="search-btn">Search</button>
        </form>

        {/* PAGINATION DOTS */}
        <div className="hero-dots">
          <span className="dot active"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
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