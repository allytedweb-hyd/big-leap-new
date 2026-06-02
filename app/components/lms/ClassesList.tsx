"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { httpClient, UPLOADS_URL } from "../../utils/api";
import styles from "./ClassesList.module.css";

// ─── Types ────────────────────────────────────────────────────────────────────

interface MergedLesson {
  lessonId: string;
  lessonTitle: string;
  videoUrl: string;
  duration: number;
  liveSessionLink: string;
  liveSessionDate: string | null;
}

interface MergedChapter {
  chapterId: string;
  chapterTitle: string;
  lessons: MergedLesson[];
}

interface CourseInfo {
  _id: string;
  title: string;
  descriptionOne: string;
  descriptionTwo: string;
  demoUrl: string;
  courseThumbnailImage: string;
  coursePrice: number;
  hoursOfContent: number;
  modules: number;
  projects: number;
  learningOutcomesDescription: string;
  learningOutcomesPoints: string[];
  keyHighlights: string[];
  curriculumKey?: string;
  technology?: { _id: string; name: string };
}

interface BatchInfo {
  _id: string;
  batchStartDate: string;
  batchTimings: string;
}

interface StudentBatchData {
  course: CourseInfo;
  batch: BatchInfo;
  manageBatch: { _id: string };
  mergedCurriculum: MergedChapter[];
}

// ─── Video URL helpers ────────────────────────────────────────────────────────

function isYouTubeUrl(url: string): boolean {
  return /youtu\.be|youtube\.com/.test(url);
}

function toYouTubeEmbedUrl(url: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.pathname.startsWith("/embed/")) {
      parsed.searchParams.set("autoplay", "1");
      return parsed.toString();
    }
    let videoId = "";
    if (parsed.hostname === "youtu.be") {
      videoId = parsed.pathname.slice(1).split("?")[0];
    } else {
      videoId = parsed.searchParams.get("v") ?? "";
    }
    if (!videoId) return url;
    const list = parsed.searchParams.get("list");
    const listParam = list ? `&list=${list}` : "";
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0${listParam}`;
  } catch {
    return url;
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDuration(seconds: number): string {
  if (!seconds) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")} min`;
}

function formatDate(dateStr: string | null): string | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function isUpcoming(dateStr: string | null): boolean {
  if (!dateStr) return false;
  return new Date(dateStr) > new Date();
}

function totalLessonsCount(curriculum: MergedChapter[]): number {
  return curriculum.reduce((sum, ch) => sum + ch.lessons.length, 0);
}

function totalUnlockedCount(curriculum: MergedChapter[]): number {
  return curriculum.reduce(
    (sum, ch) => sum + ch.lessons.filter((l) => l.videoUrl || l.liveSessionLink).length,
    0
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24" width="16" height="16" fill="none"
      stroke="currentColor" strokeWidth="2.2"
      style={{
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
        transition: "transform 0.22s ease",
        flexShrink: 0,
      }}
    >
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlayCircleIcon({ active }: { active?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none"
      stroke={active ? "#f97316" : "#94a3b8"} strokeWidth="1.8">
      <circle cx="12" cy="12" r="10" />
      <path d="M10 8l6 4-6 4V8z" fill={active ? "#f97316" : "#94a3b8"} stroke="none" />
    </svg>
  );
}

function LiveIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#22c55e" strokeWidth="1.8">
      <circle cx="12" cy="12" r="3" fill="#22c55e" />
      <path d="M6.34 6.34a8 8 0 000 11.32M17.66 6.34a8 8 0 010 11.32" strokeLinecap="round" />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none"
      stroke="currentColor" strokeWidth="2">
      <path d="M19 12H5M5 12l7 7M5 12l7-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none"
      stroke="currentColor" strokeWidth="2">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" strokeLinecap="round" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="none"
      stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" strokeLinecap="round" />
    </svg>
  );
}

function LockIcon({ size = 13 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none"
      stroke="#94a3b8" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" strokeLinecap="round" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="none"
      stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
    </svg>
  );
}

function BatchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none"
      stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" strokeLinecap="round" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" strokeLinecap="round" />
    </svg>
  );
}

// ─── VideoPlayer ──────────────────────────────────────────────────────────────

interface VideoPlayerProps {
  url: string;
  poster: string;
}

function VideoPlayer({ url, poster }: VideoPlayerProps) {
  if (isYouTubeUrl(url)) {
    return (
      <iframe
        key={url}
        className={styles.video}
        src={toYouTubeEmbedUrl(url)}
        title="Lesson video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    );
  }
  return (
    <video
      key={url}
      className={styles.video}
      src={url}
      controls
      autoPlay
      poster={poster}
    />
  );
}

// ─── Live Session Panel ───────────────────────────────────────────────────────

function LiveSessionPanel({
  link,
  date,
}: {
  link: string;
  date: string | null;
}) {
  const upcoming = isUpcoming(date);
  const formattedDate = formatDate(date);

  return (
    <div className={styles.livePanel}>
      <div className={styles.livePanelHeader}>
        <span className={styles.liveDot} />
        <span className={styles.livePanelTitle}>
          {upcoming ? "Upcoming Live Session" : "Live Session"}
        </span>
      </div>
      {formattedDate && (
        <div className={styles.liveDate}>
          <CalendarIcon />
          <span>{formattedDate}</span>
        </div>
      )}
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.liveJoinBtn}
      >
        {upcoming ? "Join When Live" : "Open Session Link"}
      </a>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className={styles.skeleton}>
      <div className={styles.skeletonVideo} />
      <div className={styles.skeletonLines}>
        <div className={styles.skeletonLine} style={{ width: "60%" }} />
        <div className={styles.skeletonLine} style={{ width: "40%" }} />
        <div className={styles.skeletonLine} style={{ width: "80%" }} />
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CoursePlayerPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = (params?.courseId ?? params?.id) as string;

  // ── Auth: read student._id from localStorage "student" key ──────────────
  // Your app stores the full student object as JSON under the key "student".
  // e.g. { "_id": "6a0af063...", "studentName": "saiteja", ... }
  const studentId = (() => {
    if (typeof window === "undefined") return "";
    try {
      const raw = localStorage.getItem("student");
      if (!raw) return "";
      const parsed = JSON.parse(raw);
      return parsed?._id ?? "";
    } catch {
      return "";
    }
  })();

  const [data, setData] = useState<StudentBatchData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeChapterIdx, setActiveChapterIdx] = useState(0);
  const [activeLessonIdx, setActiveLessonIdx] = useState(0);
  const [openChapters, setOpenChapters] = useState<Record<number, boolean>>({
    0: true,
  });

  const playerWrapRef = useRef<HTMLDivElement>(null);

  // ── Fetch merged curriculum for this student ──────────────────────────────
  useEffect(() => {
    if (!studentId) {
      setError("You must be logged in to view this course.");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        // Hit the new endpoint: GET /api/manage-batches/student/:studentId
        const { data: res } = await httpClient.get(
          `/manage-batches/student/${studentId}`
        );
        const fetched: StudentBatchData = res;
        setData(fetched);

        // Auto-select first unlocked lesson (has video or live link)
        let firstCh = 0,
          firstL = 0;
        outer: for (let ci = 0; ci < fetched.mergedCurriculum.length; ci++) {
          for (
            let li = 0;
            li < fetched.mergedCurriculum[ci].lessons.length;
            li++
          ) {
            const ls = fetched.mergedCurriculum[ci].lessons[li];
            if (ls.videoUrl || ls.liveSessionLink) {
              firstCh = ci;
              firstL = li;
              break outer;
            }
          }
        }
        setActiveChapterIdx(firstCh);
        setActiveLessonIdx(firstL);
        setOpenChapters({ [firstCh]: true });
      } catch (err: any) {
        setError(
          err?.response?.data?.message || "Failed to load course content."
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [studentId]);

  // ── Derived ───────────────────────────────────────────────────────────────
  const curriculum = data?.mergedCurriculum ?? [];
  const course = data?.course ?? null;
  const batch = data?.batch ?? null;

  const activeLesson: MergedLesson | null =
    curriculum[activeChapterIdx]?.lessons[activeLessonIdx] ?? null;
  const activeChapter: MergedChapter | null =
    curriculum[activeChapterIdx] ?? null;

  const totalLessons = totalLessonsCount(curriculum);
  const unlockedLessons = totalUnlockedCount(curriculum);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const goToLesson = useCallback((chIdx: number, lIdx: number) => {
    setActiveChapterIdx(chIdx);
    setActiveLessonIdx(lIdx);
    setOpenChapters((p) => ({ ...p, [chIdx]: true }));
    playerWrapRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  const toggleChapter = (idx: number) =>
    setOpenChapters((p) => ({ ...p, [idx]: !p[idx] }));

  // ─── Loading / error ──────────────────────────────────────────────────────
  if (loading) return <div className={styles.page}><Skeleton /></div>;

  if (error || !data || !course) {
    return (
      <div className={styles.page}>
        <div className={styles.errorBox}>
          <p>{error || "Course not found."}</p>
          <button className={styles.backBtn} onClick={() => router.back()}>
            <BackIcon /> Go back
          </button>
        </div>
      </div>
    );
  }

  const posterUrl = `${UPLOADS_URL}/courses/${course.courseThumbnailImage}`;

  // Determine what to show in player area
  const hasVideo = !!activeLesson?.videoUrl;
  const hasLive = !!activeLesson?.liveSessionLink;

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className={styles.page}>

      {/* ── Top bar ── */}
      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={() => router.back()}>
          <BackIcon /> Back to Courses
        </button>
        <div className={styles.topBarTitle}>
          <span className={styles.topBarCourse}>{course.title}</span>
          {course.technology && (
            <span className={styles.topBarTech}>{course.technology.name}</span>
          )}
        </div>
        {/* Batch info badge */}
        {batch && (
          <div className={styles.batchBadge}>
            <BatchIcon />
            <span>
              Batch:{" "}
              {new Date(batch.batchStartDate).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
            <span className={styles.batchTimingSep}>·</span>
            <span>{batch.batchTimings}</span>
          </div>
        )}
      </div>

      <div className={styles.layout}>

        {/* ══════════ LEFT PANEL ══════════ */}
        <div className={styles.leftPanel}>

          {/* Player */}
          <div className={styles.videoWrap} ref={playerWrapRef}>
            {hasVideo ? (
              <VideoPlayer url={activeLesson!.videoUrl} poster={posterUrl} />
            ) : hasLive ? (
              // Live session placeholder with join button
              <div className={styles.liveVideoPlaceholder}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={posterUrl}
                  alt={course.title}
                  className={styles.noVideoThumb}
                />
                <div className={styles.noVideoOverlay}>
                  <div className={styles.liveOverlayContent}>
                    <div className={styles.liveOverlayIcon}>
                      <LiveIcon />
                    </div>
                    <p className={styles.liveOverlayTitle}>Live Session</p>
                    {activeLesson?.liveSessionDate && (
                      <p className={styles.liveOverlayDate}>
                        {formatDate(activeLesson.liveSessionDate)}
                      </p>
                    )}
                    <a
                      href={activeLesson!.liveSessionLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.liveOverlayJoin}
                    >
                      {isUpcoming(activeLesson?.liveSessionDate ?? null)
                        ? "Join When Live"
                        : "Open Session Link"}
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className={styles.noVideo}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={posterUrl}
                  alt={course.title}
                  className={styles.noVideoThumb}
                />
                <div className={styles.noVideoOverlay}>
                  <div className={styles.noVideoMsg}>
                    <LockIcon size={16} />
                    <span>Content not available yet for your batch</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Lesson info */}
          <div className={styles.lessonMeta}>
            <div className={styles.lessonBreadcrumb}>
              <span className={styles.chapterBadge}>
                {activeChapter?.chapterTitle}
              </span>
              {hasLive && !hasVideo && (
                <span className={styles.liveTag}>
                  <span className={styles.liveDot} /> Live Session
                </span>
              )}
            </div>
            <h1 className={styles.lessonTitle}>
              {activeLesson?.lessonTitle ?? "Select a lesson"}
            </h1>
            <div className={styles.metaRow}>
              {activeLesson?.duration ? (
                <span className={styles.metaItem}>
                  <ClockIcon /> {formatDuration(activeLesson.duration)}
                </span>
              ) : null}
              {activeLesson?.liveSessionDate && (
                <span className={styles.metaItem}>
                  <CalendarIcon /> {formatDate(activeLesson.liveSessionDate)}
                </span>
              )}
              <span className={styles.metaItem}>
                Lesson {activeLessonIdx + 1} of{" "}
                {activeChapter?.lessons.length ?? 0}
              </span>
            </div>
          </div>

          {/* Learning outcomes */}
          {course.learningOutcomesPoints.length > 0 && (
            <div className={styles.outcomesSection}>
              <h2 className={styles.sectionHeading}>What you&apos;ll learn</h2>
              <p className={styles.outcomesDesc}>
                {course.learningOutcomesDescription}
              </p>
              <ul className={styles.outcomesList}>
                {course.learningOutcomesPoints.map((pt, i) => (
                  <li key={i} className={styles.outcomeItem}>
                    <span className={styles.outcomeDot} />
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Key highlights */}
          {course.keyHighlights.length > 0 && (
            <div className={styles.highlightsSection}>
              <h2 className={styles.sectionHeading}>Course Highlights</h2>
              <div className={styles.highlightsGrid}>
                {course.keyHighlights.map((h, i) => (
                  <div key={i} className={styles.highlightChip}>
                    {h}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className={styles.statsRow}>
            <div className={styles.statBox}>
              <span className={styles.statNum}>{course.hoursOfContent}h</span>
              <span className={styles.statLabel}>Content</span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statNum}>{course.modules}</span>
              <span className={styles.statLabel}>Modules</span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statNum}>{totalLessons}</span>
              <span className={styles.statLabel}>Lessons</span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statNum}>{course.projects}</span>
              <span className={styles.statLabel}>Projects</span>
            </div>
          </div>
        </div>

        {/* ══════════ RIGHT PANEL : Curriculum ══════════ */}
        <div className={styles.rightPanel}>

          <div className={styles.curriculumHeader}>
            <div className={styles.curriculumTitle}>
              <BookIcon />
              <span>Batch Curriculum</span>
            </div>
            <div className={styles.curriculumMeta}>
              <span className={styles.curriculumCount}>
                {unlockedLessons}/{totalLessons} available
              </span>
            </div>
          </div>

          <div className={styles.chapterList}>
            {curriculum.length === 0 ? (
              <p className={styles.emptyMsg}>
                No curriculum configured for your batch yet.
              </p>
            ) : (
              curriculum.map((chapter, chIdx) => {
                const isOpen = !!openChapters[chIdx];
                // Count unlocked lessons in this chapter
                const chUnlocked = chapter.lessons.filter(
                  (l) => l.videoUrl || l.liveSessionLink
                ).length;

                return (
                  <div key={chapter.chapterId} className={styles.chapterBlock}>
                    <button
                      className={`${styles.chapterRow} ${
                        activeChapterIdx === chIdx ? styles.chapterRowActive : ""
                      }`}
                      onClick={() => toggleChapter(chIdx)}
                    >
                      <div className={styles.chapterLeft}>
                        <span className={styles.chapterNum}>
                          {String(chIdx + 1).padStart(2, "0")}
                        </span>
                        <span className={styles.chapterTitle}>
                          {chapter.chapterTitle}
                        </span>
                      </div>
                      <div className={styles.chapterRight}>
                        <span className={styles.chapterMeta}>
                          {chUnlocked}/{chapter.lessons.length}
                        </span>
                        <ChevronIcon open={isOpen} />
                      </div>
                    </button>

                    {isOpen && (
                      <div className={styles.lessonList}>
                        {chapter.lessons.length === 0 ? (
                          <p className={styles.emptyLessons}>No lessons yet</p>
                        ) : (
                          chapter.lessons.map((lesson, lIdx) => {
                            const isActive =
                              activeChapterIdx === chIdx &&
                              activeLessonIdx === lIdx;
                            const hasContent =
                              !!lesson.videoUrl || !!lesson.liveSessionLink;
                            const isLiveOnly =
                              !lesson.videoUrl && !!lesson.liveSessionLink;

                            return (
                              <button
                                key={lesson.lessonId}
                                className={`${styles.lessonRow} ${
                                  isActive ? styles.lessonRowActive : ""
                                } ${
                                  !hasContent ? styles.lessonRowLocked : ""
                                }`}
                                onClick={() =>
                                  hasContent
                                    ? goToLesson(chIdx, lIdx)
                                    : undefined
                                }
                                disabled={!hasContent}
                              >
                                <span className={styles.lessonIcon}>
                                  {isLiveOnly ? (
                                    <LiveIcon />
                                  ) : lesson.videoUrl ? (
                                    <PlayCircleIcon active={isActive} />
                                  ) : (
                                    <LockIcon />
                                  )}
                                </span>
                                <span className={styles.lessonName}>
                                  {lesson.lessonTitle}
                                  {isLiveOnly && (
                                    <span className={styles.lessonLiveChip}>
                                      Live
                                    </span>
                                  )}
                                </span>
                                <span className={styles.lessonDuration}>
                                  {lesson.duration
                                    ? formatDuration(lesson.duration)
                                    : ""}
                                </span>
                              </button>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}