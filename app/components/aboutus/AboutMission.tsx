"use client";
import { ArrowRight } from "lucide-react";
import styles from "./AboutMission.module.css";
import { scrollToContact } from "../../utils/scrollToContact";

export default function AboutMission() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>

        {/* ── TOP ROW: heading left, quote right ── */}
        <div className={styles.topRow}>
          <div className={styles.topLeft}>
            <span className={styles.eyebrow}>WHAT DRIVES US</span>
            <h2 className={styles.heading}>Our Mission &amp; Vision</h2>
            <button className={styles.enrollBtn} onClick={scrollToContact}>
              Enroll Now
              <span className={styles.arrowCircle}>
                <ArrowRight size={16} />
              </span>
            </button>
          </div>

          <div className={styles.topRight}>
            <p className={styles.quote}>
              We exist to close the gap between what's taught in
              classrooms and what's demanded in the real world of
              technology.
            </p>
          </div>
        </div>

        {/* ── BOTTOM ROW: image left, cards right ── */}
        <div className={styles.bottomRow}>

          {/* Left: classroom image */}
          <div className={styles.imageWrap}>
            <img
              src="./assets/images/aboutus/mission.png"
              alt="BigLeap students collaborating"
              className={styles.classImg}
            />
          </div>

          {/* Right: Mission + Vision cards */}
          <div className={styles.cardsCol}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Our Mission</h3>
              <p className={styles.cardText}>
                To Provide Industry-Aligned, Hands-On Technical Education That Equips Every
                Learner With The Skills, Confidence, And Network Needed To Land Their Dream
                Job At Top Tech Companies — Regardless Of Their Background Or Prior
                Experience.
              </p>
            </div>

            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Our Vision</h3>
              <p className={styles.cardText}>
                To Become India's Most Trusted Career Transformation Platform — Where Every
                Student Who Walks In With A Dream Walks Out With A Job Offer And The Skills To
                Build The Future Of Technology.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}