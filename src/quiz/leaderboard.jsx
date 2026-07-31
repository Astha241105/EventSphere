// QuizResultsPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./QuizPage.css";

const BASE = "https://eventsphere-backend-he6w.onrender.com/api/quiz";

export default function QuizResultsPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${BASE}/${eventId}/results`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const json = await res.json();
        if (!res.ok) setError(json.message || "Could not load results");
        else setData(json);
      } catch (err) {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [eventId]);

  if (loading) return <div className="quiz-page__state">Loading results…</div>;
  if (error) return <div className="quiz-page__state"><p>{error}</p></div>;

  return (
    <div className="quiz-page">
      <h2>Quiz Results</h2>
      <p>{data.totalAttempts} participant{data.totalAttempts !== 1 ? "s" : ""} submitted</p>

      <table className="quiz-results__table">
        <thead>
          <tr><th>Rank</th><th>Name</th><th>Score</th><th>Submitted</th></tr>
        </thead>
        <tbody>
          {data.leaderboard.map((row) => (
            <tr key={row.userId}>
              <td>{row.rank}</td>
              <td>{row.name}</td>
              <td>{row.score} / {data.totalPoints}</td>
              <td>{new Date(row.submittedAt).toLocaleTimeString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  );
}