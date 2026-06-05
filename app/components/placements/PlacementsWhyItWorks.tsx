"use client";
import styles from "./PlacementsWhyItWorks.module.css";

const reasons = [
  {
    id: "01",
    title: "Companies don't hire certificates",
    desc: "They hire people who can build, explain, and solve. That's exactly what you train for — not theory, not shortcuts.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
        <line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/>
      </svg>
    ),
  },
  {
    id: "02",
    title: "You apply while building",
    desc: "Most programs make you wait until you finish. Here you enter real hiring pipelines while you are still training. No waiting.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
    ),
  },
  {
    id: "03",
    title: "Every rejection makes you sharper",
    desc: "You don't guess what went wrong. The feedback loop kicks in after every attempt — fixing gaps, not repeating mistakes.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
        <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
      </svg>
    ),
  },
  {
    id: "04",
    title: "You stop looking like a fresher",
    desc: "You walk into interviews having built real pipelines, worked on cloud systems, and handled real debugging — not just watched tutorials.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
  {
    id: "05",
    title: "Structure beats motivation",
    desc: "Motivation fades. A system doesn't. Job tracking, guided applications, mock interviews — everything runs on a repeatable structure.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
      </svg>
    ),
  },
  {
    id: "06",
    title: "Parallel execution, not sequential",
    desc: "Learn → Apply → Improve all happen at the same time. You don't finish one and start the next. That's what makes this different.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
        <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
        <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
      </svg>
    ),
  },
];

export default function PlacementsWhyItWorks() {
  return (
    <section className={styles.section}>
      <div className={styles.blobLeft} />
      <div className={styles.blobRight} />

      <div className={styles.header}>
        <h2 className={styles.heading}>
          Why This <span className={styles.highlight}>Actually Works</span>
        </h2>
        <p className={styles.subtext}>
          Not motivation. Not luck. A system built around
          <br />
          how hiring actually happens.
        </p>
      </div>

      <div className={styles.grid}>
        {reasons.map((r) => (
          <div key={r.id} className={styles.card}>
            <div className={styles.cardTop}>
              <div className={styles.iconWrap}>{r.icon}</div>
              <span className={styles.num}>{r.id}</span>
            </div>
            <h3 className={styles.cardTitle}>{r.title}</h3>
            <p className={styles.cardDesc}>{r.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}