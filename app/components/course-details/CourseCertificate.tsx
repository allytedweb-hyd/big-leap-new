import styles from "./CourseCertificate.module.css";

const points = [
  "We focus on delivering practical, industry-relevant skills",
  "Receive Expert Mentorship and Evaluation. Get detailed feedback",
  "We focus on delivering practical, industry-relevant skills",
];

export default function CourseCertificate() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>

        {/* ── Top header ── */}
        <div className={styles.topHeader}>
          <span className={styles.eyebrow}>CERTIFICATE</span>
          <h2 className={styles.heading}>
            Get <span className={styles.orange}>Certified</span> with Recognized
            <br />Validation
          </h2>
        </div>

        {/* ── Dark card ── */}
        <div className={styles.card}>

          {/* Left: text */}
          <div className={styles.leftCol}>
            <h3 className={styles.cardTitle}>
              Earn Certificate Of<br />Completion
            </h3>
            <ul className={styles.pointsList}>
              {points.map((point, i) => (
                <li key={i} className={styles.pointItem}>
                  <span className={styles.checkIcon}>
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none"
                      stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: certificate image — no white wrapper, no back card */}
          <div className={styles.rightCol}>
            <div className={styles.certDirect}>
              <img
                src="/assets/images/certificate.png"
                alt="Certificate of Completion"
                className={styles.certImg}
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}