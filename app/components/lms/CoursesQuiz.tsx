"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./CoursesQuiz.module.css";
import { httpClient } from "../../utils/api"; // ← adjust path to match your project structure

// ─── Types ────────────────────────────────────────────────────────────────────

interface ChapterQuizSummary {
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

interface CourseQuizData {
  course: { _id: string; title: string };
  chapters: ChapterQuizSummary[];
}

interface QuizDashboardProps {
  courseId: string;
}

// ─── Header gradient palette (cycled by index, mirrors the card-grid reference) ─

const HEADER_THEMES = [
  { from: "#f9a8d4", to: "#c084fc" },
  { from: "#93c5fd", to: "#818cf8" },
  { from: "#fdba74", to: "#fb7185" },
  { from: "#6ee7b7", to: "#60a5fa" },
  { from: "#d8b4fe", to: "#f0abfc" },
  { from: "#fde047", to: "#fb923c" },
];

// ─── Small icons (inline, no external icon lib) ───────────────────────────────

function IconQuiz() {
  return (
    <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#fff" strokeWidth="1.8">
      <path d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
    </svg>
  );
}

function IconLock() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2">
      <rect x="4" y="10" width="16" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 018 0v3" />
    </svg>
  );
}

function IconTrophy() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M8 21h8M12 17v4M17 5h3a1 1 0 011 1c0 2.5-2 5-4 5M7 5H4a1 1 0 00-1 1c0 2.5 2 5 4 5M7 5h10v3a5 5 0 01-10 0V5z" />
    </svg>
  );
}

// ─── Quiz Card ────────────────────────────────────────────────────────────────

interface QuizCardProps {
  courseId: string;
  chapter: ChapterQuizSummary;
  themeIndex: number;
}

function QuizCard({ courseId, chapter, themeIndex }: QuizCardProps) {
  const theme = HEADER_THEMES[themeIndex % HEADER_THEMES.length];
  const attempted = chapter.attemptsCount > 0;

  const ctaLabel = !chapter.hasQuiz
    ? "Locked"
    : chapter.passed
    ? "Review Results"
    : attempted
    ? "Retake Quiz"
    : "Start Quiz";

  const cardInner = (
    <>
      <div
        className={styles.cardHeader}
        style={{ background: `linear-gradient(135deg, ${theme.from}, ${theme.to})` }}
      >
        <IconQuiz />
        <span className={styles.questionBadge}>
          {chapter.questionCount} {chapter.questionCount === 1 ? "Question" : "Questions"}
        </span>
        {!chapter.hasQuiz && (
          <span className={styles.lockBadge}>
            <IconLock /> Locked
          </span>
        )}
      </div>

      <div className={styles.cardBody}>
        <h3 className={styles.cardTitle}>{chapter.chapterTitle}</h3>

        <div className={styles.statsRow}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Best Score</span>
            <span className={styles.statValue}>
              {chapter.bestPercentage !== null ? `${Math.round(chapter.bestPercentage)}%` : "—"}
            </span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Attempts</span>
            <span className={styles.statValue}>{chapter.attemptsCount}</span>
          </div>
        </div>

        <div className={styles.tagsRow}>
          {chapter.passed && (
            <span className={styles.tagPassed}>
              <IconTrophy /> Passed
            </span>
          )}
          {!chapter.passed && attempted && <span className={styles.tagAttempted}>In Progress</span>}
          {!attempted && chapter.hasQuiz && <span className={styles.tagNew}>Not Started</span>}
        </div>

        <div className={styles.cardFooter}>
          <span className={!chapter.hasQuiz ? styles.ctaDisabled : styles.cta}>
            {ctaLabel}
            {chapter.hasQuiz && <span className={styles.arrowCircle}>→</span>}
          </span>
        </div>
      </div>
    </>
  );

  if (!chapter.hasQuiz) {
    return <div className={`${styles.card} ${styles.cardLocked}`}>{cardInner}</div>;
  }

  return (
    <Link href={`/lms/quiz/${courseId}/${chapter.chapterId}`} className={styles.card}>
      {cardInner}
    </Link>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function QuizDashboard({ courseId }: QuizDashboardProps) {
  const [data, setData] = useState<CourseQuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const { data } = await httpClient.get(`/student/courses/${courseId}/quizzes`);
        setData(data);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load quizzes.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, [courseId]);

  if (loading) {
    return (
      <section className={styles.section}>
        <div className={styles.loadingWrap}>
          <div className={styles.loadingSpinner} />
          <p>Loading quizzes…</p>
        </div>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className={styles.section}>
        <p className={styles.errorMsg}>{error || "Something went wrong."}</p>
      </section>
    );
  }

  const quizChapters = data.chapters.filter((c) => c.hasQuiz);
  const lockedChapters = data.chapters.filter((c) => !c.hasQuiz);

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <p className={styles.eyebrow}>CHAPTER QUIZZES</p>
        <h2 className={styles.heading}>
          Quizzes for <span className={styles.orange}>{data.course.title}</span>
        </h2>
        <p className={styles.subText}>
          Test what you've learned in each chapter. Retake anytime to improve your score.
        </p>
      </div>

      {data.chapters.length === 0 ? (
        <p className={styles.emptyMsg}>No chapters found for this course yet.</p>
      ) : (
        <div className={styles.grid}>
          {[...quizChapters, ...lockedChapters].map((chapter, i) => (
            <QuizCard key={chapter.chapterId} courseId={courseId} chapter={chapter} themeIndex={i} />
          ))}
        </div>
      )}
    </section>
  );
}
