import styles from "./PlacementsSystem.module.css";

const pillars = [
  {
    id: "01",
    title: "Job Tracking Engine",
    desc: "Daily updates of real hiring drives sent directly to you. Never miss a live opportunity.",
    tags: ["TCS", "Infosys", "Accenture", "Startups"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12h4l3 8 4-16 3 8h4"/>
      </svg>
    ),
  },
  {
    id: "02",
    title: "Application Strategy",
    desc: "You don't randomly apply. You apply with company-specific guidance every single time.",
    tags: ["Targeted", "Guided", "Strategic"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
      </svg>
    ),
  },
  {
    id: "03",
    title: "Resume That Gets Shortlisted",
    desc: "Built around real projects, pipelines, and skills companies actually screen for.",
    tags: ["Real Projects", "Pipelines", "ATS-Ready"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
      </svg>
    ),
  },
  {
    id: "04",
    title: "Test Cracking System",
    desc: "Structured prep for every assessment type companies throw at you.",
    tags: ["Aptitude", "SQL", "Coding", "Company Tests"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
    ),
  },
  {
    id: "05",
    title: "Interview Execution Training",
    desc: "Real technical questions, pipeline explanations, scenario problems, and HR handling.",
    tags: ["Technical", "Scenario", "HR Round"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
  },
  {
    id: "06",
    title: "Continuous Feedback Loop",
    desc: "You don't guess what went wrong. You improve after every attempt with structured feedback.",
    tags: ["Post-attempt", "Structured", "Improve Fast"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
        <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
      </svg>
    ),
  },
];

export default function PlacementsSystem() {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.heading}>
          Your <span className={styles.highlight}>Complete System</span>
        </h2>
        <p className={styles.subtext}>
          Not just training — a parallel execution engine
          <br />
          that runs while you are still learning.
        </p>
      </div>

      <div className={styles.grid}>
        {pillars.map((p) => (
          <div key={p.id} className={styles.card}>
            <span className={styles.cardNum}>{p.id}</span>
            <div className={styles.icon}>{p.icon}</div>
            <h3 className={styles.cardTitle}>{p.title}</h3>
            <p className={styles.cardDesc}>{p.desc}</p>
            <div className={styles.tags}>
              {p.tags.map((t) => (
                <span key={t} className={styles.tag}>{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}