import styles from "./CourseLearning.module.css";

interface Props {
  description: string;
  outcomes: string[];
  hours: number;
  modules: number;
  projects: number;
}

export default function CourseLearning({ description, outcomes, hours, modules, projects }: Props) {
  const stats = [
    { value: `${hours}+`, label: "Hours" },
    { value: `${modules}+`, label: "Modules" },
    { value: `${projects}+`, label: "Projects" },
  ];

  return (
    <section className={styles.section}>
      {/* ── TOP: Learning Outcomes ── */}
      <div className={styles.topBlock}>
        <span className={styles.eyebrow}>LEARNING OUTCOMES</span>
        <h2 className={styles.heading}>
          <span className={styles.underlineWrap}>
            What is This
            <span className={styles.underline}></span>
          </span>{" "}
          <span className={styles.orange}>Course About?</span>
        </h2>
        <p className={styles.subText}>{description}</p>

        {/* Outcome cards grid */}
        <div className={styles.grid}>
          {outcomes.map((text, i) => (
            <div key={i} className={styles.card}>
              <div className={styles.checkWrap}>
                <svg viewBox="0 0 20 20" width="16" height="16" fill="white">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className={styles.cardText}>{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── BOTTOM: Stats ── */}
      <div className={styles.statsBlock}>
        {stats.map((stat, i) => (
          <div key={i} className={styles.statCard}>
            <span className={styles.statValue}>{stat.value}</span>
            <span className={styles.statLabel}>{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
