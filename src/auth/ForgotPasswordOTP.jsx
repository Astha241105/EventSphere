import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./otpverification.css";
import AuthIllustrationBg from "./background";
import { toast } from "react-toastify";

const API_BASE = "http://localhost:5000/api";

function ForgotPasswordOTP() {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [timer, setTimer] = useState(119);
  const [loading, setLoading] = useState(false);

  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  useEffect(() => {
    if (timer <= 0) return;

    const id = setTimeout(() => setTimer((t) => t - 1), 1000);

    return () => clearTimeout(id);
  }, [timer]);

  const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(
      s % 60
    ).padStart(2, "0")}`;

  const handleChange = (index, e) => {
    const val = e.target.value.replace(/\D/g, "").slice(-1);

    const updated = [...otp];
    updated[index] = val;
    setOtp(updated);

    if (val && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    const updated = Array(6).fill("");

    pasted.split("").forEach((ch, i) => {
      updated[i] = ch;
    });

    setOtp(updated);

    const nextEmpty = updated.findIndex((v) => !v);
    inputRefs.current[nextEmpty === -1 ? 5 : nextEmpty]?.focus();
  };

  // RESEND OTP
  const handleResend = async () => {
    setOtp(Array(6).fill(""));
    setTimer(119);

    try {
      const res = await fetch(
        `${API_BASE}/auth/verify-reset-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("OTP resent successfully!");
      } else {
        toast.error(data.message || "Failed to resend OTP");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  // VERIFY OTP
  const handleVerify = async () => {
    const code = otp.join("");

    if (code.length < 6) {
      toast.error("Please enter complete OTP");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${API_BASE}/auth/verify-reset-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp: code,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("OTP verified successfully");

        setTimeout(() => {
          navigate("/reset-password-form", {
            state: { email },
          });
        }, 1000);
      } else {
        toast.error(data.message || "Invalid OTP");

        setOtp(Array(6).fill(""));
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const allFilled = otp.every((v) => v !== "");

  return (
    <div className="verify-container">
      <AuthIllustrationBg />

      <div className="verify-right">
        <div className="verify-card">
          <h2>Verify Reset OTP</h2>

          <p className="subtitle">
            We've sent a 6-digit code to <strong>{email}</strong>
          </p>

          <div className="otp-box">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                maxLength="1"
                value={digit}
                inputMode="numeric"
                onChange={(e) => handleChange(i, e)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={handlePaste}
              />
            ))}
          </div>

          <p className="timer">
            ⏱ Expires in <span>{formatTime(timer)}</span>
          </p>

          <button
            className="resend"
            onClick={handleResend}
            disabled={timer > 0}
          >
            Resend Code
          </button>

          <button
            className="verify-btn"
            onClick={handleVerify}
            disabled={!allFilled || loading}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordOTP;