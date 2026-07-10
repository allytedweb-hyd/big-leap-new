"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import styles from "./CoursesGrid.module.css";
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
  studentId: { _id: string; studentName?: string; name?: string; email: string };
  totalFee: number;
  paidamount: number;
  paymentStatus: "pending" | "paid" | "failed";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
}

type ModalStep =
  | "confirm"      // initial summary screen
  | "processing"   // waiting for Razorpay SDK / backend
  | "success"      // payment verified OK
  | "failed";      // payment failed

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

// ─── Razorpay script loader ───────────────────────────────────────────────────

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if ((window as any).Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

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

  const studentName = student?.studentName ?? student?.name ?? "";

  // ── Free course enrollment ────────────────────────────────────────────────
  const handleFreeEnroll = async () => {
    if (!student?._id) {
      setError("Student session not found. Please log in again.");
      return;
    }
    setStep("processing");
    try {
      const { data } = await httpClient.post("/payments/create-order", {
        courseId: course._id,
        studentId: student._id,
      });
      // Backend returns { free: true, enrollment }
      setResult(data.enrollment);
      onSuccess(data.enrollment);
      setStep("success");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Enrollment failed. Please try again.");
      setStep("confirm");
    }
  };

  // ── Paid course — Razorpay flow ───────────────────────────────────────────
  const handlePaidEnroll = async () => {
    if (!student?._id) {
      setError("Student session not found. Please log in again.");
      return;
    }

    setStep("processing");
    setError(null);

    // 1. Load Razorpay SDK
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      setError("Failed to load Razorpay. Please check your connection.");
      setStep("confirm");
      return;
    }

    // 2. Create order on backend
    let orderData: {
      orderId: string;
      amount: number;
      currency: string;
      keyId: string;
      courseName: string;
      studentName: string;
      studentEmail: string;
      studentContact: string;
    };

    try {
      const { data } = await httpClient.post("/payments/create-order", {
        courseId: course._id,
        studentId: student._id,
      });

      // Free course returned unexpectedly — handle gracefully
      if (data.free) {
        setResult(data.enrollment);
        onSuccess(data.enrollment);
        setStep("success");
        return;
      }

      orderData = data;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create order. Please try again.");
      setStep("confirm");
      return;
    }

    // 3. Open Razorpay checkout
    const rzpOptions = {
      key: orderData.keyId,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "LearnHub",            // ← change to your brand name
      description: orderData.courseName,
      order_id: orderData.orderId,
      prefill: {
        name: orderData.studentName,
        email: orderData.studentEmail,
        contact: orderData.studentContact,
      },
      theme: { color: "#f97316" }, // orange to match your UI

      // ── Payment success ──────────────────────────────────────────────────
      handler: async (response: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
      }) => {
        try {
          const { data } = await httpClient.post("/payments/verify", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            courseId: course._id,
            studentId: student._id,
          });
          setResult(data.enrollment);
          onSuccess(data.enrollment);
          setStep("success");
        } catch (err: any) {
          setError(
            err?.response?.data?.message ||
              "Payment verification failed. Please contact support."
          );
          setStep("failed");
        }
      },

      // ── Modal dismissed / payment failed ────────────────────────────────
      modal: {
        ondismiss: async () => {
          // Mark enrollment as failed on backend
          try {
            await httpClient.post("/payments/failed", {
              razorpay_order_id: orderData.orderId,
              error_description: "Payment cancelled by user",
            });
          } catch {
            // Best-effort
          }
          setError("Payment was cancelled.");
          setStep("failed");
        },
      },
    };

    const rzp = new (window as any).Razorpay(rzpOptions);

    // Handle payment.failed event from Razorpay
    rzp.on(
      "payment.failed",
      async (response: { error: { description: string; metadata: { order_id: string } } }) => {
        try {
          await httpClient.post("/payments/failed", {
            razorpay_order_id: response.error.metadata.order_id,
            error_description: response.error.description,
          });
        } catch {
          // Best-effort
        }
        setError(response.error.description || "Payment failed. Please try again.");
        setStep("failed");
      }
    );

    rzp.open();
  };

  const handleEnroll = () => {
    if (course.coursePrice === 0) {
      handleFreeEnroll();
    } else {
      handlePaidEnroll();
    }
  };

  const isBusy = step === "processing";

  return (
    <div
      className={styles.modalOverlay}
      onClick={isBusy ? undefined : onClose}
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>

        {/* ── Header ── */}
        <div className={styles.modalHeader}>
          <div>
            <p className={styles.modalEyebrow}>
              {course.coursePrice === 0 ? "Free Enrollment" : "Secure Checkout"}
            </p>
            <h3 className={styles.modalTitle}>{course.title}</h3>
          </div>
          <button
            className={styles.modalClose}
            onClick={onClose}
            aria-label="Close"
            disabled={isBusy}
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

        {/* ─────────────── STEP: confirm ─────────────── */}
        {(step === "confirm" || step === "processing") && (
          <div className={styles.modalConfirm}>
            {student && (
              <div className={styles.studentCard}>
                <div className={styles.studentAvatar}>
                  {studentName[0]?.toUpperCase() ?? "S"}
                </div>
                <div className={styles.studentInfo}>
                  <p className={styles.studentName}>{studentName}</p>
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
                <span>Payment via</span>
                <span className={styles.summaryValue}>
                  {course.coursePrice === 0 ? "Free" : "Razorpay"}
                </span>
              </div>
            </div>

            {/* Razorpay trust badge (only for paid) */}
            {course.coursePrice > 0 && (
              <div className={styles.razorpayBadge}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                <span>Secured by Razorpay — UPI, Cards, Net Banking & more</span>
              </div>
            )}

            {error && <p className={styles.formError}>{error}</p>}

            <div className={styles.modalActions}>
              <button
                className={styles.cancelBtn}
                onClick={onClose}
                disabled={isBusy}
              >
                Cancel
              </button>
              <button
                className={styles.confirmBtn}
                onClick={handleEnroll}
                disabled={isBusy}
              >
                {isBusy ? (
                  <span className={styles.spinner} />
                ) : course.coursePrice === 0 ? (
                  "Enroll for Free"
                ) : (
                  `Pay ${formatPrice(course.coursePrice)}`
                )}
              </button>
            </div>
          </div>
        )}

        {/* ─────────────── STEP: success ─────────────── */}
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
                <span>{studentName}</span>
              </div>
              <div className={styles.successRow}>
                <span>Amount Paid</span>
                <span>{formatPrice(result.paidamount ?? result.totalFee)}</span>
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
              {result.razorpayPaymentId && (
                <div className={styles.successRow}>
                  <span>Payment ID</span>
                  <span className={styles.paymentId}>{result.razorpayPaymentId}</span>
                </div>
              )}
            </div>
            <Link
              href={`/lms/course-curriculum/${course._id}`}
              className={styles.doneBtn}
              onClick={onClose}
            >
              Start Learning →
            </Link>
          </div>
        )}

        {/* ─────────────── STEP: failed ─────────────── */}
        {step === "failed" && (
          <div className={styles.modalFailed}>
            <div className={styles.failedIcon}>✕</div>
            <h4>Payment Failed</h4>
            <p>{error || "Something went wrong with your payment."}</p>
            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={onClose}>
                Close
              </button>
              <button
                className={styles.confirmBtn}
                onClick={() => {
                  setError(null);
                  setStep("confirm");
                }}
              >
                Try Again
              </button>
            </div>
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

function CourseCard({ course, badge, ctaLabel, enrollment, onEnroll }: CourseCardProps) {
  const slug = slugify(course.title);
  const detailsHref = `/course-details/${slug}/${course._id}`;
  const playerHref = `/lms/course-curriculum/${course._id}`;
  const status = enrollment?.paymentStatus;

  return (
    <div className={styles.card}>
      <div className={styles.imageWrap}>
        <Link href={detailsHref}>
          <img
            src={`${UPLOADS_URL}/courses/${course.courseThumbnailImage}`}
            alt={course.title}
            className={styles.cardImg}
          />
        </Link>
        <span className={styles.badge}>{badge}</span>
        <span className={styles.pricePill}>{formatPrice(course.coursePrice)}</span>

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
        <p className={styles.category}>{course.technology?.name ?? "General"}</p>

        <div className={styles.titleRow}>
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
          <span className={styles.feeAmount}>{formatPrice(course.coursePrice)}</span>
          {course.coursePrice > 0 && (
            <span className={styles.feeNote}>one-time payment</span>
          )}
        </div>

        <div className={styles.cardActions}>
          <button className={styles.syllabusBtn}>
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            Syllabus
          </button>

          {enrollment ? (
            <Link href={playerHref} className={styles.exploreBtn}>
              {ctaLabel}
              <span className={styles.arrowCircle}>→</span>
            </Link>
          ) : (
            <button className={styles.exploreBtn} onClick={() => onEnroll?.(course)}>
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: courseData } = await httpClient.get("/courses");
        setCourses(courseData.courses);

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
          // Not logged in or no enrollments
        }
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEnrollSuccess = useCallback((enrollment: Enrollment) => {
    const cid =
      typeof enrollment.courseId === "string"
        ? enrollment.courseId
        : enrollment.courseId._id;
    setEnrollmentMap((prev) => ({ ...prev, [cid]: enrollment }));
  }, []);

  const enrolledCourses = useMemo(
    () => courses.filter((c) => enrollmentMap[c._id]),
    [courses, enrollmentMap]
  );

  const popularCourses = useMemo(
    () => courses.filter((c) => !enrollmentMap[c._id]),
    [courses, enrollmentMap]
  );

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

  if (error) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <p className={styles.errorMsg}>{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section} id="courses-list">

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
              />
            ))}
          </div>
        </div>
      )}

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
                onEnroll={setEnrollTarget}
              />
            ))}
          </div>
        </div>
      )}

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