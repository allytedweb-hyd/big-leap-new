"use client";
import styles from "./PlacementsHero.module.css";
import { scrollToContact } from "../../utils/scrollToContact";

export default function PlacementsHero() {
  return (
    <section className={styles.hero}>
      <div className={styles.blobLeft} />
      <div className={styles.blobRight} />

      {/* Top text content */}
      <div className={styles.topContent}>
        <h1 className={styles.heading}>
          Get <span className={styles.highlight}>Industry-Ready</span>
          <br />
          While Still Learning
        </h1>
        <p className={styles.subtext}>
          Build real projects, crack interviews, and enter the hiring
          <br />
          pipeline — before your course even ends.
        </p>
        <button className={styles.ctaBtn} onClick={scrollToContact}>
          Get Started
          <span className={styles.ctaArrow}>→</span>
        </button>
      </div>

      {/* Image row */}
      <div className={styles.imageArea}>

        {/* Group image */}
        <div className={styles.groupImgWrap}>
          <img
            src="/assets/images/grouppic.png"
            alt="Successfully placed students"
            className={styles.groupImg}
          />
        </div>

      </div>
    </section>
  );
}