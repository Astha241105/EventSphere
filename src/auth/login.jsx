import "./login.css";

function Login() {
  return (
    <div className="login-container">

      {/* LEFT SECTION */}
      <div className="login-left">
        <div className="overlay">
          <h1>Host unforgettable moments.</h1>
          <p>
            Manage your events, network with professionals,
            and scale your reach with our all-in-one platform.
          </p>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="login-right">
        <div className="login-box">

          <div className="logo">ava</div>

          <h2>Welcome Back</h2>
          <p className="subtitle">
            Log in to your account to continue.
          </p>

          <button className="social-btn google">
            Continue with Google
          </button>

          <button className="social-btn facebook">
            Continue with Facebook
          </button>

          <div className="divider">
            <span>OR EMAIL</span>
          </div>

          <form className="login-form">
            <label>Email Address</label>
            <input type="email" placeholder="name@example.com" />

            <div className="password-row">
              <label>Password</label>
              <a href="#">Forgot Password?</a>
            </div>

            <input type="password" placeholder="••••••••" />

            <div className="remember">
              <input type="checkbox" />
              <span>Remember me for 30 days</span>
            </div>

            <button className="login-btn">
              Log In
            </button>
          </form>

          <p className="signup-text">
            Don’t have an account? <a href="#">Sign up for free</a>
          </p>

        </div>
      </div>

    </div>
  );
}

export default Login;
