"use client";
import { useState } from "react";
import ReactStars from "react-rating-stars-component";
import styles from "./CourseReviews.module.css";

/* ── Data ── */
const ratingBreakdown = [
  { label: "5 stars", count: 488, total: 576 },
  { label: "4 stars", count: 74,  total: 576 },
  { label: "3 stars", count: 14,  total: 576 },
  { label: "2 stars", count: 0,   total: 576 },
  { label: "1 star",  count: 0,   total: 576 },
];

const allReviews = [
  {
    id: 1,
    date: "Nov 13, 2023",
    rating: 4,
    initials: "ER",
    name: "Emily R.",
    role: "Front-End Engineer",
    review:
      "Sam.AI is not just a workplace; it's a community of passionate individuals driven by a common goal of helping others succeed.",
  },
  {
    id: 2,
    date: "Nov 13, 2023",
    rating: 4,
    initials: "ER",
    name: "Emily R.",
    role: "Front-End Engineer",
    review:
      "Sam.AI is not just a workplace; it's a community of passionate individuals driven by a common goal of helping others succeed.",
  },
  {
    id: 3,
    date: "Oct 28, 2023",
    rating: 5,
    initials: "AK",
    name: "Arjun K.",
    role: "Data Engineer",
    review:
      "The curriculum is extremely well-structured. Real-world projects gave me the confidence to crack my first data engineering interview.",
  },
  {
    id: 4,
    date: "Oct 10, 2023",
    rating: 4,
    initials: "SP",
    name: "Sneha P.",
    role: "Backend Developer",
    review:
      "Excellent mentorship and hands-on experience. The instructors are always available and go beyond the syllabus to help you grow.",
  },
];

const INITIAL_VISIBLE = 2;

export default function CourseReviews() {
  const [visible, setVisible] = useState(INITIAL_VISIBLE);

  const shownReviews = allReviews.slice(0, visible);
  const hasMore = visible < allReviews.length;

  return (
    <section className={styles.section}>
      <div className={styles.container}>

        {/* ── Top summary row ── */}
        <div className={styles.summaryRow}>
          <ReactStars
            count={5}
            value={4.8}
            size={16}
            isHalf={true}
            edit={false}
            activeColor="#f59e0b"
            color="#ddd"
          />
          <span className={styles.summaryRating}>4.8 course rating</span>
          <span className={styles.summaryDot}>•</span>
          <span className={styles.summaryReviews}>40 reviews</span>
        </div>

        {/* ── Employee Reviews box ── */}
        <div className={styles.reviewBox}>
          {/* Left: big score */}
          <div className={styles.scoreCol}>
            <p className={styles.boxLabel}>Employee Reviews</p>
            <p className={styles.bigScore}>4.7</p>
            <ReactStars
              count={5}
              value={4.7}
              size={28}
              isHalf={true}
              edit={false}
              activeColor="#f59e0b"
              color="#ddd"
            />
            <p className={styles.totalReviews}>(578 Reviews)</p>
          </div>

          {/* Right: bar breakdown */}
          <div className={styles.barsCol}>
            {ratingBreakdown.map((row) => {
              const pct = row.total > 0 ? (row.count / row.total) * 100 : 0;
              return (
                <div key={row.label} className={styles.barRow}>
                  <span className={styles.barLabel}>{row.label}</span>
                  <div className={styles.barTrack}>
                    <div
                      className={styles.barFill}
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                  <span className={styles.barCount}>{row.count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Individual reviews ── */}
        <div className={styles.reviewsList}>
          {shownReviews.map((rev) => (
            <div key={rev.id} className={styles.reviewCard}>
              <p className={styles.reviewDate}>{rev.date}</p>
              <ReactStars
                count={5}
                value={rev.rating}
                size={18}
                isHalf={false}
                edit={false}
                activeColor="#f59e0b"
                color="#ddd"
              />
              <div className={styles.reviewerRow}>
                <div className={styles.avatar}>{rev.initials}</div>
                <span className={styles.reviewerName}>{rev.name}</span>
              </div>
              <p className={styles.reviewerRole}>{rev.role}</p>
              <p className={styles.reviewText}>{rev.review}</p>
            </div>
          ))}
        </div>

        {/* ── Show more button ── */}
        {hasMore && (
          <button
            className={styles.showMoreBtn}
            onClick={() => setVisible((v) => v + 2)}
          >
            Show more reviews
          </button>
        )}

      </div>
    </section>
  );
}
