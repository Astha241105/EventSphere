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
            <h3 className="card-title">Create Your Account</h3>
          </div>

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

            <label>Confirm Password</label>
            <input type="password" placeholder="Repeat your password" />
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