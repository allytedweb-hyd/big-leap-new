"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { httpClient } from "../../utils/api";
import styles from "./ClassesList.module.css";

interface QuizQuestion {
  questionText: string;
  options: string[];
  marks: number;
}

interface QuizData {
  quizId: string;
  title: string;
  description: string;
  passingScore: number;
  totalMarks: number;
  questions: QuizQuestion[];
  attemptsCount: number;
}

interface ResultQuestion {
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  selectedOptionIndex: number;
  isCorrect: boolean;
  explanation: string;
  marks: number;
}

interface QuizResult {
  attemptNumber: number;
  score: number;
  totalMarks: number;
  percentage: number;
  passed: boolean;
  passingScore: number;
  results: ResultQuestion[];
}

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 12H5M5 12l7 7M5 12l7-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function TakeQuiz() {
  const params = useParams();
  const router = useRouter();
  const courseId = params?.courseId as string;
  const chapterId = params?.chapterId as string;

  const studentId = (() => {
    if (typeof window === "undefined") return "";
    try {
      const raw = localStorage.getItem("student");
      return raw ? JSON.parse(raw)?._id ?? "" : "";
    } catch {
      return "";
    }
  })();

  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<QuizResult | null>(null);

  useEffect(() => {
    if (!courseId || !chapterId || !studentId) {
      setError("You must be logged in to take this quiz.");
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const { data } = await httpClient.get(
          `/student/courses/${courseId}/chapters/${chapterId}/quiz`,
          { params: { studentId } }
        );
        setQuiz(data);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load quiz.");
      } finally {
        setLoading(false);
      }
    })();
  }, [courseId, chapterId, studentId]);

  const selectAnswer = (qIdx: number, optIdx: number) => {
    if (result) return; // locked after submit
    setAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleSubmit = async () => {
    if (!quiz) return;
    if (Object.keys(answers).length !== quiz.questions.length) {
      setError("Please answer all questions before submitting.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const payload = {
        studentId,
        answers: Object.entries(answers).map(([qIdx, optIdx]) => ({
          questionIndex: Number(qIdx),
          selectedOptionIndex: optIdx,
        })),
      };
      const { data } = await httpClient.post(
        `/student/courses/${courseId}/chapters/${chapterId}/quiz/submit`,
        payload
      );
      setResult(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to submit quiz.");
    } finally {
      setSubmitting(false);
    }
  };

  const retakeQuiz = () => {
    setResult(null);
    setAnswers({});
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>Loading quiz...</div>
      </div>
    );
  }

  if (error && !quiz) {
    return (
      <div className={styles.page}>
        <div className={styles.errorBox}>
          <p>{error}</p>
          <button className={styles.backBtn} onClick={() => router.back()}>
            <BackIcon /> Go back
          </button>
        </div>
      </div>
    );
  }

  if (!quiz) return null;

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={() => router.back()}>
          <BackIcon /> Back to Quizzes
        </button>
        <div className={styles.topBarTitle}>
          <span className={styles.topBarCourse}>{quiz.title}</span>
          <span className={styles.topBarTech}>
            {quiz.attemptsCount > 0 ? `Attempt ${quiz.attemptsCount + 1}` : "First Attempt"}
          </span>
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "28px 20px 80px" }}>

        {/* ── RESULT VIEW ── */}
        {result ? (
          <>
            <div
              style={{
                background: result.passed ? "#f0fdf4" : "#fff7ed",
                border: `1px solid ${result.passed ? "#bbf7d0" : "#fed7aa"}`,
                borderRadius: 14,
                padding: 24,
                textAlign: "center",
                marginBottom: 24,
              }}
            >
              <div style={{ fontSize: 32, fontWeight: 800, color: result.passed ? "#16a34a" : "#f97316" }}>
                {result.score} / {result.totalMarks}
              </div>
              <div style={{ fontSize: 14, color: "#64748b", marginTop: 4 }}>
                {Math.round(result.percentage)}% — {result.passed ? "Passed" : "Not Passed"}
              </div>
              <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 8 }}>
                Passing score: {result.passingScore} · Attempt #{result.attemptNumber}
              </div>
              <button
                onClick={retakeQuiz}
                style={{
                  marginTop: 16, padding: "9px 20px", background: "#f97316",
                  color: "#fff", border: "none", borderRadius: 9, fontWeight: 600,
                  fontSize: 13, cursor: "pointer",
                }}
              >
                Retake Quiz
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {result.results.map((r, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "#fff", border: "1px solid #eef0f4",
                    borderRadius: 12, padding: 18,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <span style={{ fontWeight: 600, fontSize: 14, color: "#1e293b" }}>
                      Q{idx + 1}. {r.questionText}
                    </span>
                    <span style={{
                      fontSize: 12, fontWeight: 700,
                      color: r.isCorrect ? "#16a34a" : "#ef4444",
                      whiteSpace: "nowrap", marginLeft: 12,
                    }}>
                      {r.isCorrect ? `+${r.marks}` : "0"} pts
                    </span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {r.options.map((opt, oIdx) => {
                      const isCorrectOpt = oIdx === r.correctOptionIndex;
                      const isSelectedOpt = oIdx === r.selectedOptionIndex;
                      let bg = "#fff", border = "#e2e8f0", color = "#334155";
                      if (isCorrectOpt) { bg = "#f0fdf4"; border = "#86efac"; color = "#16a34a"; }
                      if (isSelectedOpt && !isCorrectOpt) { bg = "#fef2f2"; border = "#fca5a5"; color = "#ef4444"; }

                      return (
                        <div
                          key={oIdx}
                          style={{
                            padding: "8px 12px", borderRadius: 7,
                            background: bg, border: `1px solid ${border}`,
                            color, fontSize: 13, fontWeight: isCorrectOpt || isSelectedOpt ? 600 : 400,
                            display: "flex", justifyContent: "space-between",
                          }}
                        >
                          <span>{opt}</span>
                          {isCorrectOpt && <span>✓ Correct</span>}
                          {isSelectedOpt && !isCorrectOpt && <span>Your answer</span>}
                        </div>
                      );
                    })}
                  </div>

                  {r.explanation && (
                    <div style={{
                      marginTop: 10, padding: "10px 12px", background: "#f8fafc",
                      borderRadius: 7, fontSize: 12.5, color: "#64748b", lineHeight: 1.5,
                    }}>
                      <strong style={{ color: "#475569" }}>Explanation: </strong>
                      {r.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* ── TAKE QUIZ VIEW ── */}
            {quiz.description && (
              <p style={{ fontSize: 14, color: "#64748b", marginBottom: 20 }}>{quiz.description}</p>
            )}

            {error && (
              <div style={{
                background: "#fef2f2", border: "1px solid #fca5a5", color: "#ef4444",
                padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 16,
              }}>
                {error}
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {quiz.questions.map((q, qIdx) => (
                <div
                  key={qIdx}
                  style={{ background: "#fff", border: "1px solid #eef0f4", borderRadius: 12, padding: 18 }}
                >
                  <div style={{ fontWeight: 600, fontSize: 14, color: "#1e293b", marginBottom: 12 }}>
                    Q{qIdx + 1}. {q.questionText}
                    <span style={{ fontWeight: 400, fontSize: 12, color: "#94a3b8", marginLeft: 8 }}>
                      ({q.marks} pt{q.marks !== 1 ? "s" : ""})
                    </span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {q.options.map((opt, oIdx) => {
                      const selected = answers[qIdx] === oIdx;
                      return (
                        <label
                          key={oIdx}
                          onClick={() => selectAnswer(qIdx, oIdx)}
                          style={{
                            display: "flex", alignItems: "center", gap: 10,
                            padding: "10px 14px", borderRadius: 8, cursor: "pointer",
                            border: `1.5px solid ${selected ? "#f97316" : "#e2e8f0"}`,
                            background: selected ? "#fff7ed" : "#fff",
                            fontSize: 13.5, color: selected ? "#c2410c" : "#334155",
                            fontWeight: selected ? 600 : 400,
                          }}
                        >
                          <span style={{
                            width: 16, height: 16, borderRadius: "50%",
                            border: `2px solid ${selected ? "#f97316" : "#cbd5e1"}`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            flexShrink: 0,
                          }}>
                            {selected && <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#f97316" }} />}
                          </span>
                          {opt}
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              style={{
                marginTop: 24, width: "100%", padding: "13px 0",
                background: "#f97316", color: "#fff", border: "none",
                borderRadius: 10, fontWeight: 700, fontSize: 14.5,
                cursor: submitting ? "not-allowed" : "pointer",
                opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? "Submitting..." : "Submit Quiz"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}