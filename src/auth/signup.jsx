import "./signup.css"
function SignUp() {
  return (
     <div className="signup-container">
      
      {/* LEFT SECTION */}
      <div className="signup-left">
        <div className="brand">
          <span className="logo">📅</span>
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

      {/* RIGHT SECTION */}
      <div className="signup-right">
        <div className="top-link">
          Already have an account? <a href="#">Log in</a>
        </div>

        <h2>Create Your Account</h2>
        <p className="subtitle">
          Join our platform to start managing or attending events today.
        </p>

        <div className="roles">
          <button className="role active">Participant</button>
          <button className="role">Host</button>
          <button className="role">Admin</button>
        </div>

        <form className="signup-form">
          <label>Full Name</label>
          <input type="text" placeholder="Enter your full name" />

          <label>Email Address</label>
          <input type="email" placeholder="name@example.com" />

          <label>Password</label>
          <input type="password" placeholder="Create a password" />

          <label>Confirm Password</label>
          <input type="password" placeholder="Repeat your password" />

          <div className="terms">
            <input type="checkbox" />
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
  );
  
}

export default SignUp
