"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { httpClient } from "../../utils/api";
import styles from "./Quizdashboard.module.css";

interface ChapterQuizStatus {
  chapterId: string;
  chapterTitle: string;
  hasQuiz: boolean;
  questionCount: number;
  attemptsCount: number;
  bestScore: number | null;
  bestPercentage: number | null;
  passed: boolean;
  lastAttemptAt: string | null;
}

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 12H5M5 12l7 7M5 12l7-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function QuizIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#f97316" strokeWidth="2">
      <path d="M9 11l3 3L22 4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function StudentQuizList() {
 const params = useParams();
const router = useRouter();
const courseId = params?.id as string;

  const studentId = (() => {
    if (typeof window === "undefined") return "";
    try {
      const raw = localStorage.getItem("student");
      return raw ? JSON.parse(raw)?._id ?? "" : "";
    } catch {
      return "";
    }
  })();

  const [courseTitle, setCourseTitle] = useState("");
  const [chapters, setChapters] = useState<ChapterQuizStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
      console.log("DEBUG courseId:", courseId);
  console.log("DEBUG studentId:", studentId);
  console.log("DEBUG raw localStorage:", localStorage.getItem("student"));
  if (!courseId || !studentId) {
    setError("You must be logged in to view quizzes.");
    setLoading(false);
    return;
  }

    (async () => {
      try {
        const { data } = await httpClient.get(
          `/student/courses/${courseId}/quizzes`,
          { params: { studentId } } 
        );
        setCourseTitle(data?.course?.title || "");
        setChapters(data?.chapters || []);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load quizzes.");
      } finally {
        setLoading(false);
      }
    })();
  }, [courseId, studentId]);

  if (loading) {
    return (
      <div className={styles.page}>
        <div style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>Loading quizzes...</div>
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

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={() => router.back()}>
          <BackIcon /> Back
        </button>
        <div className={styles.topBarTitle}>
          <span className={styles.topBarCourse}>{courseTitle}</span>
          <span className={styles.topBarTech}>Chapter Quizzes</span>
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "28px 20px 60px" }}>
        {chapters.length === 0 ? (
          <p className={styles.emptyMsg}>No chapters available.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {chapters.map((ch, idx) => (
              <div
                key={ch.chapterId}
                onClick={() =>
                  ch.hasQuiz &&
                   router.push(`/lms/takequiz/${courseId}/${ch.chapterId}`)
                }
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px 20px",
                  background: "#fff",
                  border: "1px solid #eef0f4",
                  borderRadius: 12,
                  cursor: ch.hasQuiz ? "pointer" : "default",
                  opacity: ch.hasQuiz ? 1 : 0.55,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div
                    style={{
                      width: 34, height: 34, borderRadius: 8,
                      background: "#fff7ed", border: "1px solid #fed7aa",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 700, fontSize: 13, color: "#f97316", flexShrink: 0,
                    }}
                  >
                    {idx + 1}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: "#1e293b" }}>
                      {ch.chapterTitle}
                    </div>
                    <div style={{ display: "flex", gap: 10, marginTop: 4, fontSize: 12, color: "#64748b" }}>
                      {!ch.hasQuiz ? (
                        <span>No quiz for this chapter</span>
                      ) : (
                        <>
                          <span>{ch.questionCount} questions</span>
                          <span>·</span>
                          <span>{ch.attemptsCount} attempt{ch.attemptsCount !== 1 ? "s" : ""}</span>
                          {ch.bestPercentage !== null && (
                            <>
                              <span>·</span>
                              <span style={{ color: ch.passed ? "#16a34a" : "#f97316", fontWeight: 600 }}>
                                Best: {Math.round(ch.bestPercentage)}%
                              </span>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {ch.hasQuiz && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <QuizIcon />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}