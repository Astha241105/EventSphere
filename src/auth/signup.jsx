import "./signup.css";
import AuthIllustrationBg from "./background";

function SignUp() {
  return (
    <div className="signup-container">

      {/* LEFT BACKGROUND */}
      <AuthIllustrationBg />

      {/* RIGHT SIDE */}
      <div className="signup-right">

        <div className="signup-card">

          <div className="card-header">
            <span className="back">←</span>
            <h3>Create Your Account</h3>
          </div>

          <div className="icon-box">📅</div>

          <h2>Join Evently</h2>
          <p className="subtitle">
            Start managing and attending world-class events
          </p>

          {/* ROLE SELECT */}
          <div className="role-section">

            <label>Choose your role</label>
            <p className="role-sub">
              Select how you want to use the platform
            </p>

            <div className="roles">
              <button className="role active">👤 Participant</button>
              <button className="role">🎤 Host</button>
              <button className="role">🛠 Admin</button>
            </div>

          </div>

          <form className="signup-form">

            <label>Full Name</label>
            <input type="text" placeholder="John Doe" />

            <label>Email Address</label>
            <input type="email" placeholder="name@example.com" />

            <label>Password</label>
            <div className="password-field">
              <input type="password" placeholder="••••••••••••" />
              <span className="eye">👁</span>
            </div>

            <div className="password-strength">
              <span>STRONG PASSWORD</span>
              <div className="strength-bar">
                <div></div>
              </div>
            </div>

            <label>Confirm Password</label>
            <input type="password" placeholder="Repeat your password" />

            <div className="terms">
              <input type="checkbox" defaultChecked />
              <span>
                I agree to the <a href="#">Terms & Conditions</a> and{" "}
                <a href="#">Privacy Policy</a>
              </span>
            </div>

            <button className="submit-btn">
              Create Account →
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}

export default SignUp;