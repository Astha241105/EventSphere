import "./forgotpass.css";
import AuthIllustrationBg from "./background";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function ResetPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      alert("Please enter your email");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(data.message);

        // Navigate to OTP page and pass email
        navigate("/forgot-password-otp", {
          state: { email },
        });
      } else {
        alert(data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-container">
      {/* LEFT BACKGROUND */}
      <AuthIllustrationBg />

      {/* RIGHT / MAIN CONTENT */}
      <div className="reset-right">
        <div className="reset-card">

          {/* Illustration */}
          <div className="reset-illustration">
            <div
              className="thinking-illustration"
              data-alt="Illustration of a person thinking calmly"
            ></div>
          </div>

          {/* Text */}
          <h2>Forgot Your Password?</h2>

          <p className="reset-subtitle">
            No worries! Enter the email associated with your account and
            we'll send you an OTP to reset your password.
          </p>

          {/* Form */}
          <form className="reset-form" onSubmit={handleSendOTP}>
            <label>Email Address</label>

            <input
              type="email"
              placeholder="e.g. name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button
              type="submit"
              className="reset-btn"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}

export default ResetPassword;