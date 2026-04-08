import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./signup.css";
import AuthIllustrationBg from "./background";

const API_BASE = "http://localhost:5000/api";

function SignUp() {
  const [role, setRole] = useState("participant");
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Registration failed.");
        return;
      }

      navigate("/otp", { state: { email: formData.email } });
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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

          {error && <p className="msg error">{error}</p>}

          {/* ROLE SELECT */}
          <div className="role-section">
            <label>Choose your role</label>
            <p className="role-sub">Select how you want to use the platform</p>
            <div className="roles">
              <button
                type="button"
                className={`role ${role === "participant" ? "active" : ""}`}
                onClick={() => setRole("participant")}
              >
                👤 Participant
              </button>
              <button
                type="button"
                className={`role ${role === "host" ? "active" : ""}`}
                onClick={() => setRole("host")}
              >
                🎤 Host
              </button>
            </div>
          </div>

          <form className="signup-form" onSubmit={handleRegister}>
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label>Password</label>
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span className="eye" onClick={() => setShowPassword((p) => !p)}>
                {showPassword ? "🙈" : "👁"}
              </span>
            </div>

            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Repeat your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            <button className="submit-btn" type="submit" disabled={loading}>
              {loading ? "Sending OTP..." : "Create Account →"}
            </button>
          </form>

        </div>
      </div>

    </div>
  );
}

export default SignUp;