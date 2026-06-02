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

      {/* Image row with floating badges */}
      <div className={styles.imageArea}>

        {/* Left badge — Career Transition */}
        <div className={styles.badgeLeft}>
          <p className={styles.badgeLeftTitle}>
            Career <span className={styles.badgeOrange}>Transition</span>
          </p>
          <div className={styles.transitionCard}>
            <span className={styles.transitionFrom}>Fresher</span>
            <span className={styles.transitionArrow}>↓</span>
            <span className={styles.transitionTo}>Developer</span>
          </div>
        </div>

        {/* Group image */}
        <div className={styles.groupImgWrap}>
          <img
            src="/assets/images/grouppic.png"
            alt="Successfully placed students"
            className={styles.groupImg}
          />

          {/* Amazon badge */}
          <div className={styles.placedBadge}>
            <p className={styles.placedText}>Successfully Placed at</p>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
              alt="Amazon"
              className={styles.amazonLogo}
            />
          </div>
        </div>

        {/* Right badge */}
        <div className={styles.badgeRight}>
          <div className={styles.salaryCard}>
            <p className={styles.salaryAmount}>₹12 LPA</p>
            <p className={styles.salaryLabel}>Cracked at Product Company</p>

            <div className={styles.salaryMobile}>
              <span className={styles.salaryMobileEmoji}>🎉</span>
              <div>
                <p className={styles.salaryMobileTop}>Got Placed!</p>
                <p className={styles.salaryMobileNum}>₹12 LPA</p>
              </div>
            </div>
          </div>
          <svg className={styles.curlyArrow} width="60" height="44" viewBox="0 0 60 44" fill="none">
            <path d="M54 8 Q30 6 14 32" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <polyline points="8,26 14,32 20,27" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </div>

      </div>
    </section>
  );
}