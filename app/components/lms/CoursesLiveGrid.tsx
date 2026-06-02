"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import styles from "./CoursesLiveGrid.module.css";
import { httpClient, UPLOADS_URL } from "../../utils/api";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Course {
  _id: string;
  title: string;
  descriptionOne: string;
  courseThumbnailImage: string;
  coursePrice: number;
  technology?: { name: string };
}

interface Enrollment {
  _id: string;
  courseId: { _id: string; title: string; coursePrice: number };
  studentId: { _id: string; name: string; email: string };
  totalFee: number;
  paidAmount: number;
  paymentStatus: "pending" | "paid" | "failed";
}

type ModalStep = "confirm" | "confirming" | "success";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

function formatPrice(price: number): string {
  if (price === 0) return "Free";
  return `₹${price.toLocaleString("en-IN")}`;
}

const PAYMENT_STATUS_META: Record<
  Enrollment["paymentStatus"],
  { label: string; color: string; bg: string; icon: string }
> = {
  paid:    { label: "Paid",    color: "#16a34a", bg: "#dcfce7", icon: "✓" },
  pending: { label: "Pending", color: "#d97706", bg: "#fef3c7", icon: "⏳" },
  failed:  { label: "Failed",  color: "#dc2626", bg: "#fee2e2", icon: "✕" },
};

// ─── Star Rating ──────────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <span className={styles.stars}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={i <= Math.round(rating) ? styles.starFilled : styles.starEmpty}
          viewBox="0 0 20 20"
          width="13"
          height="13"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

// ─── Enroll Modal ─────────────────────────────────────────────────────────────

interface EnrollModalProps {
  course: Course;
  onClose: () => void;
  onSuccess: (enrollment: Enrollment) => void;
}

function EnrollModal({ course, onClose, onSuccess }: EnrollModalProps) {
  const [step, setStep] = useState<ModalStep>("confirm");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Enrollment | null>(null);

  const student = (() => {
    try {
      const raw = localStorage.getItem("student");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  const handleEnroll = async () => {
    setError(null);

    if (!student?._id) {
      setError("Student session not found. Please log in again.");
      return;
    }

    setStep("confirming");
    try {
      const { data } = await httpClient.post("/enrollments", {
        courseId: course._id,
        studentId: student._id,
        totalFee: course.coursePrice,
        paidAmount: course.coursePrice,
        paymentStatus: "paid",
      });
      setResult(data.enrollment);
      onSuccess(data.enrollment);
      setStep("success");
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Enrollment failed. Please try again."
      );
      setStep("confirm");
    }
  };

  return (
    <div
      className={styles.modalOverlay}
      onClick={step === "confirming" ? undefined : onClose}
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>

        {/* ── Header ── */}
        <div className={styles.modalHeader}>
          <div>
            <p className={styles.modalEyebrow}>Enroll Now</p>
            <h3 className={styles.modalTitle}>{course.title}</h3>
          </div>
          <button
            className={styles.modalClose}
            onClick={onClose}
            aria-label="Close"
            disabled={step === "confirming"}
          >
            ✕
          </button>
        </div>

        {/* ── Fee badge ── */}
        <div className={styles.modalFeeBadge}>
          <span className={styles.modalFeeLabel}>Course Fee</span>
          <span className={styles.modalFeeValue}>
            {formatPrice(course.coursePrice)}
          </span>
        </div>

        {/* ── Confirm step ── */}
        {(step === "confirm" || step === "confirming") && (
          <div className={styles.modalConfirm}>
            {student && (
              <div className={styles.studentCard}>
                <div className={styles.studentAvatar}>
                  {(student.studentName ?? student.name ?? "S")[0].toUpperCase()}
                </div>
                <div className={styles.studentInfo}>
                  <p className={styles.studentName}>
                    {student.studentName ?? student.name}
                  </p>
                  <p className={styles.studentEmail}>{student.email}</p>
                </div>
                <span className={styles.studentVerified}>✓</span>
              </div>
            )}

            <div className={styles.confirmSummary}>
              <div className={styles.summaryRow}>
                <span>Amount to pay</span>
                <span className={styles.summaryValue}>
                  {formatPrice(course.coursePrice)}
                </span>
              </div>
              <div className={styles.summaryRow}>
                <span>Payment status</span>
                <span
                  className={styles.statusPill}
                  style={{
                    color: PAYMENT_STATUS_META["paid"].color,
                    background: PAYMENT_STATUS_META["paid"].bg,
                  }}
                >
                  ✓ Paid
                </span>
              </div>
            </div>

            {error && <p className={styles.formError}>{error}</p>}

            <div className={styles.modalActions}>
              <button
                className={styles.cancelBtn}
                onClick={onClose}
                disabled={step === "confirming"}
              >
                Cancel
              </button>
              <button
                className={styles.confirmBtn}
                onClick={handleEnroll}
                disabled={step === "confirming"}
              >
                {step === "confirming" ? (
                  <span className={styles.spinner} />
                ) : (
                  "Confirm Enrollment"
                )}
              </button>
            </div>
          </div>
        )}

        {/* ── Success step ── */}
        {step === "success" && result && (
          <div className={styles.modalSuccess}>
            <div className={styles.successIcon}>✓</div>
            <h4>Enrollment Confirmed!</h4>
            <p>
              You&apos;re now enrolled in <strong>{course.title}</strong>.
            </p>
            <div className={styles.successDetails}>
              <div className={styles.successRow}>
                <span>Student</span>
                <span>{student?.studentName ?? student?.name}</span>
              </div>
              <div className={styles.successRow}>
                <span>Amount Paid</span>
                <span>{formatPrice(result.paidAmount)}</span>
              </div>
              <div className={styles.successRow}>
                <span>Payment Status</span>
                <span
                  className={styles.statusPill}
                  style={{
                    color: PAYMENT_STATUS_META[result.paymentStatus].color,
                    background: PAYMENT_STATUS_META[result.paymentStatus].bg,
                  }}
                >
                  {PAYMENT_STATUS_META[result.paymentStatus].icon}{" "}
                  {PAYMENT_STATUS_META[result.paymentStatus].label}
                </span>
              </div>
            </div>
            {/* ── Navigate to course player after enrollment ── */}
            <Link
              href={`/lms/live-sessions/${course._id}`}
              className={styles.doneBtn}
              onClick={onClose}
            >
              Start Learning →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Course Card ──────────────────────────────────────────────────────────────

interface CourseCardProps {
  course: Course;
  badge: string;
  ctaLabel: string;
  enrollment?: Enrollment;
  onEnroll?: (course: Course) => void;
}

function CourseCard({
  course,
  badge,
  ctaLabel,
  enrollment,
  onEnroll,
}: CourseCardProps) {
  // Course details page (thumbnail click / title click)
  const slug = slugify(course.title);
  const detailsHref = `/course-details/${slug}/${course._id}`;

  // Course player page (Continue Learning CTA)
  const playerHref = `/lms/live-sessions/${course._id}`;

  const status = enrollment?.paymentStatus;

  return (
    <div className={styles.card}>
      <div className={styles.imageWrap}>
        {/* Thumbnail → course details page */}
        <Link href={detailsHref}>
          <img
            src={`${UPLOADS_URL}/courses/${course.courseThumbnailImage}`}
            alt={course.title}
            className={styles.cardImg}
          />
        </Link>
        <span className={styles.badge}>{badge}</span>

        {/* Price tag */}
        <span className={styles.pricePill}>{formatPrice(course.coursePrice)}</span>

        {/* Payment status badge (enrolled cards only) */}
        {status && (
          <span
            className={styles.paymentStatusBadge}
            style={{
              color: PAYMENT_STATUS_META[status].color,
              background: PAYMENT_STATUS_META[status].bg,
            }}
          >
            {PAYMENT_STATUS_META[status].icon} {PAYMENT_STATUS_META[status].label}
          </span>
        )}
      </div>

      <div className={styles.cardBody}>
        <p className={styles.category}>
          {course.technology?.name ?? "General"}
        </p>

        <div className={styles.titleRow}>
          {/* Title → course details page */}
          <Link href={detailsHref} className={styles.cardTitleLink}>
            <h3 className={styles.cardTitle}>{course.title}</h3>
          </Link>
          <span className={styles.arrowIcon}>↗</span>
        </div>

        <p className={styles.desc}>{course.descriptionOne}</p>

        <div className={styles.ratingRow}>
          <span className={styles.ratingNum}>4.3</span>
          <StarRating rating={4.3} />
          <span className={styles.reviewCount}>(16,325)</span>
        </div>

        <div className={styles.feeRow}>
          <span className={styles.feeAmount}>
            {formatPrice(course.coursePrice)}
          </span>
          {course.coursePrice > 0 && (
            <span className={styles.feeNote}>one-time payment</span>
          )}
        </div>

        <div className={styles.cardActions}>
          <button className={styles.syllabusBtn}>
            <svg
              viewBox="0 0 24 24"
              width="13"
              height="13"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            Syllabus
          </button>

          {enrollment ? (
            // ── Enrolled → go to course player ──────────────────────────────
            <Link href={playerHref} className={styles.exploreBtn}>
              {ctaLabel}
              <span className={styles.arrowCircle}>→</span>
            </Link>
          ) : (
            // ── Not enrolled → open enroll modal ────────────────────────────
            <button
              className={styles.exploreBtn}
              onClick={() => onEnroll?.(course)}
            >
              {ctaLabel}
              <span className={styles.arrowCircle}>→</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CoursesGrid() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollmentMap, setEnrollmentMap] = useState<Record<string, Enrollment>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enrollTarget, setEnrollTarget] = useState<Course | null>(null);

  // ── Fetch courses + student enrollments together ──
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Courses
        const { data: courseData } = await httpClient.get("/courses");
        setCourses(courseData.courses);

        // 2. Enrollments for current student
        try {
          const raw = localStorage.getItem("student");
          const student = raw ? JSON.parse(raw) : null;

          if (student?._id) {
            const { data: enrollData } = await httpClient.get(
              `/enrollments/student/${student._id}`
            );

            const map: Record<string, Enrollment> = {};
            (enrollData.enrollments ?? []).forEach((enrollment: Enrollment) => {
              const cid =
                typeof enrollment.courseId === "string"
                  ? enrollment.courseId
                  : enrollment.courseId._id;
              map[cid] = enrollment;
            });
            setEnrollmentMap(map);
          }
        } catch {
          // Not logged in or no enrollments — fine
        }
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ── Add newly enrolled course to map immediately (no refetch needed) ──
  const handleEnrollSuccess = useCallback((enrollment: Enrollment) => {
    const cid =
      enrollment.courseId?._id ??
      (enrollment.courseId as unknown as string);
    setEnrollmentMap((prev) => ({ ...prev, [cid]: enrollment }));
  }, []);

  // ── Derived lists ──
  const enrolledCourses = useMemo(
    () => courses.filter((c) => enrollmentMap[c._id]),
    [courses, enrollmentMap]
  );

  const popularCourses = useMemo(
    () => courses.filter((c) => !enrollmentMap[c._id]),
    [courses, enrollmentMap]
  );

  // ─── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.loadingWrap}>
            <div className={styles.loadingSpinner} />
            <p>Loading courses…</p>
          </div>
        </div>
      </section>
    );
  }

  // ─── Error ─────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <p className={styles.errorMsg}>{error}</p>
        </div>
      </section>
    );
  }

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <section className={styles.section} id="courses-list">

      {/* ── SECTION 1: Enrolled Courses ── */}
      {enrolledCourses.length > 0 && (
        <div className={styles.container}>
          <div className={styles.header}>
            <p className={styles.eyebrow}>MY LEARNING</p>
            <h2 className={styles.heading}>
              Your <span className={styles.orange}>Enrolled</span> Courses
            </h2>
            <p className={styles.subText}>
              Continue where you left off — track your progress and keep learning
            </p>
          </div>

          <div className={styles.grid}>
            {enrolledCourses.map((course) => (
              <CourseCard
                key={course._id}
                course={course}
                badge="Enrolled"
                ctaLabel="Continue Learning"
                enrollment={enrollmentMap[course._id]}
                // enrolled cards have no onEnroll — CTA goes to player
              />
            ))}
          </div>
        </div>
      )}

      {/* ── SECTION 2: Popular Courses (non-enrolled only) ── */}
      {popularCourses.length > 0 && (
        <div
          className={`${styles.container} ${
            enrolledCourses.length > 0 ? styles.sectionGap : ""
          }`}
        >
          <div className={styles.header}>
            <p className={styles.eyebrow}>TOP CLASS COURSES</p>
            <h2 className={styles.heading}>
              Explore Our World&apos;s Best{" "}
              <span className={styles.orange}>Popular Courses</span>
            </h2>
            <p className={styles.subText}>
              Discover the most in-demand courses loved by thousands of learners worldwide
            </p>
          </div>

          <div className={styles.grid}>
            {popularCourses.map((course) => (
              <CourseCard
                key={course._id}
                course={course}
                badge="Popular"
                ctaLabel="Enroll Now"
                // no enrollment prop → shows Enroll Now button
                onEnroll={setEnrollTarget}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Enroll Modal ── */}
      {enrollTarget && (
        <EnrollModal
          course={enrollTarget}
          onClose={() => setEnrollTarget(null)}
          onSuccess={(enrollment) => {
            handleEnrollSuccess(enrollment);
            setEnrollTarget(null);
          }}
        />
      )}
    </section>
  );
}