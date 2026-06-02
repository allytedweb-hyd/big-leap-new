"use client";
import { ArrowRight } from "lucide-react";
import styles from "./CoursesHero.module.css";
import { scrollToId } from "../../utils/scrollToContact";

export default function ProgramsHeroSection() {
  return (
    <section className={styles.hero}>

      {/* CIRCLES */}
      <div className={`${styles.circle} ${styles.c1}`}></div>
      <div className={`${styles.circle} ${styles.c2}`}></div>
      <div className={`${styles.circle} ${styles.c3}`}></div>
      <div className={`${styles.circle} ${styles.c4}`}></div>
      <div className={`${styles.circle} ${styles.c5}`}></div>

      {/* LEFT IMAGE */}
      <div className={`${styles.heroImg} ${styles.left}`}>
        <img src="./assets/images/course/girl-image.png" alt="Student" />
      </div>

      {/* CONTENT */}
      <div className={styles.heroContent}>
        <h1>
          Find the Right <br />
          <span className={styles.orange}>Program</span> for Your <br />
          Career
        </h1>
        <p>
          Industry-aligned courses with hands-on projects,
          mentorship, and placement support.
        </p>
        <button className={styles.btn} onClick={() => scrollToId("courses-list")}>
          Explore Programs <ArrowRight size={16} />
        </button>
      </div>

      {/* RIGHT IMAGE */}
      <div className={`${styles.heroImg} ${styles.right}`}>
        <img src="./assets/images/course/boy-image.png" alt="Student" />
      </div>

      {/* FLOATING TECH ICONS */}
      <img
        src="https://cdn-icons-png.flaticon.com/512/5968/5968292.png"
        className={`${styles.icon} ${styles.js}`}
        alt="JavaScript"
      />
      <img
        src="https://cdn-icons-png.flaticon.com/512/5968/5968350.png"
        className={`${styles.icon} ${styles.python}`}
        alt="Python"
      />
      <img
        src="https://cdn-icons-png.flaticon.com/512/732/732212.png"
        className={`${styles.icon} ${styles.angular}`}
        alt="Angular"
      />
      <img
        src="https://cdn-icons-png.flaticon.com/512/6132/6132222.png"
        className={`${styles.icon} ${styles.c}`}
        alt="C"
      />

    </section>
  );
}