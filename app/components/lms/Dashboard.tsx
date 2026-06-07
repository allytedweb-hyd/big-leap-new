"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { httpClient, UPLOADS_URL } from "../../utils/api";
import styles from "./Dashboard.module.css";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BatchInfo {
  batchId: string;
  batchStartDate: string;
  batchTimings: string;
}

interface EnrolledCourse {
  enrollmentId: string;
  courseId: string;
  title: string;
  thumbnail: string;
  hoursOfContent: number;
  modules: number;
  projects: number;
  totalLessons: number;
  technology: string | null;
  paymentStatus: string;
  totalFee: number;
  paidAmount: number;
  enrolledAt: string;
  batch: BatchInfo | null;
  progress: number;
}

interface UpcomingSession {
  courseTitle: string;
  chapterTitle: string;
  lessonTitle: string;
  liveSessionDate: string;
  liveSessionLink: string;
}

interface DashboardStats {
  totalEnrolled: number;
  totalHours: number;
  totalLessons: number;
  totalProjects: number;
  upcomingLiveSessions: number;
  activeBatches: number;
}

interface StudentInfo {
  _id: string;
  studentName: string;
  email: string;
  mobileNumber: string;
  currentLocation: string | null;
  currentJobStatus: string | null;
  joinedAt: string;
}

interface DashboardData {
  student: StudentInfo;
  stats: DashboardStats;
  enrolledCourses: EnrolledCourse[];
  upcomingSessions: UpcomingSession[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatSessionDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function timeUntil(dateStr: string): string {
  const diff = new Date(dateStr).getTime() - Date.now();
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  if (days > 0) return `in ${days}d ${hours}h`;
  if (hours > 0) return `in ${hours}h`;
  return "soon";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  icon,
  value,
  label,
  accent,
}: {
  icon: string;
  value: string | number;
  label: string;
  accent: string;
}) {
  return (
    <div className={styles.statCard} style={{ "--accent": accent } as React.CSSProperties}>
      <div className={styles.statIconWrap}>{icon}</div>
      <div className={styles.statContent}>
        <span className={styles.statValue}>{value}</span>
        <span className={styles.statLabel}>{label}</span>
      </div>
      <div className={styles.statGlow} />
    </div>
  );
}

function CourseCard({
  course,
  onOpen,
}: {
  course: EnrolledCourse;
  onOpen: (id: string) => void;
}) {
  const thumb = course.thumbnail
    ? `${UPLOADS_URL}/courses/${course.thumbnail}`
    : null;

  const gradients = [
    "linear-gradient(135deg,#0f2027,#203a43,#2c5364)",
    "linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)",
    "linear-gradient(135deg,#0d0d0d,#1a1a1a,#2d1b69)",
    "linear-gradient(135deg,#0c1445,#1a237e,#283593)",
  ];
  const bg = gradients[parseInt(course.courseId.slice(-1), 16) % gradients.length];

  return (
    <div className={styles.courseCard}>
      <div className={styles.courseThumb} style={{ background: bg }}>
        {thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumb} alt={course.title} className={styles.courseThumbImg} />
        ) : (
          <span className={styles.courseThumbIcon}>📚</span>
        )}
        {course.technology && (
          <span className={styles.techChip}>{course.technology}</span>
        )}
        <div className={styles.courseThumbOverlay} />
      </div>

      <div className={styles.courseBody}>
        <h3 className={styles.courseTitle}>{course.title}</h3>

        <div className={styles.courseMeta}>
          <span className={styles.metaPill}>
            <span>📖</span> {course.totalLessons} lessons
          </span>
          <span className={styles.metaPill}>
            <span>⏱</span> {course.hoursOfContent}h
          </span>
          <span className={styles.metaPill}>
            <span>🏗</span> {course.projects} projects
          </span>
        </div>

        <div className={styles.progressSection}>
          <div className={styles.progressTrack}>
            <div
              className={styles.progressFill}
              style={{ width: `${course.progress}%` }}
            />
          </div>
          <span className={styles.progressPct}>{course.progress}%</span>
        </div>

        {course.batch && (
          <div className={styles.batchInfo}>
            <span className={styles.batchDot} />
            <span>
              Batch from {formatDate(course.batch.batchStartDate)} ·{" "}
              {course.batch.batchTimings}
            </span>
          </div>
        )}

        <div className={styles.courseFooter}>
          <span
            className={`${styles.payBadge} ${
              course.paymentStatus === "paid"
                ? styles.payPaid
                : course.paymentStatus === "pending"
                ? styles.payPending
                : styles.payFailed
            }`}
          >
            {course.paymentStatus === "paid" ? "✓ Paid" : course.paymentStatus}
          </span>
          <button className={styles.continueBtn} onClick={() => onOpen(course.courseId)}>
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
}

function SessionCard({ session }: { session: UpcomingSession }) {
  return (
    <div className={styles.sessionCard}>
      <div className={styles.sessionLeft}>
        <div className={styles.sessionPulse}>
          <span className={styles.sessionDot} />
        </div>
        <div>
          <p className={styles.sessionLesson}>{session.lessonTitle}</p>
          <p className={styles.sessionCourse}>{session.courseTitle}</p>
          <p className={styles.sessionChapter}>{session.chapterTitle}</p>
        </div>
      </div>
      <div className={styles.sessionRight}>
        <span className={styles.sessionTime}>
          {formatSessionDate(session.liveSessionDate)}
        </span>
        <span className={styles.sessionCountdown}>
          {timeUntil(session.liveSessionDate)}
        </span>
        <a
          href={session.liveSessionLink}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.joinBtn}
        >
          Join
        </a>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return <div className={styles.skeletonCard}><div className={styles.skeletonShimmer} /></div>;
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"courses" | "sessions">("courses");

  const studentId = (() => {
    if (typeof window === "undefined") return "";
    try {
      const raw = localStorage.getItem("student");
      if (!raw) return "";
      return JSON.parse(raw)?._id ?? "";
    } catch {
      return "";
    }
  })();

  useEffect(() => {
    if (!studentId) {
      setError("Please log in to view your dashboard.");
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const { data: res } = await httpClient.get(
          `/lms-dashboard/${studentId}`
        );
        setData(res);
      } catch (err: unknown) {
        const e = err as { response?: { data?: { message?: string } } };
        setError(e?.response?.data?.message || "Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    })();
  }, [studentId]);

  const firstName = data?.student.studentName?.split(" ")[0] ?? "Student";

  const statCards = data
    ? [
        { icon: "🎓", value: data.stats.totalEnrolled, label: "Enrolled Courses", accent: "#6366f1" },
        { icon: "⏱", value: `${data.stats.totalHours}h`, label: "Total Content", accent: "#f97316" },
        { icon: "📝", value: data.stats.totalLessons, label: "Total Lessons", accent: "#22c55e" },
        { icon: "📡", value: data.stats.upcomingLiveSessions, label: "Live Sessions", accent: "#ec4899" },
        { icon: "🏗", value: data.stats.totalProjects, label: "Projects", accent: "#a855f7" },
        { icon: "🗂", value: data.stats.activeBatches, label: "Active Batches", accent: "#14b8a6" },
      ]
    : [];

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.errorBox}>
          <span>⚠️</span>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* ── Hero ── */}
      <div className={styles.hero}>
        <div className={styles.heroNoise} />
        <div className={styles.heroInner}>
          <div className={styles.heroText}>
            <p className={styles.heroDate}>
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <h1 className={styles.heroHeading}>
              {getGreeting()}, <em>{loading ? "..." : firstName}</em> 👋
            </h1>
            <p className={styles.heroSub}>
              {loading
                ? "Loading your learning space..."
                : data
                ? `You have ${data.stats.totalEnrolled} active course${data.stats.totalEnrolled !== 1 ? "s" : ""} and ${data.stats.upcomingLiveSessions} upcoming live session${data.stats.upcomingLiveSessions !== 1 ? "s" : ""} this week.`
                : "Welcome back!"}
            </p>
          </div>
          <div className={styles.heroOrb} />
        </div>
      </div>

      {/* ── Stats ── */}
      <div className={styles.statsGrid}>
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={styles.statCardSkeleton}><div className={styles.skeletonShimmer} /></div>
            ))
          : statCards.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      {/* ── Tabs ── */}
      <div className={styles.tabRow}>
        <button
          className={`${styles.tab} ${activeTab === "courses" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("courses")}
        >
          My Courses
          {data && (
            <span className={styles.tabCount}>{data.enrolledCourses.length}</span>
          )}
        </button>
        <button
          className={`${styles.tab} ${activeTab === "sessions" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("sessions")}
        >
          Live Sessions
          {data && data.upcomingSessions.length > 0 && (
            <span className={styles.tabCountLive}>{data.upcomingSessions.length}</span>
          )}
        </button>
      </div>

      {/* ── Content ── */}
      <div className={styles.content}>
        {activeTab === "courses" && (
          <>
            {loading ? (
              <div className={styles.coursesGrid}>
                {Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : !data || data.enrolledCourses.length === 0 ? (
              <div className={styles.emptyState}>
                <span className={styles.emptyIcon}>📚</span>
                <p className={styles.emptyTitle}>No courses enrolled yet</p>
                <p className={styles.emptySub}>Browse available courses to get started.</p>
              </div>
            ) : (
              <div className={styles.coursesGrid}>
                {data.enrolledCourses.map((c) => (
                  <CourseCard
                    key={c.enrollmentId}
                    course={c}
                    onOpen={(id) => router.push(`/classes/${id}`)}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === "sessions" && (
          <>
            {loading ? (
              <div className={styles.sessionsList}>
                {Array.from({ length: 3 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : !data || data.upcomingSessions.length === 0 ? (
              <div className={styles.emptyState}>
                <span className={styles.emptyIcon}>📡</span>
                <p className={styles.emptyTitle}>No upcoming live sessions</p>
                <p className={styles.emptySub}>
                  Live sessions scheduled in the next 7 days will appear here.
                </p>
              </div>
            ) : (
              <div className={styles.sessionsList}>
                {data.upcomingSessions.map((s, i) => (
                  <SessionCard key={i} session={s} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Profile strip ── */}
      {!loading && data && (
        <div className={styles.profileStrip}>
          <div className={styles.profileAvatar}>
            {data.student.studentName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)}
          </div>
          <div className={styles.profileInfo}>
            <p className={styles.profileName}>{data.student.studentName}</p>
            <p className={styles.profileEmail}>{data.student.email}</p>
          </div>
          <div className={styles.profileMeta}>
            {data.student.currentLocation && (
              <span className={styles.profileChip}>📍 {data.student.currentLocation}</span>
            )}
            {data.student.currentJobStatus && (
              <span className={styles.profileChip}>💼 {data.student.currentJobStatus}</span>
            )}
            <span className={styles.profileChip}>
              🗓 Joined {formatDate(data.student.joinedAt)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}