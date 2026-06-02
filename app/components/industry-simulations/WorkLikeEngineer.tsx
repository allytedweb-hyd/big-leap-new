import styles from "./WorkLikeEngineer.module.css";

const POINTS = [
  "End-to-end pipeline development using Spark, Kafka & Airflow",
  "Real-world debugging and performance optimization tasks",
  "Cloud platform exposure — Azure, GCP",
  "Sprint-style collaboration mimicking FAANG team workflows",
  "Production-grade thinking: scalability, monitoring & delivery",
];

export default function WorkLikeEngineer() {
  return (
    <section className={styles.section}>

      {/* LEFT — image card */}
      <div className={styles.imageWrap}>
        <img
          src="/assets/images/Engineer-work.png"
          alt="Student working like a real engineer"
          className={styles.image}
        />

        {/* 100% badge */}
        <div className={styles.badge}>
          <span className={styles.badgePercent}>100%</span>
          <span className={styles.badgeLabel}>Practical Work</span>
        </div>

        {/* Bottom pill */}
        <div className={styles.bottomLabel}>Real Engineering Environment</div>
      </div>

      {/* RIGHT — content */}
      <div className={styles.content}>
        <h2 className={styles.heading}>
          Don't Just <br />
          Learn — <br />
          <span>Work Like an Engineer</span>
        </h2>

        <p className={styles.subtext}>
          Instead of theory alone, students build real workflows, develop live
          pipelines, debug actual failures, and solve cloud-based engineering
          challenges using modern industry tools.
        </p>

        <ul className={styles.list}>
          {POINTS.map((point) => (
            <li key={point} className={styles.listItem}>
              <span className={styles.checkIcon}>✓</span>
              {point}
            </li>
          ))}
        </ul>
      </div>

    </section>
  );
}