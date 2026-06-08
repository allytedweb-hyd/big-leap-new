"use client";
import styles from "./VSComparison.module.css";

const TRADITIONAL = [
  "Focus mainly on concepts only",
  "Small, isolated practice examples",
  "No exposure to real workflows",
  "No debugging of actual failures",
  "No cloud or production experience",
];

const SIMULATION = [
  "Focuses on execution, workflows, and real delivery",
  "Production-scale, real-world pipelines and data",
  "Sprint boards, standups, and engineering delivery cycles",
  "Deliberately introduced failures — you diagnose and fix them",
  "Hands-on with Azure, GCP from day one",
];

export default function VSComparison() {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>
        Traditional Learning vs <br />
        <span>Industry Simulation</span>
      </h2>

      <p className={styles.subtext}>
        See the clear difference between passive learning and real engineering
        experience.
      </p>

      <div className={styles.card}>
        {/* Left Side */}
        <div className={styles.col}>
          <div className={styles.colHeader}>
            <span className={styles.colIcon}>📚</span>
            Traditional Learning
          </div>

          <ul className={styles.list}>
            {TRADITIONAL.map((point) => (
              <li key={point} className={styles.item}>
                <span className={styles.cross}>✕</span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        {/* Center */}
        <div className={styles.divider}>
          <span className={styles.bolt}>⚡</span>
          <span className={styles.vsText}>VS</span>
        </div>

        {/* Right Side */}
        <div className={styles.col}>
          <div className={styles.colHeader}>
            <span className={styles.colIcon}>🏭</span>
            Industry Simulation
          </div>

          <ul className={styles.list}>
            {SIMULATION.map((point) => (
              <li key={point} className={styles.item}>
                <span className={styles.check}>✓</span>
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}