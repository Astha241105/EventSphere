import React from "react";
import AuthIllustrationBg from "./background";
import "./login.css";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const navigate = useNavigate();
  return (
    <div className="login-container">

      <AuthIllustrationBg />

      <div className="right-container">

        <div className="login-card">

          <h2 >Welcome Back</h2>

          <p className="subtitle">
            Log in to your account to manage your events.
          </p>

          <form>

            <label>Email Address</label>

            <div className="input-box">
              <span className="icon">✉</span>
              <input type="email" />
            </div>

            <div className="password-row">
              <label>Password</label>
              <span className="forgot" onClick={() => navigate("/forgot-password")}>
                Forgot Password?
              </span>
            </div>

            <div className="input-box">
              <span className="icon">🔒</span>
              <input type="password" placeholder="••••••••" />
              <span className="eye1">👁</span>
            </div>

            <button className="login-btn">Log In</button>

          </form>

          <p className="signup">
            Don’t have an account? <span onClick={() => navigate("/signup")}>Sign up for free</span>
          </p>

        </div>

      </div>

    </div>
  );
};

export default LoginForm;