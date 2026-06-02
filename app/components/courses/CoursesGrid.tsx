"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./CoursesGrid.module.css";
import { httpClient, UPLOADS_URL } from "../../utils/api";
import SyllabusModal from "./syllabusDownloadmodal";

interface Course {
  _id: string;
  title: string;
  descriptionOne: string;
  courseThumbnailImage: string;
  curriculumKey?: string;          // ← new field
  technology?: { name: string };
}

// ── active modal state ─────────────────────────────────────────────────────
interface ModalState {
  courseId: string;
  courseTitle: string;
  curriculumKey: string;
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

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

export default function CoursesGrid() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await httpClient.get("/courses");
        setCourses(data.courses);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load courses.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const openSyllabus = (course: Course) => {
    if (!course.curriculumKey) {
      alert("Syllabus not available for this course yet.");
      return;
    }
    setModal({
      courseId: course._id,
      courseTitle: course.title,
      curriculumKey: course.curriculumKey,
    });
  };

  if (loading) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <p style={{ textAlign: "center", padding: "2rem" }}>Loading courses...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <p style={{ textAlign: "center", color: "red", padding: "2rem" }}>{error}</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className={styles.section} id="courses-list">
        <div className={styles.container}>
          <div className={styles.header}>
            <p className={styles.eyebrow}>TOP CLASS COURSES</p>
            <h2 className={styles.heading}>
              Explore Our World's Best{" "}
              <span className={styles.orange}>Courses</span>
            </h2>
            <p className={styles.subText}>
              When known printer took a galley of type scrambl edmake
            </p>
          </div>

          <div className={styles.grid}>
            {courses.map((course) => {
              const slug = slugify(course.title);
              const href = `/course-details/${slug}/${course._id}`;

              return (
                <div key={course._id} className={styles.card}>
                  <div className={styles.imageWrap}>
                    <img
                      src={`${UPLOADS_URL}/courses/${course.courseThumbnailImage}`}
                      alt={course.title}
                      className={styles.cardImg}
                    />
                    <span className={styles.badge}>Popular</span>
                  </div>

                  <div className={styles.cardBody}>
                    <p className={styles.category}>
                      {course.technology?.name ?? "General"}
                    </p>

                    <div className={styles.titleRow}>
                      <h3 className={styles.cardTitle}>{course.title}</h3>
                      <span className={styles.arrowIcon}>↗</span>
                    </div>

                    <p className={styles.desc}>{course.descriptionOne}</p>

                    <div className={styles.ratingRow}>
                      <span className={styles.ratingNum}>4.3</span>
                      <StarRating rating={4.3} />
                      <span className={styles.reviewCount}>(16,325)</span>
                    </div>

                    <div className={styles.cardActions}>
                      {/* ── Syllabus button now opens modal ── */}
                      <button
                        className={styles.syllabusBtn}
                        onClick={() => openSyllabus(course)}
                      >
                        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                        </svg>
                        Syllabus
                      </button>

                      <Link href={href} className={styles.exploreBtn}>
                        <span className={styles.exploreBtnText}>Explore Course</span>
                        <span className={styles.arrowCircle}>→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Syllabus modal ── */}
      {modal && (
        <SyllabusModal
          courseId={modal.courseId}
          courseTitle={modal.courseTitle}
          curriculumKey={modal.curriculumKey}
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
}