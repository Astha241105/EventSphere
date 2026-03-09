import "./otpverification.css";
import AuthIllustrationBg from "./background";

function VerifyCode() {
  return (
    <div className="verify-container">

      {/* LEFT BACKGROUND */}
      <AuthIllustrationBg />

      {/* RIGHT SIDE */}
      <div className="verify-right">

        <div className="verify-card">

          <div className="card-header">
            <span className="back">←</span>
            <span>Security Check</span>
          </div>

          <div className="shield-icon">
            🛡
          </div>

          <h2>Enter Verification Code</h2>

          <p className="subtitle">
            We've sent a 6-digit code to your registered email
          </p>

          {/* OTP INPUTS */}
          <div className="otp-box">
            <input maxLength="1"/>
            <input maxLength="1"/>
            <input maxLength="1"/>
            <input maxLength="1"/>
            <input maxLength="1"/>
            <input maxLength="1"/>
          </div>

          <p className="timer">
            ⏱ Expires in <span>01:59</span>
          </p>

          <button className="resend">Resend Code</button>

          <button className="verify-btn">
            Verify & Continue
          </button>

        </div>

      </div>

    </div>
  );
}

export default VerifyCode;