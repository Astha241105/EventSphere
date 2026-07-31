import React, { useState } from "react";
import AuthIllustrationBg from "./background";
import "./login.css";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
 const API_BASE = "https://eventsphere-backend-he6w.onrender.com/api";
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch(
        `${API_BASE}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const response = await res.json();
      // console.log("Login response:", response);
      // Store in localStorage
      localStorage.setItem("token", response.token);
      localStorage.setItem("role", response.user.role);

      // Navigate after successful login
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);

      alert(
        error.response?.data?.message || "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <AuthIllustrationBg />

      <div className="right-container">
        <div className="login-card">
          <h2>Welcome Back</h2>

          <p className="subtitle">
            Log in to your account to manage your events.
          </p>

          <form onSubmit={handleLogin}>
            <label>Email Address</label>

            <div className="input-box">
              <span className="icon">✉</span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="password-row">
              <label>Password</label>
              <span
                className="forgot"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot Password?
              </span>
            </div>

           <div className="input-box">
      <span className="icon">🔒</span>

      <input
        type={showPassword ? "text" : "password"}
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="••••••••"
        required
      />

      <span
        className="eye1"
        onClick={() => setShowPassword(!showPassword)}
        style={{ cursor: "pointer" }}
      >
        {showPassword ? "🙈" : "👁"}
      </span>
    </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <p className="signup">
            Don’t have an account?{" "}
            <span onClick={() => navigate("/signup")}>
              Sign up for free
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;