import React from "react";
import AuthIllustrationBg from "./background";
import "./login.css";

const LoginForm = () => {
  return (
    <div className="login-container">

      <AuthIllustrationBg />

      <div className="right-container">

        <div className="login-card">

          <h2>Welcome Back</h2>

          <p className="subtitle">
            Log in to your account to manage your events.
          </p>

          <form>

            <label>Email Address</label>

            <div className="input-box">
              <span className="icon">✉</span>
              <input type="email" placeholder="alex@techcompany.com" />
            </div>

            <div className="password-row">
              <label>Password</label>
              <span className="forgot">Forgot Password?</span>
            </div>

            <div className="input-box">
              <span className="icon">🔒</span>
              <input type="password" placeholder="••••••••" />
              <span className="eye">👁</span>
            </div>

            <div className="remember">
              <input type="checkbox" />
              <span>Remember me for 30 days</span>
            </div>

            <button className="login-btn">Log In</button>

          </form>

          <div className="divider">
            <span>Or continue with</span>
          </div>

          <div className="social-login">
            <button className="social-btn">Google</button>
            <button className="social-btn">GitHub</button>
          </div>

          <p className="signup">
            Don’t have an account? <span>Sign up for free</span>
          </p>

        </div>

      </div>

    </div>
  );
};

export default LoginForm;