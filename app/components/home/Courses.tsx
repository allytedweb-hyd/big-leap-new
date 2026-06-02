import React from "react";
import styles from "./Courses.module.css";

const courses = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=220&fit=crop",
    category: "Design",
    title: "Figma UI UX Design..",
    description: "Use Figma to get a job in UI Design, User Interface, User Experience design.",
    rating: 4.3,
    reviews: "16,325",
    popular: true,
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=220&fit=crop",
    category: "Design",
    title: "Figma UI UX Design..",
    description: "Use Figma to get a job in UI Design, User Interface, User Experience design.",
    rating: 4.3,
    reviews: "16,325",
    popular: true,
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=220&fit=crop",
    category: "Design",
    title: "Figma UI UX Design..",
    description: "Use Figma to get a job in UI Design, User Interface, User Experience design.",
    rating: 4.3,
    reviews: "16,325",
    popular: true,
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&h=220&fit=crop",
    category: "Design",
    title: "Figma UI UX Design..",
    description: "Use Figma to get a job in UI Design, User Interface, User Experience design.",
    rating: 4.3,
    reviews: "16,325",
    popular: true,
  },
];

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
  return (
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
          {courses.map((course) => (
            <div key={course.id} className={styles.card}>
              <div className={styles.imageWrap}>
                <img src={course.image} alt={course.title} className={styles.cardImg} />
                {course.popular && <span className={styles.badge}>Popular</span>}
              </div>

              <div className={styles.cardBody}>
                <p className={styles.category}>{course.category}</p>

                <div className={styles.titleRow}>
                  <h3 className={styles.cardTitle}>{course.title}</h3>
                  <span className={styles.arrowIcon}>↗</span>
                </div>

                <p className={styles.desc}>{course.description}</p>

                <div className={styles.ratingRow}>
                  <span className={styles.ratingNum}>{course.rating}</span>
                  <StarRating rating={course.rating} />
                  <span className={styles.reviewCount}>({course.reviews})</span>
                </div>

                <div className={styles.cardActions}>
                  <button className={styles.syllabusBtn}>
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                    </svg>
                    Syllabus
                  </button>
                  <button className={styles.exploreBtn}>
                    <span className={styles.exploreBtnText}>Explore Course</span>
                    <span className={styles.arrowCircle}>→</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}