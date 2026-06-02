"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { httpClient } from "../../utils/api";
import styles from "./Livesessions.module.css";

// ─── Types ────────────────────────────────────────────────────────────────────

interface LiveSession {
  lessonId: string;
  lessonTitle: string;
  chapterId: string;
  chapterTitle: string;
  chapterIndex: number;
  liveSessionLink: string;
  liveSessionDate: string | null;
  duration: number;
}

interface CourseInfo {
  _id: string;
  title: string;
  technology?: { _id: string; name: string };
}

interface BatchInfo {
  _id: string;
  batchStartDate: string;
  batchTimings: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDuration(seconds: number): string {
  if (!seconds) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")} min`;
}

type SessionStatus = "live" | "upcoming" | "completed" | "unscheduled";

function getSessionStatus(dateStr: string | null): SessionStatus {
  if (!dateStr) return "unscheduled";
  const diffMins = (new Date(dateStr).getTime() - Date.now()) / (1000 * 60);
  if (diffMins >= -30 && diffMins <= 30) return "live";   // ±30 min window = live
  if (diffMins > 30) return "upcoming";
  return "completed";
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 12H5M5 12l7 7M5 12l7-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.899L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" strokeLinecap="round" />
    </svg>
  );
}

function BatchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" strokeLinecap="round" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" strokeLinecap="round" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" strokeLinecap="round" />
      <path d="M15 3h6v6M10 14L21 3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EmptyIcon() {
  return (
    <svg viewBox="0 0 80 80" width="64" height="64" fill="none">
      <circle cx="40" cy="40" r="38" stroke="#e2e8f0" strokeWidth="2" />
      <path d="M28 35h24M28 45h16" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="52" cy="52" r="10" fill="#fff7ed" stroke="#fed7aa" strokeWidth="2" />
      <path d="M52 48v5l3 2" stroke="#f97316" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: SessionStatus }) {
  const config: Record<SessionStatus, { label: string; cls: string }> = {
    live:        { label: "● Live Now",  cls: styles.badgeLive },
    upcoming:    { label: "Upcoming",    cls: styles.badgeUpcoming },
    completed:   { label: "Completed",   cls: styles.badgeCompleted },
    unscheduled: { label: "Unscheduled", cls: styles.badgeUnscheduled },
  };
  const { label, cls } = config[status];
  return <span className={`${styles.badge} ${cls}`}>{label}</span>;
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className={styles.skeletonWrap}>
      <div className={styles.skeletonHeader} />
      <div className={styles.skeletonTable}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className={styles.skeletonRow} style={{ animationDelay: `${i * 0.08}s` }} />
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function LiveSessionsPage() {
  const router = useRouter();

  // ── Read student from localStorage (same pattern as CoursePlayerPage) ─────
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

  const [sessions,      setSessions]      = useState<LiveSession[]>([]);
  const [courseInfo,    setCourseInfo]    = useState<CourseInfo | null>(null);
  const [batchInfo,     setBatchInfo]     = useState<BatchInfo | null>(null);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState<string | null>(null);
  const [filterStatus,  setFilterStatus]  = useState<string>("all");
  const [search,        setSearch]        = useState("");

  // ── Fetch ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!studentId) {
      setError("You must be logged in to view live sessions.");
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const { data } = await httpClient.get(
          `/manage-batches/student/${studentId}/live-sessions`
        );
        setSessions(data.liveSessions);
        setCourseInfo(data.course);
        setBatchInfo(data.batch);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load live sessions.");
      } finally {
        setLoading(false);
      }
    })();
  }, [studentId]);

  // ── Filtered list ─────────────────────────────────────────────────────────
  const filtered = sessions.filter((s) => {
    const statusMatch =
      filterStatus === "all" || getSessionStatus(s.liveSessionDate) === filterStatus;
    const searchMatch =
      !search ||
      s.lessonTitle.toLowerCase().includes(search.toLowerCase()) ||
      s.chapterTitle.toLowerCase().includes(search.toLowerCase());
    return statusMatch && searchMatch;
  });

  // ── Stats ─────────────────────────────────────────────────────────────────
  const stats = {
    total:       sessions.length,
    live:        sessions.filter((s) => getSessionStatus(s.liveSessionDate) === "live").length,
    upcoming:    sessions.filter((s) => getSessionStatus(s.liveSessionDate) === "upcoming").length,
    completed:   sessions.filter((s) => getSessionStatus(s.liveSessionDate) === "completed").length,
    unscheduled: sessions.filter((s) => getSessionStatus(s.liveSessionDate) === "unscheduled").length,
  };

  // ─── Loading / error ──────────────────────────────────────────────────────
  if (loading) return <div className={styles.page}><Skeleton /></div>;

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

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className={styles.page}>

      {/* ── Top bar ── */}
      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={() => router.back()}>
          <BackIcon /> Back
        </button>
        <div className={styles.topBarTitle}>
          <span className={styles.topBarCourse}>{courseInfo?.title ?? "Live Sessions"}</span>
          {courseInfo?.technology && (
            <span className={styles.topBarTech}>{courseInfo.technology.name}</span>
          )}
        </div>
        {/* Batch badge */}
        {batchInfo && (
          <div className={styles.batchBadge}>
            <BatchIcon />
            <span>
              {new Date(batchInfo.batchStartDate).toLocaleDateString("en-IN", {
                day: "2-digit", month: "short", year: "numeric",
              })}
            </span>
            <span className={styles.batchSep}>·</span>
            <span>{batchInfo.batchTimings}</span>
          </div>
        )}
      </div>

      <div className={styles.inner}>

        {/* ── Page heading ── */}
        <div className={styles.pageHead}>
          <div className={styles.pageHeadLeft}>
            <div className={styles.pageIcon}><VideoIcon /></div>
            <div>
              <h1 className={styles.pageTitle}>Live Sessions</h1>
              <p className={styles.pageSubtitle}>
                Scheduled live classes for your batch
              </p>
            </div>
          </div>
        </div>

        {/* ── Stats row ── */}
        <div className={styles.statsRow}>
          {[
            { label: "Total",       value: stats.total,       color: "#6366f1" },
            { label: "Live Now",    value: stats.live,        color: "#ef4444" },
            { label: "Upcoming",    value: stats.upcoming,    color: "#f97316" },
            { label: "Completed",   value: stats.completed,   color: "#22c55e" },
            { label: "Unscheduled", value: stats.unscheduled, color: "#94a3b8" },
          ].map((s) => (
            <div key={s.label} className={styles.statCard}>
              <span className={styles.statNum} style={{ color: s.color }}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* ── Toolbar ── */}
        <div className={styles.toolbar}>
          <div className={styles.searchWrap}>
            <svg className={styles.searchIcon} viewBox="0 0 24 24" width="15" height="15"
              fill="none" stroke="#94a3b8" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
            </svg>
            <input
              className={styles.searchInput}
              placeholder="Search lesson or chapter…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className={styles.filterTabs}>
            {(["all", "live", "upcoming", "completed", "unscheduled"] as const).map((f) => (
              <button
                key={f}
                className={`${styles.filterTab} ${filterStatus === f ? styles.filterTabActive : ""}`}
                onClick={() => setFilterStatus(f)}
              >
                {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* ── Table ── */}
        <div className={styles.tableCard}>
          {filtered.length === 0 ? (
            <div className={styles.emptyState}>
              <EmptyIcon />
              <p className={styles.emptyTitle}>No sessions found</p>
              <p className={styles.emptySubtitle}>
                {sessions.length === 0
                  ? "No live sessions have been configured for your batch yet."
                  : "Try adjusting your search or filter."}
              </p>
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr className={styles.thead}>
                  <th className={styles.th}>#</th>
                  <th className={styles.th}>Lesson</th>
                  <th className={styles.th}>Chapter</th>
                  <th className={styles.th}>Date</th>
                  <th className={styles.th}>Time</th>
                  <th className={styles.th}>Duration</th>
                  <th className={styles.th}>Status</th>
                  <th className={styles.th}>Join</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((session, idx) => {
                  const status = getSessionStatus(session.liveSessionDate);
                  const isLive      = status === "live";
                  const isCompleted = status === "completed";

                  return (
                    <tr
                      key={session.lessonId}
                      className={`${styles.tr} ${isLive ? styles.trLive : ""}`}
                    >
                      {/* # */}
                      <td className={styles.td}>
                        <span className={styles.rowNum}>{idx + 1}</span>
                      </td>

                      {/* Lesson */}
                      <td className={styles.td}>
                        <span className={styles.lessonTitle}>{session.lessonTitle}</span>
                      </td>

                      {/* Chapter */}
                      <td className={styles.td}>
                        <span className={styles.chapterBadge}>
                          <span className={styles.chapterNum}>
                            {String(session.chapterIndex + 1).padStart(2, "0")}
                          </span>
                          {session.chapterTitle}
                        </span>
                      </td>

                      {/* Date */}
                      <td className={styles.td}>
                        <span className={styles.metaCell}>
                          <CalendarIcon />
                          {formatDate(session.liveSessionDate)}
                        </span>
                      </td>

                      {/* Time */}
                      <td className={styles.td}>
                        <span className={styles.metaCell}>
                          <ClockIcon />
                          {formatTime(session.liveSessionDate)}
                        </span>
                      </td>

                      {/* Duration */}
                      <td className={styles.td}>
                        <span className={styles.durationCell}>
                          {formatDuration(session.duration)}
                        </span>
                      </td>

                      {/* Status */}
                      <td className={styles.td}>
                        <StatusBadge status={status} />
                      </td>

                      {/* Join button — redirects to Zoom/Teams link */}
                      <td className={styles.td}>
                        {session.liveSessionLink ? (
                          isCompleted ? (
                            <span className={styles.joinEnded}>Ended</span>
                          ) : (
                            <a
                              href={session.liveSessionLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`${styles.joinBtn} ${isLive ? styles.joinBtnLive : styles.joinBtnUpcoming}`}
                            >
                              <ExternalLinkIcon />
                              {isLive ? "Join Now" : "Join"}
                            </a>
                          )
                        ) : (
                          <span className={styles.noLink}>—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <p className={styles.tableFooter}>
          Showing {filtered.length} of {sessions.length} session{sessions.length !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
}