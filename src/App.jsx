import { Routes, Route } from "react-router-dom";
import Login from "./auth/login.jsx";
import VerifyCode from "./auth/otpverification.jsx";
import Signup from "./auth/signup.jsx";
import ResetPassword from "./auth/forgotpass.jsx";
import Profile from "./auth/profile.jsx";

function App() {
  return (
    <Routes>

      <Route path="/" element={<Login />} />

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ResetPassword />} />
      <Route path="/otp" element={<VerifyCode />} />
      <Route path="/profile" element={<Profile />} />

    </Routes>
  );
}

export default App;