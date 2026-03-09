import "./forgotpass.css";
import AuthIllustrationBg from "./background";

function ResetPassword() {
  return (
    <div className="reset-container">

      {/* LEFT BACKGROUND (DESKTOP ONLY) */}
      <AuthIllustrationBg />

      {/* RIGHT / MAIN CONTENT */}
      <div className="reset-right">
        <div className="reset-card">

          {/* Header */}
          <div className="reset-header">
            <span className="back-arrow">←</span>
            <span className="reset-title">Reset Password</span>
          </div>

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
            we’ll send you a link to reset your password.
          </p>

          {/* Form */}
          <form className="reset-form">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="e.g. name@company.com"
            />

            <button className="reset-btn">
              Send Reset Link →
            </button>
          </form>

          {/* Footer */}
          <div className="reset-footer">
            ← Back to Login
          </div>

        </div>
      </div>

    </div>
  );
}

export default ResetPassword;
