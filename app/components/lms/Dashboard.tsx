"use client";

import { useState, useEffect } from "react";
import styles from "./Dashboard.module.css";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StudentData {
  _id: string;
  studentName: string;
  email: string;
  mobileNumber: string;
  [key: string]: unknown;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function getCurrentDay(): string {
  return new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }).toUpperCase();
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({ icon, value, label, sub, color }: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  sub?: string;
  color: string;
}) {
  return (
    <div className={styles.statCard}>
      <div className={styles.statIcon} style={{ background: color + "1a", color }}>
        {icon}
      </div>
      <div className={styles.statBody}>
        <span className={styles.statValue}>{value}</span>
        <span className={styles.statLabel}>{label}</span>
        <span className={styles.statSub}>{sub}</span>
      </div>
    </div>
  );
}

// ─── Course card ──────────────────────────────────────────────────────────────

function CourseCard({ course }: {
  course: {
    title: string;
    lessons: number;
    hours: number;
    progress: number;
    streak: number;
    image: string;
  };
}) {
  return (
    <div className={styles.courseCard}>
      <div className={styles.courseImgWrap}>
        <div className={styles.courseImgPlaceholder} style={{ background: course.image }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
          </svg>
        </div>
      </div>
      <div className={styles.courseBody}>
        <h3 className={styles.courseTitle}>{course.title}</h3>
        <div className={styles.courseMeta}>
          <span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
            </svg>
            {course.lessons} Lessons
          </span>
          <span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
            {course.hours}h
          </span>
        </div>
        <div className={styles.progressWrap}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${course.progress}%` }} />
          </div>
          <span className={styles.progressPct}>{course.progress}% Complete</span>
        </div>
        <div className={styles.courseFooter}>
          <span className={styles.streakBadge}>
            🔥 {course.streak}-day streak
          </span>
          <button className={styles.continueBtn}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Schedule item ────────────────────────────────────────────────────────────

function ScheduleItem({ item }: {
  item: { time: string; title: string; instructor: string; status: "live" | "upcoming" | "completed" };
}) {
  const statusMap = {
    live: { label: "LIVE NOW", cls: styles.badgeLive },
    upcoming: { label: "Upcoming", cls: styles.badgeUpcoming },
    completed: { label: "Completed", cls: styles.badgeCompleted },
  };
  const s = statusMap[item.status];

  return (
    <div className={styles.scheduleItem}>
      <div className={styles.scheduleTime}>
        <span className={styles.scheduleTimeText}>{item.time}</span>
      </div>
      <div className={styles.scheduleDot} data-status={item.status} />
      <div className={styles.scheduleBody}>
        <p className={styles.scheduleTitle}>{item.title}</p>
        <p className={styles.scheduleInstructor}>{item.instructor}</p>
        <span className={`${styles.scheduleBadge} ${s.cls}`}>{s.label}</span>
      </div>
    </div>
  );
}

// ─── Leaderboard row ──────────────────────────────────────────────────────────

function LeaderboardRow({ rank, name, pts, isMe }: {
  rank: number; name: string; pts: number; isMe?: boolean;
}) {
  const medals: { [k: number]: string } = { 1: "🥇", 2: "🥈", 3: "🥉" };

  return (
    <div className={`${styles.lbRow} ${isMe ? styles.lbRowMe : ""}`}>
      <span className={styles.lbRank}>{medals[rank] ?? rank}</span>
      <div className={styles.lbAvatar}>
        {name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
      </div>
      <span className={styles.lbName}>{name}</span>
      <span className={styles.lbPts}>{pts.toLocaleString()} pts</span>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const [student, setStudent] = useState<StudentData | null>(null);

  useEffect(() => {
    const data = localStorage.getItem("student");
    if (data) {
      try { setStudent(JSON.parse(data)); } catch { /* ignore */ }
    }
  }, []);

  const firstName = student?.studentName?.split(" ")[0] ?? "Student";

  const stats = [
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
        </svg>
      ),
      value: 38, label: "Enrolled Courses", color: "#3b82f6",
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      value: "124h", label: "Hours Completed",  color: "#f97316",
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
      value: "2,290", label: "Total Assignments",color: "#8b5cf6",
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      ),
      value: "5 days", label: "Live sessions", color: "#ef4444",
    },
  ];

  const courses = [
    { title: "Python for Data Engineering", lessons: 64, hours: 32, progress: 65, streak: 5, image: "linear-gradient(135deg,#1e3a5f,#2563eb)" },
    { title: "Data Science with NumPy & Pandas", lessons: 48, hours: 32, progress: 65, streak: 5, image: "linear-gradient(135deg,#0f2027,#203a43,#2c5364)" },
  ];

  const schedule = [
    { time: "10:00 AM", title: "Python Functions & Closure", instructor: "with Priya Menon", status: "live" as const },
    { time: "10:00 AM", title: "Machine Learning Intro", instructor: "with Priya Menon", status: "upcoming" as const },
    { time: "10:00 AM", title: "Python Functions & Closure", instructor: "with Priya Menon", status: "upcoming" as const },
    { time: "10:00 AM", title: "Python Functions & Closure", instructor: "with Priya Menon", status: "completed" as const },
  ];

  const leaderboard = [
    { rank: 1, name: "Sneha Patel", pts: 2840 },
    { rank: 2, name: "Kiran Reddy", pts: 2620 },
    { rank: 3, name: "Meera Singh", pts: 2410 },
    { rank: 4, name: "Arjun Sharma", pts: 2290, isMe: true },
    { rank: 5, name: "Rohan Gupta", pts: 2100 },
  ];

  const recentActivity = [
    { time: "10:00 AM", title: "Completed Lesson 42: List Comprehensions in Python course", status: "completed" as const },
    { time: "10:00 AM", title: "Machine Learning Intro", status: "upcoming" as const },
    { time: "10:00 AM", title: "Python Functions & Closure", status: "upcoming" as const },
    { time: "10:00 AM", title: "Python Functions & Closure", status: "upcoming" as const },
  ];

  return (
    <div className={styles.dashboard}>
      {/* ── Hero banner ─────────────────────────────────────────────────── */}
      <div className={styles.heroBanner}>
        <div className={styles.heroContent}>
          <p className={styles.heroDate}>{getCurrentDay()} — WEEK 8 OF 24</p>
          <h1 className={styles.heroGreeting}>
            {getGreeting()}, <span>{firstName}</span> 👋
          </h1>
          <p className={styles.heroSub}>
            You&apos;re on a 5-day streak. Keep it up — you&apos;re 33% through your Data Science Program
          </p>
          {/* <div className={styles.heroBtns}>
            <button className={styles.heroPrimary}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Continue: Python Functions
            </button>
            <button className={styles.heroSecondary}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 7l-7 5 7 5V7z" /><rect x="1" y="5" width="15" height="14" rx="2" />
              </svg>
              Join Today&apos;s Live Class
            </button>
          </div> */}
        </div>
        <div className={styles.heroProgress}>
          <div className={styles.heroProgressBar}>
            <div className={styles.heroProgressFill} style={{ width: "33%" }} />
          </div>
        </div>
      </div>

      {/* ── Stats ──────────────────────────────────────────────────────── */}
      <div className={styles.statsGrid}>
        {stats.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>

      {/* ── Main grid ──────────────────────────────────────────────────── */}
      <div className={styles.mainGrid}>
        {/* Left column */}
        <div className={styles.leftCol}>
          {/* Continue Learning */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Continue Learning</h2>
              <button className={styles.viewAll}>View All →</button>
            </div>
            <div className={styles.coursesGrid}>
              {courses.map((c, i) => (
                <CourseCard key={i} course={c} />
              ))}
            </div>
          </section>

 
        </div>

        {/* Right column */}
        <div className={styles.rightCol}>
          {/* Today's schedule */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Today&apos;s Schedule</h2>
              <button className={styles.viewAll}>View All →</button>
            </div>
            <div className={styles.scheduleList}>
              {schedule.map((s, i) => (
                <ScheduleItem key={i} item={s} />
              ))}
            </div>
          </section>

  
        </div>
      </div>
    </div>
  );
}