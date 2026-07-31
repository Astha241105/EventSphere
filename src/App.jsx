import { Routes, Route, useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./auth/login.jsx";
import VerifyCode from "./auth/otpverification.jsx";
import Signup from "./auth/signup.jsx";
import ResetPassword from "./auth/forgotpass.jsx";
import Profile from "./auth/profile.jsx";
import Home from "./dashboard/home.jsx";
import EventCreation from "./createevent/create.jsx";
import EventDetails from "./eventDetails/details.jsx";
import EventVideoRoom from "./videoCall/EventVideoRoom.jsx";
import ForgotPasswordOTP from "./auth/ForgotPasswordOTP.jsx";
import NewPassword from "./auth/NewPassword.jsx";
import DiscoverEvents from "./allEvents/Discoverevents.jsx";
import myEvents from "./dashboard_for_host/MyEvents";
// import Analytics from "./dashboard_for_host/Analytics";
import Attendees from "./dashboard_for_host/Attendees";
import TeamPage from "./teampage/teampage.jsx";
import SeatBookingPage from "./seatbooking/Seatbookingpage.jsx";
import QuizPage from "./quiz/quizPage.jsx";
import QuizResultsPage from "./quiz/leaderboard.jsx";



function SeminarRoomWrapper() {
  const { eventId } = useParams();
  return <EventVideoRoom eventId={eventId} />;
}

function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ResetPassword />} />
      <Route path="/forgot-password-otp" element={<ForgotPasswordOTP />} />
      <Route path="/reset-password-form" element={<NewPassword />} />
      <Route path="/otp" element={<VerifyCode />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/dashboard" element={<Home />} />
      <Route path="/create" element={<EventCreation />} />
      <Route path="/event/:id" element={<EventDetails />} />
      <Route path="/semdiscover-eventsinar/:eventId" element={<SeminarRoomWrapper />} />
      <Route path="/discover-events" element={<DiscoverEvents />} />
      <Route path="/my-events" element={<MyEvents />} />
      {/* <Route path="/analytics" element={<Analytics />} /> */}
      <Route path="/attendees" element={<Attendees />} />
      <Route path="/event/:eventId/team" element={<TeamPage />} />
      <Route path="/seat-allocation/:eventId" element={<SeatBookingPage />} />
      <Route path="/event/:eventId/room" element={<EventVideoRoom />} />
      <Route path="/event/:eventId/quiz" element={<QuizPage />} />
      <Route path="/event/:eventId/quiz-results" element={<QuizResultsPage />} />
    </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
        </>
  );
}

export default App;