import "./background.css";

function AuthIllustrationBg() {
  return (
    <div className="auth-illustration-bg">

      {/* Overlay */}
      <div className="auth-overlay">

        {/* Brand */}
        <div className="auth-brand">
          <div className="brand-icon">📅</div>
          <span>Evently</span>
        </div>

        {/* Content */}
        <div className="auth-content">
          <h1>
            Connect with the <br />
            world's best <br />
            professional <br />
            community.
          </h1>

          <p>
            Manage events, build networks, and grow your
            professional presence with our all-in-one platform.
          </p>

          {/* Stats */}
          <div className="auth-stats">
            <div className="stat-box">
              <h3>10k+</h3>
              <span>Active Events</span>
            </div>
            <div className="stat-box">
              <h3>500k+</h3>
              <span>Community Members</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AuthIllustrationBg;
