import "./OtpVerification.css";

function OtpVerification() {
  return (
    <div className="otp-container">

      {/* LEFT SECTION */}
      <div className="otp-left">
        <div className="otp-left-overlay">

          {/* Brand */}
          <div className="brand">
            <span className="brand-icon">📅</span>
            <span className="brand-name">Evently</span>
          </div>

          <h1>
            Connect with the <br />
            world's best <br />
            professional <br />
            community.
          </h1>

          <p>
            Manage events, build networks, and grow your professional
            presence with our all-in-one platform.
          </p>

          <div className="stats">
            <div className="stat-card">
              <h3>10k+</h3>
              <span>Active Events</span>
            </div>
            <div className="stat-card">
              <h3>500k+</h3>
              <span>Community Members</span>
            </div>
          </div>

        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="otp-right">
        <div className="otp-card">

          <div className="icon-circle">🛡️</div>

          <h2>Enter Verification Code</h2>
          <p className="subtitle">
            We’ve sent a 6-digit code to your registered email and mobile
            number ending in <b>8892</b>
          </p>

          <div className="otp-inputs">
            <input maxLength="1" />
            <input maxLength="1" />
            <input maxLength="1" />
            <input maxLength="1" />
            <input maxLength="1" />
            <input maxLength="1" />
          </div>

          <div className="otp-info">
            <span>⏱ Expires in <b>01:59</b></span>
            <button className="resend">Resend Code</button>
          </div>

          <button className="verify-btn">
            Verify & Continue
          </button>

          <p className="footer-text">
            By continuing, you agree to our security protocols and
            role-based access control policies.
          </p>

          <div className="secure-note">
            — SECURE RBAC AUTHENTICATION —
          </div>

        </div>
      </div>

    </div>
  );
}

export default OtpVerification;
