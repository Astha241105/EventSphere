import "./forgotpass.css";
import AuthIllustrationBg from "./background";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";

function NewPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
  e.preventDefault();

  if (!password || !confirmPassword) {
    toast.error("Please fill all fields");
    return;
  }

  if (password !== confirmPassword) {
    toast.error("Passwords do not match");
    return;
  }

  if (password.length < 6) {
    toast.error("Password must be at least 6 characters long");
    return;
  }

  setLoading(true);

  try {
    const response = await fetch(
      "https://eventsphere-backend-he6w.onrender.com/api/auth/reset-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      toast.success("Password reset successful!");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } else {
      toast.error(data.message || "Failed to reset password");
    }
  } catch (error) {
    console.error(error);
    toast.error("Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="reset-container">
      {/* LEFT BACKGROUND */}
      <AuthIllustrationBg />

      {/* RIGHT SIDE */}
      <div className="reset-right">
        <div className="reset-card">

          {/* Illustration */}
          <div className="reset-illustration">
            <div
              className="thinking-illustration"
              data-alt="Illustration"
            ></div>
          </div>

          {/* Text */}
          <h2>Create New Password</h2>

          <p className="reset-subtitle">
            Your new password must be different from your previous password.
          </p>

          {/* Form */}
          <form
            className="reset-form"
            onSubmit={handleResetPassword}
          >
            <label>New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              required
            />

            <button
              type="submit"
              className="reset-btn"
              disabled={loading}
            >
              {loading ? "Updating..." : "Reset Password"}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}

export default NewPassword;