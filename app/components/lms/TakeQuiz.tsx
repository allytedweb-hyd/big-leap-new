"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { httpClient } from "../../utils/api";
import styles from "./TakeQuiz.module.css";

// ─── Types ─────────────────────────────────────────────────────────────────

interface QuizQuestion {
  questionText: string;
  options: string[];
  marks: number;
}

interface QuizForAttempt {
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

interface SubmitResult {
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

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#16a34a" strokeWidth="2.5">
      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#dc2626" strokeWidth="2.5">
      <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
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

  const [quiz, setQuiz] = useState<QuizForAttempt | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationMsg, setValidationMsg] = useState<string | null>(null);
  const [result, setResult] = useState<SubmitResult | null>(null);

  const fetchQuiz = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await httpClient.get(
        `/student/courses/${courseId}/chapters/${chapterId}/quiz`,
        { params: { studentId } }
      );
      setQuiz(data);
      setAnswers({});
      setResult(null);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load quiz.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!courseId || !chapterId || !studentId) {
      setError("You must be logged in to take this quiz.");
      setLoading(false);
      return;
    }
    fetchQuiz();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, chapterId, studentId]);

  const handleSelect = (questionIndex: number, optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
    setValidationMsg(null);
  };

  const handleSubmit = async () => {
    if (!quiz) return;

    const unanswered = quiz.questions
      .map((_, idx) => idx)
      .filter((idx) => answers[idx] === undefined);

    if (unanswered.length > 0) {
      setValidationMsg(
        `Please answer all questions before submitting. (${unanswered.length} remaining)`
      );
      return;
    }

    setSubmitting(true);
    setValidationMsg(null);
    try {
      const payload = {
        studentId,
        answers: quiz.questions.map((_, idx) => ({
          questionIndex: idx,
          selectedOptionIndex: answers[idx],
        })),
      };
      const { data } = await httpClient.post(
        `/student/courses/${courseId}/chapters/${chapterId}/quiz/submit`,
        payload
      );
      setResult(data);
    } catch (err: any) {
      setValidationMsg(err?.response?.data?.message || "Failed to submit quiz.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetake = () => {
    fetchQuiz();
  };

  // ─── Loading / Error states ────────────────────────────────────────────

  if (loading) {
    return (
      <div className={styles.page}>
        <div style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>Loading quiz...</div>
      </div>
    );
  }

  if (error) {
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

  // ─── Result view ────────────────────────────────────────────────────────

  if (result) {
    return (
      <div className={styles.page}>
        <div className={styles.topBar}>
          <button className={styles.backBtn} onClick={() => router.back()}>
            <BackIcon /> Back
          </button>
          <div className={styles.topBarTitle}>
            <span className={styles.topBarCourse}>{quiz.title}</span>
            <span className={styles.topBarTech}>Result</span>
          </div>
        </div>

        <div style={{ maxWidth: 760, margin: "0 auto", padding: "28px 20px 60px" }}>
          {/* Score summary card */}
          <div className={styles.resultCard}>
            <div className={`${styles.resultStatus} ${result.passed ? styles.passStatus : styles.failStatus}`}>
              {result.passed ? "PASSED" : "FAILED"}
            </div>
            <div className={styles.resultPercentage}>{Math.round(result.percentage)}%</div>
            <div className={styles.resultStatsRow}>
              <div className={styles.resultStat}>
                <span className={styles.resultStatLabel}>Score</span>
                <span className={styles.resultStatValue}>
                  {result.score} / {result.totalMarks}
                </span>
              </div>
              <div className={styles.resultStat}>
                <span className={styles.resultStatLabel}>Passing Score</span>
                <span className={styles.resultStatValue}>{result.passingScore}</span>
              </div>
              <div className={styles.resultStat}>
                <span className={styles.resultStatLabel}>Attempt</span>
                <span className={styles.resultStatValue}>#{result.attemptNumber}</span>
              </div>
            </div>
            <div className={styles.resultSubmittedAt}>
              Submitted {new Date().toLocaleString()}
            </div>
          </div>

          <div className={styles.reviewHeading}>Answer Review</div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {result.results.map((r, idx) => (
              <div key={idx} className={styles.reviewCard}>
                <div className={styles.reviewCardHeader}>
                  <span className={styles.reviewQNum}>Q{idx + 1}</span>
                  <span className={styles.reviewMarks}>
                    {r.isCorrect ? r.marks : 0} / {r.marks} marks
                  </span>
                  {r.isCorrect ? <CheckIcon /> : <CrossIcon />}
                </div>
                <div className={styles.reviewQText}>{r.questionText}</div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
                  {r.options.map((opt, optIdx) => {
                    const isSelected = optIdx === r.selectedOptionIndex;
                    const isCorrectOpt = optIdx === r.correctOptionIndex;
                    let cls = styles.reviewOption;
                    if (isCorrectOpt) cls += ` ${styles.optionCorrect}`;
                    else if (isSelected && !isCorrectOpt) cls += ` ${styles.optionWrong}`;

                    return (
                      <div key={optIdx} className={cls}>
                        <span>{opt}</span>
                        {isSelected && <span className={styles.reviewTag}>Your answer</span>}
                        {isCorrectOpt && !isSelected && (
                          <span className={styles.reviewTag}>Correct answer</span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {r.explanation && (
                  <div className={styles.explanationBox}>
                    <strong>Explanation:</strong> {r.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <button className={styles.retakeBtn} onClick={handleRetake}>
              Retake Quiz
            </button>
            <button className={styles.backBtn} onClick={() => router.back()}>
              <BackIcon /> Back to Chapters
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Quiz taking view ───────────────────────────────────────────────────

  const answeredCount = Object.keys(answers).length;

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={() => router.back()}>
          <BackIcon /> Back
        </button>
        <div className={styles.topBarTitle}>
          <span className={styles.topBarCourse}>{quiz.title}</span>
          <span className={styles.topBarTech}>
            {answeredCount}/{quiz.questions.length} answered
          </span>
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "28px 20px 100px" }}>
        {quiz.description && <p className={styles.quizDescription}>{quiz.description}</p>}

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {quiz.questions.map((q, qIdx) => (
            <div key={qIdx} className={styles.questionCard}>
              <div className={styles.questionHeader}>
                <span className={styles.qNumBadge}>{qIdx + 1}</span>
                <span className={styles.qText}>{q.questionText}</span>
                <span className={styles.qMarks}>{q.marks} marks</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
                {q.options.map((opt, optIdx) => {
                  const selected = answers[qIdx] === optIdx;
                  return (
                    <label
                      key={optIdx}
                      className={`${styles.optionLabel} ${selected ? styles.optionSelected : ""}`}
                    >
                      <input
                        type="radio"
                        name={`q-${qIdx}`}
                        checked={selected}
                        onChange={() => handleSelect(qIdx, optIdx)}
                        className={styles.radioInput}
                      />
                      <span className={styles.radioCustom} />
                      <span>{opt}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {validationMsg && <div className={styles.validationMsg}>{validationMsg}</div>}

        <div className={styles.submitBar}>
          <button className={styles.submitBtn} onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Quiz"}
          </button>
        </div>
      </div>
    </div>
  );
}