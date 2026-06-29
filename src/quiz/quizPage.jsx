// QuizPage.jsx
import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./QuizPage.css";

const BASE = "http://localhost:5000/api/quiz";
const headers = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export default function QuizPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({}); // questionIndex -> selectedOption
  const [timeLeft, setTimeLeft] = useState(null);
  const [submitted, setSubmitted] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${BASE}/${eventId}/play`, { headers: headers() });
        const data = await res.json();
        if (!res.ok) {
          setError(data.message || "Could not load quiz");
        } else {
          setQuiz(data);
          setTimeLeft(data.questions[0]?.timeLimit || 30);
        }
      } catch (err) {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [eventId]);

  const handleNext = useCallback(() => {
    setCurrent((c) => {
      if (c + 1 >= (quiz?.questions.length || 0)) return c;
      setTimeLeft(quiz.questions[c + 1].timeLimit || 30);
      return c + 1;
    });
  }, [quiz]);

  // Per-question countdown
  useEffect(() => {
    if (!quiz || timeLeft === null || submitted) return;
    if (timeLeft <= 0) {
      handleNext();
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, quiz, submitted, handleNext]);

  const selectOption = (qIndex, optionIndex) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: optionIndex }));
  };

  const handleSubmit = async () => {
    const payload = {
      answers: Object.entries(answers).map(([questionIndex, selectedOption]) => ({
        questionIndex: Number(questionIndex),
        selectedOption,
      })),
    };
    try {
      const res = await fetch(`${BASE}/${quiz.quizId}/submit`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Submission failed");
        return;
      }
      setSubmitted(data.attempt);
    } catch (err) {
      setError("Network error during submission");
    }
  };

  if (loading) return <div className="quiz-page__state">Loading quiz…</div>;

  if (error) {
    return (
      <div className="quiz-page__state">
        <p>{error}</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="quiz-page__state">
        <h2>Quiz Submitted 🎉</h2>
        <p>Your score: {submitted.score} / {submitted.totalPoints}</p>
        <button onClick={() => navigate(-1)}>Back to Event</button>
      </div>
    );
  }

  const question = quiz.questions[current];
  const isLast = current === quiz.questions.length - 1;

  return (
    <div className="quiz-page">
      <div className="quiz-page__header">
        <span>Question {current + 1} / {quiz.questions.length}</span>
        <span className="quiz-page__timer">{timeLeft}s</span>
      </div>

      <h2 className="quiz-page__question">{question.questionText}</h2>

      <div className="quiz-page__options">
        {question.options.map((opt, i) => (
          <button
            key={i}
            className={`quiz-page__option ${answers[current] === i ? "quiz-page__option--selected" : ""}`}
            onClick={() => selectOption(current, i)}
          >
            {opt}
          </button>
        ))}
      </div>

      <div className="quiz-page__nav">
        {!isLast ? (
          <button className="quiz-page__btn" onClick={handleNext}>Next →</button>
        ) : (
          <button className="quiz-page__btn quiz-page__btn--submit" onClick={handleSubmit}>
            Submit Quiz
          </button>
        )}
      </div>
    </div>
  );
}