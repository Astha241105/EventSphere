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

        </div>
      </div>

    </div>
  );
}

export default ResetPassword;
