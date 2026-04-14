import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./otpverification.css";
import AuthIllustrationBg from "./background";

const API_BASE = "http://localhost:5000/api";

function VerifyCode() {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [timer, setTimer] = useState(119);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  useEffect(() => {
    if (timer <= 0) return;
    const id = setTimeout(() => setTimer(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timer]);

  const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const handleChange = (index, e) => {
    const val = e.target.value.replace(/\D/g, "").slice(-1);
    const updated = [...otp];
    updated[index] = val;
    setOtp(updated);
    setError("");
    if (val && index < 5) inputRefs.current[index + 1].focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const updated = Array(6).fill("");
    pasted.split("").forEach((ch, i) => (updated[i] = ch));
    setOtp(updated);
    const nextEmpty = updated.findIndex(v => !v);
    inputRefs.current[nextEmpty === -1 ? 5 : nextEmpty].focus();
  };

  const handleResend = async () => {
    setOtp(Array(6).fill(""));
    setTimer(119);
    setError("");
    inputRefs.current[0].focus();
    try {
      await fetch(`${API_BASE}/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {
      setError("Failed to resend OTP. Please try again.");
    }
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length < 6) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: code }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        navigate("/");
      } else {
        setError(data.message || "Incorrect code. Please try again.");
        setOtp(Array(6).fill(""));
        inputRefs.current[0].focus();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const allFilled = otp.every(v => v !== "");

  return (
    <div className="verify-container">

      {/* LEFT BACKGROUND */}
      <AuthIllustrationBg />

      {/* RIGHT SIDE */}
      <div className="verify-right">
        <div className="verify-card">

          <h2>Enter Verification Code</h2>

          <p className="subtitle">
            We've sent a 6-digit code to <strong>{email}</strong>
          </p>

          {/* OTP INPUTS */}
          <div className="otp-box">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={el => (inputRefs.current[i] = el)}
                maxLength="1"
                value={digit}
                inputMode="numeric"
                onChange={e => handleChange(i, e)}
                onKeyDown={e => handleKeyDown(i, e)}
                onPaste={handlePaste}
              />
            ))}
          </div>

          {error && <p className="error-msg">{error}</p>}

          <p className="timer">
            ⏱ Expires in <span>{formatTime(timer)}</span>
          </p>

          <button className="resend" onClick={handleResend} disabled={timer > 0}>
            Resend Code
          </button>

          <button className="verify-btn" onClick={handleVerify} disabled={!allFilled || loading}>
            {loading ? "Verifying..." : "Verify & Continue"}
          </button>

        </div>
      </div>

    </div>
  );
}

export default VerifyCode;