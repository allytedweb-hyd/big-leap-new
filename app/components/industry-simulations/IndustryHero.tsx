"use client";
import styles from "./IndustryHero.module.css";
import { scrollToContact } from "../../utils/scrollToContact";

const CHIPS = [
  { label: "Cloud Ready",    cls: styles.chip1 },
  { label: "Job Ready",      cls: styles.chip2 },
  { label: "Apache Spark",   cls: styles.chip3 },
  { label: "Real Pipelines", cls: styles.chip4 },
];

export default function IndustryHero() {
  return (
    <section className={styles.hero}>
      {/* Left text content */}
      <div className={styles.content}>
        <h1 className={styles.heading}>
          Experience How Real <br />
          <span>Engineering</span> Teams Work
        </h1>
        <p className={styles.subtext}>
          Stop learning theory. Start building real engineering experience with
          live pipelines, cloud tasks, debugging, and production-style
          workflows at Big Leap Technologies.
        </p>
        <button className={styles.cta} onClick={scrollToContact}>
          Get Started
          <span className={styles.ctaArrow}>→</span>
        </button>
      </div>

      {/* Floating badges */}
      <div className={styles.chips}>
        {CHIPS.map((chip) => (
          <div key={chip.label} className={`${styles.chip} ${chip.cls}`}>
            {chip.label}
          </div>
        ))}
      </div>
    </section>
  );
}