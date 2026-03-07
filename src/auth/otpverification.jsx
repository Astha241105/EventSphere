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
            We've sent a 6-digit code to your registered email and mobile
            device ending in <b>8892</b>
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

          <p className="policy">
            By continuing, you agree to our security protocols and role-based
            access control policies.
          </p>

          <div className="divider">
            SECURE RBAC AUTHENTICATION
          </div>

        </div>

      </div>

    </div>
  );
}

export default VerifyCode;