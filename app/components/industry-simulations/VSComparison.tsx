"use client";
import styles from "./VSComparison.module.css";

const POINTS = [
  "Focuses mainly on concepts only",
  "Small, isolated practice examples",
  "No exposure to real workflows",
  "No debugging of actual failures",
  "No cloud or production experience",
];

export default function VSComparison() {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>
        Traditional Learning vs <br />
        <span>Industry Simulation</span>
      </h2>
      <p className={styles.subtext}>
        See the clear difference between passive learning and real
        engineering experience.
      </p>

      <div className={styles.card}>
        {/* LEFT — Traditional */}
        <div className={styles.col}>
          <div className={styles.colHeader}>
            <span className={styles.colIcon}>📚</span>
            Traditional Learning
          </div>
          <ul className={styles.list}>
            {POINTS.map((p) => (
              <li key={p} className={styles.item}>
                <div className={styles.cross}>✕</div>
                {p}
              </li>
            ))}
          </ul>
        </div>

        {/* CENTER divider */}
        <div className={styles.divider}>
          <span className={styles.bolt}>⚡</span>
          <span className={styles.vsText}>VS</span>
        </div>

        {/* RIGHT — Industry Simulation */}
        <div className={styles.col}>
          <div className={styles.colHeader}>
            <span className={styles.colIcon}>🏭</span>
            Industry Simulation
          </div>
          <ul className={styles.list}>
            {POINTS.map((p) => (
              <li key={p} className={styles.item}>
                <span className={styles.check}>✓</span>
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}