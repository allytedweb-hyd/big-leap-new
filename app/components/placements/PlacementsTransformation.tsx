"use client";
import styles from "./PlacementsTransformation.module.css";
import { scrollToContact } from "../../utils/scrollToContact";

const beforeItems = [
  "Confused applicant",
  "Random preparation",
  "Just learning",
  "Hoping in interviews",
  "Apply → Reject → Repeat",
];

const afterItems = [
  "Confident candidate",
  "Structured execution",
  "Actively performing",
  "Knowing what you're doing",
  "Prepare → Improve → Crack",
];

const identityPoints = [
  {
    bold: "Built",
    rest: " real data pipelines",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  {
    bold: "Worked",
    rest: " on cloud systems",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
  },
  {
    bold: "Handled",
    rest: " debugging & failures",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    bold: "Understands",
    rest: " real workflows",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />
      </svg>
    ),
  },
];

export default function PlacementsTransformation() {
  return (
    <section className={styles.section}>
      <div className={styles.blobLeft} />
      <div className={styles.blobRight} />

      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.heading}>
          Your <span className={styles.highlight}>Transformation</span>
        </h2>
        <p className={styles.subtext}>
          This is the shift that happens when you stop waiting
          <br />
          and start executing while learning.
        </p>
      </div>

      {/* Big quote */}
      <div className={styles.quote}>
        <p className={styles.quoteLine}>
          You don't go into interviews <em>hoping.</em>
          <br />
          You go in <em>knowing exactly what you are doing.</em>
        </p>
        <div className={styles.quoteBar} />
      </div>

      {/* Before / After */}
      <div className={styles.cols}>
        {/* Before */}
        <div className={styles.panelBefore}>
          <div className={styles.panelHeader}>
            <span className={styles.tagBefore}>✕ &nbsp;Before</span>
          </div>
          {beforeItems.map((item, i) => (
            <div key={i} className={styles.beforeItem}>
              <div className={styles.beforeBullet} />
              <span className={styles.beforeText}>{item}</span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className={styles.mid}>
          <div className={styles.midLine} />
          <div className={styles.midCircle}>→</div>
          <div className={styles.midLine} />
        </div>

        {/* After */}
        <div className={styles.panelAfter}>
          <div className={styles.panelHeader}>
            <span className={styles.tagAfter}>✓ &nbsp;After</span>
          </div>
          {afterItems.map((item, i) => (
            <div key={i} className={styles.afterItem}>
              <div className={styles.afterBullet} />
              <span className={styles.afterText}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Identity strip */}
      <div className={styles.strip}>
        <p className={styles.stripTitle}>
          You apply as someone who has already —
        </p>
        <div className={styles.stripGrid}>
          {identityPoints.map((p, i) => (
            <div key={i} className={styles.stripItem}>
              <div className={styles.stripIcon}>{p.icon}</div>
              <div className={styles.stripText}>
                <strong>{p.bold}</strong>
                {p.rest}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className={styles.cta}>
        <span className={styles.ctaBadge}>Start Now</span>
        <h3 className={styles.ctaHeading}>Don't wait to "feel ready".</h3>
        <p className={styles.ctaSub}>
          <em>Get ready while you are already applying.</em>
          <br />
          We build your capability, confidence, and preparation
          <br />
          to maximize your chances of getting selected.
        </p>
        <div className={styles.btns}>
          <button className={styles.btnPrimary} onClick={scrollToContact}>
            Join Free Workshop
            <span className={styles.btnArrow}>→</span>
          </button>
          <button className={styles.btnSecondary} onClick={scrollToContact}>
            Start Industry Experience Program ↗
          </button>
        </div>
      </div>

      <p className={styles.note}>
        * We do not guarantee placements. Results depend on individual effort
        and preparation.
      </p>
    </section>
  );
}